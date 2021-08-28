function onResponse(response){
    return response.json()
}
function onResponseText(response){
    return response.text()
}

function showForm(){
    if(newProductForm.classList.contains("hidden")) {
        newProductForm.classList.remove("hidden")
        newProductButton.innerText="Annulla"
    } else{
        newProductForm.classList.add("hidden")
        newProductButton.innerText="Inserisci un nuovo prodotto"
    }
}

function checkImage(){
    const imageSize=newProductForm.image.files[0].size
    const imageExt=newProductForm.image.files[0].name.split(".").pop()
    const sizeError=document.querySelector('#sizeError')
    const formatError=document.querySelector('#formatError')
    if(imageSize>2000000){
        sizeError.classList.remove("hidden")
    } else {
        sizeError.classList.add("hidden")
    }
    if(!["jpeg","jpg","png"].includes(imageExt)){
        formatError.classList.remove("hidden")
    } else {
        formatError.classList.add("hidden")
    }
}

function check(event){
    switch(event.currentTarget.name){
        case "title":
            const titleError=document.querySelector('#titleError')
            if(event.currentTarget.value==="") titleError.classList.remove("hidden")
            else titleError.classList.add("hidden")
        break
        case "price":
            const priceError=document.querySelector('#priceError')
            if(event.currentTarget.value<=0) priceError.classList.remove("hidden")
            else priceError.classList.add("hidden")
        break
        case "quantity":
            const quantityError=document.querySelector('#quantityError')
            if(event.currentTarget.value<1) quantityError.classList.remove("hidden")
            else quantityError.classList.add("hidden")
        break
        case "producer":
            const producerError=document.querySelector('#producerError')
            if(event.currentTarget.value==="") producerError.classList.remove("hidden")
            else producerError.classList.add("hidden")
        break
    }
}

function changeImgOption(){
    if(newProductForm.imgOption.value==="upload"){
        newProductForm.image.classList.remove("hidden")
        newProductForm.url.classList.add("hidden")
    }else{
        newProductForm.image.classList.add("hidden")
        newProductForm.url.classList.remove("hidden")
    }
}

function newProduct(event){
    event.preventDefault()
    const errors=document.querySelectorAll('error')
    let flag=false
    for(const error of errors){
        if(!error.classList.contains("hidden")){
            flag=true
            break
        }
    }
    if(!flag&&newProductForm.producer.value!==""&&newProductForm.title.value!==""&&newProductForm.price.value>0) {
        newProductForm.removeEventListener('submit',newProduct)
        const formData={method:'post',body: new FormData(newProductForm)}
        newProductForm.send.value="     "
        newProductForm.send.style.backgroundImage="url(../assets/loading.gif)"
        fetch(app_url+"/seller/newProduct",formData).then(function(response){
            if(response.ok) fetch(app_url+"/fetchProducts").then(onResponse).then(onJsonProducts)
        })
    }
}
/* 
function onJsonNewProduct(json){
    if(json.errors){
        const errorContainer=document.querySelector('#errorsPhp')
        console.log(json.errors)
        for(const error of json.errors){
            if(error.image){
                for(const imgError of error.image){
                    const msg=document.createElement('span')
                    msg.innerText=imgError
                    msg.classList.add("error")
                    errorContainer.appendChild(msg)
                }
            } else {
                const msg=document.createElement('span')
                msg.innerText=error
                msg.classList.add("error")
                errorContainer.appendChild(msg)
            }
        }
    } else {
        const text=document.querySelector('#yourProducts')
        text.innerText="I tuoi prodotti"
        const container=document.querySelector('.productContainer')
        newProductForm.send.value="Invia"
        newProductForm.send.style.backgroundImage=""
        const block=document.createElement('div')
        block.classList.add('block')
        const title=document.createElement('h1')
        title.innerText=json.title
        block.appendChild(title)
        const img=document.createElement('img')
        if(json.image.substring(0,4)==="http") img.src=json.image
        else img.src=app_url+"/assets/"+json.image
        const link=document.createElement('a')
        link.href=app_url+"/reviews/"+json.title
        link.appendChild(img)
        block.appendChild(link)
        const price=document.createElement('p')
        price.innerText=json.price+"€"
        block.appendChild(price)
        const descButton=document.createElement('p')
        descButton.innerText="Scheda tecnica"
        descButton.classList.add('descButton')
        block.appendChild(descButton)
        descButton.addEventListener('click',showDesc)
        const desc=document.createElement('p')
        desc.innerText=json.description
        desc.classList.add('desc','hidden')//la descrizione deve essere invisibile sin dall'inizio, poichè deve essere mostrata solo al click del pulsante apposito
        const parentBlock=document.createElement('div')
        parentBlock.appendChild(block)
        parentBlock.appendChild(desc)
        container.appendChild(parentBlock) //appendo il blocco nel div Main (contiente tutti i prodotti)
        newProductForm.addEventListener('submit',newProduct)
    }
}
 */
