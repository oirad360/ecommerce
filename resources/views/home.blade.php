@extends('templates.page')

@section('style')
<link rel=stylesheet href=/{{$app_folder}}/public/styles/productContainer.css>
<link rel=stylesheet href=/{{$app_folder}}/public/styles/sectionHome.css>
@endsection

@section('scripts')
<script src='/{{$app_folder}}/public/scripts/home.js' defer></script>
@endsection


@section('title','Home')

@section('section')
<section id="mainSection">
    <div class=hidden id=wishlist>
        <h1>La tua wishlist</h1>
        <div class=productContainer>
        </div>
    </div>
    <div class=hidden id=newArrivals>
        <h1>Nuovi arrivi</h1>
        <div class=productContainer>
        </div>
    </div>
    <div class=hidden id=lastAvailables>
        <h1>Ultimi disponibili</h1>
        <div class=productContainer>
        </div>
    </div>
    <div class=hidden id=soonAvailables>
        <h1>Presto disponibili</h1>
        <div class=productContainer>
        </div>
    </div>
    <h1>Prodotti disponibili</h1>
    <div id=all class=productContainer>
    </div>
</section>
@endsection