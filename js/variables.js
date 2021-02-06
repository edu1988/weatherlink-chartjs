var app = app || {};

/*Inicializar todas las variables globales necesarias*/
app.variables_globales = (function () {

    var escritorio = window.innerWidth > 800,

        /*Aspect Ratio Gráficas */
        aspectRatioEscritorio = 2.7,
        aspectRatioMovil = 1.8,
        aspectRatio = escritorio ? aspectRatioEscritorio : aspectRatioMovil,

        /*Tamaño puntos gráfica de viento */
        radioPuntosVientoEscritorio = 3,
        radioPuntosMovil = 1,
        radioPuntosViento = escritorio ? radioPuntosVientoEscritorio : radioPuntosMovil,

        /*Aspect Ratio Grafica distribución de viento */
        asRatGrafDistVientEs = 2.5,
        asRatGrafDistVientMov = 1.1,
        asRatGrafDistVient = escritorio ? asRatGrafDistVientEs : asRatGrafDistVientMov,

        /*Contenedor global de las gráficas */
        divGraficas = document.getElementById('graficas');

    /*export*/
    const variables = {

        globales: {
            divGraficas: divGraficas,
        },

        defaultDataset: {
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            borderColor: 'rgb(45,45,45)',
            borderWidth: 2,
            cubicInterpolationMode: 'monotone',
        },

        defaultOptions: {
            mode: "index",
            intersect: false,
            responsive: true,
            pointRadius: 0,
            tooltipsBgcolor: "rgba(0,0,0,0.4)",
            legendOnClick: null,
            legendDisplay: false,
            aspectRatio: aspectRatio,
            aspectRatioDV: asRatGrafDistVient,
            radioPuntosViento: radioPuntosViento,
            xAxes: {
                drawTicks: false,
                ticksMaxRotation: 0,
                ticksPadding: 10,
                ticksAutoSkip: false, //Impide que las etiquetas se solapen
                ticksEjeX: function (value) {
                    // return value;
                    var label = value.substring(0, value.length - 3);
                    if (value.endsWith("00")) {
                        return escritorio ? label + "h" : label % 2 == 0 ? label + "h" : null;
                    }
                }
            },
            yAxes: {
                suggestedMax: undefined,
                suggestedMin: undefined,
                stepSize: 1,
                maxTicksLimits: 10,
                ticksPadding: 10,
                drawTicks: false,
                drawBorder: false,
            },
        }
    }

    return variables;

});