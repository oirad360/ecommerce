function onResponse(response){
    return response.json()
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
            if(response.ok) fetch(app_url+"/fetchProducts/"+seller).then(onResponse).then(onJsonProducts)
        })
    }
}

function onJsonProducts(json){
    if(newProductForm){
        newProductForm.send.value="Invia"
        newProductForm.send.style.backgroundImage=""
    }
    if(json.errors){
        const errorContainer=document.querySelector('#errorsPhp')
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
        let container
        if(newProductForm){
            container=document.querySelector('.productContainer')
            container.innerHTML=""
        }
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
            const buttonContainer=document.createElement('div')
            buttonContainer.classList.add('productButtonsContainer')
            const descButton=document.createElement('p')
            descButton.innerText="Scheda tecnica"
            descButton.classList.add('descButton')
            descButton.addEventListener('click',showDesc)
            buttonContainer.appendChild(descButton)
            const deleteProductButton=document.createElement('span')
            deleteProductButton.innerText="X"
            deleteProductButton.classList.add('deleteProductButton')
            buttonContainer.appendChild(deleteProductButton)
            deleteProductButton.addEventListener('click',deleteProduct)
            block.appendChild(buttonContainer)
            const desc=document.createElement('p')
            desc.innerText=item.description
            desc.classList.add('desc','hidden')
            const parentBlock=document.createElement('div')
            parentBlock.appendChild(block)
            parentBlock.appendChild(desc)
            parentBlock.dataset.product_id=item.id
            parentBlock.addEventListener('click',select)
            if(newProductForm)container.appendChild(parentBlock)
            else productList.push(parentBlock)
        }
        if(newProductForm){
            newProductForm.classList.add("hidden")
            newProductButton.innerText="Inserisci un nuovo prodotto"
        }
        if(firstLoading)fetch(app_url+"/layout/"+seller).then(onResponse).then(onLayouts)
        firstLoading=false
    } else {
        const text=document.querySelector('#yourProducts')
        text.innerText="Non hai nessun prodotto in vendita"
    }
}

