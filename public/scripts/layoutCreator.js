class LayoutCreator {
    //dichiarazione dei campi privati
    #gen
    #saved
    #layoutMenu
    #levelButton
    #deleteButton
    #saveButton
    #originalSaveButton
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
    #layoutHeightUpdateBinded
    #borderColorUpdateBinded
    #borderWidthUpdateBinded
    #borderRadiusUpdateBinded
    #backgroundColorUpdateBinded
    #marginUpdateBinded
    #flexDirectionUpdateBinded
    #deleteChildsBinded
    constructor(saveButton,height,width){//crea il layoutMenu associandogli tutti gli event listener necessari per le modifiche e imposta il layoutContainer inizialmente vuoto
        this.#gen=0
        this.#saved=true

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

        if(saveButton){
            this.#saveButton=saveButton
            this.#saveButton.classList.add("hidden")
            this.#originalSaveButton=saveButton.cloneNode(true)
        }

        this.#addChildButton=document.createElement('button')
        this.#addChildButton.id="addChildButton"
        this.#addChildButton.innerText="Aggiungi sezione"

        this.#removeChildButton=document.createElement('button')
        this.#removeChildButton.classList.add("hidden")
        this.#removeChildButton.id="removeChildButton"
        this.#removeChildButton.innerText="Rimuovi sezione"

        if(saveButton)this.#layoutMenu.appendChild(this.#saveButton)//Se è stato passato il parametro 'saveButton' nel costruttore, lo appendiamo al menù
        this.#layoutMenu.appendChild(this.#levelButton)//'Seleziona livello superiore'
        this.#layoutMenu.appendChild(this.#deleteButton)//'Svuota sezione'
        this.#layoutMenu.appendChild(this.#addChildButton)//'Aggiungi sezione'
        this.#layoutMenu.appendChild(this.#removeChildButton)//'Rimuovi sezione'

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
            "Modifica altezza layout (px):",
            "Modifica colore di sfondo: ",
            "Modifica colore del bordo: ",
            "Modifica raggio del bordo (px): ",
            "Modifica spessore del bordo (px): ",
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
                "name":"layoutHeight",
                "type":"number",
                "min":0
            },{
                "name":"backgroundColor",
                "type":"color",
                "value":"#ffffff"
            },{
                "name":"borderColor",
                "type":"color",
                "value":"#ffffff"
            },{
                "min":0,
                "name":"borderRadius",
                "type":"number"
            },{
                "min":0,
                "name":"borderWidth",
                "type":"number"
            },{
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
        for(let i=0;i<15;i++){
            const labels=document.createElement('label')
            labels.innerText=labelsText[i]
            if(i<14){
                const input=document.createElement('input')
                for(let key of Object.keys(inputsInfos[i])){
                    input[key]=inputsInfos[i][key]
                }
                labels.appendChild(input)
                if(i<=4) this.#formLayout.appendChild(labels)
                else if(i>4 && i<11) this.#sizeCommands.appendChild(labels)
                else if(i===11 || i===12) {
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
        this.#layoutContainer.dataset.layout_id="new"
        this.#layoutContainer.style.height=height
        this.#layoutContainer.style.width=width
        this.#layoutContainer.dataset.id=0
        this.#layoutContainer.dataset.gen=0
        this.#layoutContainer.style.flexShrink=0
        this.#layoutContainer.style.overflow="auto"
        this.#layoutContainer.style.borderColor="#000000"
        this.#layoutContainer.style.borderRadius="0px"
        this.#layoutContainer.style.borderWidth="0px"
        this.#layoutContainer.dataset.noBorder=true
        this.#layoutContainer.style.borderStyle="solid"
        this.#layoutContainer.style.backgroundColor="#ffffff"
        
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

        this.#layoutHeightUpdateBinded=this.#layoutHeightUpdate.bind(this)
        this.#formLayout.layoutHeight.addEventListener('change',this.#layoutHeightUpdateBinded)

        this.#borderColorUpdateBinded=this.#borderColorUpdate.bind(this)
        this.#formLayout.borderColor.addEventListener('change',this.#borderColorUpdateBinded)

        this.#borderWidthUpdateBinded=this.#borderWidthUpdate.bind(this)
        this.#formLayout.borderWidth.addEventListener('change',this.#borderWidthUpdateBinded)

        this.#borderRadiusUpdateBinded=this.#borderRadiusUpdate.bind(this)
        this.#formLayout.borderRadius.addEventListener('change',this.#borderRadiusUpdateBinded)

        this.#backgroundColorUpdateBinded=this.#backgroundColorUpdate.bind(this)
        this.#formLayout.backgroundColor.addEventListener('change',this.#backgroundColorUpdateBinded)

        this.#marginUpdateBinded=this.#marginUpdate.bind(this)
        this.#formLayout.marginTop.addEventListener('change',this.#marginUpdateBinded)
        this.#formLayout.marginRight.addEventListener('change',this.#marginUpdateBinded)
        this.#formLayout.marginBottom.addEventListener('change',this.#marginUpdateBinded)
        this.#formLayout.marginLeft.addEventListener('change',this.#marginUpdateBinded)

        this.#flexDirectionUpdateBinded=this.#flexDirectionUpdate.bind(this)
        this.#formLayout.flexDirection.addEventListener('change',this.#flexDirectionUpdateBinded)

        this.#deleteChildsBinded=this.#deleteChilds.bind(this)
        this.#deleteButton.addEventListener('click',this.#deleteChildsBinded)

        this.#setBorderAndBackground(this.#lastSelected)
        
    }

    async loadLayout(layout,endpoint,modify){
        this.#layoutContainer.innerHTML=""
        this.#counter.innerText=0
        for(let property of Object.keys(layout)){
            if(property!=="id" && property!=="childs"){
                this.#layoutContainer.style[property]=layout[property]
            }
        }
        this.#layoutContainer.dataset.layout_id=layout.id
        this.#layoutContainer.classList.add("hasChilds")
        
        let flag=false
        for(let child of layout.childs){
            const childNode=document.createElement('div')


            for(let property of Object.keys(child.style)){
                childNode.style[property]=child.style[property]
            }
            childNode.style.borderStyle="solid"
            childNode.style.overflow="auto"
            childNode.style.flexShrink="0";


            if(childNode.style.borderWidth==="0px") childNode.dataset.noBorder=true
            else childNode.dataset.noBorder=false
            for(let data of Object.keys(child.dataset)){
                    childNode.dataset[data]=child.dataset[data]
            }

            childNode.classList.add("child")
            if(child.hasChilds==1) {
                childNode.classList.add("hasChilds")
            } else if(child.title.innerText && child.title.innerText!=="") this.#setChild(childNode,child.title.innerText,child.title.fontSize.split('px')[0])
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
            if(child.hasChilds!=1) childNode.classList.add("noChilds")

            let parent
            if(child.dataset.parent_gen==="0" && child.dataset.parent_id==="0") parent=this.#layoutContainer
            else parent=this.#layoutContainer.querySelector("[data-gen=\'"+child.dataset.parent_gen+"\'][data-id=\'"+child.dataset.parent_id+"\']")
            parent.appendChild(childNode)


            this.#counter.innerText++
            this.#gen=child.dataset.gen
        }
        await fetch(endpoint).then(function(response){
            return response.json()
        }).then((function(html){
            const sections=this.getAllSections()
            for(const section of sections){
                if(html[section.parentNode.dataset.gen][section.parentNode.dataset.id])
                section.innerHTML=html[section.parentNode.dataset.gen][section.parentNode.dataset.id]
            }
            return true
        }).bind(this),(function(){
            console.log("Content not found for layout "+this.#layoutContainer.dataset.layout_id)
            return "Content not found for layout "+this.#layoutContainer.dataset.layout_id
        }).bind(this))
    }

    saveLayout(){
        let borderWidth
        if(this.#layoutContainer.dataset.noBorder==="true") borderWidth="0px"
        else borderWidth=this.#layoutContainer.style.borderWidth
        const layout={
            "id": this.#layoutContainer.dataset.layout_id,
            "display": this.#layoutContainer.style.display,
            "flexDirection": this.#layoutContainer.style.flexDirection,
            "height": this.#layoutContainer.style.height,
            "width": this.#layoutContainer.style.width,
            "borderColor": this.#layoutContainer.style.borderColor,
            "borderRadius": this.#layoutContainer.style.borderRadius,
            "borderWidth": borderWidth,
            "backgroundColor": this.#layoutContainer.style.backgroundColor,
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
                    if(child.childNodes[0].innerText===""){
                        title=null,
                        fontSize=null
                    } else {
                        title=child.childNodes[0].innerText
                        fontSize=child.childNodes[0].style.fontSize
                    }
                }
                let borderWidth
                if(child.dataset.noBorder==="true") borderWidth="0px"
                else borderWidth=child.style.borderWidth
                layout.childs.push({
                    "dataset": {
                        "gen": child.dataset.gen,
                        "id": child.dataset.id,
                        "parent_gen": child.dataset.parent_gen,
                        "parent_id": child.dataset.parent_id
                    },
                    "style": {
                        "display": child.style.display,
                        "flexDirection": child.style.flexDirection,
                        "height": child.style.height,
                        "width": child.style.width,
                        "margin": child.style.margin,
                        "borderColor": child.style.borderColor,
                        "borderRadius": child.style.borderRadius,
                        "borderWidth": borderWidth,
                        "backgroundColor": child.style.backgroundColor
                    },
                    "title": {
                        "innerText": title,
                        "fontSize": fontSize
                    },
                    "hasChilds": child.classList.contains("hasChilds"),
                })
            }
        }
        this.#saved=true
        return layout
    }

    showSaveButton(){//mostra il bottone per salvare, è necessario averlo dentro ogni metodo della classe che apporta modifiche
        if(this.#saveButton){
            if(this.#layoutContainer.querySelector(".child")){
                this.#saveButton.innerHTML=this.#originalSaveButton.innerHTML
                this.#saveButton.classList.remove("hidden")
                this.#saved=false
            }
        }
    }

    quit(){//termina le modifiche (senza salvare)
        const childs=this.#layoutContainer.querySelectorAll('.child')
        for(const child of childs){
            child.removeEventListener('click',this.#selectBinded)
            if(!child.classList.contains("hasChilds") && child.querySelector('.childTitle')){
                if(child.querySelector('.childTitle').innerText==="")child.querySelector('.childTitle').remove()
            }
        }
        if(this.#lastSelected!==this.#layoutContainer)this.#lastSelected.style.borderStyle="solid"
        this.#saveButton.classList.add("hidden")
    }

    modify(){//rende modificabile il layout (aggiunge gli event listener per poter selezionare i child e apportare le modifiche utilizzando il layoutMenu)
        this.#lastSelected=this.#layoutContainer
        const childs=this.#layoutContainer.querySelectorAll('.child')
        for(const child of childs){
            if(!child.classList.contains("hasChilds")) {
                child.addEventListener('click',this.#selectBinded)
                if(!child.querySelector('.childTitle')){
                    const title=document.createElement('h2')
                    title.classList.add('childTitle')
                    title.style.margin="10px"
                    title.style.fontSize="24px"
                    title.innerText=""
                    child.insertBefore(title,child.querySelector('.childSection'))
                }
            }
        }
        for(const child of childs){
            if(!child.classList.contains("hasChilds")){
                const click = new Event('click')
                child.dispatchEvent(click)
                break
            }
        }
    }

    getSection(gen,id){
        if(gen && id) return this.#layoutContainer.querySelector(".child[data-gen=\'"+gen+"\'][data-id=\'"+id+"\']").querySelector('section')
        else return this.#lastSelected.querySelector('.childSection')
    }

    getAllSections(){
        return this.#layoutContainer.querySelectorAll('.childSection')
    }

    getGen(){
        return this.#gen
    }

    getSectionsByGen(gen){
        const childs=this.#layoutContainer.querySelectorAll(".noChilds[data-gen=\'"+gen+"\']")
        let sections=[]
        for(const child of childs){
            sections.push(child.querySelector('.childSection'))
        }
        return sections
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
        return this.#layoutContainer.dataset.layout_id
    }

    setLayoutID(layoutID){
        this.#layoutContainer.dataset.layout_id=layoutID
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

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    #setSize(lastSelected){//è una funzione che chiamo ogni qualvolta voglio mostrare i campi per l'inserimento
        //della larghezza, altezza e margini che mostreranno inizialmente le dimensioni attuali del div selezionato
        const lastSelectedFlexDirection=lastSelected.style.flexDirection
        this.#formLayout.flexDirection.value=lastSelectedFlexDirection

        this.#formLayout.querySelector('#sizeCommands').classList.remove("hidden")
        let lastSelectedWidth=lastSelected.style.width.substring(5,lastSelected.style.width.length)
        lastSelectedWidth=lastSelectedWidth.split("%")[0]
        this.#formLayout.width.value=lastSelectedWidth

        let lastSelectedHeight=lastSelected.style.height.substring(5,lastSelected.style.height.length)
        lastSelectedHeight=lastSelectedHeight.split("%")[0]
        this.#formLayout.height.value=lastSelectedHeight

        const lastSelectedMarginTop=parseInt(lastSelected.style.marginTop.split("%")[0])
        this.#formLayout.marginTop.value=lastSelectedMarginTop

        const lastSelectedMarginRight=parseInt(lastSelected.style.marginRight.split("%")[0])
        this.#formLayout.marginRight.value=lastSelectedMarginRight

        const lastSelectedMarginBottom=parseInt(lastSelected.style.marginBottom.split("%")[0])
        this.#formLayout.marginBottom.value=lastSelectedMarginBottom

        const lastSelectedMarginLeft=parseInt(lastSelected.style.marginLeft.split("%")[0])
        this.#formLayout.marginLeft.value=lastSelectedMarginLeft
    }
    
    #setBorderAndBackground(lastSelected){
        let lastSelectedBackgroundColor=lastSelected.style.backgroundColor
        const components=lastSelectedBackgroundColor.substring(4,lastSelectedBackgroundColor.length-1).split(", ")
        lastSelectedBackgroundColor=this.rgbToHex(parseInt(components[0]),parseInt(components[1]),parseInt(components[2]))
        this.#formLayout.backgroundColor.value=lastSelectedBackgroundColor

        let lastSelectedborderColor=lastSelected.style.borderColor
        const components1=lastSelectedborderColor.substring(4,lastSelectedborderColor.length-1).split(", ")
        lastSelectedborderColor=this.rgbToHex(parseInt(components1[0]),parseInt(components1[1]),parseInt(components1[2]))
        this.#formLayout.borderColor.value=lastSelectedborderColor
        
        const lastSelectedborderWidth=parseInt(lastSelected.style.borderWidth.split("px")[0])
        this.#formLayout.borderWidth.value=lastSelectedborderWidth

        const lastSelectedborderRadius=parseInt(lastSelected.style.borderRadius.split("px")[0])
        this.#formLayout.borderRadius.value=lastSelectedborderRadius
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
        section.classList.add('childSection')
        child.appendChild(section)
    }
    
    #select(event){//è la funzione che mi permette di selezionare il div che clicco
        this.#removeChildButton.classList.remove("hidden")
        this.#lastSelected.style.borderStyle="solid"
        this.#levelButton.classList.remove("hidden")
        this.#titleCommands[0].classList.remove("hidden")
        this.#titleCommands[1].classList.remove("hidden")
        if(this.#lastSelected.dataset.noBorder==="true") this.#lastSelected.style.borderWidth="0px"
        this.#lastSelected=event.currentTarget
        this.#lastSelected.style.borderStyle="dashed"
        if(this.#lastSelected.style.borderWidth==="0px") this.#lastSelected.style.borderWidth="1px"
        this.#setSize(this.#lastSelected)
        this.#setBorderAndBackground(this.#lastSelected)
        if(this.#lastSelected.classList.contains('hasChilds')){
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
        this.#gen++
        this.#lastSelected.innerHTML="" //lastSelected è il div "padre" che è stato selezionato per essere suddiviso
        this.#lastSelected.classList.add("hasChilds")
        this.#lastSelected.classList.remove("noChilds")
        this.#lastSelected.removeEventListener('click',this.#selectBinded)
        this.#lastSelected.style.display="flex"
        this.#lastSelected.style.flexDirection=this.#formLayout.flexDirection.value
        const color=this.getRandomColor()
        const N=this.#formLayout.numSplit.value
        for(let i=1; i<=N;i++){//generazione degli N figli
            const child=document.createElement('div')
            child.classList.add("child")
            child.classList.add("noChilds")
            child.dataset.gen=this.#gen
            child.dataset.id=i
            child.dataset.parent_gen=this.#lastSelected.dataset.gen
            child.dataset.parent_id=this.#lastSelected.dataset.id
            child.style.margin="1px"
            child.style.borderColor=color
            child.style.borderWidth="1px"
            child.style.borderStyle="solid"
            child.style.borderRadius="0px"
            child.style.flexShrink="0"
            child.style.overflow="auto"
            child.style.backgroundColor="#ffffff"
            child.style.borderRadius="0px"
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
        }
        const click= new Event('click') //adesso seleziono il primo figlio, come se, dopo aver generato tutti i figli, facessi click sul primo
        this.#lastSelected.querySelector('.child[data-id=\'1\']').dispatchEvent(click)//dunque dopo questa istruzione lastSelected diventerà il primo figlio che è stato generato dentro il padre (l'ex lastSelected, vedi il funzionamento di select())
        this.showSaveButton()
        
    }
    
    #selectLevel(){//è la funzione che mi permette di selezionare il padre del div attualmente selezionato
        this.#deleteButton.classList.remove("hidden")
        this.#lastSelected.style.borderStyle="solid"
        if(this.#lastSelected.dataset.noBorder==="true") this.#lastSelected.style.borderWidth="0px"
        this.#lastSelected=this.#lastSelected.parentNode
        const gen=this.#lastSelected.dataset.gen
        this.#removeChildButton.classList.remove("hidden")
        this.#setBorderAndBackground(this.#lastSelected)
        if(this.#lastSelected!==this.#layoutContainer) {
            this.#setSize(this.#lastSelected)
        }else{
            const lastSelectedFlexDirection=this.#lastSelected.style.flexDirection
            this.#formLayout.flexDirection.value=lastSelectedFlexDirection
            this.#levelButton.classList.add("hidden")
            this.#sizeCommands.classList.add("hidden")
            this.#removeChildButton.classList.add("hidden")
        }
        this.#lastSelected.style.borderStyle="dashed"
        if(this.#lastSelected.style.borderWidth==="0px") this.#lastSelected.style.borderWidth="1px"
        this.#splitCommands.classList.add("hidden")
    }
    
    #sizeUpdate(){//aggiorna le dimensioni del div selezionato, impostandole al valore che metto in input nel form, stessa cosa per marginUpdate,titleUpdate,fontUpdate
        this.showSaveButton()
        const border=parseInt(this.#lastSelected.style.borderWidth.split("px")[0])
        this.#lastSelected.style.width="calc("+this.#formLayout.width.value+"% - "+(parseInt(this.#formLayout.marginRight.value)+parseInt(this.#formLayout.marginLeft.value)+2*border)+"px)"
        this.#lastSelected.style.height="calc("+this.#formLayout.height.value+"% - "+(parseInt(this.#formLayout.marginBottom.value)+parseInt(this.#formLayout.marginTop.value)+2*border)+"px)"
        
    }

    #layoutHeightUpdate(event){
        this.showSaveButton()
        this.#layoutContainer.style.height=event.currentTarget.value+"px"
    }

    #borderColorUpdate(){
        this.showSaveButton()
        this.#lastSelected.style.borderColor=this.#formLayout.borderColor.value
    }

    #borderWidthUpdate(){
        this.showSaveButton()
        this.#lastSelected.style.borderWidth=this.#formLayout.borderWidth.value+"px"
        if(this.#lastSelected!==this.#layoutContainer){
            const border=parseInt(this.#lastSelected.style.borderWidth.split("px")[0])
            this.#lastSelected.style.width="calc("+this.#formLayout.width.value+"% - "+(parseInt(this.#formLayout.marginRight.value)+parseInt(this.#formLayout.marginLeft.value)+2*border)+"px)"
            this.#lastSelected.style.height="calc("+this.#formLayout.height.value+"% - "+(parseInt(this.#formLayout.marginBottom.value)+parseInt(this.#formLayout.marginTop.value)+2*border)+"px)"
        }
        if(this.#formLayout.borderWidth.value==0)this.#lastSelected.dataset.noBorder=true
        else this.#lastSelected.dataset.noBorder=false
    }

    #borderRadiusUpdate(){
        this.showSaveButton()
        this.#lastSelected.style.borderRadius=this.#formLayout.borderRadius.value+"px"
    }

    #backgroundColorUpdate(){
        this.showSaveButton()
        this.#lastSelected.style.backgroundColor=this.#formLayout.backgroundColor.value
    }
    
    #marginUpdate(){//aggiorna le dimensioni dei margini del div selezionato
        this.showSaveButton()
        const border=parseInt(this.#lastSelected.style.borderWidth.split("px")[0])
        this.#lastSelected.style.margin=this.#formLayout.marginTop.value+"px "+this.#formLayout.marginRight.value+"px "+this.#formLayout.marginBottom.value+"px "+this.#formLayout.marginLeft.value+"px "
        this.#lastSelected.style.width="calc("+this.#formLayout.width.value+"% - "+(parseInt(this.#formLayout.marginRight.value)+parseInt(this.#formLayout.marginLeft.value)+2*border)+"px)"
        this.#lastSelected.style.height="calc("+this.#formLayout.height.value+"% - "+(parseInt(this.#formLayout.marginBottom.value)+parseInt(this.#formLayout.marginTop.value)+2*border)+"px)"
        
    }
    
    #titleUpdate(){//aggiorna il titolo del div selezionato
        this.showSaveButton()
        this.#lastSelected.childNodes[0].innerText=this.#formLayout.title.value
        
    }
    
    #fontUpdate(){//aggiorna le dimensioni del font del titolo
        this.showSaveButton()
        this.#lastSelected.childNodes[0].style.fontSize=this.#formLayout.fontSize.value+"px"
        
    }
    
    #flexDirectionUpdate(){//cambia la flex-direction del div selezionato e di conseguenza anche dei div figli che contengono altri figli
        if(this.#lastSelected.classList.contains('hasChilds') && this.#formLayout.flexDirection.value!==this.#lastSelected.style.flexDirection){
            this.showSaveButton()
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
        this.showSaveButton()
        const child=document.createElement('div')
        child.classList.add("child")
        child.dataset.parent_gen=this.#lastSelected.dataset.gen
        child.dataset.parent_id=this.#lastSelected.dataset.id
        if(this.#lastSelected.querySelector('.child')){
            child.dataset.gen=this.#lastSelected.childNodes[0].dataset.gen
            child.dataset.id=parseInt(this.#lastSelected.childNodes[this.#lastSelected.childNodes.length-1].dataset.id)+1
            child.style.borderColor=this.#lastSelected.childNodes[0].style.borderColor
        } else {
            this.#lastSelected.innerHTML=""
            this.#lastSelected.style.display="flex"
            this.#lastSelected.style.flexDirection=this.#formLayout.flexDirection.value
            this.#lastSelected.removeEventListener('click',this.#selectBinded)
            this.#lastSelected.classList.add("hasChilds")
            this.#lastSelected.classList.remove("noChilds")
            child.style.borderColor=this.getRandomColor()
            this.#splitCommands.classList.add("hidden")
            this.#gen++
            child.dataset.gen=this.#gen
            child.dataset.id=1
            this.#deleteButton.classList.remove("hidden")
        }
        
        
        child.style.margin="1px"
        child.style.borderWidth="1px"
        child.style.borderStyle="solid"
        child.style.borderRadius="0px"
        child.style.flexShrink="0"
        child.style.overflow="auto"
        child.style.backgroundColor="#ffffff"
        const N=this.#lastSelected.childNodes.length+1

        const size1="calc("+100/N+"% - 4px)"//sottraggo dalla percentuale la quantità 2*(larghezzaMargine+larghezzaBordo)
        const size2="calc("+100+"% - 4px)"
        if(this.#lastSelected.style.flexDirection.includes("row")){
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
        
    }

    #removeChild(){//rimuove un div figlio dal div selezionato (solo se contiene più di 2 figli)
        this.showSaveButton()
        if(this.#lastSelected.parentNode.querySelectorAll(".child[data-gen=\'"+this.#lastSelected.dataset.gen+"\']").length>1){
            const parent=this.#lastSelected.parentNode
            const length=this.#lastSelected.querySelectorAll('.child').length+1
            this.#lastSelected.remove()
            this.#counter.innerText-=length
            const click=new Event('click')
            parent.querySelector('.child').dispatchEvent(click)
        } else {
            const click=new Event('click')
            this.#levelButton.dispatchEvent(click)
            this.#deleteButton.dispatchEvent(click)
        }
        if(this.#counter.innerText==0) this.#gen=0
        
    }

    #deleteChilds(){//rimuove tutti i figli del div selezionato (comprendendo anche i figli dei figli)
        const childs=this.#lastSelected.querySelectorAll(".child")
        this.#removeChildButton.classList.add("hidden")
        for(let child of childs){
            child.remove()
            this.#counter.innerText--
        }
        this.#lastSelected.classList.remove("hasChilds")
        this.#lastSelected.classList.add("noChilds")
        this.#setBorderAndBackground(this.#lastSelected)
        if(this.#counter.innerText==0){
            this.#saveButton.classList.add("hidden")
            this.#titleCommands[0].classList.add("hidden")
            this.#titleCommands[1].classList.add("hidden")
        }
        else {
            this.showSaveButton()
            this.#lastSelected.addEventListener('click',this.#selectBinded)
            this.#setChild(this.#lastSelected,"Inserisci un titolo",24)
            this.#formLayout.title.value="Inserisci un titolo"
            this.#formLayout.fontSize.value=24
            this.#titleCommands[0].classList.remove("hidden")
            this.#titleCommands[1].classList.remove("hidden")
            this.#setSize(this.#lastSelected)
        }
        this.#deleteButton.classList.add("hidden")
        this.#splitCommands.classList.remove("hidden")
        if(this.#counter.innerText==0) this.#gen=0
        
    }
}

