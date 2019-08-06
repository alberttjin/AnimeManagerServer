const redis = require('redis')
let client
if (process.env.REDISTOGO_URL) {
    const rtg   = require("url").parse(process.env.REDISTOGO_URL);
    client = redis.createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(":")[1]);
} else {
    client = redis.createClient()
}
const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);
const getAnimeFromAniList = require('../api.js')

const maxEpFill = async() => {
    client.keys('*', async(err, log_list) => {
        log_list.forEach(async(title) => {
            try {
                const maxEp = await getAsync(title)
                const aniListInfo = await getAnimeFromAniList(title)
                const newMaxEp = aniListInfo['maxEpisode']
                if (newMaxEp > maxEp) {
                    client.set(title, newMaxEp)
                }
            } catch(error) {
                console.error(error)
            }
        })
    });
}
module.exports = maxEpFill
