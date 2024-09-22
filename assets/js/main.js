const pokemonList = document.getElementById(`pokemonList`)
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 12
let offset = 0;


// Carregar mais pokemons

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) =>  `
            <li class="pokemon ${pokemon.type}">
                        <span class="number">#${pokemon.number}</span>
                        <span class="name">${pokemon.name}</span> 
        
                        <div class="detail">
                            <ol class="types">
                                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}

                            </ol>
        
                            <img src="${pokemon.photo}" 
                                alt="${pokemon.name}">
                        </div>
                    </li>
     `).join('')

    pokemonList.innerHTML += newHtml
    })
}


loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNextPage = offset + limit

    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {

        loadPokemonItens(offset, limit)
    }

})

// Função para verificar se o Pokémon já está nos favoritos
function isFavorite(pokemonId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.includes(pokemonId);
  }
  
  // Função para adicionar/remover o Pokémon dos favoritos
  function toggleFavorite(pokemonId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
    if (favorites.includes(pokemonId)) {
      favorites = favorites.filter(id => id !== pokemonId); // Remove dos favoritos
    } else {
      favorites.push(pokemonId); // Adiciona aos favoritos
    }
  
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
  

  // Modificação Botão Favoritos 
  function updateFavoriteButton(pokemonId) {
    const favoriteButton = document.getElementById('favoriteButton');
  
    if (isFavorite(pokemonId)) {
      favoriteButton.src = './assets/icon/heart-filled.svg'; 
    } else {
      favoriteButton.src = './assets/icon/heart.svg'; 
    }
  }


  

