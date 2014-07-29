<?php 
include('database.php');
include('calculatedistance.php');
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
for ($j = 0; $j < 15; $j++) {
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

$all = json_encode($all, JSON_PRETTY_PRINT);
echo $all;

?>
