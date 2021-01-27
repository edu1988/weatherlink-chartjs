<?php

include('./clases/Fichero.php');

$keys = ['temps', 'hums'];

if (!isset($_GET['q'])) {
    exit;
}

$clave = $_GET['q'];

if (!in_array($clave, $keys)) {
    exit;
}


Fichero::getInstance()->$clave();
