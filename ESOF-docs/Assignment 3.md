# **Engenharia de Software**
# Assignment 3: Arquitectural Design

## [Pokémon Showdown](https://www.pokemonshowdown.com)

### Introdução
O assunto deste relatório é o design arquitetónico, conceito que visa a organização fundamental de um sistema com os seus componentes, assim como as relações entre estes.
Durante o decorrer do trabalho serão apresentados quatro tipos de diagramas que representam diferentes vistas: Lógica, de Implementação, de Processo e de Desenvolvimento.
Embora o projeto "Pokémon Showdown" não apresente uma arquitetura bem estruturada e rigorosa, vamos tentar representá-la da melhor forma possível.

### 1.Vista Lógica

|Package|Descrição|
|:-----:|:-------:|
|Monitor|Várias funções utilitárias que garantem que a aplicação corre sem problemas|
|Tools|Lida com a obtenção de dados sobre Pokemons, items, etc.|
|LoginServer|Trata com a comunicação com o servidor de login.|
|LaddersRemote|Gere os rankings do servidor oficial em play.pokemonshowdown.com|
|Ladders|Gere os rankings de todos os servidores que não são o servidor oficial. Mais especificamente é responsável por calcular e armazenar os elo ratings dos jogadores|
|Users|A maior parte da comunicação com os utilizadores é da responsabilidade desta package|
|Punishments|É responsável por aplicar e manter as penalizações aos utilizadores de Pokemon Showdown. Os castigos podem ser de quatro tipos: Locks, Bans, Homelocks e Rangelocks|
|Chat|Gere as salas de chat do Pokemon Showdown|
|Crashlogger|Mantém registos dos crashes do servidor e notifica o administrador do servidor por email se este assim desejar|
|ChatCommands|Mantém comandos do sistema, que são necessários para correr o servidor de Pokemon Showdown|
|ProcessManager|Abstrai a lógica multiprocesso envolvida em vários processos|
|ChatPlugins|Adiciona e remove comandos de char customizados, como por exemplo jogos baseados em texto tipo hangman, entre outros|
|Tournaments|Lida com a geração e gestão de torneios entre os utilizadores|
|Rooms|Contém todas as salas de chat e salas de jogo|
|RoomGame|É responsável por manter o tipo de jogo associado a uma sala. Este pode ser um combate, um torneio, um jogo à base de texto, etc|
|RoomBattle|Abstrai a lógica multiprocesso de uma sala onde ocorre a simulação de batalha|
|BattleEngine|Trata da simulação de combate entre Pokémons|
|REPL|Read-Eval-Print Loop, recebe o input de um utilizador, avalia-o e devolve o resultado|
|DNSBL|Providencia várias ferramentas que permitem o parsing de IPs e o bloqueio à base de IPs|
|Sockets|Camada de abstração para as conexões multiprocesso de SockJS|
|Verifier|Implementação assíncrona de um verificador de uma chave assinada|
|TeamValidator|Permite a validação de equipas|

### 2.Vista de Implementação

O objetivo da vista de implementação é mostrar como o software é constituído por vários componentes de software e as suas dependências. Para isto, representamos o software num diagrama de componentes.

<p align="center">
  <img src="https://github.com/Katchau/Pokemon-Showdown/blob/master/ESOF-docs/Resources/ComponentDiagram.png?raw=true" alt="incremental-model"/>
</p>

Neste diagrama, o componente central é o Pokemon Showdown. Este componente tem como dependências [es6-shim](https://www.npmjs.com/package/es6-shim), [sockjs](https://www.npmjs.com/package/sockjs), [cloud-env](https://www.npmjs.com/package/cloud-env), [node-static](https://www.npmjs.com/package/node-static), [sugar](https://www.npmjs.com/package/sugar). Este precisa de aceder à informação do utilizador e irá funcionar através de várias salas (componente *rooms*) que, como representado no diagrama, possuem vários tipos. Estas salas gerem toda a interação com o utilizador desde o menu principal até aos vários tipos de jogo, e mesmo o jogo em si. Todas comunicações e comandos funcionam com base no Id da sala. Tem ainda um sistema de classificação, pelo componente *ladder*, que divide os jogadores pelo seu *ELO* proporcionando, assim uma procura de adversário mais equilibrada.

### 3.Vista de Processo

A vista de processo tem como finalidade de mostrar os vários processos a serem executados e a sua interação, durante o decorrer do servidor do *Pokémon Showdown*. Para tal, utilizamos diagramas de atividade para explicitar esta vista.
Para um utilizador iniciar o servidor, é necessário que este crie um ficheiro de configuração do servidor, ou apenas editar um ficheiro de base já existente. De seguida, o utilizador precisa de instalar o [node.js](https://nodejs.org/en/) para poder correr o servidor. Durante o processo de execução, vão ser executados os seguintes passos:

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

O diagrama que representa a vista de desevolvimento visa explorar a relação entre os componentes de software e de hardware. Este mostra o sistema de hardware, assim como os componentes de software distribuídos pelos nós de hardware.

<p align="center">
  <img src="https://github.com/Katchau/Pokemon-Showdown/blob/master/ESOF-docs/Resources/deployment%20view.png?raw=true" alt="incremental-model"/>
</p>

O *web server* do *Pokemón Showdown* permite aos utilizadores usufruirem do jogo em qualquer browser, sendo que alguns deles oferecem ligeiras restriçoes. Os dois nós existentes, o Computador e o Servidor, comunicam através de pedidos *HTTP*.

### Conclusão

##Trabalho realizado por:

[Ana Rita Torres](https://github.com/AnaRitaTorres): Contribuição 25%

[Diogo Cepa](https://github.com/dcepa95): Contribuição 25%

[João Loureiro](https://github.com/Katchau): Contribução 25%

[João Pedro Silva](https://github.com/joaosilva22): Contribuição 25%




