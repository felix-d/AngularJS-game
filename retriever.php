<?php 
class Retriever {

  //Get images from google images api
  private static function get_images($query){
    //Build url
    $url = 'http://ajax.googleapis.com/ajax/services/search/images?v=1.0&';
    $url .= 'as_filetype=jpg&';
    $url .= 'imgsz=large&';
    $url .= 'imgtype=photo&';
    $url .= 'as_rights=('.
      'cc_publicdomain|'.
      'cc_attribute|'.
      'cc_sharealike|'.
      'cc_noncommercial|'.
      'cc_nonderived'.
      ')&';
    $url .= 'rsz=8&';
    $url .= 'q='.urlencode($query);

    //Curl
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $data = curl_exec($curl);
    curl_close($curl);

    //Decoding request
    $result = json_decode($data, true);
    return $result;
  }


  //Retourne un objet json contenant des urls valides d'images.
  private static function get_urls($images_as_json){
    $urls = array();
    foreach ($images_as_json["responseData"]["results"]
      as $img) {
        $url = $img['url'];
        $status = get_headers($url, 1)[0];
        if(preg_match('/200/',$status))
          array_push($urls, $img["url"]);
      }
    return $urls;
  }

  //Retourne une url aleatoire de celles recuperees
  private static function pick_random_url($list){
    $length = count($list);
    $num = rand(0,$length-1);
    return $list[$num];
  }

  public static function get_image($keyword){
    $images = Retriever::get_images($keyword);
    $ress = Retriever::get_urls($images);
    $res = Retriever::pick_random_url($ress);
    return $res;
  }

  public static function save_image($img, $size, $path){
    $width = $size;
    $height = $size;
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
    imagejpeg($image_p, $path, 100);
    return true;
  }

  public static function get_n_save($keyword, $size, $path){
    $image = Retriever::get_image($keyword);
    Retriever::save_image($image, $size, $path);
  }
}
?>
