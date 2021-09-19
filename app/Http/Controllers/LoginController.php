<?php

use Illuminate\Routing\Controller as BaseController;

class LoginController extends BaseController{
    public function login(){
        if(session('id') != null) {
            return redirect('home');
        } else {
            // se i dati post sono settati ma non c'è la sessione vuol dire che sono stati mandati dati post sbagliati, dò errore
            if(Request::old('user')!==null && Request::old('password')!==null){
                $old_user = Request::old('user');
                return view('login')
                    ->with('app_url', env('APP_URL'))
                    ->with('app_folder', env('APP_FOLDER'))
                    ->with('csrf_token', csrf_token())
                    ->with('error', "Credenziali non valide.")
                    ->with('old_user', $old_user);
            } else {//se i dati post non sono settati e la sessione non c'è vuol dire che è il mio primo accesso alla pagina, dunque torno la vista
                return view('login')
                    ->with('app_url', env('APP_URL'))
                    ->with('app_folder', env('APP_FOLDER'))
                    ->with('csrf_token', csrf_token())
                    ->with('old_user', "");
            }
        }
    }

    public function checkLogin(){
        // se ho mandato dati post nulli (anche uno solo dei 2) torno la vista con errore
        if(request('user')===null || request('password')===null){
            return view('login')
                ->with('app_url', env('APP_URL'))
                ->with('app_folder', env('APP_FOLDER'))
                ->with('csrf_token', csrf_token())
                ->with('old_user', request('user'))
                ->with('error', "Compila tutti i campi.");
        }
        //se non ho fatto return allora ho mandato dei dati post non nulli, verifico se esiste l'utente
        $user = User::where('username', request('user'))->orWhere('email', request('user'))->first();
        if(isset($user)) { //verifichiamo che la password sia corretta
            if(password_verify(request('password'),$user->password)){
                Session::put('id', $user->id);
                Session::put('username',$user->username);
                return redirect('home');
            } else { //password non valida
                return redirect('login')->withInput();
            }
        }
        else {
            // email/username non valido
            return redirect('login')->withInput();
        }
    }

    public function logout(){
        Session::flush();
        return redirect('home');
    }
}
