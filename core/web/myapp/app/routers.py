from app import app
from flask import render_template, url_for, request, abort, jsonify
from core.database.database import MongoPool
from pyecharts import Line, Map
import time
from lxml import etree
import os
import re
import datetime
from core.spider.wangyi_source.get_input_data import MongoInput
from core.spider.wangyi_source.get_area_id import MongoAreaInfo
from core.spider.wangyi_source.get_all_news import MongoNews

@app.route('/')
def index():
    data = get_china_now()
    confirm_all = data.confirm_all
    dead_all = data.dead_all
    heal_all = data.heal_all
    confirm_add = data.confirm_add
    dead_add = data.dead_add
    heal_add = data.heal_add
    input_all = data.input_all
    input_add = data.input_add
    noinfect_now = data.noinfect_now
    noinfect_add = data.noinfect_add
    confirm_now = data.confirm_now
    confirm_now_add = data.confirm_now_add
    update_time = data.update_time
    data_list_now, data_list_all = get_china_map_data()
    web_name1, web_name2 = get_line_charts()
    area_web_name1, area_web_name2 = get_line_charts(title='四川疫情趋势图', country_name='中国', province_name='四川', city_name=None)
    line_div_id, line_script1_name, line_script2_name = handel_pyecharts(web_name1)
    line2_div_id, line2_script1_name, line2_script2_name = handel_pyecharts(web_name2)
    area_div_id, area_script1, area_script2 = handel_pyecharts(area_web_name1)
    area2_div_id, area2_script1, area2_script2 = handel_pyecharts(area_web_name2)
    input_data_list, input_update_time, source_list, target_list = get_input_data()
    html_str = ''
    for target in target_list:
        html_str += '<tr><td>' + target[0] + '</td><td>' + str(target[1]) + '</td>'
        for source in source_list:
            value = 0
            for relationship in input_data_list:
                if target[0] == relationship['target_province'] and source[0] == relationship['source_country']:
                    value = relationship['value']
            if value != 0:
                html_str += '<td>' + str(value) + '</td>'
            else:
                html_str += '<td>-</td>'
        html_str += '</tr>'
    province_data_by_now = get_all_province_data_now()
    province_data_by_all = get_all_province_data_all()
    province_table_now = '<tr><td colspan="6">(按现有确诊排序)</td></tr><tr><td>地区</td><td>现有确诊</td><td>累计确诊</td><td>累计死亡</td><td>累计治愈</td><td>新增确诊</td></tr>'
    province_table_all = '<tr><td colspan="6">(按累计确诊排序)</td></tr><tr><td>地区</td><td>累计确诊</td><td>现有确诊</td><td>累计死亡</td><td>累计治愈</td><td>新增确诊</td></tr>'
    for province_data in province_data_by_now:
        province_table_now += '<tr><td>' + province_data.province_name + '</td><td>' + str(province_data.confirm_now) + '</td><td>' + str(province_data.confirm_all) + '</td><td>' + str(province_data.dead_all) + '</td><td>' + str(province_data.heal_all) + '</td><td>' + str(province_data.confirm_add) + '</td></tr>'
    for province_data in province_data_by_all:
        province_table_all += '<tr><td>' + province_data.province_name + '</td><td>' + str(province_data.confirm_all) + '</td><td>' + str(province_data.confirm_now) + '</td><td>' + str(province_data.dead_all) + '</td><td>' + str(province_data.heal_all) + '</td><td>' + str(province_data.confirm_add) + '</td></tr>'
    area_map_file = get_area_map()
    map_div_id, map_script1, map_script2, map_script3= handel_pyecharts_map(area_map_file)
    return render_template('index.html', title='新冠疫情数据', confirm_all=confirm_all, dead_all=dead_all,heal_all=heal_all, \
                           input_all=input_all, noinfect_now=noinfect_now, confirm_now=confirm_now,confirm_add=confirm_add, \
                           dead_add=dead_add, heal_add=heal_add, input_add=input_add, noinfect_add=noinfect_add,confirm_now_add=confirm_now_add,update_time=update_time\
                           , data_list_now=data_list_now, data_list_all=data_list_all, line_script1=line_script1_name, line_script2=line_script2_name,line_div_id=line_div_id, \
                           line2_script1=line2_script1_name, line2_script2=line2_script2_name, line2_div_id=line2_div_id, input_update_time=input_update_time, html_str=html_str, \
                           source_list=source_list, target_list=target_list, province_table_now=province_table_now, province_table_all=province_table_all, area_div_id=area_div_id, area_script1=area_script1, \
                           area_script2=area_script2, area2_div_id=area2_div_id, area2_script1=area2_script1, area2_script2=area2_script2, map_div_id=map_div_id, \
                           map_script1=map_script1, map_script2=map_script2, map_script3=map_script3)

