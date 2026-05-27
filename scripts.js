let GEMINI_MODEL = 'gemini-2.0-flash-exp';
let GEMINI_API_KEY = '';
let GEMINI_API_URL = '';
let API_VERSION = 'v1';

const apiKeyElements = {
    input: document.getElementById('api-key-input'),
    saveBtn: document.getElementById('save-api-key'),
    status: document.getElementById('api-key-status')
};

function carregarAPIKey() {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
        GEMINI_API_KEY = savedKey;
        atualizarStatusAPIKey(true);
        apiKeyElements.input.value = '*'.repeat(16);

        const savedModel = localStorage.getItem('gemini_model');
        const savedVersion = localStorage.getItem('gemini_api_version');
        if (savedModel) GEMINI_MODEL = savedModel;
        if (savedVersion) API_VERSION = savedVersion;

        if (GEMINI_MODEL && API_VERSION) {
            GEMINI_API_URL = `https://generativelanguage.googleapis.com/${API_VERSION}/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
        }
    } else {
        atualizarStatusAPIKey(false);
    }
}

function salvarAPIKey() {
    const key = apiKeyElements.input.value.trim();

    if (!key) {
        mostrarMensagemAPI('Por favor, insira uma API Key válida.', 'erro');
        return;
    }

    GEMINI_API_KEY = key;
    localStorage.setItem('gemini_api_key', key);
    apiKeyElements.input.value = '*'.repeat(16);
    atualizarStatusAPIKey(true);

    configurarGemini25();
}

function atualizarStatusAPIKey(estaSalva) {
    if (estaSalva) {
        apiKeyElements.status.innerHTML = `
            <span class="api-key-valid">
                <i class="fas fa-check-circle"></i> API Key configurada
                <button class="toggle-api-key" onclick="limparAPIKey()">
                    <i class="fas fa-times"></i> Remover
                </button>
            </span>
        `;
    } else {
        apiKeyElements.status.innerHTML = `
            <span class="api-key-invalid">
                <i class="fas fa-exclamation-triangle"></i> API Key não configurada
            </span>
        `;
    }
}

function limparAPIKey() {
    GEMINI_API_KEY = '';
    GEMINI_API_URL = '';
    localStorage.removeItem('gemini_api_key');
    localStorage.removeItem('gemini_model');
    localStorage.removeItem('gemini_api_version');
    apiKeyElements.input.value = '';
    atualizarStatusAPIKey(false);
    mostrarMensagemAPI('API Key removida.', 'info');
}

function mostrarMensagemAPI(mensagem, tipo) {
    document.querySelectorAll('.mensagem-flutuante').forEach(msg => msg.remove());

    const mensagemElement = document.createElement('div');
    mensagemElement.className = 'mensagem-flutuante';
    mensagemElement.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        text-align: center;
        max-width: 90%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;

    if (tipo === 'erro') {
        mensagemElement.style.backgroundColor = '#e63946';
    } else if (tipo === 'sucesso') {
        mensagemElement.style.backgroundColor = '#2a9d8f';
    } else {
        mensagemElement.style.backgroundColor = '#6c757d';
    }

    mensagemElement.textContent = mensagem;
    document.body.appendChild(mensagemElement);

    setTimeout(() => {
        mensagemElement.remove();
    }, 5000);
}

async function configurarGemini25() {
    if (!GEMINI_API_KEY) {
        mostrarMensagemAPI('API Key não configurada.', 'erro');
        return false;
    }

    mostrarMensagemAPI('🚀 Configurando para Gemini 2.0/2.5...', 'info');

    const modelosGemini25 = [
        'gemini-2.0-flash',
        'gemini-2.0-flash-001',
        'gemini-2.0-flash-lite',
        'gemini-2.0-flash-lite-001',
        'gemini-2.5-flash',
        'gemini-2.5-flash-lite',
        'gemini-2.5-pro'
    ];

    for (const modelo of modelosGemini25) {
        try {
            const urlTeste = `https://generativelanguage.googleapis.com/v1/models/${modelo}:generateContent?key=${GEMINI_API_KEY}`;

            console.log(`🧪 Testando: ${modelo}`);

            const payloadTeste = {
                contents: [{
                    parts: [{
                        text: "Responda APENAS com 'OK'"
                    }]
                }],
                generationConfig: {
                    maxOutputTokens: 5,
                    temperature: 0.1
                }
            };

            const response = await fetch(urlTeste, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payloadTeste)
            });

            if (response.ok) {
                const result = await response.json();
                const texto = result.candidates?.[0]?.content?.parts?.[0]?.text;

                if (texto && texto.includes('OK')) {
                    console.log(`✅ Modelo funcionando: ${modelo}`);

                    GEMINI_MODEL = modelo;
                    API_VERSION = 'v1';
                    GEMINI_API_URL = urlTeste;

                    localStorage.setItem('gemini_model', GEMINI_MODEL);
                    localStorage.setItem('gemini_api_version', API_VERSION);

                    mostrarMensagemAPI(`✅ Gemini ${modelo} configurado!`, 'sucesso');
                    return true;
                }
            } else {
                const errorData = await response.json();
                console.log(`❌ ${modelo}: ${errorData.error?.message}`);
            }
        } catch (error) {
            console.log(`❌ Erro com ${modelo}:`, error.message);
        }
    }

    mostrarMensagemAPI('❌ Nenhum modelo Gemini 2.0/2.5 funcionou', 'erro');
    return false;
}

