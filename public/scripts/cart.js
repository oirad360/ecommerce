function onResponse(response){
    return response.json()
}

function onCart(products){
    const main=document.querySelector('main')
    main.innerHTML=""
    const cartTotal=document.querySelector('#cart span')
    let num=0
    let bill=0
    const total=document.querySelector("#total")
    if(products.length>0){
        buyButton.classList.remove("hidden")
        for(product of products){
            num+=parseInt(product.cart)
            const block=document.createElement('div')
            block.classList.add('block')
            block.dataset.product_id=product.product_id
            const title=document.createElement('h3')
            title.innerText=product.title
            block.appendChild(title)
            const img=document.createElement('img')
            if(product.image.substring(0,4)==="http") img.src=product.image
            else img.src=app_url+"/assets/"+product.image
            const link=document.createElement('a')
            link.href=app_url+"/reviews/"+product.product_id
            link.appendChild(img)
            block.appendChild(link)
            const price=document.createElement('span')
            price.innerText=product.price+"€"
            block.appendChild(price)
            const available=document.createElement('p')
            available.innerText="Disponibilità: "+product.quantity
            block.appendChild(available)
            const buttonsContainer=document.createElement('div')
            buttonsContainer.classList.add("productButtonContainer")
            const decrement=document.createElement('button')
            decrement.innerText="-"
            decrement.classList.add("decrement")
            decrement.addEventListener('click',addCart)
            buttonsContainer.appendChild(decrement)
            const increment=document.createElement('button')
            increment.innerText="+"
            increment.classList.add("increment")
            increment.addEventListener('click',addCart)
            buttonsContainer.appendChild(increment)
            block.appendChild(buttonsContainer)
            const quantity=document.createElement('p')
            quantity.innerText=product.cart
            block.appendChild(quantity)
            const parentBlock=document.createElement('div')
            parentBlock.appendChild(block)
            main.appendChild(parentBlock)
            bill+=product.price*product.cart
        }
        total.innerText="Totale: "+bill+"€"
    }else{
        total.innerText=""
        buyButton.classList.add("hidden")
        const p=document.createElement('p')
        p.innerText="Non hai prodotti nel carrello."
        main.appendChild(p)
    }
    cartTotal.innerText=num
}


function addCart(event){
    const productID=event.currentTarget.parentNode.parentNode.dataset.product_id
    let val
    if(event.currentTarget.innerText==="+") val=true
    else val=false
    fetch(app_url+"/addCart/"+productID+"/"+val).then(function(response){
        if(response.ok){
            fetch(app_url+"/cart/fetchCart").then(onResponse).then(onCart)
        }
    })
}

function buy(){
    fetch(app_url+"/cart/buy").then(function(response){
        if(response.ok){
            const title=document.querySelector('#description').innerText
            const username=title.substring(12,title.length)
            window.location.replace(app_url+"/seller/"+username)
        }
    })
}

fetch(app_url+"/cart/fetchCart").then(onResponse).then(onCart)
const buyButton=document.querySelector("#buy")
buyButton.addEventListener('click', buy)