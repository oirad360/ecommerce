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
        $cartItems=UserProduct::where('user_id',session('id'))->where('cart','!=',0)->select('product_id','cart')->get();
        foreach($cartItems as $cartItem){
            $cartItem['title']=Product::find($cartItem->product_id)->title;
            $cartItem['image']=Product::find($cartItem->product_id)->image;
            $cartItem['price']=Product::find($cartItem->product_id)->price;
            $cartItem['quantity']=Product::find($cartItem->product_id)->quantity;
        }
        return $cartItems;
    }

    public function addCart($productID,$val){
        $row=UserProduct::where('user_id',session('id'))->where('product_id', $productID)->first();
        if($val==="true"){
            if(isset($row)){
                $row=UserProduct::where('user_id',session('id'))->where('product_id', $productID)->first();
                $row->cart=$row->cart + 1;
                $row->save();
            } else {
                $row=new UserProduct;
                $row->user=session('id');
                $row->product_id=$productID;
                $row->cart=1;
                $row->save();
            }
        } else {
            $row->cart=$row->cart - 1;
            $row->save();
            $rows=UserProduct::where('user_id',session('id'))->where('product_id', $productID)->where('wishlist',false)->where('cart',0)->where('bought',0)->get();
            foreach($rows as $row){
                $row->delete();
            }
        }
    }
    public function buy(){
        $rows=UserProduct::where('cart','!=',0)->where('user_id',session('id'))->get();
        foreach($rows as $row){
            $row->bought+=$row->cart;
            $row->cart=0;
            $row->save();
        }
    }
}
