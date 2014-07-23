<?php
require "checksession.php"; //This will send the 401 if they're not logged in.
require "database.php";

//Retrieve user details
$username = $_SESSION['sessionId'];
$query = sprintf("SELECT * FROM users WHERE username='%s';", mysql_real_escape_string($username));
$result = mysql_query($query) or die("error");
if(mysql_num_rows($result) == 0)
    die ("error");
$arr = mysql_fetch_assoc($result);
//Get the data
//Json encode
echo json_encode(array('username' => $username));
?>
