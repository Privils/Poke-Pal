let currentPokemonId = null;

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const pokemonName = urlParams.get("name");
  if (!pokemonName) {
    console.error("No Pokémon name found in the URL.");
    document.querySelector(".pokemon-name").innerHTML = "Pokémon not found";
  } else {
    const pokemon_url = `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}/`;

    // Fetching Pokémon Data for page 2
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
        document.querySelector(".pokemon-name").innerHTML =
          "Sorry, we couldn't fetch the Pokémon details.";
        return null;
      }
    };

    //function  Display Pokémon Data
    const displayPokemonData = async () => {
      const pokemonData = await getPokemonData();
      if (!pokemonData) return; // Exit if no data

      // Setting the current Pokémon ID
      currentPokemonId = pokemonData.id;

      // Filling in the data on the page
      document.getElementsByClassName("id").innerHTML = `#${pokemonData.id}`;
      document.querySelector(".pokemon-name").innerHTML = pokemonData.name;
      document.querySelector(".img").src =
        pokemonData.sprites.other["official-artwork"].front_default;

      // Displaying all pokemon types
      const types = pokemonData.types.map((type) => type.type.name).join(", ");
      document.querySelector(".typeOfPokemon").innerHTML = types;

      document.querySelector(".weight").innerHTML = `${
        pokemonData.weight / 10
      } kg`;
      document.querySelector(".height").innerHTML = `${
        pokemonData.height / 10
      } m`;

      // Displaying the first 5 moves
      const moves = pokemonData.moves
        .slice(0, 5)
        .map((move) => move.move.name)
        .join(", ");
      document.querySelector(".move").innerHTML = moves;

      // Displaying stats
      const bassStats = document.querySelector(".BassStats");
      bassStats.innerHTML = ""; // Clear existing content
      pokemonData.stats.forEach((stat) => {
        const newPTag = document.createElement("p");
        newPTag.classList.add("states");
        newPTag.innerText = `${stat.stat.name}: ${stat.base_stat}`;
        bassStats.appendChild(newPTag);
      });
    };
    function updateCircularProgressBar(
      statValue,
      maxStat,
      circleId,
      percentageId
    ) {
      const circle = document.getElementById(circleId);
      const percentageElement = document.getElementById(percentageId);

      const radius = circle.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (statValue / maxStat) * circumference;

      circle.style.strokeDashoffset = offset;
      percentageElement.innerText =
        Math.round((statValue / maxStat) * 100) + "%";
    }

    // Function to update all the circular progress bars based on Pokémon stats
    function updateAllCircularProgressBars(pokemonStats) {
      const maxStat = 255;

      // Updating HP progress bar
      const hpStat = pokemonStats.find(
        (stat) => stat.stat.name === "hp"
      ).base_stat;
      updateCircularProgressBar(hpStat, maxStat, "hp-circle", "hp-percentage");

      // Updating Attack progress bar
      const attackStat = pokemonStats.find(
        (stat) => stat.stat.name === "attack"
      ).base_stat;
      updateCircularProgressBar(
        attackStat,
        maxStat,
        "attack-circle",
        "attack-percentage"
      );

      // Updating Defense progress bar
      const defenseStat = pokemonStats.find(
        (stat) => stat.stat.name === "defense"
      ).base_stat;
      updateCircularProgressBar(
        defenseStat,
        maxStat,
        "defense-circle",
        "defense-percentage"
      );
    }
    //event listeners for left and right arrows
    document.querySelector(".fa-arrow-left").addEventListener("click", () => {
      if (currentPokemonId > 1) {
        currentPokemonId--;
        loadNewPokemon(currentPokemonId);
      }
    });

    document.querySelector(".fa-arrow-right").addEventListener("click", () => {
      currentPokemonId++;
      loadNewPokemon(currentPokemonId);
    });

    // Loading new Pokémon data by ID
    const loadNewPokemon = (pokemonId) => {
      window.location.href = `?name=${pokemonId}`;
    };
    displayPokemonData();
    const pokemonData = await getPokemonData(pokemon_url);
    if (pokemonData) {
      updateAllCircularProgressBars(pokemonData.stats); // Updating all circular progress bars
    }
  }
});
