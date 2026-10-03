import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { formatDate, generateId } from '../../utils/formatters';
import { FileSignature, Plus, Edit, Trash2 } from 'lucide-react';

export const ContratosManager = () => {
  const { getTableData, addItem, updateItem, deleteItem } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  const contracts = getTableData('AulasContratos') || [];
  const students = getTableData('Alunos') || [];
  const professors = getTableData('Professores') || [];
  const plans = getTableData('Planos') || [];

  const [formData, setFormData] = useState({
    id_aluno: students[0]?.id_aluno || '',
    id_professor: professors[0]?.id_professor || '',
    id_plano: plans[0]?.id_plano || '',
    comissao_especifica_pct: 40.00,
    data_inicio: new Date().toISOString().split('T')[0]
  });

  const handleOpenAdd = () => {
    setSelectedContract(null);
    setFormData({
      id_aluno: students[0]?.id_aluno || '',
      id_professor: professors[0]?.id_professor || '',
      id_plano: plans[0]?.id_plano || '',
      comissao_especifica_pct: 40.00,
      data_inicio: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleEdit = (ctr) => {
    setSelectedContract(ctr);
    setFormData({
      id_aluno: ctr.id_aluno,
      id_professor: ctr.id_professor,
      id_plano: ctr.id_plano,
      comissao_especifica_pct: ctr.comissao_especifica_pct,
      data_inicio: ctr.data_inicio
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.id_aluno || !formData.id_professor || !formData.id_plano) {
      alert('Selecione todos os vínculos do contrato!');
      return;
    }

    const payload = {
      ...formData,
      comissao_especifica_pct: Number(formData.comissao_especifica_pct) || 40.00
    };

    if (selectedContract) {
      updateItem('AulasContratos', 'id_contrato_aula', selectedContract.id_contrato_aula, payload);
    } else {
      addItem('AulasContratos', {
        id_contrato_aula: 'ctr_' + generateId(),
        ...payload
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedContract && window.confirm('Deseja cancelar este contrato?')) {
      deleteItem('AulasContratos', 'id_contrato_aula', selectedContract.id_contrato_aula);
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
            <FileSignature size={22} style={{ color: '#06b6d4' }} />
            Contratos Pedagógicos de Aulas
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Instância contratual vinculando o Aluno, o Professor designado, o Plano contratado e a comissão acordada.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} />
          <span>Novo Contrato</span>
        </button>
      </div>

      <div className="glass-panel">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Código Contrato</th>
                <th>Atleta / Aluno</th>
                <th>Professor Responsável</th>
                <th>Plano Contratado</th>
                <th>Comissão do Docente (%)</th>
                <th>Início de Vigência</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {contracts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    Nenhum contrato cadastrado.
                  </td>
                </tr>
              ) : (
                contracts.map(ctr => {
                  const student = students.find(s => s.id_aluno === ctr.id_aluno);
                  const prof = professors.find(p => p.id_professor === ctr.id_professor);
                  const plan = plans.find(p => p.id_plano === ctr.id_plano);

                  return (
                    <tr key={ctr.id_contrato_aula}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#06b6d4' }}>
                        #{ctr.id_contrato_aula}
                      </td>
                      <td style={{ fontWeight: 700, color: '#fff' }}>
                        {student ? student.nome_completo : ctr.id_aluno}
                      </td>
                      <td style={{ color: '#cbd5e1' }}>
                        {prof ? prof.nome_professor : ctr.id_professor}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.825rem', color: '#38bdf8', fontWeight: 600 }}>
                          {plan ? plan.nome_plano : ctr.id_plano}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#fbbf24' }}>
                        {ctr.comissao_especifica_pct}%
                      </td>
                      <td style={{ color: '#94a3b8' }}>
                        {formatDate(ctr.data_inicio)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleEdit(ctr)}
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
        title={selectedContract ? 'Editar Contrato' : 'Cadastrar Novo Contrato'}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {selectedContract ? (
              <button type="button" onClick={handleDelete} className="btn btn-danger btn-sm">
                Excluir
              </button>
            ) : <span />}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                Cancelar
              </button>
              <button type="button" onClick={handleSave} className="btn btn-primary">
                Salvar Contrato
              </button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSave}>
          <div className="input-group">
            <label className="input-label">Aluno / Atleta *</label>
            <select
              className="form-control"
              value={formData.id_aluno}
              onChange={(e) => setFormData({ ...formData, id_aluno: e.target.value })}
              required
            >
              {students.map(s => (
                <option key={s.id_aluno} value={s.id_aluno}>{s.nome_completo} (CPF: {s.cpf})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Professor Instrutor *</label>
              <select
                className="form-control"
                value={formData.id_professor}
                onChange={(e) => {
                  const prof = professors.find(p => p.id_professor === e.target.value);
                  setFormData({
                    ...formData,
                    id_professor: e.target.value,
                    comissao_especifica_pct: prof ? prof.comissao_padrao_pct : formData.comissao_especifica_pct
                  });
                }}
                required
              >
                {professors.map(p => (
                  <option key={p.id_professor} value={p.id_professor}>{p.nome_professor}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Plano de Aulas *</label>
              <select
                className="form-control"
                value={formData.id_plano}
                onChange={(e) => setFormData({ ...formData, id_plano: e.target.value })}
                required
              >
                {plans.map(p => (
                  <option key={p.id_plano} value={p.id_plano}>{p.nome_plano}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Comissão Específica Docente (%) *</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                className="form-control"
                value={formData.comissao_especifica_pct}
                onChange={(e) => setFormData({ ...formData, comissao_especifica_pct: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Data de Início da Vigência *</label>
              <input
                type="date"
                className="form-control"
                value={formData.data_inicio}
                onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                required
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
