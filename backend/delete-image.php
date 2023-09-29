<?php
$image = $_POST["file"];

if (unlink($image)) {
    echo "deleted";
}
else {
    echo "not deleted";
}