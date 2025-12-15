async function fetchFairyPokemons() {
    const url = "https://pokeapi.co/api/v2/type/fairy";

    try {
        const response = await fetch(url);
        const data = await response.json();

        const pokeList = data.pokemon.slice(0, 12).map(item => item.pokemon);

        const detailedPokemons = await Promise.all(
            pokeList.map(async (poke) => {
                const res = await fetch(poke.url);
                return res.json();
            })
        );

        return detailedPokemons;
    } catch (error) {
        console.error("Erro ao buscar Pokémon tipo Fada:", error);
        return [];
    }
}

async function createPokemonCards() {
    const container = document.getElementById("pokemon-container");
    container.innerHTML = "<p>Carregando...</p>";

    const pokemons = await fetchFairyPokemons();

    container.innerHTML = ""; 

    pokemons.forEach(poke => {
        const card = document.createElement("div");
        card.classList.add("card");

        const image = poke.sprites.other["official-artwork"].front_default;

        const attack = poke.stats.find(s => s.stat.name === "attack")?.base_stat || "???";
        const defense = poke.stats.find(s => s.stat.name === "defense")?.base_stat || "???";

        const weight = poke.weight / 10;  
        const height = poke.height / 10;  

        const move1 = poke.moves[0]?.move.name || "Indisponível";
        const move2 = poke.moves[1]?.move.name || "Indisponível";

        const name = poke.name.charAt(0).toUpperCase() + poke.name.slice(1);

        card.innerHTML = `
            <div class="img-box">
                <img src="${image}" alt="${name}">
            </div>

            <h2>${name}</h2>

            <span class="type">Fada</span>

            <div class="info-grid">

                <div>
                    <p><strong>Altura</strong></p>
                    <p>${height} m</p>
                </div>

                <div>
                    <p><strong>Defesa</strong></p>
                    <p>${defense}</p>
                </div>

                <div>
                    <p><strong>Peso</strong></p>
                    <p>${weight} kg</p>
                </div>

            </div>

            <div class="abilities">
                <p><strong>Habilidades</strong></p>
                <p>${move1}</p>
                <p>${move2}</p>

                <p style="margin-top:10px;"><strong>Ataque:</strong> ${attack}</p>
            </div>
        `;

        container.appendChild(card);
    });
}

createPokemonCards();