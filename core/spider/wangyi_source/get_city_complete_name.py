from core.spider.wangyi_source.get_area_id import MongoAreaInfo
from core.settings import userAgent
import requests
import random
import json
import ast

#通过民政部获取城市全称
def get_content(area, province_name):
    url = 'http://bmfw.www.gov.cn/ZFW-AccessPlatform/front/administrativedivision/xiangqkeyword.do'
    headers = {
        'User-Agent': random.choice(userAgent)
    }
    special_area_list = ['北京','上海','重庆','天津']
    is_zhixia = False
    for special_area in special_area_list:
        if province_name == special_area:
            is_zhixia = True
            break
    data = {'keyword':area}
    response = requests.post(url, headers=headers, data=data)
    content = response.content.decode()
    content = content.replace('\\"', '\'')
    content = json.loads(content)
    return content, is_zhixia

def handel_content(content, is_zhixia):
    data = content['message']
    data_list = ast.literal_eval(data)['list']
    if not is_zhixia:
        city_name = data_list[0]['diji']
    else:
        city_name = data_list[0]['xianji']
    return city_name

def run():
    mongo = MongoAreaInfo()
    conditions = {'country_name':'中国'}
    area_data = mongo.find(conditions)
    for data in area_data:
        if data.city_name:
            simple_name = data.city_name
            simple_name = simple_name.split('自治')[0]
            simple_name = simple_name.split('区')[0]
            simple_name = simple_name.split('县')[0]
            if len(simple_name) > 2:
                simple_name = simple_name.split('州')[0]
            province_name = data.province_name
            try:
                content, is_zhixia = get_content(simple_name, province_name)
                complete_name = handel_content(content, is_zhixia)
            except:
                complete_name = simple_name
            new_data = data
            new_data.complete_city_name = complete_name
            mongo.insert_one(new_data)

if __name__ == '__main__':
    run()