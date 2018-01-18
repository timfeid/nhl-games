#!/usr/bin/env node

let Pbp = require('./lib/pbp')

let playByPlay = new Pbp(2017020688)

playByPlay.on('goal', play => {
  console.log(play.result.description)
})

playByPlay.on('period_end', (play) => {
  console.log(play.result.description)
})

playByPlay.on('game_end', (play) => {
  console.log(play.result.description)
})

playByPlay.start()