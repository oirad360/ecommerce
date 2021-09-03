@extends('templates.page')

@section('style')
<link rel=stylesheet href=/{{$app_folder}}/public/styles/productContainer.css>
<link rel=stylesheet href=/{{$app_folder}}/public/styles/sectionSeller.css>
<link rel=stylesheet href=/{{$app_folder}}/public/styles/reviews.css>
@endsection

@section('scripts')
<script src='/{{$app_folder}}/public/scripts/layoutCreator.js' defer></script>
<script src='/{{$app_folder}}/public/scripts/seller.js' defer></script>
@endsection

@section('title','Pagina venditore')

@section('section')
<section id=mainSection>
    <h1>Pagina di {{$seller}}</h1>
    @if(isset($yourPage))
    <h3 class=hidden id=yourPurchases>I tuoi acquisti</h3>
    <div class=productContainer id=yourPurchasesContainer>
    </div>
    <h3 id=yourProducts>I tuoi prodotti</h3>
    <div class=productContainer id=yourProductsContainer>
    </div>
    <button id=quitModifyProduct class=hidden>Annulla</button>
    <button id=newProductButton>Inserisci un nuovo prodotto</button>
    <form method='POST' class=hidden name=newProduct id=newProductForm>
        <input type='hidden' name='_token' value='{{ $csrf_token }}'>
        <input type='hidden' name='productID'>
        <label>Titolo: <input type=text name=title></label>
        <span id=titleError class="error hidden">Questo campo è obbligatorio</span>
        <label>Prezzo: <input type=number value=0 min=0 step=any name=price></label>
        <span id=priceError class="error hidden">Questo campo è obbligatorio</span>
        <label>Categoria:
            <select name=category>
                <option value="smartphone">Smartphones</option>
                <option value="laptop">Laptop</span>
                <option value="pc">PC</option>
                <option value="audio">Audio</option>
                <option value="tv">TV</option>
                <option value="photography">Fotografia</option>
                <option value="console">Console</option>
                <option value="smartwatch">Smartwatch</option>
                <option value="accessories">Accessori</option>
            </select>
        </label>
        <label>Immagine: 
            <select name=imgOption>
                <option value=upload>Carica una foto</option>
                <option value=url>Inserisci un URL</option>
            </select>
        </label>
        <label><input name="image" type="file" accept='.jpg, .jpeg, image/png'/></label>
        <label><input class=hidden type=text name=url></label>
        <span id=sizeError class="error hidden">L'immagine non può avere dimensioni superiori a 2MB</span>
        <span id=formatError class="error hidden">Inserisci un'immagine (png, jpg, jpeg)</span>
        <label>Quantità: <input type=number value=1 name=quantity min=1></label>
        <span id=quantityError class="error hidden">Questo campo è obbligatorio</span>
        <label>Produttore: <input type=text name=producer></label>
        <span id=producerError class="error hidden">Questo campo è obbligatorio</span>
        <textarea name="desc" form="newProductForm" maxlength=255 placeholder="Inserisci una descrizione..."></textarea>
        <div id="errorsPhp">
        </div>
        <input type=submit name=send>
    </form>
    <div id=layouts></div>
    <button id=active class=hidden></button>
    <button id=modifyLayoutButton class=hidden>Modifica layout</button>
    <button id=deleteLayoutButton class=hidden>Elimina layout</button>
    <button id=newLayoutButton>Crea un nuovo layout</button>
    <button id=addContentButton class=hidden>Aggiungi al layout</button>
    <button id=removeContentButton class=hidden>Rimuovi dal layout</button>
    @endif
    <h3 id=reviewTitle class=hidden>Recensioni pubblicate da {{$seller}}</h3>
    <div id=reviews></div>
</section>
@endsection