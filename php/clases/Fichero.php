<?php

require './constantes.php';

/*Al instanciar esta clase cargamos en memoria todos los datos del fichero txt*/
class Fichero
{
    private static $instance;
    private static $file;
    public static $array;


    public function __construct()
    {
        $this->init();
    }

    private function init()
    {
        self::$array = array();
        self::$file = fopen('../' . NOMBRE_FICHERO, 'r');
        $linea = fgets(self::$file);
        for ($i = 0; $i < LINEAS_SALTAR; $i++) {
            $linea = fgets(self::$file);
        }
        while ($linea) {
            $datos_linea = preg_split("/[\s]+/", trim($linea));
            self::$array[] = $datos_linea;
            $linea = fgets(self::$file);
        }
    }

    public function temps()
    {
        $this->getData('tempout');
    }

    public function hums()
    {
        $this->getData('outhum');
    }

    public function getData($campo)
    {
        $data = array();

        $num_filas = $this->getNumFilas();

        $filas_saltar = $num_filas - LINEAS_ULT_24H;

        for ($i = $filas_saltar; $i < $num_filas; $i++) {
            $data['horas'][] = self::$array[$i][CAMPOS['time']];
            $data['data'][] = self::$array[$i][CAMPOS[$campo]];
        }

        $this->json($data);
    }

    public function json($data)
    {
        header('Content-Type: application/json');  // <-- header declaration
        echo json_encode($data, true);    // <--- encode
        exit;
    }

    public function getNumFilas()
    {
        return count(self::$array);
    }

    public static function getInstance()
    {
        if (!self::$instance instanceof self) {
            self::$instance = new self();
        }

        return self::$instance;
    }
}
