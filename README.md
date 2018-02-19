# node-player

Higher level abstraction on top of libgroove for node.
Essentially a simple music player

## Usage

```javascript
const player = require("node-player")

const musics = [ "/home/me/Music/a.ogg", "/home/me/Music/b.wav" ]

async function main()
{
    // start playing the musics, shuffled
    await player.start(musics, true)

    // skip the music every 5 secondes
    setInterval(player.next, 5000)

    // stop it after 20 secondes
    setTimeout(player.stop, 20000)
}

main().catch(console.error)
```

## Functions

*More documentation is visible when calling the functions*

__start__: play the given musics, possibly shuffled

__stop__: stop the playback

__pause__: pause the playback

__resume__: resume the playback

__next__: skip the current music in the playlist

__getCurrentMusicInfos__: get infos about the music playing

__setGain__: set the volume gain between 0 and 1

__isPaused__: is the playback paused

__isPlaying__: is anything in the playlist

## End

Please report any bugs or feature request on [Github](https://github.com/ScottishCyclops/node-player/issues)
