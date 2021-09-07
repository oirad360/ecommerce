function onResponse(response){
    return response.json()
}
function onProduct(json){
    container.innerHTML=""
    const block=document.createElement('div') 
    block.classList.add('horizontalBlock')
    const childBlock=document.createElement('div')
    childBlock.classList.add('block')
    childBlock.dataset.product_id=json.id
    const title=document.createElement('h3')
    title.innerText=json.title
    childBlock.appendChild(title)
    const img=document.createElement('img')
    if(json.image.substring(0,4)==="http") img.src=json.image
    else img.src=app_url+"/assets/"+json.image
    img.addEventListener('click', onThumbnailClick)
    childBlock.appendChild(img)
    const buttonContainer=document.createElement('div')
    if(document.querySelector('.profileContainer')){
        buttonContainer.classList.add('productButtonsContainer')
        const wishlistButton=document.createElement('div')
        wishlistButton.addEventListener('click',addWishlist)
        if(json.wishlist==1){
            wishlistButton.classList.add('wishlistRemoveButton')
        } else {
            wishlistButton.classList.add('wishlistButton')
        }
        buttonContainer.appendChild(wishlistButton)
    }
    const price=document.createElement('span')
    price.innerText=json.price+"€"
    buttonContainer.appendChild(price)
    childBlock.appendChild(buttonContainer)
    const quantity=document.createElement('p')
    quantity.innerText="Disponibilità: "+json.quantity
    childBlock.appendChild(quantity)
    if(json.quantity>0) {
        const cartButton=document.createElement('p')
        cartButton.innerText="Aggiungi al carrello"
        cartButton.addEventListener('click',addCart)
        cartButton.classList.add("addCart")
        childBlock.appendChild(cartButton)
    }
    const sideDesc=document.createElement('div')
    sideDesc.classList.add('sideDesc')
    const desc=document.createElement('p')
    desc.innerText=json.description
    const descTitle=document.createElement('h2')
    descTitle.innerText="Scheda tecnica"
    sideDesc.appendChild(descTitle)
    sideDesc.appendChild(desc)
    block.appendChild(childBlock)
    block.appendChild(sideDesc)
    container.appendChild(block)
}

function onReviews(json){
    const container=document.querySelector("#reviews")
    container.innerHTML=""
    if(json.disable){
        document.querySelector("#reviewArea").classList.add("hidden")
        document.querySelector("#writeReviewButton").classList.add("hidden")
    } else {
        document.querySelector("#writeReviewButton").classList.remove("hidden")
    }
    if(json.contents.length>0){
        let sum=0
        for(item of json.contents){
            const block=document.createElement('div')
            block.dataset.id=item.id
            block.classList.add("review")
            const profile=document.createElement('div')
            profile.classList.add("profile")
            const propic=document.createElement('div')
            propic.classList.add("propic")
            if(item.propic==="defaultAvatar.jpg"){
                propic.style="background-image: url("+app_url+"/assets/defaultAvatar.jpg);"
            } else {
                propic.style="background-image: url(/ecommerce/storage/app/propics/"+item.propic+");"
            }
            propic.addEventListener('click',onProPicClick)
            profile.appendChild(propic)
            const link=document.createElement('a')
            link.href=app_url+"/seller/"+item.username
            link.innerText=item.username
            profile.appendChild(link)
            const row=document.createElement('div')
            row.classList.add("row")
            row.appendChild(profile)
            const date=document.createElement('p')
            date.innerText=item.date
            row.appendChild(date)
            block.appendChild(row)
            const rating=document.createElement('img')
            rating.classList.add("rating")
            rating.src=app_url+"/assets/"+item.stars+".png"
            block.appendChild(rating)
            sum+=item.stars
            const desc=document.createElement('p')
            desc.innerText=item.text
            block.appendChild(desc)
            const likeBlock=document.createElement('div')
            likeBlock.classList.add("likeBlock")
            if(document.querySelector('.profileContainer')){
                const likeButton=document.createElement('div')
                if(item.youLike){
                    likeButton.classList.add('dislikeButton')
                    likeButton.addEventListener('click',dislike)
                } else {
                    likeButton.classList.add('likeButton')
                    likeButton.addEventListener('click',like)
                }
                likeBlock.appendChild(likeButton)
            }
            const likes=document.createElement('span')
            if(item.likes===1){
                likes.innerText=item.likes+" utente ha trovato utile questa recensione"
            } else {
                likes.innerText=item.likes+" utenti hanno trovato utile questa recensione"
            }
            if(item.likes!==0){
                likes.addEventListener('click', onLikeClick)
                likes.classList.add("hover")
            }
            likeBlock.appendChild(likes)
            block.appendChild(likeBlock)
            container.appendChild(block)

        }
        const average=sum/json.contents.length
        const averageRating=document.querySelector('#rating')
        if(json.contents.length>1){
            averageRating.innerText="Voto medio: "+average+"/5, "+json.contents.length+" recensioni."
        } else{
            averageRating.innerText="Voto medio: "+average+"/5, "+json.contents.length+" recensione."
        }
        document.querySelector('section').insertBefore(averageRating,container)
    } else {
        const p=document.createElement('p')
        p.innerText="Non è stata pubblicata nessuna recensione."
        container.appendChild(p)
    }
}

function addCart(event){
    fetch(app_url+"/addCart/"+event.currentTarget.parentNode.dataset.product_id+"/true").then(function(response){
        return response.text()
    }).then(function(text){
        const num=document.querySelector('#cart span')
        num.innerText=parseInt(num.innerText)+parseInt(text)
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
    const reviewArea=document.querySelector("#reviewArea")
    if(reviewArea.classList.contains("hidden")){
        reviewArea.classList.remove("hidden")
        writeReviewButton.innerText="Annulla"
    } else {
        reviewArea.classList.add("hidden")
        writeReviewButton.innerText="Scrivi una recensione"
        document.querySelector("textarea").value=""

    }
}

function postReview(event){
    event.preventDefault()
    if(reviewForm.reviewText.value!==""){
        const formData={method:'POST', body: new FormData(reviewForm)}
        fetch(app_url+"/reviews/postReview/"+product, formData).then(function(response){
            if(response.ok){
                fetch(app_url+"/reviews/fetchReviews/"+product).then(onResponse).then(onReviews)
            }
        })
    }
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
const sellerPropic=document.querySelector('#seller .propic')
sellerPropic.addEventListener('click', onProPicClick)
fetch(app_url+"/reviews/fetchProduct/"+product).then(onResponse).then(onProduct)
fetch(app_url+"/reviews/fetchReviews/"+product).then(onResponse).then(onReviews)