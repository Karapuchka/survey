const template = document.querySelector("#tem-list-quetion");
let newQuestion = document.getElementById('newQuestion');
let listQuetion = document.getElementById('listQuetion');
let newAnswerQuestion = document.getElementById('newAnswerQuestion');
const btnCreateQuestion = document.getElementById('btnCreateQuestion');

btnCreateQuestion.onclick = ()=>{
    let newItem = template.content.firstElementChild.cloneNode(true);
    let title = newItem.querySelector('.list-quetion__item__title');
    let text = newItem.querySelector('.list-quetion__item__text');

    title.setAttribute('id', `${newQuestion.value}`);
    title.setAttribute('name', `${newQuestion.value}`);
    title.setAttribute('value', `${newQuestion.value}`);
    
    text.setAttribute('id', `${newAnswerQuestion.value}`);
    text.setAttribute('name', `${newAnswerQuestion.value}`);
    text.setAttribute('value', `${newAnswerQuestion.value}`);
    
    listQuetion.appendChild(newItem);
}