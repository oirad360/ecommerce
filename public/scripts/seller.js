function onResponse(response){
    return response.json()
}

function onResponseText(response){
    return response.text()
}

function showForm(event){
    if(event.currentTarget.id==="newProductButton"){
        newProductForm.productID.value=""
        if(newProductForm.classList.contains("hidden")) {
            newProductForm.classList.remove("hidden")
            newProductButton.innerText="Annulla"
        } else{
            newProductForm.classList.add("hidden")
            newProductButton.innerText="Inserisci un nuovo prodotto"
        }
    } else {
        const product=event.currentTarget.parentNode.parentNode
        newProductForm.classList.remove("hidden")
        quitModifyProductButton.classList.remove("hidden")
        newProductButton.classList.add("hidden")
        newProductForm.productID.value=product.parentNode.dataset.product_id
        newProductForm.title.value=product.childNodes[0].innerText
        newProductForm.price.value=parseInt(product.childNodes[2].innerText.split("€")[0])
        newProductForm.category.querySelector("option[value="+product.dataset.category+"]").selected="selected"
        newProductForm.quantity.value=parseInt(product.childNodes[3].childNodes[0].innerText.substring(15,product.childNodes[3].childNodes[0].innerText.length))
        newProductForm.producer.value=product.dataset.producer
        newProductForm.desc.value=product.parentNode.childNodes[1].innerText
        if(!product.childNodes[1].childNodes[0].src.includes(app_url)) {
            newProductForm.imgOption.querySelector("option[value=url]").selected="selected"
            newProductForm.url.value=product.childNodes[1].childNodes[0].src
            newProductForm.image.classList.add("hidden")
            newProductForm.url.classList.remove("hidden")
        }
        else {
            newProductForm.imgOption.querySelector("option[value=upload]").selected="selected"
            newProductForm.url.value=""
            newProductForm.image.classList.remove("hidden")
            newProductForm.url.classList.add("hidden")
        }
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

function quitModifyProduct(event){
    event.currentTarget.classList.add("hidden")
    newProductForm.classList.add("hidden")
    newProductButton.classList.remove("hidden")
    newProductForm.productID.value=""
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
            if(response.ok) fetch(app_url+"/fetchProducts/"+seller).then(onResponse).then(function(json){
                onJsonProducts(json)
                if(newProductForm.productID.value && layoutContainer){
                    const product=document.querySelector('#yourProductsContainer').querySelector("[data-product_id=\'"+newProductForm.productID.value+"\']")
                    const products=layoutContainer.querySelectorAll("[data-product_id=\'"+newProductForm.productID.value+"\']")
                    if(products) for(const item of products){
                        item.childNodes[0].dataset.producer=product.childNodes[0].dataset.producer
                        item.childNodes[0].dataset.category=product.childNodes[0].dataset.category
                        item.childNodes[0].childNodes[0].innerText=product.childNodes[0].childNodes[0].innerText
                        item.childNodes[0].childNodes[1].childNodes[0].src=product.childNodes[0].childNodes[1].childNodes[0].src
                        item.childNodes[0].childNodes[2].innerText=product.childNodes[0].childNodes[2].innerText
                        item.childNodes[0].childNodes[3].childNodes[0].innerText=product.childNodes[0].childNodes[3].childNodes[0].innerText
                        item.childNodes[1].innerText=product.childNodes[1].innerText
                    }
                }
            })
        })
    }
}

