<?php

include('./php/clases/Constantes.php');
include('./php/clases/Fichero.php');

if (!isset($_GET['q'])) {
    exit;
}

$clave = $_GET['q'];



Fichero::getInstance()->getData($clave);
