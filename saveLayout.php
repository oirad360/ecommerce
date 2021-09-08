<?php
$data=json_decode(file_get_contents('php://input'),true);
$file=fopen("layouts.json","r");
$layouts=json_decode(fread($file,filesize("layouts.json")),true);
fclose($file);
if($data["id"]==="new"){
    if(count($layouts)>0) $data["id"]=$layouts[count($layouts)-1]["id"]+1;
    else $data["id"]=1;
    $layouts[]=$data;
} else {
    foreach($layouts as $layout){
        if($layout["id"]===$data["id"]){
            $layout=$data;
            break;
        }
    }
}
$file=fopen("layouts.json","w");
fwrite($file,json_encode($layouts));
fclose($file);
echo $data["id"];
?>