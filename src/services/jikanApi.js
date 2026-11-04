const BASE_URL = 'https://api.jikan.moe/v4'

/** 
*@param { string } query
*@return { Promise<Array>}
*/

export async function searchAnimes(query) {
    if (!query || !query.trim()) return []

    try {
        const response = await fetch(`${BASE_URL}/anime?q=${encodeURIComponent(query)}`)

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`)
        }

        const data = await response.json()
        return data.data || []
    } catch (error) {
        console.error('Erro ao buscar animes no serviço Jikan API:', error)
        throw error
    }
}