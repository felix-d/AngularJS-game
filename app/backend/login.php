<?php
require "logout.php";
require "database.php";
$data = file_get_contents("php://input");
$objData = json_decode($data);
$username = strtolower($objData->username);
$password = $objData->password;
$password = strtolower(md5($password));
$query=sprintf("SELECT * FROM users WHERE username='%s' AND password='%s' LIMIT 1;", mysqli_real_escape_string($connection, $username), mysqli_real_escape_string($connection, $password));
$result = mysqli_query($connection, $query);
if(mysqli_num_rows($result) > 0){
    $_SESSION['sessionId'] = $username;
    echo "success";
}else{
    echo "No account with those credentials found, for ".$username;
}
?>
