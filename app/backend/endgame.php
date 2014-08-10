<?php
include('database.php');
$data = file_get_contents("php://input");
$objData = json_decode($data);
$username = strtolower($objData->username);
$score = intval($objData->score);
//On commence par tester si le nouveau score est plus haut que le dernier
$query = sprintf("SELECT highestscore FROM users WHERE username='%s';", mysqli_real_escape_string($connection, $username));

$result = mysqli_query($connection, $query);

$row = mysqli_fetch_array($result);

if ($row[0] == null || $row[0] < $score) {
  $query = sprintf("UPDATE users SET highestscore=%s WHERE username='%s';", mysqli_real_escape_string($connection, $score), mysqli_real_escape_string($connection, $username));
  $result = mysqli_query($connection, $query) or die( mysqli_error($connection));
}

//On ajoute le score au score total
$query = sprintf("UPDATE users SET totalscore=totalscore+%s WHERE username='%s';", mysqli_real_escape_string($connection, $score), mysqli_real_escape_string($connection, $username));
  $result = mysqli_query($connection, $query) or die(mysqli_error($connection));

//On incremente le nombre de parties jouees
$query = sprintf("UPDATE users SET numgameplayed=numgameplayed+1 WHERE username='%s';", mysqli_real_escape_string($connection, $username));
$result = mysqli_query($connection, $query) or die(mysqli_error($connection));

echo "success";
?>

