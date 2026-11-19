const url = () => `https://hyperchirp.vercel.app/api/chirps`;
const chirpsContainer = document.querySelector('.chirps')
const button = document.querySelector('.load-data')
const loader = document.querySelector('.loader')

async function fetchChirps() {
    try {
        const response = await fetch(url())
        if(!response.ok) throw new Error("http", response.status)
        const chirps = await response.json();
        renderChirps(chirps);
        loading(false);
    }catch(error) {
        console.error(error);
    }
}

async function likeChirp(id, btn) {
    try {
        const response = await fetch(`
            https://hyperchirp.vercel.app/api/chirps/${id}/like`
            , {
                method: 'POST'
            }
        )
        if(!response.ok) throw new Error("http", response.status)
        const chirp = await response.json(); 
        btn.innerHTML = `❤️ ${chirp.likes}`
        btn.style.disable = true;
    } catch (error){
        console.error(error);
}
}

function renderCard (chirp) {
    const {author_name, content, likes, id} = chirp;
    const div = document.createElement('div');
    div.classList.add('chirp')
    div.innerHTML = `
            <h3>${author_name}</h3>
            <p>${content}</p>
            <button data-id="${id}" class="like-btn">❤️ ${likes}</button>
    `
    return div;
}

function renderChirps (chirps) {
    chirps.forEach(chirp => {
        chirpsContainer.appendChild(renderCard(chirp))
    })
    document.querySelectorAll('.like-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            likeChirp(btn.dataset.id, btn);
        });
    })
}


function loading(state) {
    loader.style.opacity = state ? 1 : 0;
    button.style.disable = state
}

function handleClick() {
    loading(true);
    chirpsContainer.innerHTML = ''
    fetchChirps()
}

button.addEventListener('click', handleClick);