@app.route('/index')
@app.route('/china')
def china():
    data = get_china_now()
    confirm_all = data.confirm_all
    dead_all = data.dead_all
    heal_all = data.heal_all
    confirm_add = data.confirm_add
    dead_add = data.dead_add
    heal_add = data.heal_add
    input_all = data.input_all
    input_add = data.input_add
    noinfect_now = data.noinfect_now
    noinfect_add = data.noinfect_add
    confirm_now = data.confirm_now
    confirm_now_add = data.confirm_now_add
    update_time = data.update_time
    data_list_now, data_list_all = get_china_map_data()
    web_name1, web_name2 = get_line_charts()
    area_web_name1, area_web_name2 = get_line_charts(title='四川疫情趋势图', country_name='中国', province_name='四川', city_name=None)
    line_div_id, line_script1_name, line_script2_name = handel_pyecharts(web_name1)
    line2_div_id, line2_script1_name, line2_script2_name = handel_pyecharts(web_name2)
    area_div_id, area_script1, area_script2 = handel_pyecharts(area_web_name1)
    area2_div_id, area2_script1, area2_script2 = handel_pyecharts(area_web_name2)
    input_data_list, input_update_time, source_list, target_list = get_input_data()
    html_str = ''
    for target in target_list:
        html_str += '<tr><td>' + target[0] + '</td><td>' + str(target[1]) + '</td>'
        for source in source_list:
            value = 0
            for relationship in input_data_list:
                if target[0] == relationship['target_province'] and source[0] == relationship['source_country']:
                    value = relationship['value']
            if value != 0:
                html_str += '<td>' + str(value) + '</td>'
            else:
                html_str += '<td>-</td>'
        html_str += '</tr>'
    province_data_by_now = get_all_province_data_now()
    province_data_by_all = get_all_province_data_all()
    province_table_now = '<tr><td colspan="6">(按现有确诊排序)</td></tr><tr><td>地区</td><td>现有确诊</td><td>累计确诊</td><td>累计死亡</td><td>累计治愈</td><td>新增确诊</td></tr>'
    province_table_all = '<tr><td colspan="6">(按累计确诊排序)</td></tr><tr><td>地区</td><td>累计确诊</td><td>现有确诊</td><td>累计死亡</td><td>累计治愈</td><td>新增确诊</td></tr>'
    for province_data in province_data_by_now:
        province_table_now += '<tr><td>' + province_data.province_name + '</td><td>' + str(province_data.confirm_now) + '</td><td>' + str(province_data.confirm_all) + '</td><td>' + str(province_data.dead_all) + '</td><td>' + str(province_data.heal_all) + '</td><td>' + str(province_data.confirm_add) + '</td></tr>'
    for province_data in province_data_by_all:
        province_table_all += '<tr><td>' + province_data.province_name + '</td><td>' + str(province_data.confirm_all) + '</td><td>' + str(province_data.confirm_now) + '</td><td>' + str(province_data.dead_all) + '</td><td>' + str(province_data.heal_all) + '</td><td>' + str(province_data.confirm_add) + '</td></tr>'
    area_map_file = get_area_map()
    map_div_id, map_script1, map_script2, map_script3 = handel_pyecharts_map(area_map_file)
    return render_template('index.html', title='国内疫情', confirm_all=confirm_all, dead_all=dead_all,heal_all=heal_all, \
                           input_all=input_all, noinfect_now=noinfect_now, confirm_now=confirm_now,confirm_add=confirm_add, \
                           dead_add=dead_add, heal_add=heal_add, input_add=input_add, noinfect_add=noinfect_add,confirm_now_add=confirm_now_add,update_time=update_time\
                           , data_list_now=data_list_now, data_list_all=data_list_all, line_script1=line_script1_name, line_script2=line_script2_name,line_div_id=line_div_id, \
                           line2_script1=line2_script1_name, line2_script2=line2_script2_name, line2_div_id=line2_div_id, input_update_time=input_update_time, html_str=html_str, \
                           source_list=source_list, target_list=target_list, province_table_now=province_table_now, province_table_all=province_table_all, area_div_id=area_div_id, area_script1=area_script1, \
                           area_script2=area_script2, area2_div_id=area2_div_id, area2_script1=area2_script1, area2_script2=area2_script2, map_div_id=map_div_id, \
                           map_script1=map_script1, map_script2=map_script2, map_script3=map_script3)

@app.route('/china_area', methods=["get"])
def china_area():
    province_list = ["上海","广东","黑龙江","四川","陕西","内蒙古","福建","北京","天津","甘肃","河南","江西","山东","浙江","台湾","江苏","重庆","香港","湖南","河北",\
                     "安徽","新疆","辽宁","广西","山西","云南","湖北","海南","吉林","贵州","宁夏","澳门","青海","西藏"]
    province = request.args.get('province') or None
    city = request.args.get('city') or None
    if not province:
        abort(404)
    province_name = province_list[int(province)]
    if city:
        web_name1, web_name2 = get_line_charts(title=province_name+city+'疫情趋势图', province_name=province_name, city_name=city)
        line_div_id, line_script1_name, line_script2_name  = handel_pyecharts(web_name1)
        line2_div_id, line2_script1_name, line2_script2_name  = handel_pyecharts(web_name2)
        map_name = get_area_map(province_name=province_name)
        map_div_id, map_script1_name, map_script2_name, map_script3_name = handel_pyecharts_map(map_name)
    else:
        web_name1, web_name2 = get_line_charts(title=province_name+'疫情趋势图', province_name=province_name,city_name=None)
        line_div_id, line_script1_name, line_script2_name = handel_pyecharts(web_name1)
        line2_div_id, line2_script1_name, line2_script2_name = handel_pyecharts(web_name2)
        map_name = get_area_map(province_name=province_name)
        map_div_id, map_script1_name, map_script2_name, map_script3_name = handel_pyecharts_map(map_name)
    return render_template('area_data.html', line_div_id=line_div_id, line2_div_id=line2_div_id, line_script1_name=line_script1_name, line_script2_name=line_script2_name, \
                           line2_script1_name=line2_script1_name, line2_script2_name=line2_script2_name, map_div_id=map_div_id, map_script1_name=map_script1_name, \
                           map_script2_name=map_script2_name, map_script3_name=map_script3_name)

