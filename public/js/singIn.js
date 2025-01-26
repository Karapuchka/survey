const fromLogin = document.forms.loginUser;
let btnEye = document.getElementById('js-eye-passwd');

fromLogin.elements.btnLogin.onclick = (e)=>{

    for (let i = 0; i < fromLogin.elements.length - 1; i++) {
        if(fromLogin.elements[i].value == ''){
            e.preventDefault();
            gsap.to(fromLogin.elements[i], {boxShadow: '0 0 10px red'}, {duration: .4})
            gsap.to(fromLogin.elements[i].parentNode.children[0], {color: 'red'}, {duration: .4})
        };        
    };
};

for (let i = 0; i < fromLogin.elements.length - 1; i++) {
    fromLogin.elements[i].oninput = (e)=>{
        fromLogin.elements[i].style.boxShadow = 'none';
        fromLogin.elements[i].parentNode.children[0].style.color = 'black';
    };
};

btnEye.onclick = ()=>{
    if(btnEye.getAttribute('src') == '/img/eye_open.png'){
        btnEye.setAttribute('src', '/img/eye_close.png'); //Меняем иконку
        fromLogin.elements[1].setAttribute('type', 'password') //Меняем тип input
    } else {
        btnEye.setAttribute('src', '/img/eye_open.png'); //Меняем иконку
        fromLogin.elements[1].setAttribute('type', 'text') //Меняем тип input
    }
};