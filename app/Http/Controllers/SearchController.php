<?php

use Illuminate\Routing\Controller as BaseController;

class SearchController extends BaseController{

    public function search(){
        if(session('id')===null){
            return view('search')
            ->with('app_folder', env('APP_FOLDER'))
            ->with('text',$_GET["q"])
            ->with('category',$_GET["c"])
            ->with('csrf_token', csrf_token());
        }

        $user=User::find(session('id'));
        return view('search')
            ->with('app_folder', env('APP_FOLDER'))
            ->with('username',$user->username)
            ->with('csrf_token', csrf_token())
            ->with('text',$_GET["q"])
            ->with('category',$_GET["c"])
            ->with('cartItems',$user->cartItems);
    }
}
