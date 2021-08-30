<?php
require_once 'database.php';
$conn=mysqli_connect($database['host'],$database['user'],$database['password'],$database['name']);
$layoutID=mysqli_real_escape_string($conn,$_GET['layoutID']);
$query="delete from layouts where id=$layoutID";
$res=mysqli_query($conn,$query);
unlink("layout$layoutID.json");
mysqli_free_result($res);
mysqli_close($conn);
?>