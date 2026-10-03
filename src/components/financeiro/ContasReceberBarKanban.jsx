import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KanbanBoard } from '../kanban/KanbanBoard';
import { Modal } from '../common/Modal';
import { generateId, formatBRL } from '../../utils/formatters';
import { Plus, ArrowUpCircle } from 'lucide-react';

export const ContasReceberBarKanban = () => {
  const { getTableData, updateCardStatus, addItem, updateItem, deleteItem } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  
  const [formData, setFormData] = useState({
    devedor_nome: '',
    id_venda: '',
    valor_devido: '',
    data_vencimento: new Date().toISOString().split('T')[0],
    data_recebimento: '',
    status_card: 'ABERTO'
  });

  const columns = [
    { id: 'ABERTO', title: 'Aberto', color: '#3b82f6' },
    { id: 'VENCIDO', title: 'Vencido', color: '#ef4444' },
    { id: 'PAGO', title: 'Pago / Recebido', color: '#10b981' }
  ];

  const receivables = getTableData('ContasReceberBar') || [];
  const sales = getTableData('Vendas') || [];
  const students = getTableData('Alunos') || [];

  const handleOpenAddModal = (status = 'ABERTO') => {
    setSelectedCard(null);
    setFormData({
      devedor_nome: '',
      id_venda: '',
      valor_devido: '',
      data_vencimento: new Date().toISOString().split('T')[0],
      data_recebimento: '',
      status_card: status
    });
    setIsModalOpen(true);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setFormData({
      devedor_nome: card.devedor_nome,
      id_venda: card.id_venda || '',
      valor_devido: card.valor_devido,
      data_vencimento: card.data_vencimento,
      data_recebimento: card.data_recebimento || '',
      status_card: card.status_card
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.devedor_nome || !formData.valor_devido || !formData.data_vencimento) {
      alert('Preencha os campos obrigatórios!');
      return;
    }

    if (selectedCard) {
      updateItem('ContasReceberBar', 'id_conta_receber', selectedCard.id_conta_receber, {
        ...formData,
        valor_devido: Number(formData.valor_devido)
      });
    } else {
      addItem('ContasReceberBar', {
        id_conta_receber: 'cr_' + generateId(),
        ...formData,
        valor_devido: Number(formData.valor_devido)
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedCard && window.confirm('Deseja realmente excluir este lançamento de crédito?')) {
      deleteItem('ContasReceberBar', 'id_conta_receber', selectedCard.id_conta_receber);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
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
            <ArrowUpCircle size={22} style={{ color: '#10b981' }} />
            Contas a Receber do Bar
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Gestão de vendas a prazo e créditos do bar. Status do Kanban: <code>ABERTO</code>, <code>VENCIDO</code>, <code>PAGO</code>.
          </p>
        </div>

        <button 
          onClick={() => handleOpenAddModal('ABERTO')} 
          className="btn btn-primary"
        >
          <Plus size={18} />
          <span>Novo Crédito / A Receber</span>
        </button>
      </div>

      {/* Kanban Board */}
      <KanbanBoard
        columns={columns}
        items={receivables}
        statusKey="status_card"
        idKey="id_conta_receber"
        cardTitleKey="devedor_nome"
        cardAmountKey="valor_devido"
        cardDateKey="data_vencimento"
        onStatusChange={(id, newStatus) => updateCardStatus('ContasReceberBar', 'id_conta_receber', id, newStatus)}
        onCardClick={handleCardClick}
        onAddNew={handleOpenAddModal}
      />

      {/* Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCard ? 'Editar Conta a Receber' : 'Novo Lançamento a Receber'}
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
            <label className="input-label">Nome do Cliente / Atleta Responsável *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex.: Lucas Silveira Mendes (Aluno)"
              value={formData.devedor_nome}
              onChange={(e) => setFormData({ ...formData, devedor_nome: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Valor a Receber (R$) *</label>
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
              <label className="input-label">Venda Vinculada (Opcional)</label>
              <select
                className="form-control"
                value={formData.id_venda}
                onChange={(e) => setFormData({ ...formData, id_venda: e.target.value })}
              >
                <option value="">Venda avulsa / sem cupom</option>
                {sales.map(v => (
                  <option key={v.id_venda} value={v.id_venda}>
                    Cupom #{v.id_venda} ({formatBRL(v.valor_total)}) - {v.forma_pagamento}
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
              <label className="input-label">Data do Recebimento em Caixa</label>
              <input
                type="date"
                className="form-control"
                value={formData.data_recebimento}
                onChange={(e) => setFormData({ ...formData, data_recebimento: e.target.value })}
              />
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};
