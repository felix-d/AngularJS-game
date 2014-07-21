<?php

// Retourne la reponse de l'API de Google sous forme de tableau php.
function get_images($query){
    $url = 'http://ajax.googleapis.com/ajax/services/search/images?v=1.0&as_filetype=jpg&imgsz=large&imgtype=photo&as_rights=(cc_publicdomain|cc_attribute|cc_sharealike|cc_noncommercialcc_nonderived)&rsz=8&q=';

    $url .= '';
    $url .= urlencode($query);
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $data = curl_exec($curl);
    curl_close($curl);
    //decoding request
    $result = json_decode($data, true);
    return $result;
}

//Retourne un objet json contenant des urls valides d'images.
function get_urls($images_as_json){
  $urls = array();
  foreach ($images_as_json["responseData"]["results"] as $img) {
    $url = $img['url'];
    $status = get_headers($url, 1)[0];
    /* echo $status . "<br/>"; */
    if(preg_match('/200/',$status))
      array_push($urls, $img["url"]);
  }
  return $urls;
}

//Retourne une url aleatoire de celles recuperees
function pick_random_url($list){
  $length = count($list);
  $num = rand(0,$length-1);
  return $list[$num];
}

function display($images){
  foreach($images as $img){
    echo "<img src='".$img."'/><br/>";
  }
}
function display_single($img){
    echo "<img src='".$img."'/><br/>";
}
function saveImage($img){
  $width = 600;
  $height = 600;
  $filename = $img;
  list($width_orig, $height_orig) = getimagesize($filename);
  if($width_orig==0) return false;
  $ratio_orig = $width_orig/$height_orig;
  if ($width/$height > $ratio_orig) {
    $width = $height*$ratio_orig;
  } else {
    $height = $width/$ratio_orig;
  }
  $image_p = imagecreatetruecolor($width, $height);
  $image = imagecreatefromjpeg($filename);
  imagecopyresampled($image_p, $image, 0, 0, 0, 0, $width, $height, $width_orig, $height_orig);

  // Output
  imagejpeg($image_p, "test.jpg", 100);
  return true;
}

$images = get_images("montreal");
$ress = get_urls($images);
$res = pick_random_url($ress);
/* display_single($res); */
/* display($ress); */
// Set a maximum height and width
if(saveImage($res))
  echo "<img src='test.jpg'/><br/>";
else
  echo "ERROR";

?>

