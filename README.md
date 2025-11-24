OBS: Por motivos de segurança, a chave API foi removida do index.html e que o codigo está configurado para receber a chave em tempo de execução. O index_demo.html está funcional no arquivo local
(proteção da chave)

### Como Executar o Código (Para Avaliação)

1. **Baixe/Clone** o repositório.
2. **Abra o arquivo `index.html`** diretamente em seu navegador (Chrome, Firefox, etc.).
3. **INSERÇÃO DA CHAVE:** Para que a tradução funcione, é necessário **inserir manualmente** sua chave de API válida no seguinte local dentro do código JavaScript do arquivo `index.html`.

   ```javascript
   // Procure esta linha no bloco <script> e adicione a chave após 'key='
   const GEMINI_API_URL = `...:generateContent?key=`;(linha 419)

1. Visão Geral do Projeto

Este projeto implementa um Agente de Inteligência Artificial para Web capaz de traduzir bidirecionalmente sentenças em Linguagem Natural (Português) para Fórmulas do Cálculo Proposicional Clássico (CPC) e vice-versa.

O objetivo é fornecer uma ferramenta didática e funcional para demonstrar a base da lógica formal em sistemas de IA

2. Arquitetura do Sistema e Funcionamento

A lógica de tradução é delegada ao modelo de linguagem de grande escala (LLM) do Google Gemini, enquanto a interface é tratada por HTML/JavaScript no cliente.

Componentes:

Interface do Cliente (index.html): O front-end da aplicação, responsável por capturar a entrada do usuário (texto ou fórmula) e exibir os resultados. É construído com HTML, CSS (para o design) e JavaScript (para a interatividade).

Motor de Tradução (JavaScript / fetch): O JavaScript atua como o "Agente de Borda". Ele identifica o tipo de tradução (NL $\to$ CPC ou CPC $\to$ NL) e monta o prompt adequado.

LLM (Agente de IA Generativa): O modelo gemini-2.5-flash-preview-09-2025 (Google Gemini) é o núcleo da inteligência. Ele recebe o prompt e a instrução de sistema (SYSTEM_INSTRUCTION) para garantir que a tradução seja feita de acordo com as regras formais do CPC.

Conexão (API Call): A comunicação é feita via requisições HTTP (fetch) para o endpoint da API do Gemini. O sistema utiliza um mecanismo de backoff exponencial (4 tentativas) para garantir a robustez contra falhas de rede.

3. Estratégia de Tradução e Mapeamento

A tradução é totalmente baseada em Instruções de Sistema (System Prompt) e Análise Semântica (LLM), e não em regras de Regex ou Parsing manual.

Regras do Agente (Definidas no SYSTEM_INSTRUCTION):

O agente segue um protocolo rigoroso para garantir a consistência:

Notação Fixa: Deve usar apenas os símbolos CPC ($\neg, \land, \lor, \to, \leftrightarrow$).

Estrutura de Resposta: A saída é formatada obrigatoriamente nas seções Proposições e Fórmula (ou Linguagem Natural).

Tradução NL $\to$ CPC: A IA assume a função de Análise Semântica, mapeando partes da sentença (que representam ideias completas) para as letras proposicionais (P, Q, R) e, em seguida, unindo-as com os conectivos corretos.

Tradução CPC $\to$ NL: A IA recebe a fórmula e as proposições (ou sugestões de proposições) e as converte em uma frase coerente e natural, corrigindo o erro de traduções literais como "P e Q".

Exemplos de Input/Output com Análise

Tipo

Entrada (Input)

Saída (Output Esperado)

Análise de Acerto

NL $\to$ CPC

"Se chover e fizer frio, então não vou sair de casa."

Proposições: P: Chover; Q: Fazer frio; R: Vou sair de casa. Fórmula: (P ∧ Q) → ¬R

Acerto: Identifica os conectivos de maior precedência (∧) e a negação (¬), aplicando a implicação corretamente.

NL $\to$ CPC (Complexo)

"Vou estudar se, e somente se, o café estiver forte."

Proposições: P: Vou estudar; Q: O café está forte. Fórmula: P ↔ Q

Acerto: Reconhece a bicondicionalidade ("se, e somente se") que exige o conectivo 

CPC $\to$ NL

(P ∨ Q) ∧ ¬R

Proposições: P: A porta está aberta; Q: A luz está acesa; R: O alarme está ligado. Linguagem Natural: A porta está aberta ou a luz está acesa, e o alarme não está ligado.

Acerto: Interpreta corretamente a ordem de precedência implícita nos parênteses e constrói uma frase natural.

4. Limitações e Possibilidades de Melhoria

Limitações Atuais:

Vieses e Ambiguidade: A IA pode cometer erros ao lidar com sentenças ambíguas ou contextos muito complexos, pois a atribuição de P, Q, R é subjetiva e depende do treinamento do LLM.

Dependência da API: A funcionalidade é 100% dependente da conexão com o serviço Gemini. O erro 403 (autenticação) inviabiliza a ferramenta.

Escopo: Limitado ao Cálculo Proposicional Clássico (CPC); não lida com quantificadores ($\forall, \exists$) do CQC.

Possibilidades de Melhoria:

Integração CQC: Ampliar o modelo para incluir lógica de primeira ordem (CQC), permitindo a tradução de frases com "Todo" e "Algum".

Feedback Loop: Adicionar uma seção onde o usuário pode corrigir a tradução da IA, usando essa correção como feedback para refinar o prompt do Agente.

Validação Visual: Adicionar uma Tabela Verdade interativa para que o usuário possa verificar o valor de verdade da fórmula CPC gerada.

