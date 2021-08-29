<?php

use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;

class SellerController extends BaseController{

    public function seller($seller){
        $row=User::where('username',$seller)->first();
        if(!isset($row)) return redirect('home');
        if(session('id')===null){
            return view('seller')
            ->with('app_folder', env('APP_FOLDER'))
            ->with('csrf_token', csrf_token())
            ->with('seller', $seller);
        }
        $user=User::find(session('id'));
        if($seller===$user->username) return view('seller')
            ->with('app_folder', env('APP_FOLDER'))
            ->with('username',$user->username)
            ->with('seller', $seller)
            ->with('yourPage',true)
            ->with('csrf_token', csrf_token())
            ->with('numCarrello',$user->cartItems);
        else return view('seller')
            ->with('app_folder', env('APP_FOLDER'))
            ->with('username',$user->username)
            ->with('seller', $seller)
            ->with('csrf_token', csrf_token())
            ->with('numCarrello',$user->cartItems);
    }

    public function newProduct(Request $request){
        $errors=array();
        $fileName="defaultProductImage.png";
        if($request->imgOption==="upload"){
            if($request->image){
                $file = $request->image;
                $fileArray = array('image' => $file);
                $rules = array(
                'image' => 'mimes:jpeg,jpg,png|max:2000' //max 2000 KB
                );
                $validator = Validator::make($fileArray, $rules,$message=[
                    'mimes'=>"Il formato dell'immagine deve essere jpeg, jpg o png",
                    'max'=>"L'immagine non può superare i 2MB"
                ]);
                if ($validator->fails()){
                    $errors[]=$validator->errors();
                } else{
                    $path = $request->file('image')->store('productImages');
                    $pathArray=explode("/",$path);
                    $fileName=$pathArray[count($pathArray)-1];
                }
            }
        } else if($request->url!=="") $fileName=$request->url;
        
        if(floatval($request->price)<=0){
            $errors[]="Inserisci un prezzo";
        }
        if(intval($request->quantity)<1){
            $errors[]="Inserisci una quantità valida";
        }
        if(!$request->title){
            $errors[]="Inserisci un titolo";
        }
        if(!$request->producer){
            $errors[]="Inserisci un produttore";
        }
        if(count($errors)>0){
            $result["errors"]=$errors;
            return $result;
        } else {
            $newProduct=new Product;
            $newProduct->title=$request->title;
            $newProduct->price=$request->price;
            $newProduct->quantity=$request->quantity;
            $newProduct->image=$fileName;
            if($request->desc!=="")$newProduct->description=$request->desc;
            $newProduct->category=$request->category;
            $newProduct->producer=$request->producer;
            $newProduct->user_id=session('id');
            $newProduct->save();
            return array($newProduct);
        }
    }

    public function fetchProducts(){
        $user=User::find(session('id'));
        return $user->products;
    }

    public function layout($seller){
        $layouts_id=User::where('username',$seller)->first()->layouts()->get();
        if(count($layouts_id)>0){
            return $layouts_id;
        } else {
            return [];
        }
    }

    public function saveUsersLayout($layoutID){
        if(UsersLayout::find($layoutID)===null){
            $usersLayout = new UsersLayout();
            $usersLayout->user_id=session('id');
            $usersLayout->layout_id=$layoutID;
            if(UsersLayout::where('user_id',session('id'))->where('active',true)->first()===null) $usersLayout->active=true;
            else $usersLayout->active=false;
            $usersLayout->save();
        }
    }

    public function active($layoutID){
        $row=UsersLayout::where('user_id',session('id'))->where('active',true)->first();
        $row->active=false;
        $row->save();
        $row=UsersLayout::find($layoutID);
        $row->active=true;
        $row->save();
    }
}
