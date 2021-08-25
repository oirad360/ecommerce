<?php

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $hidden = ['password'];
    public $timestamps=false;


    public function reviews()
    {
        return $this->belongsToMany('Product','user_review');
    }
    public function like()
    {
        return $this->belongsToMany('Review','like_review');
    }
    public function user_product()
    {
        return $this->belongsToMany('Product','user_product');
    }
}

?>