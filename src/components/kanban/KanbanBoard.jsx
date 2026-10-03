import React, { useState } from 'react';
import { Badge } from '../common/Badge';
import { formatBRL, formatDate } from '../../utils/formatters';
import { Plus, MoveRight, MoveLeft, DollarSign, Calendar, FileText } from 'lucide-react';

export const KanbanBoard = ({
  columns, // array of { id, title, color }
  items,   // array of card objects
  statusKey = 'status_card',
  idKey,
  onStatusChange,
  onCardClick,
  onAddNew,
  cardTitleKey = 'descricao',
  cardAmountKey = 'valor_devido',
  cardDateKey = 'data_vencimento'
}) => {
  const [draggedItemId, setDraggedItemId] = useState(null);

  const handleDragStart = (e, id) => {
    setDraggedItemId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedItemId;
    if (id && onStatusChange) {
      onStatusChange(id, targetStatus);
    }
    setDraggedItemId(null);
  };

  return (
    <div className="kanban-container">
      {columns.map(col => {
        const colItems = (items || []).filter(item => item[statusKey] === col.id);
        const colTotal = colItems.reduce((acc, it) => acc + (Number(it[cardAmountKey]) || 0), 0);

        return (
          <div
            key={col.id}
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            {/* Column Header */}
            <div className="kanban-column-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: col.color || '#06b6d4',
                  boxShadow: `0 0 8px ${col.color || '#06b6d4'}`
                }} />
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#f8fafc' }}>
                  {col.title}
                </span>
                <span style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#94a3b8'
                }}>
                  {colItems.length}
                </span>
              </div>

              {onAddNew && (
                <button
                  onClick={() => onAddNew(col.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '6px'
                  }}
                  title={`Adicionar novo em ${col.title}`}
                >
                  <Plus size={16} />
                </button>
              )}
            </div>

            {/* Total Badge in column */}
            <div style={{
              padding: '6px 16px',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: '#94a3b8'
            }}>
              <span>Total da Coluna:</span>
              <strong style={{ color: '#f8fafc' }}>{formatBRL(colTotal)}</strong>
            </div>

            {/* Cards List */}
            <div className="kanban-cards-wrapper">
              {colItems.length === 0 ? (
                <div style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  color: '#64748b',
                  fontSize: '0.8rem',
                  border: '1px dashed rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px'
                }}>
                  Nenhum registro nesta etapa
                </div>
              ) : (
                colItems.map(item => {
                  const currentStatusIndex = columns.findIndex(c => c.id === col.id);
                  const prevCol = currentStatusIndex > 0 ? columns[currentStatusIndex - 1] : null;
                  const nextCol = currentStatusIndex < columns.length - 1 ? columns[currentStatusIndex + 1] : null;

                  return (
                    <div
                      key={item[idKey]}
                      className={`kanban-card ${draggedItemId === item[idKey] ? 'active-drag' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item[idKey])}
                      onClick={() => onCardClick && onCardClick(item)}
                    >
                      {/* Card Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          color: '#f8fafc',
                          lineHeight: 1.3
                        }}>
                          {item[cardTitleKey] || item.devedor_nome || item.descricao || 'Sem Descrição'}
                        </div>
                      </div>

                      {/* Info / Reference tags */}
                      {item.id_nota && (
                        <div style={{ fontSize: '0.72rem', color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                          <FileText size={12} />
                          <span>NF vinculada: {item.id_nota}</span>
                        </div>
                      )}

                      {item.categoria_fixa && (
                        <div style={{ marginBottom: '8px' }}>
                          <span style={{
                            backgroundColor: 'rgba(6, 182, 212, 0.12)',
                            color: '#38bdf8',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 700
                          }}>
                            {item.categoria_fixa}
                          </span>
                        </div>
                      )}

                      {/* Card Details: Due Date & Amount */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '12px',
                        paddingTop: '8px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#94a3b8' }}>
                          <Calendar size={13} />
                          <span>{formatDate(item[cardDateKey])}</span>
                        </div>

                        <div style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 800,
                          fontSize: '1rem',
                          color: col.id === 'PAGO' ? '#34d399' : col.id === 'VENCIDO' ? '#f87171' : '#f59e0b'
                        }}>
                          {formatBRL(item[cardAmountKey] || item.valor_compromisso || 0)}
                        </div>
                      </div>

                      {/* Quick Move Buttons */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '10px',
                        paddingTop: '8px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.04)'
                      }}>
                        {prevCol ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusChange(item[idKey], prevCol.id);
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '3px 8px', fontSize: '0.7rem' }}
                            title={`Mover para ${prevCol.title}`}
                          >
                            <MoveLeft size={12} /> {prevCol.title}
                          </button>
                        ) : <span />}

                        {nextCol ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusChange(item[idKey], nextCol.id);
                            }}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '3px 8px', fontSize: '0.7rem' }}
                            title={`Mover para ${nextCol.title}`}
                          >
                            {nextCol.title} <MoveRight size={12} />
                          </button>
                        ) : <span />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
