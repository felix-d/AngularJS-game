<?php 
//*******************************************************
//DEF: Exports script.sql in sql/ folder for creating & populating database.
//
//J'aurais pu loader le dump xml dans phpMyAdmin, supprimer les colonnes
//non desirees et refaire un dump, mais c'est la methode paresseuse! :P

//WARNING: C'est de la bonne vieille programmation imperative lineaire
//Je n'ai pas cru necessaire de faire de l'OO pour un script avec une
//logique lineaire.
//*******************************************************

//Open xml file
if(!$xml = simplexml_load_file($_SERVER['DOCUMENT_ROOT']."/app_tp/xml/villes_france.xml")) 
  die("Failed to open xml");

//set filter value

//get tables
$cities = $xml->database->table;

//init array for results
$res = Array();

//Parse XML file, adding city name and population only
foreach ($cities as $caracteristics) {

  $city = Array();

  foreach ($caracteristics as $c) {
    $name = $c['name'];

    //check column's attribute name
    switch ($name) {
      case 'ville_nom':
        $city['nom'] = $c->__toString();
        break;

      case 'ville_longitude_deg':
        $city['lon'] = $c->__toString();
        break;

      case 'ville_latitude_deg':
        $city['lat'] = $c->__toString();
        break;

      default:
        break;
    }
  }
array_push($res, $city);
}


//Create file
$sql_script = $_SERVER['DOCUMENT_ROOT']."/app_tp/sql/fill_db.sql";
$handle = fopen($sql_script, 'w') or die("can't open file");
$script = '';
$script .= 
  "DROP DATABASE tp2;\n" .
  "CREATE DATABASE tp2;\n\n" .
  "USE tp2\n\n" .
  "CREATE TABLE villes\n" .
  "(\n".
  "id int NOT NULL AUTO_INCREMENT,\n" .
  "nom varchar(255) NOT NULL,\n" .
  "lon float(10,6) NOT NULL,\n" .
  "lat float(10,6) NOT NULL,\n" .
  "PRIMARY KEY (id)\n".
  ");\n\n";

$script .=
  "CREATE TABLE users\n" .
  "(\n" .
  "username varchar(255) NOT NULL UNIQUE,\n" .
  "password varchar(255) NOT NULL, \n" .
  "token varchar(255), \n" .
  "salt varchar(255), \n" .
  "highestscore varchar(255) DEFAULT 0, \n" .
  "numgameplayed varchar(255) DEFAULT 0, \n" .
  "totalscore varchar(255) DEFAULT 0, \n" .
  "PRIMARY KEY (username)\n".
  ");\n\n";

foreach ($res as $f) {
  $script .=
    "INSERT INTO villes (nom, lon, lat) VALUES " .
    '("'.$f['nom'].'", '.$f['lon'].",".$f['lat'].");\n\n"; 
}


fwrite($handle, $script);
fclose($handle);
?>
