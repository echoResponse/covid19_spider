import requests
import random
from core.settings import userAgent
from utils.log import logger
import json
from pymongo import MongoClient
from core.settings import MONGO
from utils.get_country_and_continent import find_country_info
from utils.get_country_and_continent import find_all_country
import re

"""
功能描述：
1、获取各地区的名称和ID，包含国家、省份、城市（有些国家的省份不叫省份，这里统一使用三级地区信息）
2、将三级信息数据存入数据库，待后续爬取历史累计信息使用
3、若该条信息包含城市，则应同样包含省份、国家；若包含省份，则同样应包含国家。【目的是为了建立数据的关联性】
"""
class areaData(object):
    def __init__(self, country_eng=None, country_name=None, country_id=None, province_name=None, province_id=None,
                 city_name=None, complete_city_name=None,city_id=None, continent_name=None, continent_eng=None):
        self.continent_name = continent_name
        self.continent_eng = continent_eng
        self.country_name = country_name
        self.country_id = country_id
        self.country_eng = country_eng
        self.province_name = province_name
        self.province_id = province_id
        self.city_name = city_name
        self.city_id = city_id
        self.complete_city_name = complete_city_name

    def __str__(self):
        return str(self.__dict__)

class MongoAreaInfo(object):
    #建立新的数据库连接
    def __init__(self):
        self.client = MongoClient(MONGO)
        self.area_info = self.client['area']['area_info']

    #关闭数据库连接
    def __del__(self):
        self.client.close()
    #增加功能，使用日期+国家+省份+市作为主键
    def insert_one(self, data):
        is_exist = self.area_info.count_documents({'_id':str(data.country_name)+str(data.province_name)+str(data.city_name)})
        if is_exist == 0:
            dic = data.__dict__
            dic['_id'] = str(data.country_name)+str(data.province_name)+str(data.city_name)
            self.area_info.insert_one(dic)
            print("地区数据插入成功:{}".format(data))
            logger.info("地区数据插入成功:{}".format(data))
        else:
            self.delete_one(data)
            dic = data.__dict__
            dic['_id'] = str(data.country_name) + str(data.province_name) + str(data.city_name)
            self.area_info.insert_one(dic)
            print('数据更新成功')
    #删除功能
    def delete_one(self, data):
        self.area_info.delete_one({'_id':str(data.country_name)+str(data.province_name)+str(data.city_name)})

    def find(self, conditions={}, count=0):
        '''
        实现查询功能：
        根据条件查询
        :param conditions:查询条件
        :param count: 查询数量
        :return:
        '''
        cursor = self.area_info.find(conditions, limit=count)
        data_list = []
        for item in cursor:
            item.pop('_id')
            data = areaData(**item)
            data_list.append(data)
        return data_list

def get_content():
    url = 'https://c.m.163.com/ug/api/wuhan/app/data/list-total'
    headers = {
        'User-Agent':random.choice(userAgent),
    }
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            print(url + '\t爬取成功')
            logger.info(url + '\t爬取成功')
        else:
            print(url + '\t爬取失败， 请检查爬虫')
            logger.error(url + '\t爬取失败， 请检查爬虫')
        content = response.content.decode()
    except:
        content = ''
        print('爬取错误， 请检查爬虫')
        logger.error('爬取错误， 请检查爬虫')
    finally:
        pass
    return content

def handle_content(content):
    if json.loads(content).get('data'):
        content_list = json.loads(content)['data']['areaTree']
        area_info = []
        for country_info in content_list:
            country_dist = {}
            country_name = country_info['name']
            country_id = country_info['id']
            continent_name = None
            continent_eng = None
            country_eng = None
            #获取国家相关信息：包括所在大洲、大洲英文名、国家英文名
            if find_country_info(country_name):
                country_continent = find_country_info(country=country_name)
                continent_name = country_continent.continent
                continent_eng = country_continent.continent_en
                country_eng = country_continent.country_en
            else:
                try:
                    for country_continent in find_all_country():
                        if re.search(country_name, country_continent.country) or re.search(country_continent.country, country_name):
                            continent_name = country_continent.continent
                            continent_eng = country_continent.continent_en
                            country_eng = country_continent.country_en
                            break
                except:
                    pass
            country_dist['country_name'] = country_name
            country_dist['country_id'] = country_id
            country_dist['continent_name'] = continent_name
            country_dist['continent_eng'] = continent_eng
            country_dist['country_eng'] = country_eng
            area_info.append(country_dist)
            if len(country_info['children']) != 0:
                for province_info in country_info['children']:
                    province_dist = {}
                    province_name = province_info['name']
                    province_id = province_info['id']
                    province_dist['country_name'] = country_name
                    province_dist['country_id'] = country_id
                    province_dist['continent_name'] = continent_name
                    province_dist['continent_eng'] = continent_eng
                    province_dist['country_eng'] = country_eng
                    province_dist['province_name'] = province_name
                    province_dist['province_id'] = province_id
                    area_info.append(province_dist)
                    if len(province_info['children']) != 0:
                        for city_info in province_info['children']:
                            city_dist = {}
                            city_name = city_info['name']
                            city_id = city_info['id']
                            city_dist['country_name'] = country_name
                            city_dist['country_id'] = country_id
                            city_dist['continent_name'] = continent_name
                            city_dist['continent_eng'] = continent_eng
                            city_dist['country_eng'] = country_eng
                            city_dist['province_name'] = province_name
                            city_dist['province_id'] = province_id
                            city_dist['city_name'] = city_name
                            city_dist['city_id'] = city_id
                            area_info.append(city_dist)
        return area_info
    else:
        print('爬取失败！文本内容为：\n' + content)
        logger.error('爬取失败！文本内容为：\n' + content)

def insert_area_to_database(area_info):
    mongo = MongoAreaInfo()
    for area in area_info:
        if area.get('city_name'):
            data = areaData(country_name=area['country_name'], country_id=area['country_id'] ,province_name=area['province_name'], \
                        province_id=area['province_id'], city_name=area['city_name'], city_id=area['city_id'], continent_name=area['continent_name'],\
                        continent_eng=area['continent_eng'], country_eng=area['country_eng'])
        elif area.get('province_name'):
            data = areaData(country_name=area['country_name'], country_id=area['country_id'],province_name=area['province_name'], \
                        province_id=area['province_id'], continent_name=area['continent_name'],continent_eng=area['continent_eng'], country_eng=area['country_eng'])
        else:
            data = areaData(country_name=area['country_name'], country_id=area['country_id'], continent_name=area['continent_name'], \
                        continent_eng=area['continent_eng'], country_eng=area['country_eng'])
        mongo.insert_one(data)
        # print(data)

def run():
    content = get_content()
    area_info = handle_content(content)
    insert_area_to_database(area_info)
