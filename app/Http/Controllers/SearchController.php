<?php

use Illuminate\Routing\Controller as BaseController;

class SearchController extends BaseController{

    public function search(){
        $category;
        if(isset($_GET['c'])) $category=$_GET['c'];
        else $category="all";

        if(session('id')===null){
            if(isset($_GET['q']) && $_GET['q']!==""){
                return view('search')
                ->with('app_folder', env('APP_FOLDER'))
                ->with('text',$_GET['q'])
                ->with('show',true)
                ->with('category',$category)
                ->with('csrf_token', csrf_token());
            } else {
                return view('search')
                ->with('app_folder', env('APP_FOLDER'))
                ->with('text','')
                ->with('category',$category)
                ->with('csrf_token', csrf_token());
            }
        }

        $user=User::find(session('id'));
        if(isset($_GET['q']) && $_GET['q']!==""){
            return view('search')
            ->with('app_folder', env('APP_FOLDER'))
            ->with('username',$user->username)
            ->with('csrf_token', csrf_token())
            ->with('text',$_GET['q'])
            ->with('show',true)
            ->with('category',$category)
            ->with('cartItems',$user->cartItems);
        } else {
            return view('search')
            ->with('app_folder', env('APP_FOLDER'))
            ->with('username',$user->username)
            ->with('csrf_token', csrf_token())
            ->with('text','')
            ->with('category',$category)
            ->with('cartItems',$user->cartItems);
        }
        
    }
}
