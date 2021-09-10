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
            ->with('cartItems',$user->cartItems);
        else return view('seller')
            ->with('app_folder', env('APP_FOLDER'))
            ->with('username',$user->username)
            ->with('seller', $seller)
            ->with('csrf_token', csrf_token())
            ->with('cartItems',$user->cartItems);
    }

    public function newProduct(Request $request){
        $errors=array();
        $fileName="defaultProductImage.png";
        $imgUpload=false;
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
                    $imgUpload=true;
                }
            };
        } else if($request->url) $fileName=$request->url;
        
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
            if($request->productID){
                if($imgUpload) $newProduct->image=$fileName;
            } else $newProduct->image=$fileName;
            if($request->desc!=="")$newProduct->description=$request->desc;
            $newProduct->category=$request->category;
            $newProduct->producer=$request->producer;
            $newProduct->user_id=session('id');
            $newProduct->save();
            return array($newProduct);
        }
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

    public function saveUsersLayout(Request $request){
        $newLayout=$request->all();
        $file=fopen("C:/xampp/htdocs/ecommerce/layouts.json","r");
        $layouts=json_decode(fread($file,filesize("C:/xampp/htdocs/ecommerce/layouts.json")),true);
        if($newLayout['id']==="new"){
            $keys=array_keys($layouts);
            if(count($keys)>0) $newLayout["id"]=$keys[count($keys)-1]+1;
            else $newLayout["id"]=1;
            $usersLayout = new UsersLayout();
            $usersLayout->layout_id=$newLayout["id"];
            if(UsersLayout::where('user_id',session('id'))->first()===null) $usersLayout->active=true;
            else $usersLayout->active=false;
            $usersLayout->user_id=session('id');
            if($newLayout["mobile"]===true) $usersLayout->mobile=true;
            else $usersLayout->mobile=false;
            $usersLayout->save();
            unset($newLayout["mobile"]);
        }
        foreach($newLayout["content"] as $gen=>$childs){
            foreach($childs as $id=>$products){
                $locations=ProductsLocation::where('layout_id',$newLayout['id'])->where('data_gen',$gen)->where('data_id',$id)->get();
                if(isset($locations)) foreach($locations as $location) $location->delete();
                foreach($products as $product){
                    $newLocation=new ProductsLocation();
                    $newLocation->product_id=$product;
                    $newLocation->layout_id=$newLayout["id"];
                    $newLocation->data_gen=$gen;
                    $newLocation->data_id=$id;
                    $newLocation->save();
                }
            }
        }
        unset($newLayout["content"]);
        $layouts[$newLayout["id"]]=$newLayout;
        $file=fopen("C:/xampp/htdocs/ecommerce/layouts.json","w");
        fwrite($file,json_encode($layouts));
        fclose($file);
        return $newLayout["id"];
    }

    public function loadLocations($layoutID){
        $map;
        $locations=UsersLayout::find($layoutID)->locations;
        foreach($locations as $location){
            $product=Product::find($location->product_id);
            $image;
            if(substr($product->image,0,4)==="http") $image=$product->image;
            else $image="/".env('APP_FOLDER')."/storage/app/productImages/".$product->image;
            if(!isset($map[$location["data_gen"]])) $map[$location["data_gen"]]=array();
            if(!isset($map[$location["data_gen"]][$location["data_id"]])) $map[$location["data_gen"]][$location["data_id"]]="";
            $map[$location["data_gen"]][$location["data_id"]].="<div data-product_id='".$product->id."'><div class='block' data-producer='".$product->producer."' data-category='".$product->category."'><h3>".$product->title."</h3><a href='/".env('APP_FOLDER')."/public/reviews/".$product->id."'><img src='$image'></a><span>".$product->price."€</span><div class='productButtonsContainer'><p class='quantity'>Disponibilità: ".$product->quantity."</p></div><div class='productButtonsContainer'><p class='descButton'>Scheda tecnica</p></div></div><p class='desc hidden'>".$product->description."</p></div>";
        }
        if(isset($map))return $map;
    }

    public function loadLayout($layoutID){
        $file=fopen("C:/xampp/htdocs/ecommerce/layouts.json","r");
        $layouts=json_decode(fread($file,filesize("C:/xampp/htdocs/ecommerce/layouts.json")),true);
        fclose($file);
        return $layouts[$layoutID];
    }

    public function active($layoutID,$val){
        $row=UsersLayout::find($layoutID);
        if($val==="true"){
            $activeLayouts=UsersLayout::where('user_id',session('id'))->where('active',true)->get();
            if(count($activeLayouts)===2) return 0;
            if(count($activeLayouts)===1){
                if($activeLayouts[0]->mobile===$row->mobile) return 0;
                $row->active=true;
                $row->save();
                return 1;
            }
            $row->active=true;
            $row->save();
            return 1;
        } else if($val==="false"){
            $row->active=false;
            $row->save();
            return 1;
        }
    }

    public function mobile($layoutID,$val){
        $layout=UsersLayout::find($layoutID);
        if($layout->active==1){
            $activeLayouts=UsersLayout::where('user_id',session('id'))->where('active',true)->get();
            if(count($activeLayouts)===2){
                $otherLayout=UsersLayout::where('user_id',session('id'))->where('active',true)->where('layout_id','!=',$layoutID)->first();
                if($val==="true"){
                    if($otherLayout->mobile==1) return 0;
                    $layout->mobile=true;
                    $layout->save();
                    return 1;
                } else {
                    if($otherLayout->mobile==0) return 0;
                    $layout->mobile=false;
                    $layout->save();
                    return 1;
                }
            } else {
                if($val==="true") $layout->mobile=true;
                else $layout->mobile=false;
                $layout->save();
                return 1;
            }
        } else {
            if($val==="true") $layout->mobile=true;
                else $layout->mobile=false;
                $layout->save();
                return 1;
        }
    }

    public function deleteProduct($productID){
        /* $userLayouts=User::find(session('id'))->layouts;
        if(isset($userLayouts)){
            $file=fopen("C:/xampp/htdocs/ecommerce/layouts.json","r");
            $layouts=json_decode(fread($file,filesize("C:/xampp/htdocs/ecommerce/layouts.json")),true);
            foreach($userLayouts as $userLayout){
                $i=0;
                foreach($layouts[$userLayout["layout_id"]]["childs"] as $child){
                    if($child["hasChilds"]==false){
                        $index=array_search($productID,$child["content"]);
                        if($index!==false){
                            array_splice($child["content"], array_search($productID,$child["content"]), 1);
                            $layouts[$userLayout["layout_id"]]["childs"][$i]["content"]=$child["content"];
                        }
                    }
                    //unset($child["content"][$index]);
                    $i++;
                }
            }
            $file=fopen("C:/xampp/htdocs/ecommerce/layouts.json","w");
            fwrite($file,json_encode($layouts));
            fclose($file);
        } */
        $product=Product::find($productID);
        $product->delete();
    }

    public function fetchReviews($seller){
        $userID=User::where('username',$seller)->first()->id;
        $products=User::find($userID)->reviews;
        $reviews=[];
        if($products){
            foreach($products as $product){
                $info=Review::where('product_id',$product->id)->where('user_id',$userID)->first();
                $info['title']=$product->title;
                $info['seller']=$product->user->username;
                $row=LikeReview::where('user_id',session('id'))->where('review_id',$info['id'])->first();
                if(isset($row)){
                    $info["youLike"]=true;
                }
                $reviews[]=$info;
            }
        }
        return $reviews;
    }

    public function deleteLayout($layoutID){
        UsersLayout::find($layoutID)->delete();
        $file=fopen("C:/xampp/htdocs/ecommerce/layouts.json","r");
        $layouts=json_decode(fread($file,filesize("C:/xampp/htdocs/ecommerce/layouts.json")),true);
        unset($layouts[$layoutID]);
        $file=fopen("C:/xampp/htdocs/ecommerce/layouts.json","w");
        fwrite($file,json_encode($layouts));
        fclose($file);
    }

    public function deleteReview($id){
        $review=Review::find($id);
        $review->delete();
    }
    
    public function fetchPurchases(){
        $products=User::find(session('id'))->user_product;
        $purchases=[];
        foreach($products as $product){
            $row=UserProduct::where('user_id',session('id'))->where('product_id',$product['id'])->first();
            if($row->bought>0){
                $product['tot']=$row->bought;
                $product['seller']=User::find($product->user_id)->username;
                $purchases[]=$product;
            }
        }
        return $purchases;
    }
}
