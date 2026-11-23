const url = () => 'https://hyperchirp.vercel.app/api/chirps';
const chirpsContainer = document.querySelector('.chirps');
const button = document.querySelector('.load-data');
const loader = document.querySelector('.loader');
const form = document.querySelector('#chirp-form');
const fields = form.querySelector('fieldset');
const submitButton = form.querySelector('button[type="submit"]');
const composeStatus = document.querySelector('#compose-status');

async function fetchChirps() {
    if (button.disabled) return;
    loading(true);
    loader.textContent = 'Loading chirps…';
    try {
        const response = await fetch(url());
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const chirps = await response.json();
        renderChirps(chirps);
        loader.textContent = chirps.length ? 'Feed loaded.' : 'No chirps yet.';
    } catch (error) {
        loader.textContent = 'Could not load chirps. ' + error.message;
    } finally {
        loading(false);
    }
}

async function likeChirp(id, btn) {
    if (btn.disabled) return;
    btn.disabled = true;
    try {
        const response = await fetch(`${url()}/${id}/like`, { method: 'POST' });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const chirp = await response.json();
        btn.textContent = `❤️ ${chirp.likes}`;
    } catch (error) {
        btn.textContent = 'Could not like. Try again.';
    } finally {
        btn.disabled = false;
    }
}

function renderCard(chirp) {
    const div = document.createElement('div');
    div.classList.add('chirp');
    const author = document.createElement('h3');
    author.textContent = chirp.is_anonymous ? 'Anonymous' : chirp.author_name;
    const message = document.createElement('p');
    message.textContent = chirp.content;
    const likeButton = document.createElement('button');
    likeButton.type = 'button';
    likeButton.classList.add('like-btn');
    likeButton.dataset.id = chirp.id;
    likeButton.textContent = `❤️ ${chirp.likes}`;
    likeButton.addEventListener('click', () => likeChirp(chirp.id, likeButton));
    div.append(author, message);
    if (chirp.tag) {
        const tag = document.createElement('p');
        tag.textContent = '#' + chirp.tag;
        div.append(tag);
    }
    div.append(likeButton);
    return div;
}

function renderChirps(chirps) {
    chirpsContainer.replaceChildren(...chirps.map(renderCard));
}

function loading(state) {
    button.disabled = state;
    submitButton.disabled = state;
    fields.disabled = state;
}

async function handleSubmit(event) {
    event.preventDefault();
    if (submitButton.disabled) return;
    const data = new FormData(form);
    const payload = {
        author_name: data.get('author_name').trim(),
        content: data.get('content').trim(),
        tag: data.get('tag').trim() || undefined,
        is_anonymous: data.has('is_anonymous')
    };
    if (!payload.author_name || !payload.content) {
        composeStatus.textContent = 'Enter a display name and a message.';
        return;
    }

    loading(true);
    composeStatus.textContent = 'Sending your chirp…';
    let created;
    try {
        const response = await fetch(url(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'HTTP ' + response.status);
        created = result;
    } catch (error) {
        composeStatus.textContent = 'Could not post. ' + error.message;
        return;
    } finally {
        loading(false);
    }

    form.reset();
    composeStatus.textContent = 'Your chirp was posted.';
    try {
        chirpsContainer.prepend(renderCard(created));
    } catch {
        composeStatus.textContent = 'Your chirp was posted. Load the feed to see it.';
    }
}

function handleClick() {
    fetchChirps();
}

button.addEventListener('click', handleClick);
form.addEventListener('submit', handleSubmit);
