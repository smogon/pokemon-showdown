# **Engenharia de Software**
# Assignment 3: Arquitectural Design

## [Pokémon Showdown](https://www.pokemonshowdown.com)

### Introdução
O assunto deste relatório é o design arquitetónico, conceito que visa a organização fundamental de um sistema com os seus componentes, assim como as relações entre estes.
Durante o decorrer do trabalho serão apresentados quatro tipos de diagramas que representam diferentes vistas: Lógica, de Implementação, de Processo e de Desenvolvimento.
Embora o projeto "Pokémon Showdown" não apresente uma arquitetura bem estruturada e rigorosa, vamos tentar representá-la da melhor forma possível.

### 1.Vista Lógica

### 2.Vista de Implementação

### 3.Vista de Processo

A vista de processo tem como finalidade de mostrar os vários processos a serem executados, e a sua interação, durante o decorrer do servidor do *Pokémon Showdown*. Para tal, utilizamos diagramas de atividade para exemplificar (?) esta vista.
Para um utilizador inicar o servidor, é necessário que este crie um ficheiro de configuração do servidor, ou apenas editar um ficheiro de base já existente. De seguida, o utilizador precisa de instalar o [node.js](https://nodejs.org/en/) para poder correr o servidor. Durante o processo de execução, vão ser executados os seguintes passos:

<p align="center">
  <img src="https://github.com/Katchau/Pokemon-Showdown/blob/master/ESOF-docs/Resources/server%20boot.png?raw=true" alt="incremental-model"/>
</p>

Esta é uma vista simplificada do processo de *star up* do servidor. É de notar que o *web server* vai já conter informação acerca dos *pokémons* e de outros aspectos referentes a estes (ataques, abilidates, etc..), bem como dos formatos existentes no servidor. Isto serve para que os jogadores possam criar equipas ou apenas vizualisar informação acerca dos *pokémons*, sem ter de voltar a fazer pedidos ao servidor, necessitando apenas de estarem conectados a este.

Durante o decorrer do *Pokémon Showdown* vários utilizadores iram ligar-se a este, ocorrendo várias interacções entre *user* e *server*, obrigando a este último, a executar certos processos. Segue-se um diagrama de atividade, que exemplifica esta relação *user-server*:

<p align="center">
  <img src="https://github.com/Katchau/Pokemon-Showdown/blob/master/ESOF-docs/Resources/server%20run%20time.png?raw=true" alt="incremental-model"/>
</p>

Como se pode observar, quase todas as funcionalidades do *Pokémon Showdown* requerem pedidos constantes do utilizador - servidor e vice versa. Sempre que o utilizador pretende realizar alguma coisa, este vai fazer um *request* ao servidor, sendo que este vai processá-lo, e enviar uma mensagem de resposta. Um exemplo desta situação é nas batalhas, onde o servidor vai esperar pela acção dos dois jogadores, atacar, trocar, ou desistir, e mediante estas vai simular o turno, fazendo as alterações necessárias ao estado de batalha, e envia resposta a ambos os jogadores.
É de notar que todos os processos derivados da escolha do jogador (*Player Choices*) podem ser executadas mais que uma vez, e em simultâneo.

Resumidamente, o *Pokémon Showdown* vai verificar a conectividade de jogadores e responder a *requests* destes, através da execução de um processo que trate o tipo de *request* pedido.

### 4.Vista de Desenvolvimento

### Conclusão

##Trabalho realizado por:

[Ana Rita Torres](https://github.com/AnaRitaTorres): Contribuição .

[Diogo Cepa](https://github.com/dcepa95): Contribuição .

[João Loureiro](https://github.com/Katchau): Contribução .

[João Pedro Silva](https://github.com/joaosilva22): Contribuição .




