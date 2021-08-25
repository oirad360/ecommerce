<?php

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    public $timestamps=false;

    public function like()
    {
        return $this->belongsToMany('User','like_review');
    }
}

?>