// Gerenciador de Interface do Usuário
const UIHandler = {
    // Elementos DOM
    elements: {
        nlInput: null,
        nlToCpcBtn: null,
        nlLoader: null,
        nlResult: null,
        nlResultContent: null,
        nlError: null,
        
        cpcInput: null,
        cpcToNlBtn: null,
        cpcLoader: null,
        cpcResult: null,
        cpcResultContent: null,
        cpcError: null
    },

    // Inicializar elementos
    init() {
        this.elements = {
            nlInput: document.getElementById('nl-input'),
            nlToCpcBtn: document.getElementById('nl-to-cpc-btn'),
            nlLoader: document.getElementById('nl-loader'),
            nlResult: document.getElementById('nl-result'),
            nlResultContent: document.getElementById('nl-result-content'),
            nlError: document.getElementById('nl-error'),
            
            cpcInput: document.getElementById('cpc-input'),
            cpcToNlBtn: document.getElementById('cpc-to-nl-btn'),
            cpcLoader: document.getElementById('cpc-loader'),
            cpcResult: document.getElementById('cpc-result'),
            cpcResultContent: document.getElementById('cpc-result-content'),
            cpcError: document.getElementById('cpc-error')
        };
    },

    // Mostrar loader
    showLoader(loader) {
        if (loader) {
            loader.style.display = 'block';
        }
    },

    // Esconder loader
    hideLoader(loader) {
        if (loader) {
            loader.style.display = 'none';
        }
    },

    // Mostrar elemento
    showElement(element) {
        if (element) {
            element.style.display = 'block';
        }
    },

    // Esconder elemento
    hideElement(element) {
        if (element) {
            element.style.display = 'none';
        }
    },

    // Mostrar erro
    showError(errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            this.showElement(errorElement);
            
            // Animar a exibição do erro
            gsap.fromTo(errorElement, 
                { opacity: 0, scale: 0.9 }, 
                { opacity: 1, scale: 1, duration: 0.3 }
            );
        }
    },

    // Mostrar resultado
    showResult(resultElement, contentElement, content) {
        if (contentElement && resultElement) {
            contentElement.textContent = content;
            this.showElement(resultElement);
            
            // Animar a exibição do resultado
            gsap.fromTo(resultElement, 
                { opacity: 0, y: 20 }, 
                { opacity: 1, y: 0, duration: 0.5 }
            );
        }
    },

    // Limpar resultados
    clearResults() {
        this.hideElement(this.elements.nlResult);
        this.hideElement(this.elements.nlError);
        this.hideElement(this.elements.cpcResult);
        this.hideElement(this.elements.cpcError);
    },

    // Validar entrada NL
    validateNLInput(text) {
        if (!text || text.trim() === '') {
            return 'Por favor, digite uma sentença em português.';
        }
        if (text.length < 3) {
            return 'A sentença deve ter pelo menos 3 caracteres.';
        }
        return null;
    },

    // Validar entrada CPC
    validateCPCInput(formula) {
        if (!formula || formula.trim() === '') {
            return 'Por favor, digite uma fórmula CPC.';
        }
        return null;
    }
};

// Exportar para uso global
window.UIHandler = UIHandler;