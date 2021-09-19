<?php

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    public $timestamps=false;

    public function likes()
    {
        return $this->belongsToMany('User','likes');
    }

    public function product()
    {
        return $this->belongsTo('Product');
    }

    public function user()
    {
        return $this->belongsTo('User');
    }
}

?>