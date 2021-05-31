from core.settings import userAgent
import random
import requests
import json
from core.Data import Data
from utils.log import logger
from core.spider.wangyi_source.get_area_id import MongoAreaInfo
from core.spider.wangyi_source.get_area_id import areaData
from core.database.database import MongoPool

"""
功能描述：
获取实时数据：包括所有地区【即AreaInfo数据库中存储的】的实时数据，数据内容参照core.Data
1、实时数据的时间为now，存在update_time，即该数据的更新时间
2、注意观察网易凌晨后中国数据显示待更新是因为什么？数据的特殊格式？
"""

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
"""
进行数据的处理：
1、返回值可格式化成json，这里主要对areaTree中的数据进行处理
2、areaTree的值为列表，每一个列表数据为一个国家的数据
3、上述列表中包含：
children列表【该列表表示该国家的子数据，如省份，省份的数据格式与国家相同，因此省份中如果有children则为城市，数据格式相同】
extData:字典【并不是每一个国家数据中都有， 如果有，则包含数据有：现存无症状数，新增无症状数】
id:该地区的ID
lastUpdateTime:该数据的更新时间
name:该国家或地区的名称
注意：网易源没有给出实时的现有确诊数，只能通过计算：现有确诊数=累计确诊数-累计治愈数-累计死亡数
"""
def handle_content(content):
    mongo = MongoPool()
    if json.loads(content).get('data'):
        content_list = json.loads(content)['data']['areaTree']
        if len(content_list) == 0:
            print('无数据！')
            return
        else:
            mongo_area = MongoAreaInfo()
            for area_info in content_list:
                country_id = area_info['id']
                if len(mongo_area.find(conditions={'country_id':country_id, 'province_id': None, 'city_id': None})) == 0:
                    print('新增未知国家：' + area_info['name'])
                    area_data = areaData(country_name=area_info['name'], country_id=country_id)
                    mongo_area.insert_one(area_data)
                    print('新增国家已加入数据库' + str(area_data))
                country_info = mongo_area.find(conditions={'country_id': country_id, 'province_id': None, 'city_id': None})[0]
                if len(area_info['extData']) != 0:
                    noinfect_now = area_info['extData'].get('noSymptom')
                    noinfect_add = area_info['extData'].get('incrNoSymptom')
                else:
                    noinfect_now = None
                    noinfect_add = None
                update_time = area_info['lastUpdateTime']
                today_info = area_info['today']
                total_info = area_info['total']
                data = Data(date='now', continent_name=country_info.continent_name,continent_eng=country_info.continent_eng, country_name=country_info.country_name, \
                            country_id=country_info.country_id, country_eng=country_info.country_eng,noinfect_now=noinfect_now, noinfect_add=noinfect_add, update_time=update_time, \
                            confirm_add=today_info['confirm'], suspect_add=today_info['suspect'],heal_add=today_info['heal'], dead_add=today_info['dead'], severe_add=today_info['severe'], \
                            confirm_now_add=today_info['storeConfirm'], input_add=today_info.get('input'),confirm_all=total_info['confirm'], suspect_all=total_info['suspect'], \
                            heal_all=total_info['heal'], dead_all=total_info['dead'], severe_all=total_info['severe'],input_all=total_info.get('input'), \
                            confirm_now=total_info['confirm']-total_info['dead']-total_info['heal'])
                # print(data)
                mongo.insert_one(data)
                print(country_info.country_name + '\t数据已写入数据库')
                if len(area_info['children']) != 0:
                    for province in area_info['children']:
                        province_id = province['id']
                        if len(mongo_area.find(conditions={'province_id': province_id, 'city_id':None})) == 0:
                            print('新增未知省份：' + area_info['name'] + ':' + province['name'])
                            new_info = mongo_area.find(conditions={'country_name': area_info['name'], 'province_name': None})[0]
                            area_data = areaData(continent_name=new_info.continent_name,continent_eng=new_info.continent_eng,country_name=new_info.country_name, country_id=new_info.country_id, \
                                                 country_eng=new_info.country_eng, province_name=province['name'],province_id=province_id)
                            mongo_area.insert_one(area_data)
                            print('新增省份已加入数据库' + str(area_data))
                        province_info = mongo_area.find(conditions={'province_id': province_id, 'city_id': None})[0]
                        if len(province['extData']) != 0:
                            noinfect_now = province['extData'].get('noSymptom')
                            noinfect_add = province['extData'].get('incrNoSymptom')
                        else:
                            noinfect_now = None
                            noinfect_add = None
                        update_time = province['lastUpdateTime']
                        today_info = province['today']
                        total_info = province['total']
                        data = Data(date='now', continent_name=province_info.continent_name,continent_eng=province_info.continent_eng, country_name=province_info.country_name, \
                                    country_id=province_info.country_id, country_eng=province_info.country_eng,noinfect_now=noinfect_now, noinfect_add=noinfect_add, update_time=update_time, \
                                    confirm_add=today_info['confirm'], suspect_add=today_info['suspect'],heal_add=today_info['heal'], dead_add=today_info['dead'],severe_add=today_info['severe'], \
                                    confirm_now_add=today_info['storeConfirm'], input_add=today_info.get('input'),confirm_all=total_info['confirm'], suspect_all=total_info['suspect'], \
                                    heal_all=total_info['heal'], dead_all=total_info['dead'],severe_all=total_info['severe'], input_all=total_info.get('input'), \
                                    province_name=province_info.province_name, province_id=province_info.province_id, confirm_now=total_info['confirm']-total_info['dead']-total_info['heal'])
                        mongo.insert_one(data)
                        print(province_info.country_name + ':' + province_info.province_name + '\t数据已写入数据库')
                        if len(province['children']) != 0:
                            for city in province['children']:
                                city_id = city['id']
                                """
                                由于网易的更新，出现了未知城市，进行处理
                                同理，为了程序的健壮性以及时间可靠性，在国家和省份判断阶段也应加入此段逻辑，因为可以有新的国家或地区加入统计数据
                                """
                                if len(mongo_area.find(conditions={'city_id': city_id})) == 0:
                                    print('新增未知城市：'+area_info['name']+':'+province['name']+':'+city['name'])
                                    new_info = mongo_area.find(conditions={'province_name':province['name'], 'city_name':None})[0]
                                    area_data = areaData(continent_name=new_info.continent_name, continent_eng=new_info.continent_eng, country_name=new_info.country_name, country_id=new_info.country_id, \
                                                         country_eng=new_info.country_eng, province_name=new_info.province_name, province_id=new_info.province_id, city_id=city_id, city_name=city['name'])
                                    mongo_area.insert_one(area_data)
                                    print('新增城市已加入数据库'+str(area_data))
                                city_info = mongo_area.find(conditions={'city_id': city_id})[0]
                                if len(city['extData']) != 0:
                                    noinfect_now = city['extData'].get('noSymptom')
                                    noinfect_add = city['extData'].get('incrNoSymptom')
                                else:
                                    noinfect_now = None
                                    noinfect_add = None
                                update_time = city['lastUpdateTime']
                                today_info = city['today']
                                total_info = city['total']
                                data = Data(date='now', continent_name=city_info.continent_name,continent_eng=city_info.continent_eng, country_name=city_info.country_name, \
                                            country_id=city_info.country_id, country_eng=city_info.country_eng,noinfect_now=noinfect_now, noinfect_add=noinfect_add, update_time=update_time, \
                                            confirm_add=today_info['confirm'], suspect_add=today_info['suspect'],heal_add=today_info['heal'], dead_add=today_info['dead'],severe_add=today_info['severe'], \
                                            confirm_now_add=today_info['storeConfirm'], input_add=today_info.get('input'),confirm_all=total_info['confirm'], suspect_all=total_info['suspect'], \
                                            heal_all=total_info['heal'], dead_all=total_info['dead'],severe_all=total_info['severe'], input_all=total_info.get('input'), \
                                            province_name=city_info.province_name,province_id=city_info.province_id, city_name=city_info.city_name, city_id=city_info.city_id, \
                                            confirm_now=total_info['confirm']-total_info['dead']-total_info['heal'])
                                mongo.insert_one(data)
                                print(city_info.country_name + ':' + city_info.province_name + ':' + city_info.city_name + '\t数据已写入数据库')
    else:
        print('该数据不存在：' + str(content))
        logger.error('该数据不存在：' + str(content))

def run():
    content = get_content()
    handle_content(content)

run()