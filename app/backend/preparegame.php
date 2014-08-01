<?php 
include('database.php');
include('calculatedistance.php');
$data = file_get_contents("php://input");
$objData = json_decode($data);
$username = $objData->randString;
$dist = 200;
$all = Array();
//CHECK IF CITY IS NEAR ONE OF THE CITIES ALREADY PICKED
function is_near_city($city, $cities){
  global $dist;
  $c = count($cities);
  for ($i = 0; $i < $c; $i++) {
    if(distance($city['lat'], $city['lon'], $cities[$i]['lat'], $cities[$i]['lon'],"K")<$dist)
      return true;
  }
  return false;
}

//CHECK IF CITY HAS THE SAME NAME OF THE CITIES ALREADY PICKED
function is_name_taken($city, $cities)
{
  $c = count($cities);
  for ($i = 0; $i < $c; $i++) {
    if($city['nom']===$cities[$i]['nom']){
      return true;
    }
  }
  return false; 
}

//pick a random city
/* $query = "SELECT DISTINCT s.nom, s.lon, s.lat FROM ( SELECT v.nom as nom, lon, lat FROM villes AS v INNER JOIN (SELECT nom FROM villes ORDER BY RAND() LIMIT 3 ) as v2 on v.nom = v2.nom order by v.nom ) AS s;"; */
$query = 'SELECT * FROM villes ORDER BY RAND() LIMIT 1;';
for ($j = 0; $j < 20; $j++) {
  // code...
  $cities = Array();
  $rand = rand(0,2);
  for ($i = 0; $i < 3; $i++) {
    do {
      $result = mysqli_query($connection, $query);
      $row = mysqli_fetch_assoc($result);
    } while (is_near_city($row, $cities) || is_name_taken($row, $cities));
    if($i === $rand) $row['flag']=1;
    else $row['flag']=0;
    array_push($cities, $row);
  }
  array_push($all, $cities);
}

$alljson = json_encode($all, JSON_PRETTY_PRINT);
echo $alljson;

/* function deleteDirectory($dir) { */
/*     system('rm -rf ' . escapeshellarg($dir), $retval); */
/*     return $retval == 0; // UNIX commands return zero on success */
/* } */
/* if(file_exists($_SERVER['DOCUMENT_ROOT'].'/app_tp/temp/'.$username)){ */
/*   deleteDirectory($_SERVER['DOCUMENT_ROOT'].'/app_tp/temp/'.$username); */
/* } */
/* mkdir($_SERVER['DOCUMENT_ROOT'].'/app_tp/temp/'.$username) */
/*   or die("error creating dir"); */

/* $l = count($all); */
/* for ($i = 0; $i < $l; $i++) { */
/*   for ($j = 0; $j < 3; $j++) { */
/*     // code... */
/*     $url = "http://maps.googleapis.com/maps/api/staticmap?center=" . $all[$i][$j]['lat'] . "," . $all[$i][$j]['lon'] . "&zoom=7&format=png&sensor=false&size=640x480&maptype=roadmap&style=feature:administrative.locality|visibility:off&key=AIzaSyDdIYLcSj7QQBxsiP4Cy0ChfpxnbdHK-4I"; */
/*     $image = imagecreatefrompng($url); */
/*     imagepng($image, $_SERVER['DOCUMENT_ROOT'].'/app_tp/temp/'.$username.'/'.$i.'.png', 3); */
/*   } */
/* } */


?>
