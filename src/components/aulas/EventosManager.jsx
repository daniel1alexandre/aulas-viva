import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { formatBRL, formatDateTime, generateId } from '../../utils/formatters';
import { Calendar, Plus, Users, MapPin, UserPlus, CheckCircle, Trash2 } from 'lucide-react';

export const EventosManager = () => {
  const { getTableData, addItem, updateItem, deleteItem, addToast } = useApp();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isInscricaoModalOpen, setIsInscricaoModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = getTableData('Eventos') || [];
  const registrations = getTableData('InscricoesEvento') || [];
  const students = getTableData('Alunos') || [];

  const [eventForm, setEventForm] = useState({
    nome_evento: '',
    data_evento: '',
    local_quadras: '',
    valor_inscricao: '',
    status_evento: 'ABERTO'
  });

  const [inscricaoForm, setInscricaoForm] = useState({
    id_evento: '',
    id_aluno: '',
    nome_participante_avulso: '',
    status_pagamento: 'CONFIRMADO'
  });

  const handleOpenAddEvent = () => {
    setEventForm({
      nome_evento: '',
      data_evento: new Date().toISOString().slice(0, 16).replace('T', ' '),
      local_quadras: 'Quadras 1 a 4 (Arena Viva)',
      valor_inscricao: '120.00',
      status_evento: 'ABERTO'
    });
    setIsEventModalOpen(true);
  };

  const handleOpenAddInscricao = (ev) => {
    setSelectedEvent(ev);
    setInscricaoForm({
      id_evento: ev.id_evento,
      id_aluno: students[0]?.id_aluno || '',
      nome_participante_avulso: '',
      status_pagamento: 'CONFIRMADO'
    });
    setIsInscricaoModalOpen(true);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!eventForm.nome_evento || !eventForm.valor_inscricao) {
      alert('Preencha os campos obrigatórios!');
      return;
    }

    addItem('Eventos', {
      id_evento: 'ev_' + generateId(),
      ...eventForm,
      valor_inscricao: Number(eventForm.valor_inscricao) || 0
    });
    setIsEventModalOpen(false);
  };

  const handleSaveInscricao = (e) => {
    e.preventDefault();
    if (!inscricaoForm.id_aluno && !inscricaoForm.nome_participante_avulso) {
      alert('Selecione um Aluno ou digite o Nome do Participante Externo!');
      return;
    }

    addItem('InscricoesEvento', {
      id_inscricao: 'ins_' + generateId(),
      ...inscricaoForm
    });

    addToast('Inscrição confirmada com sucesso!', 'success');
    setIsInscricaoModalOpen(false);
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
            <Calendar size={22} style={{ color: '#06b6d4' }} />
            Torneios, Clínicas & Eventos
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Gestão de competições oficiais, clínicas técnicas com professores convidados e controle de atletas inscritos.
          </p>
        </div>

        <button onClick={handleOpenAddEvent} className="btn btn-primary">
          <Plus size={18} />
          <span>Criar Torneio / Evento</span>
        </button>
      </div>

      {/* Events Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {events.map(ev => {
          const eventRegs = registrations.filter(r => r.id_evento === ev.id_evento);
          const confirmedCount = eventRegs.filter(r => r.status_pagamento === 'CONFIRMADO').length;

          return (
            <div key={ev.id_evento} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="glass-header" style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Badge status={ev.status_evento} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#38bdf8', fontSize: '1.15rem' }}>
                    {formatBRL(ev.valor_inscricao)}
                  </div>
                </div>

                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '12px', lineHeight: 1.3 }}>
                    {ev.nome_evento}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.825rem', color: '#cbd5e1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={15} style={{ color: '#06b6d4' }} />
                      <span>{formatDateTime(ev.data_evento)}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={15} style={{ color: '#f59e0b' }} />
                      <span>{ev.local_quadras || 'Arena Viva'}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Users size={15} style={{ color: '#10b981' }} />
                      <span>{eventRegs.length} atletas inscritos ({confirmedCount} confirmados)</span>
                    </div>
                  </div>

                  {/* Registered athletes list preview */}
                  <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Atletas Confirmados:
                    </div>
                    {eventRegs.length === 0 ? (
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Nenhum atleta inscrito até o momento.</div>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {eventRegs.slice(0, 5).map(r => {
                          const al = students.find(s => s.id_aluno === r.id_aluno);
                          return (
                            <span
                              key={r.id_inscricao}
                              style={{
                                backgroundColor: '#1e293b',
                                color: '#e2e8f0',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                border: '1px solid rgba(255,255,255,0.06)'
                              }}
                            >
                              {al ? al.nome_completo : r.nome_participante_avulso}
                            </span>
                          );
                        })}
                        {eventRegs.length > 5 && (
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', alignSelf: 'center' }}>
                            +{eventRegs.length - 5} outros
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div style={{
                padding: '12px 20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                backgroundColor: 'rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <button
                  onClick={() => handleOpenAddInscricao(ev)}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '6px' }}
                >
                  <UserPlus size={14} />
                  <span>Inscrever Atleta</span>
                </button>

                <select
                  className="form-control"
                  style={{ width: 'auto', padding: '4px 10px', fontSize: '0.75rem' }}
                  value={ev.status_evento}
                  onChange={(e) => updateItem('Eventos', 'id_evento', ev.id_evento, { status_evento: e.target.value })}
                >
                  <option value="ABERTO">ABERTO</option>
                  <option value="LOTADO">LOTADO</option>
                  <option value="EM_ANDAMENTO">EM ANDAMENTO</option>
                  <option value="FINALIZADO">FINALIZADO</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Create Event */}
      <Modal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        title="Criar Novo Torneio ou Evento"
        footer={
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => setIsEventModalOpen(false)} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="button" onClick={handleSaveEvent} className="btn btn-primary">
              Publicar Evento
            </button>
          </div>
        }
      >
        <form onSubmit={handleSaveEvent}>
          <div className="input-group">
            <label className="input-label">Nome Oficial do Torneio / Evento *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex.: 2º Circuito Arena Viva By Baumann - Joinville"
              value={eventForm.nome_evento}
              onChange={(e) => setEventForm({ ...eventForm, nome_evento: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Data e Horário de Início *</label>
              <input
                type="text"
                className="form-control"
                placeholder="2026-10-24 08:30"
                value={eventForm.data_evento}
                onChange={(e) => setEventForm({ ...eventForm, data_evento: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Valor da Inscrição por Atleta (R$) *</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="0.00"
                value={eventForm.valor_inscricao}
                onChange={(e) => setEventForm({ ...eventForm, valor_inscricao: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Local e Quadras Reservadas</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex.: Quadras 1 a 6 (Complexo Viva)"
              value={eventForm.local_quadras}
              onChange={(e) => setEventForm({ ...eventForm, local_quadras: e.target.value })}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Status Inicial</label>
            <select
              className="form-control"
              value={eventForm.status_evento}
              onChange={(e) => setEventForm({ ...eventForm, status_evento: e.target.value })}
            >
              <option value="ABERTO">ABERTO</option>
              <option value="LOTADO">LOTADO</option>
              <option value="EM_ANDAMENTO">EM ANDAMENTO</option>
              <option value="FINALIZADO">FINALIZADO</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Modal Inscription */}
      <Modal
        isOpen={isInscricaoModalOpen}
        onClose={() => setIsInscricaoModalOpen(false)}
        title={`Inscrever Atleta — ${selectedEvent?.nome_evento}`}
        footer={
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => setIsInscricaoModalOpen(false)} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="button" onClick={handleSaveInscricao} className="btn btn-primary">
              Confirmar Inscrição
            </button>
          </div>
        }
      >
        <form onSubmit={handleSaveInscricao}>
          <div className="input-group">
            <label className="input-label">Atleta Matriculado na Arena (Opcional)</label>
            <select
              className="form-control"
              value={inscricaoForm.id_aluno}
              onChange={(e) => setInscricaoForm({ ...inscricaoForm, id_aluno: e.target.value, nome_participante_avulso: '' })}
            >
              <option value="">Atleta Convidado Externo (digite abaixo)</option>
              {students.map(al => (
                <option key={al.id_aluno} value={al.id_aluno}>{al.nome_completo} (CPF: {al.cpf})</option>
              ))}
            </select>
          </div>

          {!inscricaoForm.id_aluno && (
            <div className="input-group">
              <label className="input-label">Nome do Participante Avulso / Convidado</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ex.: Mariana Fernandes"
                value={inscricaoForm.nome_participante_avulso}
                onChange={(e) => setInscricaoForm({ ...inscricaoForm, nome_participante_avulso: e.target.value })}
              />
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Status do Pagamento da Inscrição *</label>
            <select
              className="form-control"
              value={inscricaoForm.status_pagamento}
              onChange={(e) => setInscricaoForm({ ...inscricaoForm, status_pagamento: e.target.value })}
            >
              <option value="CONFIRMADO">CONFIRMADO</option>
              <option value="PENDENTE">PENDENTE</option>
              <option value="ISENTO">ISENTO</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};
