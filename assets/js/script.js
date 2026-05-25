const form = document.querySelector('form')
const input = document.querySelector('input')
const results = document.querySelector('.results')
const loadingResults = document.querySelector('#loading-results')
const btnFav = document.querySelector('.btn-fav')
const cardsFav = document.querySelector('.cards-fav')
const statCount = document.querySelector('.stat-count')

form.addEventListener('submit', async (event) => {
    event.preventDefault()

    if (input.value.trim() === "") {
        return
    }

    const busca = input.value
    cardsFav.classList.add('hidden')
    results.classList.remove('hidden')

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
                <button onclick="favoritar('${anime.title}', '${anime.images.jpg.large_image_url}')">♡ Favoritar</button>
                <span class="card-score">★ ${anime.score ?? 'N/A'}</span>
                </div>
            `
            });
        }
    } catch (erro) {
        results.innerHTML = `<p>Servidor nao encontrado</p>`
    } finally {
        loadingResults.classList.add('hidden')
    }
})



function favoritar(titulo, imagem) {

    const favoritosAtuais = JSON.parse(localStorage.getItem('favoritos')) || []
    favoritosAtuais.push({ titulo, imagem })

    localStorage.setItem('favoritos', JSON.stringify(favoritosAtuais))
}

btnFav.addEventListener('click', () => {
    const favoritosAtuais = JSON.parse(localStorage.getItem('favoritos')) || []
    cardsFav.innerHTML = ''
    results.classList.add('hidden')
    cardsFav.classList.remove('hidden')
    favoritosAtuais.forEach(favoritar => {
        const card = document.createElement('div')
        card.classList.add('.cards-fav')
        cardsFav.appendChild(card)
        card.innerHTML = `<img src="${favoritar.imagem}"> <h3>${favoritar.titulo}</h3> <button onclick="remover('${favoritar.titulo}')">Remover</button>`
    })
})

function remover(titulo) {
    const favoritosAtuais = JSON.parse(localStorage.getItem('favoritos')) || []
    const novosFavoritos = favoritosAtuais.filter(fav => fav.titulo !== titulo)
    localStorage.setItem('favoritos', JSON.stringify(novosFavoritos))
    btnFav.click()
}