async function traduzirLogica(textoEntrada, tipo) {
    if (!GEMINI_API_KEY) {
        throw new Error('API Key não configurada.');
    }

    if (!GEMINI_API_URL) {
        const configurado = await configurarGemini25();
        if (!configurado) {
            throw new Error('Falha ao configurar a API.');
        }
    }

    let prompt;
    if (tipo === 'cpc') {
        prompt = `TRADUZA esta fórmula CPC para português natural.

FÓRMULA: ${textoEntrada}

REGRAS:
- Traduza APENAS a fórmula
- Use português claro e natural
- Não explique nem comente
- Responda SOMENTE com a tradução

TRADUÇÃO:`;
    } else {
        prompt = `TRADUZA esta frase para fórmula do Cálculo Proposicional Clássico.

FRASE: "${textoEntrada}"

REGRAS:
- Use símbolos: ∧ (e), ∨ (ou), → (se...então), ↔ (se e somente se), ¬ (não)
- Use letras maiúsculas (P, Q, R...)
- Não explique nem comente  
- Responda SOMENTE com a fórmula

FÓRMULA CPC:`;
    }

    const payload = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }],
        generationConfig: {
            maxOutputTokens: 150,
            temperature: 0.1,
            topP: 0.8,
            topK: 40
        }
    };

    console.log('📤 Enviando para Gemini 2.0/2.5:', GEMINI_MODEL);

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro ${response.status}: ${errorData.error?.message || 'Falha na API'}`);
        }

        const result = await response.json();
        console.log('📥 Resposta:', result);

        // Extrair texto da resposta
        const texto = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (texto && texto.trim() !== '') {
            console.log('✅ Texto recebido:', texto);
            return texto.trim();
        } else {
            console.error('❌ Resposta vazia:', result);
            throw new Error("Resposta vazia da API");
        }
    } catch (error) {
        console.error('💥 Erro na tradução:', error);
        throw error;
    }
}

const elementos = {
    nlInput: document.getElementById('nl-input'),
    nlToCpcBtn: document.getElementById('nl-to-cpc-btn'),
    nlLoader: document.getElementById('nl-loader'),
    nlResult: document.getElementById('nl-result'),
    nlResultContent: document.getElementById('nl-result-content'),
    nlError: document.getElementById('nl-error'),
    nlSuccess: document.getElementById('nl-success'),

    cpcInput: document.getElementById('cpc-input'),
    cpcToNlBtn: document.getElementById('cpc-to-nl-btn'),
    cpcLoader: document.getElementById('cpc-loader'),
    cpcResult: document.getElementById('cpc-result'),
    cpcResultContent: document.getElementById('cpc-result-content'),
    cpcError: document.getElementById('cpc-error'),
    cpcSuccess: document.getElementById('cpc-success')
};

window.loadExample = function (tipo, texto) {
    if (tipo === 'nl') {
        elementos.nlInput.value = texto;
        elementos.nlInput.focus();
    } else {
        elementos.cpcInput.value = texto;
        elementos.cpcInput.focus();
    }
}

window.limparAPIKey = limparAPIKey;

function mostrarElemento(elemento) {
    if (elemento) elemento.style.display = 'block';
}

function esconderElemento(elemento) {
    if (elemento) elemento.style.display = 'none';
}

function mostrarLoader(loader) {
    if (loader) loader.style.display = 'block';
    elementos.nlToCpcBtn.disabled = true;
    elementos.cpcToNlBtn.disabled = true;
}

function esconderLoader(loader) {
    if (loader) loader.style.display = 'none';
    elementos.nlToCpcBtn.disabled = false;
    elementos.cpcToNlBtn.disabled = false;
}

function mostrarErro(erroElemento, mensagem) {
    if (erroElemento) {
        erroElemento.textContent = mensagem;
        mostrarElemento(erroElemento);
    }
}

function mostrarSucesso(sucessoElemento, mensagem) {
    if (sucessoElemento) {
        sucessoElemento.textContent = mensagem;
        mostrarElemento(sucessoElemento);
    }
}

async function traduzirParaCPC() {
    const texto = elementos.nlInput.value.trim();

    if (!texto) {
        mostrarErro(elementos.nlError, 'Por favor, digite uma sentença em português.');
        return;
    }

    mostrarLoader(elementos.nlLoader);
    esconderElemento(elementos.nlResult);
    esconderElemento(elementos.nlError);
    esconderElemento(elementos.nlSuccess);

    try {
        const resultado = await traduzirLogica(texto, 'nl');
        elementos.nlResultContent.textContent = resultado;
        mostrarElemento(elementos.nlResult);
        mostrarSucesso(elementos.nlSuccess, 'Tradução realizada com sucesso!');
    } catch (erro) {
        console.error('Erro na tradução:', erro);
        mostrarErro(elementos.nlError, `Erro: ${erro.message}`);
    } finally {
        esconderLoader(elementos.nlLoader);
    }
}

async function traduzirParaPortugues() {
    const formula = elementos.cpcInput.value.trim();

    if (!formula) {
        mostrarErro(elementos.cpcError, 'Por favor, digite uma fórmula CPC.');
        return;
    }

    mostrarLoader(elementos.cpcLoader);
    esconderElemento(elementos.cpcResult);
    esconderElemento(elementos.cpcError);
    esconderElemento(elementos.cpcSuccess);

    try {
        const resultado = await traduzirLogica(formula, 'cpc');
        elementos.cpcResultContent.textContent = resultado;
        mostrarElemento(elementos.cpcResult);
        mostrarSucesso(elementos.cpcSuccess, 'Tradução realizada com sucesso!');
    } catch (erro) {
        console.error('Erro na tradução:', erro);
        mostrarErro(elementos.cpcError, `Erro: ${erro.message}`);
    } finally {
        esconderLoader(elementos.cpcLoader);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('Tradutor de Lógica Proposicional inicializado!');

    carregarAPIKey();

    apiKeyElements.saveBtn.addEventListener('click', salvarAPIKey);
    apiKeyElements.input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            salvarAPIKey();
        }
    });

    elementos.nlToCpcBtn.addEventListener('click', traduzirParaCPC);
    elementos.cpcToNlBtn.addEventListener('click', traduzirParaPortugues);

    document.querySelectorAll('.example-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            loadExample(this.dataset.type, this.dataset.text);
        });
    });
});
