const pool = require('../config/database')

module.exports = {
  championship (req, res) {
    pool.getConnection((error, connection) => {
      if (error) console.log(error)

      const query = `SELECT 
      tt_rodadas.codigoRodada as rodada,
      tt_rodadas.dataJogo as data, 
      tt_rodadas.horaJogo as hora, 
      t1.nomeTime as timeMandante, 
      t2.nomeTime as timeVisitante, 
      tt_rodadas.placarTimeA as placarTimeMandante, 
      tt_rodadas.placarTimeB as placarTimeVisitante 
      FROM tt_rodadas 
      INNER JOIN tt_times t1 ON tt_rodadas.codigoTimeA = t1.codigoTime
      INNER JOIN tt_times t2 ON tt_rodadas.codigoTimeB = t2.codigoTime
      ORDER BY dataJogo, horaJogo ASC`

      connection.query(query, (error, result) => {
        connection.release()

        if (error) console.log(error)

        const rodadas = [...new Set(result.map(item => item.rodada))]
        const response = {}

        rodadas.forEach(rodada => {
          Object.defineProperty(response, rodada, {
            value: {
              rodada: rodada,
              qtdJogos: '',
              jogos: []
            },
            enumerable: true
          })
        })

        result.forEach(jogo => {
          response[jogo.rodada].jogos.push(jogo)
          response[jogo.rodada].qtdJogos = response[jogo.rodada].jogos.length
        })

        return res.json(response)
      })
    })
  }
}
