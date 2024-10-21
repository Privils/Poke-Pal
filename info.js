let currentPokemonId = null;

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const pokemonName = urlParams.get("name");

  if (!pokemonName) {
    console.error("No Pokémon name found in the URL.");
    document.querySelector('.pokemon-name').innerHTML = "Pokémon not found";
  } else {
    const pokemon_url = `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}/`;

    // Fetch Pokémon Data
    const getPokemonData = async () => {
      try {
        const response = await fetch(pokemon_url);
        if (response.ok) {
          return await response.json();
        } else {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        document.querySelector('.pokemon-name').innerHTML = "Sorry, we couldn't fetch the Pokémon details.";
        return null;
      }
    };

    // Display Pokémon Data
    const displayPokemonData = async () => {
      const pokemonData = await getPokemonData();
      if (!pokemonData) return; // Exit if no data

      // Set current Pokémon ID
      currentPokemonId = pokemonData.id;

      // Fill in the data on the page
      document.getElementsByClassName("id").innerHTML = `#${pokemonData.id}`;
      document.querySelector(".pokemon-name").innerHTML = pokemonData.name;
      document.querySelector(".img").src = pokemonData.sprites.other["official-artwork"].front_default;

      // Display all types
      const types = pokemonData.types.map(type => type.type.name).join(", ");
      document.querySelector(".typeOfPokemon").innerHTML = types;

      document.querySelector(".weight").innerHTML = `${pokemonData.weight / 10} kg`;
      document.querySelector(".height").innerHTML = `${pokemonData.height / 10} m`;

      // Display first 5 moves
      const moves = pokemonData.moves.slice(0, 5).map(move => move.move.name).join(", ");
      document.querySelector(".move").innerHTML = moves;

      // Display stats
      const bassStats = document.querySelector(".BassStats");
      bassStats.innerHTML = ''; // Clear existing content
      pokemonData.stats.forEach((stat) => {
        const newPTag = document.createElement("p");
        newPTag.classList.add("states");
        newPTag.innerText = `${stat.stat.name}: ${stat.base_stat}`;
        bassStats.appendChild(newPTag);
      });
    };

    // Call function to display data
    displayPokemonData();
  }
});
