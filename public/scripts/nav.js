function openNav(){
    const nav=document.querySelector('nav')
    nav.style.width="100vw"
    openNavButton.classList.add("hidden")
}

function closeNav(){
    const nav=document.querySelector('nav')
    nav.style.width=""
    openNavButton.classList.remove("hidden")
}

const openNavButton=document.querySelector('#navOpen')
const closeNavButton=document.querySelector('#navClose')
openNavButton.addEventListener('click',openNav)
closeNavButton.addEventListener('click',closeNav)