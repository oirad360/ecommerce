
function onResponse(response){
    return response.json()
}

function onProducts(products){
    const main=document.querySelector('#all')
    const wishlist=document.querySelector('#wishlist .productContainer')
    const soonAvailables=document.querySelector('#soonAvailables .productContainer')
    const lastAvailables=document.querySelector('#lastAvailables .productContainer')
    const newArrivals=document.querySelector('#newArrivals .productContainer')
    if(products.length>0){
        main.innerHTML=""
        wishlist.innerHTML=""
        soonAvailables.innerHTML=""
        lastAvailables.innerHTML=""
        newArrivals.innerHTML=""
        wishlist.parentNode.classList.add("hidden")
        soonAvailables.parentNode.classList.add("hidden")
        lastAvailables.parentNode.classList.add("hidden")
        newArrivals.parentNode.classList.add("hidden")
        for(const product of products){
            const block=document.createElement('div')
            block.classList.add('block')
            block.dataset.producer=product.producer
            block.dataset.category=product.category
            const title=document.createElement('h3')
            title.innerText=product.title
            block.appendChild(title)
            const img=document.createElement('img')
            if(product.image.substring(0,4)==="http") img.src=product.image
            else img.src=app_url+"/assets/"+product.image
            const link=document.createElement('a')
            link.href=app_url+"/reviews/"+product.id
            link.appendChild(img)
            block.appendChild(link)
            const wishlistButton=document.createElement('div')
            wishlistButton.addEventListener('click', addWishlist)
            if(product.wishlist==1){
                wishlistButton.classList.add('wishlistRemoveButton')
                wishlist.parentNode.classList.remove("hidden")
            } else {
                wishlistButton.classList.add('wishlistButton')
            }
            block.appendChild(wishlistButton)
            const price=document.createElement('span')
            price.innerText=product.price+"€"
            const buttonContainer=document.createElement('div')
            buttonContainer.classList.add('productButtonsContainer')
            buttonContainer.appendChild(wishlistButton)
            buttonContainer.appendChild(price)
            block.appendChild(buttonContainer)
            const quantity=document.createElement('p')
            quantity.innerText="Disponibilità: "+product.quantity
            block.appendChild(quantity)
            const cartButton=document.createElement('p')
            cartButton.classList.add('addCart')
            cartButton.addEventListener('click',addCart)
            cartButton.innerText="Aggiungi al carrello"
            block.appendChild(cartButton)
            const descButton=document.createElement('p')
            descButton.innerText="Scheda tecnica"
            descButton.classList.add('descButton')
            block.appendChild(descButton)
            descButton.addEventListener('click',showDesc)
            const desc=document.createElement('p')
            desc.innerText=product.description
            desc.classList.add('desc','hidden')
            const parentBlock=document.createElement('div')
            parentBlock.appendChild(block)
            parentBlock.appendChild(desc)
            parentBlock.dataset.product_id=product.id
            if(product.soonAvailables==1){
                soonAvailables.parentNode.classList.remove("hidden")
                soonAvailables.appendChild(parentBlock)
            } else main.appendChild(parentBlock)
            productsList.push(parentBlock)
            if(!profile) {
                cartButton.classList.add("hidden")
                wishlistButton.classList.add("hidden")
            }
            if(product.quantity==0) cartButton.classList.add("hidden")
            if(product.wishlist==1){
                const clone=parentBlock.cloneNode(true)
                clone.querySelector('.descButton').addEventListener('click',showDesc)
                clone.childNodes[0].childNodes[2].childNodes[0].addEventListener('click',addWishlist)
                clone.querySelector('.addCart').addEventListener('click',addCart)
                wishlist.appendChild(clone)
            }
            if(product.lastAvailables==1){
                lastAvailables.parentNode.classList.remove("hidden")
                const clone=parentBlock.cloneNode(true)
                clone.querySelector('.descButton').addEventListener('click',showDesc)
                clone.childNodes[0].childNodes[2].childNodes[0].addEventListener('click',addWishlist)
                clone.querySelector('.addCart').addEventListener('click',addCart)
                lastAvailables.appendChild(clone)
            }
            if(product.newArrivals==1){
                newArrivals.parentNode.classList.remove("hidden")
                const clone=parentBlock.cloneNode(true)
                clone.querySelector('.descButton').addEventListener('click',showDesc)
                clone.childNodes[0].childNodes[2].childNodes[0].addEventListener('click',addWishlist)
                clone.querySelector('.addCart').addEventListener('click',addCart)
                newArrivals.appendChild(clone)
            }
        }
    } else {
        main.innerText="Nessun risultato"
    }
}

function showDesc(event){
    const descButton=event.currentTarget
    const parentBlock=descButton.parentNode.parentNode
    const desc=parentBlock.querySelector('.desc')
    if(desc.classList.contains("hidden")){
        desc.classList.remove('hidden')
        descButton.innerText='Nascondi'
        parentBlock.childNodes[0].classList.add("noBorderBottomRadius")
    } else {
        desc.classList.add('hidden')
        descButton.innerText='Scheda tecnica'
        parentBlock.childNodes[0].classList.remove("noBorderBottomRadius")
    }
}

function addCart(event){
    fetch(app_url+"/addCart/"+event.currentTarget.parentNode.parentNode.dataset.product_id+"/true").then(function(response){
        return response.text()
    }).then(function(text){
        const num=document.querySelector('#cart span')
        num.innerText=parseInt(num.innerText)+parseInt(text)
    })
    
}

function addWishlist(event){
    const productID=event.currentTarget.parentNode.parentNode.parentNode.dataset.product_id
    let val
    if(event.currentTarget.classList.contains('wishlistButton')) val=true
    else val=false
    fetch(app_url+"/addWishlist/"+productID+"/"+val).then(function(response){
        if(response.ok) fetch(app_url+"/home/fetchProducts").then(onResponse).then(onProducts)
    })
}


const productsList=[]
const profile=document.querySelector('nav .profileContainer')
fetch(app_url+"/home/fetchProducts").then(onResponse).then(onProducts)