class LayoutCreator {
    //dichiarazione dei campi privati
    #gen
    #saved
    #content
    #layoutMenu
    #levelButton
    #deleteButton
    #saveButton
    #saveButtonInnerText
    #addChildButton
    #removeChildButton
    #formLayout
    #counter
    #sizeCommands
    #splitCommands
    #titleCommands
    #layoutContainer
    #lastSelected
    #selectBinded
    #splitBinded
    #selectLevelBinded
    #addChildBinded
    #removeChildBinded
    #titleUpdateBinded
    #fontUpdateBinded
    #sizeUpdateBinded
    #marginUpdateBinded
    #flexDirectionUpdateBinded
    #deleteChildsBinded
    constructor(saveButton,height,width){//crea il layoutMenu associandogli tutti gli event listener necessari per le modifiche e imposta il layoutContainer inizialmente vuoto
        this.#gen=0
        this.#saved=true
        this.#content={}

        this.#layoutMenu=document.createElement('div')
        this.#layoutMenu.id="layoutMenu"

        this.#levelButton=document.createElement('button')
        this.#levelButton.classList.add("hidden")
        this.#levelButton.id="levelButton"
        this.#levelButton.innerText="Seleziona livello superiore"

        this.#deleteButton=document.createElement('button')
        this.#deleteButton.classList.add("hidden")
        this.#deleteButton.id="deleteButton"
        this.#deleteButton.innerText="Svuota sezione"

        this.#saveButton=saveButton
        this.#saveButton.classList.add("hidden")
        this.#saveButtonInnerText=saveButton.innerText

        this.#addChildButton=document.createElement('button')
        this.#addChildButton.classList.add("hidden")
        this.#addChildButton.id="addChildButton"
        this.#addChildButton.innerText="Aggiungi sezione"

        this.#removeChildButton=document.createElement('button')
        this.#removeChildButton.classList.add("hidden")
        this.#removeChildButton.id="removeChildButton"
        this.#removeChildButton.innerText="Rimuovi sezione"

        this.#layoutMenu.appendChild(this.#saveButton)
        this.#layoutMenu.appendChild(this.#levelButton)
        this.#layoutMenu.appendChild(this.#deleteButton)
        this.#layoutMenu.appendChild(this.#addChildButton)
        this.#layoutMenu.appendChild(this.#removeChildButton)

        this.#formLayout=document.createElement('form')
        this.#formLayout.name="layout"

        const textCounter=document.createElement('div')
        textCounter.id="textCounter"
        textCounter.innerText="Contatore: "
        this.#counter=document.createElement('span')
        this.#counter.id="count"
        this.#counter.innerText=0
        textCounter.appendChild(this.#counter)
        this.#formLayout.appendChild(textCounter)

        this.#sizeCommands=document.createElement('div')
        this.#sizeCommands.id="sizeCommands"
        this.#sizeCommands.classList.add("hidden")

        this.#splitCommands=document.createElement('div')
        this.#splitCommands.id="splitCommands"

        const labelsText=[
            "Modifica larghezza (%):",
            "Modifica altezza (%):",
            "Modifica margine sup (px):",
            "Modifica margine dx (px):",
            "Modifica margine inf (px):",
            "Modifica margine sx (px):",
            "Titolo: ",
            "Font (px): ",
            "Numero di suddivisioni: ",
            "Disponi in direzione"
        ]
        const inputsInfos=[
            {
                "min":0,
                "name":"width",
                "type":"number",
                "step":"any"
            },{
                "min":0,
                "name":"height",
                "type":"number",
                "step":"any"
            },{
                "name":"marginTop",
                "type":"number"
            },{
                "name":"marginRight",
                "type":"number"
            },{
                "name":"marginBottom",
                "type":"number"
            },{
                "name":"marginLeft",
                "type":"number"
            },{
                "name":"title"
            },{
                "name":"fontSize",
                "min":0,
                "type":"number"
            },{
                "min":2,
                "name":"numSplit",
                "type":"number",
                "value":2
            }
        ]
        for(let i=0;i<10;i++){
            const labels=document.createElement('label')
            labels.innerText=labelsText[i]
            if(i<9){
                const input=document.createElement('input')
                for(let key of Object.keys(inputsInfos[i])){
                    input[key]=inputsInfos[i][key]
                }
                labels.appendChild(input)
                if(i<6) this.#sizeCommands.appendChild(labels)
                else if(i===6 || i===7) {
                    labels.classList.add("titleCommand","hidden")
                    this.#splitCommands.appendChild(labels)
                } else {
                    this.#splitCommands.appendChild(labels)
                }
            } else {
                const select=document.createElement('select')
                select.name="flexDirection"
                const option1=document.createElement('option')
                option1.value="row"
                option1.innerText="orizzontale"
                select.appendChild(option1)
                const option2=document.createElement('option')
                option2.value="column"
                option2.innerText="verticale"
                select.appendChild(option2)
                const option3=document.createElement('option')
                option3.value="row-reverse"
                option3.innerText="orizzontale inverso"
                select.appendChild(option3)
                const option4=document.createElement('option')
                option4.value="column-reverse"
                option4.innerText="verticale inverso"
                select.appendChild(option4)
                labels.appendChild(select)
                this.#formLayout.appendChild(labels)
                const input=document.createElement('input')
                input.value="Dividi"
                input.type="submit"
                this.#splitCommands.appendChild(input)
            }
        }

        this.#formLayout.appendChild(this.#sizeCommands)
        this.#formLayout.appendChild(this.#splitCommands)

        this.#titleCommands=this.#splitCommands.querySelectorAll('.titleCommand')
        this.#layoutMenu.appendChild(this.#formLayout)
        
        this.#layoutContainer=document.createElement('div')
        this.#layoutContainer.id='layoutContainer'
        this.#layoutContainer.dataset.layout="new"
        this.#layoutContainer.style.height=height
        this.#layoutContainer.style.width=width
        this.#layoutContainer.dataset.id=0
        this.#layoutContainer.dataset.gen=0
        this.#layoutContainer.style.flexShrink=0
        this.#layoutContainer.style.overflow="auto"
        
        this.#lastSelected=this.#layoutContainer

        this.#selectBinded=this.#select.bind(this)

        this.#splitBinded=this.#split.bind(this)
        this.#formLayout.addEventListener('submit',this.#splitBinded)

        this.#selectLevelBinded=this.#selectLevel.bind(this)
        this.#levelButton.addEventListener('click',this.#selectLevelBinded)

        this.#addChildBinded=this.#addChild.bind(this)
        this.#addChildButton.addEventListener('click',this.#addChildBinded)

        this.#removeChildBinded=this.#removeChild.bind(this)
        this.#removeChildButton.addEventListener('click',this.#removeChildBinded)

        this.#titleUpdateBinded=this.#titleUpdate.bind(this)
        this.#formLayout.title.addEventListener('change', this.#titleUpdateBinded)

        this.#fontUpdateBinded=this.#fontUpdate.bind(this)
        this.#formLayout.fontSize.addEventListener('change',this.#fontUpdateBinded)

        this.#sizeUpdateBinded=this.#sizeUpdate.bind(this)
        this.#formLayout.width.addEventListener('change',this.#sizeUpdateBinded)
        this.#formLayout.height.addEventListener('change',this.#sizeUpdateBinded)

        this.#marginUpdateBinded=this.#marginUpdate.bind(this)
        this.#formLayout.marginTop.addEventListener('change',this.#marginUpdateBinded)
        this.#formLayout.marginRight.addEventListener('change',this.#marginUpdateBinded)
        this.#formLayout.marginBottom.addEventListener('change',this.#marginUpdateBinded)
        this.#formLayout.marginLeft.addEventListener('change',this.#marginUpdateBinded)

        this.#flexDirectionUpdateBinded=this.#flexDirectionUpdate.bind(this)
        this.#formLayout.flexDirection.addEventListener('change',this.#flexDirectionUpdateBinded)

        this.#deleteChildsBinded=this.#deleteChilds.bind(this)
        this.#deleteButton.addEventListener('click',this.#deleteChildsBinded)

    }
    
    async loadLayout(layoutID,modify){//carica il layout per mostrarlo e ritorna il json per i contenuti
        await fetch("/ecommerce/loadLayout.php?layoutID="+layoutID).then(function (response){
            return response.json()
        }).then((function (json){
            for(let property of Object.keys(json)){
                if(property!=="id" && property!=="user_id" && property!=="childs" && property!=="content"){
                    this.#layoutContainer.style[property]=json[property]
                }
            }
            this.#content=json["content"]
            console.log(this.#content)
            this.#layoutContainer.dataset.layout=layoutID
            this.#layoutContainer.classList.add("hasChilds")
            this.#layoutContainer.innerHTML=""
            let lastGen=json.childs[0].data_gen
            let color=this.getRandomColor()
            let flag=false
            for(let child of json.childs){
                const childNode=document.createElement('div')
                childNode.classList.add('child')
                childNode.style.overflow="auto"
                childNode.style.flexShrink="0";
                if(child.data_gen!==lastGen){
                    color=this.getRandomColor()
                }
                childNode.style.border="1px solid "+color
                lastGen=child.data_gen
                childNode.dataset.gen=child.data_gen
                childNode.dataset.id=child.data_id
                childNode.dataset.parent_gen=child.data_parent_gen
                childNode.dataset.parent_id=child.data_parent_id
                for(let i=9;i<Object.keys(child).length;i++){
                    childNode.style[Object.keys(child)[i]]=child[Object.keys(child)[i]]
                }
                if(child.hasChilds==1) {
                    childNode.classList.add("hasChilds")
                } else if(child.title) this.#setChild(childNode,child.title,child.fontSize.split('px')[0])
                else if(modify===true) this.#setChild(childNode,"",24)
                else {
                    this.#setChild(childNode,"",24)
                    childNode.querySelector('.childTitle').remove()
                }
                if(child.hasChilds!=1 && modify===true) {
                    childNode.addEventListener('click',this.#selectBinded)
                    if(!flag){
                        const click = new Event('click')
                        childNode.dispatchEvent(click)
                        flag=true
                    }
                }
                let parent
                if(child.data_parent_gen==="0" && child.data_parent_id==="0") parent=this.#layoutContainer
                else parent=this.#layoutContainer.querySelector("[data-gen=\'"+child.data_parent_gen+"\'][data-id=\'"+child.data_parent_id+"\']")
                parent.appendChild(childNode)
                this.#counter.innerText++
                this.#gen=child.data_gen
            }
        }).bind(this))
        return this.#content
    }

    async save(){//salva il layout e il file json per i contenuti di quel layout
        const data={
            "id": this.#layoutContainer.dataset.layout,
            "display": this.#layoutContainer.style.display,
            "flexDirection": this.#layoutContainer.style.flexDirection,
            "height": this.#layoutContainer.style.height,
            "width": this.#layoutContainer.style.width,
            "childs": []
        }
        for(let i=1;i<=this.#gen;i++){
            const childs=this.#layoutContainer.querySelectorAll(".child[data-gen=\'"+i+"\']")
            let fontSize,title
            for(let child of childs){
                if(child.classList.contains("hasChilds")){
                    title=null
                    fontSize=null
                } else {
                    title=child.childNodes[0].innerText
                    if(title) fontSize=child.childNodes[0].style.fontSize
                    else fontSize=null
                }
                let content
                if(!child.classList.contains("hasChilds")){
                    if(!this.#content["[data-gen=\'"+child.dataset.gen+"\']"]["[data-id=\'"+child.dataset.id+"\']"]){
                        content=[]
                    } else {
                        content=this.#content["[data-gen=\'"+child.dataset.gen+"\']"]["[data-id=\'"+child.dataset.id+"\']"]
                    }
                }
                data.childs.push({
                    "data_gen": child.dataset.gen,
                    "data_id": child.dataset.id,
                    "data_parent_gen": child.dataset.parent_gen,
                    "data_parent_id": child.dataset.parent_id,
                    "hasChilds": child.classList.contains("hasChilds"),
                    "title": title,
                    "fontSize": fontSize,
                    "content": content,
                    "display": child.style.display,
                    "flexDirection": child.style.flexDirection,
                    "height": child.style.height,
                    "width": child.style.width,
                    "margin": child.style.margin
                })
            }
        }
        console.log(this.#content)
        await fetch("/ecommerce/saveLayout.php",{
            method: 'POST',
            body: JSON.stringify(data),
            headers:
            {
                'Content-Type': 'application/json'
            }
        }).then(function(response){
            return response.text()
        }).then((function(layoutID){
            console.log(layoutID)
            this.#layoutContainer.dataset.layout=layoutID
        }).bind(this))

        this.#saved=true
        return parseInt(this.#layoutContainer.dataset.layout)
    }

    quit(){//termina le modifiche (senza salvare)
        this.#layoutMenu.remove()
        const childs=this.#layoutContainer.querySelectorAll('.child')
        for(const child of childs){
            child.removeEventListener('click',this.#selectBinded)
            if(!child.classList.contains("hasChilds") && child.querySelector('.childTitle').innerText===""){
                child.querySelector('.childTitle').remove()
            }
        }
        this.#lastSelected.style.borderStyle="solid"
    }

    modify(){//rende modificabile il layout (aggiunge gli event listener per poter selezionare i child e apportare le modifiche utilizzando il layoutMenu)
        this.#lastSelected=this.#layoutContainer
        const childs=this.#layoutContainer.querySelectorAll('.child')
        let flag=false
        for(const child of childs){
            if(!child.classList.contains("hasChilds")) {
                child.addEventListener('click',this.#selectBinded)
                if(!flag){
                    const click = new Event('click')
                    child.dispatchEvent(click)
                    flag=true
                }
                if(!child.querySelector('.childTitle')){
                    const title=document.createElement('h2')
                    title.classList.add('childTitle')
                    title.style.margin="10px"
                    title.style.fontSize="24px"
                    title.innerText=""
                    child.insertBefore(title,child.querySelector('section'))
                }
            }
        }
    }

    addContent(sectionContent,gen,id){//aggiunge un nuovo oggetto (sectionContent) nella lista dei contenuti del child scelto
        if(gen && id){
            const child=this.#layoutContainer.querySelector(".child[data-gen=\'"+gen+"\'][data-id=\'"+id+"\']")
            if(child && child!==this.#layoutContainer) {
                this.#showSaveButton()
                this.#content["[data-gen=\'"+gen+"\']"]["[data-id=\'"+id+"\']"].push(sectionContent)
            }
            else console.log("scegli una sezione")
        } else if(this.#lastSelected!==this.#layoutContainer){
            this.#showSaveButton()
            this.#content["[data-gen=\'"+this.#lastSelected.dataset.gen+"\']"]["[data-id=\'"+this.#lastSelected.dataset.id+"\']"].push(sectionContent)
        } else {
            console.log("scegli una sezione")
        }
        console.log(this.#content)
    }

    removeContent(index,gen,id){//rimuove un oggetto dalla lista dei contenuti del child scelto, tramite la sua posizione in lista
        if(gen && id){
            const child=this.#layoutContainer.querySelector(".child[data-gen=\'"+gen+"\'][data-id=\'"+id+"\']")
            if(child && child!==this.#layoutContainer) {
                this.#showSaveButton()
                this.#content["[data-gen=\'"+gen+"\']"]["[data-id=\'"+id+"\']"].splice(index,1)
            }
            else console.log("scegli una sezione")
        } else if(this.#lastSelected!==this.#layoutContainer){
            this.#showSaveButton()
            this.#content["[data-gen=\'"+this.#lastSelected.dataset.gen+"\']"]["[data-id=\'"+this.#lastSelected.dataset.id+"\']"].splice(index,1)
        } else {
            console.log("scegli una sezione")
        }
        console.log(this.#content)
    }

    getContent(gen,id){//ritorna la lista dei contenuti del child scelto
        if(gen && id){
            const child=this.#layoutContainer.querySelector(".child[data-gen=\'"+gen+"\'][data-id=\'"+id+"\']")
            if(child && child!==this.#layoutContainer) {
                return this.#content["[data-gen=\'"+gen+"\']"]["[data-id=\'"+id+"\']"]
            }
            else console.log("scegli una sezione")
        } else if(this.#lastSelected!==this.#layoutContainer){
            return this.#content["[data-gen=\'"+this.#lastSelected.dataset.gen+"\']"]["[data-id=\'"+this.#lastSelected.dataset.id+"\']"]
        } else console.log("scegli una sezione")
    }

    getLastSelected(){//ritorna l'ultimo child selezionato
        return this.#lastSelected
    }

    getLayoutMenu(){//ritorna il menu per poter modificare il layout
        return this.#layoutMenu
    }

    getLayoutContainer(){//ritorna il layout
        return this.#layoutContainer
    }

    getLayoutID(){
        return this.#layoutContainer.dataset.layout
    }

    isSaved(){//ritorna vero se il layout è salvato, falso altrimenti (ovvero quando sono apportate modifiche dopo l'ultimo salvataggio)
        return this.#saved
    }

    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    #showSaveButton(){//mostra il bottone per salvare, è necessario averlo dentro ogni metodo della classe che apporta modifiche
        this.#saveButton.classList.remove("hidden")
        this.#saveButton.innerText=this.#saveButtonInnerText
        this.#saved=false
    }

    #setSize(lastSelected, formLayout){//è una funzione che chiamo ogni qualvolta voglio mostrare i campi per l'inserimento
        //della larghezza, altezza e margini che mostreranno inizialmente le dimensioni attuali del div selezionato
    let lastSelectedFlexDirection=lastSelected.style.flexDirection
    formLayout.flexDirection.value=lastSelectedFlexDirection
    
    formLayout.querySelector('#sizeCommands').classList.remove("hidden")
    let lastSelectedWidth=lastSelected.style.width.substring(5,lastSelected.style.width.length)
    lastSelectedWidth=lastSelectedWidth.split("%")[0]
    formLayout.width.value=lastSelectedWidth
    
    let lastSelectedHeight=lastSelected.style.height.substring(5,lastSelected.style.height.length)
    lastSelectedHeight=lastSelectedHeight.split("%")[0]
    formLayout.height.value=lastSelectedHeight
    
    let lastSelectedMarginTop=parseInt(lastSelected.style.marginTop.split("%")[0])
    formLayout.marginTop.value=lastSelectedMarginTop
    
    let lastSelectedMarginRight=parseInt(lastSelected.style.marginRight.split("%")[0])
    formLayout.marginRight.value=lastSelectedMarginRight
    
    let lastSelectedMarginBottom=parseInt(lastSelected.style.marginBottom.split("%")[0])
    formLayout.marginBottom.value=lastSelectedMarginBottom
    
    let lastSelectedMarginLeft=parseInt(lastSelected.style.marginLeft.split("%")[0])
    formLayout.marginLeft.value=lastSelectedMarginLeft
    
    }
    
    #setChild(child,titleText,titleSize){//è una funzione che chiamo ogni qualvolta voglio inserire titolo e sezione in un div
        child.style.display="flex"
        child.style.flexDirection="column"
        const title=document.createElement('h2')
        title.classList.add('childTitle')
        title.style.margin="10px"
        title.style.fontSize=titleSize+"px"
        title.innerText=titleText
        child.appendChild(title)
        const section=document.createElement('section')
        section.style.width="100%"
        child.appendChild(section)
    }
    
    #select(event){//è la funzione che mi permette di selezionare il div che clicco
        this.#addChildButton.classList.add("hidden")
        this.#removeChildButton.classList.add("hidden")
        if(this.#lastSelected!==this.#layoutContainer)this.#lastSelected.style.borderStyle="solid"
        else this.#lastSelected.style.borderStyle=""
        this.#lastSelected=event.currentTarget
        const gen=this.#lastSelected.dataset.gen
        if(document.querySelectorAll("[data-gen=\'"+gen+"\']").length>2) this.#removeChildButton.classList.remove("hidden")
        else this.#removeChildButton.classList.add("hidden")
        this.#lastSelected.style.borderStyle="dashed"
        this.#setSize(this.#lastSelected, this.#formLayout)
        this.#levelButton.classList.remove("hidden")
        this.#titleCommands[0].classList.remove("hidden")
        this.#titleCommands[1].classList.remove("hidden")
        const childs=this.#lastSelected.querySelectorAll('.child')
        if(childs.length>0){
            this.#splitCommands.classList.add("hidden")
            this.#deleteButton.classList.remove("hidden")
        } else {
            this.#splitCommands.classList.remove("hidden")
            this.#deleteButton.classList.add("hidden")
            this.#formLayout.title.value=this.#lastSelected.childNodes[0].innerText
            this.#formLayout.fontSize.value=this.#lastSelected.childNodes[0].style.fontSize.split('px')[0]
        }
    }

    #split(event){//è la funzione che mi permette di generare gli N figli dentro il div attualmente selezionato
        event.preventDefault()
        this.#showSaveButton()
        this.#gen++
        this.#content["[data-gen=\'"+this.#gen+"\']"]=[]
        if(this.#lastSelected.dataset.gen!=0)delete this.#content["[data-gen=\'"+this.#lastSelected.dataset.gen+"\']"]["[data-id=\'"+this.#lastSelected.dataset.id+"\']"]
        this.#lastSelected.innerHTML="" //lastSelected è il div "padre" che è stato selezionato per essere suddiviso
        this.#lastSelected.classList.add("hasChilds")
        this.#lastSelected.removeEventListener('click',this.#selectBinded)
        this.#lastSelected.style.display="flex"
        this.#lastSelected.style.flexDirection=this.#formLayout.flexDirection.value
        const color=this.getRandomColor()
        const N=this.#formLayout.numSplit.value
        for(let i=1; i<=N;i++){//generazione degli N figli
            const child=document.createElement('div')
            child.classList.add("child")
            child.dataset.gen=this.#gen
            child.dataset.id=i
            child.dataset.parent_gen=this.#lastSelected.dataset.gen
            child.dataset.parent_id=this.#lastSelected.dataset.id
            child.style.margin="1px"
            child.style.border="1px solid "+color
            child.style.flexShrink="0"
            child.style.overflow="auto"
            const size1="calc("+100/N+"% - 4px)"//sottraggo dalla percentuale la quantità 2*(larghezzaMargine+larghezzaBordo)
            const size2="calc("+100+"% - 4px)"
            if(this.#formLayout.flexDirection.value.split("-")[0]==="row"){
                child.style.width=size1
                child.style.height=size2
            } else {
                child.style.height=size1
                child.style.width=size2
            }
            this.#setChild(child,"Inserisci un titolo",24)//imposto il titolo e la section nel figlio appena creato
            child.addEventListener('click',this.#selectBinded) //lo rendo selezionabile
            this.#lastSelected.appendChild(child) //lo inserisco nel padre
            this.#counter.innerText++
            this.#content["[data-gen=\'"+this.#gen+"\']"]["[data-id=\'"+i+"\']"]=[]
        }
        const click= new Event('click') //adesso seleziono il primo figlio, come se, dopo aver generato tutti i figli, facessi click sul primo
        this.#lastSelected.querySelector('.child[data-id=\'1\']').dispatchEvent(click)//dunque dopo questa istruzione lastSelected diventerà il primo figlio che è stato generato dentro il padre (l'ex lastSelected, vedi il funzionamento di select())
        console.log(this.#content)
    }
    
    #selectLevel(){//è la funzione che mi permette di selezionare il padre del div attualmente selezionato
        this.#addChildButton.classList.remove("hidden")
        this.#deleteButton.classList.remove("hidden")
        this.#lastSelected.style.borderStyle="solid"
        this.#lastSelected=this.#lastSelected.parentNode
        const gen=this.#lastSelected.dataset.gen
        if(document.querySelectorAll("[data-gen=\'"+gen+"\']").length>2) this.#removeChildButton.classList.remove("hidden")
        else this.#removeChildButton.classList.add("hidden")
        if(this.#lastSelected!==this.#layoutContainer) {
            this.#setSize(this.#lastSelected, this.#formLayout)
        }else{
            const lastSelectedFlexDirection=this.#lastSelected.style.flexDirection
            this.#formLayout.flexDirection.value=lastSelectedFlexDirection
            this.#levelButton.classList.add("hidden")
            this.#sizeCommands.classList.add("hidden")
        }
        this.#lastSelected.style.borderStyle="dashed"
        this.#splitCommands.classList.add("hidden")
    }
    
    #sizeUpdate(){//aggiorna le dimensioni del div selezionato, impostandole al valore che metto in input nel form, stessa cosa per marginUpdate,titleUpdate,fontUpdate
        this.#showSaveButton()
        const border=parseInt(this.#lastSelected.style.borderWidth.split("px")[0])
        this.#lastSelected.style.width="calc("+this.#formLayout.width.value+"% - "+(parseInt(this.#formLayout.marginRight.value)+parseInt(this.#formLayout.marginLeft.value)+2*border)+"px)"
        this.#lastSelected.style.height="calc("+this.#formLayout.height.value+"% - "+(parseInt(this.#formLayout.marginBottom.value)+parseInt(this.#formLayout.marginTop.value)+2*border)+"px)"
        
    }
    
    #marginUpdate(){//aggiorna le dimensioni dei margini del div selezionato
        this.#showSaveButton()
        const border=parseInt(this.#lastSelected.style.borderWidth.split("px")[0])
        this.#lastSelected.style.margin=this.#formLayout.marginTop.value+"px "+this.#formLayout.marginRight.value+"px "+this.#formLayout.marginBottom.value+"px "+this.#formLayout.marginLeft.value+"px "
        this.#lastSelected.style.width="calc("+this.#formLayout.width.value+"% - "+(parseInt(this.#formLayout.marginRight.value)+parseInt(this.#formLayout.marginLeft.value)+2*border)+"px)"
        this.#lastSelected.style.height="calc("+this.#formLayout.height.value+"% - "+(parseInt(this.#formLayout.marginBottom.value)+parseInt(this.#formLayout.marginTop.value)+2*border)+"px)"
        
    }
    
    #titleUpdate(){//aggiorna il titolo del div selezionato
        this.#showSaveButton()
        this.#lastSelected.childNodes[0].innerText=this.#formLayout.title.value
        
    }
    
    #fontUpdate(){//aggiorna le dimensioni del font del titolo
        this.#showSaveButton()
        this.#lastSelected.childNodes[0].style.fontSize=this.#formLayout.fontSize.value+"px"
        
    }
    
    #flexDirectionUpdate(){//cambia la flex-direction del div selezionato e di conseguenza anche dei div figli che contengono altri figli
        if(this.#lastSelected.classList.contains('hasChilds') && this.#formLayout.flexDirection.value!==this.#lastSelected.style.flexDirection){
            this.#showSaveButton()
            if(this.#formLayout.flexDirection.value.split("-")[0]!==this.#lastSelected.style.flexDirection.split("-")[0]){
                this.#lastSelected.style.flexDirection=this.#formLayout.flexDirection.value
                const childs = this.#lastSelected.querySelectorAll(".child")
                for(const child of childs){
                    const height=child.style.height
                    child.style.height=child.style.width
                    child.style.width=height
                    if(child.classList.contains('hasChilds')){
                        if(child.style.flexDirection==="row") child.style.flexDirection="column"
                        else if(child.style.flexDirection==="row-reverse") child.style.flexDirection="column-reverse"
                        else if(child.style.flexDirection==="column") child.style.flexDirection="row"
                        else if(child.style.flexDirection==="column-reverse") child.style.flexDirection="row-reverse"
                    }
                    if(child.parentNode.style.flexDirection.split("-")[0]==="row"){
                        const marginRight=child.style.marginRight
                        child.style.marginRight=child.style.marginBottom
                        child.style.marginBottom=child.style.marginLeft
                        child.style.marginLeft=child.style.marginTop
                        child.style.marginTop=marginRight
                    } else {
                        const marginTop=child.style.marginTop
                        child.style.marginTop=child.style.marginLeft
                        child.style.marginLeft=child.style.marginBottom
                        child.style.marginBottom=child.style.marginRight
                        child.style.marginRight=marginTop
                    }
                }
            } else {
                this.#lastSelected.style.flexDirection=this.#formLayout.flexDirection.value
            }
            
        }
    }

    #addChild(){//aggiunge un div figlio dentro il div selezionato (che contiene almeno 2 figli)
        this.#showSaveButton()
        const child=document.createElement('div')
        child.classList.add("child")
        child.dataset.gen=this.#lastSelected.childNodes[1].dataset.gen
        child.dataset.id=parseInt(this.#lastSelected.childNodes[this.#lastSelected.childNodes.length-1].dataset.id)+1
        child.dataset.parent_gen=this.#lastSelected.dataset.gen
        child.dataset.parent_id=this.#lastSelected.dataset.id
        child.style.margin="1px"
        child.style.border="1px solid "+this.#lastSelected.childNodes[1].style.borderColor
        child.style.flexShrink="0"
        child.style.overflow="auto"
        const N=this.#lastSelected.childNodes.length+1
        const size1="calc("+100/N+"% - 4px)"//sottraggo dalla percentuale la quantità 2*(larghezzaMargine+larghezzaBordo)
        const size2="calc("+100+"% - 4px)"
        if(this.#lastSelected.style.flexDirection==="row"){
            child.style.width=size1
            child.style.height=size2
        } else {
            child.style.height=size1
            child.style.width=size2
        }
        this.#setChild(child,"Inserisci un titolo",24)//imposto il titolo e la section nel figlio appena creato
        child.addEventListener('click',this.#selectBinded) //lo rendo selezionabile
        this.#lastSelected.appendChild(child) //lo inserisco nel padre
        this.#content["[data-gen=\'"+child.dataset.gen+"\']"]["[data-id=\'"+child.dataset.id+"\']"]=[]
        this.#counter.innerText++
        console.log(this.#content)
    }

    #removeChild(){//rimuove un div figlio dal div selezionato (solo se contiene più di 2 figli)
        this.#showSaveButton()
        const parent=this.#lastSelected.parentNode
        const length=this.#lastSelected.querySelectorAll('.child').length+1
        this.#lastSelected.remove()
        delete this.#content["[data-gen=\'"+this.#lastSelected.dataset.gen+"\']"]["[data-id=\'"+this.#lastSelected.dataset.id+"\']"]
        this.#counter.innerText-=length
        const click=new Event('click')
        parent.querySelector('.child').dispatchEvent(click)
        console.log(this.#content)

    }

    #deleteChilds(){//rimuove tutti i figli del div selezionato (comprendendo anche i figli dei figli)
        const childs=this.#lastSelected.querySelectorAll(".child")
        this.#addChildButton.classList.add("hidden")
        this.#removeChildButton.classList.add("hidden")
        for(let child of childs){
            delete this.#content["[data-gen=\'"+child.dataset.gen+"\']"]
            child.remove()
            this.#counter.innerText--
        }
        if(!this.#content["[data-gen=\'"+this.#lastSelected.dataset.gen+"\']"] && this.#lastSelected!==this.#layoutContainer) this.#content["[data-gen=\'"+this.#lastSelected.dataset.gen+"\']"]=[]
        if(this.#lastSelected!==this.#layoutContainer)this.#content["[data-gen=\'"+this.#lastSelected.dataset.gen+"\']"]["[data-id=\'"+this.#lastSelected.dataset.id+"\']"]=[]
        this.#lastSelected.classList.remove("hasChilds")
        if(this.#counter.innerText==0){
            this.#saveButton.classList.add("hidden")
            this.#titleCommands[0].classList.add("hidden")
            this.#titleCommands[1].classList.add("hidden")
        }
        else {
            this.#showSaveButton()
            this.#lastSelected.addEventListener('click',this.#selectBinded)
            this.#setChild(this.#lastSelected,"Inserisci un titolo",24)
            this.#formLayout.title.value="Inserisci un titolo"
            this.#formLayout.fontSize.value=24
            this.#titleCommands[0].classList.remove("hidden")
            this.#titleCommands[1].classList.remove("hidden")
            this.#setSize(this.#lastSelected, this.#formLayout)
        }
        this.#deleteButton.classList.add("hidden")
        this.#splitCommands.classList.remove("hidden")
        console.log(this.#content)
    }

}

