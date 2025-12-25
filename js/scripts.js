const pokemonName = document.querySelector('.pokemon_name');
const pokemonNumber = document.querySelector('.pokemon_number');
const pokemonImage = document.querySelector('.pokemon');
const form = document.querySelector('.form');
const input = document.querySelector('.input_search');
const livesCounter = document.querySelector('.lives-counter span');
const gameMusic = document.getElementById('game-music');
const muteButton = document.getElementById('mute-button');

// Variáveis do Jogo
let currentPokemonId = 1;
let lives = 5;
const MAX_LIVES = 5;
let currentPokemonName = '';

// Função para atualizar o contador de vidas no HTML
const updateLivesDisplay = () => {
    livesCounter.innerHTML = lives;
};

// Função para resetar o jogo
const resetGame = () => {
    lives = MAX_LIVES;
    currentPokemonId = 1;
    updateLivesDisplay();
    renderPokemon(currentPokemonId);
    alert('Você perdeu todas as suas vidas! O jogo será reiniciado.');
};

// Função para buscar o Pokémon na API
const fetchPokemon = async (pokemon) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    if(APIResponse.status === 200) {
        const data = await APIResponse.json();
        return data;
    }
    return null;
}

// Função para renderizar o Pokémon
const renderPokemon = async (pokemon) => {
    pokemonName.innerHTML = 'Carregando...';
    pokemonNumber.innerHTML = '';
    pokemonImage.classList.add('silhouette'); // Garante que a silhueta está ativa

    const data = await fetchPokemon(pokemon);

    if(data){
        pokemonImage.style.display = 'block';
        pokemonName.innerHTML = '???'; // Esconde o nome
        pokemonNumber.innerHTML = data.id;
        pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
        input.value = '';
        currentPokemonId = data.id;
        currentPokemonName = data.name.toLowerCase(); // Armazena o nome correto em minúsculas
    } 
    // não é mais necessário tentar o próximo
    // else { 
    //     // Se não encontrar, tenta o próximo 
    //     // pokemonName.innerHTML = 'Não encontrado :(';
    //     // pokemonNumber.innerHTML = '';
    //     // pokemonImage.style.display = 'none';
    //     // Se o ID for muito alto, volta para o 1
    //     if (currentPokemonId > 1) {
    //         currentPokemonId = 1;
    //         renderPokemon(currentPokemonId);
    //     }
}

// Função para revelar o Pokémon
const revealPokemon = (isCorrect) => {
    if (isCorrect) {
        pokemonImage.classList.remove('silhouette'); // Remove a silhueta
        pokemonName.innerHTML = currentPokemonName; // Mostra o nome
        
        // Se acertou, espera um pouco e vai para o próximo
        setTimeout(() => {
            currentPokemonId += 1;
            renderPokemon(currentPokemonId);
        }, 1500);
    } else {
        // Se errou e perdeu o jogo, revela antes de resetar
        pokemonImage.classList.remove('silhouette'); // Remove a silhueta
        pokemonName.innerHTML = currentPokemonName; // Mostra o nome
    }
}

// Evento de submissão do formulário (tentativa de adivinhação)
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const guess = input.value.toLowerCase().trim();
    input.value = ''; // Limpa o input

    if (guess === currentPokemonName) {
        // Acertou
        pokemonName.innerHTML = 'Correto! ' + currentPokemonName;
        revealPokemon(true);
    } else {
        // Errou
        lives -= 1;
        updateLivesDisplay();
        pokemonName.innerHTML = 'Errado! ' + lives + ' vidas restantes.';

        if (lives <= 0) {
            // Se perdeu, revela o Pokémon e reseta
            revealPokemon(false); 
            setTimeout(resetGame, 2000);
        } else {
            // Se errou, mas ainda tem vidas, volta a mensagem para '???'
            setTimeout(() => {
                pokemonName.innerHTML = '???';
            }, 1500);
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
renderPokemon(currentPokemonId);


muteButton.addEventListener('click', () => {
    if (gameMusic.muted) {
        gameMusic.muted = false;
        muteButton.innerHTML = '🔊'; // som ligado
    } else {
        gameMusic.muted = true;
        muteButton.innerHTML = '🔇'; // som desligado
    }
});
