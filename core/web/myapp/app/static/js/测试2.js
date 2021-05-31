

var myChart_744605643a394684891c039b2269c8d6 = echarts.init(document.getElementById('744605643a394684891c039b2269c8d6'), 'light', {renderer: 'canvas'});

var option_744605643a394684891c039b2269c8d6 = {
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
    "series_id": 7359759,
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
                    "name": "\u5883\u5916\u8f93\u5165",
                    "value": 325
                },
                {
                    "name": "\u6210\u90fd\u5e02",
                    "value": 158
                },
                {
                    "name": "\u7518\u5b5c\u85cf\u65cf\u81ea\u6cbb\u5dde",
                    "value": 78
                },
                {
                    "name": "\u8fbe\u5dde\u5e02",
                    "value": 42
                },
                {
                    "name": "\u5357\u5145\u5e02",
                    "value": 39
                },
                {
                    "name": "\u5e7f\u5b89\u5e02",
                    "value": 30
                },
                {
                    "name": "\u6cf8\u5dde\u5e02",
                    "value": 24
                },
                {
                    "name": "\u5df4\u4e2d\u5e02",
                    "value": 24
                },
                {
                    "name": "\u7ef5\u9633\u5e02",
                    "value": 22
                },
                {
                    "name": "\u5185\u6c5f\u5e02",
                    "value": 22
                },
                {
                    "name": "\u5fb7\u9633\u5e02",
                    "value": 18
                },
                {
                    "name": "\u9042\u5b81\u5e02",
                    "value": 17
                },
                {
                    "name": "\u6500\u679d\u82b1\u5e02",
                    "value": 16
                },
                {
                    "name": "\u51c9\u5c71\u5f5d\u65cf\u81ea\u6cbb\u5dde",
                    "value": 13
                },
                {
                    "name": "\u5b9c\u5bbe\u5e02",
                    "value": 12
                },
                {
                    "name": "\u81ea\u8d21\u5e02",
                    "value": 9
                },
                {
                    "name": "\u96c5\u5b89\u5e02",
                    "value": 8
                },
                {
                    "name": "\u4e50\u5c71\u5e02",
                    "value": 8
                },
                {
                    "name": "\u5e7f\u5143\u5e02",
                    "value": 6
                },
                {
                    "name": "\u76ca\u9633\u5e02",
                    "value": 4
                },
                {
                    "name": "\u4e50\u5c71\u5e02",
                    "value": 3
                },
                {
                    "name": "\u963f\u575d\u85cf\u65cf\u7f8c\u65cf\u81ea\u6cbb\u5dde",
                    "value": 1
                },
                {
                    "name": "\u7518\u5b5c\u85cf\u65cf\u81ea\u6cbb\u5dde",
                    "value": 0
                },
                {
                    "name": "\u963f\u575d\u85cf\u65cf\u7f8c\u65cf\u81ea\u6cbb\u5dde",
                    "value": 0
                },
                {
                    "name": "\u672a\u660e\u786e\u5730",
                    "value": 0
                },
                {
                    "name": "\u5883\u5916\u8f93\u5165\u4eba\u5458",
                    "value": 0
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
myChart_744605643a394684891c039b2269c8d6.setOption(option_744605643a394684891c039b2269c8d6);

