const form = document.querySelector('form')
const input = document.querySelector('input')
const results = document.querySelector('.results')
const loadingResults = document.querySelector('#loading-results')
const btnFav = document.querySelector('.btn-fav')
const cardsFav = document.querySelector('.cards-fav')
const statCount = document.querySelector('.stat-count')
const resultsContainer = document.querySelector('.results-container')
const favStatCount = document.querySelector('.fav-stat-count')
const favSearch = document.querySelector('.fav-search')

form.addEventListener('submit', async (event) => {
    event.preventDefault()

    if (input.value.trim() === "") {
        return
    }

    const busca = input.value
    cardsFav.classList.add('hidden')
    favSearch.classList.add('hidden')
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
        } else {
            animes.forEach(anime => {
                const card = document.createElement('div')
                card.classList.add('card')
                results.appendChild(card)
                card.innerHTML = `
                <div class="card-image">
                    <img src="${anime.images.jpg.large_image_url}">
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
        }
    } catch (erro) {
        results.innerHTML = `<p>Servidor não encontrado</p>`
    } finally {
        loadingResults.classList.add('hidden')
    }
})

function favoritar(titulo, imagem, genero) {
    const favoritosAtuais = JSON.parse(localStorage.getItem('favoritos')) || []
    favoritosAtuais.push({ titulo, imagem, genero })
    localStorage.setItem('favoritos', JSON.stringify(favoritosAtuais))
}

function renderizarFavoritos() {
    const favoritosAtuais = JSON.parse(localStorage.getItem('favoritos')) || []
    cardsFav.innerHTML = ''
    resultsContainer.classList.add('hidden')
    favSearch.classList.remove('hidden')
    cardsFav.classList.remove('hidden')
    favStatCount.textContent = `${favoritosAtuais.length} salvos`

    if (favoritosAtuais.length === 0) {
        cardsFav.innerHTML = `<p style="color: var(--cor-texto-escuro); padding: 20px;">Você ainda não tem favoritos =( </p>`
        return
    }

    favoritosAtuais.forEach(favorito => {
        const card = document.createElement('div')
        card.classList.add('card-fav')
        cardsFav.appendChild(card)
        card.innerHTML = `
        <div class="fav-card-image">
            <img src="${favorito.imagem}">
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

btnFav.addEventListener('click', renderizarFavoritos)

function remover(titulo) {
    const favoritosAtuais = JSON.parse(localStorage.getItem('favoritos')) || []
    const novosFavoritos = favoritosAtuais.filter(fav => fav.titulo !== titulo)
    localStorage.setItem('favoritos', JSON.stringify(novosFavoritos))
    renderizarFavoritos()
}