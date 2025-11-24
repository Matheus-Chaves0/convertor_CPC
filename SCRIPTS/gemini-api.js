// Configurações da API Gemini
const GEMINI_CONFIG = {
    API_KEY: 'AIzaSyAI5itLQEh58PFThNHNpmn3TKmEZYyj5kk',
    API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
};

// Função para fazer a requisição à API do Gemini
async function callGeminiAPI(prompt) {
    try {
        const response = await fetch(`${GEMINI_CONFIG.API_URL}?key=${GEMINI_CONFIG.API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
        console.error('Erro ao chamar a API:', error);
        throw error;
    }
}

// Função para traduzir de NL para CPC
async function translateNLtoCPC(text) {
    const prompt = `Traduza a seguinte sentença em português para uma fórmula no Cálculo Proposicional Clássico (CPC). Use apenas os conectivos lógicos padrão: ∧ (e), ∨ (ou), → (se...então), ↔ (se e somente se), ¬ (negação). Use letras maiúsculas para proposições atômicas (P, Q, R, etc.). Forneça apenas a fórmula CPC, sem explicações adicionais.

Sentença: "${text}"`;

    return await callGeminiAPI(prompt);
}

// Função para traduzir de CPC para NL
async function translateCPCtoNL(formula) {
    const prompt = `Traduza a seguinte fórmula do Cálculo Proposicional Clássico (CPC) para uma sentença em português natural. Use uma linguagem clara e direta.

Fórmula CPC: "${formula}"`;

    return await callGeminiAPI(prompt);
}

// Exportar funções para uso global
window.GeminiAPI = {
    translateNLtoCPC,
    translateCPCtoNL
};