@app.route('/global')
def global_earth():
    data_world_and_china, data_world, update_time = get_global_data()
    web_name1, web_name2 = get_different_line()
    line1_div_id, line1_script1_name, line1_script2_name = handel_pyecharts(web_name1)
    line2_div_id, line2_script1_name, line2_script2_name = handel_pyecharts(web_name2)
    country_name_list1, country_name_list2, confirm_now_list1, confirm_add_list1, confirm_all_list1, dead_all_list1, heal_list1, \
    confirm_now_list2, confirm_add_list2, confirm_all_list2, dead_all_list2, heal_list2, country_id_list1, country_id_list2, half = get_world_now_data()
    country_name_list_all1, country_name_list_all2, confirm_now_list_all1, confirm_add_list_all1, confirm_all_list_all1, dead_all_list_all1, heal_list_all1, \
    confirm_now_list_all2, confirm_add_list_all2, confirm_all_list_all2, dead_all_list_all2, heal_list_all2, country_id_list_all1, country_id_list_all2, half = get_world_now_data(sort_way='all')
    return render_template('global.html', title='全球疫情', data_world_and_china=data_world_and_china, data_world=data_world, update_time=update_time, line1_div_id=line1_div_id, \
                           line1_script1_name=line1_script1_name, line1_script2_name=line1_script2_name, line2_div_id=line2_div_id, line2_script1_name=line2_script1_name,
                           line2_script2_name=line2_script2_name, country_name_list1=country_name_list1, country_name_list2=country_name_list2, confirm_now_list1=confirm_now_list1, \
                           confirm_add_list1=confirm_add_list1, confirm_all_list1=confirm_all_list1, dead_all_list1=dead_all_list1, heal_list1=heal_list1, \
                           confirm_now_list2=confirm_now_list2, confirm_add_list2=confirm_add_list2, confirm_all_list2=confirm_all_list2, dead_all_list2=dead_all_list2, \
                           heal_list2=heal_list2, country_id_list1=country_id_list1, country_id_list2=country_id_list2, half=half, country_name_list_all1=country_name_list_all1, \
                           country_name_list_all2=country_name_list_all2, confirm_now_list_all1=confirm_now_list_all1, \
                           confirm_add_list_all1=confirm_add_list_all1, confirm_all_list_all1=confirm_all_list_all1, dead_all_list_all1=dead_all_list_all1, heal_list_all1=heal_list_all1, \
                           confirm_now_list_all2=confirm_now_list_all2, confirm_add_list_all2=confirm_add_list_all2, confirm_all_list_all2=confirm_all_list_all2, dead_all_list_all2=dead_all_list_all2, \
                           heal_list_all2=heal_list_all2, country_id_list_all1=country_id_list_all1, country_id_list_all2=country_id_list_all2)

