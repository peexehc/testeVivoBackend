# Teste para desenvolvedor web Vivo - Back end

Este é um projeto desenvolvido em **Node.js** + **Express.js** com conexão à uma base de dados remota **MySQL**.
Tem como propósito fornecer uma **API** que devolva ao usuário as informações relacionadas a jogos e times de futebol do Campeonato Brasileiro que estão armazenadas no banco de dados.


## Instruções para instalação do projeto

Clone o repositorio:

    git clone https://github.com/peexehc/testeVivoBackend.git
Instale as depêndencias:

    npm install

Inicie o servidor:

    npm run start

O servidor estará escutando na porta 3000 - [http://127.0.0.1:3000](http://127.0.0.1:3000)

## Endpoints da API

### /championship
 
Lista todos os jogos do Campeonato Brasileiro, agrupados por rodada e ordenados pela data e hora do jogo. Cada rodada possui um array que contém todos os jogos (e seus dados) da rodada respectiva e um totalizador de jogos.

Resposta da API:

```json
{
  "1": {
    "rodada": 1,
    "qtdJogos": 10,
    "jogos": [
      {
        "rodada": 1,
        "data": "2015-05-09T03:00:00.000Z",
        "hora": "18:30:00",
        "timeMandante": "Chapecoense",
        "timeVisitante": "Coritiba",
        "placarTimeMandante": 2,
        "placarTimeVisitante": 1,
        "resultadoPartida": "2x1"
      },
      {
        "rodada": 1,
        "data": "2015-05-09T03:00:00.000Z",
        "hora": "18:30:00",
        "timeMandante": "Palmeiras",
        "timeVisitante": "Atletico-MG",
        "placarTimeMandante": 2,
        "placarTimeVisitante": 2,
        "resultadoPartida": "2x2"
      },
      ...
    ]
  },
  "2": { 
    "rodada": 2, 
    "qtdJogos": 10, 
    "jogos": [...] 
  }
  ...
}
```

Filtros:

|URL|Parâmetro|Descrição|
|--|--|--|
|/championship/*rodada*|*rodada* (INT)|Permite buscar os jogos da rodada inserida|
|/championship/time/*nome*|*nome* (STRING)|Permite buscar os jogos do time que corresponda com o nome inserido|

### /team

Lista todos os times do Campeonato Brasileiro, ordenados por ordem alfabética. Cada time possui um array que contém todos os jogos que participou (e seus dados), a quantidade de jogos, quantidade de vitórias, quantidade de derrotas e a quantidade de empates.

Resposta da API:

```json
[
  {
    "time": "Atletico-MG",
    "qtdJogos": 19,
    "qtdVitorias": 11,
    "qtdDerrotas": 5,
    "qtdEmpates": 3,
    "jogos": [
      {
        "rodada": 10,
        "data": "2015-07-01T03:00:00.000Z",
        "hora": "21:00:00",
        "timeMandante": "Atletico-MG",
        "timeVisitante": "Coritiba",
        "placarTimeMandante": 2,
        "placarTimeVisitante": 0,
        "resultadoPartida": "2x0"
      },
      {
        "rodada": 6,
        "data": "2015-06-06T03:00:00.000Z",
        "hora": "18:30:00",
        "timeMandante": "Atletico-MG",
        "timeVisitante": "Cruzeiro",
        "placarTimeMandante": 1,
        "placarTimeVisitante": 3,
        "resultadoPartida": "1x3"
      },
      ...
    ]
  },
  {
    "time": "Atletico-PR",
    "qtdJogos": 19,
    "qtdVitorias": 9,
    "qtdDerrotas": 7,
    "qtdEmpates": 3,
    "jogos": [...]
  }
  ...
]
```
Filtros:

|URL|Parâmetro|Descrição|
|--|--|--|
|/team/*nome*|*nome* (STRING)|Permite buscar os jogos do time que corresponda com o nome inserido|
|/team/rodada/*rodada*|*rodada* (INT)|Permite buscar os jogos da rodada inserida|
