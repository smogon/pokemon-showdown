
# **Engenharia de Software**
# Assignment 2: Requirements Management

## [Pokémon Showdown](https://www.pokemonshowdown.com)

### Introdução
O cerne deste relatório baseia-se no processo de estudo das necessidades do cliente e do utilizador para obtenção de requisitos de software, mais vulgarmente conhecidos por "Engenharia de Requisitos".

### 1.Requisitos

#### 1.1.Sistema

O "Pokémon Showdown" embora desenvolvido, em grande parte, para Chrome também suporta os seguintes *browsers*:
+ Firefox 
+ Opera
+ Safari 5+
+ iE 11+
    
Este também pode ser utilizado em Safari 4+ e iE9, mas com uma *performance* aquém do expectável e com impossibilidade de usufruir de algumas *features*.

Para correr o projeto é ainda necessário ter o Node.js instalado, versão 6.X ou mais recente.

#### 1.2.Requisitos Funcionais

Os seguintes requisitos funcionais descrevem os serviços que o Pokémon Showdown se propõe a disponibilizar aos seus jogadores:
+ Permitir simular uma batalha de Pokémon entre dois jogadores.
+ Implementar salas de chat para facilitar a comunicação entre os jogadores.
+ Manter uma tabela classificativa.
+ Emparelhar jogadores que procuram uma batalha com outros de nível de abilidade semelhante.

#### 1.3.Requisitos Não Funcionais

O Pokemon Showdown deve cumprir os seguintes requisitos não funcionais:
+ Ser robusto de modo a aguentar todo o tráfego a que pode ser sujeito.
+ Ser seguro para não colocar em risco a informação dos seus utilizadores.
+ Ter um tempo de resposta rápido para permitir uma boa experiência de utilização.
+ Ser disponibilizado como software Open Source.

#### 1.2.Elicitação

A escolha do objecto que vai ser o foco do desenvolvimento é feita, essencialmente, de três modos:
+ Através de um [tópico de Bug Reports](http://www.smogon.com/forums/threads/bug-reports-v2-0-read-op-before-posting.3469932/) nos fóruns oficiais;
+ Através de um [tópico de sugestões](http://www.smogon.com/forums/threads/suggestions.3534365/) nos mesmos fóruns;
+ Através da sugestão de um dos contribuidores.

Todos os contribuídores frequentam estas plataformas e estão sempre atentos a qualquer situação que requira ou capture a sua atenção.

#### 1.3.Análise e Negociação

A discussão e análise de novas funcionalidades ocorre, numa primeira fase, no [chat para contribuidores](http://play.pokemonshowdown.com/development) no próprio site do Pokémon Showdown. Aqui os contribuidores podem discutir e elaborar as suas ideias, e ouvir a opinião dos seus pares.

Após o desenvolvimento da funcionalidade, a discussão final é feita no próprio Pull Request. Aqui os contribuidores discutem a viabilidade da ideia e, se o parecer do dono do projeto for positivo, esta é finalmente implementada.

#### 1.4.Especificação
*(isto é suposto estar?)* A produção do software de requisitos fica a cargo da especificação, normalmente, acompanhados por modelos, como o *case model* e o *domain model*.

##### 1.4.1 Use Cases

Casos de utilização correspondem a interações com o sistema, na qual o utilizador pode participar. Estas têm sempre um fim bem definido, sendo este apresentado ao utilizador, sem que este saiba como funciona a máquina por de trás das cortinas.

No *Pokémon Showdown* estes são bastante *user friendly*, ou seja, fornecem uma mensagem clara e consistende daquilo que o projeto é capaz. Segue-se uma imagem dos casos de utilização principais do *Pokémon Showdown*, nas quais estão presentes 2 atores (utilizador normal, e administrador), bem como a descrição da funcionalidade de cada um deles.

<p align="center">
  <img src="https://github.com/Katchau/Pokemon-Showdown/blob/master/ESOF-docs/Resources/Use%20Case%20Model.png?raw=true" alt="incremental-model"/>
</p>


|Nome|Actor|Objectivo|Pré-Requisitos|Resultado|
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

Existem ainda outros casos de utilização mais específicos, nomeadamente ao nivel de criação de equipas, onde se pode criar/editar *pokémons*, existindo vários parâmetros que os definem, como por exemplo, definir o tipo de *pokémon*, escolher ataques,etc . Também se pode visualizar no modo de batalha outros use cases, sendo estes iguais aos jogos da merchandising de *pokémon*. Segue-se uma imagem dos casos de utilização neste caso:

fazer caso de utilização entre jogador - cenas - servidor

##### 1.4.2 Domain Model

O modelo de domínio é um modelo conceptual de um domínio, que representa a situação real deste. Não tem como objetivo a representação das classes a nível de software (diagrama de classes), mas de fazer uma conexão entre os *use cases* e o *software design model*.
Segue-se uma representação do modelo de domínio do *Pokémon Showdown*

<p align="center">
  <img src="https://github.com/Katchau/Pokemon-Showdown/blob/master/ESOF-docs/Resources/domain%20model.png?raw=true" alt="incremental-model"/>
</p>

#### 1.5.Validação
*(remove this?)* A validação do projeto passa por uma demonstração de que os requisitos definem o sistema que o cliente, realmente, deseja e ambiciona.

Embora qualquer pessoa possa ser um contribuidor e existirem instruções para o ser no ficheiro readme.md presente no repositório, não são referidos requisitos apenas o estilo de código a ser usado.
O único responsável pelas validações é o dono, Zarel, onde este assume que o código submetido já foi devidamente testado com sucesso pelo contribuidor, excepto se for de uma dimensão considerável, e através de leitura decide se é válido.

### Conclusão

Em suma, o foco do projeto depende da opinião dos contribuidores onde numa fase inicial existe uma discussão no chat de contribuidores que posteriormente, após desenvolvimento, passa para uma discussão no próprio pull request até ser validado. Tudo isto, tendo sempre em consideração a interação do jogador com o jogo através de várias funcionalidades e costumizações.
