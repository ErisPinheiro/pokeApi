const modalPokemon = document.querySelector('.modalOpen')
let buttonClose = null;


pokemonList.onclick = function (event) {    
    const pokemonNumber = event.target
    .closest('.pokemon')
    .querySelector('.number')
    .textContent.replace('#', '');     
    loadAndPopulateModal(pokemonNumber);      
    modalPokemon.showModal(); 
}    

buttonClose.onclick = function () {
    console.log("fechar");
    modalPokemon.close();
  };


  async function loadAndPopulateModal(pokemonNumber) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}/`);
      const data = await response.json();
  
      populateModal(data);
      console.log(data);
      console.log(
        data.stats.map((stat) => `${stat.stat.name}: ${stat.base_stat}`)
      );
  
      const buttonClose = document.getElementById('closeButton');
      buttonClose.onclick = function () {
        console.log("fechar");
        modalPokemon.close();
      };
  
    } catch (error) {
      console.error("Erro ao carregar dados da API:", error);
    }
  }
        
        function populateModal(data) {
            const firstType = data.types[0].type.name.toLowerCase();
            modalPokemon.innerHTML =`

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
            ${data.types.map( (type) =>`<span class="type ${type.type.name}">${type.type.name}</span>`).join("")}
        </ol>
        
        <div class="base-stats">
        <table>
        <tbody>
            ${data.stats.map(
                (stat) => `
                    <tr>
                        <td>${stat.stat.name}</td>
                        <td>${stat.base_stat}</td>
                        <td>
                            <progress class="progress-bar" max="160" value="${stat.base_stat}">${stat.base_stat}%</progress>
                        </td>
                    </tr>
                `
            ).join("")}            
        </tbody>
    </table>
        </div>  
        </div>
    <div>      `;

    // Atualize o estado do botão de favorito
  updateFavoriteButton(data.id);

  // Adicione o evento de clique ao botão de favorito
  const favoriteButton = document.getElementById('favoriteButton');
  favoriteButton.onclick = function () {
    toggleFavorite(data.id);
    updateFavoriteButton(data.id);
  };




}






// pokemonList.onclick = function (event) {const pokemonNumber = event.target.closest('.pokemon').querySelector('.number').textContent.replace('#', '');     loadAndPopulateModal(pokemonNumber);     modalOpen.showModal(); }
// function loadAndPopulateModal(pokemonNumber) {
    //     fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}/`)
    //         .then(response => response.json())
    //         .then(data => {
        //             populateModal(data);
        //             console.log(data.types[0].type.name)
        //         })
        //         .catch(error => {
            //             console.error('Erro ao carregar dados da API:', error);
            //         });
            // }   
            
            
            
            // const openModal = document.querySelector(".open-button");
            // const closeModal = document.querySelector(".close-button");
            
            // openModal.addEventListener('click', () => {
            //     modal.showModal();
            // })
            
            // closeModal.addEventListener('click', () => {
            //   modal.close()
            // })