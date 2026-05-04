const form = document.querySelector('form')
const input = document.querySelector('input')
const results = document.querySelector('.results')

form.addEventListener('submit', (event) => {
    event.preventDefault()
    const busca = input.value
    fetch(`https://api.jikan.moe/v4/anime?q=${busca}`)
})