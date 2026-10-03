# Viva By Baumann — Sistema Integrado de Gestão (Bar & Aulas)

Sistema web completo de gestão operacional e financeira desenvolvido para o complexo esportivo e gastronômico **Arena Viva By Baumann**, com arquitetura baseada integralmente no modelo relacional de 20 entidades extraído de `Modelo_de_Dados_App_Bar_e_Aulas.xlsx`.

---

## 🚀 Funcionalidades Principais

### 🍻 Módulo Bar & Restaurante
- **Frente de Caixa (PDV):**
  - Catálogo dinâmico de produtos com busca em tempo real e filtro por categorias (Bebidas, Porções, Lanches, Sobremesas, Doses, Acessórios).
  - Carrinho interativo com cálculo de descontos, totalizadores e fechamento rápido via Dinheiro, PIX, Cartão de Débito, Cartão de Crédito ou Venda a Prazo.
  - **Lançar em Comanda Aberta:** Permite enviar pedidos diretamente para uma comanda aberta ou criar uma nova mesa/comanda.
- **Comandas em Aberto (Consumo no Local):**
  - Tela dedicada exibindo **apenas comandas com status `AGUARDANDO_PAGAMENTO`**.
  - Permite que atletas e frequentadores consumam ao longo do dia e acertem o total no encerramento.
  - Adição dinâmica de novos itens à comanda a qualquer momento com atualização de saldo.
  - Quitação de comandas no final do dia com suporte a todos os meios de pagamento. Comandas fechadas saem automaticamente da tela e vão para o histórico de vendas.
- **Cardápio & Catálogo de Itens (`ProdutosServicos`):**
  - Cadastro de produtos com preço de custo, margem de lucro, preço de venda, código de barras, controle de estoque mínimo e alíquotas tributárias.
- **Controle de Estoque (`MovimentacoesEstoque`):**
  - Registro de entradas (por compras/notas fiscais) e saídas (por vendas no PDV ou avarias).
  - Alertas visuais automáticos de itens abaixo do estoque mínimo.
- **Notas Fiscais de Entrada (`NotasFiscais`):**
  - Registro fiscal de compras, fornecedores, chave de acesso de 44 dígitos, itens da nota e vencimentos a pagar.
- **Histórico de Vendas (`Vendas` & `ItensVenda`):**
  - Relatório detalhado de todas as vendas e comandas finalizadas com cancelamento/estorno de pedidos.

### 🎾 Módulo Aulas & Complexo Esportivo
- **Gestão de Alunos & Atletas (`Alunos`):**
  - Cadastro completo com dados de contato, CPF, data de nascimento, plano ativo e status (Ativo, Trancado, Cancelado, Inadimplente).
- **Corpo Docente & Treinadores (`Professores`):**
  - Gestão de professores, modalidades (Beach Tennis, Futevôlei, Tênis, etc.), chave PIX e modelo de remuneração.
- **Planos de Aulas (`PlanosAulas`):**
  - Configuração de mensalidades, modalidades, frequência semanal (ex: 2x, 3x na semana) e regras contratuais.
- **Contratos Pedagógicos (`Contratos`):**
  - Vínculo entre aluno, professor e plano com definição do percentual de comissão docência.
- **Mensalidades & Parcelas (`ParcelasAluno`):**
  - Acompanhamento de pagamentos de mensalidades com quitação manual ou automática e liberação dos repasses dos treinadores.
- **Eventos, Torneios & Clínicas (`Eventos`):**
  - Gestão de torneios esportivos, inscrições de duplas e locações avulsas de quadras.

### 💼 Módulo Financeiro
- **Kanban de Contas a Pagar do Bar (`ContasPagarBar`):**
  - Colunas interativas por status: `Aberto`, `Agendado`, `Vencido` e `Pago`.
- **Kanban de Contas a Receber do Bar (`ContasReceberBar`):**
  - Controle de clientes e associados autorizados a pagar a prazo.
- **Kanban de Despesas da Associação (`PagamentosAssociacao`):**
  - Compromissos estruturais do complexo (Aluguel, Luz, Água, Internet, Manutenção de Quadras, IPTU, etc.).
- **Boletos Bancários (`Boletos`):**
  - Linha digitável, código de barras, valor, data de vencimento e conciliação bancária.
- **Repasse de Comissões Docentes (`ComissoesProfessores`):**
  - Provisão automática quando a mensalidade é faturada, liberação após a quitação do aluno e liquidação do PIX ao treinador.

### 📊 Painel Executivo & Dicionário de Dados
- **Dashboard em Tempo Real:** Indicadores consolidados de faturamento do bar, arrecadação de aulas, alunos ativos, contas a pagar/receber e comandas em aberto.
- **Dicionário de Tabelas:** Visualizador técnico interativo com as 20 tabelas, colunas, tipos de dados e relacionamentos do modelo original da planilha.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Estilização:** Vanilla CSS com Design System moderno (Dark glassmorphism, tipografia Inter/Outfit, gradientes e micro-animações)
- **Persistência Local:** HTML5 LocalStorage com migração automática dos dados iniciais
- **Processamento de Dados:** Scripts Node.js para parsing do arquivo Excel `Modelo_de_Dados_App_Bar_e_Aulas.xlsx`

---

## 📦 Como Executar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- Git

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/daniel1alexandre/aulas-viva.git
cd aulas-viva
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra o navegador em:
```
http://localhost:5173/
```

### Compilação de Produção
Para gerar o bundle otimizado para deploy:
```bash
npm run build
```

---

## 🗄️ Estrutura do Modelo de Dados (20 Tabelas)

1. `CategoriasBar`
2. `ProdutosServicos`
3. `MovimentacoesEstoque`
4. `NotasFiscais`
5. `ItensNotaFiscal`
6. `Vendas`
7. `ItensVenda`
8. `ContasPagarBar`
9. `ContasReceberBar`
10. `Alunos`
11. `Professores`
12. `PlanosAulas`
13. `Contratos`
14. `ParcelasAluno`
15. `ComissoesProfessores`
16. `Eventos`
17. `InscricoesEventos`
18. `PagamentosAssociacao`
19. `Boletos`
20. `AvisosRecebimentos`

---

## 📄 Licença

Projeto desenvolvido para a gestão integrada da **Arena Viva By Baumann**.
