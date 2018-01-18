# NHL Play By Play
*Untested on live games*
## Usage
```javascript
let Pbp = require('nhl-pbp')
// Replace 2017020642 with a specific game
let playByPlay = new Pbp(2017020642)

playByPlay.on('goal', play => {
    console.log(play.result.description)
})

// playByPlay.on(...)

playByPlay.start()
```

## Known events
* game_scheduled
* period_ready
* period_start
* faceoff
* hit
* giveaway
* stop
* blocked_shot
* takeaway
* shot
* challenge
* penalty
* missed_shot
* goal
