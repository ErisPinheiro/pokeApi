
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
    
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonDetail = async (pokemon) => {
    const response = await fetch(pokemon.url);
    const data = await response.json();
    return convertPokeApiDetailToPokemon(data);
  };
  
  pokeApi.getPokemons = async (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
  
    try {
      const response = await fetch(url);
      const jsonBody = await response.json();
      
      const pokemons = jsonBody.results;
      const detailRequests = pokemons.map(pokeApi.getPokemonDetail);
      
      const pokemonDetails = await Promise.all(detailRequests);
      return pokemonDetails;
    } catch (error) {
      console.error("Erro ao carregar pokémons:", error);
      throw error;
    }
  };