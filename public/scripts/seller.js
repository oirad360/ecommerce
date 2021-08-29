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
            parentBlock.dataset.product_id=item.id
            parentBlock.addEventListener('click',select)
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

function onLayouts(layouts){
    const section=document.querySelector('section')
    if(!newProductForm && layouts.length===0){
        const msg=document.createElement('p')
        msg.innerText="Nessun risultato trovato"
        section.appendChild(msg)
    } else if(!newProductForm && layouts.length>0) {
        layoutCreator=new LayoutCreator()
        let layoutID
        for(const layout of layouts){
            if(layout.active==1) layoutID=layout.layout_id
        }
        layoutCreator.loadLayout(layoutID).then(onJsonContent)
        layoutContainer=layoutCreator.getLayoutContainer()
        section.appendChild(layoutContainer)
    }else if(newProductForm && layouts.length>0){
        const idContainer=document.querySelector('#layouts')
        let layoutID
        for(const layout of layouts){
            const span=document.createElement('span')
            span.innerText=layout.layout_id
            span.classList.add('layoutID')
            span.addEventListener('click',selectLayout)
            if(layout.active==1) {
                span.style.color="red"
                span.style.border="1px solid black"
                layoutID=layout.layout_id
            }
            idContainer.appendChild(span)
            const id=layout.layout_id
            layoutsList[id]=span
        }
        layoutCreator=new LayoutCreator(saveButton)
        layoutCreator.loadLayout(layoutID).then(onJsonContent)
        layoutMenu=layoutCreator.getLayoutMenu()
        layoutContainer=layoutCreator.getLayoutContainer()
        modifyLayoutButton.classList.remove('hidden')
        section.appendChild(layoutMenu)
        section.appendChild(layoutContainer)
        layoutMenu.classList.add("hidden")
    }
}

function newLayout(event){
    modifyFlag=true
    modifyLayoutButton.classList.add("hidden")
    event.currentTarget.classList.remove('hidden')
    if(layoutContainer)layoutContainer.remove()
    if(layoutMenu)layoutMenu.remove()
    const section=document.querySelector('section')
    layoutCreator=new LayoutCreator(saveButton,"600px","100%")
    layoutMenu=layoutCreator.getLayoutMenu()
    layoutContainer=layoutCreator.getLayoutContainer()
    section.appendChild(layoutMenu)
    section.appendChild(layoutContainer)
    event.currentTarget.innerText="Annulla"
    event.currentTarget.addEventListener('click',quit)
    event.currentTarget.removeEventListener('click',newLayout)
}

function selectLayout(event){
    event.currentTarget.removeEventListener('click',selectLayout)
    modifyLayoutButton.innerText="Modifica layout"
    newLayoutButton.innerText="Crea un nuovo layout"
    const selected=event.currentTarget
    const selectedID=event.currentTarget.innerText
    event.currentTarget.innerText="..."
    layoutCreator.quit()
    modifyFlag=false
    for(const product of productsToInsert) product.style.border=""
    productsToInsert=[]
    productsToRemove=[]
    addContentButton.classList.add("hidden")
    removeContentButton.classList.add("hidden")
    layoutMenu.classList.add("hidden")
    const lastID=layoutCreator.getLayoutID()
    layoutCreator.loadLayout(selectedID).then(function(content){
        layoutsList[lastID].style.border=""
        selected.style.border="1px solid black"
        if(selected.style.color==="red") activeButton.classList.add("hidden")
        else activeButton.classList.remove("hidden")
        onJsonContent(content)
        selected.addEventListener('click',selectLayout)
        selected.innerText=selectedID
    })
}

