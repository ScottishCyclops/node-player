const groove = require("groove")
const utils = require("./utils")

// actual music player object
const player = groove.createPlayer()
// playlist to be populated and cleared
const playlist = groove.createPlaylist()
// currently loaded files to free
let files = []

let playing = false
let paused = false

// promisified methods
const open = utils.promisify(groove.open)
const attach = utils.promisify(player.attach.bind(player))
const detach = utils.promisify(player.detach.bind(player))

// set device to default
player.device = groove.getDevices()[0]

// callback when playlist item beeing played changes
player.on("nowplaying", async () =>
{
    const item = player.position().item

    // item is valid, nothing to do
    if(item) return

    // if we are not playing, we already cleaned
    if(!playing) return

    // cleaning

    playing = false

    if(playlist.items().length > 0) playlist.clear()

    //close all files
    await Promise.all(files.map(file => new Promise(resolve => file.close(resolve))))
    files = []

    // detatch playlist from player
    await detach()
})

const mod = module.exports = {
    /**
     * Start playing the given list of audio files
     * @param {string[]} filePaths list of audio file paths to play
     * @param {boolean} shuffle if true, shuffles the list before playing
     */
    start: async (filePaths, shuffle) =>
    {
        await mod.stop()

        // nothing to do if there are no files
        if(filePaths.length === 0) return

        const paths = shuffle ? utils.shuffle(filePaths) : filePaths

        files = await Promise.all(paths.map(filePath => open(filePath)))

        files.forEach(file => playlist.insert(file))

        await attach(playlist)

        playing = true

        // in case it was paused
        mod.resume()
    },
    /**
     * Stop the playback
     */
    stop: () =>
    {
        if(!playing) return

        // clearing the playlist triggers the "nowplaying" event
        // with a null item. cleaning is done there because it is also done
        // when we reach the end of the playlist naturally
        playlist.clear()
    },
    /**
     * Pause the playback
     */
    pause: () =>
    {
        paused = true
        playlist.pause()
    },
    /**
     * Resume the playback
     */
    resume: () =>
    {
        paused = false
        playlist.play()
    },
    /**
     * Play the next music in the list
     *
     * If the current music is the last, stops the player
     */
    next: () =>
    {
        const current = playlist.position().item

        // nothing being played
        if(!current) return

        const all = playlist.items()

        // take next item. look for the current one by id
        const nextItem = all[all.map(item => item.id).indexOf(current.id) + 1]

        // end of playlist
        if(!nextItem) return mod.stop()

        // go to the beginning of that item
        playlist.seek(nextItem, 0)
    },
    /**
     * Get all avaiable information about the currently playing music
     *
     * If no music is currently playing, returns `null`
     * @return {{position: number, duration: number, metadata: {[x: string]: string}, filename: string}}
     */
    getCurrentMusicInfos: () =>
    {
        const { item, pos } = playlist.position()

        // nothing beeing played
        if(!item) return null

        return {
            position: pos,
            duration: item.file.duration(),
            metadata: item.file.metadata(),
            filename: item.file.filename,
        }
    },
    /**
     * Set the volume gain between 0 (inaudible) and 1 (default volume)
     *
     * Capped at 1 because of audio deformation above it
     * @param {number} n a float between 0 and 1
     */
    setGain: n => playlist.setGain(utils.clamp(n, 0, 1)),
    /**
     * `true` if you called `pause` and didn't call `resume` after it
     */
    isPaused: () => paused,
    /**
     * `true` from the moment you call `start` until you call `stop` or the playlist is finished
     */
    isPlaying: () => playing,
}
