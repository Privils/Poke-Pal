const maxPokemon = 200;
let allPokemons = [];
const searchValue = document.querySelector("#input");

// Fetching the list of Pokémon
fetch(`https://pokeapi.co/api/v2/pokemon?limit=${maxPokemon}`)
  .then((res) => res.json())
  .then((data) => {
    allPokemons = data.results;
    displayHomeData(allPokemons); // Displaying Pokémon after fetching
  });

// Fetch Pokémon data before redirect
const myPokemonDataBeforeRedirect = async (id) => {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`).then((response) =>
        response.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`).then((res) =>
        res.json()
      ),
    ]);
    return true; // Returning true to indicate success
  } catch (error) {
    console.log(error);
    return false; // Return false if there is an error
  }
};

// Displaying Home Pokémon List
function displayHomeData(pokemonList) {
  let homeDataEl = document.querySelector("#mainContentContainer"); // Ensure homeDataEl is a DOM element
  homeDataEl.innerHTML = ""; // Clear the container before populating it

  pokemonList.forEach((pokemon) => {
    const pokemonId = pokemon.url.split("/")[6]; // Correctly extract the Pokémon ID

    const listDiv = document.createElement("div");
    listDiv.className = "pokemonInitial"; // Set the class

    listDiv.innerHTML = `
          <div id="p-Container">
            <p class="rightText">#${pokemonId}</p>
          </div>
          <div id="img-container">
            <a href="info.html?name=${pokemon.name}">
              <img alt="${pokemon.name}" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg" id="img"/>
            </a>
          </div>
          <div id="nameContainer">
            <span id="name">
              <a href="Info.html?name=${pokemon.name}">${pokemon.name}</a>
            </span>
          </div>
    `;

    // Add click event listener to each Pokémon item
    listDiv.addEventListener('click', async () => {
      const success = await myPokemonDataBeforeRedirect(pokemonId); // Use correct variable `pokemonId`
      if (success) {
        window.location.href = `Info.html?name=${pokemonId}`; // Correct redirection syntax
      }
    });

    homeDataEl.appendChild(listDiv); // Append the newly created element to the container
  });
}
