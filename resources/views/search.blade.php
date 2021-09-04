@extends('templates.page')

@section('style')
<link rel=stylesheet href=/{{$app_folder}}/public/styles/productContainer.css>
@endsection

@section('scripts')
<script src='/{{$app_folder}}/public/scripts/search.js' defer></script>
@endsection


@section('title','Carrello')

@section('section')
<section id="mainSection">
    <h3>Risultati della ricerca per <span></span><h3>
    <div class=productContainer>
    </div>
</section>
<form class=hidden>
    <input type=hidden name=q value="{{$text}}">
    <input type=hidden name=c value="{{$category}}">
</form>
@endsection