function onJsonProducts(json){
    if(newProductForm){
        newProductForm.send.value="Invia"
        newProductForm.send.style.backgroundImage=""
        newProductForm.addEventListener('submit', newProduct)
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
            container=document.querySelector('#yourProductsContainer')
            container.innerHTML=""
            newProductForm.classList.add("hidden")
            newProductButton.classList.remove("hidden")
            newProductButton.innerText="Inserisci un nuovo prodotto"
            quitModifyProductButton.classList.add("hidden")
        }
        for(const item of json){
            const block=document.createElement('div')
            block.classList.add('block')
            const title=document.createElement('h3')
            title.innerText=item.title
            block.appendChild(title)
            const img=document.createElement('img')
            if(item.image.substring(0,4)==="http") img.src=item.image
            else img.src=app_url+"/assets/"+item.image
            const link=document.createElement('a')
            link.href=app_url+"/reviews/"+item.id
            link.appendChild(img)
            block.appendChild(link)
            const price=document.createElement('span')
            price.innerText=item.price+"€"
            block.appendChild(price)
            const quantity=document.createElement('p')
            quantity.innerText="Disponibilità: "+item.quantity
            quantity.classList.add('quantity')
            const modify=document.createElement('img')
            modify.classList.add('modifyButton')
            modify.src="../assets/modify.png"
            modify.addEventListener('click',showForm)
            const buttonContainer=document.createElement('div')
            buttonContainer.classList.add('productButtonsContainer')
            buttonContainer.appendChild(quantity)
            buttonContainer.appendChild(modify)
            block.appendChild(buttonContainer)
            const buttonContainer1=document.createElement('div')
            buttonContainer1.classList.add('productButtonsContainer')
            const descButton=document.createElement('p')
            descButton.innerText="Scheda tecnica"
            descButton.classList.add('descButton')
            descButton.addEventListener('click',showDesc)
            buttonContainer1.appendChild(descButton)
            const deleteProductButton=document.createElement('span')
            deleteProductButton.innerText="X"
            deleteProductButton.classList.add('deleteProductButton')
            buttonContainer1.appendChild(deleteProductButton)
            deleteProductButton.addEventListener('click',modalDelete)
            block.appendChild(buttonContainer1)
            block.dataset.producer=item.producer
            block.dataset.category=item.category
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
    } else if(newProductForm){
        const text=document.querySelector('#yourProducts')
        text.innerText="Non hai nessun prodotto in vendita"
    }
    if(firstLoading)fetch(app_url+"/layout/"+seller).then(onResponse).then(onLayouts)
    firstLoading=false
}