@app.route('/global/area_info/<area_id>')
def area_covid_info(area_id):
    mongo_area = MongoAreaInfo()
    data_list = mongo_area.find(conditions={'country_id':area_id})
    if len(data_list)==0:
        abort(404)
    mongo = MongoPool()
    area_data = mongo.find(conditions={'country_id':area_id, 'province_id':None, 'date':'now'})[0]
    country_name = area_data.country_name
    update_time = area_data.update_time
    confirm_now = area_data.confirm_now
    confirm_all = area_data.confirm_all
    heal_all = area_data.heal_all
    dead_all = area_data.dead_all
    confirm_add = area_data.confirm_add
    heal_add = area_data.heal_add
    dead_add = area_data.dead_add
    if area_data.confirm_now_add:
        confirm_now_add = area_data.confirm_now_add
    else:
        confirm_now_add = confirm_add-dead_add-heal_add
    title = country_name+' ▪ 疫情数据'
    web_name1, web_name2 = get_line_charts(title=country_name+'疫情趋势', country_name=country_name)
    line1_div_id, line1_script1_name, line1_script2_name = handel_pyecharts(web_name1)
    line2_div_id, line2_script1_name, line2_script2_name = handel_pyecharts(web_name2)
    area_data = mongo.find(conditions={'country_id':area_id, 'date':'now'})
    if len(area_data)>1:
        province_data_by_now = get_all_province_data_now(country_name=country_name)
        province_data_by_all = get_all_province_data_all(country_name=country_name)
        province_name_list = []
        confirm_now_list = []
        confirm_all_list = []
        dead_all_list = []
        heal_all_list = []
        province_name_list2 = []
        confirm_now_list2 = []
        confirm_all_list2 = []
        dead_all_list2 = []
        heal_all_list2 = []
        for data in province_data_by_now:
            province_name_list.append(data.province_name)
            confirm_now_list.append(data.confirm_now)
            confirm_all_list.append(data.confirm_all)
            dead_all_list.append(data.dead_all)
            heal_all_list.append(data.heal_all)
        for data in province_data_by_all:
            province_name_list2.append(data.province_name)
            confirm_now_list2.append(data.confirm_now)
            confirm_all_list2.append(data.confirm_all)
            dead_all_list2.append(data.dead_all)
            heal_all_list2.append(data.heal_all)
        return render_template('area_covid_info.html', title=title, update_time=update_time,confirm_all=confirm_all, confirm_now=confirm_now, heal_all=heal_all,dead_all=dead_all, \
                               confirm_now_add=confirm_now_add, confirm_add=confirm_add, heal_add=heal_add,dead_add=dead_add, line1_div_id=line1_div_id, \
                               line1_script1_name=line1_script1_name, line1_script2_name=line1_script2_name,line2_div_id=line2_div_id, line2_script1_name=line2_script1_name,\
                               line2_script2_name=line2_script2_name, province_name_list=province_name_list, province_name_list2=province_name_list2, confirm_now_list=confirm_now_list, \
                               confirm_now_list2=confirm_now_list2, confirm_all_list=confirm_all_list, confirm_all_list2=confirm_all_list2, dead_all_list=dead_all_list, dead_all_list2=dead_all_list2, heal_all_list=heal_all_list, \
                               heal_all_list2=heal_all_list2)
    else:
        return render_template('area_covid_info.html', title=title, update_time=update_time, confirm_all=confirm_all, confirm_now=confirm_now, heal_all=heal_all, dead_all=dead_all, \
                           confirm_now_add=confirm_now_add, confirm_add=confirm_add, heal_add=heal_add, dead_add=dead_add, line1_div_id=line1_div_id, \
                           line1_script1_name=line1_script1_name, line1_script2_name=line1_script2_name, line2_div_id=line2_div_id, line2_script1_name=line2_script1_name,
                           line2_script2_name=line2_script2_name)


@app.route('/news')
def news():
    start = 0
    end = 15
    data_list, data_length = get_news(start=start, end=end, country='中国')
    data_list2, data_length2 = get_news(start=start, end=end, country='国外')
    id_list = []
    title_list = []
    public_list = []
    source_list = []
    id_list2 = []
    title_list2 = []
    public_list2 = []
    source_list2 = []
    for data in data_list:
        id_list.append(data.id)
        title_list.append(data.title)
        public_list.append(data.public_time)
        source_list.append(data.source)
    for data in data_list2:
        id_list2.append(data.id)
        title_list2.append(data.title)
        public_list2.append(data.public_time)
        source_list2.append(data.source)
    return render_template('news.html', title='疫情资讯', id_list=id_list, title_list=title_list, public_list=public_list, source_list=source_list, data_length=data_length, \
                           id_list2=id_list2, title_list2=title_list2, public_list2=public_list2, source_list2=source_list2, data_length2=data_length2)

@app.route('/help')
def help():
    return render_template('help.html', title="科研助手")

@app.route('/area_id')
def area_id():
    area_database = MongoAreaInfo()
    area_list = area_database.find()
    area_dist = {}
    for area in area_list:
        if area.city_name:
            area_name = area.country_name+'-'+area.province_name+'-'+area.city_name
            area_id = area.city_id
        elif area.province_name:
            area_name = area.country_name+'-'+area.province_name
            area_id = area.province_id
        else:
            area_name = area.country_name
            area_id = area.country_id
        area_dist[area_name] = area_id
    return jsonify(area_dist)

def get_data_by_area_and_date(area=0, date1=None, date2=None, area_type=0):
    mongo = MongoPool()
    conditions = {}
    result_list = []
    if area_type == 0:
        conditions['country_id'] = area
        conditions['province_id'] = None
        conditions['city_id'] = None
    elif area_type == 1:
        conditions['province_id'] = area
        conditions['city_id'] = None
    else:
        conditions['city_id'] = area

    if date1 and date2:
        if date2 == "no":
            conditions['date'] = date1
            covid_list = mongo.find(conditions=conditions)
            result_list= covid_list
        else:
            date1 = datetime.datetime.strptime(date1, '%Y-%m-%d').date()
            date2 = datetime.datetime.strptime(date2, '%Y-%m-%d').date()
            for i in mongo.find(conditions=conditions):
                if i.date == "now":
                    continue
                if datetime.datetime.strptime(i.date, '%Y-%m-%d').date() > date1 and datetime.datetime.strptime(i.date, '%Y-%m-%d').date() < date2:
                    result_list.append(i)
    elif date1:
        date1 = datetime.datetime.strptime(date1, '%Y-%m-%d').date()
        for i in mongo.find(conditions=conditions):
            if i.date == "now":
                continue
            if datetime.datetime.strptime(i.date, '%Y-%m-%d').date() > date1:
                result_list.append(i)
    elif date2:
        date2 = datetime.datetime.strptime(date2, '%Y-%m-%d').date()
        for i in mongo.find(conditions=conditions):
            if i.date == "now":
                continue
            if datetime.datetime.strptime(i.date, '%Y-%m-%d').date() < date2:
                result_list.append(i)
    else:
        covid_list = mongo.find(conditions=conditions)
        result_list = covid_list
    return result_list

