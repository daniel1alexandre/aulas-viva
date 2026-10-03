import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatBRL, formatCPF } from '../../utils/formatters';
import confetti from 'canvas-confetti';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CheckCircle, 
  User, 
  CreditCard, 
  Search, 
  Receipt,
  Sparkles,
  AlertCircle,
  ClipboardList
} from 'lucide-react';

export const PDVScreen = () => {
  const { getTableData, finalizeSale, openComanda, addItemsToComanda, setActiveTab, addToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [itemSearch, setItemSearch] = useState('');
  const [cart, setCart] = useState([]);
  
  // Checkout state
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [discount, setDiscount] = useState(0);
  const [openComandaModal, setOpenComandaModal] = useState(false);
  const [comandaIdentificador, setComandaIdentificador] = useState('');
  const [selectedExistingComandaId, setSelectedExistingComandaId] = useState('');
  const [manualClientName, setManualClientName] = useState('');

  const categories = getTableData('CategoriasBar') || [];
  const products = getTableData('ProdutosServicos') || [];
  const students = getTableData('Alunos') || [];
  const sales = getTableData('Vendas') || [];

  // Filter items
  const filteredProducts = products.filter(prod => {
    if (selectedCategory !== 'ALL' && prod.id_categoria !== selectedCategory) return false;
    if (itemSearch) {
      const q = itemSearch.toLowerCase();
      const matchName = (prod.nome_item || '').toLowerCase().includes(q);
      const matchBarcode = (prod.codigo_barras || '').includes(q);
      if (!matchName && !matchBarcode) return false;
    }
    return true;
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id_item === product.id_item);
      if (existing) {
        return prev.map(item =>
          item.id_item === product.id_item
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantidade: 1 }];
    });
  };

  const updateCartQty = (id_item, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id_item === id_item) {
          const newQty = item.quantidade + delta;
          return newQty > 0 ? { ...item, quantidade: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (id_item) => {
    setCart(prev => prev.filter(item => item.id_item !== id_item));
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((sum, it) => sum + (it.preco_venda * it.quantidade), 0);
  const total = Math.max(0, subtotal - Number(discount || 0));

  const handleCheckout = () => {
    if (cart.length === 0) {
      addToast('Adicione ao menos um item ao pedido!', 'warning');
      return;
    }

    if (paymentMethod === 'PRAZO' && !selectedCustomerId) {
      addToast('Para vendas a prazo, selecione o Aluno / Atleta responsável!', 'error');
      return;
    }

    const studentObj = students.find(s => s.id_aluno === selectedCustomerId);

    const sale = finalizeSale({
      cartItems: cart,
      customerId: selectedCustomerId,
      customerName: studentObj ? studentObj.nome_completo : '',
      paymentMethod,
      discount: Number(discount)
    });

    if (sale) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      clearCart();
      setSelectedCustomerId('');
      setDiscount(0);
    }
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: '1700px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 420px', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column: Catalog & Items */}
        <div>
          {/* Categories Bar & Search */}
          <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              
              {/* Category Pills */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', maxWidth: '75%' }}>
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className={`btn btn-sm ${selectedCategory === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: '9999px' }}
                >
                  Todos ({products.length})
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id_categoria}
                    onClick={() => setSelectedCategory(cat.id_categoria)}
                    className={`btn btn-sm ${selectedCategory === cat.id_categoria ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderRadius: '9999px', whiteSpace: 'nowrap' }}
                  >
                    {cat.nome_categoria}
                  </button>
                ))}
              </div>

              {/* Barcode / Name Search */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#1e293b',
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.08)',
                flex: '1',
                minWidth: '200px'
              }}>
                <Search size={16} style={{ color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Nome ou código de barras..."
                  value={itemSearch}
                  onChange={(e) => setItemSearch(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.85rem' }}
                />
              </div>

            </div>
          </div>

          {/* Product Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
            gap: '16px'
          }}>
            {filteredProducts.map(product => {
              const isLowStock = product.tipo === 'PRODUTO' && (product.estoque_atual <= product.estoque_minimo);
              const isOut = product.tipo === 'PRODUTO' && product.estoque_atual <= 0;

              return (
                <div
                  key={product.id_item}
                  onClick={() => !isOut && addToCart(product)}
                  style={{
                    backgroundColor: '#111827',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '16px',
                    cursor: isOut ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    opacity: isOut ? 0.45 : 1,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isOut) {
                      e.currentTarget.style.borderColor = '#06b6d4';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 10px 20px -3px rgba(6, 182, 212, 0.25)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.2)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: product.tipo === 'SERVICO' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                        color: product.tipo === 'SERVICO' ? '#c084fc' : '#38bdf8'
                      }}>
                        {product.tipo} • {product.unidade_medida}
                      </span>

                      {product.tipo === 'PRODUTO' && (
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: isLowStock ? '#f87171' : '#94a3b8'
                        }}>
                          Est: {product.estoque_atual}
                        </span>
                      )}
                    </div>

                    <div style={{
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: '#f8fafc',
                      lineHeight: 1.3,
                      marginBottom: '8px',
                      minHeight: '2.6em'
                    }}>
                      {product.nome_item}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: '#38bdf8'
                    }}>
                      {formatBRL(product.preco_venda)}
                    </span>

                    <button
                      className="btn btn-primary btn-sm"
                      style={{ padding: '6px 10px', borderRadius: '8px' }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Cart / Ticket */}
        <div className="glass-panel" style={{ position: 'sticky', top: '90px' }}>
          <div className="glass-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={20} style={{ color: '#06b6d4' }} />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Comanda / Caixa</h3>
              <span style={{
                backgroundColor: 'rgba(6, 182, 212, 0.15)',
                color: '#38bdf8',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                {cart.reduce((sum, it) => sum + it.quantidade, 0)} itens
              </span>
            </div>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '0.775rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Trash2 size={13} /> Limpar
              </button>
            )}
          </div>

          {/* Cart Items list */}
          <div style={{ maxHeight: '280px', overflowY: 'auto', padding: '12px 20px' }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 10px', color: '#64748b' }}>
                <Receipt size={32} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                <div>Nenhum item selecionado.</div>
                <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>Clique nos produtos para adicioná-los à comanda.</div>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.id_item}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, paddingRight: '10px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.nome_item}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {item.quantidade}x {formatBRL(item.preco_venda)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#1e293b', borderRadius: '6px', padding: '2px' }}>
                      <button
                        onClick={() => updateCartQty(item.id_item, -1)}
                        style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '4px' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0 6px', color: '#fff' }}>
                        {item.quantidade}
                      </span>
                      <button
                        onClick={() => updateCartQty(item.id_item, 1)}
                        style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '4px' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.875rem', minWidth: '65px', textAlign: 'right', color: '#fff' }}>
                      {formatBRL(item.quantidade * item.preco_venda)}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id_item)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Controls */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(0,0,0,0.15)' }}>
            
            {/* Customer Dropdown */}
            <div className="input-group" style={{ marginBottom: '12px' }}>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={13} /> Atleta / Aluno (Opcional)
              </label>
              <select
                className="form-control"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
              >
                <option value="">Cliente Balcão / Avulso</option>
                {students.map(al => (
                  <option key={al.id_aluno} value={al.id_aluno}>
                    {al.nome_completo} (CPF: {al.cpf})
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div className="input-group" style={{ marginBottom: '12px' }}>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CreditCard size={13} /> Forma de Pagamento *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {['PIX', 'CARTAO_DEB', 'CARTAO_CRED', 'DINHEIRO', 'PRAZO'].map(pm => (
                  <button
                    key={pm}
                    type="button"
                    onClick={() => setPaymentMethod(pm)}
                    style={{
                      padding: '8px 4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      borderRadius: '8px',
                      border: paymentMethod === pm ? '1px solid #06b6d4' : '1px solid rgba(255,255,255,0.08)',
                      backgroundColor: paymentMethod === pm ? 'rgba(6, 182, 212, 0.15)' : '#1e293b',
                      color: paymentMethod === pm ? '#38bdf8' : '#94a3b8',
                      cursor: 'pointer'
                    }}
                  >
                    {pm === 'CARTAO_DEB' ? 'DÉBITO' : pm === 'CARTAO_CRED' ? 'CRÉDITO' : pm}
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod === 'PRAZO' && (
              <div style={{
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#fbbf24',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>Gera automaticamente uma <strong>Conta a Receber</strong> no Kanban financeiro.</span>
              </div>
            )}

            {/* Subtotal & Total */}
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span>Subtotal:</span>
                <span>{formatBRL(subtotal)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Desconto (R$):</span>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max={subtotal}
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  style={{
                    width: '90px',
                    textAlign: 'right',
                    background: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>TOTAL A PAGAR:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.65rem', fontWeight: 900, color: '#38bdf8' }}>
                  {formatBRL(total)}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="btn btn-primary btn-lg"
                  style={{
                    width: '100%',
                    fontWeight: 800,
                    opacity: cart.length === 0 ? 0.5 : 1,
                    boxShadow: '0 8px 25px rgba(6, 182, 212, 0.4)'
                  }}
                >
                  <CheckCircle size={20} />
                  <span>PAGAR AGORA (VENDA DIRETA)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (cart.length === 0) {
                      addToast('Adicione itens ao pedido antes de lançar na comanda!', 'warning');
                      return;
                    }
                    const randomNum = Math.floor(10 + Math.random() * 90);
                    setComandaIdentificador(`Comanda #${randomNum}`);
                    setOpenComandaModal(true);
                  }}
                  disabled={cart.length === 0}
                  className="btn btn-amber"
                  style={{
                    width: '100%',
                    padding: '12px 18px',
                    opacity: cart.length === 0 ? 0.5 : 1,
                    gap: '8px'
                  }}
                >
                  <ClipboardList size={18} />
                  <span>LANÇAR EM COMANDA ABERTA</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Modal Lançar em Comanda Aberta */}
      {openComandaModal && (
        <div className="modal-overlay" onClick={() => setOpenComandaModal(false)}>
          <div className="modal-content" style={{ maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClipboardList size={20} style={{ color: '#f59e0b' }} />
                Lançar Pedido em Comanda Aberta
              </h3>
            </div>

            <div className="modal-body">
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '16px' }}>
                O cliente pode continuar consumindo e acertar o valor acumulado no final do dia na tela de <strong>Comandas Abertas</strong>.
              </p>

              {/* Option: existing or new */}
              {sales.filter(s => s.status_venda === 'AGUARDANDO_PAGAMENTO').length > 0 && (
                <div className="input-group">
                  <label className="input-label">Vincular a Comanda Já Existente?</label>
                  <select
                    className="form-control"
                    value={selectedExistingComandaId}
                    onChange={(e) => setSelectedExistingComandaId(e.target.value)}
                  >
                    <option value="">+ Criar uma NOVA Comanda</option>
                    {sales.filter(s => s.status_venda === 'AGUARDANDO_PAGAMENTO').map(oc => (
                      <option key={oc.id_venda} value={oc.id_venda}>
                        {oc.numero_comanda} — {oc.cliente_nome} (Já tem {formatBRL(oc.valor_total)})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {!selectedExistingComandaId && (
                <div>
                  <div className="input-group">
                    <label className="input-label">Número ou Identificador da Comanda *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={comandaIdentificador}
                      onChange={(e) => setComandaIdentificador(e.target.value)}
                      placeholder="Ex.: Comanda #24 ou Mesa 4"
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Nome do Cliente / Atleta *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        selectedCustomerId 
                          ? (students.find(s => s.id_aluno === selectedCustomerId)?.nome_completo || '') 
                          : manualClientName
                      }
                      onChange={(e) => setManualClientName(e.target.value)}
                      placeholder={selectedCustomerId ? '' : 'Ex.: Carlos Henrique (Quadra 1)'}
                      readOnly={Boolean(selectedCustomerId)}
                    />
                  </div>
                </div>
              )}

              <div style={{ background: '#111827', padding: '12px', borderRadius: '8px', marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#94a3b8' }}>Valor deste pedido a lançar:</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#f59e0b' }}>
                    {formatBRL(total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" onClick={() => setOpenComandaModal(false)} className="btn btn-secondary">
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedExistingComandaId) {
                    addItemsToComanda(selectedExistingComandaId, cart);
                  } else {
                    const studentObj = students.find(s => s.id_aluno === selectedCustomerId);
                    openComanda({
                      numeroComanda: comandaIdentificador || `Comanda #${Math.floor(100 + Math.random() * 900)}`,
                      clienteNome: studentObj ? studentObj.nome_completo : (manualClientName || 'Cliente / Atleta'),
                      idClienteAluno: selectedCustomerId || null,
                      cartItems: cart,
                      observacoes: 'Aberto no PDV • Consumo no local'
                    });
                  }
                  clearCart();
                  setOpenComandaModal(false);
                  setActiveTab('comandas_abertas');
                }}
                className="btn btn-primary"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#111827', fontWeight: 800 }}
              >
                Enviar para Comandas Abertas ➔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
