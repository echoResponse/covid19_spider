

var myChart_f81b52486bf542899318a93b4028087c = echarts.init(document.getElementById('f81b52486bf542899318a93b4028087c'), 'light', {renderer: 'canvas'});

var option_f81b52486bf542899318a93b4028087c = {
    "title": [
        {
            "text": "\u56db\u5ddd\u75ab\u60c5\u5730\u56fe",
            "left": "auto",
            "top": "auto",
            "textStyle": {
                "fontSize": 18
            },
            "subtextStyle": {
                "fontSize": 12
            }
        }
    ],
    "toolbox": {
        "show": true,
        "orient": "vertical",
        "left": "95%",
        "top": "center",
        "feature": {
            "saveAsImage": {
                "show": true,
                "title": "save as image"
            },
            "restore": {
                "show": true,
                "title": "restore"
            },
            "dataView": {
                "show": true,
                "title": "data view"
            }
        }
    },
    "series_id": 8202621,
    "tooltip": {
        "trigger": "item",
        "triggerOn": "mousemove|click",
        "axisPointer": {
            "type": "line"
        },
        "textStyle": {
            "fontSize": 14
        },
        "backgroundColor": "rgba(50,50,50,0.7)",
        "borderColor": "#333",
        "borderWidth": 0
    },
    "series": [
        {
            "type": "map",
            "symbol": "circle",
            "label": {
                "normal": {
                    "show": false,
                    "position": "top",
                    "textStyle": {
                        "fontSize": 12
                    }
                },
                "emphasis": {
                    "show": true,
                    "textStyle": {
                        "fontSize": 12
                    }
                }
            },
            "mapType": "\u56db\u5ddd",
            "data": [
                {
                    "name": 325,
                    "value": "\u5883\u5916\u8f93\u5165"
                },
                {
                    "name": 158,
                    "value": "\u6210\u90fd\u5e02"
                },
                {
                    "name": 78,
                    "value": "\u7518\u5b5c\u85cf\u65cf\u81ea\u6cbb\u5dde"
                },
                {
                    "name": 42,
                    "value": "\u8fbe\u5dde\u5e02"
                },
                {
                    "name": 39,
                    "value": "\u5357\u5145\u5e02"
                },
                {
                    "name": 30,
                    "value": "\u5e7f\u5b89\u5e02"
                },
                {
                    "name": 24,
                    "value": "\u6cf8\u5dde\u5e02"
                },
                {
                    "name": 24,
                    "value": "\u5df4\u4e2d\u5e02"
                },
                {
                    "name": 22,
                    "value": "\u7ef5\u9633\u5e02"
                },
                {
                    "name": 22,
                    "value": "\u5185\u6c5f\u5e02"
                },
                {
                    "name": 18,
                    "value": "\u5fb7\u9633\u5e02"
                },
                {
                    "name": 17,
                    "value": "\u9042\u5b81\u5e02"
                },
                {
                    "name": 16,
                    "value": "\u6500\u679d\u82b1\u5e02"
                },
                {
                    "name": 13,
                    "value": "\u51c9\u5c71\u5f5d\u65cf\u81ea\u6cbb\u5dde"
                },
                {
                    "name": 12,
                    "value": "\u5b9c\u5bbe\u5e02"
                },
                {
                    "name": 9,
                    "value": "\u81ea\u8d21\u5e02"
                },
                {
                    "name": 8,
                    "value": "\u96c5\u5b89\u5e02"
                },
                {
                    "name": 8,
                    "value": "\u4e50\u5c71\u5e02"
                },
                {
                    "name": 6,
                    "value": "\u5e7f\u5143\u5e02"
                },
                {
                    "name": 4,
                    "value": "\u76ca\u9633\u5e02"
                },
                {
                    "name": 3,
                    "value": "\u4e50\u5c71\u5e02"
                },
                {
                    "name": 1,
                    "value": "\u963f\u575d\u85cf\u65cf\u7f8c\u65cf\u81ea\u6cbb\u5dde"
                },
                {
                    "name": 0,
                    "value": "\u7518\u5b5c\u85cf\u65cf\u81ea\u6cbb\u5dde"
                },
                {
                    "name": 0,
                    "value": "\u963f\u575d\u85cf\u65cf\u7f8c\u65cf\u81ea\u6cbb\u5dde"
                },
                {
                    "name": 0,
                    "value": "\u672a\u660e\u786e\u5730"
                },
                {
                    "name": 0,
                    "value": "\u5883\u5916\u8f93\u5165\u4eba\u5458"
                }
            ],
            "roam": true,
            "showLegendSymbol": true
        }
    ],
    "legend": [
        {
            "data": [
                ""
            ],
            "selectedMode": "multiple",
            "show": true,
            "left": "center",
            "top": "top",
            "orient": "horizontal",
            "textStyle": {
                "fontSize": 12
            }
        }
    ],
    "animation": true,
    "color": [
        "#c23531",
        "#2f4554",
        "#61a0a8",
        "#d48265",
        "#749f83",
        "#ca8622",
        "#bda29a",
        "#6e7074",
        "#546570",
        "#c4ccd3",
        "#f05b72",
        "#ef5b9c",
        "#f47920",
        "#905a3d",
        "#fab27b",
        "#2a5caa",
        "#444693",
        "#726930",
        "#b2d235",
        "#6d8346",
        "#ac6767",
        "#1d953f",
        "#6950a1",
        "#918597",
        "#f6f5ec"
    ],
    "visualMap": {
        "type": "continuous",
        "min": 0,
        "max": 100,
        "text": [
            "high",
            "low"
        ],
        "textStyle": {
            "color": "#000"
        },
        "inRange": {
            "color": [
                "#50a3ba",
                "#eac763",
                "#d94e5d"
            ]
        },
        "calculable": true,
        "splitNumber": 5,
        "orient": "vertical",
        "left": "left",
        "top": "bottom",
        "showLabel": true
    }
};
myChart_f81b52486bf542899318a93b4028087c.setOption(option_f81b52486bf542899318a93b4028087c);