def check_date(date):
    if not int(date):
        return False
    if len(date) != 8:
        return False
    date=date[0:4]+'-'+date[4:6]+'-'+date[6:8]
    return date

@app.route('/api')
def api():
    if not request.args.get("area"):
        area = '0' #如果没有获取到area参数，则默认为中国
    else:
        area = str(request.args.get("area"))
    mongo = MongoAreaInfo()
    if mongo.find(conditions={'city_id':area}):
        area_info = mongo.find(conditions={"city_id":area})[0]
        area_name = area_info.country_name+'-'+area_info.province_name+'-'+area_info.city_name
        area_type = 2
    elif mongo.find(conditions={'province_id':area}):
        area_info = mongo.find(conditions={"province_id":area})[0]
        area_name= area_info.country_name+'-'+area_info.province_name
        area_type = 1
    elif mongo.find(conditions={'country_id':area}):
        area_info = mongo.find(conditions={'country_id':area})[0]
        area_name = area_info.country_name
        area_type = 0
    else:
        abort(404)
    if not request.args.get("date"):
        data_list = get_data_by_area_and_date(area=area, area_type=area_type)
    else:
        date = str(request.args.get("date"))
        if not re.search('-', date):
            if check_date(date):
                date = check_date(date)
            else:
                abort(404)
            data_list = get_data_by_area_and_date(area=area, date1=date, date2="no", area_type=area_type)
        else:
            if not len(date.split('-')) == 2:
                abort(404)
            else:
                if date.startswith('-'):
                    date2 = date.split('-')[1]
                    if check_date(date2):
                        date2 = check_date(date2)
                    else:
                        abort(404)
                    data_list = get_data_by_area_and_date(area=area, date2=date2, area_type=area_type)
                elif date.endswith('-'):
                    date1 = date.split('-')[0]
                    if check_date(date1):
                        date1 = check_date(date1)
                    else:
                        abort(404)
                    data_list = get_data_by_area_and_date(area=area, date1=date1, area_type=area_type)
                else:
                    date1 = date.split('-')[0]
                    if check_date(date1):
                        date1 = check_date(date1)
                    else:
                        abort(404)
                    date2 = date.split('-')[1]
                    if check_date(date2):
                        date2 = check_date(date2)
                    else:
                        abort(404)
                    data_list = get_data_by_area_and_date(area=area, date1=date1, date2=date2, area_type=area_type)

    data_dist = {}
    real_data_list = []
    data_dist['area_name'] = area_name
    data_dist['area_id'] = area
    for data in data_list:
        data = str(data)
        real_data_list.append(data)
    data_dist['covid_data'] = real_data_list
    return jsonify(data_dist)

@app.route('/news_info/<int:news_id>')
def news_info(news_id):
    if news_id <= 0:
        abort(404)
    news_data = get_news_info(news_id=news_id)
    title = news_data.title
    if news_data.content:
        content = news_data.content
    else:
        content = news_data.desc
    content_list = []
    for content_every in content.split('\n'):
        content_list.append(content_every.strip())
    public_time = news_data.public_time
    source = news_data.source
    area = news_data.area
    image = None
    if news_data.image:
        image = news_data.image
    if image:
        filename = str(time.time())
        with open('/root/covid/core/web/myapp/app/static/imgs/other/'+filename, 'wb') as f:
            f.write(image)
        return render_template('news_info.html', title=title, content_list=content_list, public_time=public_time, source=source, image_file=filename, area=area)
    else:
        return render_template('news_info.html', title=title, content_list=content_list, public_time=public_time, source=source, area=area)

@app.route('/area_news', methods=['get'])
def get_area_news():
    area = request.args.get('area') or None
    global_area = request.args.get('global_area') or None
    if not area or not global_area:
        abort(404)
    start =0
    end=15
    data_list, data_length = get_news(start=start, end=end, country=global_area, area=area)
    id_list = []
    title_list = []
    public_list = []
    source_list = []
    for data in data_list:
        id_list.append(data.id)
        title_list.append(data.title)
        public_list.append(data.public_time)
        source_list.append(data.source)
    return render_template('area_news.html', id_list=id_list, title_list=title_list, public_list=public_list, source_list=source_list, data_length=data_length, \
                           start=start, end=end, global_area=global_area, area=area)

