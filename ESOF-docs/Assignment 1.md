# **Engenharia de Software**
# Assignment 1: Software Processes

## [Pokémon Showdown](https://www.pokemonshowdown.com)

### Introdução

"Pokémon Showndown" é um simulador online no *browser* de batalha entre *Pokémons*.
Permite aos jogadores utilizarem personagens de todas as gerações do vídeo jogo, assim como combater em batalhas individuais (1v1), duplas (2v2), ou triplas (3v3).
Proporciona ainda diversos modos de jogo que não existem no jogo original, tabelas de classificação e a possibilidade de comunicar com os restantes jogadores através de um *chat*.

O repositório em análise contém os ficheiros necessários para a configuração de um servidor de "Pokémon Showndown". O servidor providencia os serviços fundamentais para o funcionamento dos sistemas de combate, interação entre clientes, autenticação, entre outros.

###1.Processo

####1.1.Contribuir
Qualquer pessoa que deseje contribuir para o projeto deve fazer as suas alterações e propô-las através de um Pull Request onde as alterações vão ser revistas pelos restantes contribuidores e podem ser aceites pelo dono do repositório e criador do projeto, Zarel, se este achar que estas têm valor para o projeto.

Como se trata de um projeto sem fins lucrativos e em que os contribuidores são voluntários não existe qualquer estrutura organizacional estrita: Não existem reuniões de staff; Não existem prazos; Todos os contribuidores, pertencentes à equipa principal ou não, respondem peranto o líder do projeto, Zarel.

Os contribuidores escolhem aquilo em que querem trabalhar através da consulta de um tópico de sugestões ou de um tópico de bug reports nos fórums do Pokemon Showdown.

####1.2.Processo

Através do contacto com os contribuidores e líder do projeto, verificamos que o processo, embora não explicitamente definido, segue os principios de um processo Agile: O planeamento é feito passo a passo e de acordo com os requerimentos e feedback dos utilizadoresss.
Segue também um modelo incremental, em que a especificação, *design*/desenvolvimento e a validação do código estão intercalados. De resto, o contribuidor é responsável por testar as mudanças que deseja introduzir, sendo que quando as propõe através de um Pull Request o código deve estar funcional.

####1.3.Estilo do Código

O *standard* a nível de estilo de código é garantido atreavés da utilização de ESLint, uma aplicação de *linting* para javascript. As regras de estilo usadas pelos contribuidores podem ser consultadas [aqui](https://github.com/Zarel/Pokemon-Showndown/blob/master/.eslintrc).

####1.4.Branch Model
Pela análise vimos que não há um esquema de *branches* definido no projeto. Os contribuidores fazem *fork* do repositório original e no seu repositório criam *branches* para implementar/corrigir funcionalidades. Quando querem que o codigo seja usado fazem um pull request desse *branch* para o *branch master* do repositório original, e esperam que seja aprovado pelo Zarel.
