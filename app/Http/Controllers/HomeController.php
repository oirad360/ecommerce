<?php

use Illuminate\Routing\Controller as BaseController;

class HomeController extends BaseController{

    public function home(){
        if(session('id')===null){
            return view('home')
            ->with('app_folder', env('APP_FOLDER'))
            ->with('csrf_token', csrf_token());
        }

        $user=User::find(session('id'));
        return view('home')
            ->with('app_folder', env('APP_FOLDER'))
            ->with('username',$user->username)
            ->with('csrf_token', csrf_token())
            ->with('cartItems',$user->cartItems);
    }

    public function fetchProducts(){
        $products=Product::all();
        foreach($products as $product){
            if(session('id')){
                $user=$product->user_product()->where('user_id',session('id'))->first();
                if(isset($user)) $product["wishlist"]=$user->pivot->wishlist;
                else $product["wishlist"]=false;
            }  
            if($product->quantity<=10) $product["lastAvailables"]=true;
            else $product["lastAvailables"]=false;
            if($product->quantity===0) {
                $product["soonAvailables"]=true;
                $product["lastAvailables"]=false;
            }
            else $product["soonAvailables"]=false;
            $time=date("Y-m-d G:i:s", strtotime("+2 hour -18 hour"));
            if($product->date>$time) $product["newArrivals"]=true;
            else $product["newArrivals"]=false;
        }
        return $products;
    }

    public function addWishlist($productID,$val){
        $product=Product::find($productID);
        $user=$product->user_product()->where('user_id',session('id'))->first();
        if($val==="true"){
            if(isset($user)) $product->user_product()->updateExistingPivot(session('id'),["wishlist"=>true]);
            else $product->user_product()->attach(session('id'),["wishlist"=>true,"cart"=>0,"bought"=>0]);
        } else {
            $product->user_product()->updateExistingPivot(session('id'),["wishlist"=>false]);
            if($user->pivot->cart==0 && $user->pivot->bought==0) $user->user_product()->detach($productID);
        }
    }

    public function searchProducts(){
        $results=array();
        $text=request('q');
        if(request('c')==="all") $results=Product::where('title','like',"%$text%")->orWhere('description','like',"%$text%")->get();
        else {
            $products=Product::where('category',request("c"))->get();
            foreach($products as $product){
                if(str_contains(strtolower($product["title"]),strtolower($text)) || str_contains(strtolower($product["description"]),strtolower($text)))
                $results[]=$product;
            }
        }
        foreach($results as $result){
            $result["seller"]=User::find($result["user_id"])->username;
            $row=UserProduct::where('user_id',session('id'))->where('product_id',$result['id'])->first();
            if(isset($row)) $result["wishlist"]=$row->wishlist;
            else $result["wishlist"]=false;
        }
        return $results;
    }
}
