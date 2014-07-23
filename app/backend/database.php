<?php
    $connection = mysqli_connect('localhost','felix','felix')
          or die("Database connection failed: " . mysqli_error());
    
    $dbselect= mysqli_select_db($connection, 'tp2')
          or die("Database selection failed: " . mysqli_error());
    
?>
