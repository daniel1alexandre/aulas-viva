import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KanbanBoard } from '../kanban/KanbanBoard';
import { Modal } from '../common/Modal';
import { generateId, formatBRL } from '../../utils/formatters';
import { Plus, ArrowDownCircle, Filter } from 'lucide-react';

export const ContasPagarBarKanban = () => {
  const { getTableData, updateCardStatus, addItem, updateItem, deleteItem } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  
  const [formData, setFormData] = useState({
    descricao: '',
    id_nota: '',
    valor_devido: '',
    data_vencimento: new Date().toISOString().split('T')[0],
    data_liquidacao: '',
    status_card: 'ABERTO'
  });

  const columns = [
    { id: 'ABERTO', title: 'Aberto', color: '#3b82f6' },
    { id: 'AGENDADO', title: 'Agendado', color: '#f59e0b' },
    { id: 'VENCIDO', title: 'Vencido', color: '#ef4444' },
    { id: 'PAGO', title: 'Pago', color: '#10b981' }
  ];

  const payables = getTableData('ContasPagarBar') || [];
  const invoices = getTableData('NotasFiscais') || [];

  const handleOpenAddModal = (status = 'ABERTO') => {
    setSelectedCard(null);
    setFormData({
      descricao: '',
      id_nota: '',
      valor_devido: '',
      data_vencimento: new Date().toISOString().split('T')[0],
      data_liquidacao: '',
      status_card: status
    });
    setIsModalOpen(true);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setFormData({
      descricao: card.descricao,
      id_nota: card.id_nota || '',
      valor_devido: card.valor_devido,
      data_vencimento: card.data_vencimento,
      data_liquidacao: card.data_liquidacao || '',
      status_card: card.status_card
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.descricao || !formData.valor_devido || !formData.data_vencimento) {
      alert('Preencha os campos obrigatórios!');
      return;
    }

    if (selectedCard) {
      updateItem('ContasPagarBar', 'id_conta_pagar', selectedCard.id_conta_pagar, {
        ...formData,
        valor_devido: Number(formData.valor_devido)
      });
    } else {
      addItem('ContasPagarBar', {
        id_conta_pagar: 'cp_' + generateId(),
        ...formData,
        valor_devido: Number(formData.valor_devido)
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedCard && window.confirm('Deseja realmente excluir este lançamento?')) {
      deleteItem('ContasPagarBar', 'id_conta_pagar', selectedCard.id_conta_pagar);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Action Header */}
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
            <ArrowDownCircle size={22} style={{ color: '#ef4444' }} />
            Contas a Pagar do Bar
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Quadro Kanban com status controlados pelo campo <code>status_card</code> (Aberto, Agendado, Vencido, Pago).
          </p>
        </div>

        <button 
          onClick={() => handleOpenAddModal('ABERTO')} 
          className="btn btn-primary"
        >
          <Plus size={18} />
          <span>Nova Conta a Pagar</span>
        </button>
      </div>

      {/* Kanban Board */}
      <KanbanBoard
        columns={columns}
        items={payables}
        statusKey="status_card"
        idKey="id_conta_pagar"
        cardTitleKey="descricao"
        cardAmountKey="valor_devido"
        cardDateKey="data_vencimento"
        onStatusChange={(id, newStatus) => updateCardStatus('ContasPagarBar', 'id_conta_pagar', id, newStatus)}
        onCardClick={handleCardClick}
        onAddNew={handleOpenAddModal}
      />

      {/* Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCard ? 'Editar Conta a Pagar' : 'Nova Conta a Pagar'}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {selectedCard ? (
              <button type="button" onClick={handleDelete} className="btn btn-danger btn-sm">
                Excluir
              </button>
            ) : <span />}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                Cancelar
              </button>
              <button type="button" onClick={handleSave} className="btn btn-primary">
                Salvar Lançamento
              </button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSave}>
          <div className="input-group">
            <label className="input-label">Descrição da Obrigação *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex.: Distribuidora de Bebidas, Cervejas Long Neck"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Valor Devido (R$) *</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="0.00"
                value={formData.valor_devido}
                onChange={(e) => setFormData({ ...formData, valor_devido: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Nota Fiscal (Opcional)</label>
              <select
                className="form-control"
                value={formData.id_nota}
                onChange={(e) => setFormData({ ...formData, id_nota: e.target.value })}
              >
                <option value="">Sem vínculo com NF</option>
                {invoices.map(nf => (
                  <option key={nf.id_nota} value={nf.id_nota}>
                    NF {nf.numero_nf} - {nf.fornecedor_nome} ({formatBRL(nf.valor_total_nf)})
                  </option>
                ))}
              </select>
            </div>
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
              <label className="input-label">Status da Coluna *</label>
              <select
                className="form-control"
                value={formData.status_card}
                onChange={(e) => setFormData({ ...formData, status_card: e.target.value })}
              >
                {columns.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          </div>

          {formData.status_card === 'PAGO' && (
            <div className="input-group">
              <label className="input-label">Data de Liquidação / Pagamento</label>
              <input
                type="date"
                className="form-control"
                value={formData.data_liquidacao}
                onChange={(e) => setFormData({ ...formData, data_liquidacao: e.target.value })}
              />
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};
