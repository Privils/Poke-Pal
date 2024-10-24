
const maxPokemon = 200;
let allPokemons = [];
const searchValue = document.querySelector("#input"); // Your search input

// Fetch Pokémon data
fetch(`https://pokeapi.co/api/v2/pokemon?limit=${maxPokemon}`)
  .then((res) => res.json())
  .then((data) => {
    allPokemons = data.results;
    displayHomeData(allPokemons); // Display fetched Pokémon
  });

// Fetch detailed Pokémon data
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
    return true; // Success
  } catch (error) {
    console.log(error);
    return false; // Handle failure
  }
};

// Function to display Pokémon list on the homepage
function displayHomeData(pokemonList) {
  let homeDataEl = document.querySelector("#mainContentContainer"); // Selecting the main content container
  homeDataEl.innerHTML = ""; // Clear any previous content

  pokemonList.forEach((pokemon) => {
    const pokemonId = pokemon.url.split("/")[6]; // Extracting the Pokémon ID

    const listDiv = document.createElement("div");
    listDiv.className = "pokemonInitial";

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
              <a href="info.html?name=${pokemon.name}">${pokemon.name}</a>
            </span>
          </div>
    `;

    // Add a click listener to each Pokémon item
    listDiv.addEventListener('click', async () => {
      const success = await myPokemonDataBeforeRedirect(pokemonId); // Use the correct Pokémon ID
      if (success) {
        window.location.href = `Info.html?name=${pokemonId}`; // Redirect on success
      }
    });

    homeDataEl.appendChild(listDiv); // Append the Pokémon item to the container
  });
}
