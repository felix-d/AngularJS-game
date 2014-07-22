<?php
include 'retriever.php';

/* Retriever::get_n_save('cormoranche-sur-saone france', 600, '../../temp/test.jpg'); */

include 'database.php';
$db = new DB();
$db->connect();
include '../../tools/populate_db.php';
?>
