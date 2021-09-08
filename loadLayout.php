<?php
$file=fopen("layouts.json","r");
$layouts=json_decode(fread($file,filesize("layouts.json")),true);
foreach($layouts as $layout){
    if($layout["id"]==$_GET['layoutID']){
        fclose($file);
        echo json_encode($layout);
        break;
    } 
}
?>