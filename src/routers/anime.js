const express = require('express')
const Anime = require('../models/Anime')
const auth = require('../middleware/auth')
const getAnimeFromAniList = require('../api.js')
const redis = require('redis')
let client
if (process.env.REDISTOGO_URL) {
    const rtg = require("url").parse(process.env.REDISTOGO_URL);
    client = redis.createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(":")[1]);
} else {
    client = redis.createClient()
}
const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);

const router = express.Router()

const titleExists = (animes, title) => {
    let i;
    for (i = 0; i < animes.length; i++) {
        if (animes[i].title == title) {
            return true;
        }
    }
    return false;
}

router.get('/animes', auth, async(req, res) => {
    // Get all the anime for a specific user
    user = req.user
    let animes = user.animes
    const newAnimes = await Promise.all(animes.map(async(anime) => {
        const maxEp = await getAsync(anime.title)
        return {
            title: anime.title,
            ep: anime.ep,
            url: anime.url,
            maxEp,
        }
    }))
    res.send(newAnimes)
})

router.get('/anime/:title', auth, async(req, res) => {
    // Get a specific anime
    user = req.user
    const title = req.params.title
    const animes = user.animes
    let animeToSend;
    animes.forEach((anime) => {
        if (anime.title == title) {
            animeToSend = anime
        }
    });
    res.send(animeToSend)
})

router.post('/anime/add', auth, async (req, res) => {
    // Add an anime to the user's anime list
    try {
        user = req.user
        const { ep, url } = req.body
        let title = req.body.title
        console.log(title)
        console.log(ep)

        if (!titleExists(user.animes, title)) {
            let maxEp = await getAsync(title)
            if (!maxEp) {
                const aniListInfo = await getAnimeFromAniList(title)
                maxEp = aniListInfo['maxEpisode']
                client.set(title, maxEp)
            }
            const animeToAdd = new Anime({
                title,
                ep,
                url
            })
            await animeToAdd.save()
            user.animes = user.animes.concat(animeToAdd)
            await user.save()
            const toSend = {
                title,
                ep,
                url,
                maxEp
            }
            res.send(toSend)
        } else {
            res.status(405).send({error: 'That anime already exists!'})
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/anime/update', auth, async (req, res) => {
    // Update anime episode number to the user's anime list
    try {
        user = req.user
        const { title, ep } = req.body
        if (!title) {
            throw new Error({ error: 'Title not found' })
        }
        if (!ep && ep != 0) {
            throw new Error({ error: 'New episode number not found' })
        }
        const animes = user.animes
        animes.forEach((anime) => {
            if (anime.title == title) {
                anime.ep = ep
            }
        });
        
        await user.save()

        res.send(user.animes)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/anime/delete', auth, async (req, res) => {
    // Update anime episode number to the user's anime list
    try {
        user = req.user
        const { title } = req.body
        user.animes = user.animes.filter((anime) => {
            return anime.title != title
        })
        
        await user.save()

        res.send(user.animes)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router