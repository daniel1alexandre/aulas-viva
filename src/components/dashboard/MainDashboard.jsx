import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import { formatBRL, formatDate, formatDateTime } from '../../utils/formatters';
import { 
  DollarSign, 
  Users, 
  Package, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Building2, 
  Calendar, 
  ShoppingCart, 
  AlertTriangle,
  Award,
  ChevronRight,
  TrendingUp,
  Receipt,
  ClipboardList
} from 'lucide-react';

export const MainDashboard = () => {
  const { getTableData, setActiveTab } = useApp();

  const sales = getTableData('Vendas') || [];
  const products = getTableData('ProdutosServicos') || [];
  const students = getTableData('Alunos') || [];
  const payables = getTableData('ContasPagarBar') || [];
  const receivables = getTableData('ContasReceberBar') || [];
  const associationExpenses = getTableData('PagamentosAssociacao') || [];
  const parcelas = getTableData('ParcelasAluno') || [];
  const events = getTableData('Eventos') || [];
  const notifications = getTableData('AvisosRecebimentos') || [];

  // Calculations
  const totalBarSales = sales
    .filter(s => s.status_venda === 'FINALIZADA')
    .reduce((sum, s) => sum + (s.valor_total || 0), 0);

  const totalAulasReceived = parcelas
    .filter(p => p.status_parcela === 'PAGA')
    .reduce((sum, p) => sum + (p.valor_parcela || 0), 0);

  const activeStudents = students.filter(s => s.status_matricula === 'ATIVO').length;
  const overdueStudents = students.filter(s => s.status_matricula === 'INADIMPLENTE').length;

  const lowStockProducts = products.filter(p => p.tipo === 'PRODUTO' && p.estoque_atual <= p.estoque_minimo);

  const pendingPayables = payables
    .filter(p => p.status_card !== 'PAGO')
    .reduce((sum, p) => sum + (p.valor_devido || 0), 0);

  const pendingReceivables = receivables
    .filter(r => r.status_card !== 'PAGO')
    .reduce((sum, r) => sum + (r.valor_devido || 0), 0);

  const pendingAssoc = associationExpenses
    .filter(a => a.status_card !== 'PAGO')
    .reduce((sum, a) => sum + (a.valor_compromisso || 0), 0);

  const openComandas = sales.filter(s => s.status_venda === 'AGUARDANDO_PAGAMENTO');
  const openComandasTotal = openComandas.reduce((sum, s) => sum + (s.valor_total || 0), 0);

  return (
    <div className="page-wrapper">
      
      {/* Hero Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.25)',
        borderRadius: '20px',
        padding: '28px 32px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <div style={{ maxWidth: '650px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(6, 182, 212, 0.2)', color: '#38bdf8', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px' }}>
            <Award size={14} /> Arena Viva By Baumann • Gestão Operacional
          </div>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#fff', margin: '4px 0 8px', letterSpacing: '-0.02em' }}>
            Painel de Controle Integrado <span className="gradient-text">(Bar & Aulas)</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
            Visão consolidada das 20 tabelas do modelo de dados: vendas de PDV, controle de estoque com alertas, mensalidades de treinos e quadros Kanban de compromissos financeiros.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setActiveTab('pdv')} className="btn btn-primary btn-lg" style={{ gap: '8px' }}>
            <ShoppingCart size={18} />
            <span>Abrir Caixa PDV</span>
          </button>
          <button onClick={() => setActiveTab('alunos')} className="btn btn-secondary btn-lg" style={{ gap: '8px' }}>
            <Users size={18} />
            <span>Ver Alunos</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <StatCard
          title="Faturamento Bar (PDV)"
          value={formatBRL(totalBarSales)}
          subtitle="Vendas acumuladas"
          icon={Receipt}
          color="#06b6d4"
          trend={{ isPositive: true, text: 'Em alta' }}
          onClick={() => setActiveTab('vendas')}
        />

        <StatCard
          title="Comandas em Aberto"
          value={`${openComandas.length} mesa(s)`}
          subtitle={`Consumo: ${formatBRL(openComandasTotal)}`}
          icon={ClipboardList}
          color="#f59e0b"
          trend={{ isPositive: true, text: 'Pagar no fim do dia' }}
          onClick={() => setActiveTab('comandas_abertas')}
        />

        <StatCard
          title="Aulas & Mensalidades"
          value={formatBRL(totalAulasReceived)}
          subtitle="Quitações recebidas"
          icon={DollarSign}
          color="#10b981"
          trend={{ isPositive: true, text: 'Em dia' }}
          onClick={() => setActiveTab('parcelas')}
        />

        <StatCard
          title="Alunos Ativos"
          value={activeStudents}
          subtitle={overdueStudents > 0 ? `${overdueStudents} inadimplente(s)` : 'Nenhuma pendência'}
          icon={Users}
          color="#38bdf8"
          onClick={() => setActiveTab('alunos')}
        />

        <StatCard
          title="A Pagar (Bar & NFs)"
          value={formatBRL(pendingPayables)}
          subtitle="Compromissos pendentes"
          icon={ArrowDownCircle}
          color="#ef4444"
          onClick={() => setActiveTab('pagar_bar')}
        />

        <StatCard
          title="A Receber (Bar / A Prazo)"
          value={formatBRL(pendingReceivables)}
          subtitle="Crédito de comandas"
          icon={ArrowUpCircle}
          color="#f59e0b"
          onClick={() => setActiveTab('receber_bar')}
        />

        <StatCard
          title="Despesas Associação"
          value={formatBRL(pendingAssoc)}
          subtitle="Aluguel, Luz, etc."
          icon={Building2}
          color="#a855f7"
          onClick={() => setActiveTab('despesas_assoc')}
        />
      </div>

      {/* Operational Sections: Alerts & Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '24px' }}>
        
        {/* Left Column: Recent Sales & Low Stock warnings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Low Stock Warning Card */}
          {lowStockProducts.length > 0 && (
            <div className="glass-panel" style={{ borderLeft: '4px solid #ef4444' }}>
              <div className="glass-header" style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171' }}>
                  <AlertTriangle size={18} />
                  <h3 style={{ fontSize: '1rem', margin: 0, color: '#f8fafc' }}>
                    Alerta de Estoque Mínimo no Bar ({lowStockProducts.length} itens críticos)
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('produtos')}
                  className="btn btn-secondary btn-sm"
                >
                  Ver Catálogo
                </button>
              </div>

              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {lowStockProducts.map(p => (
                    <div
                      key={p.id_item}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: 'rgba(239, 68, 68, 0.08)',
                        borderRadius: '8px',
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                      }}
                    >
                      <div>
                        <strong style={{ color: '#fff', fontSize: '0.85rem' }}>{p.nome_item}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          Mínimo estipulado: {p.estoque_minimo} {p.unidade_medida}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#f87171', fontSize: '1rem' }}>
                          {p.estoque_atual} {p.unidade_medida}
                        </span>
                        <div style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700 }}>
                          REPOSIÇÃO URGENTE
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recent Sales List */}
          <div className="glass-panel">
            <div className="glass-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Receipt size={18} style={{ color: '#06b6d4' }} />
                <h3 style={{ fontSize: '1rem', margin: 0 }}>Últimas Vendas & Comandas do Bar</h3>
              </div>
              <button onClick={() => setActiveTab('vendas')} className="btn btn-secondary btn-sm">
                Histórico Completo
              </button>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Comanda</th>
                    <th>Data / Hora</th>
                    <th>Pagamento</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.slice(0, 5).map(v => (
                    <tr key={v.id_venda}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fff' }}>
                        #{v.id_venda}
                      </td>
                      <td style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>
                        {formatDateTime(v.data_venda)}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>
                          {v.forma_pagamento}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#fff' }}>
                        {formatBRL(v.valor_total)}
                      </td>
                      <td>
                        <Badge status={v.status_venda} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Upcoming Events & Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Upcoming Tournaments & Clinics */}
          <div className="glass-panel">
            <div className="glass-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} style={{ color: '#f59e0b' }} />
                <h3 style={{ fontSize: '1rem', margin: 0 }}>Torneios & Clínicas na Arena</h3>
              </div>
              <button onClick={() => setActiveTab('eventos')} className="btn btn-secondary btn-sm">
                Ver Todos
              </button>
            </div>

            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {events.slice(0, 3).map(ev => (
                <div
                  key={ev.id_evento}
                  style={{
                    background: '#1e293b',
                    padding: '14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <Badge status={ev.status_evento} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#38bdf8', fontSize: '0.9rem' }}>
                      {formatBRL(ev.valor_inscricao)}
                    </span>
                  </div>

                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '6px' }}>
                    {ev.nome_evento}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {ev.data_evento} • {ev.local_quadras}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Access to Kanbans */}
          <div className="glass-panel">
            <div className="glass-header">
              <h3 style={{ fontSize: '1rem', margin: 0 }}>Acesso Rápido aos Fluxos Kanban</h3>
            </div>

            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                onClick={() => setActiveTab('pagar_bar')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: '#1e293b',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ArrowDownCircle size={18} style={{ color: '#ef4444' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>Kanban Contas a Pagar</div>
                    <div style={{ fontSize: '0.725rem', color: '#94a3b8' }}>Aberto • Agendado • Vencido • Pago</div>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: '#94a3b8' }} />
              </div>

              <div
                onClick={() => setActiveTab('receber_bar')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: '#1e293b',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ArrowUpCircle size={18} style={{ color: '#10b981' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>Kanban Contas a Receber</div>
                    <div style={{ fontSize: '0.725rem', color: '#94a3b8' }}>Aberto • Vencido • Pago</div>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: '#94a3b8' }} />
              </div>

              <div
                onClick={() => setActiveTab('despesas_assoc')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: '#1e293b',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Building2 size={18} style={{ color: '#a855f7' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>Despesas da Associação</div>
                    <div style={{ fontSize: '0.725rem', color: '#94a3b8' }}>A Vencer • Vencendo • Vencido • Pago</div>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: '#94a3b8' }} />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
