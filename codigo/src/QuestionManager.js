import Question from "./Question";

export class QuestionManager {
    constructor() {
        this.perguntas = [];
        lerPergunta();
    }
    
    lerPergunta() {
        this.perguntas[0] = new Question();
        var descricao = 'CLASSE ENCAPSULA DADOS PARA DESCREVER O CONTEÚDO DE ALGUMA ENTIDADE DO MUNDO REAL';
    
        this.perguntas[0].setPergunta(descricao, 0, 'ENCAPSULAMENTO', 'VF', 'V');
        
    }
    
}