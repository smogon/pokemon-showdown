
# **Engenharia de Software**
# Assignment 2: Requirements Management

## [Pokémon Showdown](https://www.pokemonshowdown.com)

### Introdução
O cerne deste relatório baseia-se no processo de estudo das necessidades do cliente e do utilizador para obtenção de requisitos de software, mais vulgarmente conhecidos por "Engenharia de Requisitos".

### 1.Requisitos

#### 1.1.Sistema

O "Pokémon Showdown" embora desenvolvido, em grande parte, para Chrome também suporta os seguintes *browsers*:
<p> -Firefox </p>
<p> -Opera </p>
<p> -Safari 5+ </p>
<p> -iE 11+ </p>
    
Este também pode ser utilizado em Safari 4+ e iE9, mas com uma *performance* aquém do expectável e com impossibilidade de usufruir de algumas *features*.

#### 1.2.Elicitação
Este parâmetro visa a interação com recursos humanos e técnicos com o objetivo de recolher informação sobre os requisitos a desenvolver, utilizando métodos como: entrevistas, questionários, *brain storming*, entre outros.

#### 1.3.Análise e Negociação
O tópico em estudo pretende detetar, assim como, resolver conflitos entre requisitos e numa fase final o alcance de um consenso, relativamente aos requisitos a implementar. Para este efeito, usam-se técnicas de modelação e de verificação.

#### 1.4.Especificação
A produção do software de requisitos fica a cargo da especificação, normalmente, acompanhados por modelos, como o *case model* e o *domain model*.

#### 1.5.Validação
A validação do projeto passa por uma demonstração de que os requisitos definem o sistema que o cliente, realmente, deseja e ambiciona.

### Use Cases

|Nome|Actor|Objectivo|Requerimentos|Resultado|
|:--:|:----:|:-------:|:-----------:|:-------:|
|Escolher Nome|Jogador|Escolher um nickname que o identifica no jogo|N/A|É atribuído ao jogador o username que este escolheu, caso esteja disponível|
|Registar Nome|Jogador|Associar uma password ao username escolhido|Escolher Nome|O nome do jogador é associado a uma password|
|Procurar Batalha|Jogador|Iniciar uma batalha contra outro jogador|Escolher Nome|O jogador é colocado numa batalha contra outro jogador|
|Entrar em Sala de Chat|Jogador|Escolher e entrar numa sala de chat|Escolher Nome|O jogador entra na sala escolhida e pode começar a falar|
|Construir Equipa|Jogador|Criar uma equipa de pokemons que pode ser usada em batalha|N/A|O jogador constrói uma equipa de pokemons que pode utilizar em batalhas com outros utilizadores|
|Ver Tabelas de Classificação|Jogador|Consultar as tabelas de classificação|N/A|São mostradas as tabelas de classificação|
|Assistir a Batalha|Jogador|Assistir a uma batalha entre terceiros|N/A|Permite ao jogador ser espectador de uma batalha entre outros dois jogadores|
|Procurar Utilizador|Jogador|Procurar outro utilizador pelo seu username|N/A|Mostra ao jogador opções para interagir com o utilizador que procurava, se este existir|
|Enviar Mensagem|Jogador|Enviar uma mensagem numa sala de chat|Entrar em Sala de Chat|O jogador envia uma mensagem que é vista pelos restantes na mesma sala|
|Banir Jogador|Admin|Banir um jogador de uma sala de chat|N/A|O admin impede o jogador de estar presente numa sala de chat|
|Promover Jogador|Admin|Aumentar o rank de um jogador|N/A|O admin aumenta o rank do jogador para um nível com mais previlégios na sala de chat|

### Conclusão
