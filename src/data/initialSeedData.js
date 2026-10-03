export const INITIAL_SEED_DATA = {
  // BAR MODULE
  CategoriasBar: [
    { id_categoria: 'cat_1', nome_categoria: 'Bebidas e Cervejas', tipo_aplicacao: 'PRODUTO', status: true },
    { id_categoria: 'cat_2', nome_categoria: 'Porções e Lanches', tipo_aplicacao: 'PRODUTO', status: true },
    { id_categoria: 'cat_3', nome_categoria: 'Açaí e Shakes Fit', tipo_aplicacao: 'PRODUTO', status: true },
    { id_categoria: 'cat_4', nome_categoria: 'Artigos Beach Tennis', tipo_aplicacao: 'PRODUTO', status: true },
    { id_categoria: 'cat_5', nome_categoria: 'Locação de Quadras', tipo_aplicacao: 'SERVICO', status: true }
  ],

  ProdutosServicos: [
    {
      id_item: 'prod_1',
      nome_item: 'Água Mineral sem Gás 500ml',
      tipo: 'PRODUTO',
      id_categoria: 'cat_1',
      unidade_medida: 'UN',
      preco_custo: 1.50,
      preco_venda: 4.50,
      estoque_minimo: 24,
      estoque_atual: 78,
      codigo_barras: '7891000100012'
    },
    {
      id_item: 'prod_2',
      nome_item: 'Água Mineral com Gás 500ml',
      tipo: 'PRODUTO',
      id_categoria: 'cat_1',
      unidade_medida: 'UN',
      preco_custo: 1.60,
      preco_venda: 5.00,
      estoque_minimo: 20,
      estoque_atual: 62,
      codigo_barras: '7891000100029'
    },
    {
      id_item: 'prod_3',
      nome_item: 'Cerveja Heineken Long Neck 330ml',
      tipo: 'PRODUTO',
      id_categoria: 'cat_1',
      unidade_medida: 'UN',
      preco_custo: 5.80,
      preco_venda: 12.00,
      estoque_minimo: 36,
      estoque_atual: 94,
      codigo_barras: '7891000100036'
    },
    {
      id_item: 'prod_4',
      nome_item: 'Cerveja Corona Extra 330ml',
      tipo: 'PRODUTO',
      id_categoria: 'cat_1',
      unidade_medida: 'UN',
      preco_custo: 6.20,
      preco_venda: 13.00,
      estoque_minimo: 24,
      estoque_atual: 52,
      codigo_barras: '7891000100043'
    },
    {
      id_item: 'prod_5',
      nome_item: 'Isotônico Gatorade 500ml Frutas',
      tipo: 'PRODUTO',
      id_categoria: 'cat_1',
      unidade_medida: 'UN',
      preco_custo: 4.20,
      preco_venda: 9.00,
      estoque_minimo: 20,
      estoque_atual: 34,
      codigo_barras: '7891000100050'
    },
    {
      id_item: 'prod_6',
      nome_item: 'Porção de Mini Pastéis de Carne e Queijo (12un)',
      tipo: 'PRODUTO',
      id_categoria: 'cat_2',
      unidade_medida: 'UN',
      preco_custo: 14.00,
      preco_venda: 34.00,
      estoque_minimo: 10,
      estoque_atual: 24,
      codigo_barras: '7891000200011'
    },
    {
      id_item: 'prod_7',
      nome_item: 'Batata Frita Especial com Cheddar & Bacon',
      tipo: 'PRODUTO',
      id_categoria: 'cat_2',
      unidade_medida: 'UN',
      preco_custo: 16.00,
      preco_venda: 38.00,
      estoque_minimo: 8,
      estoque_atual: 18,
      codigo_barras: '7891000200028'
    },
    {
      id_item: 'prod_8',
      nome_item: 'Açaí na Tigela 400ml Especial Viva + Frutas',
      tipo: 'PRODUTO',
      id_categoria: 'cat_3',
      unidade_medida: 'UN',
      preco_custo: 9.50,
      preco_venda: 22.00,
      estoque_minimo: 15,
      estoque_atual: 32,
      codigo_barras: '7891000300010'
    },
    {
      id_item: 'prod_9',
      nome_item: 'Tubo de Bolinhas Drop Shot Beach Tennis (3 un)',
      tipo: 'PRODUTO',
      id_categoria: 'cat_4',
      unidade_medida: 'UN',
      preco_custo: 38.00,
      preco_venda: 65.00,
      estoque_minimo: 8,
      estoque_atual: 3, // ALERTA DE ESTOQUE BAIXO
      codigo_barras: '7891000400019'
    },
    {
      id_item: 'prod_10',
      nome_item: 'Overgrip Wilson Pro Comfort',
      tipo: 'PRODUTO',
      id_categoria: 'cat_4',
      unidade_medida: 'UN',
      preco_custo: 8.00,
      preco_venda: 20.00,
      estoque_minimo: 10,
      estoque_atual: 31,
      codigo_barras: '7891000400026'
    },
    {
      id_item: 'prod_11',
      nome_item: 'Locação Quadra Iluminada (1 Hora)',
      tipo: 'SERVICO',
      id_categoria: 'cat_5',
      unidade_medida: 'UN',
      preco_custo: 0.00,
      preco_venda: 90.00,
      estoque_minimo: 0,
      estoque_atual: 0,
      codigo_barras: ''
    }
  ],

  MovimentacoesEstoque: [
    {
      id_movimento: 'mov_1',
      id_item: 'prod_3',
      tipo_movimento: 'ENTRADA',
      quantidade: 48,
      data_hora: '2026-10-01 10:30',
      documento_origem: 'NF-10420'
    },
    {
      id_movimento: 'mov_2',
      id_item: 'prod_9',
      tipo_movimento: 'ENTRADA',
      quantidade: 10,
      data_hora: '2026-10-01 11:00',
      documento_origem: 'NF-8831'
    },
    {
      id_movimento: 'mov_3',
      id_item: 'prod_3',
      tipo_movimento: 'SAIDA',
      quantidade: 4,
      data_hora: '2026-10-02 18:20',
      documento_origem: 'Venda-101'
    }
  ],

  NotasFiscais: [
    {
      id_nota: 'nf_1',
      numero_nf: '000.010.420',
      chave_acesso: '42261012345678000190550010000104201876543210',
      fornecedor_nome: 'Ambev Distribuição Litoral SC',
      fornecedor_cnpj: '12.345.678/0001-90',
      valor_total_nf: 1840.00
    },
    {
      id_nota: 'nf_2',
      numero_nf: '000.008.831',
      chave_acesso: '42261098765432000111550010000088311234567890',
      fornecedor_nome: 'Drop Shot Brasil Raquetes & Acessórios',
      fornecedor_cnpj: '98.765.432/0001-11',
      valor_total_nf: 2450.00
    }
  ],

  ItensNota: [
    {
      id_item_nota: 'itn_1',
      id_nota: 'nf_1',
      id_item: 'prod_3',
      ncm: '22030000',
      cest: '0300100',
      quantidade: 48,
      valor_unitario: 5.80
    },
    {
      id_item_nota: 'itn_2',
      id_nota: 'nf_2',
      id_item: 'prod_9',
      ncm: '95066900',
      cest: '2805900',
      quantidade: 20,
      valor_unitario: 38.00
    }
  ],

  Vendas: [
    {
      id_venda: 'vd_comanda_1',
      numero_comanda: 'Comanda #07',
      cliente_nome: 'Gabriel Alencar (Quadra 3)',
      data_venda: '2026-10-02 18:40',
      id_cliente_aluno: '',
      valor_total: 62.00,
      forma_pagamento: '',
      status_venda: 'AGUARDANDO_PAGAMENTO',
      observacoes: 'Consumo do final de tarde • Quadra 3'
    },
    {
      id_venda: 'vd_comanda_2',
      numero_comanda: 'Comanda #14',
      cliente_nome: 'Beatriz Vasconcelos (Aluna)',
      data_venda: '2026-10-02 19:10',
      id_cliente_aluno: 'aluno_3',
      valor_total: 27.00,
      forma_pagamento: '',
      status_venda: 'AGUARDANDO_PAGAMENTO',
      observacoes: 'Pagar junto ao final do treino'
    },
    {
      id_venda: 'vd_1',
      data_venda: '2026-10-02 17:45',
      id_cliente_aluno: 'aluno_1',
      cliente_nome: 'Guilherme Siqueira Ramos',
      valor_total: 62.00,
      forma_pagamento: 'PIX',
      status_venda: 'FINALIZADA'
    },
    {
      id_venda: 'vd_2',
      data_venda: '2026-10-02 18:30',
      id_cliente_aluno: 'aluno_2',
      cliente_nome: 'Lucas Silveira Mendes',
      valor_total: 94.00,
      forma_pagamento: 'PRAZO',
      status_venda: 'FINALIZADA'
    },
    {
      id_venda: 'vd_3',
      data_venda: '2026-10-02 19:15',
      id_cliente_aluno: '',
      cliente_nome: 'Cliente Balcão',
      valor_total: 41.00,
      forma_pagamento: 'CARTAO_DEB',
      status_venda: 'FINALIZADA'
    }
  ],

  ItensVenda: [
    { id_item_venda: 'itv_c1_1', id_venda: 'vd_comanda_1', id_item: 'prod_3', quantidade: 2, preco_unitario: 12.00 },
    { id_item_venda: 'itv_c1_2', id_venda: 'vd_comanda_1', id_item: 'prod_7', quantidade: 1, preco_unitario: 38.00 },
    { id_item_venda: 'itv_c2_1', id_venda: 'vd_comanda_2', id_item: 'prod_8', quantidade: 1, preco_unitario: 22.00 },
    { id_item_venda: 'itv_c2_2', id_venda: 'vd_comanda_2', id_item: 'prod_2', quantidade: 1, preco_unitario: 5.00 },
    { id_item_venda: 'itv_1', id_venda: 'vd_1', id_item: 'prod_3', quantidade: 2, preco_unitario: 12.00 },
    { id_item_venda: 'itv_2', id_venda: 'vd_1', id_item: 'prod_7', quantidade: 1, preco_unitario: 38.00 },
    { id_item_venda: 'itv_3', id_venda: 'vd_2', id_item: 'prod_6', quantidade: 2, preco_unitario: 34.00 },
    { id_item_venda: 'itv_4', id_venda: 'vd_2', id_item: 'prod_4', quantidade: 2, preco_unitario: 13.00 },
    { id_item_venda: 'itv_5', id_venda: 'vd_3', id_item: 'prod_8', quantidade: 1, preco_unitario: 22.00 },
    { id_item_venda: 'itv_6', id_venda: 'vd_3', id_item: 'prod_10', quantidade: 1, preco_unitario: 19.00 }
  ],

  Boletos: [
    {
      id_boleto: 'bol_1',
      tipo_natureza: 'PAGAR',
      codigo_barras: '34191.79001 01043.510047 91020.150008 1 98760000184000',
      valor_nominal: 1840.00,
      data_vencimento: '2026-10-10',
      status_boleto: 'ABERTO'
    },
    {
      id_boleto: 'bol_2',
      tipo_natureza: 'PAGAR',
      codigo_barras: '23793.38128 60083.100122 41000.670001 2 98800000245000',
      valor_nominal: 2450.00,
      data_vencimento: '2026-10-15',
      status_boleto: 'AGENDADO'
    }
  ],

  ContasPagarBar: [
    {
      id_conta_pagar: 'cp_1',
      descricao: 'Fornecedor Bebidas Ambev - Lote Cervejas & Sucos',
      id_nota: 'nf_1',
      valor_devido: 1840.00,
      data_vencimento: '2026-10-10',
      data_liquidacao: '',
      status_card: 'ABERTO'
    },
    {
      id_conta_pagar: 'cp_2',
      descricao: 'Reposição Raquetes & Tubos Bolinhas Drop Shot',
      id_nota: 'nf_2',
      valor_devido: 2450.00,
      data_vencimento: '2026-10-15',
      data_liquidacao: '',
      status_card: 'AGENDADO'
    },
    {
      id_conta_pagar: 'cp_3',
      descricao: 'Gás de Cozinha P45 - Cozinha e Fritadeiras Bar',
      id_nota: '',
      valor_devido: 420.00,
      data_vencimento: '2026-09-28',
      data_liquidacao: '',
      status_card: 'VENCIDO'
    },
    {
      id_conta_pagar: 'cp_4',
      descricao: 'Distribuidora Hortifruti Joinville (Frutas Açaí)',
      id_nota: '',
      valor_devido: 680.00,
      data_vencimento: '2026-09-30',
      data_liquidacao: '2026-09-30',
      status_card: 'PAGO'
    }
  ],

  ContasReceberBar: [
    {
      id_conta_receber: 'cr_1',
      id_venda: 'vd_2',
      devedor_nome: 'Lucas Silveira Mendes (Aluno)',
      valor_devido: 94.00,
      data_vencimento: '2026-10-10',
      data_recebimento: '',
      status_card: 'ABERTO'
    },
    {
      id_conta_receber: 'cr_2',
      id_venda: '',
      devedor_nome: 'Rodrigo Fontes (Comanda Torneio Aberto)',
      valor_devido: 185.00,
      data_vencimento: '2026-09-25',
      data_recebimento: '',
      status_card: 'VENCIDO'
    },
    {
      id_conta_receber: 'cr_3',
      id_venda: '',
      devedor_nome: 'Mariana Duarte (Comanda Happy Hour)',
      valor_devido: 140.00,
      data_vencimento: '2026-09-29',
      data_recebimento: '2026-09-29',
      status_card: 'PAGO'
    }
  ],

  // AULAS MODULE
  Planos: [
    {
      id_plano: 'plano_1',
      nome_plano: 'Mensal 2x Beach Tennis Regular',
      valor_mensalidade: 380.00,
      aulas_semana: 2,
      duracao_minutos: 60,
      status: true
    },
    {
      id_plano: 'plano_2',
      nome_plano: 'Mensal 3x Performance Competição',
      valor_mensalidade: 520.00,
      aulas_semana: 3,
      duracao_minutos: 75,
      status: true
    },
    {
      id_plano: 'plano_3',
      nome_plano: 'Kids Beach Tennis 2x (8 a 13 anos)',
      valor_mensalidade: 290.00,
      aulas_semana: 2,
      duracao_minutos: 50,
      status: true
    },
    {
      id_plano: 'plano_4',
      nome_plano: 'Aula Particular VIP 1x (Treinador Dedicado)',
      valor_mensalidade: 650.00,
      aulas_semana: 1,
      duracao_minutos: 60,
      status: true
    }
  ],

  Professores: [
    {
      id_professor: 'prof_1',
      nome_professor: 'Daniel Alexandre Baumann',
      cpf_cnpj: '034.567.899-10',
      especialidade: 'Alta Performance / Competição & Tática',
      comissao_padrao_pct: 45.00,
      chave_pix: 'daniel.baumann@arenaviva.com.br',
      telefone: '(47) 99123-4567',
      status: true
    },
    {
      id_professor: 'prof_2',
      nome_professor: 'Matheus Henrique Oliveira',
      cpf_cnpj: '123.456.789-01',
      especialidade: 'Iniciantes e Intermediário Avançado',
      comissao_padrao_pct: 40.00,
      chave_pix: 'matheus.oliveira@gmail.com',
      telefone: '(47) 99876-5432',
      status: true
    },
    {
      id_professor: 'prof_3',
      nome_professor: 'Camila Silveira Rocha',
      cpf_cnpj: '987.654.321-22',
      especialidade: 'Beach Tennis Feminino & Aulas Kids',
      comissao_padrao_pct: 40.00,
      chave_pix: 'camila.bt@gmail.com',
      telefone: '(47) 98456-7890',
      status: true
    }
  ],

  Alunos: [
    {
      id_aluno: 'aluno_1',
      nome_completo: 'Guilherme Siqueira Ramos',
      cpf: '089.452.123-77',
      telefone: '(47) 99111-2233',
      id_plano: 'plano_2',
      id_professor_titular: 'prof_1',
      dia_vencimento: 10,
      status_matricula: 'ATIVO'
    },
    {
      id_aluno: 'aluno_2',
      nome_completo: 'Lucas Silveira Mendes',
      cpf: '065.789.321-44',
      telefone: '(47) 99222-3344',
      id_plano: 'plano_1',
      id_professor_titular: 'prof_2',
      dia_vencimento: 10,
      status_matricula: 'ATIVO'
    },
    {
      id_aluno: 'aluno_3',
      nome_completo: 'Beatriz Vasconcelos',
      cpf: '043.987.654-11',
      telefone: '(47) 99333-4455',
      id_plano: 'plano_1',
      id_professor_titular: 'prof_3',
      dia_vencimento: 5,
      status_matricula: 'ATIVO'
    },
    {
      id_aluno: 'aluno_4',
      nome_completo: 'Thiago Nogueira Pinheiro',
      cpf: '021.345.678-99',
      telefone: '(47) 99444-5566',
      id_plano: 'plano_4',
      id_professor_titular: 'prof_1',
      dia_vencimento: 15,
      status_matricula: 'ATIVO'
    },
    {
      id_aluno: 'aluno_5',
      nome_completo: 'Rafael Correa Duarte',
      cpf: '055.432.198-88',
      telefone: '(47) 99555-6677',
      id_plano: 'plano_1',
      id_professor_titular: 'prof_2',
      dia_vencimento: 20,
      status_matricula: 'INADIMPLENTE'
    },
    {
      id_aluno: 'aluno_6',
      nome_completo: 'Larissa Albuquerque',
      cpf: '077.654.321-00',
      telefone: '(47) 99666-7788',
      id_plano: 'plano_3',
      id_professor_titular: 'prof_3',
      dia_vencimento: 10,
      status_matricula: 'TRANCADO'
    }
  ],

  AulasContratos: [
    {
      id_contrato_aula: 'ctr_1',
      id_aluno: 'aluno_1',
      id_professor: 'prof_1',
      id_plano: 'plano_2',
      comissao_especifica_pct: 45.00,
      data_inicio: '2026-02-01'
    },
    {
      id_contrato_aula: 'ctr_2',
      id_aluno: 'aluno_2',
      id_professor: 'prof_2',
      id_plano: 'plano_1',
      comissao_especifica_pct: 40.00,
      data_inicio: '2026-03-01'
    },
    {
      id_contrato_aula: 'ctr_3',
      id_aluno: 'aluno_3',
      id_professor: 'prof_3',
      id_plano: 'plano_1',
      comissao_especifica_pct: 40.00,
      data_inicio: '2026-04-01'
    },
    {
      id_contrato_aula: 'ctr_4',
      id_aluno: 'aluno_4',
      id_professor: 'prof_1',
      id_plano: 'plano_4',
      comissao_especifica_pct: 50.00,
      data_inicio: '2026-05-15'
    }
  ],

  ParcelasAluno: [
    {
      id_parcela: 'parc_1',
      id_contrato_aula: 'ctr_1',
      numero_parcela: 9,
      valor_parcela: 520.00,
      data_vencimento: '2026-10-10',
      status_parcela: 'PAGA'
    },
    {
      id_parcela: 'parc_2',
      id_contrato_aula: 'ctr_2',
      numero_parcela: 8,
      valor_parcela: 380.00,
      data_vencimento: '2026-10-10',
      status_parcela: 'ABERTA'
    },
    {
      id_parcela: 'parc_3',
      id_contrato_aula: 'ctr_3',
      numero_parcela: 7,
      valor_parcela: 380.00,
      data_vencimento: '2026-10-05',
      status_parcela: 'PAGA'
    },
    {
      id_parcela: 'parc_4',
      id_contrato_aula: 'ctr_4',
      numero_parcela: 6,
      valor_parcela: 650.00,
      data_vencimento: '2026-10-15',
      status_parcela: 'ABERTA'
    },
    {
      id_parcela: 'parc_5',
      id_contrato_aula: 'ctr_2',
      numero_parcela: 7,
      valor_parcela: 380.00,
      data_vencimento: '2026-09-10',
      status_parcela: 'VENCIDA'
    }
  ],

  Comissoes: [
    {
      id_comissao: 'com_1',
      id_professor: 'prof_1',
      id_parcela: 'parc_1',
      valor_base: 520.00,
      valor_comissao: 234.00, // 45% de 520.00
      status_repasse: 'LIBERADA'
    },
    {
      id_comissao: 'com_2',
      id_professor: 'prof_3',
      id_parcela: 'parc_3',
      valor_base: 380.00,
      valor_comissao: 152.00, // 40% de 380.00
      status_repasse: 'PAGA'
    },
    {
      id_comissao: 'com_3',
      id_professor: 'prof_2',
      id_parcela: 'parc_2',
      valor_base: 380.00,
      valor_comissao: 152.00,
      status_repasse: 'PROVISIONADA'
    }
  ],

  Eventos: [
    {
      id_evento: 'ev_1',
      nome_evento: '2º Circuito Arena Viva By Baumann - Etapa Joinville',
      data_evento: '2026-10-24 08:30',
      local_quadras: 'Quadras 1 a 6 (Arena Viva Central)',
      valor_inscricao: 130.00,
      status_evento: 'ABERTO'
    },
    {
      id_evento: 'ev_2',
      nome_evento: 'Clínica Técnica Intensiva de Smash e Defesa',
      data_evento: '2026-10-17 14:00',
      local_quadras: 'Quadras 1 e 2',
      valor_inscricao: 180.00,
      status_evento: 'LOTADO'
    },
    {
      id_evento: 'ev_3',
      nome_evento: 'Super 12 Noturno de Sexta - Categoria Mista',
      data_evento: '2026-10-09 19:00',
      local_quadras: 'Quadras 3, 4 e 5',
      valor_inscricao: 70.00,
      status_evento: 'EM_ANDAMENTO'
    }
  ],

  InscricoesEvento: [
    {
      id_inscricao: 'ins_1',
      id_evento: 'ev_1',
      id_aluno: 'aluno_1',
      nome_participante_avulso: '',
      status_pagamento: 'CONFIRMADO'
    },
    {
      id_inscricao: 'ins_2',
      id_evento: 'ev_1',
      id_aluno: 'aluno_2',
      nome_participante_avulso: '',
      status_pagamento: 'CONFIRMADO'
    },
    {
      id_inscricao: 'ins_3',
      id_evento: 'ev_1',
      id_aluno: '',
      nome_participante_avulso: 'Fernanda Albuquerque (Atleta Convidada)',
      status_pagamento: 'PENDENTE'
    },
    {
      id_inscricao: 'ins_4',
      id_evento: 'ev_2',
      id_aluno: 'aluno_3',
      nome_participante_avulso: '',
      status_pagamento: 'CONFIRMADO'
    }
  ],

  PagamentosAssociacao: [
    {
      id_pagamento_ass: 'ass_1',
      categoria_fixa: 'Aluguel',
      descricao: 'Locação Mensal do Complexo Arena Viva',
      valor_compromisso: 8500.00,
      data_vencimento: '2026-10-10',
      data_liquidacao: '',
      status_card: 'A_VENCER'
    },
    {
      id_pagamento_ass: 'ass_2',
      categoria_fixa: 'Luz',
      descricao: 'CELESC - Iluminação Noturna dos Refletores LED das Quadras',
      valor_compromisso: 1870.40,
      data_vencimento: '2026-10-05',
      data_liquidacao: '',
      status_card: 'VENCENDO'
    },
    {
      id_pagamento_ass: 'ass_3',
      categoria_fixa: 'Água',
      descricao: 'Companhia de Água e Saneamento - Vestiários e Bar',
      valor_compromisso: 410.20,
      data_vencimento: '2026-09-28',
      data_liquidacao: '',
      status_card: 'VENCIDO'
    },
    {
      id_pagamento_ass: 'ass_4',
      categoria_fixa: 'Internet',
      descricao: 'Fibra Óptica 1Gb Dedicado + Wi-Fi Visitantes',
      valor_compromisso: 229.90,
      data_vencimento: '2026-09-30',
      data_liquidacao: '2026-09-30',
      status_card: 'PAGO'
    },
    {
      id_pagamento_ass: 'ass_5',
      categoria_fixa: 'Contabilidade',
      descricao: 'Honorários Contábeis & Assessoria Fiscal Mensal',
      valor_compromisso: 1100.00,
      data_vencimento: '2026-10-15',
      data_liquidacao: '',
      status_card: 'A_VENCER'
    },
    {
      id_pagamento_ass: 'ass_6',
      categoria_fixa: 'Marketing',
      descricao: 'Gestão de Tráfego Pago & Redes Sociais Viva Beach',
      valor_compromisso: 1500.00,
      data_vencimento: '2026-10-12',
      data_liquidacao: '',
      status_card: 'A_VENCER'
    }
  ],

  AvisosRecebimentos: [
    {
      id_aviso: 'av_1',
      id_parcela: 'parc_5',
      mensagem_texto: 'Mensalidade Setembro/2026 em atraso há mais de 20 dias. Notificar atleta via WhatsApp.',
      prioridade: 'URGENTE',
      lido: false
    },
    {
      id_aviso: 'av_2',
      id_parcela: 'parc_2',
      mensagem_texto: 'Lembrete automático: Mensalidade Outubro/2026 vence em 8 dias.',
      prioridade: 'MEDIA',
      lido: false
    },
    {
      id_aviso: 'av_3',
      id_parcela: 'parc_4',
      mensagem_texto: 'Aviso de renovação contratual para aula VIP próxima do encerramento.',
      prioridade: 'BAIXA',
      lido: true
    }
  ]
};
