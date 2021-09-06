function onResponse(response){
    return response.json()
}
function onProducts(products){
    const main=document.querySelector('.productContainer')
    if(products.length>0){
        main.innerHTML=""
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
            if(profile){
                wishlistButton.addEventListener('click', addWishlist)
                if(product.wishlist==1){
                    wishlistButton.classList.add('wishlistRemoveButton')
                } else {
                    wishlistButton.classList.add('wishlistButton')
                }
            }
            const price=document.createElement('span')
            price.innerText=product.price+"€"
            const buttonContainer=document.createElement('div')
            buttonContainer.classList.add('productButtonsContainer')
            if(profile)buttonContainer.appendChild(wishlistButton)
            buttonContainer.appendChild(price)
            block.appendChild(buttonContainer)
            const quantity=document.createElement('p')
            quantity.innerText="Disponibilità: "+product.quantity
            block.appendChild(quantity)
            if(profile && product.quantity>0){
                const cartButton=document.createElement('p')
                cartButton.classList.add('addCart')
                cartButton.addEventListener('click',addCart)
                cartButton.innerText="Aggiungi al carrello"
                block.appendChild(cartButton)
            }
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
            main.appendChild(parentBlock)
        }
    } else {
        main.innerText="Nessun risultato"
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
        if(response.ok) fetch(app_url+"/searchProducts",data).then(onResponse).then(onProducts)
    })
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
const hiddenForm=document.querySelector('form.hidden')
const data={method:'POST', body: new FormData(hiddenForm)}
const profile=document.querySelector('nav .profileContainer')
form.q.value=hiddenForm.q.value
form.c.querySelector("option[value="+hiddenForm.c.value+"]").selected="selected"
if(form.c.value!=="all"){
    document.querySelector('#category').innerText="Categoria "+document.querySelector("#navCategories a[data-value="+form.c.value+"]").innerText
}
fetch(app_url+"/searchProducts",data).then(onResponse).then(onProducts)