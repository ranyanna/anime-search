const form = document.querySelector('form')
const input = document.querySelector('input')
const results = document.querySelector('.results')
const loadingResults = document.querySelector('#loading-results')
const btnFav = document.querySelector('.btn-fav')
const cardsFav = document.querySelector('.cards-fav')

form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const busca = input.value
    cardsFav.classList.add('hidden')
    results.classList.remove('hidden')

    try {
        loadingResults.classList.remove('hidden')
        const resposta = await fetch(`https://api.jikan.moe/v4/anime?q=${busca}`)
        const dados = await resposta.json()
        const animes = dados.data
        results.innerHTML = ''
        if (animes.length === 0) {
            results.innerHTML = `<p>Nenhum resultado encontrado</p>`
        } else {
            animes.forEach(anime => {
                const card = document.createElement('div')
                card.classList.add('card')
                results.appendChild(card)
                card.innerHTML = `<img src="${anime.images.jpg.image_url}"> <h3>${anime.title}</h3> <p>${anime.genres.map(genero => genero.name).join(', ')}</p> <button onclick="favoritar('${anime.title}', '${anime.images.jpg.image_url}')">♡ Favoritar</button>`
            });
        }
    } catch (erro) {
        results.innerHTML = `<p>Servidor nao encontrado</p>`
    } finally {
        loadingResults.classList.add('hidden')
    }
})



function favoritar(titulo, imagem) {
    console.log(titulo, imagem)

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
        card.classList.add('cardsFav')
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