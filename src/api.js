const fetch = require("node-fetch");

const getAnimeFromAniList = async (title) => {
    const query = `
        query ($title: String) {
            Media (search: $title, type: ANIME) {
            title {
                english
                romaji
                native
            }
            episodes
            nextAiringEpisode {
                id
                episode
            }
            }
        }
    `;
    const variables = {
        title: title
    };
    const url = 'https://graphql.anilist.co',
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

    const response = await fetch(url, options)
    const json = await response.json()
    const newTitle = json.data.Media.title.english
    const airing = !!json.data.Media.nextAiringEpisode
    let maxEpisode = parseInt(json.data.Media.episodes)
    if (airing) {
        maxEpisode = parseInt(json.data.Media.nextAiringEpisode.episode, 10) - 1
    }

    const info = {
        title: newTitle,
        airing,
        maxEpisode
    }
    return info
}

module.exports = getAnimeFromAniList