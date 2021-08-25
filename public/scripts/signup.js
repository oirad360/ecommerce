function validazione(event){
    const errorphp=document.querySelector("#errorphp")
    errorphp.innerHTML=""
    const errors=document.querySelectorAll(".error")
    for(error of errors){
        if(!error.classList.contains("hidden")){//se ci sono errori faccio prevent default, cioè non mando i dati al php per registrarmi
            event.preventDefault()
            break
        }
    }
}

function checkNome(event){
    const errors=document.querySelectorAll("#nome .error")
    if(event.currentTarget.value==="") {
        errors[0].classList.remove("hidden")
    }else{
        errors[0].classList.add("hidden")
    }
    if(/[^a-z]/i.test(event.currentTarget.value)){ //if(contiene numeri o simboli) mostra errore
        errors[1].classList.remove("hidden")
    } else {
        errors[1].classList.add("hidden")
    }
}

function checkCognome(event){
    const errors=document.querySelectorAll("#cognome .error")
    if(event.currentTarget.value==="") {
        errors[0].classList.remove("hidden")
    }else{
        errors[0].classList.add("hidden")
    }
    if(/[^a-z]/i.test(event.currentTarget.value)){
        errors[1].classList.remove("hidden")
    } else {
        errors[1].classList.add("hidden")
    }
}

function onResponse(response){
    return response.text()
}

function onTextUsername(text){
    const errors=document.querySelectorAll("#username .error")
    if(text==1){//torna 1 nel caso in cui l'username sia già stato utilizzato
        errors[2].classList.remove("hidden")
    } else {
        errors[2].classList.add("hidden")
    }
}

function onTextEmail(text){
    const errors=document.querySelectorAll("#email .error")
    if(text==1){//torna 1 nel caso in cui l'email sia già stata utilizzata
        errors[2].classList.remove("hidden")
    } else {
        errors[2].classList.add("hidden")
    }
}

function checkUsername(event){
    const errors=document.querySelectorAll("#username .error")
    let flag=false
    if(event.currentTarget.value==="") {
        errors[0].classList.remove("hidden")
        flag=true
    }else{
        errors[0].classList.add("hidden")
    }
    if(!/^[a-z0-9]+$/i.test(event.currentTarget.value) && event.currentTarget.value!==""){ //if (not(contiene solo valori alfanumerici) AND il campo è non vuoto) rimuovi hidden, altrimenti aggiungilo
        errors[1].classList.remove("hidden")
        flag=true
    } else {
        errors[1].classList.add("hidden")
    }
    if(!flag){
        fetch(app_url+"/signup/checkUsername/"+event.currentTarget.value).then(onResponse).then(onTextUsername)
    }
}

function checkEmail(event){
    const errors=document.querySelectorAll("#email .error")
    let flag=false;
    if(event.currentTarget.value==="") {//se il campo email è vuoto mostro l'errore
        errors[0].classList.remove("hidden")
        flag=true
    }else{
        errors[0].classList.add("hidden")
    }
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if(!re.test(event.currentTarget.value.toLowerCase()) && event.currentTarget.value!==""){ //if(not(email valida) AND non vuota) togli hidden
        errors[1].classList.remove("hidden")
        flag=true
    } else {
        errors[1].classList.add("hidden")
    }
    if(!flag){//se non ci sono stati errori passo alla fetch che controlla se l'email che ho inserito non sia già stata utilizzata
        fetch(app_url+"/signup/checkEmail/"+event.currentTarget.value).then(onResponse).then(onTextEmail)
    }
}

