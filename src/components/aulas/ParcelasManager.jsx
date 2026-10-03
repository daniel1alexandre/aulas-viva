import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { formatBRL, formatDate, generateId } from '../../utils/formatters';
import { CreditCard, Plus, CheckCircle, Search, Filter } from 'lucide-react';

export const ParcelasManager = () => {
  const { getTableData, addItem, updateItem, deleteItem, payParcela } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParcela, setSelectedParcela] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const parcelas = getTableData('ParcelasAluno') || [];
  const contracts = getTableData('AulasContratos') || [];
  const students = getTableData('Alunos') || [];
  const plans = getTableData('Planos') || [];
  const professors = getTableData('Professores') || [];

  const [formData, setFormData] = useState({
    id_contrato_aula: contracts[0]?.id_contrato_aula || '',
    numero_parcela: 1,
    valor_parcela: '',
    data_vencimento: new Date().toISOString().split('T')[0],
    status_parcela: 'ABERTA'
  });

  const handleOpenAdd = () => {
    setSelectedParcela(null);
    setFormData({
      id_contrato_aula: contracts[0]?.id_contrato_aula || '',
      numero_parcela: 1,
      valor_parcela: '',
      data_vencimento: new Date().toISOString().split('T')[0],
      status_parcela: 'ABERTA'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (p) => {
    setSelectedParcela(p);
    setFormData({
      id_contrato_aula: p.id_contrato_aula,
      numero_parcela: p.numero_parcela,
      valor_parcela: p.valor_parcela,
      data_vencimento: p.data_vencimento,
      status_parcela: p.status_parcela
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.id_contrato_aula || !formData.valor_parcela) {
      alert('Preencha os campos obrigatórios!');
      return;
    }

    const payload = {
      ...formData,
      numero_parcela: Number(formData.numero_parcela) || 1,
      valor_parcela: Number(formData.valor_parcela) || 0
    };

    if (selectedParcela) {
      updateItem('ParcelasAluno', 'id_parcela', selectedParcela.id_parcela, payload);
    } else {
      const newId = 'parc_' + generateId();
      addItem('ParcelasAluno', {
        id_parcela: newId,
        ...payload
      });

      // Automatically create corresponding PROVISIONADA commission for the teacher
      const ctr = contracts.find(c => c.id_contrato_aula === formData.id_contrato_aula);
      if (ctr) {
        const comVal = (payload.valor_parcela * (ctr.comissao_especifica_pct || 40)) / 100;
        addItem('Comissoes', {
          id_comissao: 'com_' + generateId(),
          id_professor: ctr.id_professor,
          id_parcela: newId,
          valor_base: payload.valor_parcela,
          valor_comissao: comVal,
          status_repasse: 'PROVISIONADA'
        });
      }
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedParcela && window.confirm('Deseja excluir esta mensalidade?')) {
      deleteItem('ParcelasAluno', 'id_parcela', selectedParcela.id_parcela);
      setIsModalOpen(false);
    }
  };

  const filtered = parcelas.filter(p => {
    if (statusFilter !== 'ALL' && p.status_parcela !== statusFilter) return false;
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
            <CreditCard size={22} style={{ color: '#06b6d4' }} />
            Mensalidades de Alunos (Parcelas)
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Controle de cobranças periódicas. Ao dar baixa ("PAGA"), a comissão correspondente do treinador é <strong>automaticamente LIBERADA</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: '#1e293b', borderRadius: '8px', padding: '3px' }}>
            {['ALL', 'ABERTA', 'PAGA', 'VENCIDA', 'ISENTA'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none', fontSize: '0.75rem' }}
              >
                {status === 'ALL' ? 'Todas' : status}
              </button>
            ))}
          </div>

          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={18} />
            <span>Gerar Mensalidade</span>
          </button>
        </div>
      </div>

      <div className="glass-panel">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Aluno / Atleta</th>
                <th>Contrato & Treinador</th>
                <th>Parcela</th>
                <th>Valor Líquido</th>
                <th>Data de Vencimento</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Ações / Baixa</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    Nenhuma parcela encontrada nesta condição.
                  </td>
                </tr>
              ) : (
                filtered.map(p => {
                  const ctr = contracts.find(c => c.id_contrato_aula === p.id_contrato_aula);
                  const student = ctr ? students.find(s => s.id_aluno === ctr.id_aluno) : null;
                  const prof = ctr ? professors.find(pr => pr.id_professor === ctr.id_professor) : null;

                  return (
                    <tr key={p.id_parcela}>
                      <td style={{ fontWeight: 700, color: '#fff' }}>
                        {student ? student.nome_completo : 'Aluno'}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.825rem', color: '#cbd5e1' }}>
                          Prof. {prof ? prof.nome_professor : 'Instrutor'}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        {p.numero_parcela}ª parcela
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#38bdf8', fontSize: '0.95rem' }}>
                        {formatBRL(p.valor_parcela)}
                      </td>
                      <td style={{ color: '#cbd5e1' }}>
                        {formatDate(p.data_vencimento)}
                      </td>
                      <td>
                        <Badge status={p.status_parcela} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          {p.status_parcela !== 'PAGA' && (
                            <button
                              onClick={() => payParcela(p.id_parcela)}
                              className="btn btn-primary btn-sm"
                              style={{ backgroundColor: '#10b981', borderColor: '#10b981', gap: '4px' }}
                              title="Confirmar recebimento e liberar comissão docente"
                            >
                              <CheckCircle size={14} /> Receber
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(p)}
                            className="btn btn-secondary btn-sm"
                          >
                            Editar
                          </button>
                        </div>
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
        title={selectedParcela ? 'Editar Mensalidade' : 'Lançar Nova Mensalidade'}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {selectedParcela ? (
              <button type="button" onClick={handleDelete} className="btn btn-danger btn-sm">
                Excluir
              </button>
            ) : <span />}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                Cancelar
              </button>
              <button type="button" onClick={handleSave} className="btn btn-primary">
                Salvar Mensalidade
              </button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSave}>
          <div className="input-group">
            <label className="input-label">Contrato de Aula *</label>
            <select
              className="form-control"
              value={formData.id_contrato_aula}
              onChange={(e) => {
                const ctr = contracts.find(c => c.id_contrato_aula === e.target.value);
                const pl = ctr ? plans.find(p => p.id_plano === ctr.id_plano) : null;
                setFormData({
                  ...formData,
                  id_contrato_aula: e.target.value,
                  valor_parcela: pl ? pl.valor_mensalidade : formData.valor_parcela
                });
              }}
              required
            >
              {contracts.map(c => {
                const st = students.find(s => s.id_aluno === c.id_aluno);
                const pl = plans.find(p => p.id_plano === c.id_plano);
                return (
                  <option key={c.id_contrato_aula} value={c.id_contrato_aula}>
                    {st ? st.nome_completo : c.id_aluno} — {pl ? pl.nome_plano : c.id_plano}
                  </option>
                );
              })}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Número da Parcela *</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={formData.numero_parcela}
                onChange={(e) => setFormData({ ...formData, numero_parcela: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Valor da Parcela (R$) *</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="0.00"
                value={formData.valor_parcela}
                onChange={(e) => setFormData({ ...formData, valor_parcela: e.target.value })}
                required
              />
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
              <label className="input-label">Situação da Parcela *</label>
              <select
                className="form-control"
                value={formData.status_parcela}
                onChange={(e) => setFormData({ ...formData, status_parcela: e.target.value })}
              >
                <option value="ABERTA">ABERTA</option>
                <option value="PAGA">PAGA</option>
                <option value="VENCIDA">VENCIDA</option>
                <option value="ISENTA">ISENTA</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
