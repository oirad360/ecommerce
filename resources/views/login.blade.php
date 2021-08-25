@extends('templates.form')

@section('scripts')
    <script src='/{{$app_folder}}/public/scripts/login.js' defer></script>
@endsection

@section('title','Login')

@section('descrizione', 'Inserisci le tue credenziali')

@section('form')
    <form name="form" method='POST'>
        <input type='hidden' name='_token' value='{{ $csrf_token }}'>
        <label>Username <br> o email <input name="user" type="text" value='{{ $old_user }}'></label>
        <span id="user" class="error hidden">Questo campo è obbligatorio</span>
        <label>Password <input name="password" type="password"/></label>
        <span id="password" class="error hidden">Questo campo è obbligatorio</span>
        <span id="compila" class="error hidden">Compila tutti i campi</span>
        <span id="errorLogin" class="hidden">Credenziali non valide</span>
        <label><input type="submit"/></label>
        <p>Non ti sei ancora registrato? <a href="/{{$app_folder}}/public/signup">Clicca qui.</a></p>
        <p id="errorphp">
            @if(isset($error))
                {{ $error }}
            @endif
        </p>
    </form>
@endsection
