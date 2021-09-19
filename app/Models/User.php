<?php

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $hidden = ['password'];
    public $timestamps=false;

    public function reviews()
    {
        return $this->hasMany('Review');
    }

    public function likes()
    {
        return $this->belongsToMany('Review','likes');
    }
    public function user_product()
    {
        return $this->belongsToMany('Product','user_product')->withPivot('wishlist','cart','bought');
    }
    public function products()
    {
        return $this->hasMany('Product');
    }
    public function layouts()
    {
        return $this->hasMany('Layout');
    }
}

?>