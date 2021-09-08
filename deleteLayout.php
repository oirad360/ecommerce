<?php
$file=fopen("layouts.json","r");
$layouts=json_decode(fread($file,filesize("layouts.json")),true);
fclose($file);
$i=0;
foreach($layouts as $layout){
    if($layout["id"]==$_GET['layoutID']){
        array_splice($layouts,$i,1);
        break;
    }
    $i++;
}
$file=fopen("layouts.json","w");
fwrite($file,json_encode($layouts));
fclose($file);
?>