function showDesc(event){
    const descButton=event.currentTarget
    const parentBlock=descButton.parentNode.parentNode.parentNode
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

function onLayouts(layouts){
    const section=document.querySelector('section')
    let layoutID
    let val=(vw>breakpoint) ? 0 : 1
    for(const layout of layouts){
        if(layout.active==1){
            layoutID=layout.layout_id
            if(layout.mobile==val) {
                layoutID=layout.layout_id
                break
            }
        }
    }
    if(!newProductForm && !layoutID){
        const msg=document.createElement('p')
        msg.innerText="Nessun prodotto in esposizione"
        section.appendChild(msg)
    } else if(!newProductForm && layoutID) {
        layoutCreator=new LayoutCreator()
        fetch(app_url+"/loadLayout/"+layoutID).then(onResponse).then(function(json){
            const content=layoutCreator.loadLayout(json,app_url+"/loadLocations/"+layoutID)
            layoutContainer=layoutCreator.getLayoutContainer()
            section.insertBefore(layoutContainer,document.querySelector('#reviewTitle'))
            
        })
        for(const layout of layouts){
            layoutsList[layout.layout_id]={
                "mobile": layout.mobile,
                "active": layout.active
            }
        }
        
    }else if(newProductForm && layouts.length>0){
        mobile.classList.remove("hidden")
        activeButton.classList.remove("hidden")
        deleteLayoutButton.classList.remove("hidden")
        modifyLayoutButton.classList.remove('hidden')
        const idContainer=document.querySelector('#layouts')
        idContainer.innerHTML=""
        for(const layout of layouts){
            const span=document.createElement('span')
            span.innerText=layout.layout_id
            span.classList.add('layoutID')
            span.addEventListener('click',selectLayout)
            if(layout.active==1) span.style.color="red"
            if(layout.layout_id===layoutID) span.style.border="1px solid black"
            idContainer.appendChild(span)
            const id=layout.layout_id
            layoutsList[id]={
                "span":span, 
                "mobile": layout.mobile,
                "active": layout.active
            }
        }
        if(!layoutID) {
            layoutID=layouts[0].layout_id
            layoutsList[layoutID].span.style.border="1px solid black"
            activeButton.innerText="Imposta come layout attivo"
        } else activeButton.innerText="Disabilita layout attivo"
        if(layoutsList[layoutID].mobile==1) mobile.childNodes[0].checked=true
        layoutCreator=new LayoutCreator(saveButton)
        fetch(app_url+"/loadLayout/"+layoutID).then(onResponse).then(function(json){
            const content= layoutCreator.loadLayout(json,app_url+"/loadLocations/"+layoutID)
            layoutMenu=layoutCreator.getLayoutMenu()
            layoutContainer=layoutCreator.getLayoutContainer()
            section.insertBefore(layoutMenu,document.querySelector('#reviewTitle'))
            section.insertBefore(layoutContainer,document.querySelector('#reviewTitle'))
            layoutMenu.classList.add("hidden")
            
        })
    }
}

function newLayout(event){
    modifyFlag=true
    saveButton.innerText="Salva"
    modifyLayoutButton.classList.add("hidden")
    deleteLayoutButton.classList.add("hidden")
    event.currentTarget.classList.remove('hidden')
    mobile.classList.remove("hidden")
    activeButton.classList.add("hidden")
    if(layoutContainer)layoutContainer.remove()
    if(layoutMenu)layoutMenu.remove()
    const section=document.querySelector('section')
    layoutCreator=new LayoutCreator(saveButton,"600px","100%")
    layoutMenu=layoutCreator.getLayoutMenu()
    layoutContainer=layoutCreator.getLayoutContainer()
    section.insertBefore(layoutMenu,document.querySelector('#reviewTitle'))
    section.insertBefore(layoutContainer,document.querySelector('#reviewTitle'))
    event.currentTarget.innerText="Annulla"
    event.currentTarget.addEventListener('click',quit)
    event.currentTarget.removeEventListener('click',newLayout)
}

function active(){
    activeButton.removeEventListener('click',active)
    const loading=document.createElement('img')
    loading.height=17
    loading.width=17
    loading.src=app_url+"/assets/loading.gif"
    activeButton.appendChild(loading)
    let layoutID
    for(const id in layoutsList){
        if(layoutsList[id].span.style.border!=="") layoutID=layoutsList[id].span
    }
    let val
    if(layoutID.style.color==="red") val=false
    else val=true
    fetch(app_url+"/active/"+layoutID.innerText+"/"+val).then(onResponseText).then(function(text){
        if(text!=="0"){
            if(val){
                activeButton.innerText="Disabilita layout attivo"
                layoutID.style.color="red"
                layoutsList[layoutID.innerText].active=1
            } else {
                activeButton.innerText="Imposta come layout attivo"
                layoutID.style.color=""
                layoutsList[layoutID.innerText].active=0
            }
        } else {
            console.log("Hai già un layout attivo per la versione "+(mobile.childNodes[0].checked ? "mobile" : "desktop"))
            activeButton.querySelector('img').remove()
        }
            activeButton.addEventListener('click',active)
    })
}

function modify(event){
    modifyFlag=true
    newLayoutButton.classList.add("hidden")
    deleteLayoutButton.classList.add("hidden")
    event.currentTarget.classList.remove('hidden')
    event.currentTarget.innerText="Annulla"
    layoutMenu.classList.remove("hidden")
    layoutCreator.modify()
    event.currentTarget.addEventListener('click',quit)
    event.currentTarget.removeEventListener('click',modify)
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
        layout=layoutCreator.save()
        layout.mobile=mobile.childNodes[0].checked
        const childsSections=layoutCreator.getAllSections()
        let content={}
        for(const section of childsSections){
            const gen=section.parentNode.dataset.gen
            const id=section.parentNode.dataset.id
            const products=section.querySelectorAll('.block')
            let productsID=[]
            for(const product of products){
                productsID.push(product.parentNode.dataset.product_id)
            }
            if(!content[gen]){
                content[gen]={}
            }
            content[gen][id]=productsID
        }
        layout.content=content
        fetch(app_url+"/saveUsersLayout",{
            method: 'POST',
            body: JSON.stringify(layout),
            headers:
            {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]').content
            }
        }).then(onResponse).then(function(json){
            if(json.new==1){
                const layoutID=json.layoutID
                layoutCreator.setLayoutID(layoutID)
                const idContainer=document.querySelector('#layouts')
                const span=document.createElement('span')
                span.classList.add('layoutID')
                span.innerText=layoutID
                span.addEventListener('click',selectLayout)
                idContainer.appendChild(span)
                let active
                if((Object.keys(layoutsList)).length===0){
                    span.style.color="red"
                    activeButton.classList.remove("hidden")
                    activeButton.innerText="Disabilita layout attivo"
                    active=1
                }
                else {
                    activeButton.innerText="Imposta come layout attivo"
                    active=0
                }
                for(const id in layoutsList){
                    layoutsList[id].span.style.border=""
                }
                layoutsList[layoutID]={
                    "span":span,
                    "mobile":mobile.childNodes[0].checked ? 1 : 0,
                    "active": active
                }
                span.style.border="1px solid black"
                deleteLayoutButton.classList.remove("hidden")
                
            }
            saveButton.querySelector('img').remove()
            saveButton.innerText="Salvataggio effettuato"
            saveButton.addEventListener('click',saveLayout)
        })
    }
}