@app.route('/all_news', methods=['get'])
def get_all_news():
    area = request.args.get('area') or None
    global_area = request.args.get('global_area') or None
    if not global_area:
        abort(404)
    data_list, data_length = get_news(start=0, end=-1, country=global_area, area=area)
    id_list = []
    title_list = []
    public_list = []
    source_list = []
    for data in data_list:
        id_list.append(data.id)
        title_list.append(data.title)
        public_list.append(data.public_time)
        source_list.append(data.source)
    if area:
        if global_area=='中国':
            web_title = '疫情资讯  ' + global_area + ' ▪ ' + area
        else:
            web_title = '疫情资讯  ' + area
    else:
        web_title = '疫情资讯  '+global_area
    return render_template('all_news.html', title=web_title, id_list=id_list, title_list=title_list, public_list=public_list,source_list=source_list, data_length=data_length, \
                           global_area=global_area, area=area)

def get_china_now():
    mongo = MongoPool()
    conditions = {'country_name':'中国', 'province_name':None, 'date':'now'}
    data = mongo.find(conditions)[0]
    return data

def get_global_data():
    mongo = MongoPool()
    conditions = {'province_name':None, 'date':'now'}
    data_list = mongo.find(conditions)
    data_world_and_china = [0, 0, 0, 0, 0, 0, 0, 0]
    data_world = [0, 0, 0, 0, 0, 0, 0, 0]
    update_time = data_list[0].update_time
    for data in data_list:
        # if data.confirm_add:
        #     data_world_and_china[0]+=data.confirm_now
        # if data.confirm_now_add:
        #     data_world_and_china[1]+=data.confirm_now_add
        if data.confirm_all:
            data_world_and_china[2]+=data.confirm_all
        if data.confirm_add:
            data_world_and_china[3]+=data.confirm_add
        if data.dead_all:
            data_world_and_china[4]+=data.dead_all
        if data.dead_add:
            data_world_and_china[5]+=data.dead_add
        if data.heal_all:
            data_world_and_china[6]+=data.heal_all
        if data.heal_add:
            data_world_and_china[7]+=data.heal_add
    data_world_and_china[0] = data_world_and_china[2]-data_world_and_china[4]-data_world_and_china[6]
    data_world_and_china[1] = data_world_and_china[3]-data_world_and_china[5]-data_world_and_china[7]
    china_data = get_china_now()
    if not china_data.confirm_now:
        data_world[0]=str(data_world_and_china[0])+"[待更新]"
    else:
        data_world[0]=data_world_and_china[0]-china_data.confirm_now
    if not china_data.confirm_now_add:
        data_world[1]=str(data_world_and_china[1])+"[待更新]"
    else:
        data_world[1]=data_world_and_china[1]-china_data.confirm_now_add
    if not china_data.confirm_all:
        data_world[2]=str(data_world_and_china[2])+"[待更新]"
    else:
        data_world[2]=data_world_and_china[2]-china_data.confirm_all
    if not china_data.confirm_add:
        data_world[3]=str(data_world_and_china[3])+"[待更新]"
    else:
        data_world[3]=data_world_and_china[3]-china_data.confirm_add
    if not china_data.dead_all:
        data_world[4]=str(data_world_and_china[4])+"[待更新]"
    else:
        data_world[4]=data_world_and_china[4]-china_data.dead_all
    if not china_data.dead_add:
        data_world[5]=str(data_world_and_china[5])+"[待更新]"
    else:
        data_world[5]=data_world_and_china[5]-china_data.dead_add
    if not china_data.heal_all:
        data_world[6]=str(data_world_and_china[6])+"[待更新]"
    else:
        data_world[6]=data_world_and_china[6]-china_data.heal_all
    if not china_data.heal_add:
        data_world[7]=str(data_world_and_china[7])+"[待更新]"
    else:
        data_world[7]=data_world_and_china[7]-china_data.heal_add
    return data_world_and_china, data_world, update_time

def get_china_map_data():
    mongo = MongoPool()
    conditions = {'country_name':'中国', 'city_name':None, 'date':'now'}
    data = mongo.find(conditions)
    data_list_now = []
    data_list_all = []
    for i in data:
        data_dist = {}
        if i.province_name == None:
            continue
        data_dist['name'] = i.province_name
        data_dist['value'] = i.confirm_now
        data_list_now.append(data_dist)
    for i in data:
        data_dist = {}
        if i.province_name == None:
            continue
        data_dist['name'] = i.province_name
        data_dist['value'] = i.confirm_all
        data_list_all.append(data_dist)
    return data_list_now, data_list_all

