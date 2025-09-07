class AbrigoAnimais {
  // Dados estáticos para acesso rápido e seguro, garantindo que a fonte da verdade seja única.
  static ANIMAIS_DATA = {
    Rex: { especie: 'cão', brinquedos: ['RATO', 'BOLA'] },
    Mimi: { especie: 'gato', brinquedos: ['BOLA', 'LASER'] },
    Fofo: { especie: 'gato', brinquedos: ['BOLA', 'RATO', 'LASER'] },
    Zero: { especie: 'gato', brinquedos: ['RATO', 'BOLA'] },
    Bola: { especie: 'cão', brinquedos: ['CAIXA', 'NOVELO'] },
    Bebe: { especie: 'cão', brinquedos: ['LASER', 'RATO', 'BOLA'] },
    Loco: { especie: 'jabuti', brinquedos: ['SKATE', 'RATO'] }
  };
  
  static BRINQUEDOS_VALIDOS = new Set(['RATO', 'BOLA', 'LASER', 'CAIXA', 'NOVELO', 'SKATE']);

  /**
   * Método principal para processar as adoções.
   * @param {string} brinquedosPessoa1Str - String com brinquedos da pessoa 1.
   * @param {string} brinquedosPessoa2Str - String com brinquedos da pessoa 2.
   * @param {string} animaisStr - String com a ordem dos animais.
   */
  encontraPessoas(brinquedosPessoa1Str, brinquedosPessoa2Str, animaisStr) {
    try {
      // 1. Processamento e validação das entradas.
      const brinquedosPessoa1 = this._processarEntrada(brinquedosPessoa1Str, AbrigoAnimais.BRINQUEDOS_VALIDOS, 'Brinquedo inválido');
      const brinquedosPessoa2 = this._processarEntrada(brinquedosPessoa2Str, AbrigoAnimais.BRINQUEDOS_VALIDOS, 'Brinquedo inválido');
      const animaisConsiderados = this._processarEntrada(animaisStr, new Set(Object.keys(AbrigoAnimais.ANIMAIS_DATA)), 'Animal inválido');

      const animaisAdotados = {};
      const animaisPorPessoa = { 1: 0, 2: 0 };
      const resultados = [];

      // 2. Iteração sobre os animais na ordem especificada.
      for (const animalNome of animaisConsiderados) {
        if (!AbrigoAnimais.ANIMAIS_DATA[animalNome]) {
            throw new Error('Animal inválido');
        }

        const animal = AbrigoAnimais.ANIMAIS_DATA[animalNome];
        const podeAdotar1 = this._verificaCriterios(animal, brinquedosPessoa1, animaisAdotados);
        const podeAdotar2 = this._verificaCriterios(animal, brinquedosPessoa2, animaisAdotados);
        
        // 3. Aplicação das regras de adoção.
        let status = 'abrigo';
        if (podeAdotar1 && podeAdotar2) {
            // Regra 4: Se ambas as pessoas puderem, ninguém adota.
            status = 'abrigo';
        } else if (podeAdotar1 && animaisPorPessoa[1] < 3) {
            // Regra 5: Limite de 3 animais por pessoa.
            status = 'pessoa 1';
            animaisPorPessoa[1]++;
            animaisAdotados[animalNome] = true;
        } else if (podeAdotar2 && animaisPorPessoa[2] < 3) {
            status = 'pessoa 2';
            animaisPorPessoa[2]++;
            animaisAdotados[animalNome] = true;
        }
        resultados.push(`${animalNome} - ${status}`);
      }

      // 4. Retorno da lista ordenada.
      resultados.sort();
      return { lista: resultados };

    } catch (error) {
      // 5. Tratamento de erros.
      return { erro: error.message };
    }
  }

  /**
   * Método auxiliar para validar e processar as strings de entrada.
   * Lança um erro se encontrar itens inválidos ou duplicados.
   */
  _processarEntrada(str, validosSet, mensagemErro) {
    if (!str) return [];
    const itens = str.split(',').map(item => item.trim());
    const itensUnicos = new Set();
    
    for (const item of itens) {
      if (itensUnicos.has(item) || !validosSet.has(item)) {
        throw new Error(mensagemErro);
      }
      itensUnicos.add(item);
    }
    return Array.from(itensUnicos);
  }

  /**
   * Método que centraliza a lógica de adoção por tipo de animal.
   */
  _verificaCriterios(animal, brinquedosPessoa, animaisAdotados) {
    const brinquedosAnimal = animal.brinquedos;
    const especie = animal.especie;

    // Regra 1: Cães (pode intercalar brinquedos)
    if (especie === 'cão') {
      let indexAnimal = 0;
      let indexPessoa = 0;
      while (indexAnimal < brinquedosAnimal.length && indexPessoa < brinquedosPessoa.length) {
        if (brinquedosPessoa[indexPessoa] === brinquedosAnimal[indexAnimal]) {
          indexAnimal++;
        }
        indexPessoa++;
      }
      return indexAnimal === brinquedosAnimal.length;
    }

    // Regra 3: Gatos (não dividem seus brinquedos)
    if (especie === 'gato') {
      return brinquedosPessoa.length === brinquedosAnimal.length &&
             brinquedosAnimal.every((brinquedo, i) => brinquedosPessoa[i] === brinquedo);
    }

    // Regra 6: Jabuti Loco (precisa de companhia e não se importa com a ordem)
    if (especie === 'jabuti') {
      const temCompanhia = Object.values(animaisAdotados).includes(true);
      const temBrinquedos = brinquedosAnimal.every(brinquedo => brinquedosPessoa.includes(brinquedo));
      return temCompanhia && temBrinquedos;
    }
    
    return false;
  }
}

export { AbrigoAnimais as AbrigoAnimais };