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
        <meta name="csrf-token" content="{{ $csrf_token }}">
        <script src='/{{$app_folder}}/public/scripts/env.js' defer></script>
        <script src='/{{$app_folder}}/public/scripts/modal.js' defer></script>
        <script src='/{{$app_folder}}/public/scripts/nav.js' defer></script>
        @yield('scripts')
        <title>@yield('title')</title>
    </head>
    <body>
        <header>
            <img id=navOpen src=/{{$app_folder}}/public/assets/menuButton.png>
            <div class=searchBox>
                <form class=menuSearch name=searchProducts method=GET action="/{{$app_folder}}/public/search">
                    <input type="submit" value=""/>
                    <input name=q type="text" placeholder='Cerca un prodotto'>
                    <select name=c>
                        <option value="all">Tutte le categorie</option>
                        <option value="smartphone">Smartphones</option>
                        <option value="laptop">Laptop</option>
                        <option value="pc">PC</option>
                        <option value="audio">Audio</option>
                        <option value="tv">TV</option>
                        <option value="photography">Fotografia</option>
                        <option value="console">Console</option>
                        <option value="smartwatch">Smartwatch</option>
                        <option value="accessories">Accessori</option>
                    </select>
                </form>
                <div class="searchResults hidden" ></div>
            </div>
            <nav>
                <div id=navMain>
                    <div class=buttonContainer>
                        @if(isset($username))
                            <div class=profileContainer>
                                <span>Benvenuto, {{$username}}</span>
                                <a class=navButton href="/{{$app_folder}}/public/seller/{{$username}}">Visita la tua pagina</a>
                            </div>
                            <a href="/{{$app_folder}}/public/cart" id=cart>
                                <span>{{$cartItems}}</span>
                            </a>
                        @else
                            <a href="/{{$app_folder}}/public/signup" class=navButton id=signupButton>Registrati</a>
                            <a href="/{{$app_folder}}/public/login" class=navButton>Accedi</a>
                        @endif
                    </div>
                    
                    <a href=/{{$app_folder}}/public/home>
                        <img src=/{{$app_folder}}/public/assets/home.png id=homeButton />
                    </a>
                </div>
                <div id=navCategories>
                    <a href="/{{$app_folder}}/public/search?c=smartphone" data-value=smartphone>Smartphone</a>
                    <a href="/{{$app_folder}}/public/search?c=laptop" data-value=laptop>Laptop</a>
                    <a href="/{{$app_folder}}/public/search?c=pc" data-value=pc>PC</a>
                    <a href="/{{$app_folder}}/public/search?c=audio" data-value=audio>Audio</a>
                    <a href="/{{$app_folder}}/public/search?c=tv" data-value=tv>TV</a>
                    <a href="/{{$app_folder}}/public/search?c=photography" data-value=photography>Fotografia</a>
                    <a href="/{{$app_folder}}/public/search?c=console" data-value=console>Console</a>
                    <a href="/{{$app_folder}}/public/search?c=smartwatch" data-value=smartwatch>Smartwatch</a>
                    <a href="/{{$app_folder}}/public/search?c=accessories" data-value=accessories>Accessori</a>
                </div>
            </nav>
        </header>
            
        @yield('section')

        <footer>
            <a href="https://www.unict.it">
                <img id="logoUNICT" src="/{{$app_folder}}/public/assets/logoUNICT.jpg">
            </a>
            <div>
                <h3>Contatti</h3>
                <ul>
                    <li>darioanzalone@live.it</li>
                    <li><a href=https://github.com/oirad360>github.com/oirad360</a></li>
                </ul>
            </div>
        </footer>
        <div id="modal" class="hidden"></div>
    </body>
</html>