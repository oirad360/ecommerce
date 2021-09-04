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
        $userProducts=UserProduct::where('user_id',session('id'))->get();
        foreach($products as $product){
            if(session('id')){
                $flag=false;
                foreach($userProducts as $userProduct){
                    if($userProduct->product_id===$product->id){
                        if($userProduct->wishlist) $product["wishlist"]=true;
                        else $product["wishlist"]=false;
                        $flag=true;
                    }
                }
                if(!$flag) $product["wishlist"]=false;
            }  
            if($product->quantity<=10) $product["lastAvailables"]=true;
            else $product["lastAvailables"]=false;
            if($product->quantity===0) {
                $product["soonAvailables"]=true;
                $product["lastAvailables"]=false;
            }
            else $product["soonAvailables"]=false;
            $time=date("Y-m-d G:i:s", strtotime("+2 hour -1 hour -55 minutes"));
            if($product->date>$time) $product["newArrivals"]=true;
            else $product["newArrivals"]=false;
        }
        return $products;
    }

    public function addWishlist($productID,$val){
        $row=UserProduct::where('user_id',session('id'))->where('product_id',$productID)->first();
        if($val==="true"){
            if(isset($row)){
                $row->wishlist=true;
                $row->save();
            } else {
                $row=new UserProduct;
                $row->user_id=session('id');
                $row->product_id=$productID;
                $row->wishlist=true;
                $row->save();
            }
        } else {
            $row->wishlist=false;
            $row->save();
            $row=UserProduct::where('user_id',session('id'))->where('product_id', $productID)->where('wishlist',false)->where('cart',0)->where('bought',0)->first();
            if(isset($row)) $row->delete();
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
        }
        return $results;
    }
}
