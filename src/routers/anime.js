const express = require('express')
const Anime = require('../models/Anime')
const auth = require('../middleware/auth')
const getAnime = require('../api.js')

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

router.get('/anime', auth, async(req, res) => {
    // Get all the anime for a specific user
    user = req.user
    anime = user.animes
    res.send(anime)
})

router.post('/anime/add', auth, async (req, res) => {
    // Add an anime to the user's anime list
    try {
        user = req.user
        const { ep, url } = req.body
        let title = req.body.title

        if (!titleExists(user.animes, title)) {
            const animeToAdd = new Anime({
                title,
                ep,
                url
            })
            await animeToAdd.save()
            user.animes = user.animes.concat(animeToAdd)
            await user.save()
        }

        res.send(user.animes)
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