function mobileVersion(event){
    const val=event.currentTarget.checked
    const currentTarget=event.currentTarget
    const layoutID=layoutCreator.getLayoutID()
    if(layoutID!=="new")
    fetch(app_url+"/mobile/"+layoutID+"/"+val).then(onResponseText).then(function(text){
        if(text==="0") {
            console.log("Hai già un layout attivo per la versione "+(mobile.childNodes[0].checked ? "mobile" : "desktop"))
            currentTarget.checked=!val
        } else {
            for(const id in layoutsList){
                if(id==layoutID){
                    layoutsList[id].mobile=val ? 1 : 0
                    break
                }
            }
        }
    })
}

function selectLayout(event){
    event.currentTarget.removeEventListener('click',selectLayout)
    const selected=event.currentTarget
    const selectedID=event.currentTarget.innerText
    let lastID
    for(const key in layoutsList){
        if(layoutsList[key].span.style.border!==""){
            lastID=key
            break
        }
    }
    event.currentTarget.innerText="..."
    
    fetch(app_url+"/loadLayout/"+selectedID).then(onResponse).then(function(json){
        const content=layoutCreator.loadLayout(json,app_url+"/loadLocations/"+selectedID)
        
        layoutMenu.classList.add("hidden")
        layoutCreator.quit()
        saveButton.innerText="Salva"
        addContentButton.classList.add("hidden")
        removeContentButton.classList.add("hidden")
        deleteLayoutButton.classList.remove("hidden")
        activeButton.classList.remove("hidden")
        modifyFlag=false
        for(const product of productsToInsert) product.style.border=""
        productsToInsert=[]
        productsToRemove=[]
        mobile.childNodes[0].checked=layoutsList[selectedID].mobile
        modifyLayoutButton.innerText="Modifica layout"
        modifyLayoutButton.addEventListener('click',modify)
        modifyLayoutButton.removeEventListener('click',quit)
        modifyLayoutButton.classList.remove('hidden')
        newLayoutButton.innerText="Crea un nuovo layout"
        newLayoutButton.addEventListener('click',newLayout)
        newLayoutButton.removeEventListener('click',quit)
        newLayoutButton.classList.remove('hidden')
        if(lastID) layoutsList[lastID].span.style.border=""
        selected.style.border="1px solid black"
        if(selected.style.color==="red") activeButton.innerText="Disabilita layout attivo"
        else activeButton.innerText="Imposta come layout attivo"
        selected.addEventListener('click',selectLayout)
        selected.innerText=selectedID
    })
}

function quit(event){
    layoutCreator.quit()
    modifyFlag=false
    productsToInsert=[]
    productsToRemove=[]
    const products=document.querySelector('#yourProductsContainer').querySelectorAll('div')
    if(products)for(const product of products) product.style.border=""
    addContentButton.classList.add("hidden")
    removeContentButton.classList.add("hidden")
    activeButton.classList.remove("hidden")
    saveButton.innerText="Salva"
    if(event.currentTarget.id==="newLayoutButton"){
        event.currentTarget.innerText="Crea un nuovo layout"
        event.currentTarget.addEventListener('click',newLayout)
        if(Object.keys(layoutsList).length===0){
            layoutMenu.remove()
            layoutContainer.remove()
        }else{
            layoutMenu.classList.add("hidden")
            modifyLayoutButton.classList.remove("hidden")
            deleteLayoutButton.classList.remove("hidden")
            let layoutID
            for(const id in layoutsList){
                if(layoutsList[id].span.style.border!==""){
                    layoutID=layoutsList[id].span.innerText
                    mobile.childNodes[0].checked=layoutsList[id].mobile
                    break
                }
            }
            fetch(app_url+"/loadLayout/"+layoutID).then(onResponse).then(function(json){
                const content=layoutCreator.loadLayout(json,app_url+"/loadLocations/"+layoutID)
                
            })
        }
    }else{
        newLayoutButton.classList.remove("hidden")
        event.currentTarget.innerText="Modifica layout"
        event.currentTarget.addEventListener('click',modify)
        deleteLayoutButton.classList.remove("hidden")
        layoutMenu.classList.add("hidden")
        const layoutID=layoutCreator.getLayoutID()
        fetch(app_url+"/loadLayout/"+layoutID).then(onResponse).then(function(json){
            const content=layoutCreator.loadLayout(json,app_url+"/loadLocations/"+layoutID)
            
        })
    }
    event.currentTarget.removeEventListener('click',quit)
}

