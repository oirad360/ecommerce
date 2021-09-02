@extends('templates.page')

@section('style')
<link rel=stylesheet href=/{{$app_folder}}/public/styles/productContainer.css>
<link rel=stylesheet href=/{{$app_folder}}/public/styles/sectionReviews.css>
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
    <div id="reviews">
    </div>
    <div @if(isset($myReview)) class="hidden" @endif>
        <button id="writeReviewButton">Scrivi una recensione</button>
        <div id="reviewArea" class="hidden">
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
            <span class="error hidden">Inserisci il testo</span>
        </div>
    </div>
</section>
@endsection