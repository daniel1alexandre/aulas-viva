import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { formatBRL, formatCPF, formatPhone, generateId } from '../../utils/formatters';
import { Users, Plus, Search, MessageCircle, Edit, Trash2 } from 'lucide-react';

export const AlunosManager = () => {
  const { getTableData, addItem, updateItem, deleteItem } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const students = getTableData('Alunos') || [];
  const plans = getTableData('Planos') || [];
  const professors = getTableData('Professores') || [];

  const [formData, setFormData] = useState({
    nome_completo: '',
    cpf: '',
    telefone: '',
    id_plano: plans[0]?.id_plano || '',
    id_professor_titular: professors[0]?.id_professor || '',
    dia_vencimento: 10,
    status_matricula: 'ATIVO'
  });

  const handleOpenAdd = () => {
    setSelectedStudent(null);
    setFormData({
      nome_completo: '',
      cpf: '',
      telefone: '',
      id_plano: plans[0]?.id_plano || '',
      id_professor_titular: professors[0]?.id_professor || '',
      dia_vencimento: 10,
      status_matricula: 'ATIVO'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setFormData({
      nome_completo: student.nome_completo,
      cpf: student.cpf,
      telefone: student.telefone,
      id_plano: student.id_plano,
      id_professor_titular: student.id_professor_titular,
      dia_vencimento: student.dia_vencimento,
      status_matricula: student.status_matricula
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.nome_completo || !formData.id_plano) {
      alert('Preencha os campos obrigatórios!');
      return;
    }

    const payload = {
      ...formData,
      dia_vencimento: Number(formData.dia_vencimento) || 10
    };

    if (selectedStudent) {
      updateItem('Alunos', 'id_aluno', selectedStudent.id_aluno, payload);
    } else {
      const newId = 'aluno_' + generateId();
      addItem('Alunos', {
        id_aluno: newId,
        ...payload
      });
      // Optionally create initial contract and first installment
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedStudent && window.confirm('Deseja excluir este aluno?')) {
      deleteItem('Alunos', 'id_aluno', selectedStudent.id_aluno);
      setIsModalOpen(false);
    }
  };

  const filtered = students.filter(s => {
    if (statusFilter !== 'ALL' && s.status_matricula !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (s.nome_completo || '').toLowerCase().includes(q) || (s.cpf || '').includes(q);
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
            <Users size={22} style={{ color: '#06b6d4' }} />
            Gestão de Alunos & Atletas
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Controle de matrículas ativas, vínculo com planos de treino, professores titulares e dia de vencimento.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} />
          <span>Matricular Aluno</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', background: '#1e293b', borderRadius: '8px', padding: '3px' }}>
            {['ALL', 'ATIVO', 'TRANCADO', 'INADIMPLENTE', 'INATIVO'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none', fontSize: '0.75rem' }}
              >
                {status === 'ALL' ? 'Todos' : status}
              </button>
            ))}
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
              placeholder="Buscar por nome ou CPF..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.85rem' }}
            />
          </div>

        </div>
      </div>

      {/* Students Table */}
      <div className="glass-panel">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome Completo</th>
                <th>CPF</th>
                <th>WhatsApp</th>
                <th>Plano Contratado</th>
                <th>Professor Titular</th>
                <th>Dia Venc.</th>
                <th>Situação</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    Nenhum aluno encontrado com os filtros atuais.
                  </td>
                </tr>
              ) : (
                filtered.map(student => {
                  const plan = plans.find(p => p.id_plano === student.id_plano);
                  const prof = professors.find(p => p.id_professor === student.id_professor_titular);
                  const cleanPhone = (student.telefone || '').replace(/\D/g, '');

                  return (
                    <tr key={student.id_aluno}>
                      <td style={{ fontWeight: 700, color: '#fff' }}>
                        {student.nome_completo}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.825rem', color: '#cbd5e1' }}>
                        {formatCPF(student.cpf)}
                      </td>
                      <td>
                        {cleanPhone ? (
                          <a
                            href={`https://wa.me/55${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: '#34d399',
                              textDecoration: 'none',
                              fontSize: '0.825rem'
                            }}
                          >
                            <MessageCircle size={14} />
                            {formatPhone(student.telefone)}
                          </a>
                        ) : '—'}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600 }}>
                          {plan ? plan.nome_plano : '—'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.825rem', color: '#cbd5e1' }}>
                          {prof ? prof.nome_professor : '—'}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        Dia {student.dia_vencimento}
                      </td>
                      <td>
                        <Badge status={student.status_matricula} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleEdit(student)}
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
        title={selectedStudent ? 'Editar Cadastro do Aluno' : 'Matricular Novo Aluno'}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {selectedStudent ? (
              <button type="button" onClick={handleDelete} className="btn btn-danger btn-sm">
                Excluir
              </button>
            ) : <span />}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                Cancelar
              </button>
              <button type="button" onClick={handleSave} className="btn btn-primary">
                Salvar Matrícula
              </button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSave}>
          <div className="input-group">
            <label className="input-label">Nome Completo do Aluno *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex.: Lucas Silveira Mendes"
              value={formData.nome_completo}
              onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">CPF *</label>
              <input
                type="text"
                className="form-control"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">WhatsApp *</label>
              <input
                type="text"
                className="form-control"
                placeholder="(47) 99999-9999"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Plano de Treino *</label>
              <select
                className="form-control"
                value={formData.id_plano}
                onChange={(e) => setFormData({ ...formData, id_plano: e.target.value })}
                required
              >
                {plans.map(p => (
                  <option key={p.id_plano} value={p.id_plano}>
                    {p.nome_plano} ({formatBRL(p.valor_mensalidade)})
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Professor Titular *</label>
              <select
                className="form-control"
                value={formData.id_professor_titular}
                onChange={(e) => setFormData({ ...formData, id_professor_titular: e.target.value })}
                required
              >
                {professors.map(p => (
                  <option key={p.id_professor} value={p.id_professor}>
                    {p.nome_professor} ({p.especialidade || 'Instrutor'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Dia do Vencimento da Mensalidade (1 a 31) *</label>
              <input
                type="number"
                min="1"
                max="31"
                className="form-control"
                value={formData.dia_vencimento}
                onChange={(e) => setFormData({ ...formData, dia_vencimento: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Situação Cadastral *</label>
              <select
                className="form-control"
                value={formData.status_matricula}
                onChange={(e) => setFormData({ ...formData, status_matricula: e.target.value })}
              >
                <option value="ATIVO">ATIVO</option>
                <option value="TRANCADO">TRANCADO</option>
                <option value="INADIMPLENTE">INADIMPLENTE</option>
                <option value="INATIVO">INATIVO</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
