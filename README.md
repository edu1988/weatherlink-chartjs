# weatherlink-chartjs
Código para extraer los datos del archivo downld02.txt de Weatherlink y generar gráficas dinámicas para la web

Está programado para saltarse las primeras tres lineas de texto del fichero (cabeceras) y empezar a registrar los datos a partir de ahí. Aunque en general solo se utilizarán los datos de las últimas 24 horas del fichero.

Si el formato del fichero cambia, podría dar errores, ya que el código aún no se ha puesto a prueba en todos los escenarios.

Para probar el código hacer lo siguiente:

Hay que subir por ftp al root del proyecto la carpeta "graficas".

En la página HTML en la que se quieran poner las gráficas habrá que hacer lo siguiente:
    Poner entre las etiquetas los scripts necesarios como se ve en el archivo de ejemplo "index.html"
    El script de Chart.js --> <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"> </script>
    Enlace a los scripts que generan las gráficas: - <script src="./js/PropiedadesGraficas.js"></script> - <script src="./js/AppGraficas.js"></script>

El archivo html donde se pongan las gráficas deberá estar en el root del proyecto, de no ser así, habrá que cambiar las rutas relativas en los enlaces a los scripts.

Finalmente habrá que añadir un div con id = "graficas" en el lugar del HTML donde se quieran cargar las gráficas.

Recordar que el archivo desde el que se obtienen los datos ("downld02.txt") debe estar en el root del directorio. Este archivo debe mantener dicho nombre "downld02.txt", aunque en el archivo de php llamado "Constantes.php" se pueden configurar algunas de estas variables.

Para ver un ejemplo de cómo quedan estas gráficas podéis verlas en la zona inferior de la siguiente página:

http://www.meteohacinas.es/datosActuales.htm
