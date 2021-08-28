
<!DOCTYPE html>
<html>
    <head>
        <link rel='stylesheet' href='/{{$app_folder}}/public/styles/form.css'>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Raleway&display=swap" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300&family=Roboto:wght@300&display=swap" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Oxygen&display=swap" rel="stylesheet">
        <script src="/{{$app_folder}}/public/scripts/env.js"></script>
        @yield('scripts')
        <title>@yield('title')</title>
    </head>
    <body>
    <div id="overlay"></div>
        <section>
            <p>@yield('descrizione')</p>
        </section>
        <main>
            @yield('form')
            
        </main>
    </body>
</html>