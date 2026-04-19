const pokemonName = document.querySelector('.pokemon_name');
const pokemonNumber = document.querySelector('.pokemon_number');
const pokemonImage = document.querySelector('.pokemon');
const form = document.querySelector('.form');
const input = document.querySelector('.input_search');
const livesCounter = document.querySelector('.lives-counter span');
const gameMusic = document.getElementById('game-music');
const muteButton = document.getElementById('mute-button');
const toggleButton = document.getElementById('toggle-silhouette');

// Variáveis do Jogo
let currentPokemonId = 1;
let lives = 10;
const MAX_LIVES = 10;
let currentPokemonName = '';
let hintLength = 0;

const TOTAL_POKEMON = 649;

const getRandomPokemonId = () => {
    let randomId;
    do {
        randomId = Math.floor(Math.random() * TOTAL_POKEMON) + 1;
    } while (randomId === currentPokemonId);
    return randomId;
};

const setToggleButtonState = (isSilhouette) => {
    toggleButton.textContent = '👁️';
    toggleButton.classList.toggle('eye-crossed', !isSilhouette);
    toggleButton.setAttribute('aria-label', isSilhouette ? 'Revelar silhueta' : 'Silhueta revelada');
};

const updateHint = () => {
    if (!currentPokemonName) {
        pokemonName.innerHTML = '???';
        return;
    }

    const letters = Math.min(hintLength, currentPokemonName.length);
    pokemonName.innerHTML = letters > 0
        ? `${currentPokemonName.slice(0, letters)}${letters < currentPokemonName.length ? '...' : ''}`
        : '???';
};

const resetHint = () => {
    hintLength = 0;
    updateHint();
};

// Função para atualizar o contador de vidas no HTML
const updateLivesDisplay = () => {
    livesCounter.innerHTML = lives;
};

// Função para resetar o jogo
// const resetGame = () => {
//     lives = MAX_LIVES;
//     currentPokemonId = 1;
//     updateLivesDisplay();
//     renderPokemon(currentPokemonId);
//     alert('Você perdeu todas as suas vidas! O jogo será reiniciado.');
// };

const resetGame = () => {
    lives = MAX_LIVES;
    updateLivesDisplay();
    renderPokemon(getRandomPokemonId());
    alert('Você perdeu todas as vidas! O jogo será reiniciado.');
};


// Função para buscar o Pokémon na API
const fetchPokemon = async (pokemon) => {
    try {
        const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        if (APIResponse.ok) {
            return await APIResponse.json();
        }
    } catch (error) {
        console.error('Erro ao buscar Pokémon:', error);
    }
    return null;
};

// Função para renderizar o Pokémon
const renderPokemon = async (pokemon) => {
    pokemonName.innerHTML = 'Carregando...';
    pokemonNumber.innerHTML = '';
    pokemonImage.style.display = 'none';
    pokemonImage.classList.add('silhouette'); // silhueta ativa
    setToggleButtonState(true);
    resetHint();

    const data = await fetchPokemon(pokemon);

    if (data) {
        const sprite = data.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default || data.sprites.front_default || '';
        pokemonImage.style.display = sprite ? 'block' : 'none';
        pokemonNumber.innerHTML = data.id;
        pokemonImage.src = sprite;
        input.value = '';
        currentPokemonId = data.id;
        currentPokemonName = data.name.toLowerCase(); // Armazena o nome correto em minúsculas
        resetHint();
    } else {
        pokemonName.innerHTML = 'Erro ao carregar. Atualize a página.';
        currentPokemonName = '';
    }
};

// Função para revelar o Pokémon
const revealPokemon = (isCorrect) => {
    if (isCorrect) {
        pokemonImage.classList.remove('silhouette'); // Remove a silhueta
        pokemonName.innerHTML = currentPokemonName; // Mostra o nome
        
        // Se acertou, espera um pouco e vai para o próximo
        // setTimeout(() => {
        //     currentPokemonId += 1;
        //     renderPokemon(currentPokemonId);
        // }, 1500);
        setTimeout(() => {
            renderPokemon(getRandomPokemonId());
        }, 1500);
    } else {
        // Se errou e perdeu o jogo, revela antes de resetar
        pokemonImage.classList.remove('silhouette'); // Remove a silhueta
        pokemonName.innerHTML = currentPokemonName; // Mostra o nome
    }
}


form.addEventListener('submit', (event) => {
    event.preventDefault();
    const guess = input.value.toLowerCase().trim();
    input.value = ''; // Limpa o input

    if (guess === currentPokemonName) {
        // Acertou
        revealPokemon(true);
        resetHint();
    } else {
        // Errou
        lives -= 1;
        updateLivesDisplay();
        hintLength = Math.min(currentPokemonName.length, hintLength + 1);
        updateHint();

        if (lives <= 0) {
            // Se perdeu, revela o Pokémon e reseta
            revealPokemon(false);
            setTimeout(resetGame, 2000);
        }
    }
});

const initAudio = () => {
    gameMusic.volume = 0.5; // volume inicial
    gameMusic.play().catch(error => {
        console.log("Autoplay bloqueado. O áudio será iniciado no primeiro clique.");
    });
    document.removeEventListener('click', initAudio);
};

document.addEventListener('click', initAudio);


// Inicialização do Jogo
updateLivesDisplay();
// renderPokemon(currentPokemonId);
renderPokemon(getRandomPokemonId());

muteButton.addEventListener('click', () => {
    if (gameMusic.muted) {
        gameMusic.muted = false;
        muteButton.innerHTML = '🔊'; // som ligado
    } else {
        gameMusic.muted = true;
        muteButton.innerHTML = '🔇'; // som desligado
    }
});

toggleButton.addEventListener('click', () => {
    const isSilhouette = pokemonImage.classList.toggle('silhouette');
    setToggleButtonState(isSilhouette);
});
