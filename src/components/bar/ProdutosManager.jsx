import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { formatBRL, generateId } from '../../utils/formatters';
import { UtensilsCrossed, Plus, Search, AlertTriangle, Edit, Trash2 } from 'lucide-react';

export const ProdutosManager = () => {
  const { getTableData, addItem, updateItem, deleteItem } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  const products = getTableData('ProdutosServicos') || [];
  const categories = getTableData('CategoriasBar') || [];

  const [formData, setFormData] = useState({
    nome_item: '',
    tipo: 'PRODUTO',
    id_categoria: categories[0]?.id_categoria || '',
    unidade_medida: 'UN',
    preco_custo: '',
    preco_venda: '',
    estoque_minimo: '10',
    estoque_atual: '20',
    codigo_barras: ''
  });

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setFormData({
      nome_item: '',
      tipo: 'PRODUTO',
      id_categoria: categories[0]?.id_categoria || '',
      unidade_medida: 'UN',
      preco_custo: '',
      preco_venda: '',
      estoque_minimo: '10',
      estoque_atual: '20',
      codigo_barras: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (prod) => {
    setSelectedProduct(prod);
    setFormData({
      nome_item: prod.nome_item,
      tipo: prod.tipo,
      id_categoria: prod.id_categoria,
      unidade_medida: prod.unidade_medida,
      preco_custo: prod.preco_custo,
      preco_venda: prod.preco_venda,
      estoque_minimo: prod.estoque_minimo,
      estoque_atual: prod.estoque_atual,
      codigo_barras: prod.codigo_barras || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.nome_item || !formData.preco_venda || !formData.id_categoria) {
      alert('Preencha os campos obrigatórios!');
      return;
    }

    const payload = {
      ...formData,
      preco_custo: Number(formData.preco_custo) || 0,
      preco_venda: Number(formData.preco_venda) || 0,
      estoque_minimo: Number(formData.estoque_minimo) || 0,
      estoque_atual: Number(formData.estoque_atual) || 0
    };

    if (selectedProduct) {
      updateItem('ProdutosServicos', 'id_item', selectedProduct.id_item, payload);
    } else {
      addItem('ProdutosServicos', {
        id_item: 'prod_' + generateId(),
        ...payload
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedProduct && window.confirm('Deseja excluir este item do catálogo?')) {
      deleteItem('ProdutosServicos', 'id_item', selectedProduct.id_item);
      setIsModalOpen(false);
    }
  };

  const filtered = products.filter(p => {
    if (filterType !== 'ALL' && p.tipo !== filterType) return false;
    if (onlyLowStock && (p.tipo !== 'PRODUTO' || p.estoque_atual > p.estoque_minimo)) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (p.nome_item || '').toLowerCase().includes(q) || (p.codigo_barras || '').includes(q);
    }
    return true;
  });

  return (
    <div className="page-wrapper">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UtensilsCrossed size={22} style={{ color: '#06b6d4' }} />
            Produtos & Cardápio do Bar
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Catálogo unificado de itens comercializados (PRODUTO com estoque, SERVIÇO sem estoque).
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} />
          <span>Cadastrar Produto / Serviço</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', background: '#1e293b', borderRadius: '8px', padding: '3px' }}>
              <button
                onClick={() => setFilterType('ALL')}
                className={`btn btn-sm ${filterType === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none' }}
              >
                Todos ({products.length})
              </button>
              <button
                onClick={() => setFilterType('PRODUTO')}
                className={`btn btn-sm ${filterType === 'PRODUTO' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none' }}
              >
                Produtos
              </button>
              <button
                onClick={() => setFilterType('SERVICO')}
                className={`btn btn-sm ${filterType === 'SERVICO' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none' }}
              >
                Serviços
              </button>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.825rem', color: '#f87171', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={onlyLowStock}
                onChange={(e) => setOnlyLowStock(e.target.checked)}
                style={{ accentColor: '#ef4444' }}
              />
              <AlertTriangle size={15} /> Apenas Estoque Baixo
            </label>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#1e293b',
            padding: '6px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.08)',
            width: '280px'
          }}>
            <Search size={16} style={{ color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Buscar item ou código de barras..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.85rem' }}
            />
          </div>

        </div>
      </div>

      {/* Catalog Table */}
      <div className="glass-panel">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Descrição do Item</th>
                <th>Categoria</th>
                <th>Tipo & Unidade</th>
                <th>Custo</th>
                <th>Preço de Venda</th>
                <th>Margem</th>
                <th>Estoque Físico</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    Nenhum produto cadastrado ou correspondente aos filtros.
                  </td>
                </tr>
              ) : (
                filtered.map(prod => {
                  const cat = categories.find(c => c.id_categoria === prod.id_categoria);
                  const isLow = prod.tipo === 'PRODUTO' && prod.estoque_atual <= prod.estoque_minimo;
                  const margin = prod.preco_venda > 0 
                    ? (((prod.preco_venda - prod.preco_custo) / prod.preco_venda) * 100).toFixed(0) 
                    : 0;

                  return (
                    <tr key={prod.id_item}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#f8fafc' }}>
                          {prod.nome_item}
                        </div>
                        {prod.codigo_barras && (
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#94a3b8' }}>
                            EAN: {prod.codigo_barras}
                          </div>
                        )}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.825rem', color: '#cbd5e1' }}>
                          {cat ? cat.nome_categoria : '—'}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: prod.tipo === 'SERVICO' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                          color: prod.tipo === 'SERVICO' ? '#c084fc' : '#38bdf8'
                        }}>
                          {prod.tipo} ({prod.unidade_medida})
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                        {formatBRL(prod.preco_custo)}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>
                        {formatBRL(prod.preco_venda)}
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: margin >= 50 ? '#34d399' : margin >= 30 ? '#fbbf24' : '#f87171'
                        }}>
                          {margin}%
                        </span>
                      </td>
                      <td>
                        {prod.tipo === 'PRODUTO' ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 800,
                              color: isLow ? '#f87171' : '#34d399',
                              fontSize: '0.95rem'
                            }}>
                              {prod.estoque_atual}
                            </span>
                            {isLow && (
                              <span style={{
                                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                color: '#f87171',
                                fontSize: '0.65rem',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontWeight: 700
                              }}>
                                BAIXO (Mín: {prod.estoque_minimo})
                              </span>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Sem estoque</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleEdit(prod)}
                          className="btn btn-secondary btn-sm"
                        >
                          <Edit size={14} /> Editar
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct ? 'Editar Item do Catálogo' : 'Cadastrar Novo Item'}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {selectedProduct ? (
              <button type="button" onClick={handleDelete} className="btn btn-danger btn-sm">
                Excluir Item
              </button>
            ) : <span />}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                Cancelar
              </button>
              <button type="button" onClick={handleSave} className="btn btn-primary">
                Salvar Item
              </button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSave}>
          <div className="input-group">
            <label className="input-label">Descrição Comercial do Item *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex.: Cerveja Corona Extra 330ml"
              value={formData.nome_item}
              onChange={(e) => setFormData({ ...formData, nome_item: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Categoria *</label>
              <select
                className="form-control"
                value={formData.id_categoria}
                onChange={(e) => setFormData({ ...formData, id_categoria: e.target.value })}
                required
              >
                {categories.map(c => (
                  <option key={c.id_categoria} value={c.id_categoria}>{c.nome_categoria}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Tipo de Item *</label>
              <select
                className="form-control"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              >
                <option value="PRODUTO">PRODUTO (Controla Estoque Físico)</option>
                <option value="SERVICO">SERVIÇO (Locação, Quadras, Aulas)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Unidade de Medida *</label>
              <select
                className="form-control"
                value={formData.unidade_medida}
                onChange={(e) => setFormData({ ...formData, unidade_medida: e.target.value })}
              >
                <option value="UN">UN (Unidade)</option>
                <option value="KG">KG (Quilo)</option>
                <option value="LT">LT (Litro)</option>
                <option value="DOSE">DOSE (Dose)</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Preço de Custo (R$)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="0.00"
                value={formData.preco_custo}
                onChange={(e) => setFormData({ ...formData, preco_custo: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Preço de Venda (R$) *</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="0.00"
                value={formData.preco_venda}
                onChange={(e) => setFormData({ ...formData, preco_venda: e.target.value })}
                required
              />
            </div>
          </div>

          {formData.tipo === 'PRODUTO' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="input-group">
                <label className="input-label">Estoque Atual</label>
                <input
                  type="number"
                  step="1"
                  className="form-control"
                  value={formData.estoque_atual}
                  onChange={(e) => setFormData({ ...formData, estoque_atual: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Estoque Mínimo (Alerta)</label>
                <input
                  type="number"
                  step="1"
                  className="form-control"
                  value={formData.estoque_minimo}
                  onChange={(e) => setFormData({ ...formData, estoque_minimo: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Código de Barras / EAN-GTIN (Opcional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex.: 7891000100012"
              value={formData.codigo_barras}
              onChange={(e) => setFormData({ ...formData, codigo_barras: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
