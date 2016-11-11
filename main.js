 var tsChart;
        FusionCharts.ready(function () {
            tsChart = new FusionCharts({
                type: 'timeseries',
                plottype: 'line',
                renderAt: 'chart-container',
                width: '600',
                height: '500',
                dataFormat: 'json',
                dataSource: {
                    chart: {
                        axes: [
                            {
                                uid: 'aa',
                                x: { },
                                y: { }
                            },
                            {
                                uid: 'bb',
                                x: function (store) {
                                    return store.getAxesByIndex(0).x;
                                },
                                y: { }
                            }
                        ],
                        datasets: [{
                            category: {
                                dateformat: "%b-%Y",
                                data: ["Jan-2016","Jun-2016","Jan-2017","Jun-2017","Jan-2018",
                                        "Jun-2018","Jan-2019","Jun-2019","Jan-2020", "Jun-2020",
                                        "Jan-2021","Jun-2022","Jan-2023","Jun-2024","Jan-2025",
                                        "Jun-2026","Jan-2027","Jun-2028","Jan-2029", "Jun-2030"]
                            },
                            dataset: [
                                {
                                    uid: 'ds-1',
                                    series: [
                                        {
                                            plottype:"column",
                                            name: "Series 1",
                                            data: ["9","1","4","3","1","0","3","6","9","8", "1","4","3","1","0", "4","3","1","0","3","6","9","8", "1","4","3","1","0"]
                                        },
                                        {
                                            plottype:"line",
                                            name: "Series 2",
                                            data: ["4","3","1","0","3","6","9","8", "1","4", "4","3","1","0","3","6","9","8", "1","4","4","3","1","0","3","6","9","8", "1","4","4","3","1","0","3","6","9","8", "1","4"]
                                        }
                                    ]
                                },
                                {
                                    uid: 'ds-2',
                                    series: [
                                        {
                                            plottype:"line",
                                            name: "Series 33",
                                            data: ["4","3","1","0","3","6","9","8", "1","4", "4","3","1","0","3","6","9","8", "1","4","4","3","1","0","3","6","9","8", "1","4","4","3","1","0","3","6","9","8", "1","4"]
                                        }
                                    ]
                                }
                            ]
                        }],
                        canvas: [{
                            uid: 'canvas-1',
                            axes: function (store) {
                                return store.getAxesByIndex(0);
                            },
                            dataset: function (store) {
                                return store.getDatasetsByIndex(0);
                            },
                            _referenceMarkers: [
                                {
                                    type: 'zone',
                                    start: 6.5,
                                    end: 4.5,
                                    style: {
                                        fill: '#ff6789',
                                        'fill-opacity': 0.2,
                                        'stroke': 'none',
                                        'border-left': '0px #ffffff solid',
                                        'border-right': '0px #ffffff solid',
                                        'border-top': '0px #bbbaba solid',
                                        'border-bottom': '0px #bbbaba solid'
                                    }
                                }
                                ,
                                {
                                    type: 'line',
                                    start: 5,
                                    end: 8,
                                    style: {
                                        'stroke-width': 3,
                                        'stroke-opacity': 0.5,
                                        'stroke': '#2196F3'
                                    }
                                }
                            ]
                        }
                        // , {
                        //     axes: function (store) {
                        //         return store.getAxesByIndex(1);
                        //     },
                        //     dataset: function (store) {
                        //         return store.getDatasetsByIndex(1);
                        //     }
                        // }
                        ]
                    }
                }

            })
            .render();
        });

