<?php

use Illuminate\Routing\Controller as BaseController;

class ReviewsController extends BaseController{

    public function reviews($productID){
        $product=Product::find($productID);
        if(session('id')){
            $user=User::find(session('id'));
            $myReview=Review::where('user_id',session('id'))->where('product_id',$productID)->first();
            return view('reviews')
            ->with('csrf_token', csrf_token())
            ->with('app_folder', env('APP_FOLDER'))
            ->with('username',$user->username)
            ->with('product',$product->title)
            ->with('productID',$productID)
            ->with('myReview',$myReview)
            ->with('cartItems',$user->cartItems);
        } else {
            return view('reviews')
            ->with('csrf_token', csrf_token())
            ->with('app_folder', env('APP_FOLDER'))
            ->with('product',$product->title);
        }
        
            
    }

    public function fetchReviews($productID){
        $utentiRecensione=Product::find($productID)->reviews;
        $recensioni=array("contents"=>[],"disattivaRecensione"=>false);
        if($utentiRecensione){
            foreach($utentiRecensione as $utenteRecensione){
                $info=Review::where('product_id',$productID)->where('user_id',$utenteRecensione->id)->first();
                $info["propic"]=$utenteRecensione->propic;
                $info["username"]=$utenteRecensione->username;
                $row=LikeReview::where('user_id',session('id'))->where('review_id',$info['id'])->first();
                if(isset($row)){
                    $info["youLike"]=true;
                }
                $recensioni["contents"][]=$info;
                if(session('id')){
                    if($utenteRecensione->id===session('id')){
                        $recensioni["disattivaRecensione"]=true;
                    }
                }
            }
        }
        return $recensioni;
    }

    public function fetchProduct($productID){
        $prodotto=Product::find($productID);
        $prodottoUtente=UserProduct::where('user_id',session('id'))->where('product_id',$productID)->first();
        if(isset($prodottoUtente) && $prodottoUtente->wishlist==1){
            $prodotto['wishlist']=true;
        } else {
            $prodotto['wishlist']=false;
        }
        return $prodotto;
    }
}
