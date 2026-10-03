import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { formatBRL, formatDateTime } from '../../utils/formatters';
import { Receipt, Eye, Search, Filter } from 'lucide-react';

export const VendasHistory = () => {
  const { getTableData } = useApp();
  const [selectedSale, setSelectedSale] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState('ALL');

  const sales = getTableData('Vendas') || [];
  const saleItems = getTableData('ItensVenda') || [];
  const products = getTableData('ProdutosServicos') || [];
  const students = getTableData('Alunos') || [];

  const filteredSales = sales.filter(s => {
    if (paymentFilter !== 'ALL' && s.forma_pagamento !== paymentFilter) return false;
    return true;
  });

  const totalRevenue = filteredSales
    .filter(s => s.status_venda === 'FINALIZADA')
    .reduce((sum, s) => sum + (s.valor_total || 0), 0);

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
            <Receipt size={22} style={{ color: '#06b6d4' }} />
            Histórico de Vendas & Comandas do Bar
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Consulta de cupons emitidos, faturamento por meio de pagamento e detalhamento de consumo.
          </p>
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', background: '#1e293b', borderRadius: '8px', padding: '3px', flexWrap: 'wrap' }}>
          {['ALL', 'PIX', 'CARTAO_DEB', 'CARTAO_CRED', 'DINHEIRO', 'PRAZO'].map(pm => (
            <button
              key={pm}
              onClick={() => setPaymentFilter(pm)}
              className={`btn btn-sm ${paymentFilter === pm ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none', fontSize: '0.75rem' }}
            >
              {pm === 'ALL' ? 'Todas' : pm}
            </button>
          ))}
        </div>
      </div>

      {/* Total Banner */}
      <div className="stat-card" style={{ marginBottom: '20px', maxWidth: '320px' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>FATURAMENTO FILTRADO</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#38bdf8' }}>{formatBRL(totalRevenue)}</div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="glass-panel">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Comanda / Venda</th>
                <th>Data e Hora</th>
                <th>Cliente / Aluno</th>
                <th>Meio de Pagamento</th>
                <th>Valor Total</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    Nenhuma venda registrada com este filtro.
                  </td>
                </tr>
              ) : (
                filteredSales.map(v => {
                  const student = students.find(s => s.id_aluno === v.id_cliente_aluno);
                  return (
                    <tr key={v.id_venda}>
                      <td style={{ fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                        #{v.id_venda}
                      </td>
                      <td style={{ color: '#cbd5e1', fontSize: '0.825rem' }}>
                        {formatDateTime(v.data_venda)}
                      </td>
                      <td style={{ fontWeight: 600, color: '#f8fafc' }}>
                        {student ? student.nome_completo : 'Cliente Balcão / Avulso'}
                      </td>
                      <td>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: v.forma_pagamento === 'PIX' ? 'rgba(16, 185, 129, 0.15)' : v.forma_pagamento === 'PRAZO' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                          color: v.forma_pagamento === 'PIX' ? '#34d399' : v.forma_pagamento === 'PRAZO' ? '#fbbf24' : '#60a5fa'
                        }}>
                          {v.forma_pagamento}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1rem', color: '#fff' }}>
                        {formatBRL(v.valor_total)}
                      </td>
                      <td>
                        <Badge status={v.status_venda} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedSale(v)}
                          className="btn btn-secondary btn-sm"
                        >
                          <Eye size={14} /> Cupom
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

      {/* Sale Detail Modal */}
      {selectedSale && (
        <Modal
          isOpen={Boolean(selectedSale)}
          onClose={() => setSelectedSale(null)}
          title={`Cupom Fiscal da Venda #${selectedSale.id_venda}`}
          footer={
            <button onClick={() => setSelectedSale(null)} className="btn btn-secondary">
              Fechar
            </button>
          }
        >
          <div>
            <div style={{ background: '#111827', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Data/Hora:</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{formatDateTime(selectedSale.data_venda)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Forma de Pagamento:</span>
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>{selectedSale.forma_pagamento}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Status:</span>
                <Badge status={selectedSale.status_venda} />
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>
              Itens do Pedido (ItensVenda)
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qtd</th>
                    <th>Preço Un.</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {saleItems.filter(i => i.id_venda === selectedSale.id_venda).map(item => {
                    const prod = products.find(p => p.id_item === item.id_item);
                    return (
                      <tr key={item.id_item_venda}>
                        <td style={{ fontWeight: 600, color: '#fff' }}>
                          {prod ? prod.nome_item : item.id_item}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{item.quantidade}</td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{formatBRL(item.preco_unitario)}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, textAlign: 'right', color: '#38bdf8' }}>
                          {formatBRL(item.quantidade * item.preco_unitario)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255,255,255,0.08)'
            }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#94a3b8' }}>Total Pago:</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 900, color: '#34d399' }}>
                {formatBRL(selectedSale.valor_total)}
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
