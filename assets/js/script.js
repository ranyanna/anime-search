const form = document.querySelector('form')
const input = document.querySelector('#search-input')
const results = document.querySelector('.results')
const loadingResults = document.querySelector('#loading-results')
const navFavorites = document.querySelector('.nav-favorites')
const cardsFav = document.querySelector('#cards-fav')
const statCount = document.querySelector('.stat-count')
const resultsContainer = document.querySelector('.results-container')
const favStatCount = document.querySelector('.fav-stat-count')
const favHeader = document.querySelector('.fav-header')

function getFavoritos() {
    return JSON.parse(localStorage.getItem('favoritos')) || []
}
 
function salvarFavoritos(favoritos) {
    localStorage.setItem('favoritos', JSON.stringify(favoritos))
}

form.addEventListener('submit', async (event) => {
    event.preventDefault()
 
    const busca = input.value.trim()
    if (!busca) return
 
    cardsFav.classList.add('hidden')
    favHeader.classList.add('hidden')
    resultsContainer.classList.remove('hidden')
 
    try {
        loadingResults.classList.remove('hidden')
 
        const resposta = await fetch(`https://api.jikan.moe/v4/anime?q=${busca}`)
        const dados = await resposta.json()
        const animes = dados.data
 
        statCount.textContent = `${animes.length} encontrados`
        results.innerHTML = ''
 
        if (animes.length === 0) {
            results.innerHTML = `<p>Nenhum resultado encontrado</p>`
            return
        }
 
        animes.forEach(anime => {
            const card = document.createElement('div')
            card.classList.add('card')
            results.appendChild(card)
            card.innerHTML = `
                <div class="card-image">
                    <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
                    <span class="card-badge">${anime.genres[0]?.name ?? 'N/A'}</span>
                </div>
                <div class="card-info">
                    <h3>${anime.title}</h3>
                    <p>${anime.genres.map(genero => genero.name).join(', ')}</p>
                </div>
                <div class="card-footer">
                    <button onclick="favoritar('${anime.title}', '${anime.images.jpg.large_image_url}', '${anime.genres[0]?.name ?? 'N/A'}')">♡ Favoritar</button>
                    <span class="card-score">★ ${anime.score ?? 'N/A'}</span>
                </div>
            `
        })
    } catch (erro) {
        results.innerHTML = `<p>Servidor não encontrado</p>`
    } finally {
        loadingResults.classList.add('hidden')
    }
})

function favoritar(titulo, imagem, genero) {
    const favoritos = getFavoritos()
    if (favoritos.some(item => item.titulo === titulo)) {
        return
    }

    favoritos.push({ titulo, imagem, genero })
    salvarFavoritos(favoritos)
}
 
function renderizarFavoritos() {
    const favoritos = getFavoritos()
 
    cardsFav.innerHTML = ''
    resultsContainer.classList.add('hidden')
    favHeader.classList.remove('hidden')
    cardsFav.classList.remove('hidden')
    favStatCount.textContent = `${favoritos.length} salvos`
 
    if (favoritos.length === 0) {
        cardsFav.innerHTML = `<p style="color: var(--cor-texto-escuro); padding: 20px;">Você ainda não tem favoritos =(</p>`
        return
    }
 
    favoritos.forEach(favorito => {
        const card = document.createElement('div')
        card.classList.add('card-fav')
        cardsFav.appendChild(card)
        card.innerHTML = `
            <div class="fav-card-image">
                <img src="${favorito.imagem}" alt="${favorito.titulo}">
            </div>
            <div class="fav-card-info">
                <h3>${favorito.titulo}</h3>
                <p>${favorito.genero}</p>
            </div>
            <div class="remove-btn">
                <button onclick="remover('${favorito.titulo}')">✕ Remover</button>
            </div>
        `
    })
}

navFavorites.addEventListener('click', (event) => {
    event.preventDefault()
    renderizarFavoritos()
})
 
function remover(titulo) {
    const favoritos = getFavoritos()
    const novosFavoritos = favoritos.filter(fav => fav.titulo !== titulo)
    salvarFavoritos(novosFavoritos)
    renderizarFavoritos()
}