import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { formatBRL, formatDate, generateId } from '../../utils/formatters';
import { Barcode, Plus, Copy, Check, Filter, Search } from 'lucide-react';

export const BoletosManager = () => {
  const { getTableData, addItem, updateItem, deleteItem, addToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBoleto, setSelectedBoleto] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [filterNatureza, setFilterNatureza] = useState('ALL');

  const boletos = getTableData('Boletos') || [];

  const [formData, setFormData] = useState({
    tipo_natureza: 'PAGAR',
    codigo_barras: '',
    valor_nominal: '',
    data_vencimento: new Date().toISOString().split('T')[0],
    status_boleto: 'ABERTO'
  });

  const handleOpenAdd = () => {
    setSelectedBoleto(null);
    setFormData({
      tipo_natureza: 'PAGAR',
      codigo_barras: '',
      valor_nominal: '',
      data_vencimento: new Date().toISOString().split('T')[0],
      status_boleto: 'ABERTO'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (bol) => {
    setSelectedBoleto(bol);
    setFormData({
      tipo_natureza: bol.tipo_natureza,
      codigo_barras: bol.codigo_barras,
      valor_nominal: bol.valor_nominal,
      data_vencimento: bol.data_vencimento,
      status_boleto: bol.status_boleto
    });
    setIsModalOpen(true);
  };

  const handleCopyBarcode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    addToast('Linha digitável copiada para a área de transferência!', 'info');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.codigo_barras || !formData.valor_nominal || !formData.data_vencimento) {
      alert('Preencha os campos obrigatórios!');
      return;
    }

    if (selectedBoleto) {
      updateItem('Boletos', 'id_boleto', selectedBoleto.id_boleto, {
        ...formData,
        valor_nominal: Number(formData.valor_nominal)
      });
    } else {
      addItem('Boletos', {
        id_boleto: 'bol_' + generateId(),
        ...formData,
        valor_nominal: Number(formData.valor_nominal)
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedBoleto && window.confirm('Deseja excluir este boleto?')) {
      deleteItem('Boletos', 'id_boleto', selectedBoleto.id_boleto);
      setIsModalOpen(false);
    }
  };

  const filteredBoletos = boletos.filter(b => {
    if (filterNatureza !== 'ALL' && b.tipo_natureza !== filterNatureza) return false;
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
            <Barcode size={22} style={{ color: '#06b6d4' }} />
            Boletos Bancários (Pagar / Receber)
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Controle de títulos bancários, linhas digitáveis FEBRABAN e conciliação de vencimentos.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: '#1e293b', borderRadius: '8px', padding: '3px' }}>
            <button
              onClick={() => setFilterNatureza('ALL')}
              className={`btn btn-sm ${filterNatureza === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none' }}
            >
              Todos ({boletos.length})
            </button>
            <button
              onClick={() => setFilterNatureza('PAGAR')}
              className={`btn btn-sm ${filterNatureza === 'PAGAR' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none' }}
            >
              A Pagar
            </button>
            <button
              onClick={() => setFilterNatureza('RECEBER')}
              className={`btn btn-sm ${filterNatureza === 'RECEBER' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none' }}
            >
              A Receber
            </button>
          </div>

          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={18} />
            <span>Cadastrar Boleto</span>
          </button>
        </div>
      </div>

      <div className="glass-panel">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Natureza</th>
                <th>Código de Barras / Linha Digitável</th>
                <th>Vencimento</th>
                <th>Valor Nominal</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredBoletos.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    Nenhum boleto encontrado com este filtro.
                  </td>
                </tr>
              ) : (
                filteredBoletos.map(bol => (
                  <tr key={bol.id_boleto}>
                    <td>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: bol.tipo_natureza === 'PAGAR' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: bol.tipo_natureza === 'PAGAR' ? '#f87171' : '#34d399'
                      }}>
                        {bol.tipo_natureza}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.825rem', color: '#cbd5e1' }}>
                          {bol.codigo_barras}
                        </span>
                        <button
                          onClick={() => handleCopyBarcode(bol.codigo_barras, bol.id_boleto)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: copiedId === bol.id_boleto ? '#10b981' : '#94a3b8',
                            cursor: 'pointer',
                            display: 'flex',
                            padding: '4px'
                          }}
                          title="Copiar linha digitável"
                        >
                          {copiedId === bol.id_boleto ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </td>
                    <td>{formatDate(bol.data_vencimento)}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.95rem' }}>
                      {formatBRL(bol.valor_nominal)}
                    </td>
                    <td>
                      <Badge status={bol.status_boleto} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        {bol.status_boleto !== 'PAGO' && (
                          <button
                            onClick={() => updateItem('Boletos', 'id_boleto', bol.id_boleto, { status_boleto: 'PAGO' })}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#10b981' }}
                            title="Marcar como Pago"
                          >
                            Quitar
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(bol)}
                          className="btn btn-secondary btn-sm"
                        >
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedBoleto ? 'Editar Boleto' : 'Cadastrar Novo Boleto'}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {selectedBoleto ? (
              <button type="button" onClick={handleDelete} className="btn btn-danger btn-sm">
                Excluir
              </button>
            ) : <span />}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                Cancelar
              </button>
              <button type="button" onClick={handleSave} className="btn btn-primary">
                Salvar Boleto
              </button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Natureza *</label>
              <select
                className="form-control"
                value={formData.tipo_natureza}
                onChange={(e) => setFormData({ ...formData, tipo_natureza: e.target.value })}
                required
              >
                <option value="PAGAR">PAGAR (Despesa / Fornecedor)</option>
                <option value="RECEBER">RECEBER (Cobrança Emitida)</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Valor Nominal (R$) *</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="0.00"
                value={formData.valor_nominal}
                onChange={(e) => setFormData({ ...formData, valor_nominal: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Linha Digitável / Código de Barras (FEBRABAN) *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex.: 34191.79001 01043.510047 91020.150008 1 98760000184000"
              value={formData.codigo_barras}
              onChange={(e) => setFormData({ ...formData, codigo_barras: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Data de Vencimento *</label>
              <input
                type="date"
                className="form-control"
                value={formData.data_vencimento}
                onChange={(e) => setFormData({ ...formData, data_vencimento: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Situação / Status *</label>
              <select
                className="form-control"
                value={formData.status_boleto}
                onChange={(e) => setFormData({ ...formData, status_boleto: e.target.value })}
              >
                <option value="ABERTO">ABERTO</option>
                <option value="PAGO">PAGO</option>
                <option value="VENCIDO">VENCIDO</option>
                <option value="CANCELADO">CANCELADO</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
