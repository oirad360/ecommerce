<?php

use Illuminate\Database\Eloquent\Model;

class UsersLayout extends Model
{
    public $timestamps=false;
    protected $primaryKey='layout_id';

    public function user(){
        return $this->belongsTo('User');
    }
}

?>