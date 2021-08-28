<!DOCTYPE html>
<html>
    <head>
        <link rel='stylesheet' href='/{{$app_folder}}/public/styles/page.css'>
        @yield('style')
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Raleway&display=swap" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300&family=Roboto:wght@300&display=swap" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Oxygen&display=swap" rel="stylesheet">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src='/{{$app_folder}}/public/scripts/env.js' defer></script>
        <script src='/{{$app_folder}}/public/scripts/nav.js' defer></script>
        @yield('scripts')
        <title>@yield('title')</title>
    </head>
    <body>
        <header>
            <img id=navOpen src=/{{$app_folder}}/public/assets/menuButton.png>
            <form class=menuSearch name=searchProducts method=POST>
                <input type='hidden' name='_token' value='{{ $csrf_token }}'>
                <input type="submit" value=""/>
                <input type="text" placeholder='Cerca un prodotto'>
                <select name=categories>
                    <option value="all">Tutte le categorie</option>
                    <option value="smartphone">Smartphones</option>
                </select>
            </form>
            <nav>
                <div id=navMain>
                    <div class=buttonContainer>
                        @if(isset($username))
                            <div class=profileContainer>
                                <span>Benvenuto, {{$username}}</span>
                                <a class=navButton href="/{{$app_folder}}/public/seller/{{$username}}">Visita la tua pagina</a>
                            </div>
                            <div id=cart>
                                <span>{{$numCarrello}}</span>
                            </div>
                        @else
                            <a href="/{{$app_folder}}/public/signup" class=navButton id=signupButton>Registrati</a>
                            <a href="/{{$app_folder}}/public/login" class=navButton>Accedi</a>
                        @endif
                    </div>
                    <form name=searchProducts method=POST>
                        <input type='hidden' name='_token' value='{{ $csrf_token }}'>
                        <input type="submit" value=""/>
                        <input type="text" placeholder='Cerca un prodotto'>
                        <select name=categories>
                            <option value="all">Tutte le categorie</option>
                            <option value="smartphone">Smartphones</option>
                        </select>
                    </form>
                    <a href=/{{$app_folder}}/public/home>
                        <img src=/{{$app_folder}}/public/assets/home.png id=homeButton />
                    </a>
                </div>
                <div id=navCategories>
                    <span>Smartphone</span>
                    <span>Laptop</span>
                    <span>PC</span>
                    <span>Audio</span>
                    <span>TV</span>
                    <span>Console</span>
                    <span>Smartwatch</span>
                    <span>Accessori</span>
                </div>
            </nav>
        </header>
            
        @yield('section')

        <footer>
            <a href="https://www.unict.it">
                <img id="logoUNICT" src="/{{$app_folder}}/public/assets/logoUNICT.jpg">
            </a>
            <p>
                Dario Anzalone <br>
                O46002090 <br>
                <em>Web Programming 2021 <br>
                DIEEI - Cittadella Universitaria</em>
            </p>
        </footer>
        
    </body>
</html>