function checkPassword(event){
    const errors=document.querySelectorAll("#password .error")
    if(event.currentTarget.value==="") {
        errors[0].classList.remove("hidden")
    }else{
        errors[0].classList.add("hidden")
    }
    if(event.currentTarget.value.length<8 && event.currentTarget.value!==""){
        errors[1].classList.remove("hidden")
    } else {
        errors[1].classList.add("hidden")
    }
    if(!/[a-zA-Z]/g.test(event.currentTarget.value) && event.currentTarget.value!==""){ //if(not(contiene lettere) AND non vuota) togli hidden
        errors[2].classList.remove("hidden")
    } else {
        errors[2].classList.add("hidden")
    }
    if(!/[^a-z]/i.test(event.currentTarget.value) && event.currentTarget.value!==""){ //if(not(contiene numeri) AND non vuota) togli hidden
        errors[3].classList.remove("hidden")
    } else {
        errors[3].classList.add("hidden")
    }
    const error=document.querySelector("#confermaPass .error")
    if(form.confermaPass.value!=="" && event.currentTarget.value!==form.confermaPass.value){
        error.classList.remove("hidden")
    } else {
        error.classList.add("hidden")
    }
}

function checkConfermaPass(event){
    const error=document.querySelector("#confermaPass .error")
    if(form.confermaPass.value!==""){
        if(event.currentTarget.value!==form.password.value){
            error.classList.remove("hidden")
        } else {
            error.classList.add("hidden")
        }
    }
}
/* 
function checkAssunzione(event){
    const date = new Date();
    const month = String(date.getMonth()+1).padStart(2,'0')//aggiunge 0 all'inizio della stringa finchè la lunghezza totale è pari a 2 
                                                        //(in pratica se il mese è 3 lo fa diventare 03, se è 10,11 o 12 restano così)
    const day = String(date.getDate()).padStart(2,'0')
    const today = date.getFullYear()+'-'+month+'-'+day
    const error=document.querySelector("#assunzione .error")
    if(event.currentTarget.value>today) {
        error.classList.remove("hidden")
    }else{
        error.classList.add("hidden")
    }
}

function checkStipendio(event){
    const errors=document.querySelectorAll("#stipendio .error")
    if(event.currentTarget.value==="") {
        errors[0].classList.remove("hidden")
    }else{
        errors[0].classList.add("hidden")
    }
    if(!/^\d+$/.test(event.currentTarget.value) && event.currentTarget.value!=="") { //if(non è un numero AND è non vuoto) togli hidden
        errors[1].classList.remove("hidden")
    }else{
        errors[1].classList.add("hidden")
    }
}

function checkType(event){ //se è selezionato l'input di tipo radio "impiegato" allora vengono mostrati campi in più nel form, altrimenti solo i campi necessari per la registrazione del cliente
    const value=event.currentTarget.value
    const labels = form.querySelectorAll(".impiegato");
    if(value==="impiegato"){
        for(label of labels){
            label.classList.remove("hidden")
        }
    } else if(value==="cliente") {
        for(label of labels){
            label.classList.add("hidden")
        }
    }
}
 */
function checkImage(){
    const imageSize=form.image.files[0].size
    const imageExt=form.image.files[0].name.split(".").pop()
    const errors=document.querySelectorAll("#image .error")
    if(imageSize>2000000){
        errors[0].classList.remove("hidden")
    } else {
        errors[0].classList.add("hidden")
    }
    if(!["jpeg","jpg","gif","png"].includes(imageExt)){
        errors[1].classList.remove("hidden")
    } else {
        errors[1].classList.add("hidden")
    }
}


const form=document.forms['form']
form.nome.addEventListener('blur',checkNome)
form.cognome.addEventListener('blur',checkCognome)
form.username.addEventListener('blur',checkUsername)
form.email.addEventListener('blur',checkEmail)
form.password.addEventListener('blur',checkPassword)
form.confermaPass.addEventListener('blur',checkConfermaPass)
form.dataAssunzione.addEventListener('blur',checkAssunzione)
form.stipendio.addEventListener('blur',checkStipendio)
form.image.addEventListener('change',checkImage)
form.addEventListener('submit', validazione)
const radios = form.elements['tipo'] //prendo i 2 input di tipo radio
for(radio of radios){
    radio.addEventListener('click',checkType)
}

if(radios[1].checked===true){
    const labels=document.querySelectorAll(".impiegato")
    for(label of labels){
        label.classList.remove("hidden")
    }
}