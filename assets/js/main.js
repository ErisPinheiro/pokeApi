const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const favoritesButton = document.getElementById('FavoritesButton');
const showAllButton = document.getElementById('AllButton');
const searchInput = document.getElementById('searchInput');

const maxRecords = 151;
const limit = 12;
let offset = 0;
let allPokemons = [];

// Função para carregar mais Pokémon
function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map((pokemon) => `
      <li class="pokemon ${pokemon.type}">
        <span class="number">#${pokemon.number}</span>
        <span class="name">${pokemon.name}</span> 
        <div class="detail">
          <ol class="types">
            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
          </ol>
          <img src="${pokemon.photo}" alt="${pokemon.name}">
        </div>
      </li>
    `).join('');

    pokemonList.innerHTML += newHtml;
  });
}

// Botao de carregar mais Pokémons
loadPokemonItens(offset, limit);
loadMoreButton.addEventListener('click', () => {
  offset += limit;
  const qtdRecordsWithNextPage = offset + limit;

  if (qtdRecordsWithNextPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);
    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});

// Função para verificar se o Pokémon está nos favoritos
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

// Função para buscar os IDs dos Pokémon favoritados do localStorage
function getFavoritePokemons() {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  return favorites;
}

// Função para buscar os detalhes de um Pokémon específico da API
async function getPokemonDetailById(pokemonId) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
    const pokemonDetail = await response.json();
    return pokemonDetail;
  } catch (error) {
    console.error("Erro ao buscar detalhes do Pokémon:", error);
  }
}

// Função para exibir os Pokémon favoritados
async function showFavoritePokemons() {
  const favoriteIds = getFavoritePokemons();

  // Limpar a lista atual de Pokémon
  document.getElementById('pokemonList').innerHTML = '';

  // Verificar se existem favoritos
  if (favoriteIds.length === 0) {
    document.getElementById('pokemonList').innerHTML = '<p>Nenhum Pokémon favoritado.</p>';
    return;
  }

  // Iterar sobre os IDs dos Pokémon favoritados
  for (let i = 0; i < favoriteIds.length; i++) {
    const pokemonId = favoriteIds[i];

    // Buscar os detalhes de cada Pokémon
    const pokemonDetail = await getPokemonDetailById(pokemonId);

    // Criar o item na lista de Pokémon
    const pokemonElement = createPokemonListItem(pokemonDetail);

    // Adicionar o item à lista de Pokémon
    document.getElementById('pokemonList').appendChild(pokemonElement);
  }
}

// Função para criar o item da lista de Pokémon
function createPokemonListItem(pokemon) {
  const li = document.createElement('li');
  li.classList.add('pokemon', pokemon.types[0].type.name);

  li.innerHTML = `
    <span class="number">#${pokemon.id}</span>
    <span class="name">${pokemon.name}</span>
    <div class="detail">
      <ol class="types">
        ${pokemon.types.map(type => `<li class="type ${type.type.name}">${type.type.name}</li>`).join('')}
      </ol>
      <img src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}">
    </div>
  `;

  return li;
}

// Event listener para exibir apenas os Pokémon favoritados
favoritesButton.addEventListener('click', () => {
  showFavoritePokemons();
  showAllButton.disabled = false;
  loadMoreButton.disabled = true;
});

// Event listener para exibir todos os Pokémon
showAllButton.addEventListener('click', () => {
  offset = 0; 
  loadPokemonItens(offset, limit, true);
  
  showAllButton.disabled = true;
  loadMoreButton.disabled = false;

});

// Modal para Pokémon
const modalPokemon = document.querySelector('.modalOpen');
let buttonClose = null;

pokemonList.onclick = function (event) {
  const pokemonNumber = event.target
    .closest('.pokemon')
    .querySelector('.number')
    .textContent.replace('#', '');
  loadAndPopulateModal(pokemonNumber);
  modalPokemon.showModal();
};

async function loadAndPopulateModal(pokemonNumber) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}/`);
    const data = await response.json();

    populateModal(data);

    const buttonClose = document.getElementById('closeButton');
    buttonClose.onclick = function () {
      modalPokemon.close();
    };
  } catch (error) {
    console.error("Erro ao carregar dados da API:", error);
  }
}

function populateModal(data) {
  const firstType = data.types[0].type.name.toLowerCase();
  modalPokemon.innerHTML = `
    <div class="modalColor ${firstType}">
      <div class="control">
        <div id="closeButton" class="close-button">
          <img src="./assets/icon/arrow-left.svg" alt="back">
        </div>
        <img id="favoriteButton" class="favorite" src="./assets/icon/heart.svg" alt="favorite">
      </div>
      <div class="modalPokeData">
        <span>${data.name}</span>
        <span class="pokemonNumber">#${data.id}</span>
        <div class="pokephoto">
          <img src="${data.sprites.other.dream_world.front_default}" alt="pokemon">
        </div>
      </div>
      <div class="detail">
        <div class="detailbody">
          <ol class="types">
            ${data.types.map(type => `<span class="type ${type.type.name}">${type.type.name}</span>`).join('')}
          </ol>
          <div class="base-stats">
            <table>
              <tbody>
                ${data.stats.map(stat => `
                  <tr>
                    <td>${stat.stat.name}</td>
                    <td>${stat.base_stat}</td>
                    <td>
                      <progress class="progress-bar" max="160" value="${stat.base_stat}">${stat.base_stat}%</progress>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  updateFavoriteButton(data.id);

  const favoriteButton = document.getElementById('favoriteButton');
  favoriteButton.onclick = function () {
    toggleFavorite(data.id);
    updateFavoriteButton(data.id);
  };
}

// Função para atualizar o botão de favorito no modal
function updateFavoriteButton(pokemonId) {
  const favoriteButton = document.getElementById('favoriteButton');

  if (isFavorite(pokemonId)) {
    favoriteButton.src = './assets/icon/heart-filled.svg';
  } else {
    favoriteButton.src = './assets/icon/heart.svg';
  }
}
