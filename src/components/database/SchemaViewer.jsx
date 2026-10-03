import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Database, Table, Link, ListOrdered, Download, ExternalLink } from 'lucide-react';
import * as XLSX from 'xlsx';

export const SchemaViewer = () => {
  const { schema, data, exportAllToJson, addToast } = useApp();
  const [activeSubTab, setActiveSubTab] = useState('bar');
  const [selectedTable, setSelectedTable] = useState('ProdutosServicos');

  const barTables = schema?.barTables || {};
  const aulasTables = schema?.aulasTables || {};
  const relacionamentos = schema?.relacionamentos || [];
  const valoresEnumerados = schema?.valoresEnumerados || [];

  const allTables = { ...barTables, ...aulasTables };
  const currentFields = allTables[selectedTable] || [];
  const liveRowCount = (data[selectedTable] || []).length;

  const handleExportToExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      // Convert each table in state to a sheet
      for (const [tName, rows] of Object.entries(data)) {
        if (Array.isArray(rows) && rows.length > 0) {
          const ws = XLSX.utils.json_to_sheet(rows);
          XLSX.utils.book_append_sheet(wb, ws, tName.slice(0, 31));
        }
      }

      XLSX.writeFile(wb, `Viva_By_Baumann_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);
      addToast('Banco de dados exportado para planilha Excel (.xlsx)!', 'success');
    } catch (e) {
      console.error(e);
      addToast('Erro ao exportar planilha Excel.', 'error');
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
            <Database size={22} style={{ color: '#06b6d4' }} />
            Dicionário de Tabelas do Modelo de Dados
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Especificação formal das 20 tabelas, relacionamentos (FK) e valores enumerados extraídos diretamente do arquivo <code>Modelo_de_Dados_App_Bar_e_Aulas.xlsx</code>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExportToExcel} className="btn btn-secondary" style={{ gap: '6px' }}>
            <Download size={16} /> Exportar Excel (.xlsx)
          </button>
          <button onClick={exportAllToJson} className="btn btn-primary" style={{ gap: '6px' }}>
            <Download size={16} /> Exportar JSON
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px' }}>
        <button
          onClick={() => { setActiveSubTab('bar'); setSelectedTable(Object.keys(barTables)[0]); }}
          style={{
            padding: '10px 16px',
            background: 'none',
            border: 'none',
            borderBottom: activeSubTab === 'bar' ? '2px solid #06b6d4' : '2px solid transparent',
            color: activeSubTab === 'bar' ? '#38bdf8' : '#94a3b8',
            fontWeight: activeSubTab === 'bar' ? 800 : 500,
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Tabelas do BAR ({Object.keys(barTables).length})
        </button>

        <button
          onClick={() => { setActiveSubTab('aulas'); setSelectedTable(Object.keys(aulasTables)[0]); }}
          style={{
            padding: '10px 16px',
            background: 'none',
            border: 'none',
            borderBottom: activeSubTab === 'aulas' ? '2px solid #06b6d4' : '2px solid transparent',
            color: activeSubTab === 'aulas' ? '#38bdf8' : '#94a3b8',
            fontWeight: activeSubTab === 'aulas' ? 800 : 500,
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Tabelas das AULAS ({Object.keys(aulasTables).length})
        </button>

        <button
          onClick={() => setActiveSubTab('relacionamentos')}
          style={{
            padding: '10px 16px',
            background: 'none',
            border: 'none',
            borderBottom: activeSubTab === 'relacionamentos' ? '2px solid #06b6d4' : '2px solid transparent',
            color: activeSubTab === 'relacionamentos' ? '#38bdf8' : '#94a3b8',
            fontWeight: activeSubTab === 'relacionamentos' ? 800 : 500,
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Relacionamentos / Chaves ({relacionamentos.length})
        </button>

        <button
          onClick={() => setActiveSubTab('enums')}
          style={{
            padding: '10px 16px',
            background: 'none',
            border: 'none',
            borderBottom: activeSubTab === 'enums' ? '2px solid #06b6d4' : '2px solid transparent',
            color: activeSubTab === 'enums' ? '#38bdf8' : '#94a3b8',
            fontWeight: activeSubTab === 'enums' ? 800 : 500,
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Valores Enumerados ({valoresEnumerados.length})
        </button>
      </div>

      {/* Render tables view */}
      {(activeSubTab === 'bar' || activeSubTab === 'aulas') && (
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px', alignItems: 'start' }}>
          
          {/* Table List Sidebar */}
          <div className="glass-panel" style={{ padding: '12px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', padding: '8px', textTransform: 'uppercase' }}>
              {activeSubTab === 'bar' ? 'Módulo Bar' : 'Módulo Aulas'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {Object.keys(activeSubTab === 'bar' ? barTables : aulasTables).map(tName => {
                const count = (data[tName] || []).length;
                const isSel = selectedTable === tName;

                return (
                  <button
                    key={tName}
                    onClick={() => setSelectedTable(tName)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: isSel ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                      color: isSel ? '#38bdf8' : '#cbd5e1',
                      fontWeight: isSel ? 700 : 500,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>{tName}</span>
                    <span style={{
                      fontSize: '0.7rem',
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      color: '#94a3b8'
                    }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fields Detail Panel */}
          <div className="glass-panel">
            <div className="glass-header">
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>
                  Tabela: <code>{selectedTable}</code>
                </h3>
                <span style={{ fontSize: '0.775rem', color: '#94a3b8' }}>
                  {currentFields.length} campos definidos • {liveRowCount} registros atualmente no banco
                </span>
              </div>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Campo</th>
                    <th>Tipo de Dado</th>
                    <th>Chave</th>
                    <th>Obrigatório</th>
                    <th>Descrição / Finalidade no Sistema</th>
                  </tr>
                </thead>
                <tbody>
                  {currentFields.map((field, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                        {field.campo}
                      </td>
                      <td style={{ color: '#cbd5e1' }}>
                        {field.tipo}
                      </td>
                      <td>
                        {field.pk_fk ? (
                          <span style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            backgroundColor: field.pk_fk === 'PK' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                            color: field.pk_fk === 'PK' ? '#fbbf24' : '#60a5fa'
                          }}>
                            {field.pk_fk}
                          </span>
                        ) : '—'}
                      </td>
                      <td>
                        <span style={{
                          color: field.obrigatorio === 'Sim' ? '#34d399' : '#94a3b8',
                          fontWeight: field.obrigatorio === 'Sim' ? 700 : 400,
                          fontSize: '0.8rem'
                        }}>
                          {field.obrigatorio}
                        </span>
                      </td>
                      <td style={{ color: '#94a3b8', fontSize: '0.825rem', lineHeight: 1.4 }}>
                        {field.descricao}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Render Relationships view */}
      {activeSubTab === 'relacionamentos' && (
        <div className="glass-panel">
          <div className="glass-header">
            <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>
              Relacionamentos Entre Tabelas (Chaves Estrangeiras - FK)
            </h3>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tabela Origem (De)</th>
                  <th>Campo FK</th>
                  <th>Tabela Destino (Para)</th>
                  <th>Campo PK</th>
                  <th>Cardinalidade</th>
                  <th>Descrição da Ligação</th>
                </tr>
              </thead>
              <tbody>
                {relacionamentos.map((rel, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700, color: '#fff' }}>{rel.de_tabela}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>{rel.de_campo}</td>
                    <td style={{ fontWeight: 700, color: '#10b981' }}>{rel.para_tabela}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#34d399' }}>{rel.para_campo}</td>
                    <td>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        color: '#cbd5e1'
                      }}>
                        {rel.tipo_relacao}
                      </span>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.825rem' }}>{rel.descricao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Render Enumerated Values view */}
      {activeSubTab === 'enums' && (
        <div className="glass-panel">
          <div className="glass-header">
            <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>
              Valores Enumerados & Opções de Dropdown / Kanban
            </h3>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tabela</th>
                  <th>Campo</th>
                  <th>Valores Válidos / Permitidos</th>
                  <th>Observação Técnica</th>
                </tr>
              </thead>
              <tbody>
                {valoresEnumerados.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700, color: '#fff' }}>{item.tabela}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>{item.campo}</td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {item.valores.map((v, i) => (
                          <span
                            key={i}
                            style={{
                              backgroundColor: '#1e293b',
                              color: '#34d399',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontFamily: 'var(--font-mono)',
                              border: '1px solid rgba(255,255,255,0.08)'
                            }}
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.825rem' }}>{item.observacao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
