const form = document.querySelector('.search-form')
const input = document.querySelector('#search-input')
const results = document.querySelector('.results')
const loadingResults = document.querySelector('#loading-results')
const navFavorites = document.querySelector('.nav-favorites')
const navAbout = document.querySelector('.nav-about')
const navSearch = document.querySelector('.nav-search')
const cardsFav = document.querySelector('#cards-fav')
const statCount = document.querySelector('.stat-count')
const resultsContainer = document.querySelector('.results-container')
const favStatCount = document.querySelector('.fav-stat-count')
const favHeader = document.querySelector('.fav-header')
const favSection = document.querySelector('.fav-section')
const bannerContainer = document.querySelector('.banner-container')
const about = document.querySelector('.about')

function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || []
}

function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites))
}

form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const query = input.value.trim()
    if (!query) return

    cardsFav.classList.add('hidden')
    favHeader.classList.add('hidden')
    resultsContainer.classList.remove('hidden')

    try {
        loadingResults.classList.remove('hidden')

        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`)
        const data = await response.json()
        const animes = data.data

        statCount.textContent = `${animes.length} encontrados`
        results.innerHTML = ''
        resultsContainer.scrollIntoView({ behavior: 'smooth' })

        if (animes.length === 0) {
            results.innerHTML = `<p class="empty-message">Nenhum resultado encontrado</p>`
            return
        }

        animes.forEach(anime => {
            const card = document.createElement('div')
            card.classList.add('card')

            const genre = anime.genres[0]?.name ?? 'N/A'
            const imageUrl = anime.images.jpg.large_image_url

            card.innerHTML = `
                <div class="card-image">
                    <img src="${imageUrl}" alt="${anime.title}">
                    <span class="card-badge">${genre}</span>
                </div>
                <div class="card-info">
                    <h3>${anime.title}</h3>
                    <p>${anime.genres.map(g => g.name).join(', ')}</p>
                </div>
                <div class="card-footer">
                    <button class="btn-favorite">♡ Favoritar</button>
                    <span class="card-score">★ ${anime.score ?? 'N/A'}</span>
                </div>
            `

            card.querySelector('.btn-favorite').addEventListener('click', () => {
                addFavorite(anime.title, imageUrl, genre)
            })

            results.appendChild(card)
        })
    } catch (error) {
        results.innerHTML = `<p class="empty-message">Servidor não encontrado</p>`
    } finally {
        loadingResults.classList.add('hidden')
    }
})

function addFavorite(title, image, genre) {
    const favorites = getFavorites()

    if (favorites.some(item => item.title === title)) return

    favorites.push({ title, image, genre })
    saveFavorites(favorites)
}

function renderFavorites() {
    const favorites = getFavorites()

    cardsFav.innerHTML = ''
    resultsContainer.classList.add('hidden')
    favHeader.classList.remove('hidden')
    cardsFav.classList.remove('hidden')
    favStatCount.textContent = `${favorites.length} salvos`
    favSection.scrollIntoView({ behavior: 'smooth' })

    if (favorites.length === 0) {
        cardsFav.innerHTML = `<p class="empty-message">Você ainda não tem favoritos =(</p>`
        return
    }

    favorites.forEach(favorite => {
        const card = document.createElement('div')
        card.classList.add('card-fav')

        card.innerHTML = `
            <div class="fav-card-image">
                <img src="${favorite.image}" alt="${favorite.title}">
            </div>
            <div class="fav-card-info">
                <h3>${favorite.title}</h3>
                <p>${favorite.genre}</p>
            </div>
            <div class="remove-btn">
                <button class="btn-remove">✕ Remover</button>
            </div>
        `

        card.querySelector('.btn-remove').addEventListener('click', () => {
            removeFavorite(favorite.title)
        })

        cardsFav.appendChild(card)
    })
}

function removeFavorite(title) {
    const favorites = getFavorites()
    const updatedFavorites = favorites.filter(fav => fav.title !== title)
    saveFavorites(updatedFavorites)
    renderFavorites()
}

navFavorites.addEventListener('click', (event) => {
    event.preventDefault()
    renderFavorites()
})

navAbout.addEventListener('click', (event) => {
    event.preventDefault()
    about.scrollIntoView({ behavior: 'smooth' })
})

navSearch.addEventListener('click', (event) => {
    event.preventDefault()
    bannerContainer.scrollIntoView({ behavior: 'smooth' })
})

document.querySelector('#year').textContent = new Date().getFullYear()