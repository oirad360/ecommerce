<?php

use Illuminate\Routing\Controller as BaseController;

class ReviewsController extends BaseController{

    public function reviews($productID){
        $product=Product::find($productID);
        $seller=User::find($product->user_id);
        $propicUrl;
        if(substr($seller->propic,0,4)==="http") $propicUrl=$seller->propic;
        else $propicUrl="/".env('APP_FOLDER')."/public/assets/".$seller->propic;
        if(session('id')){
            $user=User::find(session('id'));
            return view('reviews')
            ->with('csrf_token', csrf_token())
            ->with('app_folder', env('APP_FOLDER'))
            ->with('username',$user->username)
            ->with('cartItems',$user->cartItems)
            ->with('product',$product->title)
            ->with('productID',$productID)
            ->with('propicUrl',$propicUrl)
            ->with('sellerProducts',count($seller->products))
            ->with('sellerUsername',$seller->username);
            
        } else {
            return view('reviews')
            ->with('csrf_token', csrf_token())
            ->with('app_folder', env('APP_FOLDER'))
            ->with('product',$product->title)
            ->with('productID',$productID)
            ->with('propicUrl',$propicUrl)
            ->with('sellerProducts',count($seller->products))
            ->with('sellerUsername',$seller->username);
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
                if($utenteRecensione->id===session('id')){
                    $recensioni["disattivaRecensione"]=true;
                }
            }
        }
        if(!session('id')) $recensioni["disattivaRecensione"]=true;
        return $recensioni;
    }

    public function fetchProduct($productID){
        $product=Product::find($productID);
        $userProduct=UserProduct::where('user_id',session('id'))->where('product_id',$productID)->first();
        if(isset($userProduct) && $userProduct->wishlist==1){
            $product['wishlist']=true;
        } else {
            $product['wishlist']=false;
        }
        /* $seller=User::find($product->user_id);
        $product["seller"]=array("username"=>$seller->username,
        "propic"=>$seller->propic,
        "products"=>count($seller->products)); */
        return $product;
    }

    public function postReview($productID){
        $review=new Review;
        $review->user_id=session('id');
        $review->product_id=$productID;
        $review->text=request('reviewText');
        $review->stars=request('rating');
        $review->save();
    }

    public function like($id){
        $like=new LikeReview;
        $like->user_id=session('id');
        $like->review_id=$id;
        $like->save();
    }

    public function dislike($id){
        $like=LikeReview::where('review_id',$id)->where('user_id',session('id'))->first();
        $like->delete();
    }

    public function fetchLikes($id){
        $utenti=Review::find($id)->like;
        return $utenti;
    }
}
