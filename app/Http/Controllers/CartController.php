<?php

use Illuminate\Routing\Controller as BaseController;

class CartController extends BaseController{

    public function cart(){
        if(session('id')===null){
            return redirect('login');
        }
        $user=User::find(session('id'));
        return view('cart')
            ->with('app_folder', env('APP_FOLDER'))
            ->with('csrf_token', csrf_token())
            ->with('username',$user->username)
            ->with('cartItems',$user->cartItems);
    }

    public function fetchCart(){
        $cartItems=User::find(session('id'))->user_product()->where('cart','>',0)->get();
        foreach($cartItems as $cartItem){
            $cartItem['cart']=$cartItem->pivot->cart;
        }
        return $cartItems;
    }

    public function addCart($productID,$val){
        $product=Product::find($productID);
        $user=$product->user_product()->where('user_id',session('id'))->first();
        $quantity=$product->quantity;
        if($val==="true"){
            if($quantity>0){
                if(!isset($user)){
                    $product->user_product()->attach(session('id'),["wishlist"=>false,"bought"=>false,"cart"=>1]);
                    return 1;
                }
                if($user->pivot->cart<$quantity){
                    $product->user_product()->updateExistingPivot(session('id'),["cart"=>$user->pivot->cart+1]);
                    return 1;
                }
                return 0;
            }
            return 0;
        } else {
            $product->user_product()->updateExistingPivot(session('id'),["cart"=>$user->pivot->cart-1]);
            if($user->pivot->cart==0 && $user->pivot->bought==0 && $user->pivot->wishlist==false) $product->user_product()->detach(session('id'));
            return -1;
        }
    }
    
    public function buy(){
        $products=User::find(session('id'))->user_product()->where('cart','>',0)->get();
        foreach($products as $product){
            $product->quantity-=$product->pivot->cart;
            $product->save();
            $product->user_product()->updateExistingPivot(session('id'),['cart'=>0,'bought'=>$product->pivot->bought+$product->pivot->cart]);
        }
        return $products;
    }
}
