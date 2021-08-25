function validazione(event){
    event.preventDefault()
    const errorphp=document.querySelector("#errorphp")
    errorphp.innerHTML=""
    const errors=document.querySelectorAll(".error")
    let flag=false
    for(error of errors){
        if(!error.classList.contains("hidden")){//verifico la presenza di errori, imposto un flag nel caso siano presenti
            flag=true;
            break;
        }
    }
    if(form.user.value==="" || form.password.value===""){//se tutti i campi sono vuoti mostro l'errore e il flag
        document.querySelector("#compila").classList.remove("hidden")
        flag=true;
    } else {
        document.querySelector("#compila").classList.add("hidden")
    }
    if(!flag){ //se non ci sono errori procedo inviando i dati a php
        const formData={method:'POST', body: new FormData(form)}
        fetch(app_url+"/login/check", formData).then(onResponse).then(onText)
    }
}

function onResponse(response){
    return response.text()
}

function onText(text){
    const error=document.querySelector("#errorLogin")
    if(text==1){//se il risultato è 1 vuol dire che ci sono errori
        error.classList.remove("hidden")
    } else {//altrimenti posso andare alla home page
        error.classList.add("hidden")
        window.location.replace("home")
    }
}



function checkUser(event){
    document.querySelector("#compila").classList.add("hidden")
    const error=document.querySelector("#user")
    if(event.currentTarget.value==="") {
        error.classList.remove("hidden")
    }else{
        error.classList.add("hidden")
    }
}

function checkPassword(event){
    document.querySelector("#compila").classList.add("hidden")
    const error=document.querySelector("#password")
    if(event.currentTarget.value==="") {
        error.classList.remove("hidden")
    }else{
        error.classList.add("hidden")
    }
}

const form =document.forms['form']
form.user.addEventListener('blur',checkUser)
form.password.addEventListener('blur',checkPassword)
form.addEventListener('submit', validazione)