# Tradutor NL/CPC - Conversor entre Linguagem Natural e Cálculo Proposicional Clássico

## 📋 Sobre o Projeto

Sistema web inteligente que realiza tradução bidirecional entre sentenças em português (Linguagem Natural) e fórmulas do Cálculo Proposicional Clássico (CPC), utilizando modelos de IA generativa do Google Gemini.

**🔗 Acesse o projeto:** [https://matheus-chaves0.github.io/convertor_CPC/](https://matheus-chaves0.github.io/convertor_CPC/)

---

## 🏗️ Arquitetura do Sistema

### Diagrama de Funcionamento

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   INTERFACE     │    │   AGENTE IA      │    │   API GEMINI    │
│   DO USUÁRIO    │◄──►│   TRADUTOR       │◄──►│   (Backend)     │
│                 │    │                  │    │                 │
│ • Input/Output  │    │ • Processamento  │    │ • Modelos LLM   │
│ • Configuração  │    │ • Prompts        │    │ • Gemini 2.0/2.5│
│ • Exemplos      │    │ • Validação      │    │ • GenerateContent│
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                     ┌───────────┴───────────┐
                     │    ARMAZENAMENTO      │
                     │     LOCAL (Web)       │
                     │                       │
                     │ • API Key             │
                     │ • Configurações       │
                     │ • Histórico           │
                     └───────────────────────┘
```

### Componentes Principais

1. **Interface do Usuário**
   - Frontend responsivo em HTML/CSS/JavaScript
   - Duas vias de tradução: Português→CPC e CPC→Português
   - Sistema de configuração de API Key
   - Exemplos interativos

2. **Agente IA Tradutor**
   - Sistema de prompts especializados
   - Detecção automática de modelos disponíveis
   - Tratamento de erros e fallback
   - Extração inteligente de respostas

3. **Integração com Gemini API**
   - Compatível com modelos Gemini 2.0/2.5
   - Sistema de autenticação via API Key
   - Versões suportadas: v1, v1beta, v1alpha

4. **Armazenamento Local**
   - Persistência da API Key no localStorage
   - Cache de configurações otimizadas
   - Preferências do usuário

---

## 🎯 Estratégia de Tradução

### Metodologia de Mapeamento

#### Português → CPC
**Regras de Tradução:**
- **Conectivos lógicos:** 
  - "e" → `∧`
  - "ou" → `∨` 
  - "se...então" → `→`
  - "se e somente se" → `↔`
  - "não" → `¬`

- **Proposições atômicas:**
  - Substantivos/frases → Letras maiúsculas (P, Q, R...)
  - Contexto determina mapeamento

- **Precedência:**
  - `¬` (maior precedência)
  - `∧`, `∨`
  - `→`, `↔` (menor precedência)

#### CPC → Português
**Padrões de Saída:**
- Fórmulas atômicas: "P", "Q", "R"
- Conectivos traduzidos para português natural
- Estruturação gramatical correta
- Preservação de escopo com parênteses

### Sistema de Prompts

```javascript
// Exemplo de prompt para Português → CPC
const prompt = `TRADUZA esta frase para fórmula do Cálculo Proposicional Clássico.

FRASE: "${textoEntrada}"

REGRAS:
- Use símbolos: ∧ (e), ∨ (ou), → (se...então), ↔ (se e somente se), ¬ (não)
- Use letras maiúsculas (P, Q, R...)
- Não explique nem comente  
- Responda SOMENTE com a fórmula

FÓRMULA CPC:`;
```

### Exemplos de Input/Output

#### ✅ Casos de Sucesso

**Exemplo 1: Tradução Simples**
```
Input: "Se está chovendo, então a rua está molhada"
Output: P → Q
Análise: ✅ Correto - Mapeamento claro de antecedente e consequente
```

**Exemplo 2: Conectivos Múltiplos**
```
Input: "Estudo e não chove"
Output: P ∧ ¬Q
Análise: ✅ Correto - Negação e conjunção bem traduzidas
```

**Exemplo 3: Estrutura Complexa**
```
Input: "Se estudo e não chove, então vou ao parque ou fico em casa"
Output: (P ∧ ¬Q) → (R ∨ S)
Análise: ✅ Correto - Precedência e escopo preservados
```

**Exemplo 4: CPC → Português**
```
Input: P ∧ Q
Output: "P e Q"
Análise: ✅ Correto - Tradução direta e clara
```

#### ❌ Casos de Erro/Limitação

**Exemplo 1: Ambiguidade Semântica**
```
Input: "O gato está no tapete ou debaixo da mesa"
Output Possível: P ∨ Q
Análise: ⚠️ Limitação - Não captura exclusividade mútua (XOR)
```

**Exemplo 2: Expressões Idiomáticas**
```
Input: "Chove canivetes"
Output Possível: P
Análise: ⚠️ Limitação - Perde o sentido figurativo da expressão
```

**Exemplo 3: Contexto Implícito**
```
Input: "Se chover, cancelamos"
Output Possível: P → Q
Análise: ⚠️ Limitação - Assume contexto não explícito na frase
```

---

## ⚠️ Limitações e Possibilidades de Melhoria

### Limitações Atuais

1. **Dependência de API Externa**
   - Requer conexão internet
   - Sujeito a limites de quota/custos
   - Latência variável

2. **Modelos de Linguagem**
   - Inconsistências ocasionais nas respostas
   - Sensibilidade à formulação dos prompts
   - Não deterministico

3. **Complexidade Semântica**
   - Dificuldade com ambiguidades
   - Expressões idiomáticas e figurativas
   - Contexto implícito não capturado

4. **Escopo Proposicional**
   - Limitado a lógica proposicional
   - Não suporta quantificadores (∀, ∃)
   - Não lida com relações ou predicados

### Possibilidades de Melhoria

#### 1. Melhorias Técnicas
- [ ] **Sistema Híbrido**: Combinar regras baseadas com IA
- [ ] **Cache Local**: Armazenar traduções frequentes
- [ ] **Validação Sintática**: Verificar fórmulas CPC geradas
- [ ] **Múltiplos Provedores**: OpenAI, Claude como fallback

#### 2. Expansão Funcional
- [ ] **Lógica de Primeira Ordem**: Suporte a quantificadores
- [ ] **Tabelas Verdade**: Geração automática
- [ ] **Verificação de Equivalências**: Comparação de fórmulas
- [ ] **Histórico de Traduções**: Sessões de trabalho

#### 3. Interface e UX
- [ ] **Editor Visual**: Arrastar e soltar conectivos
- [ ] **Dicionário de Proposições**: Mapeamento personalizado
- [ ] **Explicações Passo a Passo**: Como a tradução foi feita
- [ ] **Modo Offline**: Funcionalidades básicas sem internet

#### 4. Robustez
- [ ] **Tratamento de Erros Avançado**: Sugestões de correção
- [ ] **Validação de Entrada**: Verificação pré-IA
- [ ] **Sistema de Feedback**: Aprendizado com correções
- [ ] **Benchmarking**: Testes automatizados de qualidade

---

## 🚀 Como Usar

1. **Acesse**: [https://matheus-chaves0.github.io/convertor_CPC/](https://matheus-chaves0.github.io/convertor_CPC/)
2. **Configure**: Insira sua API Key do Google Gemini
3. **Traduza**: Use as caixas de texto para conversão bidirecional
4. **Experimente**: Teste com os exemplos fornecidos

### Requisitos
- Navegador moderno com JavaScript
- API Key do Google Gemini (gratuita)
- Conexão internet

---

## 📊 Status do Projeto

**✅ Funcionalidades Implementadas:**
- [x] Tradução bidirecional NL/CPC
- [x] Interface web responsiva
- [x] Sistema de configuração de API
- [x] Exemplos interativos
- [x] Suporte a modelos Gemini 2.0/2.5

**🔄 Em Desenvolvimento:**
- [ ] Sistema de validação de fórmulas
- [ ] Histórico de traduções
- [ ] Exportação de resultados

---

## 🤝 Contribuição

Este projeto é open source e aceita contribuições para:
- Melhoria dos algoritmos de tradução
- Expansão para outras lógicas formais
- Otimização de performance
- Novos casos de uso

**Desenvolvido com 💡 Lógica Proposicional e 🚀 IA Generativa**
