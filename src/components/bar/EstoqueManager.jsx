import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { formatDateTime, generateId } from '../../utils/formatters';
import { Package, Plus, ArrowDown, ArrowUp, RefreshCw, AlertTriangle } from 'lucide-react';

export const EstoqueManager = () => {
  const { getTableData, addItem, updateItem, addToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('ALL');

  const movements = getTableData('MovimentacoesEstoque') || [];
  const products = getTableData('ProdutosServicos') || [];

  const [formData, setFormData] = useState({
    id_item: products.find(p => p.tipo === 'PRODUTO')?.id_item || '',
    tipo_movimento: 'AJUSTE',
    quantidade: '',
    motivo: 'Ajuste de inventário / contagem física'
  });

  const handleOpenAdjustment = () => {
    setFormData({
      id_item: products.find(p => p.tipo === 'PRODUTO')?.id_item || '',
      tipo_movimento: 'AJUSTE',
      quantidade: '',
      motivo: 'Ajuste de inventário / contagem física'
    });
    setIsModalOpen(true);
  };

  const handleSaveAdjustment = (e) => {
    e.preventDefault();
    if (!formData.id_item || !formData.quantidade) {
      alert('Selecione o produto e informe a quantidade!');
      return;
    }

    const prod = products.find(p => p.id_item === formData.id_item);
    if (!prod) return;

    const qty = Number(formData.quantidade);
    const now = new Date();
    const dateFormatted = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);

    let newStock = prod.estoque_atual;
    if (formData.tipo_movimento === 'ENTRADA') {
      newStock += qty;
    } else if (formData.tipo_movimento === 'SAIDA') {
      newStock = Math.max(0, newStock - qty);
    } else {
      // Ajuste define o novo saldo direto ou soma
      newStock = qty;
    }

    updateItem('ProdutosServicos', 'id_item', prod.id_item, { estoque_atual: newStock });

    addItem('MovimentacoesEstoque', {
      id_movimento: 'mov_' + generateId(),
      id_item: prod.id_item,
      tipo_movimento: formData.tipo_movimento,
      quantidade: qty,
      data_hora: dateFormatted,
      documento_origem: formData.motivo || 'Ajuste Manual'
    });

    addToast(`Estoque de "${prod.nome_item}" atualizado para ${newStock}!`, 'success');
    setIsModalOpen(false);
  };

  const filteredMovements = movements.filter(m => {
    if (filterType !== 'ALL' && m.tipo_movimento !== filterType) return false;
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
            <Package size={22} style={{ color: '#06b6d4' }} />
            Movimentações de Estoque do Bar
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Livro de registros de movimentações físicas: <code>ENTRADA</code> (Notas), <code>SAIDA</code> (Vendas) e <code>AJUSTE</code> (Perdas/Inventário).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: '#1e293b', borderRadius: '8px', padding: '3px' }}>
            {['ALL', 'ENTRADA', 'SAIDA', 'AJUSTE'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`btn btn-sm ${filterType === type ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none' }}
              >
                {type === 'ALL' ? 'Todas' : type}
              </button>
            ))}
          </div>

          <button onClick={handleOpenAdjustment} className="btn btn-primary">
            <Plus size={18} />
            <span>Novo Ajuste Manual</span>
          </button>
        </div>
      </div>

      {/* Movements Table */}
      <div className="glass-panel">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Data / Hora</th>
                <th>Tipo de Movimento</th>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Documento / Origem</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    Nenhuma movimentação de estoque registrada.
                  </td>
                </tr>
              ) : (
                filteredMovements.map(mov => {
                  const prod = products.find(p => p.id_item === mov.id_item);
                  const isEntry = mov.tipo_movimento === 'ENTRADA';
                  const isExit = mov.tipo_movimento === 'SAIDA';

                  return (
                    <tr key={mov.id_movimento}>
                      <td style={{ color: '#cbd5e1', fontSize: '0.825rem' }}>
                        {formatDateTime(mov.data_hora)}
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: isEntry ? 'rgba(16, 185, 129, 0.15)' : isExit ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: isEntry ? '#34d399' : isExit ? '#f87171' : '#fbbf24'
                        }}>
                          {isEntry && <ArrowDown size={12} />}
                          {isExit && <ArrowUp size={12} />}
                          {mov.tipo_movimento}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: '#fff' }}>
                        {prod ? prod.nome_item : mov.id_item}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.95rem' }}>
                        {isEntry ? `+${mov.quantidade}` : isExit ? `-${mov.quantidade}` : mov.quantidade}
                      </td>
                      <td style={{ color: '#94a3b8', fontSize: '0.825rem' }}>
                        {mov.documento_origem || '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Adjustment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Lançamento de Ajuste de Estoque"
        footer={
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="button" onClick={handleSaveAdjustment} className="btn btn-primary">
              Confirmar Ajuste
            </button>
          </div>
        }
      >
        <form onSubmit={handleSaveAdjustment}>
          <div className="input-group">
            <label className="input-label">Produto *</label>
            <select
              className="form-control"
              value={formData.id_item}
              onChange={(e) => setFormData({ ...formData, id_item: e.target.value })}
              required
            >
              {products.filter(p => p.tipo === 'PRODUTO').map(prod => (
                <option key={prod.id_item} value={prod.id_item}>
                  {prod.nome_item} (Saldo Atual: {prod.estoque_atual} {prod.unidade_medida})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Tipo de Lançamento *</label>
              <select
                className="form-control"
                value={formData.tipo_movimento}
                onChange={(e) => setFormData({ ...formData, tipo_movimento: e.target.value })}
              >
                <option value="AJUSTE">AJUSTE (Definir Novo Saldo Físico)</option>
                <option value="ENTRADA">ENTRADA (Acrescentar Unidades)</option>
                <option value="SAIDA">SAÍDA (Perda, Avaria ou Descarte)</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Quantidade / Novo Saldo *</label>
              <input
                type="number"
                step="1"
                className="form-control"
                placeholder="Ex.: 10"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Motivo / Documento de Referência</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex.: Quebra de garrafa no salão / Contagem física mensal"
              value={formData.motivo}
              onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
