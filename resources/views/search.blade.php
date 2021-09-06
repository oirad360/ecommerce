@extends('templates.page')

@section('style')
<link rel=stylesheet href=/{{$app_folder}}/public/styles/productContainer.css>
<link rel=stylesheet href=/{{$app_folder}}/public/styles/sectionSearch.css>
@endsection

@section('scripts')
<script src='/{{$app_folder}}/public/scripts/search.js' defer></script>
@endsection


@section('title','Carrello')

@section('section')
<section id="mainSection">
    @if(isset($show))<h3>Risultati della ricerca per "{{$text}}"</h3>@endif
    <h3 id=category></h3>
    <div class=productContainer>
    </div>
</section>
<form method=POST class=hidden>
    <input type='hidden' name='_token' value='{{ $csrf_token }}'>
    <input type=hidden name=q value="{{$text}}">
    <input type=hidden name=c value="{{$category}}">
</form>
@endsection