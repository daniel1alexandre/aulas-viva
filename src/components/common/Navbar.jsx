import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Search, 
  PlusCircle, 
  MapPin, 
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  ClipboardList
} from 'lucide-react';

export const Navbar = () => {
  const { activeTab, setActiveTab, globalSearch, setGlobalSearch, getTableData, updateItem } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = getTableData('AvisosRecebimentos') || [];
  const unreadCount = notifications.filter(n => !n.lido).length;

  const vendas = getTableData('Vendas') || [];
  const openComandasCount = vendas.filter(v => v.status_venda === 'AGUARDANDO_PAGAMENTO').length;

  const markAllAsRead = () => {
    notifications.forEach(n => {
      if (!n.lido) {
        updateItem('AvisosRecebimentos', 'id_aviso', n.id_aviso, { lido: true });
      }
    });
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return { title: 'Dashboard Executivo', subtitle: 'Métricas gerais e fluxo operacional em tempo real' };
      case 'pdv': return { title: 'Frente de Caixa (PDV)', subtitle: 'Lançamento rápido de pedidos, comandas e vendas a prazo' };
      case 'comandas_abertas': return { title: 'Comandas em Aberto (Bar)', subtitle: 'Consumo acumulado no local para liquidação ao final do dia' };
      case 'produtos': return { title: 'Cardápio & Catálogo de Itens', subtitle: 'Gestão de produtos, porções, bebidas e serviços' };
      case 'estoque': return { title: 'Movimentações de Estoque', subtitle: 'Controle de entradas por notas e saídas por vendas' };
      case 'notas': return { title: 'Notas Fiscais de Entrada (NF-e)', subtitle: 'Registro contábil de compras e vínculos tributários (NCM/CEST)' };
      case 'vendas': return { title: 'Histórico de Vendas', subtitle: 'Relatório de comandas faturadas e meios de pagamento' };
      case 'alunos': return { title: 'Gestão de Atletas & Alunos', subtitle: 'Matrículas, planos contratados e status cadastral' };
      case 'professores': return { title: 'Corpo Docente & Treinadores', subtitle: 'Controle de comissionamento e chaves bancárias PIX' };
      case 'planos': return { title: 'Planos de Aulas', subtitle: 'Tabela de modalidades, frequências e durações de treino' };
      case 'contratos': return { title: 'Contratos de Alunos & Treinadores', subtitle: 'Vínculos pedagógicos e percentuais comissionados' };
      case 'parcelas': return { title: 'Mensalidades de Alunos', subtitle: 'Controle de liquidação e liberação automática de repasses' };
      case 'eventos': return { title: 'Torneios, Clínicas & Eventos', subtitle: 'Inscrições de atletas e locação de quadras' };
      case 'pagar_bar': return { title: 'Kanban - Contas a Pagar (Bar)', subtitle: 'Fluxo visual por status (Aberto, Agendado, Vencido, Pago)' };
      case 'receber_bar': return { title: 'Kanban - Contas a Receber (Bar)', subtitle: 'Cobrança de vendas a prazo e pendências de consumo' };
      case 'despesas_assoc': return { title: 'Kanban - Despesas da Associação', subtitle: 'Obrigações fixas (Luz, Água, Aluguel, IPTU, etc.)' };
      case 'boletos': return { title: 'Boletos Bancários', subtitle: 'Títulos com linha digitável e controle de quitação' };
      case 'comissoes': return { title: 'Repasse de Comissões Docentes', subtitle: 'Provisão, liberação pós-pagamento e quitação de instrutores' };
      case 'database': return { title: 'Dicionário de Tabelas do Sistema', subtitle: 'Especificação técnica completa extraída da planilha do modelo' };
      default: return { title: 'Viva By Baumann', subtitle: 'Gestão Integrada' };
    }
  };

  const { title, subtitle } = getPageTitle();

  return (
    <header style={{
      height: '70px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      backgroundColor: 'rgba(10, 15, 29, 0.8)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Current Screen Title */}
      <div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0, lineHeight: 1.2 }}>
          {title}
        </h1>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
          {subtitle}
        </p>
      </div>

      {/* Center / Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Search Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#1e293b',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '9999px',
          padding: '6px 14px',
          width: '260px'
        }}>
          <Search size={15} style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Buscar no sistema..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#f8fafc',
              fontSize: '0.825rem',
              width: '100%'
            }}
          />
          {globalSearch && (
            <button 
              onClick={() => setGlobalSearch('')}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Location Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.775rem',
          color: '#cbd5e1',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <MapPin size={14} style={{ color: '#06b6d4' }} />
          <span>Arena Viva Joinville</span>
        </div>

        {/* Notifications Dropdown Toggle */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              position: 'relative',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#e2e8f0'
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: '#ef4444',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 800,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '360px',
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
              overflow: 'hidden',
              zIndex: 200
            }}>
              <div style={{
                padding: '14px 18px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                  Avisos de Cobrança & Alertas
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#06b6d4',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Marcar lidos
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '8px' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                    Nenhum aviso no momento.
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id_aviso}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: notif.lido ? 'transparent' : 'rgba(6, 182, 212, 0.06)',
                        borderLeft: notif.prioridade === 'URGENTE' 
                          ? '3px solid #ef4444' 
                          : notif.prioridade === 'MEDIA' 
                            ? '3px solid #f59e0b' 
                            : '3px solid #06b6d4',
                        marginBottom: '6px',
                        fontSize: '0.825rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: notif.prioridade === 'URGENTE' ? '#f87171' : notif.prioridade === 'MEDIA' ? '#fbbf24' : '#38bdf8'
                        }}>
                          {notif.prioridade}
                        </span>
                        {!notif.lido && (
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#06b6d4' }} />
                        )}
                      </div>
                      <div style={{ color: '#e2e8f0', lineHeight: 1.4 }}>
                        {notif.mensagem_texto}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Comandas Abertas Quick Button */}
        <button
          onClick={() => setActiveTab('comandas_abertas')}
          className="btn btn-secondary btn-sm"
          style={{
            gap: '6px',
            backgroundColor: openComandasCount > 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            borderColor: openComandasCount > 0 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255, 255, 255, 0.1)',
            color: openComandasCount > 0 ? '#fbbf24' : '#94a3b8',
            fontWeight: 700
          }}
          title="Ver comandas em aberto para pagamento no final do dia"
        >
          <ClipboardList size={16} />
          <span>{openComandasCount} Comanda{openComandasCount === 1 ? '' : 's'} Aberta{openComandasCount === 1 ? '' : 's'}</span>
        </button>

        {/* Quick PDV Button */}
        <button
          onClick={() => setActiveTab('pdv')}
          className="btn btn-primary btn-sm"
          style={{ gap: '6px' }}
        >
          <PlusCircle size={16} />
          <span>Novo Pedido PDV</span>
        </button>
      </div>
    </header>
  );
};
