<?php

class Constantes
{
    //Nombre del fichero txt de weatherlink
    public static $nombre_fichero = '../downld02.txt';

    //Número de lineas al comienzo del fichero que no contienen datos, solo cabeceras
    public static $lineas_saltar = 3;

    //Número de lineas de datos que representan 24 horas
    public static $lineas_ult_24h = 145;

    //Periodicidad temporal entre cada línea de datos (en minutos)
    public static $tiempo_entre_datos = 10;

    //Nombre de los campos del fichero y su posición (columna) (0 = primera posición)
    public static $campos_fichero = array(
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
    );
}
