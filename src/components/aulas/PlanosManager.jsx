import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { formatBRL, generateId } from '../../utils/formatters';
import { Award, Plus, Edit, Trash2, Clock, Calendar } from 'lucide-react';

export const PlanosManager = () => {
  const { getTableData, addItem, updateItem, deleteItem } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = getTableData('Planos') || [];
  const students = getTableData('Alunos') || [];

  const [formData, setFormData] = useState({
    nome_plano: '',
    valor_mensalidade: '',
    aulas_semana: 2,
    duracao_minutos: 60,
    status: true
  });

  const handleOpenAdd = () => {
    setSelectedPlan(null);
    setFormData({
      nome_plano: '',
      valor_mensalidade: '',
      aulas_semana: 2,
      duracao_minutos: 60,
      status: true
    });
    setIsModalOpen(true);
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setFormData({
      nome_plano: plan.nome_plano,
      valor_mensalidade: plan.valor_mensalidade,
      aulas_semana: plan.aulas_semana,
      duracao_minutos: plan.duracao_minutos,
      status: plan.status
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.nome_plano || !formData.valor_mensalidade) {
      alert('Preencha os campos obrigatórios!');
      return;
    }

    const payload = {
      ...formData,
      valor_mensalidade: Number(formData.valor_mensalidade) || 0,
      aulas_semana: Number(formData.aulas_semana) || 2,
      duracao_minutos: Number(formData.duracao_minutos) || 60
    };

    if (selectedPlan) {
      updateItem('Planos', 'id_plano', selectedPlan.id_plano, payload);
    } else {
      addItem('Planos', {
        id_plano: 'plano_' + generateId(),
        ...payload
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedPlan && window.confirm('Deseja excluir este plano de aulas?')) {
      deleteItem('Planos', 'id_plano', selectedPlan.id_plano);
      setIsModalOpen(false);
    }
  };

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
            <Award size={22} style={{ color: '#06b6d4' }} />
            Planos & Modalidades de Aulas
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Definição de pacotes pedagógicos, frequência semanal de treinos, duração das aulas e valores das mensalidades.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} />
          <span>Novo Plano de Aulas</span>
        </button>
      </div>

      <div className="glass-panel">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome do Plano</th>
                <th>Frequência Semanal</th>
                <th>Duração da Aula</th>
                <th>Valor da Mensalidade</th>
                <th>Alunos Matriculados</th>
                <th>Situação</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {plans.map(plan => {
                const count = students.filter(s => s.id_plano === plan.id_plano).length;
                return (
                  <tr key={plan.id_plano}>
                    <td style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>
                      {plan.nome_plano}
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                        <Calendar size={14} style={{ color: '#06b6d4' }} />
                        {plan.aulas_semana}x por semana
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                        <Clock size={14} style={{ color: '#f59e0b' }} />
                        {plan.duracao_minutos} minutos
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#38bdf8', fontSize: '1rem' }}>
                      {formatBRL(plan.valor_mensalidade)}
                    </td>
                    <td>
                      <span style={{
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>
                        {count} atleta(s)
                      </span>
                    </td>
                    <td>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: plan.status ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: plan.status ? '#34d399' : '#f87171'
                      }}>
                        {plan.status ? 'ATIVO' : 'DESCONTINUADO'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleEdit(plan)}
                        className="btn btn-secondary btn-sm"
                      >
                        <Edit size={14} /> Editar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPlan ? 'Editar Plano' : 'Cadastrar Novo Plano'}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {selectedPlan ? (
              <button type="button" onClick={handleDelete} className="btn btn-danger btn-sm">
                Excluir
              </button>
            ) : <span />}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                Cancelar
              </button>
              <button type="button" onClick={handleSave} className="btn btn-primary">
                Salvar Plano
              </button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSave}>
          <div className="input-group">
            <label className="input-label">Nome do Plano *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex.: Mensal 2x Beach Tennis Regular"
              value={formData.nome_plano}
              onChange={(e) => setFormData({ ...formData, nome_plano: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Valor da Mensalidade (R$) *</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              placeholder="0.00"
              value={formData.valor_mensalidade}
              onChange={(e) => setFormData({ ...formData, valor_mensalidade: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Aulas por Semana *</label>
              <input
                type="number"
                min="1"
                max="7"
                className="form-control"
                value={formData.aulas_semana}
                onChange={(e) => setFormData({ ...formData, aulas_semana: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Duração de Cada Aula (Minutos) *</label>
              <input
                type="number"
                step="5"
                min="15"
                className="form-control"
                value={formData.duracao_minutos}
                onChange={(e) => setFormData({ ...formData, duracao_minutos: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Status do Plano</label>
            <select
              className="form-control"
              value={formData.status ? '1' : '0'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value === '1' })}
            >
              <option value="1">Ativo para Novas Matrículas</option>
              <option value="0">Descontinuado</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};
