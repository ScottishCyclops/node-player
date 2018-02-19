/**
 * Returns a new shuffled array
 * @param {any[]} array array to shuffle
 */
function shuffle(array)
{
    // copy the array
    const a = [...array]

    for(let i = a.length - 1; i >= 1; i--) {
        const j = Math.floor(Math.random() * (i + 1))

        const tmp = a[i]
        a[i] = a[j]
        a[j] = tmp
    }

    return a
}

/**
 * Turns a function with `callback(error, result)` as last parameter into a promise function.
 * If it is a method, call bind before giving it to this function
 * @param {(...args: any[], callback: (error: Error, result: any) => void) => void} func function or method to turn into a promise function
 */
const promisify = func => (...args) => new Promise((resolve, reject) => func(...args, (err, res) => err ? reject(err) : resolve(res)))

/**
 * Limit a value between a `min` and a `max`
 * @param {number} n number to clamp
 * @param {number} min minimum value
 * @param {number} max maximum value
 */
const clamp = (n, min, max) => Math.max(min, Math.min(max, n))

module.exports = {
    shuffle,
    promisify,
    clamp,
}
