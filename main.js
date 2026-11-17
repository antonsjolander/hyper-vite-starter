import {pokemon} from '/test.js';

const title = document.querySelector("#title");

const fetchData = async () => {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon-species/aegislash')
    const data = await response.json();

    return data;
}

const data = await fetchData(); 


console.log(data);

// const dataArr = [
//     {id: 1},
//     {id: 2}, 
//     {id: 3}
// ];
// dataArr.forEach((item, i) => {
//     const div = document.createElement('div');
//     div.textContent = `this is item number ${i} with the id ${item.id}`
//     document.body.append(div);
// })

// for (let i = 0; i < dataArr.length; i++) {
//     const item = dataArr[i]
//     const div = document.createElement('div');
//     div.textContent = `this is item number ${i} with the id ${item.id}`
//     document.body.append(div);
// }

title.textContent = "Hello, Vite! " + data.name;
