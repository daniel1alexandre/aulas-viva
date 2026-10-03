import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_SEED_DATA } from '../data/initialSeedData';
import { SCHEMA_DEFINITIONS } from '../data/schemaDefinitions';
import { generateId } from '../utils/formatters';

const STORAGE_KEY = 'viva_by_baumann_management_db_v1';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure all tables exist in stored data
        const merged = { ...INITIAL_SEED_DATA };
        for (const key of Object.keys(INITIAL_SEED_DATA)) {
          if (parsed[key] && Array.isArray(parsed[key])) {
            merged[key] = parsed[key];
          }
        }
        return merged;
      }
    } catch (e) {
      console.error('Error loading stored database:', e);
    }
    return INITIAL_SEED_DATA;
  });

  const [toasts, setToasts] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');

  // Persist to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving database to localStorage:', e);
    }
  }, [data]);

  // Toast notification helper
  const addToast = (message, type = 'info', duration = 3500) => {
    const id = generateId();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // CRUD Generic Methods
  const getTableData = (tableName) => {
    return data[tableName] || [];
  };

  const addItem = (tableName, item) => {
    setData(prev => ({
      ...prev,
      [tableName]: [item, ...(prev[tableName] || [])]
    }));
    addToast(`Item adicionado em ${tableName}!`, 'success');
  };

  const updateItem = (tableName, idKey, idValue, updatedFields) => {
    setData(prev => ({
      ...prev,
      [tableName]: (prev[tableName] || []).map(row => 
        row[idKey] === idValue ? { ...row, ...updatedFields } : row
      )
    }));
    addToast(`Registro atualizado com sucesso!`, 'success');
  };

  const deleteItem = (tableName, idKey, idValue) => {
    setData(prev => ({
      ...prev,
      [tableName]: (prev[tableName] || []).filter(row => row[idKey] !== idValue)
    }));
    addToast(`Item excluído com sucesso!`, 'info');
  };

  // Kanban status updater
  const updateCardStatus = (tableName, idKey, idValue, newStatus) => {
    setData(prev => ({
      ...prev,
      [tableName]: (prev[tableName] || []).map(card => {
        if (card[idKey] === idValue) {
          const updated = { ...card, status_card: newStatus };
          // If paying, automatically set settlement date if applicable
          if (newStatus === 'PAGO') {
            const todayStr = new Date().toISOString().split('T')[0];
            if ('data_liquidacao' in card) updated.data_liquidacao = todayStr;
            if ('data_recebimento' in card) updated.data_recebimento = todayStr;
          }
          return updated;
        }
        return card;
      })
    }));
    addToast(`Status alterado para "${newStatus}"`, 'info');
  };

  // Business Action: Point of Sale (PDV) checkout
  const finalizeSale = ({ cartItems, customerId, customerName, paymentMethod, discount = 0 }) => {
    if (!cartItems || cartItems.length === 0) {
      addToast('O carrinho está vazio!', 'warning');
      return null;
    }

    const idVenda = 'vd_' + Date.now().toString(36);
    const now = new Date();
    const dateFormatted = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);

    const subtotal = cartItems.reduce((acc, it) => acc + (it.preco_venda * it.quantidade), 0);
    const finalTotal = Math.max(0, subtotal - discount);

    const newSale = {
      id_venda: idVenda,
      data_venda: dateFormatted,
      id_cliente_aluno: customerId || '',
      valor_total: finalTotal,
      forma_pagamento: paymentMethod,
      status_venda: 'FINALIZADA'
    };

    const newSaleItems = cartItems.map(item => ({
      id_item_venda: 'itv_' + generateId(),
      id_venda: idVenda,
      id_item: item.id_item,
      quantidade: item.quantidade,
      preco_unitario: item.preco_venda
    }));

    const stockMovements = [];
    const updatedProducts = (data.ProdutosServicos || []).map(prod => {
      const sold = cartItems.find(c => c.id_item === prod.id_item);
      if (sold && prod.tipo === 'PRODUTO') {
        const newQty = Math.max(0, (prod.estoque_atual || 0) - sold.quantidade);
        stockMovements.push({
          id_movimento: 'mov_' + generateId(),
          id_item: prod.id_item,
          tipo_movimento: 'SAIDA',
          quantidade: sold.quantidade,
          data_hora: dateFormatted,
          documento_origem: `Venda #${idVenda}`
        });
        return { ...prod, estoque_atual: newQty };
      }
      return prod;
    });

    let newContasReceber = null;
    if (paymentMethod === 'PRAZO') {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 15);
      newContasReceber = {
        id_conta_receber: 'cr_' + generateId(),
        id_venda: idVenda,
        devedor_nome: customerName || 'Aluno / Cliente Cadastrado',
        valor_devido: finalTotal,
        data_vencimento: dueDate.toISOString().slice(0, 10),
        data_recebimento: '',
        status_card: 'ABERTO'
      };
    }

    setData(prev => ({
      ...prev,
      Vendas: [newSale, ...(prev.Vendas || [])],
      ItensVenda: [...newSaleItems, ...(prev.ItensVenda || [])],
      ProdutosServicos: updatedProducts,
      MovimentacoesEstoque: [...stockMovements, ...(prev.MovimentacoesEstoque || [])],
      ContasReceberBar: newContasReceber 
        ? [newContasReceber, ...(prev.ContasReceberBar || [])] 
        : (prev.ContasReceberBar || [])
    }));

    addToast(`Venda #${idVenda} finalizada com sucesso!`, 'success');
    return newSale;
  };

  // Business Action: Open Comanda (Tab) to pay at end of day
  const openComanda = ({ numeroComanda, clienteNome, idClienteAluno, cartItems = [], observacoes = '' }) => {
    const idVenda = 'vd_comanda_' + Date.now().toString(36);
    const now = new Date();
    const dateFormatted = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);

    const subtotal = cartItems.reduce((acc, it) => acc + (it.preco_venda * it.quantidade), 0);

    const newSale = {
      id_venda: idVenda,
      numero_comanda: numeroComanda || `Comanda #${Math.floor(10 + Math.random() * 90)}`,
      cliente_nome: clienteNome || 'Cliente / Atleta',
      data_venda: dateFormatted,
      id_cliente_aluno: idClienteAluno || '',
      valor_total: subtotal,
      forma_pagamento: '',
      status_venda: 'AGUARDANDO_PAGAMENTO',
      observacoes: observacoes || ''
    };

    const newSaleItems = cartItems.map(item => ({
      id_item_venda: 'itv_' + generateId(),
      id_venda: idVenda,
      id_item: item.id_item,
      quantidade: item.quantidade,
      preco_unitario: item.preco_venda
    }));

    const stockMovements = [];
    const updatedProducts = (data.ProdutosServicos || []).map(prod => {
      const sold = cartItems.find(c => c.id_item === prod.id_item);
      if (sold && prod.tipo === 'PRODUTO') {
        const newQty = Math.max(0, (prod.estoque_atual || 0) - sold.quantidade);
        stockMovements.push({
          id_movimento: 'mov_' + generateId(),
          id_item: prod.id_item,
          tipo_movimento: 'SAIDA',
          quantidade: sold.quantidade,
          data_hora: dateFormatted,
          documento_origem: `Comanda ${newSale.numero_comanda}`
        });
        return { ...prod, estoque_atual: newQty };
      }
      return prod;
    });

    setData(prev => ({
      ...prev,
      Vendas: [newSale, ...(prev.Vendas || [])],
      ItensVenda: [...newSaleItems, ...(prev.ItensVenda || [])],
      ProdutosServicos: updatedProducts,
      MovimentacoesEstoque: [...stockMovements, ...(prev.MovimentacoesEstoque || [])]
    }));

    addToast(`${newSale.numero_comanda} aberta com sucesso!`, 'success');
    return newSale;
  };

  // Add items to an existing open comanda
  const addItemsToComanda = (idVenda, newItems) => {
    if (!newItems || newItems.length === 0) return;

    const now = new Date();
    const dateFormatted = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);
    const comanda = (data.Vendas || []).find(v => v.id_venda === idVenda);
    const comandaName = comanda ? comanda.numero_comanda : idVenda;

    const createdItems = newItems.map(item => ({
      id_item_venda: 'itv_' + generateId(),
      id_venda: idVenda,
      id_item: item.id_item,
      quantidade: item.quantidade,
      preco_unitario: item.preco_venda
    }));

    const addedTotal = newItems.reduce((acc, it) => acc + (it.preco_venda * it.quantidade), 0);

    const stockMovements = [];
    const updatedProducts = (data.ProdutosServicos || []).map(prod => {
      const sold = newItems.find(c => c.id_item === prod.id_item);
      if (sold && prod.tipo === 'PRODUTO') {
        const newQty = Math.max(0, (prod.estoque_atual || 0) - sold.quantidade);
        stockMovements.push({
          id_movimento: 'mov_' + generateId(),
          id_item: prod.id_item,
          tipo_movimento: 'SAIDA',
          quantidade: sold.quantidade,
          data_hora: dateFormatted,
          documento_origem: `Comanda ${comandaName}`
        });
        return { ...prod, estoque_atual: newQty };
      }
      return prod;
    });

    setData(prev => ({
      ...prev,
      Vendas: (prev.Vendas || []).map(v => 
        v.id_venda === idVenda 
          ? { ...v, valor_total: Number(((v.valor_total || 0) + addedTotal).toFixed(2)) } 
          : v
      ),
      ItensVenda: [...createdItems, ...(prev.ItensVenda || [])],
      ProdutosServicos: updatedProducts,
      MovimentacoesEstoque: [...stockMovements, ...(prev.MovimentacoesEstoque || [])]
    }));

    addToast(`Itens adicionados à ${comandaName}!`, 'success');
  };

  // Remove single item from comanda
  const removeItemFromComanda = (idItemVenda, idVenda) => {
    const itemToRemove = (data.ItensVenda || []).find(i => i.id_item_venda === idItemVenda);
    if (!itemToRemove) return;

    const valToSubtract = (itemToRemove.preco_unitario || 0) * (itemToRemove.quantidade || 1);

    const updatedProducts = (data.ProdutosServicos || []).map(p => {
      if (p.id_item === itemToRemove.id_item && p.tipo === 'PRODUTO') {
        return { ...p, estoque_atual: (p.estoque_atual || 0) + itemToRemove.quantidade };
      }
      return p;
    });

    setData(prev => ({
      ...prev,
      ItensVenda: (prev.ItensVenda || []).filter(i => i.id_item_venda !== idItemVenda),
      Vendas: (prev.Vendas || []).map(v => 
        v.id_venda === idVenda 
          ? { ...v, valor_total: Math.max(0, Number(((v.valor_total || 0) - valToSubtract).toFixed(2))) }
          : v
      ),
      ProdutosServicos: updatedProducts
    }));

    addToast('Item removido da comanda e estoque estornado.', 'info');
  };

  // Close and pay comanda
  const closeAndPayComanda = ({ idVenda, paymentMethod, discount = 0, customerName }) => {
    const comanda = (data.Vendas || []).find(v => v.id_venda === idVenda);
    if (!comanda) return;

    const finalTotal = Math.max(0, comanda.valor_total - Number(discount || 0));

    let newContasReceber = null;
    if (paymentMethod === 'PRAZO') {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 15);
      newContasReceber = {
        id_conta_receber: 'cr_' + generateId(),
        id_venda: idVenda,
        devedor_nome: customerName || comanda.cliente_nome || 'Aluno / Cliente',
        valor_devido: finalTotal,
        data_vencimento: dueDate.toISOString().slice(0, 10),
        data_recebimento: '',
        status_card: 'ABERTO'
      };
    }

    setData(prev => ({
      ...prev,
      Vendas: (prev.Vendas || []).map(v => 
        v.id_venda === idVenda 
          ? { 
              ...v, 
              status_venda: 'FINALIZADA', 
              forma_pagamento: paymentMethod, 
              valor_total: finalTotal,
              cliente_nome: customerName || v.cliente_nome 
            } 
          : v
      ),
      ContasReceberBar: newContasReceber 
        ? [newContasReceber, ...(prev.ContasReceberBar || [])] 
        : (prev.ContasReceberBar || [])
    }));

    addToast(`${comanda.numero_comanda || 'Comanda'} paga e fechada com sucesso!`, 'success');
  };

  // Cancel comanda
  const cancelComanda = (idVenda) => {
    setData(prev => {
      const itemsToRestore = (prev.ItensVenda || []).filter(i => i.id_venda === idVenda);
      const restoredProducts = (prev.ProdutosServicos || []).map(p => {
        const itemSold = itemsToRestore.find(i => i.id_item === p.id_item);
        if (itemSold && p.tipo === 'PRODUTO') {
          return { ...p, estoque_atual: (p.estoque_atual || 0) + itemSold.quantidade };
        }
        return p;
      });

      return {
        ...prev,
        Vendas: (prev.Vendas || []).map(v => 
          v.id_venda === idVenda ? { ...v, status_venda: 'CANCELADA' } : v
        ),
        ProdutosServicos: restoredProducts
      };
    });
    addToast('Comanda cancelada e estoque estornado.', 'info');
  };

  // Business Action: Register Incoming Invoice (NF-e)
  const registerInvoice = ({ invoice, items }) => {
    const idNota = 'nf_' + Date.now().toString(36);
    const dateFormatted = new Date().toISOString().slice(0, 10);

    const newInvoice = {
      ...invoice,
      id_nota: idNota
    };

    const newItems = items.map(it => ({
      ...it,
      id_item_nota: 'itn_' + generateId(),
      id_nota: idNota
    }));

    const stockMovements = [];
    const updatedProducts = (data.ProdutosServicos || []).map(prod => {
      const added = items.find(i => i.id_item === prod.id_item);
      if (added) {
        const newQty = (prod.estoque_atual || 0) + Number(added.quantidade || 0);
        stockMovements.push({
          id_movimento: 'mov_' + generateId(),
          id_item: prod.id_item,
          tipo_movimento: 'ENTRADA',
          quantidade: Number(added.quantidade),
          data_hora: dateFormatted,
          documento_origem: `NF ${invoice.numero_nf}`
        });
        return {
          ...prod,
          estoque_atual: newQty,
          preco_custo: Number(added.valor_unitario) || prod.preco_custo
        };
      }
      return prod;
    });

    const newPayable = {
      id_conta_pagar: 'cp_' + generateId(),
      descricao: `NF-e ${invoice.numero_nf} - ${invoice.fornecedor_nome}`,
      id_nota: idNota,
      valor_devido: Number(invoice.valor_total_nf),
      data_vencimento: invoice.data_vencimento || dateFormatted,
      data_liquidacao: '',
      status_card: 'ABERTO'
    };

    setData(prev => ({
      ...prev,
      NotasFiscais: [newInvoice, ...(prev.NotasFiscais || [])],
      ItensNota: [...newItems, ...(prev.ItensNota || [])],
      ProdutosServicos: updatedProducts,
      MovimentacoesEstoque: [...stockMovements, ...(prev.MovimentacoesEstoque || [])],
      ContasPagarBar: [newPayable, ...(prev.ContasPagarBar || [])]
    }));

    addToast(`Nota Fiscal e Conta a Pagar geradas com sucesso!`, 'success');
  };

  // Business Action: Student Payment and Coach Commission Unlock
  const payParcela = (id_parcela) => {
    setData(prev => {
      const updatedParcelas = (prev.ParcelasAluno || []).map(p => {
        if (p.id_parcela === id_parcela) {
          return { ...p, status_parcela: 'PAGA' };
        }
        return p;
      });

      // Find if there is a commission for this parcela
      const updatedComissoes = (prev.Comissoes || []).map(c => {
        if (c.id_parcela === id_parcela && c.status_repasse === 'PROVISIONADA') {
          return { ...c, status_repasse: 'LIBERADA' };
        }
        return c;
      });

      return {
        ...prev,
        ParcelasAluno: updatedParcelas,
        Comissoes: updatedComissoes
      };
    });

    addToast('Mensalidade recebida! Comissão do professor LIBERADA.', 'success');
  };

  // Business Action: Settle coach commission
  const settleComissao = (id_comissao) => {
    setData(prev => ({
      ...prev,
      Comissoes: (prev.Comissoes || []).map(c => 
        c.id_comissao === id_comissao ? { ...c, status_repasse: 'PAGA' } : c
      )
    }));
    addToast('Comissão paga ao professor!', 'success');
  };

  // Reset database to initial seed state
  const resetToDefaultData = () => {
    if (window.confirm('Tem certeza de que deseja restaurar os dados originais? Todas as alterações serão redefinidas para o modelo padrão da planilha.')) {
      setData(INITIAL_SEED_DATA);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_DATA));
      addToast('Banco de dados restaurado para os dados padrão!', 'info');
    }
  };

  // Export full DB to JSON
  const exportAllToJson = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Viva_By_Baumann_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Backup JSON exportado com sucesso!', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        data,
        activeTab,
        setActiveTab,
        globalSearch,
        setGlobalSearch,
        toasts,
        addToast,
        removeToast,
        getTableData,
        addItem,
        updateItem,
        deleteItem,
        updateCardStatus,
        finalizeSale,
        openComanda,
        addItemsToComanda,
        removeItemFromComanda,
        closeAndPayComanda,
        cancelComanda,
        registerInvoice,
        payParcela,
        settleComissao,
        resetToDefaultData,
        exportAllToJson,
        schema: SCHEMA_DEFINITIONS
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
