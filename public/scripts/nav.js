function openNav(){
    const nav=document.querySelector('nav')
    nav.style.width="100vw"
    openNavButton.style.marginLeft="calc(100vw - 70px)"
    openNavButton.style.position="fixed"
    openNavButton.style.zIndex="2"
    document.body.style.overflow="hidden"
    openNavButton.removeEventListener('click',openNav)
    openNavButton.addEventListener('click',closeNav)
}

function closeNav(){
    const nav=document.querySelector('nav')
    nav.style.width=""
    openNavButton.style.position=""
    openNavButton.style.zIndex=""
    openNavButton.style.marginLeft="0px"
    document.body.style.overflow=""
    openNavButton.removeEventListener('click',closeNav)
    openNavButton.addEventListener('click',openNav)
}

const openNavButton=document.querySelector('#navOpen')
openNavButton.addEventListener('click',openNav)
