<?php
require "logout.php";
//Reads raw POST data
$data = file_get_contents("php://input");
$objData = json_decode($data);

$username = $objData->username;
$password = $objData->password;

if(!ctype_alnum($username)){
    die("Alphanumeric characters only!");
    }
if(strlen($username) > 15){
    die("Username must be 15 characters or less.");
}
if(!ctype_alnum($password)){
    die("Password alphanumeric only!");
}
if(strlen($password)<5){
    die("Password must be longer than 5 characters.");
}

require "database.php";

$password = strtolower(md5($password));
$query = "INSERT INTO `users` ( `username`, `password`) VALUES ('%s', '%s');";
$result = mysqli_query($connection, sprintf($query, mysqli_real_escape_string($connection, $username), mysqli_real_escape_string($connection, $password)))
    or die("Failed to make a new account, ".mysqli_error($connection));
//log them in
$_SESSION['sessionId'] = "notimplementedyet";
echo "success";
?>
