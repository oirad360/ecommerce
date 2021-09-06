function onResponse(response){
    return response.json()
}
function onProPicClick(event){
    const imageURL=event.currentTarget.style.backgroundImage.slice(5,event.currentTarget.style.backgroundImage.length-2)
    const image=document.createElement('img')
    image.src=imageURL
    document.body.classList.add('noScroll')
    modalView.style.top=window.pageYOffset + 'px'
    modalView.appendChild(image)
    modalView.classList.remove('hidden')
}

function onThumbnailClick(event) {
    const image = document.createElement('img')
    image.src=event.currentTarget.src
    document.body.classList.add('noScroll')
    modalView.style.top = window.pageYOffset + 'px'
    modalView.appendChild(image)
    modalView.classList.remove('hidden')
}

function onLikeClick(event){
    let id
    if(document.querySelector("#mainSection").dataset.product_id) id=event.currentTarget.parentNode.parentNode.dataset.id
    else id=event.currentTarget.parentNode.parentNode.parentNode.dataset.id
    fetch(app_url+"/fetchLikes/"+id).then(onResponse).then(onJsonUtentiLike)
}

function onJsonUtentiLike(json){ //ottengo tutti gli utenti che hanno messo like alla recensione clickata
    if(json){
        modalView.style.top=window.pageYOffset+'px'
        modalView.classList.remove('hidden')
        document.body.classList.add('noScroll')
        const likeContainer=document.createElement('div')
        for(item of json){
            likeContainer.classList.add("likeContainer")
            const user=document.createElement('div')
            user.classList.add('profile')
            const propic=document.createElement('div')
            propic.classList.add('propic')
            if(item.propic==="defaultAvatar.jpg"){
                propic.style="background-image: url("+app_url+"/assets/defaultAvatar.jpg);"
            } else {
                propic.style="background-image: url(/ecommerce/storage/app/propics/"+item.propic+");"
            }
            user.appendChild(propic)
            const link=document.createElement('a')
            link.href=app_url+"/seller/"+item.username
            link.innerText=item.username
            user.appendChild(link)
            likeContainer.appendChild(user)
            modalView.appendChild(likeContainer)
        }
    }
}

function onModalClick() {
    document.body.classList.remove('noScroll')
    modalView.classList.add('hidden')
    modalView.innerHTML = ''
}


const modalView = document.querySelector('#modal')
modalView.addEventListener('click', onModalClick)
const propic=document.querySelectorAll('.propic')
/* for(item of propic){
    item.addEventListener('click',onProPicClick)
} */
