<?php
/* require_once 'database.php';
$conn=mysqli_connect($database['host'],$database['user'],$database['password'],$database['name']); */

$file=fopen("layouts.json","r");
$layouts=json_decode(fread($file,filesize("layouts.json")),true);
foreach($layouts as $layout){
    if($layout["id"]==$_GET['layoutID']){
        fclose($file);
        echo json_encode($layout);
        break;
    } 
}

/* $layoutID=mysqli_real_escape_string($conn,$_GET['layoutID']);
$query="select * from layouts where id=".$layoutID;
$res=mysqli_query($conn,$query);
$row=mysqli_fetch_assoc($res);
$result=$row;
$query="select * from childs where layout_id=".$layoutID;
$res=mysqli_query($conn,$query);
while($row=mysqli_fetch_assoc($res)) $result["childs"][]=$row;
$file=fopen("layout$layoutID.json","r");
$content=json_decode(fread($file,filesize("layout$layoutID.json")));
$result["content"]=$content;
mysqli_free_result($res);
mysqli_close($conn);
echo json_encode($result); */
?>