function active(){
    activeButton.removeEventListener('click',active)
    const loading=document.createElement('img')
    loading.height=17
    loading.width=17
    loading.src=app_url+"/assets/loading.gif"
    activeButton.appendChild(loading)
    let layoutID
    for(const key of Object.keys(layoutsList)){
        if(layoutsList[key].style.border!=="") layoutID=layoutsList[key]
    }
    fetch(app_url+"/active/"+layoutID.innerText).then(function(response){
        activeButton.classList.add("hidden")
        activeButton.querySelector('img').remove()
        activeButton.innerText="Imposta come layout attivo"
        activeButton.addEventListener('click',active)
        for(const key of Object.keys(layoutsList)){
            if(layoutsList[key].style.color==="red") layoutsList[key].style.color=""
        }
        layoutID.style.color="red"
    })
}

function modify(event){
    if(layoutMenu.classList.contains("hidden")){
        modifyFlag=true
        newLayoutButton.classList.add("hidden")
        event.currentTarget.classList.remove('hidden')
        event.currentTarget.innerText="Annulla"
        layoutMenu.classList.remove("hidden")
        layoutCreator.modify()
    }
    else {
        event.currentTarget.innerText="Modifica layout"
        layoutCreator.quit()
        layoutMenu.classList.add("hidden")
        newLayoutButton.classList.remove("hidden")
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
                const idContainer=document.querySelector('#layouts')
                const span=document.createElement('span')
                span.classList.add('layoutID')
                span.innerText=layoutID
                span.addEventListener('click',selectLayout)
                idContainer.appendChild(span)
                if((Object.keys(layoutsList)).length===0)span.style.color="red"
                else {
                    activeButton.classList.remove("hidden")
                }
                for(const key of Object.keys(layoutsList)){
                    layoutsList[key].style.border=""
                }
                layoutsList[layoutID]=span
                span.style.border="1px solid black"
                fetch(app_url+"/saveUsersLayout/"+layoutID).then(function(response){
                    if(response.ok){
                        saveButton.querySelector('img').remove()
                        saveButton.innerText="Salvataggio effettuato"
                        saveButton.addEventListener('click',saveLayout)
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

function quit(event){
    layoutCreator.quit()
    modifyFlag=false
    productsToInsert=[]
    productsToRemove=[]
    addContentButton.classList.add("hidden")
    removeContentButton.classList.add("hidden")
    if(event.currentTarget.id==="newLayoutButton"){
        event.currentTarget.innerText="Crea un nuovo layout"
        event.currentTarget.addEventListener('click',newLayout)
        if(layoutsList.length===0){
            layoutMenu.remove()
            layoutContainer.remove()
        }else{
            layoutMenu.remove()
            modifyLayoutButton.classList.remove("hidden")
            let layoutID
            for(const key of Object.keys(layoutsList)){
                if(layoutsList[key].style.border!=="") layoutID=layoutsList[key].innerText
            }
            layoutCreator.loadLayout(layoutID).then(onJsonContent)
        }
    }else{
        newLayoutButton.classList.remove("hidden")
        event.currentTarget.innerText="Modifica layout"
        event.currentTarget.addEventListener('click',modify)
        layoutMenu.remove()
        layoutCreator.loadLayout(layoutCreator.getLayoutID()).then(onJsonContent)
    }
    event.currentTarget.removeEventListener('click',quit)
}

function select(event){
    if(modifyFlag){
        let list
        const productContainer=document.querySelector('.productContainer')
        if(event.currentTarget.parentNode===productContainer) list=productsToInsert
        else list=productsToRemove
        if(!list.includes(event.currentTarget)){
            event.currentTarget.style.borderStyle="dashed"
            list.push(event.currentTarget)
            addContentButton.classList.remove("hidden")
            removeContentButton.classList.remove("hidden")
        } else {
            event.currentTarget.style.borderStyle=""
            let i=0
            for(const product of list){
                if(product===event.currentTarget) break
                i++
            }
            list.splice(i,1)
            if(list===productsToInsert && list.length===0) addContentButton.classList.add("hidden")
            if(list===productsToRemove && list.length===0) removeContentButton.classList.add("hidden")
        }
        if(event.currentTarget.parentNode===productContainer) productsToInsert=list
        else productsToRemove=list
    }
}

function addContent(){
    if(productsToInsert.length>0){
        for(const product of productsToInsert){
            const id=parseInt(product.dataset.product_id)
            const content = layoutCreator.getContent()
            if(!content.includes(id)){
                layoutCreator.addContent(id)
                const clone=product.cloneNode(true)
                clone.style.border=""
                clone.addEventListener('click',select)
                clone.querySelector('.descButton').addEventListener('click',showDesc)
                layoutCreator.getLastSelected().querySelector('section').appendChild(clone)
            }
        }
    } else {
        console.log("scegli un prodotto")
    }
}

function removeContent(){
    if(productsToRemove.length>0){
        for(const product of productsToRemove){
            const child=product.parentNode.parentNode
            const gen=child.dataset.gen
            const id=child.dataset.id
            const content=layoutCreator.getContent(gen,id)
            let i=0
            for(const item of content){
                if(item===parseInt(product.dataset.product_id)) break
                i++
            }
            layoutCreator.removeContent(i,gen,id)
            child.querySelector("[data-product_id=\'"+product.dataset.product_id+"\']").remove()
        }
        productsToRemove=[]
    } else console.log("scegli un prodotto")
}

function onJsonContent(content){
    const productContainer=document.querySelector('.productContainer')
    for(const gen of Object.keys(content)){
        for(const id of Object.keys(content[gen])){
            const childSection=layoutContainer.querySelector('.child'+gen+id).querySelector('section')
            for(const productID of content[gen][id]){
                const product=productContainer.querySelector("[data-product_id=\'"+productID+"\']")
                const clone=product.cloneNode(true)
                clone.style.border=""
                clone.addEventListener('click',select)
                clone.querySelector('.descButton').addEventListener('click',showDesc)
                /* const cloneProduct=document.createElement('div')
                cloneProduct.dataset.product_id=productID
                cloneProduct.classList.add('prodotto')
                const nome=document.createElement('h3')
                nome.innerText=product.childNodes[0].innerText
                const immagine=document.createElement('img')
                immagine.src=product.childNodes[1].src
                const prezzo = document.createElement('span')
                prezzo.innerText=product.childNodes[2].innerText
                cloneProduct.appendChild(nome)
                cloneProduct.appendChild(immagine)
                cloneProduct.appendChild(prezzo)
                cloneProduct.addEventListener('click',select)*/
                childSection.appendChild(clone)
            }
        }
    }
}

let saveButton=document.createElement('button')
saveButton.addEventListener('click', saveLayout)
saveButton.innerText="Salva"
let layoutCreator
let layoutMenu
let layoutContainer
let layoutsList={}
let productsToInsert=[]
let productsToRemove=[]
let modifyFlag=false

const newProductButton=document.querySelector('#newProductButton')
const newProductForm=document.forms["newProduct"]
const addContentButton=document.querySelector('#addContentButton')
const removeContentButton= document.querySelector('#removeContentButton')
const newLayoutButton=document.querySelector('#newLayoutButton')
const modifyLayoutButton=document.querySelector('#modifyLayoutButton')
const activeButton=document.querySelector('#active')
const title=document.querySelector('h1').innerText
const seller=title.substring(10,title.length)
fetch(app_url+"/layout/"+seller).then(onResponse).then(onLayouts)
if(newProductForm){
    newProductButton.addEventListener('click',showForm)
    newProductForm.title.addEventListener('blur',check)
    newProductForm.price.addEventListener('blur',check)
    newProductForm.quantity.addEventListener('blur',check)
    newProductForm.producer.addEventListener('blur',check)
    newProductForm.image.addEventListener('change',checkImage)
    newProductForm.imgOption.addEventListener('change',changeImgOption)
    newProductForm.addEventListener('submit', newProduct)
    addContentButton.addEventListener('click',addContent)
    removeContentButton.addEventListener('click',removeContent)
    activeButton.addEventListener('click',active)
    modifyLayoutButton.addEventListener('click',modify)
    newLayoutButton.addEventListener('click',newLayout)
    fetch(app_url+"/fetchProducts").then(onResponse).then(onJsonProducts)
}
