from pyecharts import Map
value = [20, 190]
attr = ['武侯区', '青羊区']
map = Map("成都地图示例", width=1200, height=600)
map.add(    "", attr, value, maptype="成都", is_visualmap=True, visual_text_color="#000") #设置广东省
map.render()