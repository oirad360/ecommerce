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
        $noImgUpload=false;
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
            } else $noImgUpload=true;
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
            $newProduct;
            if($request->productID) $newProduct=Product::find($request->productID);
            else $newProduct=new Product;
            $newProduct->title=$request->title;
            $newProduct->price=$request->price;
            $newProduct->quantity=$request->quantity;
            if($request->productID!==""){
                if(!$noImgUpload) $newProduct->image=$fileName;
            } else $newProduct->image=$fileName;
            if($request->desc!=="")$newProduct->description=$request->desc;
            $newProduct->category=$request->category;
            $newProduct->producer=$request->producer;
            $newProduct->user_id=session('id');
            $newProduct->save();
            return array($newProduct);
        }
    }

    public function modifyProduct(Request $request){
        
    }

    public function fetchProducts($seller){
        $user=User::where('username',$seller)->first();
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

    public function active($layoutID,$val){
        if($val==="true"){
            $row=UsersLayout::where('user_id',session('id'))->where('active',true)->first();
            if(isset($row)){
                $row->active=false;
                $row->save();
            }
            $row=UsersLayout::find($layoutID);
            $row->active=true;
            $row->save();
        } else if($val==="false"){
            $row=UsersLayout::find($layoutID);
            $row->active=false;
            $row->save();
        }
    }

    public function deleteProduct($productID){
        $product=Product::find($productID);
        $product->delete();
        $rows=User::find(session('id'))->layouts;
        $layoutsIDs=array();
        if(isset($rows)){
            foreach($rows as $row) $layoutsIDs[]=$row["layout_id"];
        }
        $newContent=array();
        foreach($layoutsIDs as $layoutID){
            $file=fopen("C:/xampp/htdocs/ecommerce/layout$layoutID.json","r");
            $content=json_decode(fread($file,filesize("C:/xampp/htdocs/ecommerce/layout$layoutID.json")),true);
            foreach($content as $key=>$value){
                foreach($content[$key] as $id=>$value){
                    unset($value[array_search($productID,$value)]);
                    $newContent[$key][$id]=array_values($value);
                }
            }
            unlink("C:/xampp/htdocs/ecommerce/layout$layoutID.json");
            fclose($file);
            $file=fopen("C:/xampp/htdocs/ecommerce/layout$layoutID.json","w");
            fwrite($file,json_encode($newContent));
            fclose($file);
            $newContent=array();
        }
    }
}
