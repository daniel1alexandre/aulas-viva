import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Navbar } from './components/common/Navbar';
import { ToastContainer } from './components/common/ToastContainer';

// Screens
import { MainDashboard } from './components/dashboard/MainDashboard';
import { PDVScreen } from './components/bar/PDVScreen';
import { ComandasAbertasScreen } from './components/bar/ComandasAbertasScreen';
import { ProdutosManager } from './components/bar/ProdutosManager';
import { EstoqueManager } from './components/bar/EstoqueManager';
import { NotasFiscaisManager } from './components/bar/NotasFiscaisManager';
import { VendasHistory } from './components/bar/VendasHistory';
import { AlunosManager } from './components/aulas/AlunosManager';
import { ProfessoresManager } from './components/aulas/ProfessoresManager';
import { PlanosManager } from './components/aulas/PlanosManager';
import { ContratosManager } from './components/aulas/ContratosManager';
import { ParcelasManager } from './components/aulas/ParcelasManager';
import { EventosManager } from './components/aulas/EventosManager';
import { ContasPagarBarKanban } from './components/financeiro/ContasPagarBarKanban';
import { ContasReceberBarKanban } from './components/financeiro/ContasReceberBarKanban';
import { PagamentosAssocKanban } from './components/financeiro/PagamentosAssocKanban';
import { BoletosManager } from './components/financeiro/BoletosManager';
import { ComissoesManager } from './components/financeiro/ComissoesManager';
import { SchemaViewer } from './components/database/SchemaViewer';

const AppContent = () => {
  const { activeTab } = useApp();

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard': return <MainDashboard />;
      case 'pdv': return <PDVScreen />;
      case 'comandas_abertas': return <ComandasAbertasScreen />;
      case 'produtos': return <ProdutosManager />;
      case 'estoque': return <EstoqueManager />;
      case 'notas': return <NotasFiscaisManager />;
      case 'vendas': return <VendasHistory />;
      case 'alunos': return <AlunosManager />;
      case 'professores': return <ProfessoresManager />;
      case 'planos': return <PlanosManager />;
      case 'contratos': return <ContratosManager />;
      case 'parcelas': return <ParcelasManager />;
      case 'eventos': return <EventosManager />;
      case 'pagar_bar': return <ContasPagarBarKanban />;
      case 'receber_bar': return <ContasReceberBarKanban />;
      case 'despesas_assoc': return <PagamentosAssocKanban />;
      case 'boletos': return <BoletosManager />;
      case 'comissoes': return <ComissoesManager />;
      case 'database': return <SchemaViewer />;
      default: return <MainDashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        {renderActiveScreen()}
      </div>
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
