<?php
require_once 'database.php';
$conn=mysqli_connect($database['host'],$database['user'],$database['password'],$database['name']);
$request=json_decode(file_get_contents('php://input'),true);

$layoutID;
foreach($request as $key=>$value){
    if($key!=="childs") $reqEscape[$key]=mysqli_real_escape_string($conn,$request[$key]);
    else{
        $i=0;
        foreach($request["childs"] as $child){
            foreach($child as $key=>$value){
                if($key!=="content") $reqEscape["childs"][$i][$key]=mysqli_real_escape_string($conn,$value);
                else $reqEscape["childs"][$i][$key]=$value;
            }
            $i++;
        }
    }
}
if($reqEscape["id"]==="new"){
    $query="insert into layouts(display,flexDirection,height,width) values('".$reqEscape["display"]."','".$reqEscape["flexDirection"]."','".$reqEscape["height"]."','".$reqEscape["width"]."')";
    $res=mysqli_query($conn,$query);
    $query="select max(id) from layouts";
    $res=mysqli_query($conn,$query);
    $row=mysqli_fetch_array($res);
    $layoutID=$row[0];
}else{
    $query="update layouts set display='".$reqEscape["display"]."',flexDirection='".$reqEscape["flexDirection"]."',height='".$reqEscape["height"]."',width='".$reqEscape["width"]."' where id=".$reqEscape["id"];
    $res=mysqli_query($conn,$query);
    $query="delete from childs where layout_id=".$reqEscape["id"];
    $res=mysqli_query($conn,$query);
    $layoutID=$reqEscape["id"];
}
$data=array();
foreach($reqEscape["childs"] as $child){
    $query="insert into childs(layout_id,data_gen,data_id,data_parent_gen,data_parent_id,hasChilds,title,fontSize,display,flexDirection,height,width,margin)
    values('".$layoutID."','".$child["data_gen"]."','".$child["data_id"]."','".$child["data_parent_gen"]."','".$child["data_parent_id"]."','".$child["hasChilds"]."',
    '".$child["title"]."','".$child["fontSize"]."','".$child["display"]."','".$child["flexDirection"]."','".$child["height"]."','".$child["width"]."','".$child["margin"]."')";
    $res=mysqli_query($conn,$query);
    if(!$child["hasChilds"])
    $data["[data-gen='".$child["data_gen"]."']"]["[data-id='".$child["data_id"]."']"]=$child["content"];
}

$file=fopen("layout$layoutID.json","w");
fwrite($file,json_encode($data));
fclose($file);
mysqli_close($conn);
echo $layoutID;
?>