import requests
from core.settings import userAgent
import random
import json
from pymongo import MongoClient
from core.settings import MONGO
import re

class data_city(object):
    def __init__(self, province=None, province_code=None, province_population=None, province_area=None, city=None, city_code=None, city_population=None, city_area=None):
        self.province = province
        self.province_code = province_code
        self.province_population = province_population
        self.province_area = province_area
        self.city = city
        self.city_code = city_code
        self.city_population = city_population
        self.city_area = city_area

class MongoProvince(object):
    def __init__(self):
        self.client = MongoClient(MONGO)
        self.province_data = self.client['province']['province_and_city']

        # 关闭数据库连接
    def __del__(self):
        self.client.close()

    def insert_one(self, data):
        is_exist = self.province_data.count_documents({'_id':data.province+str(data.city)})
        if is_exist == 0:
            dic = data.__dict__
            dic['_id'] = str(data.province+str(data.city))
            self.province_data.insert_one(dic)
        else:
            print('已存在')

    def find(self, conditions={}, count=0):
        '''
        实现查询功能：
        根据条件查询
        :param conditions:查询条件
        :param count: 查询数量
        :return:
        '''
        cursor = self.province_data.find(conditions, limit=count)
        data_list = []
        for item in cursor:
            item.pop('_id')
            data = data_city(**item)
            data_list.append(data)
        return data_list

def get_content(province, code):
    url = 'http://bmfw.www.gov.cn/ZFW-AccessPlatform/front/administrativedivision/queryAreaInfo.do?code='
    url = url+str(code)
    header = random.choice(userAgent)
    headers = {
        'User-Agent': header,
    }
    response = requests.get(url, headers=headers)
    content = response.content.decode()
    content = json.loads(content)
    info_list = json.loads(content['message'])
    province_population = info_list['shengPopulation']
    province_area = info_list['shengArea']
    print(info_list)
    data = data_city(province=province, province_code=code, province_population=province_population, province_area=province_area)
    mongo = MongoProvince()
    print('插入省份数据: '+province)
    mongo.insert_one(data)
    info_list = json.loads(content['message'])['list']
    if re.search('重庆', province) or re.search('北京', province) or re.search('天津', province) or re.search('上海', province):
        for info in info_list:
            city = info['name']
            city_code = info['code']
            city_population = info['population']
            city_area = info['area']
            data = data_city(province=province, province_code=code, province_population=province_population,
                             province_area=province_area, city=city, city_code=city_code, city_population=city_population, city_area=city_area)
            mongo.insert_one(data)
            print('插入城市数据：' + city)
    else:
        for info in info_list:
            if str(info['code'])[4:6] == '00':
                city = info['name']
                city_code = info['code']
                city_population = info['population']
                city_area = info['area']
                data = data_city(province=province, province_code=code, province_population=province_population, province_area=province_area, \
                                 city=city, city_code=city_code, city_population=city_population, city_area=city_area)
                mongo.insert_one(data)
                print('插入城市数据：'+city)

def run():
    with open('../core/spider/province_code.txt', 'r', encoding='GBK') as f:
        for province_code in f.readlines():
            if province_code == '\n':
                continue
            province = province_code.split(' ')[0].strip('')
            code = province_code.split(' ')[1].strip('\n')
            get_content(province, code)