function showDesc(event){
    const descButton=event.currentTarget
    const parentBlock=descButton.parentNode.parentNode.parentNode //tramite il currentTarget (bottone appena premuto) risalgo all'intero blocco del prodotto utilizzando parentNode e lo salvo in una costante
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
    let layoutID
    for(const layout of layouts){
        if(layout.active==1) {
            layoutID=layout.layout_id
            break
        }
    }
    if(!newProductForm && !layoutID){
        const msg=document.createElement('p')
        msg.innerText="Nessun risultato trovato"
        section.appendChild(msg)
    } else if(!newProductForm && layoutID) {
        layoutCreator=new LayoutCreator()
        layoutCreator.loadLayout(layoutID).then(onJsonContent)
        layoutContainer=layoutCreator.getLayoutContainer()
        section.appendChild(layoutContainer)
    }else if(newProductForm && layouts.length>0){
        activeButton.classList.remove("hidden")
        const idContainer=document.querySelector('#layouts')
        idContainer.innerHTML=""
        for(const layout of layouts){
            const span=document.createElement('span')
            span.innerText=layout.layout_id
            span.classList.add('layoutID')
            span.addEventListener('click',selectLayout)
            if(layout.layout_id===layoutID) {
                span.style.color="red"
                span.style.border="1px solid black"
            }
            idContainer.appendChild(span)
            const id=layout.layout_id
            layoutsList[id]=span
            deleteLayoutButton.classList.remove("hidden")
        }
        if(!layoutID) {
            layoutID=layouts[0].layout_id
            layoutsList[Object.keys(layoutsList)[0]].style.border="1px solid black"
            activeButton.innerText="Imposta come layout primario"
        } else activeButton.innerText="Disabilita layout primario"
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
    saveButton.innerText="Salva"
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
    const selected=event.currentTarget
    const selectedID=event.currentTarget.innerText
    const lastID=layoutCreator.getLayoutID()
    event.currentTarget.innerText="..."
    layoutCreator.loadLayout(selectedID).then(function(content){
        layoutCreator.quit()
        addContentButton.classList.add("hidden")
        removeContentButton.classList.add("hidden")
        layoutMenu.classList.add("hidden")
        modifyFlag=false
        for(const product of productsToInsert) product.style.border=""
        productsToInsert=[]
        productsToRemove=[]
        modifyLayoutButton.innerText="Modifica layout"
        newLayoutButton.innerText="Crea un nuovo layout"
        modifyLayoutButton.classList.remove('hidden')
        newLayoutButton.classList.remove('hidden')
        if(layoutsList[lastID])layoutsList[lastID].style.border=""
        selected.style.border="1px solid black"
        if(selected.style.color==="red") activeButton.innerText="Disabilita layout primario"
        else activeButton.innerText="Imposta come layout primario"
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
    let val
    if(layoutID.style.color==="red") val=false
    else val=true
    fetch(app_url+"/active/"+layoutID.innerText+"/"+val).then(function(response){
        if(response.ok){
            if(val){
                activeButton.innerText="Disabilita layout primario"
                for(const key of Object.keys(layoutsList)){
                    if(layoutsList[key].style.color==="red") layoutsList[key].style.color=""
                }
                layoutID.style.color="red"
            } else {
                activeButton.innerText="Imposta come layout primario"
                layoutID.style.color=""
            }
            //activeButton.querySelector('img').remove()
            activeButton.addEventListener('click',active)
        }
    })
}

function modify(event){
    modifyFlag=true
    newLayoutButton.classList.add("hidden")
    event.currentTarget.classList.remove('hidden')
    event.currentTarget.innerText="Annulla"
    layoutMenu.classList.remove("hidden")
    layoutCreator.modify()
    event.currentTarget.addEventListener('click',quit)
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
                        const idContainer=document.querySelector('#layouts')
                        const span=document.createElement('span')
                        span.classList.add('layoutID')
                        span.innerText=layoutID
                        span.addEventListener('click',selectLayout)
                        idContainer.appendChild(span)
                        if((Object.keys(layoutsList)).length===0){
                            span.style.color="red"
                            activeButton.classList.remove("hidden")
                            activeButton.innerText="Disabilita layout primario"
                        }
                        else activeButton.innerText="Imposta come layout primario"
                        for(const key of Object.keys(layoutsList)){
                            layoutsList[key].style.border=""
                        }
                        layoutsList[layoutID]=span
                        span.style.border="1px solid black"
                        saveButton.querySelector('img').remove()
                        saveButton.innerText="Salvataggio effettuato"
                        deleteLayoutButton.classList.remove("hidden")
                        saveButton.addEventListener('click',saveLayout)
                    }
                })
            })
        } else layoutCreator.save().then(function(){
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
        if(Object.keys(layoutsList).length===0){
            layoutMenu.remove()
            layoutContainer.remove()
        }else{
            layoutMenu.classList.add("hidden")
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
        layoutMenu.classList.add("hidden")
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
            if(list===productsToInsert)addContentButton.classList.remove("hidden")
            else removeContentButton.classList.remove("hidden")
        } else {
            event.currentTarget.style.borderStyle=""
            let i=0
            for(const product of list){
                if(product===event.currentTarget) break
                i++
            }
            list.splice(i,1)
            if(list.length===0){
                if(list===productsToInsert) addContentButton.classList.add("hidden")
                else removeContentButton.classList.add("hidden")
            } else {
                if(list===productsToInsert) addContentButton.classList.remove("hidden")
                else removeContentButton.classList.remove("hidden")
            }
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
        removeContentButton.classList.add("hidden")
    } else console.log("scegli un prodotto")
}

function modalDelete(event){
    const div=document.createElement('div')
    div.classList.add('modalDelete')
    const msg=document.createElement('p')
    let layoutID
    for(const key of Object.keys(layoutsList)){
        if(layoutsList[key].style.border!==""){
            layoutID=layoutsList[key].innerText
            break
        }
    }
    if(event.currentTarget.classList.contains('layoutID')) msg.innerText="Sei sicuro di voler eliminare il layout "+layoutID+"?"
    else msg.innerText="Sei sicuro di voler eliminare il prodotto "+event.currentTarget.parentNode.parentNode.childNodes[0].innerText+"?"
    div.appendChild(msg)
    const options=document.createElement('div')
    const yes=document.createElement('span')
    yes.innerText="Si"
    const no=document.createElement('span')
    no.innerText="No"
    options.appendChild(yes)
    options.appendChild(no)
    div.appendChild(options)
    document.body.classList.add('noScroll')
    modalView.style.top = window.pageYOffset + 'px'
    modalView.appendChild(div)
    modalView.classList.remove('hidden')
    if(event.currentTarget.classList.contains('layoutID')) yes.addEventListener('click',deleteLayout)
    else yes.addEventListener('click',deleteProduct)
}

function deleteLayout(){
    let layoutID
    for(const key of Object.keys(layoutsList)){
        if(layoutsList[key].style.border!=="") {
            layoutID=layoutsList[key].innerText
            break
        }
    }
    layoutCreator.deleteLayout().then(function(){
        document.body.classList.remove('noScroll')
        modalView.classList.add('hidden')
        modalView.innerHTML = ''
        layoutsList[layoutID].remove()
        delete layoutsList[layoutID]
        if(Object.keys(layoutsList).length===0){
            activeButton.classList.add("hidden")
            activeButton.innerText=""
            modifyLayoutButton.classList.add("hidden")
            modifyLayoutButton.innerText="Modifica layout"
            newLayoutButton.classList.remove("hidden")
            newLayoutButton.innerText="Crea un nuovo layout"
            deleteLayoutButton.classList.add("hidden")
            addContentButton.classList.add("hidden")
            removeContentButton.classList.add("hidden")
            layoutMenu.remove()
            layoutContainer.remove()
        } else {
            layoutMenu.classList.add("hidden")
            const event=new Event('click')
            layoutsList[Object.keys(layoutsList)[0]].dispatchEvent(event)
        }
    })
    
}

function deleteProduct(event){
    fetch(app_url+"/deleteProduct/"+event.currentTarget.parentNode.parentNode.parentNode.dataset.product_id).then(function(){
        const layouts=document.querySelector('#layouts').querySelectorAll('span')
        for(const layout of layouts){
            fetch("/ecommerce/layout"+layout.innerText+".json").then(onResponse).then(function(json){
                console.log(layout.innerText)
                console.log(json)
            })
        }
        firstLoading=true
        if(layoutContainer)layoutContainer.remove()
        if(layoutMenu)layoutMenu.remove()
        fetch(app_url+"/fetchProducts/"+seller).then(onResponse).then(onJsonProducts)
    })
}

function onJsonContent(content){
    const productContainer=document.querySelector('.productContainer')
    for(const gen of Object.keys(content)){
        for(const id of Object.keys(content[gen])){
            const childSection=layoutContainer.querySelector('.child'+gen+id).querySelector('section')
            childSection.innerHTML=""
            for(const productID of content[gen][id]){
                let product
                const node=productContainer.querySelector("[data-product_id=\'"+productID+"\']")
                if(productContainer && node) product=node.cloneNode(true)
                else for(const item of productList){
                    if(item.dataset.product_id==productID){
                        product=item
                        break
                    }
                }
                if(product){
                    product.style.border=""
                    product.addEventListener('click',select)
                    product.querySelector('.descButton').addEventListener('click',showDesc)
                    childSection.appendChild(product)
                }
                
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
let productList=[]
let firstLoading=true

const newProductButton=document.querySelector('#newProductButton')
const newProductForm=document.forms["newProduct"]
const addContentButton=document.querySelector('#addContentButton')
const removeContentButton= document.querySelector('#removeContentButton')
const newLayoutButton=document.querySelector('#newLayoutButton')
const modifyLayoutButton=document.querySelector('#modifyLayoutButton')
const deleteLayoutButton=document.querySelector('#deleteLayoutButton')
const activeButton=document.querySelector('#active')
const title=document.querySelector('h1').innerText
const seller=title.substring(10,title.length)
fetch(app_url+"/fetchProducts/"+seller).then(onResponse).then(onJsonProducts)
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
    deleteLayoutButton.addEventListener('click',modalDelete)
}
