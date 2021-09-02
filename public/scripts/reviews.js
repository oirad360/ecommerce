function onResponse(response){
    return response.json()
}
function onProduct(json){
    console.log(json)
    container.innerHTML=""
//carico il blocco del prodotto di cui sto guardando le recensioni, è uguale ai blocchi caricati in prodotti.js
        const blocco=document.createElement('div') 
            blocco.classList.add('horizontalBlock')
            const bloccoInterno=document.createElement('div')
            bloccoInterno.classList.add('block')
            const titolo=document.createElement('h3')
            titolo.innerText=json.title
            bloccoInterno.appendChild(titolo)
            const img=document.createElement('img')
            if(json.image.substring(0,4)==="http") img.src=json.image
            else img.src=app_url+"/assets/"+json.image
            bloccoInterno.appendChild(img)
            const bottoneWishlist=document.createElement('div')
            bottoneWishlist.addEventListener('click',addWishlist)
            if(json.wishlist==1){
                bottoneWishlist.classList.add('wishlistRemoveButton')
                bloccoInterno.appendChild(bottoneWishlist)
                console.log("ciao")
            } else {
                bottoneWishlist.classList.add('wishlistButton')
                bloccoInterno.appendChild(bottoneWishlist)
            }
            bloccoInterno.appendChild(bottoneWishlist)
            const prezzo=document.createElement('p')
            prezzo.innerText=json.price+"€"
            bloccoInterno.appendChild(prezzo)
            const bottoneCarrello=document.createElement('p')
            bloccoInterno.appendChild(bottoneCarrello)
            const bloccoScheda=document.createElement('div')
            bloccoScheda.classList.add('sideDesc'/*,'hidden'*/)//la descrizione deve essere invisibile sin dall'inizio, poichè deve essere mostrata solo al click del pulsante apposito
            const scheda=document.createElement('p')
            scheda.innerText=json.description
            const descrizione=document.createElement('h2')
            descrizione.innerText="Scheda tecnica"
            bloccoScheda.appendChild(descrizione)
            bloccoScheda.appendChild(scheda)
            blocco.appendChild(bloccoInterno)
            blocco.appendChild(bloccoScheda)
            if(json.quantity>0) {//se il prodotto non è disponibile o in arrivo non può essere aggiunto al carrello
                bottoneCarrello.innerText="Aggiungi al carrello"
                bottoneCarrello.addEventListener('click',addCart)
                bottoneCarrello.classList.add("addCart")
            }
            container.appendChild(blocco)
}

function onReviews(json){//carico tutte le recensioni di quel prodotto, se è presente una mia recensione elimino l'area per pubblicare una recensione (ognuno può pubblicare max 1 recensione)
    const container=document.querySelector("#reviews")
    container.innerHTML=""
    if(json.contents.length>0){
        let somma=0
        for(item of json.contents){
            if(json.disattivaRecensione){
                if(document.querySelector("#reviewArea") && document.querySelector("#writeReviewButton")){
                    document.querySelector("#reviewArea").remove()
                    document.querySelector("#writeReviewButton").remove()
                }
            }
            const blocco=document.createElement('div')
            blocco.dataset.id=item.id
            blocco.classList.add("review")
            const profile=document.createElement('div')
            profile.classList.add("profile")
            const propic=document.createElement('div')
            propic.classList.add("propic")
            if(item.propic==="defaultAvatar.jpg"){
                propic.style="background-image: url("+app_url+"/assets/defaultAvatar.jpg);"
            } else {
                propic.style="background-image: url("+app_url+"/uploads/"+item.propic+");"
            }
            propic.addEventListener('click',onProPicClick)
            profile.appendChild(propic)
            const link=document.createElement('a')
            link.href=app_url+"/seller/"+item.username
            const div=document.createElement('div')
            const user=document.createElement('p')
            user.innerText=item.username
            div.appendChild(user)
            if(item.impiego){
                const impiego=document.createElement('p')
                impiego.innerText=item.impiego
                div.appendChild(impiego)
            }
            link.appendChild(div)
            profile.appendChild(link)
            const riga=document.createElement('div')
            riga.classList.add("row")
            riga.appendChild(profile)
            const data=document.createElement('p')
            data.innerText=item.data
            riga.appendChild(data)
            blocco.appendChild(riga)
            const voto=document.createElement('img')
            voto.classList.add("rating")
            voto.src=app_url+"/assets/"+item.voto+".png"
            blocco.appendChild(voto)
            somma+=item.voto
            const descrizione=document.createElement('p')
            descrizione.innerText=item.descrizione
            descrizione.classList.add("desc")
            blocco.appendChild(descrizione)
            const bloccoLike=document.createElement('div')
            bloccoLike.classList.add("likeBlock")
            const bottoneLike=document.createElement('div')
            if(item.youLike){
                bottoneLike.classList.add('dislikeButton')
                bottoneLike.addEventListener('click',dislike)
            } else {
                bottoneLike.classList.add('likeButton')
                bottoneLike.addEventListener('click',like)
            }
            bloccoLike.appendChild(bottoneLike)
            const numLike=document.createElement('span')
            if(item.numLike===1){
                numLike.innerText=item.numLike+" utente ha trovato utile questa recensione"
            } else {
                numLike.innerText=item.numLike+" utenti hanno trovato utile questa recensione"
            }
            if(item.numLike!==0){
                numLike.addEventListener('click', onLikeClick)
                numLike.classList.add("hover")
            }
            bloccoLike.appendChild(numLike)
            blocco.appendChild(bloccoLike)
            container.appendChild(blocco)

        }
        const media=somma/json.contents.length
        const votoMedio=document.querySelector('#rating')
        if(json.contents.length>1){
            votoMedio.innerText="Voto medio: "+media+"/5, "+json.contents.length+" recensioni."
        } else{
            votoMedio.innerText="Voto medio: "+media+"/5, "+json.contents.length+" recensione."
        }
        document.querySelector('section').insertBefore(votoMedio,container)
    } else {
        const p=document.createElement('p')
        p.innerText="Non è stata pubblicata nessuna recensione."
        container.appendChild(p)
    }
}

