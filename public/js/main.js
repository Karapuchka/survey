const bntWinAddClose = document.getElementById('js-w-add-btn-close');
const bntWinUpClose = document.getElementById('js-w-up-btn-close');
const bntOpenWinAdd = document.getElementById('js-open-win-add');
const btnAddTask = document.getElementById('js-bnt-add-task');
const titleAddTask = document.getElementById('js-input-title');
const timeAddTask = document.getElementById('js-input-time');
const btnUpTask = document.getElementById('js-bnt-up-task');
const titleUpTask = document.getElementById('js-up-input-title');
const timeUpTask = document.getElementById('js-up-input-time');


let winAdd = document.getElementById('js-win-close');
let winUp = document.getElementById('js-win-up');
let listTask = document.getElementById('js-list-tasks');

const clickInputStyleRemove = (e)=>{
    gsap.to(e, {boxShadow: 'none'}, {duration: .4})
};

const clickInputStyleAdd = (e)=>{
    gsap.to(e, {boxShadow: '0 0 10px red'}, {duration: .4})
};


bntWinAddClose.onclick = ()=>{
    winAdd.style.display = 'none';
};

bntOpenWinAdd.onclick = ()=>{
    winAdd.style.display = 'flex';
};

bntWinUpClose.onclick = ()=>{
    winUp.style.display = 'none';
};

btnAddTask.onclick = async ()=>{
    if(titleAddTask.value == '' || timeAddTask == ''){
        alert('Заполните поля!');

        clickInputStyleAdd(titleAddTask);
        return clickInputStyleAdd(timeAddTask);

    }else if(titleAddTask.value == ''){
        alert('Укажите заголовок!');

        return clickInputStyleAdd(titleAddTask);

    }else if(timeAddTask.value == ''){
        alert('Укажите дату!');

        return clickInputStyleAdd(timeAddTask);
    }

    let res = await fetch('/adding-task', {
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({
            'title': titleAddTask.value,
            'time': timeAddTask.value,
        }),
    });

    let text = await res.text();

    alert(text);

    location.href = location.href;
};

titleAddTask.onclick = clickInputStyleRemove(titleAddTask);
timeAddTask.onclick = clickInputStyleRemove(timeAddTask);

listTask.onclick = async (e)=>{
    if(e.target.classList.contains('task__item__btns__btn__del') || e.target.parentElement.classList.contains('task__item__btns__btn__del') || e.target.parentElement.parentElement.classList.contains('task__item__btns__btn__del')){
        let idTask = '';

        if(e.target.classList.contains('task__item__btns__btn__del')) idTask = e.target.dataset.id;
        else if (e.target.parentElement.classList.contains('task__item__btns__btn__del')) idTask = e.target.parentElement.dataset.id;
        else if (e.target.parentElement.parentElement.classList.contains('task__item__btns__btn__del')) idTask = e.target.parentElement.parentElement.dataset.id;
        
        let res = await fetch('/del-task', {
            headers: {'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({
                'id': idTask,
            }),
        });

        let text = await res.text();

        alert(text);        

        location.href = location.href;   
    };

    if(e.target.classList.contains('task__item__btns__btn__update') || e.target.parentElement.classList.contains('task__item__btns__btn__update') || e.target.parentElement.parentElement.classList.contains('task__item__btns__btn__update')){
        winUp.style.display = 'flex';

        btnUpTask.onclick = async ()=>{
            let idTask = '';

            if(e.target.classList.contains('task__item__btns__btn__update')) idTask = e.target.dataset.id;
            else if (e.target.parentElement.classList.contains('task__item__btns__btn__update')) idTask = e.target.parentElement.dataset.id;
            else if (e.target.parentElement.parentElement.classList.contains('task__item__btns__btn__update')) idTask = e.target.parentElement.parentElement.dataset.id;
    
    
    
            let res = await fetch('/up-task', {
                headers: {'Content-Type': 'application/json'},
                method: 'POST',
                body: JSON.stringify({
                    'id': idTask,
                    'title': titleUpTask.value,
                    'time': timeUpTask.value,
                }),
            });
    
            let text = await res.text();
    
            alert(text);
    
            location.href = location.href;   
        }
    };
};