def get_different_line():
    mongo = MongoPool()
    world_data = mongo.find(conditions={'country_name':'世界'})
    china_data = mongo.find(conditions={'country_name':'中国', 'province_name':None})
    date1 = []
    date2 = []
    world_confirm_all = []
    world_confirm_add = []
    china_confirm_all = []
    china_confirm_add = []
    world_data.sort(key=lambda x:x.date)
    china_data.sort(key=lambda x:x.date)
    for data in world_data:
        world_confirm_all.append(data.confirm_all)
        world_confirm_add.append(data.confirm_add)
        date1.append(data.date)
    for data in china_data:
        china_confirm_all.append(data.confirm_all)
        china_confirm_add.append(data.confirm_add)
        date2.append(data.date)
    line1 = Line('中国/海外 ▪ 新增确诊对比')
    line2 = Line('中国/海外 ▪ 累计确诊对比')
    line1.add('中国', date2, china_confirm_add)
    line1.add('海外', date1, world_confirm_add)
    line2.add('中国', date2, china_confirm_all)
    line2.add('海外', date1, world_confirm_all)
    web_name1 = str(time.time()) + '.html'
    line1.render(web_name1)
    web_name2 = str(time.time()) + '.html'
    line2.render(web_name2)
    return web_name1, web_name2

def get_line_charts(title="中国疫情趋势图", country_name='中国', province_name=None, city_name=None):
    conditions = {'country_name':country_name, 'province_name':province_name, 'city_name':city_name}
    mongo = MongoPool()
    date = []
    confirm_all = []
    confirm_now = []
    confirm_add = []
    heal_all = []
    heal_add = []
    dead_all = []
    dead_add = []
    data_list = mongo.find(conditions)
    data_list.sort(key=lambda x:x.date)
    for data in data_list:
        date.append(data.date)
        confirm_all.append(data.confirm_all)
        confirm_now.append(data.confirm_now)
        confirm_add.append(data.confirm_add)
        heal_all.append(data.heal_all)
        heal_add.append(data.heal_add)
        dead_all.append(data.dead_all)
        dead_add.append(data.dead_add)
    line1 = Line(title+' ▪ 累计&现有')
    line2 = Line(title+' ▪ 新增')
    line1.add('累计确诊',date, confirm_all)
    line1.add('现存确诊', date, confirm_now)
    line2.add('新增确诊', date, confirm_add)
    line1.add('累计治愈',date, heal_all)
    line2.add('新增治愈',date, heal_add)
    line1.add('累计死亡',date,dead_all)
    line2.add('新增死亡', date, dead_add)
    web_name1 = str(time.time())+'.html'
    line1.render(web_name1)
    web_name2 = str(time.time()) + '.html'
    line2.render(web_name2)
    return web_name1, web_name2

def get_input_data():
    mongo = MongoInput()
    input_data_list = mongo.find()
    source_dist = {}
    target_dist = {}
    input_update_time = input_data_list[0].update_time
    new_data_list = [] #由于flask模板识别的变量有限，所以这里将自定义的数据类型转换为列表嵌套字典
    for data in input_data_list:
        new_dist = {}
        new_dist['source_country'] = data.source_country
        new_dist['target_province'] = data.target_province
        new_dist['value'] = data.value
        new_data_list.append(new_dist)
        if not source_dist.get(data.source_country):
            source_dist[data.source_country] = data.value
        else:
            source_dist[data.source_country] += data.value
        if not target_dist.get(data.target_province):
            target_dist[data.target_province] = data.value
        else:
            target_dist[data.target_province] += data.value
    source_list = sorted(source_dist.items(), reverse=True, key=lambda kv: (kv[1], kv[0]))
    target_list = sorted(target_dist.items(), reverse=True, key=lambda kv: (kv[1], kv[0]))
    return new_data_list, input_update_time, source_list, target_list

def get_all_province_data_now(country_name='中国'):
    mongo = MongoPool()
    conditions = {'country_name': country_name, 'city_name': None, 'date': 'now'}
    data = mongo.find(conditions)
    province_data = []
    for i in data:
        if not i.province_name:
            continue
        province_data.append(i)
    province_data.sort(key=lambda x: x.confirm_now, reverse=True)
    return province_data

def get_all_province_data_all(country_name='中国'):
    mongo = MongoPool()
    conditions = {'country_name': country_name, 'city_name': None, 'date': 'now'}
    data = mongo.find(conditions)
    province_data = []
    for i in data:
        if not i.province_name:
            continue
        province_data.append(i)
    province_data.sort(key=lambda x: x.confirm_all, reverse=True)
    return province_data

def handel_pyecharts(web_file_name=None):
    with open(web_file_name, 'r') as f:
        content = f.read()
        html = etree.HTML(content)
        line_script1 = html.xpath('//head/script/text()')[0]
        line_script1_name = '/js/' + web_file_name.strip('.html') + '1.js'
        with open('/root/covid/core/web/myapp/app/static' + line_script1_name, 'w') as js1:
            js1.write(line_script1)
        line_div_id = html.xpath('//body/div/@id')[0]
        line_script2 = html.xpath('//body/script/text()')[0]
        line_script2_name = '/js/' + web_file_name.strip('.html') + '2.js'
        with open('/root/covid/core/web/myapp/app/static' + line_script2_name, 'w') as js2:
            js2.write(line_script2)
    os.remove(web_file_name)
    return line_div_id, line_script1_name, line_script2_name

