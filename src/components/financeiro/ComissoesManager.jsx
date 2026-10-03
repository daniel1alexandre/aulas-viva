import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { formatBRL, formatCPF } from '../../utils/formatters';
import { Percent, CheckCircle, Copy, Check, DollarSign } from 'lucide-react';

export const ComissoesManager = () => {
  const { getTableData, settleComissao, addToast } = useApp();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [copiedKey, setCopiedKey] = useState(null);

  const comissoes = getTableData('Comissoes') || [];
  const professores = getTableData('Professores') || [];
  const parcelas = getTableData('ParcelasAluno') || [];
  const contratos = getTableData('AulasContratos') || [];
  const alunos = getTableData('Alunos') || [];

  const handleCopyPix = (pix, id) => {
    navigator.clipboard.writeText(pix);
    setCopiedKey(id);
    addToast('Chave PIX copiada!', 'info');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const filtered = comissoes.filter(c => {
    if (filterStatus !== 'ALL' && c.status_repasse !== filterStatus) return false;
    return true;
  });

  const totalProvisionada = comissoes
    .filter(c => c.status_repasse === 'PROVISIONADA')
    .reduce((sum, c) => sum + (c.valor_comissao || 0), 0);

  const totalLiberada = comissoes
    .filter(c => c.status_repasse === 'LIBERADA')
    .reduce((sum, c) => sum + (c.valor_comissao || 0), 0);

  const totalPaga = comissoes
    .filter(c => c.status_repasse === 'PAGA')
    .reduce((sum, c) => sum + (c.valor_comissao || 0), 0);

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
            <Percent size={22} style={{ color: '#f59e0b' }} />
            Repasse de Comissões dos Treinadores
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Regra do modelo: comissão é <code>PROVISIONADA</code> ao gerar o contrato, torna-se <code>LIBERADA</code> após quitação da mensalidade pelo aluno, e passa a <code>PAGA</code> após repasse PIX ao professor.
          </p>
        </div>

        {/* Status filter buttons */}
        <div style={{ display: 'flex', background: '#1e293b', borderRadius: '8px', padding: '3px' }}>
          {['ALL', 'PROVISIONADA', 'LIBERADA', 'PAGA'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none', textTransform: 'uppercase', fontSize: '0.75rem' }}
            >
              {st === 'ALL' ? 'Todas' : st}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Totals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="stat-card">
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24' }}>PROVISIONADAS (PENDENTES DE ALUNO)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>{formatBRL(totalProvisionada)}</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #38bdf8' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>LIBERADAS (PRONTAS PARA REPASSE)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>{formatBRL(totalLiberada)}</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399' }}>PAGAS AOS PROFESSORES</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>{formatBRL(totalPaga)}</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Professor / Treinador</th>
                <th>Chave PIX</th>
                <th>Origem (Mensalidade)</th>
                <th>Valor Base</th>
                <th>Comissão Apurada</th>
                <th>Status do Repasse</th>
                <th style={{ textAlign: 'right' }}>Ação de Repasse</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    Nenhuma comissão encontrada nesta categoria.
                  </td>
                </tr>
              ) : (
                filtered.map(com => {
                  const prof = professores.find(p => p.id_professor === com.id_professor);
                  const parc = parcelas.find(p => p.id_parcela === com.id_parcela);
                  const ctr = parc ? contratos.find(c => c.id_contrato_aula === parc.id_contrato_aula) : null;
                  const alu = ctr ? alunos.find(a => a.id_aluno === ctr.id_aluno) : null;

                  return (
                    <tr key={com.id_comissao}>
                      <td style={{ fontWeight: 700, color: '#fff' }}>
                        {prof ? prof.nome_professor : com.id_professor}
                      </td>
                      <td>
                        {prof && prof.chave_pix ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#cbd5e1' }}>
                              {prof.chave_pix}
                            </span>
                            <button
                              onClick={() => handleCopyPix(prof.chave_pix, com.id_comissao)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: copiedKey === com.id_comissao ? '#10b981' : '#94a3b8',
                                cursor: 'pointer',
                                padding: '2px'
                              }}
                              title="Copiar PIX"
                            >
                              {copiedKey === com.id_comissao ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Sem PIX</span>
                        )}
                      </td>
                      <td>
                        {alu ? (
                          <span style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
                            {alu.nome_completo} (Parc. {parc?.numero_parcela || 1})
                          </span>
                        ) : (
                          <span style={{ color: '#64748b' }}>{com.id_parcela}</span>
                        )}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>
                        {formatBRL(com.valor_base)}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#fbbf24', fontSize: '1rem' }}>
                        {formatBRL(com.valor_comissao)}
                      </td>
                      <td>
                        <Badge status={com.status_repasse} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {com.status_repasse === 'LIBERADA' && (
                          <button
                            onClick={() => settleComissao(com.id_comissao)}
                            className="btn btn-primary btn-sm"
                            style={{ gap: '4px' }}
                          >
                            <DollarSign size={14} />
                            <span>Pagar PIX</span>
                          </button>
                        )}
                        {com.status_repasse === 'PAGA' && (
                          <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                            <CheckCircle size={14} /> Liquidado
                          </span>
                        )}
                        {com.status_repasse === 'PROVISIONADA' && (
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            Aguardando aluno quitar
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
