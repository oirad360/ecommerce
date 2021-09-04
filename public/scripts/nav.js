function openNav(){
    const nav=document.querySelector('nav')
    nav.style.width="100vw"
    openNavButton.style.marginLeft="calc(100vw - 70px)"
    openNavButton.style.position="fixed"
    openNavButton.style.zIndex="2"
    document.body.style.overflow="hidden"
    openNavButton.removeEventListener('click',openNav)
    openNavButton.addEventListener('click',closeNav)
}

function closeNav(){
    const nav=document.querySelector('nav')
    nav.style.width=""
    openNavButton.style.position=""
    openNavButton.style.zIndex=""
    openNavButton.style.marginLeft="0px"
    document.body.style.overflow=""
    openNavButton.removeEventListener('click',closeNav)
    openNavButton.addEventListener('click',openNav)
}

function searchProducts(event){
    const form=event.currentTarget.parentNode
    const box=form.parentNode.querySelector('.searchResults')
    box.innerHTML=""
    box.classList.add("hidden")
    if(form.q.value!==""){
        const data={method:'POST', body: new FormData(form)}
        fetch(app_url+"/searchProducts",data).then(onResponse).then(function(json){
            if(json.length>0 && form.search.value!==""){
                for(const item of json){
                    const row=document.createElement('a')
                    row.classList.add('result')
                    const product=document.createElement('span')
                    product.innerText=item.title
                    row.appendChild(product)
                    const seller=document.createElement('span')
                    seller.innerText=item.seller
                    row.appendChild(seller)
                    row.href=app_url+"/reviews/"+item.id
                    box.appendChild(row)
                    box.classList.remove("hidden")
                }
            } else {
                box.innerHTML=""
                box.classList.add("hidden")
            }
        })
    }
}


function showSearchedProducts(event){
    if(form.q.value==="") event.preventDefault()
}

const openNavButton=document.querySelector('#navOpen')
openNavButton.addEventListener('click',openNav)

const form=document.querySelector('form[name=searchProducts]')
form.q.addEventListener('keyup', searchProducts)
form.c.addEventListener('change', searchProducts)
form.addEventListener('submit',showSearchedProducts)