// --------------------------------------------------------------------------------
            // Single canvas interaction - line, area, column

            // FusionCharts.ready(function () {
            //     var topStores = new FusionCharts({
            //         type: 'timeseries',
            //         plottype: 'area',
            //         renderAt: 'chart-container',
            //         width: '900',
            //         height: '600',
            //         dataFormat: 'json',
            //         dataSource: {
            //             chart: {
            //                 axes: [
            //                     {
            //                         uid: 'aa',
            //                         x: { },
            //                         y: { }
            //                     },
            //                     {
            //                         uid: 'bb',
            //                         x: {  },
            //                         y: { }
            //                     }
            //                 ],
            //                 datasets: [{
            //                     category: {
            //                         dateformat: "%b-%Y",
            //                         data: ["Jan-2016","Jun-2016","Jan-2017","Jun-2017","Jan-2018",
            //                                 "Jun-2018","Jan-2019","Jun-2019","Jan-2020"]
            //                     },
            //                     dataset: [
            //                         {
            //                             uid: 'ds-1',
            //                             series: [
            //                                 {
            //                                     plottype: "column",
            //                                     name: "2",
            //                                     data: ["929","781","624","983","961","40","413","936","910","829"]
            //                                 }
            //                             ]
            //                         }
            //                     ]
            //                 }],
            //                 canvas: [
            //                     {
            //                         axes: function (store) {
            //                             return store.getAxesByIndex(0);
            //                         },
            //                         dataset: function (store) {
            //                             return store.getDatasetsByIndex(0);
            //                         }

            //                     }
            //                 ]
            //             }
            //         }

            //     })
            //     .render();
            // });


// --------------------------------------------------------------------------------
            // Single canvas interaction - candlestick

            // FusionCharts.ready(function () {
            //     var topStores = new FusionCharts({
            //         type: 'timeseries',
            //         plottype: 'area',
            //         renderAt: 'chart-container',
            //         width: '900',
            //         height: '600',
            //         dataFormat: 'json',
            //         dataSource: {
            //             chart: {
            //                 axes: [
            //                     {
            //                         uid: 'aa',
            //                         x: { },
            //                         y: { }
            //                     },
            //                     {
            //                         uid: 'bb',
            //                         x: {  },
            //                         y: { }
            //                     }
            //                 ],
            //                 datasets: [{
            //                     category: {
            //                         dateformat: "%b-%Y",
            //                         data: ["Jan-2016","Jun-2016","Jan-2017","Jun-2017","Jan-2018",
            //                                 "Jun-2018","Jan-2019","Jun-2019","Jan-2020"]
            //                     },
            //                     dataset: [
            //                         {
            //                             uid: 'ds-1',
            //                             series: [
            //                                 {
            //                                     plottype: "candlestick",
            //                                     name: "2",
            //                                     data: [["450","538","266","400"],["306","472","10","390"],["249","840","670","162"],["21","472","1000","22"],["935","736","738","35"],["987","954","827","618"],["680","920","24","731"],["940","57","616","341"],["940","57","616","341"]]
            //                                 }
            //                             ]
            //                         }
            //                     ]
            //                 }],
            //                 canvas: [
            //                     {
            //                         axes: function (store) {
            //                             return store.getAxesByIndex(0);
            //                         },
            //                         dataset: function (store) {
            //                             return store.getDatasetsByIndex(0);
            //                         }

            //                     }
            //                 ]
            //             }
            //         }

            //     })
            //     .render();
            // });


