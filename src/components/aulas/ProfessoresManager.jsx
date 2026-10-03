import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { formatCPF, formatPhone, generateId } from '../../utils/formatters';
import { GraduationCap, Plus, MessageCircle, Copy, Check, Edit, Trash2 } from 'lucide-react';

export const ProfessoresManager = () => {
  const { getTableData, addItem, updateItem, deleteItem, addToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProf, setSelectedProf] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const professors = getTableData('Professores') || [];
  const contracts = getTableData('AulasContratos') || [];

  const [formData, setFormData] = useState({
    nome_professor: '',
    cpf_cnpj: '',
    especialidade: '',
    comissao_padrao_pct: 40.00,
    chave_pix: '',
    telefone: '',
    status: true
  });

  const handleOpenAdd = () => {
    setSelectedProf(null);
    setFormData({
      nome_professor: '',
      cpf_cnpj: '',
      especialidade: '',
      comissao_padrao_pct: 40.00,
      chave_pix: '',
      telefone: '',
      status: true
    });
    setIsModalOpen(true);
  };

  const handleEdit = (prof) => {
    setSelectedProf(prof);
    setFormData({
      nome_professor: prof.nome_professor,
      cpf_cnpj: prof.cpf_cnpj,
      especialidade: prof.especialidade || '',
      comissao_padrao_pct: prof.comissao_padrao_pct,
      chave_pix: prof.chave_pix || '',
      telefone: prof.telefone || '',
      status: prof.status
    });
    setIsModalOpen(true);
  };

  const handleCopyPix = (pix, id) => {
    navigator.clipboard.writeText(pix);
    setCopiedKey(id);
    addToast('Chave PIX copiada!', 'info');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.nome_professor || !formData.cpf_cnpj) {
      alert('Preencha os campos obrigatórios!');
      return;
    }

    const payload = {
      ...formData,
      comissao_padrao_pct: Number(formData.comissao_padrao_pct) || 40.0
    };

    if (selectedProf) {
      updateItem('Professores', 'id_professor', selectedProf.id_professor, payload);
    } else {
      addItem('Professores', {
        id_professor: 'prof_' + generateId(),
        ...payload
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedProf && window.confirm('Deseja excluir este instrutor?')) {
      deleteItem('Professores', 'id_professor', selectedProf.id_professor);
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
            <GraduationCap size={22} style={{ color: '#06b6d4' }} />
            Corpo Docente & Treinadores
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Cadastro de professores, especialidades técnicas, percentual base de comissionamento e chave PIX para repasses.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} />
          <span>Cadastrar Treinador</span>
        </button>
      </div>

      <div className="glass-panel">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome do Professor</th>
                <th>CPF / CNPJ</th>
                <th>Especialidade Técnica</th>
                <th>Comissão Base (%)</th>
                <th>Chave PIX</th>
                <th>WhatsApp</th>
                <th>Atletas Vinculados</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {professors.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    Nenhum professor cadastrado.
                  </td>
                </tr>
              ) : (
                professors.map(prof => {
                  const studentCount = contracts.filter(c => c.id_professor === prof.id_professor).length;
                  const cleanPhone = (prof.telefone || '').replace(/\D/g, '');

                  return (
                    <tr key={prof.id_professor}>
                      <td style={{ fontWeight: 700, color: '#fff' }}>
                        {prof.nome_professor}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#cbd5e1' }}>
                        {prof.cpf_cnpj}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: '#38bdf8' }}>
                          {prof.especialidade || 'Instrutor Geral'}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#fbbf24' }}>
                        {prof.comissao_padrao_pct}%
                      </td>
                      <td>
                        {prof.chave_pix ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#cbd5e1' }}>
                              {prof.chave_pix}
                            </span>
                            <button
                              onClick={() => handleCopyPix(prof.chave_pix, prof.id_professor)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: copiedKey === prof.id_professor ? '#10b981' : '#94a3b8',
                                cursor: 'pointer',
                                padding: '2px'
                              }}
                              title="Copiar PIX"
                            >
                              {copiedKey === prof.id_professor ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                          </div>
                        ) : '—'}
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
                            {formatPhone(prof.telefone)}
                          </a>
                        ) : '—'}
                      </td>
                      <td>
                        <span style={{
                          backgroundColor: 'rgba(255,255,255,0.06)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          {studentCount} aluno(s)
                        </span>
                      </td>
                      <td>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: prof.status ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: prof.status ? '#34d399' : '#f87171'
                        }}>
                          {prof.status ? 'EM ATIVIDADE' : 'INATIVO'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleEdit(prof)}
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
        title={selectedProf ? 'Editar Cadastro de Treinador' : 'Cadastrar Novo Treinador'}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {selectedProf ? (
              <button type="button" onClick={handleDelete} className="btn btn-danger btn-sm">
                Excluir
              </button>
            ) : <span />}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                Cancelar
              </button>
              <button type="button" onClick={handleSave} className="btn btn-primary">
                Salvar Cadastro
              </button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSave}>
          <div className="input-group">
            <label className="input-label">Nome Completo do Treinador *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex.: Daniel Alexandre Baumann"
              value={formData.nome_professor}
              onChange={(e) => setFormData({ ...formData, nome_professor: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">CPF / CNPJ *</label>
              <input
                type="text"
                className="form-control"
                placeholder="000.000.000-00"
                value={formData.cpf_cnpj}
                onChange={(e) => setFormData({ ...formData, cpf_cnpj: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Especialidade Técnica</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ex.: Alta Performance / Competição"
                value={formData.especialidade}
                onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Comissão Padrão Base (%) *</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                className="form-control"
                value={formData.comissao_padrao_pct}
                onChange={(e) => setFormData({ ...formData, comissao_padrao_pct: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">WhatsApp para Agendamentos</label>
              <input
                type="text"
                className="form-control"
                placeholder="(47) 99999-9999"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Chave Bancária PIX (para Repasses)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex.: email@provedor.com ou CPF"
              value={formData.chave_pix}
              onChange={(e) => setFormData({ ...formData, chave_pix: e.target.value })}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Situação do Instrutor</label>
            <select
              className="form-control"
              value={formData.status ? '1' : '0'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value === '1' })}
            >
              <option value="1">Em Atividade / Ativo</option>
              <option value="0">Inativo</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};
