var AppGraficas = AppGraficas || {};

AppGraficas.propiedades = propiedades = {

    temperatura: {
        id: 'temperatura', //Esta propiedad ha de llamarse como la propiedad del objeto
        titulo: 'Temperatura',
        tipo: 'line',
        unidad: "ºC",
        data_inicial: 'data',
        data: {
            url_data: '/api.php?q=tempout',
            objeto_data: undefined,
            datos: undefined,
            labels: 'horas',
            datasets: {
                /*Cada propiedad del objeto datasets debe llamarse como la clave
                de los datos que llegan desde el backend */
                tempout: {
                    id: 'tempout',
                    borderColor: 'rgba(200,0,0,0.6)',
                }
            }
        },

        checkbox: {
            tempout: {
                label: 'Temperatura',
                tooltip: 'Temperatura.',
                checked: true
            },
            dew: {
                label: 'Temp. de rocío',
                tooltip: 'Temp. rocío',
                dataset: {
                    id: 'dew',
                    url_data: '/api.php?q=dew',
                    borderColor: 'rgb(108, 146, 150)',
                    borderWidth: 1,
                    borderDash: [4, 3],
                }
            },
            windchill: {
                label: 'Sensación térmica',
                tooltip: 'Windchill',
                dataset: {
                    id: 'windchill',
                    url_data: '/api.php?q=windchill',
                    borderColor: 'rgb(1, 92, 12)',
                    borderWidth: 1,
                }
            },
        },

        opciones: {
            stepSize: 2,
        },
    },

    humedad: {
        id: 'humedad', //Esta propiedad ha de llamarse como la propiedad del objeto
        tipo: 'line',
        titulo: "Humedad",
        tooltip: 'Humedad',
        unidad: "%",
        data_inicial: 'hum',
        hum: {
            url_data: '/api.php?q=outhum',
            objeto_data: undefined,
            datos: undefined,
            labels: 'horas',
            datasets: {
                /*Cada propiedad del objeto datasets debe llamarse como la clave
                de los datos que llegan desde el backend */
                outhum: {
                    id: 'outhum',
                    borderColor: 'rgba(88,132,252,0.6)',
                }
            }
        },

        opciones: {
            // suggestedMax: 50,
            // suggestedMin: 10,
            // stepSize: 5,
        },
    },

    presion: {
        id: 'presion', //Esta propiedad ha de llamarse como la propiedad del objeto
        tipo: 'line',
        titulo: 'Presión barométrica',
        tooltip: 'Presión',
        unidad: "hPa",
        data_inicial: 'pres',
        pres: {
            url_data: '/api.php?q=bar',
            objeto_data: undefined,
            datos: undefined,
            labels: 'horas',
            datasets: {
                /*Cada propiedad del objeto datasets debe llamarse como la clave
                de los datos que llegan desde el backend */
                bar: {
                    id: 'bar',
                    borderColor: 'rgba(0,200,0,0.6)',
                }
            }
        },

        opciones: {
            // suggestedMax: 50,
            // suggestedMin: 10,
            stepSize: 1,
        },
    },

    lluvia: {
        id: 'lluvia', //Esta propiedad ha de llamarse como la propiedad del objeto
        tipo: 'bar',
        titulo: 'Lluvia',
        tooltip: 'Lluvia',
        unidad: 'mm',
        data_inicial: 'rain',
        rain: {
            url_data: '/api.php?q=rain',
            objeto_data: undefined,
            datos: undefined,
            labels: 'horas',
            datasets: {
                /*Cada propiedad del objeto datasets debe llamarse como la clave
                de los datos que llegan desde el backend */
                rain: {
                    id: 'rain',
                    borderColor: 'rgba(0,76,255,0.6)',
                    backgroundColor: 'rgba(0,76,255,0.1)',
                }
            }
        },

        radio: {
            rain: {
                label: '10 min',

                checked: true
            },
            rainh: {
                label: '1 h',
                data: {
                    url_data: '/api.php?q=rainh',
                    labels: 'horas',
                    datasets: {
                        rainh: {
                            id: 'rainh',
                            borderColor: 'rgba(0,76,255,0.6)',
                            backgroundColor: 'rgba(0,76,255,0.1)',
                        }
                    }
                }
            },
            acumulada: {
                label: 'Acum.',
                data: {
                    url_data: '/datos-actuales-json/acumulada',
                    labels: 'horas',
                    datasets: {
                        acumulada: {
                            id: 'acumulada',
                            type: 'line',
                            borderColor: 'rgba(0,76,255,0.6)',
                            backgroundColor: 'rgba(0,76,255,0.1)',
                        }
                    },
                    /*Función optativa para recalcular un nuevo suggestedMax */
                    suggestedMin: 0,
                    suggestedMax: function (value) {
                        return Math.ceil(value);
                    }
                }
            }
        },

        opciones: {
            calculateSugMax: {
                dataset_index: 0,
                function: function (value) {
                    //return Math.ceil(value);
                    return value < 1 ? 1 : Math.round((value + 0.2) * 10) / 10;
                }
            },
            suggestedMax: 1,
            suggestedMin: 0,
            stepSize: 0.2,
            beginAtZero: true,
        },
    },

    intensidad_prec: {
        id: 'intensidad_prec', //Esta propiedad ha de llamarse como la propiedad del objeto
        tipo: 'line',
        titulo: 'Intensidad de precip.',
        tooltip: 'Intensidad',
        unidad: "mm/h",
        data_inicial: 'intensidad',
        intensidad: {
            url_data: '/api.php?q=rainrate',
            objeto_data: undefined,
            datos: undefined,
            labels: 'horas',
            datasets: {
                /*Cada propiedad del objeto datasets debe llamarse como la clave
                de los datos que llegan desde el backend */
                rainrate: {
                    id: 'rainrate',
                    borderColor: 'rgba(0,0,200,0.6)',
                    backgroundColor: 'rgba(0,0,200,0.1)',
                }
            }
        },

        opciones: {},
    },

    velviento: {
        id: 'velviento', //Esta propiedad ha de llamarse como la propiedad del objeto
        tipo: 'line',
        titulo: "Velocidad de viento",
        unidad: "km/h",
        data_inicial: 'wind',
        wind: {
            url_data: '/api.php?q=hispeed-windspeed',
            objeto_data: undefined,
            datos: undefined,
            labels: 'horas',
            datasets: {
                /*Cada propiedad del objeto datasets debe llamarse como la clave
                de los datos que llegan desde el backend */
                hispeed: {
                    id: 'hispeed',
                    borderColor: 'rgba(101,194,132,0.8)',
                },
                windspeed: {
                    id: 'windspeed',
                    tooltip: 'Med.',
                    borderColor: 'rgb(10, 113, 13)',
                },
            }
        },

        checkbox: {
            windspeed: {
                label: 'Viento 10 min',
                tooltip: 'Med.',
                checked: true
            },
            hispeed: {
                label: 'Viento máx. 10 min',
                tooltip: 'Máx.',
                checked: true
            },
        },

        opciones: {
            // suggestedMax: 50,
            // suggestedMin: 10,
            stepSize: 2,
        },
    },

    // direccionv: {
    //     id: 'direccionv', //Esta propiedad ha de llamarse como la propiedad del objeto
    //     tipo: 'line',
    //     titulo: "Dirección de viento",
    //     data_inicial: 'dirv',
    //     dirv: {
    //         url_data: '/datos-actuales-json/horas-dirs',
    //         objeto_data: undefined,
    //         datos: undefined,
    //         labels: 'horas',
    //         datasets: {
    //             /*Cada propiedad del objeto datasets debe llamarse como la clave
    //             de los datos que llegan desde el backend */
    //             dirs: {
    //                 id: 'dirs',
    //                 borderColor: 'rgba(88,132,252,0.6)',
    //                 showLine: false,
    //                 pointBackgroundColor: "rgba(156, 9, 51)",
    //                 pointBorderColor: "rgba(156, 9, 51)",
    //                 pointRadius: defaultOptions.radioPuntosViento,
    //                 pointBorderWidth: 1
    //             }
    //         }
    //     },

    //     opciones: {
    //         yAxeType: 'category',
    //         yAxeLabels: [
    //             "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    //             "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
    //         ],
    //     },
    // },

    // distv: {
    //     id: 'distv', //Esta propiedad ha de llamarse como la propiedad del objeto
    //     tipo: 'radar',
    //     titulo: "Distribución del viento",
    //     unidad: '%',
    //     data_inicial: 'distv',
    //     distv: {
    //         url_data: '/datos-actuales-json/distv',
    //         objeto_data: undefined,
    //         datos: undefined,
    //         labels: 'dirs',
    //         datasets: {
    //             /*Cada propiedad del objeto datasets debe llamarse como la clave
    //             de los datos que llegan desde el backend */
    //             porc: {
    //                 id: 'porc',
    //                 borderColor: 'rgba(15,133,127,0.6)',
    //                 backgroundColor: 'rgba(15,133,127,0.1)',
    //                 pointRadius: 2,
    //             }
    //         }
    //     },

    //     radio: {
    //         dist24h: {
    //             label: '24 h',
    //             checked: true,
    //             url_data: '/datos-actuales-json/viento-24'
    //         },

    //         dist12h: {
    //             label: '12 h',
    //             url_data: '/datos-actuales-json/viento-12'
    //         },

    //         dist6h: {
    //             label: '6 h',
    //             url_data: '/datos-actuales-json/viento-6'
    //         },

    //         dist3h: {
    //             label: '3 h',
    //             url_data: '/datos-actuales-json/viento-3'
    //         },
    //         dist1h: {
    //             label: '1 h',
    //             url_data: '/datos-actuales-json/viento-1'
    //         }
    //     },

    //     opciones: {
    //         scales: {},
    //         aspectRatio: defaultOptions.aspectRatioDV
    //     },
    // },

    // radiacion: {
    //     id: 'radiacion', //Esta propiedad ha de llamarse como la propiedad del objeto
    //     tipo: 'line',
    //     titulo: "Radiación solar",
    //     unidad: "W/m2",
    //     data_inicial: 'radiacion',
    //     radiacion: {
    //         url_data: '/datos-actuales-json/horas-sr',
    //         objeto_data: undefined,
    //         datos: undefined,
    //         labels: 'horas',
    //         datasets: {
    //             /*Cada propiedad del objeto datasets debe llamarse como la clave
    //             de los datos que llegan desde el backend */
    //             sr: {
    //                 id: 'sr',
    //                 borderColor: 'rgba(202,57,32,0.6)',
    //                 backgroundColor: 'rgba(202,57,32,0.1)',
    //             }
    //         }
    //     },

    //     opciones: {},
    // },

    // uv: {
    //     id: 'uv', //Esta propiedad ha de llamarse como la propiedad del objeto
    //     tipo: 'line',
    //     titulo: "Índice ultravioleta",
    //     //unidad: "",
    //     data_inicial: 'uv',
    //     uv: {
    //         url_data: '/datos-actuales-json/horas-uv',
    //         objeto_data: undefined,
    //         datos: undefined,
    //         labels: 'horas',
    //         datasets: {
    //             /*Cada propiedad del objeto datasets debe llamarse como la clave
    //             de los datos que llegan desde el backend */
    //             uv: {
    //                 id: 'uv',
    //                 borderColor: 'rgba(232,5,240,0.6)',
    //                 backgroundColor: 'rgba(232,5,240,0.1)',
    //             }
    //         }
    //     },

    //     opciones: {},
    // },

} //Fin objeto propiedades