// --------------------------------------------------------------------------------
            // MS canvas interaction - line, area, column

            // FusionCharts.ready(function () {
            //     var topStores = new FusionCharts({
            //         type: 'timeseries',
            //         plottype: 'area',
            //         renderAt: 'chart-container',
            //         width: '900',
            //         height: '600',
            //         dataFormat: 'json',
            //         dataSource: {
            //             chart: {
            //                 axes: [
            //                     {
            //                         uid: 'aa',
            //                         x: { },
            //                         y: { }
            //                     },
            //                     {
            //                         uid: 'bb',
            //                         x: {  },
            //                         y: { }
            //                     }
            //                 ],
            //                 datasets: [{
            //                     category: {
            //                         dateformat: "%b-%Y",
            //                         data: ["Jan-2016","Jun-2016","Jan-2017","Jun-2017","Jan-2018",
            //                                 "Jun-2018","Jan-2019","Jun-2019","Jan-2020"]
            //                     },
            //                     dataset: [
            //                         {
            //                             uid: 'ds-1',
            //                             series: [
            //                                 {
            //                                     plottype: "column",
            //                                     name: "2",
            //                                     data: ["929","781","624","983","961","40","413","936","910","829"]
            //                                 },
            //                                 {
            //                                     plottype: "column",
            //                                     name: "2",
            //                                     data: ["408","620","178","150","73","136","143","852","174","940","5","930","616","800","205","54","418","28","972","76","973","371","329","609","575","522","888","769","459","303","752","746","202","782","654","609","561","438","604","890","75","171","935","264","938","869","601","683","979","62","46","216","739","517","826","204","113","296","714","575","422","233","910","879","666","94","777","544","21","663","487","4","80","850","867","336","304","374","245","526","548","725","577","887","650","5","39","826","776","455","500","911","298","403","495","116","573","317","380","566","485","292","282","261","222","831","803","696","238","639","370","667","495","744","676","420","29","225","181","158","909","71","313","799","303","989","429","858","453","148","900","590","743","711","864","17","426","388","843","178","431","797","970","691","755","356","12","649","245","809","181","833","518","773","249","237","322","875","985","89","422","750","628","835","726","468","976","151","49","6","799","912","188","198","504","750","184","972","172","274","212","589","451","78","671","128","735","447","577","320"]
            //                                 }
            //                             ]
            //                         }
            //                     ]
            //                 }],
            //                 canvas: [
            //                     {
            //                         axes: function (store) {
            //                             return store.getAxesByIndex(0);
            //                         },
            //                         dataset: function (store) {
            //                             return store.getDatasetsByIndex(0);
            //                         }

            //                     }
            //                 ]
            //             }
            //         }

            //     })
            //     .render();
            // });


// --------------------------------------------------------------------------------
            // Multicanvas interaction - line, area, column

            // FusionCharts.ready(function () {
            //     var topStores = new FusionCharts({
            //         type: 'timeseries',
            //         plottype: 'area',
            //         renderAt: 'chart-container',
            //         width: '900',
            //         height: '600',
            //         dataFormat: 'json',
            //         dataSource: {
            //             chart: {
            //                 axes: [
            //                     {
            //                         uid: 'aa',
            //                         x: {
            //                         },
            //                         y: {
            //                         }
            //                     },
            //                     {
            //                         uid: 'bb',
            //                         x: {  },
            //                         y: { }
            //                     }
            //                 ],
            //                 datasets: [{
            //                     category: {
            //                         dateformat: "%b-%Y",
            //                         data: ["Jan-2016","Jun-2016","Jan-2017","Jun-2017","Jan-2018",
            //                             "Jun-2018","Jan-2019","Jun-2019","Jan-2020","Jun-2021","Jan-2022","Jun-2023","Jan-2024"]
            //                     },
            //                     dataset: [
            //                         {
            //                             uid: 'ds-1',
            //                             series: [
            //                                 {
            //                                     plottype: "line",
            //                                     name: "2",
            //                                     data: ["929","781","624","983","961","40","413","936","910","829","408","620","178","150"]
            //                                 }
            //                             ]
            //                         },
            //                         {
            //                             uid: 'ds-1',
            //                             series: [
            //                                 {
            //                                     plottype: "area",
            //                                     name: "2",
            //                                     data: ["411","112","792","240","18","914","929","979","445","271","372","524","510","856"]
            //                                 }
            //                             ]
            //                         }
            //                     ]
            //                 }],
            //                 canvas: [
            //                     {
            //                         axes: function (store) {
            //                             return store.getAxesByIndex(0);
            //                         },
            //                         dataset: function (store) {
            //                             return store.getDatasetsByIndex(0);
            //                         }

            //                     },
            //                     {
            //                         axes: function (store) {
            //                             return store.getAxesByIndex(1);
            //                         },
            //                         dataset: function (store) {
            //                             return store.getDatasetsByIndex(1);
            //                         }

            //                     }
            //                 ]
            //             }
            //         }

            //     })
            //     .render();
            // });


