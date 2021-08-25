<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function(){
    return redirect('home');
});
Route::get('login', 'LoginController@login');
Route::post('login', 'LoginController@checkLogin');
Route::post('login/check', 'LoginController@checkLoginJS');

Route::get('signup', 'SignupController@signup');
Route::post('signup', 'SignupController@checkSignup');
Route::get('signup/checkEmail/{email}', 'SignupController@checkEmail');
Route::get('signup/checkUsername/{username}', 'SignupController@checkUsername');

Route::get('logout', 'LoginController@logout');
Route::get('home', 'HomeController@home');
