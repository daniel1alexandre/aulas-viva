import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { formatBRL, formatDateTime, formatCPF } from '../../utils/formatters';
import confetti from 'canvas-confetti';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  DollarSign, 
  Trash2, 
  CreditCard, 
  Clock, 
  User, 
  Utensils, 
  AlertCircle, 
  CheckCircle,
  PlusCircle,
  Receipt,
  Sparkles
} from 'lucide-react';

export const ComandasAbertasScreen = () => {
  const { 
    getTableData, 
    openComanda, 
    addItemsToComanda, 
    removeItemFromComanda, 
    closeAndPayComanda, 
    cancelComanda,
    addToast 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isOpenNewModal, setIsOpenNewModal] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [activeComanda, setActiveComanda] = useState(null);

  // New Comanda form state
  const [newComandaForm, setNewComandaForm] = useState({
    numeroComanda: '',
    clienteNome: '',
    idClienteAluno: '',
    observacoes: ''
  });
  const [newComandaItems, setNewComandaItems] = useState([]);

  // Add Item to existing Comanda state
  const [itemToAdd, setItemToAdd] = useState({
    id_item: '',
    quantidade: 1
  });

  // Pay Comanda form state
  const [payForm, setPayForm] = useState({
    paymentMethod: 'PIX',
    discount: 0,
    customerName: ''
  });

  const sales = getTableData('Vendas') || [];
  const saleItems = getTableData('ItensVenda') || [];
  const products = getTableData('ProdutosServicos') || [];
  const students = getTableData('Alunos') || [];

  // Filter only open comandas (status_venda === 'AGUARDANDO_PAGAMENTO')
  const openComandas = sales.filter(v => v.status_venda === 'AGUARDANDO_PAGAMENTO');

  const filteredComandas = openComandas.filter(c => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    const matchNum = (c.numero_comanda || '').toLowerCase().includes(q);
    const matchCli = (c.cliente_nome || '').toLowerCase().includes(q);
    const matchObs = (c.observacoes || '').toLowerCase().includes(q);
    return matchNum || matchCli || matchObs;
  });

  const totalOpenValue = openComandas.reduce((sum, c) => sum + (c.valor_total || 0), 0);

  // --- Handlers for Open New Comanda ---
  const handleOpenNewComandaModal = () => {
    setNewComandaForm({
      numeroComanda: `Comanda #${Math.floor(10 + Math.random() * 90)}`,
      clienteNome: '',
      idClienteAluno: '',
      observacoes: ''
    });
    setNewComandaItems([]);
    setIsOpenNewModal(true);
  };

  const handleAddItemToNewList = (product) => {
    setNewComandaItems(prev => {
      const existing = prev.find(i => i.id_item === product.id_item);
      if (existing) {
        return prev.map(i => i.id_item === product.id_item ? { ...i, quantidade: i.quantidade + 1 } : i);
      }
      return [...prev, { ...product, quantidade: 1 }];
    });
  };

  const handleCreateComanda = (e) => {
    e.preventDefault();
    if (!newComandaForm.numeroComanda) {
      alert('Informe o número ou identificador da comanda!');
      return;
    }

    const studentObj = students.find(s => s.id_aluno === newComandaForm.idClienteAluno);
    const finalClientName = newComandaForm.clienteNome || (studentObj ? studentObj.nome_completo : 'Cliente / Atleta');

    openComanda({
      numeroComanda: newComandaForm.numeroComanda,
      clienteNome: finalClientName,
      idClienteAluno: newComandaForm.idClienteAluno,
      cartItems: newComandaItems,
      observacoes: newComandaForm.observacoes
    });

    setIsOpenNewModal(false);
  };

  // --- Handlers for Adding Items to Existing Comanda ---
  const handleOpenAddItemModal = (comanda) => {
    setActiveComanda(comanda);
    const firstProd = products.find(p => p.tipo === 'PRODUTO') || products[0];
    setItemToAdd({
      id_item: firstProd?.id_item || '',
      quantidade: 1
    });
    setIsAddItemModalOpen(true);
  };

  const handleConfirmAddItems = (e) => {
    e.preventDefault();
    if (!activeComanda || !itemToAdd.id_item) return;

    const prod = products.find(p => p.id_item === itemToAdd.id_item);
    if (!prod) return;

    addItemsToComanda(activeComanda.id_venda, [{
      ...prod,
      quantidade: Number(itemToAdd.quantidade) || 1
    }]);

    setIsAddItemModalOpen(false);
  };

  // --- Handlers for Pay & Close Comanda ---
  const handleOpenPayModal = (comanda) => {
    setActiveComanda(comanda);
    setPayForm({
      paymentMethod: 'PIX',
      discount: 0,
      customerName: comanda.cliente_nome || ''
    });
    setIsPayModalOpen(true);
  };

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    if (!activeComanda) return;

    if (payForm.paymentMethod === 'PRAZO' && !activeComanda.id_cliente_aluno && !payForm.customerName) {
      alert('Para fechar no PRAZO, informe o nome do responsável.');
      return;
    }

    closeAndPayComanda({
      idVenda: activeComanda.id_venda,
      paymentMethod: payForm.paymentMethod,
      discount: Number(payForm.discount) || 0,
      customerName: payForm.customerName
    });

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}

    setIsPayModalOpen(false);
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: '1700px' }}>
      
      {/* Top Header & Metrics */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
            <Clock size={13} /> Pagar ao Final do Dia • Consumo Aberto
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <ClipboardList size={26} style={{ color: '#f59e0b' }} />
            Comandas Abertas no Bar
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0' }}>
            Tela exclusiva para visualização, lançamento contínuo de itens e encerramento de comandas em aberto.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Total Accumulated in Open Tabs */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(17, 24, 39, 0.8))',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '12px',
            padding: '8px 18px',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase' }}>
              Total em Aberto ({openComandas.length} Comandas)
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.35rem', fontWeight: 900, color: '#fff' }}>
              {formatBRL(totalOpenValue)}
            </div>
          </div>

          <button onClick={handleOpenNewComandaModal} className="btn btn-primary btn-lg" style={{ gap: '8px' }}>
            <Plus size={18} />
            <span>Abrir Nova Comanda</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="glass-panel" style={{ padding: '14px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#1e293b',
            padding: '8px 16px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.08)',
            flex: 1,
            maxWidth: '450px'
          }}>
            <Search size={16} style={{ color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Buscar comanda (Ex: Comanda #07, Gabriel, Quadra 3)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Exibindo <strong>{filteredComandas.length}</strong> de {openComandas.length} comanda(s) ativa(s)
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredComandas.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <ClipboardList size={48} style={{ color: '#64748b', margin: '0 auto 16px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>
            Nenhuma comanda aberta no momento
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto 20px' }}>
            Todas as comandas foram encerradas e pagas. Clique no botão abaixo para abrir uma nova comanda para um cliente ou atleta.
          </p>
          <button onClick={handleOpenNewComandaModal} className="btn btn-primary">
            <Plus size={16} /> Abrir Nova Comanda
          </button>
        </div>
      ) : (
        /* Open Comandas Grid */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '20px'
        }}>
          {filteredComandas.map(comanda => {
            const items = saleItems.filter(i => i.id_venda === comanda.id_venda);
            const totalItemsCount = items.reduce((sum, i) => sum + i.quantidade, 0);

            return (
              <div
                key={comanda.id_venda}
                className="glass-panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: '4px solid #f59e0b',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.35)'
                }}
              >
                {/* Comanda Header */}
                <div>
                  <div style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 900,
                          fontSize: '1.25rem',
                          color: '#fff'
                        }}>
                          {comanda.numero_comanda || `#${comanda.id_venda.slice(-4)}`}
                        </span>
                        <span style={{
                          backgroundColor: 'rgba(245, 158, 11, 0.15)',
                          color: '#fbbf24',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          fontSize: '0.65rem',
                          fontWeight: 800
                        }}>
                          ABERTA
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Clock size={12} /> Aberta em: {comanda.data_venda}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm(`Deseja cancelar a ${comanda.numero_comanda}? Os itens retornarão ao estoque.`)) {
                          cancelComanda(comanda.id_venda);
                        }
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      title="Cancelar Comanda"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Customer & Location */}
                  <div style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>
                      <User size={15} style={{ color: '#06b6d4' }} />
                      <span>{comanda.cliente_nome || 'Cliente / Atleta'}</span>
                    </div>
                    {comanda.observacoes && (
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', fontStyle: 'italic' }}>
                        {comanda.observacoes}
                      </div>
                    )}
                  </div>

                  {/* Consumed Items List */}
                  <div style={{ padding: '16px 20px', maxHeight: '220px', overflowY: 'auto' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Itens Consumidos ({totalItemsCount}):
                    </div>

                    {items.length === 0 ? (
                      <div style={{ color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic', padding: '12px 0' }}>
                        Nenhum item lançado ainda.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {items.map(item => {
                          const prod = products.find(p => p.id_item === item.id_item);
                          return (
                            <div
                              key={item.id_item_venda}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: '0.825rem',
                                padding: '6px 8px',
                                borderRadius: '6px',
                                backgroundColor: 'rgba(255,255,255,0.03)'
                              }}
                            >
                              <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                                <div style={{ color: '#fff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {prod ? prod.nome_item : item.id_item}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                  {item.quantidade}x {formatBRL(item.preco_unitario)}
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#e2e8f0' }}>
                                  {formatBRL(item.quantidade * item.preco_unitario)}
                                </span>
                                <button
                                  onClick={() => removeItemFromComanda(item.id_item_venda, comanda.id_venda)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    padding: '2px'
                                  }}
                                  title="Remover este item"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Comanda Total & Action Buttons */}
                <div style={{
                  padding: '16px 20px',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  backgroundColor: 'rgba(0,0,0,0.15)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8' }}>VALOR ACUMULADO:</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.45rem', fontWeight: 900, color: '#f59e0b' }}>
                      {formatBRL(comanda.valor_total)}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenAddItemModal(comanda)}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '4px' }}
                    >
                      <PlusCircle size={14} />
                      <span>+ Adicionar</span>
                    </button>

                    <button
                      onClick={() => handleOpenPayModal(comanda)}
                      className="btn btn-primary btn-sm"
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        borderColor: '#059669',
                        gap: '6px',
                        fontWeight: 700
                      }}
                    >
                      <CreditCard size={15} />
                      <span>Fechar & Pagar</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: Abrir Nova Comanda */}
      <Modal
        isOpen={isOpenNewModal}
        onClose={() => setIsOpenNewModal(false)}
        title="Abrir Nova Comanda para Consumo no Local"
        maxWidth="680px"
        footer={
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => setIsOpenNewModal(false)} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="button" onClick={handleCreateComanda} className="btn btn-primary">
              Confirmar e Abrir Comanda
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateComanda}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Nº ou Identificador da Comanda *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ex.: Comanda #22"
                value={newComandaForm.numeroComanda}
                onChange={(e) => setNewComandaForm({ ...newComandaForm, numeroComanda: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Aluno Matriculado (Opcional)</label>
              <select
                className="form-control"
                value={newComandaForm.idClienteAluno}
                onChange={(e) => {
                  const student = students.find(s => s.id_aluno === e.target.value);
                  setNewComandaForm({
                    ...newComandaForm,
                    idClienteAluno: e.target.value,
                    clienteNome: student ? student.nome_completo : newComandaForm.clienteNome
                  });
                }}
              >
                <option value="">Cliente Balcão / Convidado</option>
                {students.map(al => (
                  <option key={al.id_aluno} value={al.id_aluno}>{al.nome_completo}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Nome do Cliente / Atleta *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ex.: Rodrigo Fontes"
                value={newComandaForm.clienteNome}
                onChange={(e) => setNewComandaForm({ ...newComandaForm, clienteNome: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Mesa / Quadra / Observação</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ex.: Quadra 2 ou Mesa do Bar"
                value={newComandaForm.observacoes}
                onChange={(e) => setNewComandaForm({ ...newComandaForm, observacoes: e.target.value })}
              />
            </div>
          </div>

          {/* Quick Item Selection */}
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
              Adicionar Primeiro Pedido (Opcional):
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '140px', overflowY: 'auto' }}>
              {products.slice(0, 10).map(p => (
                <button
                  key={p.id_item}
                  type="button"
                  onClick={() => handleAddItemToNewList(p)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', gap: '4px' }}
                >
                  <Plus size={12} /> {p.nome_item} ({formatBRL(p.preco_venda)})
                </button>
              ))}
            </div>

            {newComandaItems.length > 0 && (
              <div style={{ marginTop: '12px', background: '#111827', padding: '10px 14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, marginBottom: '4px' }}>
                  Itens Selecionados para Abertura:
                </div>
                {newComandaItems.map(it => (
                  <div key={it.id_item} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#e2e8f0' }}>
                    <span>{it.quantidade}x {it.nome_item}</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{formatBRL(it.quantidade * it.preco_venda)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Adicionar Itens à Comanda Aberta */}
      <Modal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        title={`Adicionar Consumo em: ${activeComanda?.numero_comanda || 'Comanda'}`}
        footer={
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => setIsAddItemModalOpen(false)} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="button" onClick={handleConfirmAddItems} className="btn btn-primary">
              Lançar na Comanda
            </button>
          </div>
        }
      >
        <form onSubmit={handleConfirmAddItems}>
          <div className="input-group">
            <label className="input-label">Selecione o Item do Cardápio *</label>
            <select
              className="form-control"
              value={itemToAdd.id_item}
              onChange={(e) => setItemToAdd({ ...itemToAdd, id_item: e.target.value })}
              required
            >
              {products.map(p => (
                <option key={p.id_item} value={p.id_item}>
                  {p.nome_item} — {formatBRL(p.preco_venda)} {p.tipo === 'PRODUTO' ? `(Est: ${p.estoque_atual})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Quantidade a Lançar *</label>
            <input
              type="number"
              min="1"
              step="1"
              className="form-control"
              value={itemToAdd.quantidade}
              onChange={(e) => setItemToAdd({ ...itemToAdd, quantidade: Math.max(1, Number(e.target.value)) })}
              required
            />
          </div>

          {itemToAdd.id_item && (
            <div style={{
              background: '#111827',
              padding: '12px',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Subtotal a acrescentar:</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.15rem', color: '#38bdf8' }}>
                {formatBRL((products.find(p => p.id_item === itemToAdd.id_item)?.preco_venda || 0) * (itemToAdd.quantidade || 1))}
              </span>
            </div>
          )}
        </form>
      </Modal>

      {/* MODAL 3: Fechar e Pagar Comanda (Checkout Final) */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title={`Fechar e Liquidar: ${activeComanda?.numero_comanda || 'Comanda'}`}
        maxWidth="600px"
        footer={
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => setIsPayModalOpen(false)} className="btn btn-secondary">
              Cancelar
            </button>
            <button 
              type="button" 
              onClick={handleConfirmPayment} 
              className="btn btn-primary"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)', borderColor: '#059669' }}
            >
              Confirmar Recebimento & Fechar
            </button>
          </div>
        }
      >
        <form onSubmit={handleConfirmPayment}>
          <div style={{
            background: '#111827',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Cliente:</span>
              <strong style={{ color: '#fff' }}>{activeComanda?.cliente_nome}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Consumo Bruto:</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fff' }}>
                {formatBRL(activeComanda?.valor_total || 0)}
              </span>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Forma de Liquidação *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {['PIX', 'CARTAO_DEB', 'CARTAO_CRED', 'DINHEIRO', 'PRAZO'].map(pm => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setPayForm({ ...payForm, paymentMethod: pm })}
                  style={{
                    padding: '10px 4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: payForm.paymentMethod === pm ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                    backgroundColor: payForm.paymentMethod === pm ? 'rgba(16, 185, 129, 0.15)' : '#1e293b',
                    color: payForm.paymentMethod === pm ? '#34d399' : '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  {pm === 'CARTAO_DEB' ? 'DÉBITO' : pm === 'CARTAO_CRED' ? 'CRÉDITO' : pm}
                </button>
              ))}
            </div>
          </div>

          {payForm.paymentMethod === 'PRAZO' && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#fbbf24',
              fontSize: '0.8rem',
              marginBottom: '16px'
            }}>
              Esta comanda será enviada automaticamente para o <strong>Kanban de Contas a Receber</strong> com vencimento em 15 dias.
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Desconto (R$)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max={activeComanda?.valor_total || 0}
                className="form-control"
                value={payForm.discount}
                onChange={(e) => setPayForm({ ...payForm, discount: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Responsável pelo Pagamento</label>
              <input
                type="text"
                className="form-control"
                value={payForm.customerName}
                onChange={(e) => setPayForm({ ...payForm, customerName: e.target.value })}
              />
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255,255,255,0.08)'
          }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>TOTAL A RECEBER:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.85rem', fontWeight: 900, color: '#10b981' }}>
              {formatBRL(Math.max(0, (activeComanda?.valor_total || 0) - Number(payForm.discount || 0)))}
            </span>
          </div>
        </form>
      </Modal>

    </div>
  );
};