// --------------------------------------------------------------------------------
            // Cyclic and acyclic markers
            // FusionCharts.ready(function () {
            //     var topStores = new FusionCharts({
            //         type: 'timeseries',
            //         plottype: 'area',
            //         renderAt: 'chart-container',
            //         width: '900',
            //         height: '600',
            //         dataFormat: 'json',
            //         dataSource: {
            //             chart: {
            //                 axes: [
            //                     {
            //                         uid: 'aa',
            //                         x: {
            //                         },
            //                         y: {
            //                         }
            //                     },
            //                     {
            //                         uid: 'bb',
            //                         x: {  },
            //                         y: { }
            //                     }
            //                 ],
            //                 markers: {
            //                     cyclic: [{
            //                         level: function (formalNames) {
            //                             return formalNames.LONG_YEAR.index
            //                         },
            //                         start: function (formalNames) {
            //                             return ['OCT', formalNames.SHORT_MONTH, '15', formalNames.DAY_OF_MONTH]
            //                         },
            //                         end: function (formalNames) {
            //                             return ['FEB', formalNames.SHORT_MONTH, '1', formalNames.DAY_OF_MONTH]
            //                         },

            //                         plot: {
            //                             style: {

            //                             }
            //                         },
            //                         label: {
            //                             name: 'Cyclic',
            //                             style: {

            //                             }
            //                         }
            //                     },
            //                     {
            //                         level: function (formalNames) {
            //                             return formalNames.LONG_YEAR.index
            //                         },
            //                         start: function (formalNames) {
            //                             return ['JAN', formalNames.SHORT_MONTH, '15', formalNames.DAY_OF_MONTH]
            //                         },
            //                         end: function (formalNames) {
            //                             return ['MAR', formalNames.SHORT_MONTH, '1', formalNames.DAY_OF_MONTH]
            //                         },

            //                         plot: {
            //                             style: {

            //                             }
            //                         },
            //                         label: {
            //                             name: 'Cyclic',
            //                             style: {

            //                             }
            //                         }
            //                     }],

            //                     acyclic: [{
            //                         level: function (formalNames) {
            //                             return formalNames.LONG_YEAR.index
            //                         },
            //                         start: function (formalNames) {
            //                             return ['2016', formalNames.LONG_YEAR, 'FEB', formalNames.SHORT_MONTH, '31', formalNames.DAY_OF_MONTH]
            //                         },
            //                         end: function (formalNames) {
            //                             return ['2016', formalNames.LONG_YEAR, 'JUL', formalNames.SHORT_MONTH, '10', formalNames.DAY_OF_MONTH]
            //                         },
            //                         plot: {
            //                             style: {

            //                             }
            //                         },
            //                         label: {
            //                             name: 'Acyclic',
            //                             style: {

            //                             }
            //                         }
            //                     }]
            //                 },
            //                 datasets: [{
            //                     category: {
            //                         dateformat: "%b-%Y",
            //                         data: ["Jan-2016","Jun-2016","Jan-2017","Jun-2017","Jan-2018"]
            //                     },
            //                     dataset: [
            //                         {
            //                             uid: 'ds-1',
            //                             series: [
            //                                 {
            //                                     plottype: "line",
            //                                     name: "2",
            //                                     data: ["929","781","624","983","961","40","413","936","910","829","408","620","178"]
            //                                 }
            //                             ]
            //                         }
            //                     ]
            //                 }],
            //                 canvas: [
            //                     {
            //                         axes: function (store) {
            //                             return store.getAxesByIndex(0);
            //                         },
            //                         dataset: function (store) {
            //                             return store.getDatasetsByIndex(0);
            //                         }

            //                     }
            //                 ]
            //             }
            //         }

            //     })
            //     .render();
            // });
