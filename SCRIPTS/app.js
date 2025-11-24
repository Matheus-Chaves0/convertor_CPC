// Aplicação principal
class CPCTranslatorApp {
    constructor() {
        this.isTranslating = false;
        this.init();
    }

    init() {
        // Inicializar UI Handler
        UIHandler.init();

        // Configurar event listeners
        this.setupEventListeners();

        // Executar animações iniciais
        this.runInitialAnimations();
    }

    setupEventListeners() {
        const { nlToCpcBtn, cpcToNlBtn, nlInput, cpcInput } = UIHandler.elements;

        // Botão NL para CPC
        nlToCpcBtn.addEventListener('click', () => this.handleNLtoCPCTranslation());

        // Botão CPC para NL
        cpcToNlBtn.addEventListener('click', () => this.handleCPCtoNLTranslation());

        // Atalhos de teclado
        nlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.handleNLtoCPCTranslation();
            }
        });

        cpcInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleCPCtoNLTranslation();
            }
        });

        // Limpar resultados ao digitar
        nlInput.addEventListener('input', () => {
            UIHandler.hideElement(UIHandler.elements.nlResult);
            UIHandler.hideElement(UIHandler.elements.nlError);
        });

        cpcInput.addEventListener('input', () => {
            UIHandler.hideElement(UIHandler.elements.cpcResult);
            UIHandler.hideElement(UIHandler.elements.cpcError);
        });
    }

    async handleNLtoCPCTranslation() {
        if (this.isTranslating) return;

        const text = UIHandler.elements.nlInput.value.trim();
        const validationError = UIHandler.validateNLInput(text);

        if (validationError) {
            UIHandler.showError(UIHandler.elements.nlError, validationError);
            return;
        }

        await this.executeTranslation(
            'nl',
            text,
            UIHandler.elements.nlLoader,
            UIHandler.elements.nlResult,
            UIHandler.elements.nlResultContent,
            UIHandler.elements.nlError
        );
    }

    async handleCPCtoNLTranslation() {
        if (this.isTranslating) return;

        const formula = UIHandler.elements.cpcInput.value.trim();
        const validationError = UIHandler.validateCPCInput(formula);

        if (validationError) {
            UIHandler.showError(UIHandler.elements.cpcError, validationError);
            return;
        }

        await this.executeTranslation(
            'cpc',
            formula,
            UIHandler.elements.cpcLoader,
            UIHandler.elements.cpcResult,
            UIHandler.elements.cpcResultContent,
            UIHandler.elements.cpcError
        );
    }

    async executeTranslation(type, input, loader, result, resultContent, error) {
        this.isTranslating = true;

        // Mostrar loader e esconder resultados anteriores
        UIHandler.showLoader(loader);
        UIHandler.hideElement(result);
        UIHandler.hideElement(error);

        try {
            let translationResult;
            
            if (type === 'nl') {
                translationResult = await GeminiAPI.translateNLtoCPC(input);
            } else {
                translationResult = await GeminiAPI.translateCPCtoNL(input);
            }

            UIHandler.showResult(result, resultContent, translationResult);

        } catch (error) {
            console.error('Erro na tradução:', error);
            UIHandler.showError(error, 'Erro ao traduzir. Tente novamente.');
        } finally {
            UIHandler.hideLoader(loader);
            this.isTranslating = false;
        }
    }

    runInitialAnimations() {
        // Animações iniciais com GSAP
        gsap.from('header', { y: -50, opacity: 0, duration: 0.8 });
        gsap.from('.card', { y: 30, opacity: 0, duration: 0.6, stagger: 0.2, delay: 0.3 });
        gsap.from('.info-section', { y: 30, opacity: 0, duration: 0.6, delay: 0.6 });
        gsap.from('.examples', { y: 30, opacity: 0, duration: 0.6, delay: 0.8 });
    }
}

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CPCTranslatorApp();
});