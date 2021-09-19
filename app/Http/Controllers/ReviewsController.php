<?php

use Illuminate\Routing\Controller as BaseController;

class ReviewsController extends BaseController{

    public function reviews($productID){
        $product=Product::find($productID);
        $seller=User::find($product->user_id);
        $propicUrl;
        if($seller->propic==="defaultAvatar.jpg") $propicUrl="/".env('APP_FOLDER')."/public/assets/defaultAvatar.jpg";
        else $propicUrl="/".env('APP_FOLDER')."/storage/app/propics/".$seller->propic;
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
        $reviews=Product::find($productID)->reviews;
        $result=array("contents"=>[],"disable"=>false);
        if($reviews){
            foreach($reviews as $review){
                $user=User::find($review->user_id);
                $review["username"]=$user->username;
                $review["propic"]=$user->propic;
                if($review->likes()->where('user_id',session('id'))->first()!==null) $review["youLike"]=true;
                $result["contents"][]=$review;
                if($review->user_id===session('id')) $result["disable"]=true;
            }
        }
        if(!session('id')) $result["disable"]=true;
        return $result;
    }

    public function fetchProduct($productID){
        $product=Product::find($productID);
        $product['wishlist']=($product->user_product()->where('user_id',session('id'))->where('wishlist',true)->first()!==null);
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

    public function like($reviewID){
        $review=Review::find($reviewID);
        $review->likes()->attach(session('id'));
    }

    public function dislike($reviewID){
        $review=Review::find($reviewID);
        $review->likes()->detach(session('id'));
    }

    public function fetchLikes($id){
        $likes=Review::find($id)->likes()->get();
        return $likes;
    }
}
