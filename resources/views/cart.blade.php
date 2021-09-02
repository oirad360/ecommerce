@extends('templates.page')

@section('style')
<link rel=stylesheet href=/{{$app_folder}}/public/styles/productContainer.css>
<link rel=stylesheet href=/{{$app_folder}}/public/styles/sectionCart.css>
@endsection

@section('scripts')
<script src='/{{$app_folder}}/public/scripts/cart.js' defer></script>
@endsection


@section('title','Carrello')

@section('section')
<section id="mainSection">
    <h1 id='description'>Carrello di {{$username}}</h1>
    <main class="productContainer">
    </main>
    <p id="total">
    </p>
    <button id='buy' class=hidden>
        Ordina
    </button>
</section>
@endsection