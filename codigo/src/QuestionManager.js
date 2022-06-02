import Question from "./Question.js";

export class QuestionManager {
    constructor(params = {}) {
        const defaultParams = {
            perguntas: [],
        };
        Object.assign(this, defaultParams, params);
    }

    lerPergunta() {
        this.perguntas.push(new Question());
        var descricao = 'CLASSE ENCAPSULA DADOS PARA DESCREVER O CONTEÚDO DE ALGUMA ENTIDADE DO MUNDO REAL';
        this.perguntas[0].setPergunta(descricao, 0, 'ENCAPSULAMENTO', 'VF', 'V');

        this.perguntas.push(new Question());
        var descricao = 'SUPERCLASSE É UMA ESPECIALIZAÇÃO DE UM CONJUNTO DE CLASSES ATRAVÉS DA HERANÇA';
        this.perguntas[1].setPergunta(descricao, 0, 'HERANÇA', 'VF', 'F');

        this.perguntas.push(new Question());
        var descricao = 'OBJETOS SÃO INSTÂNCIAS DE UMA CLASSE QUE POSSUI OS ATRIBUTOS E AS OPERAÇÕES DEFINIDOS NA CLASSE';
        this.perguntas[2].setPergunta(descricao, 0, 'ABSTRAÇÃO', 'VF', 'V');
    }

}