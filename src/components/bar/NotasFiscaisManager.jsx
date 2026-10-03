import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { formatBRL, formatCNPJ } from '../../utils/formatters';
import { FileText, Plus, Trash2, Eye, CheckCircle2 } from 'lucide-react';

export const NotasFiscaisManager = () => {
  const { getTableData, registerInvoice } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewInvoice, setViewInvoice] = useState(null);

  const invoices = getTableData('NotasFiscais') || [];
  const invoiceItems = getTableData('ItensNota') || [];
  const products = getTableData('ProdutosServicos') || [];

  const [invoiceForm, setInvoiceForm] = useState({
    numero_nf: '',
    chave_acesso: '',
    fornecedor_nome: '',
    fornecedor_cnpj: '',
    valor_total_nf: '',
    data_vencimento: new Date().toISOString().split('T')[0]
  });

  const [itemsList, setItemsList] = useState([
    { id_item: products.find(p => p.tipo === 'PRODUTO')?.id_item || '', ncm: '22030000', cest: '0300100', quantidade: 24, valor_unitario: 5.80 }
  ]);

  const handleAddItemRow = () => {
    setItemsList(prev => [
      ...prev,
      { id_item: products.find(p => p.tipo === 'PRODUTO')?.id_item || '', ncm: '00000000', cest: '0000000', quantidade: 1, valor_unitario: 0 }
    ]);
  };

  const handleRemoveItemRow = (idx) => {
    setItemsList(prev => prev.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx, field, value) => {
    setItemsList(prev => prev.map((item, i) => {
      if (i === idx) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const calculatedTotal = itemsList.reduce((sum, it) => sum + (Number(it.quantidade || 0) * Number(it.valor_unitario || 0)), 0);

  const handleOpenAdd = () => {
    setViewInvoice(null);
    setInvoiceForm({
      numero_nf: '',
      chave_acesso: '',
      fornecedor_nome: '',
      fornecedor_cnpj: '',
      valor_total_nf: '',
      data_vencimento: new Date().toISOString().split('T')[0]
    });
    setItemsList([
      { id_item: products.find(p => p.tipo === 'PRODUTO')?.id_item || '', ncm: '22030000', cest: '0300100', quantidade: 24, valor_unitario: 5.80 }
    ]);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!invoiceForm.numero_nf || !invoiceForm.fornecedor_nome || !invoiceForm.fornecedor_cnpj) {
      alert('Preencha os campos obrigatórios da Nota Fiscal!');
      return;
    }

    if (itemsList.length === 0) {
      alert('Adicione ao menos um item de mercadoria à Nota Fiscal!');
      return;
    }

    registerInvoice({
      invoice: {
        ...invoiceForm,
        valor_total_nf: Number(invoiceForm.valor_total_nf) || calculatedTotal
      },
      items: itemsList
    });

    setIsModalOpen(false);
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
            <FileText size={22} style={{ color: '#06b6d4' }} />
            Notas Fiscais de Entrada (NF-e) & Itens
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Registro contábil de compras de fornecedores. Ao cadastrar, o estoque é incrementado e uma Conta a Pagar é gerada automaticamente.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} />
          <span>Lançar Nova NF-e</span>
        </button>
      </div>

      {/* Invoices List */}
      <div className="glass-panel">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Número NF</th>
                <th>Fornecedor / Razão Social</th>
                <th>CNPJ</th>
                <th>Chave de Acesso SEFAZ</th>
                <th>Valor Bruto Total</th>
                <th>Itens Faturados</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    Nenhuma nota fiscal cadastrada.
                  </td>
                </tr>
              ) : (
                invoices.map(nf => {
                  const itCount = invoiceItems.filter(i => i.id_nota === nf.id_nota).length;
                  return (
                    <tr key={nf.id_nota}>
                      <td style={{ fontWeight: 800, color: '#38bdf8' }}>
                        NF {nf.numero_nf}
                      </td>
                      <td style={{ fontWeight: 600, color: '#fff' }}>
                        {nf.fornecedor_nome}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#cbd5e1' }}>
                        {formatCNPJ(nf.fornecedor_cnpj)}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#94a3b8' }}>
                        {nf.chave_acesso ? `${nf.chave_acesso.slice(0, 16)}...` : '—'}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>
                        {formatBRL(nf.valor_total_nf)}
                      </td>
                      <td>
                        <span style={{
                          backgroundColor: 'rgba(255,255,255,0.06)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          {itCount} item(ns)
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => setViewInvoice(nf)}
                          className="btn btn-secondary btn-sm"
                        >
                          <Eye size={14} /> Ver Itens
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

      {/* Modal View Invoice Items */}
      {viewInvoice && (
        <Modal
          isOpen={Boolean(viewInvoice)}
          onClose={() => setViewInvoice(null)}
          title={`Itens da NF-e ${viewInvoice.numero_nf} — ${viewInvoice.fornecedor_nome}`}
          maxWidth="750px"
          footer={
            <button onClick={() => setViewInvoice(null)} className="btn btn-secondary">
              Fechar
            </button>
          }
        >
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px', background: '#1e293b', padding: '12px', borderRadius: '8px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Fornecedor:</span>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>{viewInvoice.fornecedor_nome}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>CNPJ:</span>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{formatCNPJ(viewInvoice.fornecedor_cnpj)}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Total da Nota:</span>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#38bdf8' }}>{formatBRL(viewInvoice.valor_total_nf)}</div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>
              Itens da Nota (ItensNota)
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item Catálogo</th>
                    <th>NCM</th>
                    <th>CEST</th>
                    <th>Quantidade</th>
                    <th>Custo Unitário</th>
                    <th>Total Item</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.filter(i => i.id_nota === viewInvoice.id_nota).map(item => {
                    const prod = products.find(p => p.id_item === item.id_item);
                    return (
                      <tr key={item.id_item_nota}>
                        <td style={{ fontWeight: 600, color: '#fff' }}>
                          {prod ? prod.nome_item : item.id_item}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{item.ncm}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{item.cest}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{item.quantidade}</td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{formatBRL(item.valor_unitario)}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#38bdf8' }}>
                          {formatBRL(item.quantidade * item.valor_unitario)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Add Invoice */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Lançamento Completo de Nota Fiscal (NF-e)"
        maxWidth="800px"
        footer={
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="button" onClick={handleSubmit} className="btn btn-primary">
              Cadastrar NF & Entrada em Estoque
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Número da NF-e *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ex.: 000.012.345"
                value={invoiceForm.numero_nf}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, numero_nf: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">CNPJ do Fornecedor *</label>
              <input
                type="text"
                className="form-control"
                placeholder="00.000.000/0000-00"
                value={invoiceForm.fornecedor_cnpj}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, fornecedor_cnpj: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Nome / Razão Social do Fornecedor *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex.: Distribuidora de Bebidas Joinville Ltda"
              value={invoiceForm.fornecedor_nome}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, fornecedor_nome: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Chave de Acesso SEFAZ (44 dígitos)</label>
            <input
              type="text"
              className="form-control"
              maxLength={44}
              placeholder="42261012345678000190550010000104201876543210"
              value={invoiceForm.chave_acesso}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, chave_acesso: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Data de Vencimento da Fatura *</label>
              <input
                type="date"
                className="form-control"
                value={invoiceForm.data_vencimento}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, data_vencimento: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Valor Total da NF (R$)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder={calculatedTotal.toFixed(2)}
                value={invoiceForm.valor_total_nf}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, valor_total_nf: e.target.value })}
              />
            </div>
          </div>

          {/* Dynamic Invoice Items */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase' }}>
                Itens da Nota (ItensNota)
              </span>
              <button
                type="button"
                onClick={handleAddItemRow}
                className="btn btn-secondary btn-sm"
              >
                <Plus size={14} /> Adicionar Item
              </button>
            </div>

            {itemsList.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 40px',
                  gap: '8px',
                  alignItems: 'end',
                  marginBottom: '10px',
                  background: '#111827',
                  padding: '10px',
                  borderRadius: '8px'
                }}
              >
                <div>
                  <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Produto</label>
                  <select
                    className="form-control"
                    style={{ padding: '6px 8px', fontSize: '0.8rem' }}
                    value={item.id_item}
                    onChange={(e) => handleItemChange(idx, 'id_item', e.target.value)}
                  >
                    {products.filter(p => p.tipo === 'PRODUTO').map(p => (
                      <option key={p.id_item} value={p.id_item}>{p.nome_item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>NCM (8 dig)</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ padding: '6px 8px', fontSize: '0.8rem' }}
                    value={item.ncm}
                    onChange={(e) => handleItemChange(idx, 'ncm', e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>CEST (7 dig)</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ padding: '6px 8px', fontSize: '0.8rem' }}
                    value={item.cest}
                    onChange={(e) => handleItemChange(idx, 'cest', e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Qtd</label>
                  <input
                    type="number"
                    step="1"
                    className="form-control"
                    style={{ padding: '6px 8px', fontSize: '0.8rem' }}
                    value={item.quantidade}
                    onChange={(e) => handleItemChange(idx, 'quantidade', e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Custo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    style={{ padding: '6px 8px', fontSize: '0.8rem' }}
                    value={item.valor_unitario}
                    onChange={(e) => handleItemChange(idx, 'valor_unitario', e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItemRow(idx)}
                  disabled={itemsList.length <= 1}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ef4444',
                    cursor: itemsList.length <= 1 ? 'not-allowed' : 'pointer',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <div style={{ textAlign: 'right', marginTop: '10px', fontSize: '0.9rem', color: '#94a3b8' }}>
              Subtotal Calculado dos Itens: <strong style={{ color: '#38bdf8' }}>{formatBRL(calculatedTotal)}</strong>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
