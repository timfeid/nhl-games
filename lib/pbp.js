'use strict'

let axios = require('axios')

const STATUS_CODE_FINAL = 7

class Pbp {
  constructor(gameId) {
    this.gameId = gameId
    this.timecode = null
    this.response = null
    this.timeout = null
    this.broadcasted = []
    this.listeners = {}
  }

  start() {
    this.getFeed()
  }

  getFeed() {
    axios.get('http://statsapi.web.nhl.com/api/v1/game/'+this.gameId+'/feed/live', {
      params: {
        startTimecode: this.timecode,
        site: 'en_nhl',
      },
    }).then(this.receivedData.bind(this), this.failed.bind(this))
  }

  receivedData(response) {
    this.response = response.data
    this.sendBroadcasts()
    this.setTimeout()
  }

  setTimeout() {
    // Abstract equals because NHL uses strings?
    if (this.response.gameData.status.statusCode == STATUS_CODE_FINAL) {
      return;
    }
    this.timestamp = this.response.metaData.timeStamp
    this.timeout = setTimeout(this.getFeed.bind(this), this.response.metaData.wait * 1000)
  }

  sendBroadcasts() {
    for (let play of this.response.liveData.plays.allPlays) {
      if (this.needsBroadcasting(play)) {
        this.broadcast(play.result.eventTypeId.toLowerCase(), play)
      }
    }
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }

    this.listeners[event].push(callback)
  }

  needsBroadcasting(play) {
    return this.broadcasted.indexOf(play.about.eventId) === -1
  }

  broadcast(event, play) {
    this.broadcasted.push(play.about.eventId)
    if (this.listeners[event]) {
      for (let callback of this.listeners[event]) {
        callback(play)
      }
    }
  }

  failed(response) {
    console.warn("FAILED.", response)
  }
}

module.exports = Pbp