function select(event){
    if(modifyFlag){
        let list
        const productContainer=document.querySelector('#yourProductsContainer')
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
            const section = layoutCreator.getSection()
            const products=section.querySelectorAll('.block')
            let productsID=[]
            for(const product of products){
                productsID.push(product.parentNode.dataset.product_id)
            }
            if(!productsID.includes(id)){
                saveButton.innerText="Salva"
                saveButton.classList.remove("hidden")
                //layoutCreator.addContent(id)
                const clone=product.cloneNode(true)
                clone.style.border=""
                clone.addEventListener('click',select)
                clone.querySelector('.descButton').addEventListener('click',showDesc)
                clone.querySelector('.deleteProductButton').remove()
                clone.querySelector('.modifyButton').remove()
                section.appendChild(clone)
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
            /*const gen=child.dataset.gen
            const id=child.dataset.id
            const content=layoutCreator.getContent(gen,id)
            let i=0
            for(const item of content){
                if(item===parseInt(product.dataset.product_id)) break
                i++
            }
            layoutCreator.removeContent(i,gen,id) */
            child.querySelector("[data-product_id=\'"+product.dataset.product_id+"\']").remove()
            saveButton.innerText="Salva"
            saveButton.classList.remove("hidden")
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
    for(const id in layoutsList){
        if(layoutsList[id].span.style.border!==""){
            layoutID=layoutsList[id].span.innerText
            break
        }
    }
    if(event.currentTarget.id==='deleteLayoutButton') msg.innerText="Sei sicuro di voler eliminare il layout "+layoutID+"?"
    else msg.innerText="Sei sicuro di voler eliminare il prodotto "+event.currentTarget.parentNode.parentNode.childNodes[0].innerText+"?"
    div.appendChild(msg)
    const options=document.createElement('div')
    const yes=document.createElement('span')
    yes.innerText="Si"
    if(event.currentTarget.id!=='deleteLayoutButton') yes.dataset.product_id=event.currentTarget.parentNode.parentNode.parentNode.dataset.product_id 
    const no=document.createElement('span')
    no.innerText="No"
    options.appendChild(yes)
    options.appendChild(no)
    div.appendChild(options)
    document.body.classList.add('noScroll')
    modalView.style.top = window.pageYOffset + 'px'
    modalView.appendChild(div)
    modalView.classList.remove('hidden')
    if(event.currentTarget.id==='deleteLayoutButton') {
        yes.addEventListener('click',deleteLayout)
        yes.removeEventListener('click',deleteProduct)
    }
    else {
        yes.addEventListener('click',deleteProduct)
        yes.removeEventListener('click',deleteLayout)
    }
}

function deleteLayout(){
    let layoutID
    for(const id in layoutsList){
        if(layoutsList[id].span.style.border!=="") {
            layoutID=id
            break
        }
    }
    fetch(app_url+"/deleteLayout/"+layoutID).then(function(){
        document.body.classList.remove('noScroll')
        modalView.classList.add('hidden')
        modalView.innerHTML = ''
        layoutsList[layoutID].span.remove()
        delete layoutsList[layoutID]
        if(Object.keys(layoutsList).length===0){
            activeButton.classList.add("hidden")
            mobile.classList.add("hidden")
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
            layoutsList[Object.keys(layoutsList)[0]].span.dispatchEvent(event)
        }
    })
    
}

function deleteProduct(event){
    const productID=event.currentTarget.dataset.product_id
    fetch(app_url+"/deleteProduct/"+productID).then(function(response){
        if(response.ok){
            if(layoutCreator){
                const products=layoutContainer.querySelectorAll("[data-product_id=\'"+productID+"\']")
                if(products) for(const product of products) product.remove()
            }
            fetch(app_url+"/fetchProducts/"+seller).then(onResponse).then(onJsonProducts)
        }
    })
}

/* function onJsonContent(content){
    const productContainer=document.querySelector('#yourProductsContainer')
    for(const gen in content){
        for(const id in content[gen]){
            const genn=gen.substring(11,gen.length-2)
            const idd=id.substring(10,id.length-2)
            const childSection=layoutCreator.getSection(genn,idd)
            childSection.innerHTML=""
            for(const productID of content[gen][id]){
                let product
                if(productContainer) {
                    const node=productContainer.querySelector("[data-product_id=\'"+productID+"\']")
                    product=node.cloneNode(true)
                    //node.classList.add("inLayout")
                }
                else for(const item of productList){
                    if(item.dataset.product_id==productID){
                        product=item.cloneNode(true)
                        break
                    }
                }
                product.style.border=""
                product.addEventListener('click',select)
                product.querySelector('.descButton').addEventListener('click',showDesc)
                product.querySelector('.deleteProductButton').remove()
                product.querySelector('.modifyButton').remove()
                childSection.appendChild(product)
            }
        }
    }
} */

function onReviews(json){
    const container=document.querySelector("#reviews")
    container.innerHTML=""
    const reviewTitle=document.querySelector('#reviewTitle')
    if(json.length>0){
        reviewTitle.classList.remove("hidden")
        for(item of json){
            const block=document.createElement('div')
            block.dataset.id=item.id
            block.classList.add("review")
            const row=document.createElement('div')
            row.classList.add("row")
            const product=document.createElement('a')
            product.classList.add("productTitle")
            product.innerText=item.title
            product.href=app_url+"/reviews/"+item.product_id
            row.appendChild(product)
            const date=document.createElement('p')
            date.innerText=item.date
            row.appendChild(date)
            block.appendChild(row)
            const seller=document.createElement('a')
            seller.innerText="Venditore: "+item.seller
            seller.href=app_url+"/seller/"+item.seller
            seller.classList.add('seller')
            block.appendChild(seller)
            const rating=document.createElement('img')
            rating.classList.add("rating")
            rating.src=app_url+"/assets/"+item.stars+".png"
            block.appendChild(rating)
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
            const row1=document.createElement('div')
            row1.classList.add('row')
            row1.appendChild(likeBlock)
            if(newProductForm){
                const bottoneEliminaRecensione=document.createElement('span')
                bottoneEliminaRecensione.classList.add('redButton')
                bottoneEliminaRecensione.innerText="Elimina recensione"
                bottoneEliminaRecensione.addEventListener('click',deleteReview)
                row1.appendChild(bottoneEliminaRecensione)
            }
            block.appendChild(row1)
            container.appendChild(block)
        }
    } else reviewTitle.classList.add("hidden")
}

function like(event){
    const id=event.currentTarget.parentNode.parentNode.parentNode.dataset.id
    fetch(app_url+"/like/"+id).then(function(response){
        if(response.ok){
            fetch(app_url+"/seller/"+seller+"/fetchReviews").then(onResponse).then(onReviews)
        }
    })
}

function dislike(event){
    const id=event.currentTarget.parentNode.parentNode.parentNode.dataset.id
    fetch(app_url+"/dislike/"+id).then(function(response){
        if(response.ok){
            fetch(app_url+"/seller/"+seller+"/fetchReviews").then(onResponse).then(onReviews)
        }
    })
}

function deleteReview(event){
    const id=event.currentTarget.parentNode.parentNode.dataset.id
    fetch(app_url+"/deleteReview/"+id).then(function(response){
        if(response.ok){
            fetch(app_url+"/seller/"+seller+"/fetchReviews").then(onResponse).then(onReviews)
        }
    })
}

function onPurchases(purchases){
    const purchasesTitle=document.querySelector("#yourPurchases")
    if(purchases.length>0){
        purchasesTitle.classList.remove("hidden")
        const container=document.querySelector("#yourPurchasesContainer")
        for(item of purchases){
            const block=document.createElement('div')
            block.classList.add('block')
            const title=document.createElement('h3')
            title.innerText=item.title
            block.appendChild(title)
            const img=document.createElement('img')
            if(item.image.substring(0,4)==="http") img.src=item.image
            else img.src=app_url+"/assets/"+item.image
            const link=document.createElement('a')
            link.href=app_url+"/reviews/"+item.id
            link.appendChild(img)
            block.appendChild(link)
            const quantity=document.createElement('p')
            quantity.innerText="Quantità: "+item.tot
            block.appendChild(quantity)
            const seller=document.createElement('a')
            seller.innerText="Venditore: "+item.seller
            seller.href=app_url+"/seller/"+item.seller
            seller.classList.add('seller')
            block.appendChild(seller)
            container.appendChild(block)
        }
    } else {
        purchasesTitle.classList.add("hidden")
    }
}

function reportWindowSize(){
    vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    if(layoutContainer){
        let val=(vw>breakpoint) ? 0 : 1
        for(const id in layoutsList){
            if(layoutsList[id].active==1 && layoutsList[id].mobile==val){
                if(id!=layoutCreator.getLayoutID()){
                    window.removeEventListener('resize', reportWindowSize)
                    fetch(app_url+"/loadLayout/"+id).then(onResponse).then(function(json){
                        const content=layoutCreator.loadLayout(json,app_url+"/loadLocations/"+id)
                        
                        window.addEventListener('resize', reportWindowSize)
                    })
                }
                break
            }
        }
    }
}

function showEditor(event){
    const editor=document.querySelector('#editor')
    if(editor.classList.contains("hidden")){
        editor.classList.remove("hidden")
        event.currentTarget.innerText="Chiudi il layout editor"
        window.removeEventListener('resize', reportWindowSize)
        /* if(layoutContainer){
            const click= new Event('click')
            layoutsList[layoutCreator.getLayoutID()].span.dispatchEvent(click)
        } */
    } else {
        editor.classList.add("hidden")
        event.currentTarget.innerText="Apri il layout editor"
        window.addEventListener('resize', reportWindowSize)
        let found=false
        let active
        let layoutID
        const val= (vw>breakpoint) ? 0 : 1
        if(Object.keys(layoutsList).length>0){
            for(const id in layoutsList){
                if(layoutsList[id].active==1){
                    active=id
                    if(layoutsList[id].mobile==val){
                        layoutID=layoutsList[id].span
                        found=true
                        break
                    }
                }
            }
            if(!found){
                if(active)layoutID=layoutsList[active].span
                else{
                    for(const id in layoutsList){
                        if(layoutsList[id].span.style.border!==""){
                            layoutID=layoutsList[id].span
                            found=true
                            break
                        }
                    }
                }
            }
            const click= new Event('click')
            layoutID.dispatchEvent(click)
        } else if(layoutCreator){
            layoutContainer.remove()
            layoutMenu.remove()
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
let layout
const breakpoint=800
const newProductButton=document.querySelector('#newProductButton')
const newProductForm=document.forms["newProduct"]
const addContentButton=document.querySelector('#addContentButton')
const removeContentButton= document.querySelector('#removeContentButton')
const newLayoutButton=document.querySelector('#newLayoutButton')
const modifyLayoutButton=document.querySelector('#modifyLayoutButton')
const deleteLayoutButton=document.querySelector('#deleteLayoutButton')
const activeButton=document.querySelector('#active')
const quitModifyProductButton=document.querySelector('#quitModifyProduct')
const mobile=document.querySelector('#mobile')
const editorButton=document.querySelector('#editorButton')
const title=document.querySelector('h1').innerText
const seller=title.substring(10,title.length)
let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
fetch(app_url+"/fetchProducts/"+seller).then(onResponse).then(onJsonProducts)
fetch(app_url+"/seller/"+seller+"/fetchReviews").then(onResponse).then(onReviews)
window.addEventListener('resize', reportWindowSize)
if(newProductForm){
    fetch(app_url+"/fetchPurchases").then(onResponse).then(onPurchases)
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
    quitModifyProductButton.addEventListener('click',quitModifyProduct)
    mobile.childNodes[0].addEventListener('change', mobileVersion)
    editorButton.addEventListener('click',showEditor)
}

