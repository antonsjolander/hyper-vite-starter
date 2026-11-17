const title = document.querySelector("#title");

title.textContent = "Hello, Vite!";
const main =  document.querySelector("main")

const createFeed = () => {
    const div = document.createElement('div')
    div.classList.add('feed')

    return div;
}

main.append(createFeed());