function onJsonProducts(json){
    newProductForm.send.value="Invia"
    newProductForm.send.style.backgroundImage=""
    if(json.errors){
        const errorContainer=document.querySelector('#errorsPhp')
        console.log(json.errors)
        for(const error of json.errors){
            if(error.image){
                for(const imgError of error.image){
                    const msg=document.createElement('span')
                    msg.innerText=imgError
                    msg.classList.add("error")
                    errorContainer.appendChild(msg)
                }
            } else {
                const msg=document.createElement('span')
                msg.innerText=error
                msg.classList.add("error")
                errorContainer.appendChild(msg)
            }
        }
    }else if(json.length>0){
        const container=document.querySelector('.productContainer')
        container.innerHTML=""
        for(const item of json){
            const block=document.createElement('div')
            block.dataset.product_id=item.id
            block.classList.add('block')
            const title=document.createElement('h1')
            title.innerText=item.title
            block.appendChild(title)
            const img=document.createElement('img')
            if(item.image.substring(0,4)==="http") img.src=item.image
            else img.src=app_url+"/assets/"+item.image
            const link=document.createElement('a')
            link.href=app_url+"/reviews/"+item.title
            link.appendChild(img)
            block.appendChild(link)
            const price=document.createElement('p')
            price.innerText=item.price+"€"
            block.appendChild(price)
            const quantity=document.createElement('p')
            quantity.innerText="Disponibilità: "+item.quantity
            block.appendChild(quantity)
            const descButton=document.createElement('p')
            descButton.innerText="Scheda tecnica"
            descButton.classList.add('descButton')
            block.appendChild(descButton)
            descButton.addEventListener('click',showDesc)
            const desc=document.createElement('p')
            desc.innerText=item.description
            desc.classList.add('desc','hidden')
            const parentBlock=document.createElement('div')
            parentBlock.appendChild(block)
            parentBlock.appendChild(desc)
            container.appendChild(parentBlock)
        }
        newProductForm.classList.add("hidden")
        newProductButton.innerText="Inserisci un nuovo prodotto"
    } else {
        const text=document.querySelector('#yourProducts')
        text.innerText="Non hai nessun prodotto in vendita"
    }
}

function showDesc(event){
    const descButton=event.currentTarget
    const parentBlock=descButton.parentNode.parentNode //tramite il currentTarget (bottone appena premuto) risalgo all'intero blocco del prodotto utilizzando parentNode e lo salvo in una costante
    const desc=parentBlock.querySelector('.desc') //ottengo la scheda tecnica del prodotto grazie a una query nel blocco
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
function showMenu(){
    const newLayoutButton=document.querySelector('#newLayoutButton')
    if(layoutMenu.classList.contains("hidden")){
        newLayoutButton.innerText="Annulla"
        layoutMenu.classList.remove("hidden")
        layoutContainer.classList.remove("hidden")
    }
    else {
        newLayoutButton.innerText="Crea un nuovo layout"
        layoutMenu.classList.add("hidden")
        layoutContainer.classList.add("hidden")
    }
}
function onLayoutID(layoutID){
    console.log(layoutID)
    const section=document.querySelector('section')
    if(layoutID==="error" && newProductForm){
        const newLayoutButton=document.querySelector('#newLayoutButton')
        newLayoutButton.classList.remove("hidden")
        saveButton=document.createElement('button')
        saveButton.innerText="Salva"
        saveButton.addEventListener('click', saveLayout)
        layoutCreator=new LayoutCreator(saveButton,"600px","100%")
        layoutMenu=layoutCreator.getLayoutMenu()
        layoutContainer=layoutCreator.getLayoutContainer()
        newLayoutButton.addEventListener('click',showMenu)
        section.appendChild(layoutMenu)
        section.appendChild(layoutContainer)
        layoutMenu.classList.add("hidden")
        layoutContainer.classList.add("hidden")
    } else if(layoutID==="error" && !newProductForm){
        const msg=document.createElement('p')
        msg.innerText="Nessun risultato trovato"
        section.appendChild(msg)
    } else if(layoutID!=="error" && newProductForm){
        saveButton=document.createElement('button')
        saveButton.innerText="Salva"
        saveButton.addEventListener('click', saveLayout)
        layoutCreator=new LayoutCreator(saveButton)
        layoutCreator.loadLayout(layoutID).then(onJsonContents)
        layoutMenu=layoutCreator.getLayoutMenu()
        layoutContainer=layoutCreator.getLayoutContainer()
        section.appendChild(layoutContainer)
    }
}

function saveLayout(){
    if(!layoutCreator.isSaved()){
        saveButton.removeEventListener('click',saveLayout)
        saveButton.innerText=""
        const loading=document.createElement('img')
        loading.height=17
        loading.width=17
        loading.src=app_url+"/assets/loading.gif"
        saveButton.appendChild(loading)
        if(layoutCreator.getLayoutID()==="new"){
            layoutCreator.save().then(function(layoutID){
                fetch(app_url+"/saveUsersLayout/"+layoutID).then(function(response){
                    if(response.ok){
                        saveButton.querySelector('img').remove()
                        saveButton.innerText="Salvataggio effettuato"
                        saveButton.addEventListener('click',salva)
                    }
                })
            })
        }
        else
        layoutCreator.save().then(function(){
            saveButton.querySelector('img').remove()
            saveButton.innerText="Salvataggio effettuato"
            saveButton.addEventListener('click',saveLayout)
        })
    }
}
function onJsonContents(contents){
    console.log(content)
}
let saveButton
let layoutCreator
let layoutMenu
let layoutContainer
const newProductButton=document.querySelector('#newProductButton')
const newProductForm=document.forms["newProduct"]
const title=document.querySelector('h1').innerText
const seller=title.substring(10,title.length)
fetch(app_url+"/layout/"+seller).then(onResponseText).then(onLayoutID)
if(newProductForm){
    newProductButton.addEventListener('click',showForm)
    newProductForm.title.addEventListener('blur',check)
    newProductForm.price.addEventListener('blur',check)
    newProductForm.quantity.addEventListener('blur',check)
    newProductForm.producer.addEventListener('blur',check)
    newProductForm.image.addEventListener('change',checkImage)
    newProductForm.imgOption.addEventListener('change',changeImgOption)
    newProductForm.addEventListener('submit', newProduct)
    fetch(app_url+"/fetchProducts").then(onResponse).then(onJsonProducts)
}
