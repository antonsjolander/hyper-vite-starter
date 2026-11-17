const title = document.querySelector("#title");


const chirp = (name, text) => {
    const div = document.createElement('div')
    div.classList.add('chirp')
    const title = document.createElement('h3')
    const textTag = document.createElement('p')
    title.textContent = name;
    textTag.textContent = text;
    div.append(title)
    div.append(textTag)
    return div
}

document.body.append(chirp('anton', 'hejhopp'));