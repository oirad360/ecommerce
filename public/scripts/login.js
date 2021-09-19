function validazione(event){
    const errorphp=document.querySelector("#errorphp")
    errorphp.innerHTML=""
    const errors=document.querySelectorAll(".error")
    for(error of errors){
        if(!error.classList.contains("hidden")){
            event.preventDefault()
            break
        }
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