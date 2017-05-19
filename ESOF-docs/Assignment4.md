# **Engenharia de Software**
# Assignment 4: Software Tests

## [Pokémon Showdown](https://www.pokemonshowdown.com)

### Introdução

 Os testes de *software* têm como objetivo principal verificar até que nível um artifacto de *software*, podendo este ser: um sistema de *software*, um módulo de *software*, entre outros, suporta um teste em determinado contexto. No caso de a testabilidade do artifacto ser elevada significa que é mais simples encontrar erros e falhas através de *testing*. 

### 1.Grau de Testabilidade

 Neste tópico será abordado o grau de testabilidade do projeto, isto é, o grau de facilidade de desenvolvimento dos seus testes. 
 Analizando os módulos do *Pokemon Showdown* verificamos que os testes apenas podem ser aplicados aos seus sub-componentes devido a complexidade e, por vezes, multifuncionalidade destes. Para realizar estes testes utilizam eslint e npm test.

#### 1.1.Controlabilidade

 A controlabilidade dos componentes sob teste (CUT - Componentes Under Test) depende da complexidade e da interação com outros módulos do componente em questão. Quanto maior a complexidade e quantas mais interações tiver o componente mais baixa será a sua controlabilidade nos testes. 
 Neste projeto, apenas se usa testes unitários e como nestes testes é possível aceder e controlar os estados de um objeto podemos afirmar que o componente tem um controlabilidade boa, excepto quando este utiliza módulos externos que se tornam impossíveis de aceder.

#### 1.2.Observabilidade

Para observar o resultado destes testes basta correr o comando *npm test*. Este comando vai correr todos os testes e no fim de cada teste é gerado um output na consola com o seu resultado final. 
 *referência à imagem*
Ainda no fim de todos os teste mostra quantos testes passaram, falharam ou ficaram pendentes.
Conclui-se assim que há uma boa observabilidade sobre os testes realizados.

#### 1.3.Isolabilidade

Para poder ser efetuada a realização de testes, foi necessária a criação de um *environment test*, onde apenas estão presentes os elementos que pretendem ser testados, em ficheiros de teste separados.
Ou seja, são criados objetos do que se quer testar para um ficheiro(caso estes não existam), e invoca-se funções ou simula-se alguma situação, à qual já se sabe o resultado, e efetua-se os testes para poder comprovar o bom funcionamento.
Por exemplo, para testar a validação da equipa, foi criado um ficheiro de testes chamado team-validator, onde se cria uma equipa, adicionando-lhe *Pokémons*, para poder depois invocar a função do objeto TeamValidator, para poder observar o resultado, e verificar se está correto.
Assim facilita o processo de testes de uma parte especifica melhorando muito a organização.

#### 1.4.Separação de responsabilidades

Nem todos os componentes têm apenas uma resposabilidade no projeto, mas todos os testes têm o objetivo de verificar apenas uma das funcionalidades possíveis desse componente que interessam testar. Ou seja, os testes concentram-se em aspetos especificos de cada componente.

#### 1.5.Compreensibilidade

Os nomes dados aos scripts dos testes por si só são auto-explicativos e permitem perceber facilmente qual o objetivo do teste em questão e portanto são bastantes compreensivos.

#### 1.6.Automatização

Todos os testes do projeto são efetuados conforme o exemplo dado no tópico *1.3* e portanto não existe qualquer tipo de automatização nos testes.

#### 1.7.Heterogeneidade

As tecnologias utilizadas não representam um problema para os testes utilizados, porque estes apenas se concentram em aspetos muito específicos desenvolvidos inteiramente para o projeto. Isto nota-se pela falta de testes de integração.

### 2.Estatísticas de Teste

#### 2.1.Testes Unitários
Os testes unitários testam as menores unidades de *software* desenvolvidas, sendo estas pequenas secções de código ou a unidade definida para o projeto em estudo. O principal objetivo, deste tipo de *testing* é encontrar falhas de funcionamento numa pequena parte do sistema funcionando independentemente do todo.

#### 2.2.Cobertura de Código

#### 2.3.Testes de Integração
Os testes de integração visam avaliar a interação entre os componentes de *software* e *hardware*, posto isto, o seu principal desafio é encontrar erros nas unidades de interface.

#### 2.4.Testes de Sistema
Os testes de sistema consideram a robustez deste, verificando se age em conformidade com requerimentos funcionais de comportamento e qualidade.

#### 2.5.Testes de Aceitação
Os testes de aceitação são chamados de testes formais, uma vez que têm de estar de acordo com os seus critérios de aceitação, primeiramente e de seguida, são alvo de uma aceitação ou não por parte do cliente final.

#### 2.6.Testes de Regressão
Os testes de regressão são realizados de forma seletiva sobre determinada secção de código para garantir que qualquer alteração neste não causou nenhum distúrbio ou mau funcionamento do que estava, anteriormente, imlplementado.

### 3.Correção do Bug

### Conclusão

##Trabalho realizado por:

[Ana Rita Torres](https://github.com/AnaRitaTorres): Contribuição 

[Diogo Cepa](https://github.com/dcepa95): Contribuição 

[João Loureiro](https://github.com/Katchau): Contribução 

[João Pedro Silva](https://github.com/joaosilva22): Contribuição 
