<?php

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    public $timestamps=false;
    public function user()
    {
        return $this->belongsTo('User');
    }

    public function reviews()
    {
        return $this->belongsToMany('User','reviews');
    }

    public function user_product()
    {
        return $this->belongsToMany('User','user_product');
    }
}

?>