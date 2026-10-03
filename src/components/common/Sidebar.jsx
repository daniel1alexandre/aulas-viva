import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  UtensilsCrossed, 
  Package, 
  FileText, 
  Receipt, 
  Users, 
  GraduationCap, 
  Award, 
  Calendar, 
  FileSignature, 
  CreditCard, 
  DollarSign, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Building2, 
  Barcode, 
  Percent, 
  Database,
  RefreshCw,
  Download,
  ClipboardList
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, resetToDefaultData, exportAllToJson, getTableData } = useApp();

  const openComandasCount = (getTableData('Vendas') || []).filter(v => v.status_venda === 'AGUARDANDO_PAGAMENTO').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Geral', icon: LayoutDashboard, section: 'PRINCIPAL' },
    
    // BAR
    { id: 'pdv', label: 'PDV / Caixa', icon: ShoppingCart, section: 'MÓDULO BAR' },
    { id: 'comandas_abertas', label: 'Comandas Abertas', icon: ClipboardList, section: 'MÓDULO BAR', count: openComandasCount },
    { id: 'produtos', label: 'Produtos & Cardápio', icon: UtensilsCrossed, section: 'MÓDULO BAR' },
    { id: 'estoque', label: 'Estoque & Movimentos', icon: Package, section: 'MÓDULO BAR' },
    { id: 'notas', label: 'Notas Fiscais (NF-e)', icon: FileText, section: 'MÓDULO BAR' },
    { id: 'vendas', label: 'Vendas & Comandas', icon: Receipt, section: 'MÓDULO BAR' },

    // AULAS
    { id: 'alunos', label: 'Alunos & Matrículas', icon: Users, section: 'MÓDULO AULAS' },
    { id: 'professores', label: 'Professores', icon: GraduationCap, section: 'MÓDULO AULAS' },
    { id: 'planos', label: 'Planos de Aulas', icon: Award, section: 'MÓDULO AULAS' },
    { id: 'contratos', label: 'Contratos Pedagógicos', icon: FileSignature, section: 'MÓDULO AULAS' },
    { id: 'parcelas', label: 'Mensalidades Alunos', icon: CreditCard, section: 'MÓDULO AULAS' },
    { id: 'eventos', label: 'Torneios & Eventos', icon: Calendar, section: 'MÓDULO AULAS' },

    // FINANCEIRO
    { id: 'pagar_bar', label: 'Contas a Pagar (Bar)', icon: ArrowDownCircle, section: 'FINANCEIRO' },
    { id: 'receber_bar', label: 'Contas a Receber (Bar)', icon: ArrowUpCircle, section: 'FINANCEIRO' },
    { id: 'despesas_assoc', label: 'Despesas Associação', icon: Building2, section: 'FINANCEIRO' },
    { id: 'boletos', label: 'Boletos Bancários', icon: Barcode, section: 'FINANCEIRO' },
    { id: 'comissoes', label: 'Comissões de Docentes', icon: Percent, section: 'FINANCEIRO' },

    // SISTEMA
    { id: 'database', label: 'Dicionário de Tabelas', icon: Database, section: 'SISTEMA & DADOS' }
  ];

  // Group by sections
  const sections = Array.from(new Set(navItems.map(item => item.section)));

  return (
    <aside style={{
      width: '280px',
      backgroundColor: '#0a0f1d',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      flexShrink: 0
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
          overflow: 'hidden'
        }}>
          <img 
            src="/logo.png" 
            alt="Arena Viva" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
        <div>
          <div style={{ 
            fontFamily: 'var(--font-display)', 
            fontWeight: 800, 
            fontSize: '1.15rem', 
            letterSpacing: '-0.02em',
            color: '#fff' 
          }}>
            VIVA <span style={{ color: '#06b6d4' }}>BY BAUMANN</span>
          </div>
          <div style={{ 
            fontSize: '0.72rem', 
            color: '#94a3b8', 
            fontWeight: 600, 
            textTransform: 'uppercase',
            letterSpacing: '0.08em' 
          }}>
            Bar & Aulas Gestão
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {sections.map(section => (
          <div key={section}>
            <div style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: '#64748b',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '0 12px',
              marginBottom: '6px'
            }}>
              {section}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {navItems.filter(item => item.section === section).map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: isActive ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                      color: isActive ? '#38bdf8' : '#cbd5e1',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      borderLeft: isActive ? '3px solid #06b6d4' : '3px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Icon size={18} style={{ color: isActive ? '#06b6d4' : '#64748b', flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {item.label}
                    </span>
                    {typeof item.count === 'number' && item.count > 0 && (
                      <span style={{
                        backgroundColor: '#f59e0b',
                        color: '#111827',
                        fontSize: '0.65rem',
                        fontWeight: 900,
                        padding: '1px 6px',
                        borderRadius: '9999px'
                      }}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer System Actions */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <button
          onClick={exportAllToJson}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', justifyContent: 'flex-start' }}
          title="Exportar todos os dados em JSON"
        >
          <Download size={14} />
          <span>Backup JSON</span>
        </button>
        <button
          onClick={resetToDefaultData}
          className="btn btn-danger btn-sm"
          style={{ width: '100%', justifyContent: 'flex-start' }}
          title="Restaurar dados originais da planilha"
        >
          <RefreshCw size={14} />
          <span>Restaurar Padrão</span>
        </button>
      </div>
    </aside>
  );
};
