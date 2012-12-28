<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$file_types = array("image/gif", "image/jpeg", "image/pjpeg", "image/png");
$file_size_max = 200000;
$save_folder = "images/upload/";

if (in_array($_FILES["file"]["type"], $file_types) &&
		$_FILES["file"]["size"] < $file_size_max)
{
	if ($_FILES["file"]["error"] > 0) 
	{
		echo "Error: " . $_FILE["file"]["error"];
	}
	else
	{
		$file_name = time() . getFileSuf($_FILES["file"]["name"]);
		move_uploaded_file($_FILES["file"]["tmp_name"], $save_folder . $file_name);
		echo $save_folder. $file_name;
	}
}
else
{
	echo "Invalid file!";
}

function getFileSuf($f) 
{
	$c = strrchr($f, '.');
	if ($c) 
		return $c;
	else
		return '';
}

?>
