<?php 
include('retriever.php');
$data = file_get_contents("php://input");
$objData = json_decode($data);

$username = $objData->username;
$newgame = $objData->newgame;
$closegame = $objData->closegame;
$username = 'lol';
$closegame = false;
$newgame = false;

if($closegame){
  rmdir($_SERVER['DOCUMENT_ROOT'].'/app_tp/temp/'.$username)
    or die("error removing dir");
  die("success");
}

if($newgame) mkdir($_SERVER['DOCUMENT_ROOT'].'/app_tp/temp/'.$username)
  or die("error creating dir");

include("database.php");

$list = Array();
$minpop = 100000;
$query = "SELECT * FROM villes WHERE pop > 10000 ORDER BY RAND() LIMIT 3";

for ($i = 0; $i < 10; $i++) {
  $temp = Array();
  $result = mysqli_query($connection, $query);
  $count = 0;
  $rand = rand(1,3);
  while($row = mysqli_fetch_array($result)){
    $count++;
    $temp2 = Array();
    $temp2['name'] = $row[1];
    if($count==$rand){
      $temp2['flag'] = 1;
      Retriever::get_n_save("ville france ". $row[1], 300, $_SERVER['DOCUMENT_ROOT'].'/app_tp/temp/'.$username.'/'.$i.'.jpg');
    }

    else $temp2['flag'] = 0;
  array_push($temp, $temp2);
  }
  array_push($list, $temp);
}
$list = json_encode($list, JSON_PRETTY_PRINT);
echo '<pre>'.$list.'</pre>';
file_put_contents($_SERVER['DOCUMENT_ROOT'].'/app_tp/temp/'. $username. '/game.json', $list);

/* for ($i = 0; $i < ; $i++) { */
/*   Retriever:: */
/* } */
?>

