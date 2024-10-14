const maxPokemon = 200;
let allPokemons = [];
const searchValue = document.querySelector("#input");

// Fetch Pokémon data
fetch(`https://pokeapi.co/api/v2/pokemon?limit=${maxPokemon}`)
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    console.log(data.results);
    allPokemons = data.results;
    displayHomeData(allPokemons); // Call displayHomeData here
  });

// Function to redirect and fetch species data
async function pokemonRedirect(id) {
  try {
    const [pokemonId, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(
        (res) => res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);
    return { pokemonId, pokemonSpecies }; // Return relevant data
  } catch (error) {
    console.log(error);
  }
}

// Function to display Pokémon data
function displayHomeData(pokemonList) {
  let homeEl = "";

  // Loop through the Pokémon list
  Array.isArray(pokemonList) &&
    pokemonList.forEach((pokemon) => {
      const pokemonId = pokemon.url.split("/")[6]; // Get the ID from the URL

      // Create a container div for each Pokémon
      const newContainer = document.createElement("div");
      newContainer.className = "pokemonInitial";

      // Add the Pokémon HTML content
      newContainer.innerHTML = `
        <div id="p-Container">
          <p class="rightText">#${pokemonId}</p>
        </div>
        <div id="img-container">
          <img alt="${pokemon.name}" src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg" />
        </div>
        <div id="nameContainer">
          <span id="name">${pokemon.name}</span>
        </div>
      `;

      // Append the container HTML to the homeEl string
      homeEl += newContainer.outerHTML;
    });

  // Ensure we are selecting the right container
  const container = document.querySelector("#mainContentContainer");
  container.innerHTML = homeEl; // Update container with the accumulated HTML
}

// Event listener for search (if needed)
document.querySelector("#form").addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent default form submission

  const query = searchValue.value.toLowerCase();
  
  // Filter the Pokémon list based on the search query (name or ID)
  const filteredPokemons = allPokemons.filter((pokemon) => {
    return (
      pokemon.name.toLowerCase().includes(query) ||
      pokemon.url.split("/")[6] === query // Check if the query matches the ID
    );
  });

  displayHomeData(filteredPokemons); // Update the display with filtered data
});
