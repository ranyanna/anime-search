const form = document.querySelector('form')
const input = document.querySelector('input')
const results = document.querySelector('.results')

form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const busca = input.value
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
        card.innerHTML = `<img src="${anime.images.jpg.image_url}"> <h3>${anime.title}</h3> <p>${anime.genres.map(genero => genero.name).join(', ')}</p>`
    });
    }
})