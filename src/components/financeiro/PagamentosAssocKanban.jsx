import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KanbanBoard } from '../kanban/KanbanBoard';
import { Modal } from '../common/Modal';
import { generateId, formatBRL } from '../../utils/formatters';
import { Plus, Building2 } from 'lucide-react';

export const PagamentosAssocKanban = () => {
  const { getTableData, updateCardStatus, addItem, updateItem, deleteItem } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const fixedCategories = [
    'Luz', 'Água', 'Telefone', 'TLL', 'IPTU', 'Internet', 
    'Professores', 'Marketing', 'Diretoria', 'Contabilidade', 'Aluguel'
  ];

  const columns = [
    { id: 'A_VENCER', title: 'A Vencer', color: '#3b82f6' },
    { id: 'VENCENDO', title: 'Vencendo', color: '#f59e0b' },
    { id: 'VENCIDO', title: 'Vencido', color: '#ef4444' },
    { id: 'PAGO', title: 'Pago', color: '#10b981' }
  ];

  const [formData, setFormData] = useState({
    categoria_fixa: 'Aluguel',
    descricao: '',
    valor_compromisso: '',
    data_vencimento: new Date().toISOString().split('T')[0],
    data_liquidacao: '',
    status_card: 'A_VENCER'
  });

  const associationExpenses = getTableData('PagamentosAssociacao') || [];

  const handleOpenAddModal = (status = 'A_VENCER') => {
    setSelectedCard(null);
    setFormData({
      categoria_fixa: 'Aluguel',
      descricao: '',
      valor_compromisso: '',
      data_vencimento: new Date().toISOString().split('T')[0],
      data_liquidacao: '',
      status_card: status
    });
    setIsModalOpen(true);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setFormData({
      categoria_fixa: card.categoria_fixa,
      descricao: card.descricao || '',
      valor_compromisso: card.valor_compromisso,
      data_vencimento: card.data_vencimento,
      data_liquidacao: card.data_liquidacao || '',
      status_card: card.status_card
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.categoria_fixa || !formData.valor_compromisso || !formData.data_vencimento) {
      alert('Preencha os campos obrigatórios!');
      return;
    }

    if (selectedCard) {
      updateItem('PagamentosAssociacao', 'id_pagamento_ass', selectedCard.id_pagamento_ass, {
        ...formData,
        valor_compromisso: Number(formData.valor_compromisso)
      });
    } else {
      addItem('PagamentosAssociacao', {
        id_pagamento_ass: 'ass_' + generateId(),
        ...formData,
        valor_compromisso: Number(formData.valor_compromisso)
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedCard && window.confirm('Deseja realmente excluir esta despesa da Associação?')) {
      deleteItem('PagamentosAssociacao', 'id_pagamento_ass', selectedCard.id_pagamento_ass);
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
            <Building2 size={22} style={{ color: '#06b6d4' }} />
            Despesas Fixas da Associação
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Quadro Kanban para despesas operacionais da entidade (Aluguel, Luz, IPTU, etc.) com status: <code>A_VENCER</code>, <code>VENCENDO</code>, <code>VENCIDO</code>, <code>PAGO</code>.
          </p>
        </div>

        <button 
          onClick={() => handleOpenAddModal('A_VENCER')} 
          className="btn btn-primary"
        >
          <Plus size={18} />
          <span>Nova Despesa Fixa</span>
        </button>
      </div>

      {/* Kanban Board */}
      <KanbanBoard
        columns={columns}
        items={associationExpenses}
        statusKey="status_card"
        idKey="id_pagamento_ass"
        cardTitleKey="descricao"
        cardAmountKey="valor_compromisso"
        cardDateKey="data_vencimento"
        onStatusChange={(id, newStatus) => updateCardStatus('PagamentosAssociacao', 'id_pagamento_ass', id, newStatus)}
        onCardClick={handleCardClick}
        onAddNew={handleOpenAddModal}
      />

      {/* Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCard ? 'Editar Despesa da Associação' : 'Nova Despesa Fixa'}
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
                Salvar Despesa
              </button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Categoria Fixa *</label>
              <select
                className="form-control"
                value={formData.categoria_fixa}
                onChange={(e) => setFormData({ ...formData, categoria_fixa: e.target.value })}
                required
              >
                {fixedCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Valor do Compromisso (R$) *</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="0.00"
                value={formData.valor_compromisso}
                onChange={(e) => setFormData({ ...formData, valor_compromisso: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Descrição / Fornecedor</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex.: Locação Mensal do Complexo Arena Viva"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
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
              <label className="input-label">Data da Baixa Bancária / Liquidação</label>
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
