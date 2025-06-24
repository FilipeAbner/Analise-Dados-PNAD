const meanings = {
    UF: 'UNIDADE DA FEDERACAO, EXCLUINDO A REGIAO METROPOLITANA E A RIDE',
    RM: 'REGIAO METROPOLITANA, EXCLUINDO A CAPITAL',
  	RIDE: 'REGIAO INTEGRADA DE DESENVOLVIMENTO ECONOMICO, EXCLUINDO A CAPITAL',
};

  const buttons = document.querySelectorAll('.botao');
  const meaningDiv = document.getElementById('meaning');

let selectedButton = null; // Variável para armazenar o botão selecionado

// Adiciona evento de clique para cada botão
buttons.forEach(button => {
  button.addEventListener('click', (event) => {
    // Impede o clique de propagação para o documento
    event.stopPropagation();

    // Remove a classe 'selected' do botão anterior
    if (selectedButton) {
      selectedButton.classList.remove('selected');
    }

    // Adiciona a classe 'selected' ao botão clicado
    button.classList.add('selected');
    selectedButton = button; // Atualiza o botão selecionado

    // Atualiza o conteúdo da caixa de explicação
    const id = button.id;
    meaningDiv.innerHTML = meanings[id] || `${id}: em desenvolvimento`;
  });
});

// Adiciona evento de clique ao container para desmarcar quando clicar fora dos botões
const container = document.querySelector('.container1');
container.addEventListener('click', (event) => {
  // Verifica se o clique foi fora dos botões
  if (!event.target.classList.contains('botao')) {
    if (selectedButton) {
      selectedButton.classList.remove('selected');
      selectedButton = null; // Limpa a seleção
    }
    meaningDiv.innerHTML = 'CLIQUE EM UMA SIGLA'; // Reseta o conteúdo da caixa
  }
});