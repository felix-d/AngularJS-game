<?php
class DB {
  // config.php
  private $db_user = "";
  private $db_password = "";
  private $db_host = "localhost";
  private $db_name = "base";
  private $con;
  // Create connection
  public function connect(){
    $con=mysqli_connect($db_host, $db_user, $db_password);
    $this->check_for_errors; 
  }

  public function disconnect(){
    $this->mysqli_close($con);
    $this->check_for_errors; 
  }

  private function check_for_errors(){
    if (mysqli_connect_errno()) {
      echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }
  }
}
?>
