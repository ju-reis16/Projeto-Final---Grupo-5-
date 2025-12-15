async function fetchDarkPokemons() {
    const url = "https://pokeapi.co/api/v2/type/dark";
    try {
        const data = await (await fetch(url)).json();
        const list = data.pokemon.slice(0, 12).map(p => p.pokemon);

        return Promise.all(list.map(async (p) => {
            return await (await fetch(p.url)).json();
        }));

    } catch (err) {
        console.error(err);
        return [];
    }
}

async function createDarkCards() {
    const container = document.getElementById("pokemon-container");
    container.innerHTML = "Carregando...";

    const pokes = await fetchDarkPokemons();
    container.innerHTML = "";

    pokes.forEach(p => {
        const card = document.createElement("div");
        card.className = "card";

        const img = p.sprites.other["official-artwork"].front_default;
        const attack = p.stats.find(s => s.stat.name === "attack")?.base_stat;
        const defense = p.stats.find(s => s.stat.name === "defense")?.base_stat;
        const weight = p.weight / 10;
        const height = p.height / 10;
        const m1 = p.moves[0]?.move.name;
        const m2 = p.moves[1]?.move.name;

        const name = p.name.charAt(0).toUpperCase() + p.name.slice(1);

        card.innerHTML = `
            <div class="img-box">
                <img src="${img}">
            </div>
            <h2>${name}</h2>
            <span class="type">Dark</span>

            <div class="info-grid">
                <div><p><strong>Altura</strong></p><p>${height} m</p></div>
                <div><p><strong>Defesa</strong></p><p>${defense}</p></div>
                <div><p><strong>Peso</strong></p><p>${weight} kg</p></div>
            </div>

            <div class="abilities">
                <p><strong>Habilidades:</strong></p>
                <p>${m1}</p>
                <p>${m2}</p>
                <p><strong>Ataque:</strong> ${attack}</p>
            </div>
        `;

        container.appendChild(card);
    });
}

createDarkCards();