<?php
include('database.php');
$query="SELECT username, highestscore, numgameplayed, totalscore  FROM users order by highestscore desc limit 10;";
$json = Array();
$result = mysqli_query($connection, $query) or die( mysqli_error($connection));
$i=0;
while($res = mysqli_fetch_assoc($result)){
  $json[$i] = $res;
  $i++;
}
$res = json_encode($json);
echo $res;
?>

