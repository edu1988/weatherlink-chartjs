var AppGraficas = AppGraficas || {}

AppGraficas.app = {

    iniciar: function (graficas) {
        /*Desglosar el parámetro en sus dos componentes (propiedades de las gráficas y variables) */
        var propiedades = graficas.propiedades;
        var globales = graficas.variables.globales;
        var defaultOptions = graficas.variables.defaultOptions;
        var defaultDataset = graficas.variables.defaultDataset;

        /*Iniciar la configuración global del Chart */
        initChartGlobalConf();

        /*Iniciar las gráficas */
        for (let propiedad in propiedades) {
            /*Objeto con la info de la grafica */
            var info_grafica = propiedades[propiedad];

            /*Creamos el html necesario para la gráfica y guardamos el canvas en el objeto global*/
            info_grafica.canvas = contenedorHtmlGrafica(info_grafica);

            /*Obtenemos los datos para esa gráfica y creamos la gráfica */
            crearGrafica(info_grafica);
        }

        function initChartGlobalConf() {
            //Configuraciones globales para el chart
            Chart.defaults.global.tooltips.mode = defaultOptions.mode;
            Chart.defaults.global.tooltips.intersect = defaultOptions.intersect;
            Chart.defaults.global.elements.point.radius = defaultOptions.pointRadius;
            Chart.defaults.global.elements.line.borderWidth = defaultDataset.borderWidth;
            Chart.defaults.global.tooltips.backgroundColor = defaultOptions.tooltipsBgcolor;

            //Desactivar ocultamiento de gráfica
            Chart.defaults.global.legend.onClick = defaultOptions.legendOnClick;

            //No mostrar leyendas (titulos de gráficas)
            Chart.defaults.global.legend.display = defaultOptions.legendDisplay;
        }

        function contenedorHtmlGrafica(propiedades) {
            /*Crear div fila contenedor de la gráfica */
            var divFila = document.createElement('div');
            divFila.classList.add('row');
            divFila.classList.add('p-3');
            divFila.classList.add('contenedor');

            /*Crear div columna contenedor de la grafica */
            var idColumn = 'chart-' + propiedades.id;

            var divColumna = document.createElement('div');
            divColumna.classList.add('col-md-12');
            divColumna.id = idColumn;


            /*Crear el título de la grafica */
            var idChart = propiedades.id;
            var titulo_grafica = propiedades.titulo;
            if (propiedades.unidad) {
                titulo_grafica += ' (' + propiedades.unidad + ')';
            }

            /*Creamos un canvas con el id correspondiente */
            var canvas = document.createElement('canvas');
            canvas.id = idChart;

            if (propiedades.opciones.canvas) {
                canvas.width = propiedades.opciones.canvas.width;
                canvas.height = propiedades.opciones.canvas.height;
            }

            /*Añadir al divColumna el título de la grafica */
            divColumna.insertAdjacentHTML('beforeend', '<div class="titulo-grafica">' + titulo_grafica + '</div>');

            /*Añadir al divColumna el canvas */
            divColumna.appendChild(canvas);

            /*Añadir la columna a la fila */
            divFila.appendChild(divColumna);

            /*Añadir la columna al contenedor general */
            globales.divGraficas.appendChild(divFila);

            /*Retornar el elemento canvas */
            return canvas;
        }

        /*Función para crear una gráfica de chart js */

        function crearGrafica(propiedades) {
            /*Obtenemos el canvas de la gráfica */
            var canvas = propiedades.canvas;

            /*Obtenemos el contexto del canvas */
            var ctx = canvas.getContext('2d');

            /*Tipo de la gráfica */
            var type = propiedades.tipo;

            /*Data de la gráfica*/
            var objeto_data_inicial = propiedades[propiedades.data_inicial];

            crearData(objeto_data_inicial).then((response) => {

                /*Opciones de la gráfica */
                var options = crearOptions(propiedades, response);

                /*Creamos la gráfica y guardamos su instancia en el objeto global */
                var config = {
                    type: type,
                    data: response,
                    options: options
                }
                propiedades.chart = new Chart(ctx, config);

                /*Creamos los checkbox si los hay */
                if (propiedades.checkbox) {
                    crearInputs(propiedades, 'checkbox');
                }

                /*Creamos los radiobuttons si los hay */
                if (propiedades.radio) {
                    crearInputs(propiedades, 'radio');
                }
            });
        }

        function crearInputs(propiedades, tipoInput) {
            /*Elemento padre donde pondremos los checks */
            var id = 'chart-' + propiedades.id;
            var contenedor = document.getElementById(id);

            /*Contenedor exterior para los inputs*/
            var bloqueInputs = document.createElement('div');
            bloqueInputs.classList.add('bloque-inputs');

            /*Elemento inputs */
            var inputs = propiedades[tipoInput];

            for (let input in inputs) {
                var divWrapper = document.createElement('div');
                divWrapper.classList.add('bloque-input');
                var inputElem = document.createElement('input');
                inputElem.type = tipoInput;
                inputElem.id = id + '-' + tipoInput + '-' + input;
                inputElem.value = propiedades.id + '-' + input;

                if (tipoInput == 'radio') {
                    inputElem.addEventListener('click', cambiarData);
                    inputElem.name = id + '-' + tipoInput;
                }

                if (tipoInput == 'checkbox') {
                    inputElem.addEventListener('click', ponerQuitarDataset);
                }

                if (inputs[input].checked) {
                    inputElem.checked = true;
                }

                var label = document.createElement('label');
                label.setAttribute('for', inputElem.id);
                label.innerHTML = inputs[input].label;
                divWrapper.appendChild(inputElem);
                divWrapper.appendChild(label);

                bloqueInputs.appendChild(divWrapper);
                contenedor.appendChild(bloqueInputs);
            }
        }

        function ponerQuitarDataset(e) {

            /*Extraemos el value del input que contendrá información sobre la gráfica en la que
            nos encontramos y el nombre del input */
            var [nombre_grafica, nombre_dataset] = e.target.value.split('-');

            /*Vemos si el checkbox está clicado o no */
            var desseleccionado = !e.target.checked;

            /*Extraemos el chart en el que estamos operando */
            var chart = propiedades[nombre_grafica].chart;

            /*Recorremos los datasets de la gráfica para ver si existe aquel 
            correspondiente al checkbox */
            var datasets = chart.config.data.datasets;
            var dataset_buscado = false;
            for (let i = 0; i < datasets.length; i++) {
                var dataset = datasets[i];
                if (dataset.id == nombre_dataset) {
                    dataset_buscado = dataset;
                    break;
                }
            }

            /*Si sí que está, lo mostramos o lo ocultamos */
            if (dataset_buscado) {
                dataset_buscado.hidden = desseleccionado;
                /*Para concluir actualizamos la gráfica */
                chart.update();
                /*Si no está, creamos el dataset y lo añadimos a la gráfica */
            } else {
                /*Crear el dataset y cargarlo en la gráfica */
                /*Extaemos el objeto con la info del dataset a crear */
                var objeto_dataset = propiedades[nombre_grafica].checkbox[nombre_dataset].dataset;

                crearDataset(objeto_dataset).then(function (response) {
                    /*Extraemos los datos del response */
                    cargarDataset(response, chart);
                    /*Para concluir actualizamos la gráfica */
                    chart.update();
                });
            }


        }

        function cargarDataset(dataset, grafica) {
            grafica.config.data.datasets.push(dataset);
        }

        async function crearData(objeto_data) {
            /*En caso de ninguna de las anteriores, enviamos petición fetch */

            var url_data = objeto_data.url_data;
            var response = await fetch(url_data);
            var datos_json = await response.json();

            /*Labels */
            var labels = datos_json[objeto_data.labels];

            /*Datasets */
            var obj_datasets = objeto_data.datasets;
            var datasets = crearDatasets(obj_datasets, datos_json);

            /*Antes de retornarlo lo guardamos en memoria para futuros usos */
            var data = {
                labels: labels,
                datasets: datasets
            }

            return data;
        }

        async function crearDataset(dataset_obj) {

            /*Primero pedir los datos */
            var response_data = await fetch(dataset_obj.url_data);
            var json_data = await response_data.json();
            var data = json_data[dataset_obj.id];

            /*Añadimos los datos al dataset */
            //delete dataset_obj.url_data;
            dataset_obj.data = data;

            /*Añadimos las propiedades por defecto */
            for (let propiedad in defaultDataset) {

                if (dataset_obj[propiedad] === undefined) {
                    dataset_obj[propiedad] = defaultDataset[propiedad];
                }
            }

            return dataset_obj;
        }

        /*Función para crear todos los datasets iniciales de golpe a partir de los
        datos obtenidos de la url del objeto data */

        function crearDatasets(datasets_obj, datos) {

            var datasets = [];

            for (let dataset in datasets_obj) {

                /*Obtener el objeto dataset de cada iteración */
                var dataset_obj = datasets_obj[dataset];

                /*Obtener sus datos */
                var data = datos[dataset];

                /*Añadirlos al objeto */
                dataset_obj.data = data;

                /*Añadir las propiedades por defecto */
                /*Añadimos las propiedades por defecto */
                for (let propiedad in defaultDataset) {

                    if (dataset_obj[propiedad] === undefined) {
                        dataset_obj[propiedad] = defaultDataset[propiedad];
                    }
                }

                /*Añadirlo al array de datasets */
                datasets.push(dataset_obj);
            }

            return datasets;
        }

        function cambiarData(e) {
            /*Extraemos el value del input que contendrá información sobre la gráfica en la que
            nos encontramos y el nombre del input */
            var [nombre_grafica, nombre_data] = e.target.value.split('-');

            /*Extraemos el chart en el que estamos operando */
            var chart = propiedades[nombre_grafica].chart;

            /*Url que solo existirá en el caso de que solo haya que cambiar los datos */
            var url_cambiar_datos = propiedades[nombre_grafica].radio[nombre_data].url_data;

            /*Comprobamos primero si hay que cambiar todo el data o solo los datos */
            if (url_cambiar_datos === undefined) {

                /*Hay que cambiar todo el data */

                /*Extraemos el objeto data necesario para crearlo */
                var objeto_data = propiedades[nombre_grafica].radio[nombre_data].data || propiedades[nombre_grafica][nombre_data];

                crearData(objeto_data).then(function (response) {
                    /*Ponemos los datos en la gráfica */
                    chart.config.data = response;

                    /*Modificar la opcion de suggestedMax de la gráfica si es necesario */
                    var sugMax = objeto_data.suggestedMax || propiedades[nombre_grafica].opciones.suggestedMax;
                    sugMax = obtenerNuevoSugMax(response, sugMax);
                    modificarSugMax(chart, sugMax);

                    /*Actualizar chart */
                    chart.update();
                });

            } else {
                /*Solo hay que cambiar los datos */
                /*Pedimos los nuevos datos */
                fetch(url_cambiar_datos, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (res) {
                        //Guardamos los datos recibidos para el futuro
                        propiedades[nombre_grafica].radio[nombre_data].datos_guardados = res;

                        chart.config.data.datasets[0].data = res;
                    });
            }
            chart.update();
        }



        function xAxes(opciones) {
            var grids = gridLinesX(opciones);
            var ticks = ticksEjeX(opciones);
            return [{
                gridLines: grids,
                ticks: ticks,
            }];
        }

        function gridLinesX(opciones) {
            var drawTicks = opciones.drawTicksX === undefined ? defaultOptions.xAxes.drawTicks : opciones.drawTicksX;
            return {
                display: true,
                drawTicks: drawTicks,
            }
        }

        function ticksEjeX(opciones) {
            var maxRotation = opciones.maxRotation === undefined ? defaultOptions.xAxes.ticksMaxRotation : opciones.maxRotation;
            var padding = opciones.ticksXpadding === undefined ? defaultOptions.xAxes.ticksPadding : opciones.ticksXpadding;
            var autoSkip = opciones.ticksAutoSkip === undefined ? defaultOptions.xAxes.ticksAutoSkip : opciones.ticksXAutoSkip;
            var ticksXcallback = opciones.ticksXcallback === undefined ? defaultOptions.xAxes.ticksEjeX : opciones.ticksXcallback;

            return {
                maxRotation: maxRotation,
                padding: padding,
                autoSkip: autoSkip,
                callback: ticksXcallback,
            }
        }

        function suggestedMaxFn(opciones, objeto_data_response) {

            var suggestedMax = opciones.suggestedMax;

            if (typeof (suggestedMax) == 'object') {
                /*Obtenemos el los datos (mayor dato) del dataset a partir del cual queremos calcular
                el suggestedMax (a partir de su posición en el array total de datasets) */
                var dataset_index = opciones.suggestedMax.dataset_index;
                /*Obtenemos el array de datos completo */
                var datos = objeto_data_response.datasets[dataset_index].data;
                /*Obtenemos el valor más alto del array */
                var max = Math.max(...datos);
                /*Aplicamos la función para calcular el suggestedMax */
                var funcion = opciones.suggestedMax.function;
                var suggestedMax = funcion(max);
            }

            return suggestedMax;
        }

        function obtenerNuevoSugMax(data, sugMax) {
            var suggestedMax = sugMax;
            if (typeof (sugMax) == 'object') {
                suggestedMaxFn = sugMax.function;

                /*Máximo valor del primer dataset del data */
                var datos = data.datasets[0].data;
                var max = Math.max(...datos);
                suggestedMax = suggestedMaxFn(max);
            }
            if (typeof (sugMax) == 'function') {
                suggestedMaxFn = sugMax;

                /*Máximo valor del primer dataset del data */
                var datos = data.datasets[0].data;

                var max = Math.max(...datos);
                suggestedMax = suggestedMaxFn(max);
            }
            return suggestedMax;
        }

        function modificarSugMax(chart, sugMax) {
            /*Modificamos el sugMax del chart */
            chart.config.options.scales.yAxes[0].ticks.suggestedMax = sugMax;
        }

        function ticksEjeY(opciones, objeto_data_response) {
            var suggestedMax = suggestedMaxFn(opciones, objeto_data_response);

            var suggestedMin = opciones.suggestedMin === undefined ? defaultOptions.yAxes.suggestedMin : opciones.suggestedMin;
            var stepSize = /*opciones.stepSize === undefined ? defaultOptions.yAxes.stepSize :*/ opciones.stepSize;
            var maxTicksLimit = opciones.maxTicksLimit === undefined ? defaultOptions.yAxes.maxTicksLimits : opciones.maxTicksLimit;
            var padding = opciones.ticksYpadding === undefined ? defaultOptions.yAxes.ticksPadding : opciones.ticksYpadding;
            var beginAtZero = opciones.beginAtZero;

            return {
                suggestedMax: suggestedMax,
                suggestedMin: suggestedMin,
                stepSize: stepSize,
                maxTicksLimit: maxTicksLimit,
                padding: padding,
                beginAtZero: beginAtZero
            }
        }

        function gridLinesY(opciones) {
            var drawTicks = opciones.drawTicksY === undefined ? defaultOptions.yAxes.drawTicks : opciones.drawTicksY;
            var drawBorder = defaultOptions.yAxes.drawBorder;
            return {
                drawTicks: drawTicks,
                drawBorder: drawBorder,
            }
        }

        function yAxes(opciones, objeto_data_response) {
            var ticks = ticksEjeY(opciones, objeto_data_response);
            var gridlines = gridLinesY(opciones);

            var yAxe = {
                gridLines: gridlines,
                ticks: ticks,
            }

            if (opciones.yAxeType) {
                yAxe.type = opciones.yAxeType;
            }

            if (opciones.yAxeLabels) {
                yAxe.labels = opciones.yAxeLabels;
            }

            return [yAxe];
        }

        function scales(opciones, objeto_data_response) {
            if (opciones.scales) {
                return opciones.scales;
            }

            var ejesX = xAxes(opciones);
            var ejeY = yAxes(opciones, objeto_data_response);

            return {
                xAxes: ejesX,
                yAxes: ejeY,
            };
        }

        function tooltips(propiedades) {

            var unidad = propiedades.unidad || '';

            var label = function (tooltipItems, data) {

                var etiqueta = propiedades.tooltip;

                if (propiedades.checkbox) {
                    etiqueta = propiedades.checkbox[data.datasets[tooltipItems.datasetIndex].id].tooltip;
                }

                xlabel = data.labels[tooltipItems.index],
                    ylabel = tooltipItems.value;
                var labelGeneral = xlabel + ' - ' + etiqueta + ': ' + ylabel + ' ' + unidad;

                return labelGeneral;
            }

            var custom = function (tooltip) {
                if (!tooltip) return;

                tooltip.borderWidth = 0;
                tooltip.displayColors = false; /*Quitar caja de color del tooltip*/
            }

            var title = function () {
                return;
            }

            return {
                enabled: true,
                custom: custom,
                callbacks: {
                    title: title,
                    label: label,
                }
            }
        }

        /*Crear las opciones de la gráfica en función de los parámetros indicados
        pero también de los datos recibidos (suggestedMax en función de los datos
            recibidos) */
        function crearOptions(propiedades, objeto_data_response) {
            /*Objeto local de opciones de cada gráfica */
            var opciones = propiedades.opciones === undefined ? {} : propiedades.opciones;

            /*Características */
            var responsive = opciones.responsive === undefined ? defaultOptions.responsive : opciones.responsive;
            var aspectRatio = opciones.aspectRatio === undefined ? defaultOptions.aspectRatio : opciones.aspectRatio;
            var escalas = scales(opciones, objeto_data_response);
            var paneles = tooltips(propiedades);

            return {
                responsive: responsive,
                aspectRatio: aspectRatio,
                maintainAspectRatio: true,
                scales: escalas,
                tooltips: paneles
            }

        }

    },

}

document.addEventListener('DOMContentLoaded', function () {
    /*Obtener el parámetro principal (propiedades de las gráficas) */
    var graficas = AppGraficas.getPropiedades();

    /*Iniciar las gráficas */
    AppGraficas.app.iniciar(graficas);
});