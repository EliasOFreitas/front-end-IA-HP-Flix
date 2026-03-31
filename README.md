## HP Flix - Imersão Front-End com IA (Alura)

Bem-vindo ao HP Flix! Este projeto foi desenvolvido durante a Imersão Front-End com IA da Alura. Trata-se de uma plataforma de streaming temática dedicada ao universo de Harry Potter, abrangendo desde os filmes clássicos até as expectativas para a nova série original da HBO.

## 🚀 Evolução e Melhorias

Partindo da base proposta na imersão, foram implementadas melhorias significativas para elevar a experiência do usuário e a organização do código:

Renderização Dinâmica Otimizada: O loop de geração da estrutura HTML foi refatorado para garantir que cada card possua um id único e acessível. Isso permite uma manipulação via JavaScript muito mais precisa.

Interface Interativa (Card Zoom): Diferente do layout estático, agora, ao clicar em um card, ele é destacado e centralizado na tela, proporcionando uma visualização imersiva do conteúdo.

Experiência Sonora: Adição de trilha sonora de introdução (Intro Music) nas páginas, criando uma atmosfera mágica assim que o usuário acessa o portal.

Conteúdo Atualizado: Curadoria focada nos filmes da saga e na nova série de Harry Potter, mantendo o projeto relevante para as tendências atuais.

## 🛠️ Tecnologias Utilizadas

HTML5: Estruturação semântica da página.

CSS3: Estilização personalizada com foco em responsividade e efeitos de centralização (Modal/Overlay).

JavaScript: Lógica de repetição para criação de cards e manipulação de eventos de áudio e clique.

Inteligência Artificial: Utilizada como copiloto para otimização de scripts e geração de insights para o design temático.

## 🎨 Demonstração das Funcionalidades

Geração de Estrutura via Loop

O código percorre uma lista de objetos e injeta o HTML dinamicamente. A principal mudança foi a inclusão de seletores específicos para cada elemento gerado:
JavaScript
```
// Exemplo da lógica aplicada
const container = document.getElementById('container-cards');
elementos.forEach((item) => {
    container.innerHTML += `
        <div class="card" id="filme-${item.id}" onclick="abrirDestaque(${item.id})">
            <img src="${item.capa}" alt="${item.titulo}">
        </div>
    `;
});
```

## Efeito Centralizar ao Clicar

Implementação de uma função que captura o elemento pelo id e aplica classes CSS para posicionamento absoluto ao centro com fundo escurecido (overlay).

## 🖋️ Autor


Este projeto foi personalizado por Elias Oliveira de Freitas.

Sinta-se à vontade para explorar o código e sugerir melhorias!

Este projeto faz parte do portfólio de estudos em Desenvolvimento de Sistemas.
