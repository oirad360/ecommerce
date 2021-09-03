<?php

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $hidden = ['password'];
    public $timestamps=false;


    public function reviews()
    {
        return $this->belongsToMany('Product','reviews');
    }
    public function like()
    {
        return $this->belongsToMany('Review','like_review');
    }
    public function user_product()
    {
        return $this->belongsToMany('Product','user_product');
    }
    public function products()
    {
        return $this->hasMany('Product');
    }
    public function layouts()
    {
        return $this->hasMany('UsersLayout');
    }
}

?>