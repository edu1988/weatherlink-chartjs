<?php

/*Al instanciar esta clase cargamos en memoria todos los datos del fichero txt*/

class Fichero
{
    private static $instance;
    private static $file;
    public static $array;
    private static $lineas_24h;
    private static $constantes;


    public function __construct()
    {
        $this->initConstantes();
        $this->initLineas24h();
        $this->initArrayDatos();
    }

    private function initConstantes()
    {
        self::$constantes = array();

        $const = class_exists('Constantes') ? true : false;

        $valores = [
            'nombre_fichero'        => 'downld02.txt',
            'lineas_saltar'         => 3,
            'lineas_ult_24h'        => 145,
            'tiempo_entre_datos'    => 10,
            'campos'                => array(
                'date'         => 0,
                'time'         => 1,
                'tempout'      => 2,
                'hitemp'       => 3,
                'lowtemp'      => 4,
                'outhum'       => 5,
                'dew'          => 6,
                'windspeed'    => 7,
                'dir'          => 8,
                'windrun'      => 9,
                'hispeed'      => 10,
                'hidir'        => 11,
                'windchill'    => 12,
                'heatindex'    => 13,
                'thw'          => 14,
                'thswindex'    => 15,
                'bar'          => 16,
                'rain'         => 17,
                'rainrate'     => 18,
                'solarrad'     => 19,
                'solarenergy'  => 20,
                'hisolarrad'   => 21,
                'uv'           => 22,
                'uvdose'       => 23,
                'hiuv'         => 24
            )
        ];

        foreach ($valores as $clave => $valor) {
            self::$constantes[$clave] = $const ? Constantes::$$clave ?? $valor : $valor;
        }
    }

    private function initArrayDatos()
    {
        self::$array = array();
        self::$file = fopen(self::$constantes['nombre_fichero'], 'r');
        $linea = fgets(self::$file);
        for ($i = 0; $i < self::$constantes['lineas_saltar']; $i++) {
            $linea = fgets(self::$file);
        }
        while ($linea) {
            $datos_linea = preg_split("/[\s]+/", trim($linea));
            self::$array[] = $datos_linea;
            $linea = fgets(self::$file);
        }
    }


    public function getDataLluviaTotalizadaPorHoras()
    {
        $lluvias_totalizadas = array();

        //Partimos del array original de horas y lluvias
        $lluvias = $this->getData('rain', false);


        //Avanzamos hasta encontrar la primera hora en punto
        $i = 0;
        $hora = explode(':', $lluvias['horas'][$i])[1];
        while ($hora != '00') {
            $i++;
            $hora = explode(':', $lluvias['horas'][$i])[1];
        }

        $i++;

        $horas = $lluvias['horas'];
        $rains = $lluvias['rain'];

        $num_filas = count($rains);

        $lluvia_totalizada_hora = 0;

        $hora = '';
        $horaActual = '';
        $lluvia = '';

        for ($j = $i; $j < $num_filas; $j++) {
            //Hora y lluvia en cada iteración
            $horaActual = $horas[$j];
            $hora = explode(':', $horaActual)[1];
            $lluvia = $rains[$j];

            $lluvia_totalizada_hora += $lluvia;

            if ($hora == '00') {
                //Guardar la hora
                $lluvias_totalizadas['horas'][] = $horaActual;

                //Guardar la lluvia totalizada
                $lluvias_totalizadas['rainh'][] = $lluvia_totalizada_hora;

                //Resetear lluvia totalizada por hora
                $lluvia_totalizada_hora = 0;
            }
        }

        //Si la última hora es distinta de 00 (no es hora en punto), el último
        //tramo habrá quedado sin guardar, así que lo guardamos.
        if ($hora != '00') {
            //Guardar la hora
            $lluvias_totalizadas['horas'][] = $this->sumarHora($horaActual);

            //Guardar la lluvia totalizada
            $lluvias_totalizadas['rainh'][] = $lluvia_totalizada_hora;
        }

        //Guardar el último período
        return $lluvias_totalizadas;
    }

    /*Función genérica para obtener las últimas 24 horas de datos
    de cualquier dato de formato simple (temps, hums, etc) */
    public function getData($campo, $json = true)
    {
        $excep = ['rainh'];

        if ($campo == 'rainh') {
            $data = $this->getDataLluviaTotalizadaPorHoras();
        }

        if (!in_array($campo, $excep)) {
            $data = array();

            $num_filas = $this->getNumFilas();

            $filas_saltar = $num_filas - self::$lineas_24h;

            for ($i = $filas_saltar; $i < $num_filas; $i++) {
                $data['horas'][] = self::$array[$i][self::$constantes['campos']['time']];
                $data[$campo][] = self::$array[$i][self::$constantes['campos'][$campo]];
            }
        }

        if ($json) {
            $this->json($data);
        }

        return $data;
    }

    public function json($data)
    {
        header('Content-Type: application/json');
        echo json_encode($data, true);
        exit;
    }

    public function getNumFilas()
    {
        return count(self::$array);
    }

    private function initLineas24h()
    {
        $periodicidad = self::$constantes['tiempo_entre_datos'] ?? 10;
        $lineas_por_hora = (int)(60 / $periodicidad);
        self::$lineas_24h = $lineas_por_hora * 24 + 1;
    }

    public static function getInstance()
    {
        if (!self::$instance instanceof self) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    private function sumarHora($hora)
    {
        $partes = explode(':', $hora);
        $horaFinal = (int) $partes[0] + 1;
        if ($horaFinal == 24) $horaFinal = 0;
        return $horaFinal . ':00';
    }
}
