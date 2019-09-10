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
      tt_rodadas.placarTimeB as placarTimeVisitante,
      CONCAT(tt_rodadas.placarTimeA, 'x', tt_rodadas.placarTimeB) as resultadoPartida
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
            enumerable: true,
            configurable: true
          })
        })

        result.forEach(jogo => {
          response[jogo.rodada].jogos.push(jogo)
          response[jogo.rodada].qtdJogos = response[jogo.rodada].jogos.length
        })

        if (req.params.rodada && response[req.params.rodada] !== undefined) {
          return res.json(response[req.params.rodada])
        } else if (req.params.rodada && response[req.params.rodada] === undefined) {
          return res.status(400).send(`Rodada do campeonato inválida!<br/><br/>Rodadas disponíveis: ${rodadas}`)
        } else {
          return res.json(response)
        }
      })
    })
  },

  championshipByTeam (req, res) {
    pool.getConnection((error, connection) => {
      if (error) console.log(error)

      const queryTimes = `SELECT
      nomeTime as time
      FROM tt_times
      ORDER BY nomeTime ASC`

      const times = []

      connection.query(queryTimes, (error, result) => {
        if (error) console.log(error)

        result.forEach(time => {
          times.push(time.time)
        })
      })

      const queryJogos = `SELECT 
      tt_rodadas.codigoRodada as rodada,
      tt_rodadas.dataJogo as data, 
      tt_rodadas.horaJogo as hora, 
      t1.nomeTime as timeMandante, 
      t2.nomeTime as timeVisitante, 
      tt_rodadas.placarTimeA as placarTimeMandante, 
      tt_rodadas.placarTimeB as placarTimeVisitante,
      CONCAT(tt_rodadas.placarTimeA, 'x', tt_rodadas.placarTimeB) as resultadoPartida
      FROM tt_rodadas 
      INNER JOIN tt_times t1 ON tt_rodadas.codigoTimeA = t1.codigoTime
      INNER JOIN tt_times t2 ON tt_rodadas.codigoTimeB = t2.codigoTime
      WHERE LOWER(t1.nomeTime) LIKE '%${req.params.time.toLowerCase()}%'
      OR LOWER(t2.nomeTime) LIKE '%${req.params.time.toLowerCase()}%'
      ORDER BY dataJogo, horaJogo ASC`

      connection.query(queryJogos, (error, result) => {
        connection.release()
        const response = {}

        if (error) console.log(error)

        if (result.length >= 1) {
          const rodadas = [...new Set(result.map(item => item.rodada))]

          rodadas.forEach(rodada => {
            Object.defineProperty(response, rodada, {
              value: {
                rodada: rodada,
                qtdJogos: '',
                jogos: []
              },
              enumerable: true,
              configurable: true
            })
          })

          result.forEach(jogo => {
            response[jogo.rodada].jogos.push(jogo)
            response[jogo.rodada].qtdJogos = response[jogo.rodada].jogos.length
          })

          return res.json(response)
        } else {
          return res.status(400).send(`Time não encontrado!<br/><br/>Times disponíveis: ${times}`)
        }
      })
    })
  },

  team (req, res) {
    pool.getConnection((error, connection) => {
      if (error) console.log(error)

      const queryTimes = `SELECT
      nomeTime as time
      FROM tt_times
      ORDER BY nomeTime ASC`

      const times = []

      connection.query(queryTimes, (error, result) => {
        if (error) console.log(error)

        result.forEach(time => {
          times.push(time.time)
        })
      })

      const queryJogos = `SELECT
      tt_rodadas.codigoRodada as rodada,
      tt_rodadas.dataJogo as data,
      tt_rodadas.horaJogo as hora,
      t1.nomeTime as timeMandante,
      t2.nomeTime as timeVisitante,
      tt_rodadas.placarTimeA as placarTimeMandante,
      tt_rodadas.placarTimeB as placarTimeVisitante,
      CONCAT(tt_rodadas.placarTimeA, 'x', tt_rodadas.placarTimeB) as resultadoPartida
      FROM tt_rodadas
      INNER JOIN tt_times t1 ON tt_rodadas.codigoTimeA = t1.codigoTime
      INNER JOIN tt_times t2 ON tt_rodadas.codigoTimeB = t2.codigoTime
      ORDER BY t1.nomeTime, t2.nomeTime ASC`

      connection.query(queryJogos, (error, result) => {
        connection.release()
        const response = {}

        if (error) console.log(error)

        times.forEach(time => {
          Object.defineProperty(response, time.replace(/(\r\n|\n|\r)/gm, ''), {
            value: {
              time: time.replace(/(\r\n|\n|\r)/gm, ''),
              qtdJogos: '',
              qtdVitorias: '',
              qtdDerrotas: '',
              qtdEmpates: '',
              jogos: []
            },
            enumerable: true,
            configurable: true
          })
        })

        result.forEach(jogo => {
          const timeMandante = jogo.timeMandante.replace(/(\r\n|\n|\r)/gm, '')
          const timeVisitante = jogo.timeVisitante.replace(/(\r\n|\n|\r)/gm, '')
          let vitoriaMandante = false
          let vitoriaVisitante = false
          let empate = false

          if (jogo.placarTimeMandante > jogo.placarTimeVisitante) {
            vitoriaMandante = true
          } else if (jogo.placarTimeMandante === jogo.placarTimeVisitante) {
            empate = true
          } else {
            vitoriaVisitante = true
          }

          response[timeMandante].jogos.push(jogo)
          response[timeVisitante].jogos.push(jogo)

          response[timeMandante].qtdJogos = response[timeMandante].jogos.length
          response[timeVisitante].qtdJogos = response[timeVisitante].jogos.length

          if (vitoriaMandante) {
            response[timeMandante].qtdVitorias++
            response[timeVisitante].qtdDerrotas++
          }

          if (vitoriaVisitante) {
            response[timeVisitante].qtdVitorias++
            response[timeMandante].qtdDerrotas++
          }

          if (empate) {
            response[timeMandante].qtdEmpates++
            response[timeVisitante].qtdEmpates++
          }
        })

        const resArray = Object.values(response)

        if (req.params.time) {
          const buscaTime = resArray.filter((time) => {
            return (time.time.toLowerCase().includes(req.params.time.toLowerCase()))
          })

          if (buscaTime.length < 1) return res.status(400).send(`Time não encontrado!<br/><br/>Times disponíveis: ${times}`)

          return res.json(buscaTime)
        }

        return res.json(resArray)
      })
    })
  },

  teamByRound (req, res) {
    pool.getConnection((error, connection) => {
      if (error) console.log(error)

      const queryTimes = `SELECT
      nomeTime as time
      FROM tt_times
      ORDER BY nomeTime ASC`

      const times = []

      connection.query(queryTimes, (error, result) => {
        if (error) console.log(error)

        result.forEach(time => {
          times.push(time.time)
        })
      })

      const queryJogos = `SELECT
      tt_rodadas.codigoRodada as rodada,
      tt_rodadas.dataJogo as data,
      tt_rodadas.horaJogo as hora,
      t1.nomeTime as timeMandante,
      t2.nomeTime as timeVisitante,
      tt_rodadas.placarTimeA as placarTimeMandante,
      tt_rodadas.placarTimeB as placarTimeVisitante,
      CONCAT(tt_rodadas.placarTimeA, 'x', tt_rodadas.placarTimeB) as resultadoPartida
      FROM tt_rodadas
      INNER JOIN tt_times t1 ON tt_rodadas.codigoTimeA = t1.codigoTime
      INNER JOIN tt_times t2 ON tt_rodadas.codigoTimeB = t2.codigoTime
      WHERE tt_rodadas.codigoRodada = ${req.params.rodada}
      ORDER BY t1.nomeTime, t2.nomeTime ASC`

      connection.query(queryJogos, (error, result) => {
        connection.release()
        const response = {}

        if (error) console.log(error)

        times.forEach(time => {
          Object.defineProperty(response, time.replace(/(\r\n|\n|\r)/gm, ''), {
            value: {
              time: time.replace(/(\r\n|\n|\r)/gm, ''),
              qtdJogos: '',
              qtdVitorias: '',
              qtdDerrotas: '',
              qtdEmpates: '',
              jogos: []
            },
            enumerable: true,
            configurable: true
          })
        })

        result.forEach(jogo => {
          const timeMandante = jogo.timeMandante.replace(/(\r\n|\n|\r)/gm, '')
          const timeVisitante = jogo.timeVisitante.replace(/(\r\n|\n|\r)/gm, '')
          let vitoriaMandante = false
          let vitoriaVisitante = false
          let empate = false

          if (jogo.placarTimeMandante > jogo.placarTimeVisitante) {
            vitoriaMandante = true
          } else if (jogo.placarTimeMandante === jogo.placarTimeVisitante) {
            empate = true
          } else {
            vitoriaVisitante = true
          }

          response[timeMandante].jogos.push(jogo)
          response[timeVisitante].jogos.push(jogo)

          response[timeMandante].qtdJogos = response[timeMandante].jogos.length
          response[timeVisitante].qtdJogos = response[timeVisitante].jogos.length

          if (vitoriaMandante) {
            response[timeMandante].qtdVitorias++
            response[timeVisitante].qtdDerrotas++
          }

          if (vitoriaVisitante) {
            response[timeVisitante].qtdVitorias++
            response[timeMandante].qtdDerrotas++
          }

          if (empate) {
            response[timeMandante].qtdEmpates++
            response[timeVisitante].qtdEmpates++
          }
        })

        const resArray = Object.values(response)

        return res.json(resArray)
      })
    })
  }
}
