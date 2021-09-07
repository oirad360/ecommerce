@extends('templates.page')

@section('style')
<link rel=stylesheet href=/{{$app_folder}}/public/styles/productContainer.css>
<link rel=stylesheet href=/{{$app_folder}}/public/styles/sectionReviews.css>
<link rel=stylesheet href=/{{$app_folder}}/public/styles/reviews.css>
@endsection

@section('scripts')
<script src='/{{$app_folder}}/public/scripts/reviews.js' defer></script>
@endsection


@section('title','Recensioni')

@section('section')
<section id="mainSection" data-product_id={{$productID}}> 
    <h1 id="title">Recensioni per {{$product}}</h1>
    <div class="productContainer">
    </div>
    <p id="rating"></p>
    <div id=seller>
        <h3>Venditore: </h3>
        <div class=profile>
            <div class=propic style="background-image: url({{$propicUrl}});"></div>
            <div>
                <a href="/{{$app_folder}}/public/seller/{{$sellerUsername}}">{{$sellerUsername}} <br> Prodotti in vendita: {{$sellerProducts}}</a>
            </div>
        </div>
    </div>
    <div id="reviews">
    </div>
    <button id="writeReviewButton">Scrivi una recensione</button>
    <div class="hidden" id="reviewArea">
        <textarea name="reviewText" form="reviewForm" maxlength=255></textarea>
        <form name="reviewForm" id="reviewForm">
            <input type='hidden' name='_token' value='{{ $csrf_token }}'>
            <label>Voto: <select name="rating">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select></label>
            <input type='submit' value="Pubblica recensione"/>
        </form>
    </div>
</section>
@endsection