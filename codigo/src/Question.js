export default class Question {
    constructor(params = {}) {
        const defaultParams = {
            descricao: '',
            dificuldade: 0,
            topico: '',
            tipo: '',
            alternativas: [],
            resposta: ''
        };

        Object.assign(this, defaultParams, params);
    }

    setPergunta(descricao, dificuldade, topico, tipo, resposta, alternativas=[]) {
        this.descricao = descricao;
        this.dificuldade = dificuldade;
        this.topico = topico;
        this.tipo = tipo;
        this.resposta = resposta;
        if (this.tipo == 'ALTERNATIVA') {
            this.alternativas = alternativas;
        }
    }
}