function addCart(event){
    fetch(app_url+"/addCart/"+event.currentTarget.parentNode.dataset.product_id+"/true").then(function(response){
        if(response.ok){
            const num=document.querySelector('#cart span')
            num.innerText=parseInt(num.innerText)+1
        }
    })
}

function addWishlist(event){
    const productID=event.currentTarget.parentNode.parentNode.dataset.product_id
    let val
    if(event.currentTarget.classList.contains('wishlistButton')) val=true
    else val=false
    fetch(app_url+"/addWishlist/"+productID+"/"+val).then(function(response){
        if(response.ok) fetch(app_url+"/reviews/fetchProduct/"+product).then(onResponse).then(onProduct)
    })
}


function showReviewArea(){
    const areaRecensione=document.querySelector("#areaRecensione")
    if(areaRecensione.classList.contains("hidden")){
        areaRecensione.classList.remove("hidden")
        bottoneRecensione.innerText="Annulla"
    } else {
        areaRecensione.classList.add("hidden")
        bottoneRecensione.innerText="Scrivi una recensione"
        document.querySelector("textarea").value=""
        formRecensione.voto.value=1

    }
}

function postReview(event){
    event.preventDefault()
    const error=document.querySelector(".error")
    if(formRecensione.testoRecensione.value!==""){//se l'area di testo per la recensione non è vuota passo alla fetch per pubblicare la recensione, altrimenti dò errore
        error.classList.add("hidden")
        const formData={method:'POST', body: new FormData(formRecensione)}
        fetch(app_url+"/reviews/postReview/"+product, formData).then(function(response){
            if(response.ok){
                fetch(app_url+"/reviews/fetchReviews/"+product).then(onResponse).then(onReviews)
            }
        })
    } else {
        error.classList.remove("hidden")
    }
}

function deleteError(){
    document.querySelector(".error").classList.add("hidden")
}

function like(event){
    const id=event.currentTarget.parentNode.parentNode.dataset.id
    fetch(app_url+"/like/"+id).then(function(response){
        if(response.ok){
            fetch(app_url+"/reviews/fetchReviews/"+product).then(onResponse).then(onReviews)
        }
    })
}
function dislike(event){
    const id=event.currentTarget.parentNode.parentNode.dataset.id
    fetch(app_url+"/dislike/"+id).then(function(response){
        if(response.ok){
            fetch(app_url+"/reviews/fetchReviews/"+product).then(onResponse).then(onReviews)
        }
    })
}

const container=document.querySelector("#mainSection .productContainer")
const product=document.querySelector('#mainSection').dataset.product_id
const writeReviewButton=document.querySelector('#writeReviewButton')
writeReviewButton.addEventListener('click',showReviewArea)
const reviewForm=document.forms['reviewForm']
reviewForm.addEventListener('submit',postReview)
reviewForm.reviewText.addEventListener('blur',deleteError)
fetch(app_url+"/reviews/fetchProduct/"+product).then(onResponse).then(onProduct)
fetch(app_url+"/reviews/fetchReviews/"+product).then(onResponse).then(onReviews)
