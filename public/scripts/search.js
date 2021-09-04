function onResponse(response){
    return response.json()
}
const formm=document.querySelector('form')
const data={method:'POST', body: new FormData(form)}
fetch(app_url+"/searchProducts",data).then(onResponse).then(function(json){
    console.log(json)
    if(json.length>0){
        
    } else {
        
    }
})