def handel_pyecharts_map(web_file_name=None):
    with open(web_file_name, 'r') as f:
        content = f.read()
        html = etree.HTML(content)
        line_script1 = html.xpath('//head/script[1]/text()')[0]
        line_script1_name = '/js/' + web_file_name.strip('.html') + '1.js'
        with open('/root/covid/core/web/myapp/app/static' + line_script1_name, 'w') as js1:
            js1.write(line_script1)
        line_script2 = html.xpath('//head/script[2]/text()')[0]
        line_script2_name = '/js/' + web_file_name.strip('.html') + '2.js'
        with open('/root/covid/core/web/myapp/app/static' + line_script2_name, 'w') as js2:
            js2.write(line_script2)
        line_div_id = html.xpath('//body/div/@id')[0]
        line_script3 = html.xpath('//body/script/text()')[0]
        line_script3_name = '/js/' + web_file_name.strip('.html') + '3.js'
        with open('/root/covid/core/web/myapp/app/static' + line_script3_name, 'w') as js3:
            js3.write(line_script3)
    os.remove(web_file_name)
    return line_div_id, line_script1_name, line_script2_name, line_script3_name

def get_area_map(country_name='中国',province_name='四川', is_confirm_now=False):
    covid_mongo = MongoPool()
    area_mongo = MongoAreaInfo()
    if country_name=='中国':
        title = province_name+'疫情地图'
    else:
        title = country_name+province_name+'疫情地图'
    covid_data_conditions = {'country_name':country_name, 'province_name':province_name, 'date':'now'}
    covid_data = covid_mongo.find(covid_data_conditions)
    value_list = []
    city_list = []
    if is_confirm_now:
        title+=' ▪ 现有确诊'
        for data in covid_data:
            if not data.city_name:
                continue
            value_list.append(data.confirm_now)
            area_conditions = {'city_name':data.city_name}
            complete_city_name = area_mongo.find(area_conditions)[0].complete_city_name
            city_list.append(complete_city_name)
    else:
        title += ' ▪ 累计确诊'
        for data in covid_data:
            if not data.city_name:
                continue
            value_list.append(data.confirm_all)
            area_conditions = {'city_name':data.city_name}
            complete_city_name = area_mongo.find(area_conditions)[0].complete_city_name
            city_list.append(complete_city_name)
    map = Map(title)
    map.add("", city_list, value_list, maptype=province_name, is_visualmap=True, visual_text_color="#000")
    web_name = str(time.time()) + '.html'
    map.render(web_name)
    return web_name

def get_news(start=0, end=15, country='中国', area=None):
    mongo = MongoNews()
    all_data = mongo.find()
    valid_data = []
    if country == '中国':
        country = '国内'
    else:
        country = '国外'
    for data in all_data:
        if area:
            if data.global_area == country and data.area == area:
                valid_data.append(data)
        else:
            if data.global_area == country:
                valid_data.append(data)
    valid_data.sort(key=lambda x:x.public_time, reverse=True)
    data_length = len(valid_data)
    valid_data = valid_data[start:end]
    return valid_data, data_length

def get_news_info(news_id):
    mongo = MongoNews()
    conditions = {'id':news_id}
    news_data = mongo.find(conditions)[0]
    return news_data

def get_world_now_data(sort_way='now'):
    mongo = MongoPool()
    conditions = {'date':'now', 'province_name':None}
    data_list = mongo.find(conditions)
    valid_list = []
    length = 0
    for data in data_list:
        if data.country_name != '世界' and data.country_name != '中国':
            length+=1
            valid_list.append(data)
    if sort_way=='now':
        valid_list.sort(key=lambda x:x.confirm_now, reverse=True)
    else:
        valid_list.sort(key=lambda x:x.confirm_all, reverse=True)
    country_name_list1 = []
    confirm_now_list1 = []
    confirm_all_list1 = []
    confirm_add_list1 = []
    dead_all_list1 = []
    heal_list1 = []
    country_id_list1 = []
    country_name_list2 = []
    confirm_now_list2 = []
    confirm_all_list2 = []
    confirm_add_list2 = []
    dead_all_list2 = []
    heal_list2 = []
    country_id_list2 = []
    half=int(length/2)
    count=0
    for data in valid_list:
        if count<half:
            country_name_list1.append(data.country_name)
            confirm_now_list1.append(data.confirm_now)
            confirm_all_list1.append(data.confirm_all)
            confirm_add_list1.append(data.confirm_add)
            dead_all_list1.append(data.dead_all)
            heal_list1.append(data.heal_all)
            country_id_list1.append(data.country_id)
        else:
            country_name_list2.append(data.country_name)
            confirm_now_list2.append(data.confirm_now)
            confirm_all_list2.append(data.confirm_all)
            confirm_add_list2.append(data.confirm_add)
            dead_all_list2.append(data.dead_all)
            heal_list2.append(data.heal_all)
            country_id_list2.append(data.country_id)
        count+=1
    return country_name_list1, country_name_list2, confirm_now_list1, confirm_add_list1, confirm_all_list1, dead_all_list1, heal_list1, \
        confirm_now_list2, confirm_add_list2, confirm_all_list2, dead_all_list2, heal_list2, country_id_list1, country_id_list2, half

