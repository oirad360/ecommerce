<?php

use Illuminate\Database\Eloquent\Model;

class ProductsLocation extends Model
{
    public $timestamps=false;

    public function product()
    {
        return $this->belongsTo('Product');
    }
    public function layout()
    {
        return $this->belongsTo('UsersLayout','layout_id');
    }
}

?>