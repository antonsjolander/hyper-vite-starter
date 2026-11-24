const url = () => `https://hyperchirp.vercel.app/api/chirps`;
const chirpsContainer = document.querySelector('.chirps')
const button = document.querySelector('.load-data')
const loader = document.querySelector('.loader')
const form = document.querySelector('#chirp-form');
const submitButton = form.querySelector('button');

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
    submitButton.textContent = state ? 'Loading...' : 'Post chirp'
    button.disabled = state
    submitButton.disabled = state
}

function handleClick() {
    loading(true);
    chirpsContainer.innerHTML = ''
    fetchChirps()
}

function handleSubmit() {
    loading(true);
    form.reset();
    fetchChirps();
}

async function postChirp(payload) {
    try {
      
        const response = await fetch(url(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        if(response.ok) {
            const data = await response.json();
            console.log(data)
            handleSubmit();
        }
    } catch(error) {
        console.error(error);
    }
}

form.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = {
        author_name: formData.get('author_name'),
        content: formData.get('content'),
        tag: formData.get('tag') || undefined,
        is_anonymous: formData.has('is_anonymous'),
    }
    loading(true);
    postChirp(payload);
})
button.addEventListener('click', handleClick);

