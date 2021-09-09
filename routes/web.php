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
Route::get('home/fetchProducts', 'HomeController@fetchProducts');

Route::post('searchProducts', 'HomeController@searchProducts');
Route::get('addWishlist/{productID}/{val}', 'HomeController@addWishlist');
Route::get('search', 'SearchController@search');

Route::get('seller/{seller}', 'SellerController@seller');
Route::get('seller/{seller}/fetchReviews', 'SellerController@fetchReviews');
Route::post('seller/newProduct', 'SellerController@newProduct');
Route::get('fetchProducts/{seller}', 'SellerController@fetchProducts');
Route::get('layout/{seller}', 'SellerController@layout');
Route::post('saveUsersLayout', 'SellerController@saveUsersLayout');
Route::get('loadLayout/{layoutID}', 'SellerController@loadLayout');
Route::get('loadLocations/{layoutID}', 'SellerController@loadLocations');
Route::get('active/{layoutID}/{val}', 'SellerController@active');
Route::get('mobile/{layoutID}/{val}', 'SellerController@mobile');
Route::get('deleteProduct/{productID}', 'SellerController@deleteProduct');
Route::get('deleteReview/{reviewID}', 'SellerController@deleteReview');
Route::get('deleteLayout/{layoutID}', 'SellerController@deleteLayout');
Route::get('fetchPurchases', 'SellerController@fetchPurchases');


Route::get('addCart/{productID}/{val}','CartController@addCart');
Route::get('cart','CartController@cart');
Route::get('cart/buy','CartController@buy');
Route::get('cart/fetchCart','CartController@fetchCart');

Route::get('reviews/{productID}', 'ReviewsController@reviews');
Route::get('reviews/fetchReviews/{productID}', 'ReviewsController@fetchReviews');
Route::get('reviews/fetchProduct/{productID}', 'ReviewsController@fetchProduct');
Route::post('reviews/postReview/{productID}', 'ReviewsController@postReview');
Route::get('like/{reviewID}', 'ReviewsController@like');
Route::get('dislike/{reviewID}', 'ReviewsController@dislike');
Route::get('fetchLikes/{reviewID}', 'ReviewsController@fetchLikes');