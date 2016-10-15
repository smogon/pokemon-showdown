# **Engenharia de Software**
# Assignment 1: Software Processes

## [Pokémon Showdown](https://www.pokemonshowdown.com)

### Introdução

"Pokémon Showdown" é um simulador online no *browser* de batalha entre *Pokémons*.
Permite aos jogadores utilizarem personagens de todas as gerações do vídeo jogo, assim como combater em batalhas individuais (1v1), duplas (2v2), ou triplas (3v3).
Proporciona ainda diversos modos de jogo que não existem no jogo original, tabelas de classificação e a possibilidade de comunicar com os restantes jogadores através de um *chat*.

O repositório em análise contém os ficheiros necessários para a configuração de um servidor de "Pokémon Showdown". O servidor providencia os serviços fundamentais para o funcionamento dos sistemas de combate, interação entre clientes, autenticação, entre outros.

O projeto foi criado em outubro de 2011, pelo Guangcong Luo aka "Zarel", que é o responsável máximo pelo "Pokémon Showdown". A equipa de *developers* oficiais é composta por mais cinco elementos, nomeadamente Chris Monsanto ("chaos"), Juanma Serrano ("Joim"), Leonardo Julca ("Slayer95"), Mathieu Dias-Martins ("Marty"), e o "The Immortal".

###1.Processo

####1.1.Contribuir

Qualquer pessoa que deseje contribuir para o projeto deve fazer as suas alterações e propô-las através de um *Pull Request* onde as alterações vão ser revistas pelos restantes contribuidores e podem ser aceites pelo Zarel, se este achar que estas são pertinentes para o projeto.

Como se trata de um projeto sem fins lucrativos e em que os contribuidores são voluntários não existe qualquer estrutura organizacional estrita: Não existem reuniões de staff; Não existem prazos; Todos os contribuidores, pertencentes à equipa principal ou não, respondem peranto o líder do projeto, Zarel.

Os contribuidores escolhem aquilo em que querem trabalhar através da consulta de um tópico de sugestões ou de um tópico de *bug reports* nos fórums do "Pokémon Showdown".

####1.2.Processo

Através do contacto com os contribuidores e líder do projeto, verificamos que o processo, embora não explicitamente definido, segue os princípios de um processo *Agile*: O planeamento é feito passo a passo e de acordo com os requerimentos e *feedback* dos utilizadores.
Segue também um modelo incremental, em que a especificação, *design*/desenvolvimento e a validação do código estão intercalados. Para além disso, o contribuidor é responsável por testar as mudanças que deseja introduzir, sendo que quando as propõe através de um *Pull Request* o código deve ser funcional.

<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/15113826/19389757/13eaace0-921d-11e6-88d3-40cde5a0016d.png" alt="incremental-model"/>
</p>

####1.3.Estilo do Código

O *standard* a nível de estilo de código é garantido através da utilização de *ESLint*, uma aplicação de *linting* para JavaScript. As regras de estilo usadas pelos contribuidores podem ser consultadas [aqui](https://github.com/Zarel/Pokemon-Showdown/blob/master/.eslintrc).

####1.4.Branch Model

Pela análise vimos que não há um esquema de *branches* definido no projeto. Os contribuidores fazem *fork* do repositório original e no seu repositório criam *branches* para implementar/corrigir funcionalidades. Quando querem que o código seja usado fazem um *Pull Request* desse *branch* para o *branch master* do repositório original, e esperam que seja aprovado pelo Zarel.

####1.5.Comunicação

A comunicação entre contribuidores acerca do planeamento e futuro do projeto, assim como de quaisquer alterações que estejam a ser implementadas, é feita essencialmente em dois canais: Na sala *Develop* no chat do "Pokémon Showdown" ou nos *Pull Requests*.


###2.Análise Crítica

####2.1.Processo

Somos da opinião que o processo utilizado se adequa à natureza do projeto. "Pokemon Showdown" está em constante desenvolvimento e recebe feedback dos utilizadores diariamente, pelo que um processo Agile e Incremental é, a nosso ver, a escolha natural e adequada.

No entanto, existem algumas situações das quais podem surgir problemas. Nomeadamente, o teste dos *Pull Requests* dos contribuidores é da responsabilidade do próprio contribuidor o que, embora pareça que funciona bem no contexto deste projeto, pode causar situações em que as alterações são implementadas na versão pública com erros que passaram despercebidos.

Outra situação, ainda que não muito frequente, e que se deve a alguma organização resultante deste processo é a possibilidade de mais do que uma pessoa estar a trabalhar na mesma ideia. Isto leva a um claro desperdício de tempo dos contribuidores e de recursos, uma vez que estes poderiam estar a contribuir noutro aspecto do projeto.

####2.2.Commits

Apesar de ser um projeto que funciona à base de voluntariado, sem qualquer tipo de fins lucrativos, em que os contribuídores não têm qualquer tipo de obrigação para com o projeto, nem pressão por parte de *dead lines*, verificamos que este se encontra em desenvolvimento activo, com vários contribuídores (cerca de 134)  a trabalhar em simultâneo e com commits regulares. Uma métrica que representa bem esta observação, é que no último ano foram feitos 38 commits por semana.

<p align="center">
    <img src="https://cloud.githubusercontent.com/assets/17515494/19391548/0e4bb916-9225-11e6-84e7-162d4627f638.png"  alt="incremental-model"/>
</p>

####2.3.Sugestões

--alguem que escreva uma cena antes 

Uma vez que nunca é possivel garantir a qualidade de 100% dos *commits*, seria útil se existisse membros do *staff*, ou mesmo contribuidores, que se dedicassem a testar estes (ou seja, criar uma *test team*), antes de implementarem no projeto, visto que com qualquer mínimo erro, pode originar um efeito borboleta (apartir de um erro pequeno, tudo o que tive como base pode estar errado). Esta equipa poderia também testar a qualidade de adaptação de código, de forma a que qualquer pessoa possa perceber e reutilizar o códgio, sem qualquer tipo de problemas. Assim, garante-se sempre a integridade e qualidade do projeto final.

Deveria haver outra fonte de discussão, onde toda a gente que quiser contribuir saiba claramente o que os outros colaboradores e membros do "Pokémon Showdown" estão a trabalhar. Ao realizar esta especificação de trabalho, vai garantir que exista algum tipo de organização à equipa, e promove que os membros se entre-ajudem, sem prejudicar o trabalho dos outros.


--este paragrafo aqui não tenho a certeza. Queria só usar a expressão dead lines e foi isto que me veio à cabeça :).

--Isto vai um bocado contra a ideia dos gajos, alguém que leia e opine.

Uma vez que não existe obrigação entre os membros com o *development* deste *open source*, é difícil manter uma agenda do conteúdo que se vai adicionar ao projeto, uma vez que obrigava os colaboradores a porem este como prioridade. Tal ideia seria apenas possível se contratássem *staff* que trabalhassem um certo número de horas, podendo garantir assim *dead lines*

-Meter o pikachu mais forte ;).


##Trabalho realizado por:

[Ana Rita Torres](https://github.com/AnaRitaTorres): Contribuição xx%.

[Diogo Cepa](https://github.com/dcepa95): Contribuição xx%.

[João Loureiro](https://github.com/Katchau): Contribução xx%.

[João Pedro Silva](https://github.com/joaosilva22): Contribuição xx%.
