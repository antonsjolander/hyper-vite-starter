const url = (pokemon) => `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
const main = document.querySelector('main');

console.log(url('ditto'), main);

function renderPokemon(pokemon) {
    const container = document.createElement('div');
    container.classList.add('pokemon');
    const name = `<h3>${pokemon.name}</h3>`;
    const abilities = pokemon.abilities.map(item => {
        return `<p>${item.ability.name}</p>`
    })
    container.innerHTML = `${name} 
    <p>Abilities: </p>
    ${abilities.join(' ')}`
    main.append(container);
}

async function fetchPokemon(url) {
    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error("HTTP " + response.status);
        const pokemon = await response.json();
        renderPokemon(pokemon);
    } catch (error) {
        console.error(error);
    }
}

fetchPokemon(url('ditto'));