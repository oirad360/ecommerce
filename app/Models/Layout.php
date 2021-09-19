<?php

use Illuminate\Database\Eloquent\Model;

class Layout extends Model
{
    public $timestamps=false;

    public function user()
    {
        return $this->belongsTo('User');
    }

    public function locations()
    {
        return $this->hasMany('ProductsLocation');
    }
}

?>