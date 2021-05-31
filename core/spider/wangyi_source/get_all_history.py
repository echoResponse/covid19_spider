from core.settings import userAgent
import random
import requests
import json
from core.Data import Data
from utils.log import logger
from core.spider.wangyi_source.get_area_id import MongoAreaInfo
import time
from core.database.database import MongoPool
import datetime

"""
2021年1月4日：
网易数据源存在问题：
1、省份2021年数据返回时间仍为2020年
2、省份有昨日历史数据，城市和国家没有
"""

"""
功能描述：
1、从数据库获取所有地区ID：有城市则用城市ID，否则有省份则用省份ID，否则用国家ID
2、根据ID去获取疫情历史数据，网易的历史数据最新的日期的获取数据的当天，这个数据不能使用；且网易没有当天的前一天数据，这个数据需要在当天的后一天才能获取[目前所知只有省份有前一天的数据]
3、将获取到的历史疫情数据存入数据库
"""

def get_url():
    #areaCode后面加省份行政代码或者地级市（区县）行政代码
    origin_url = 'https://c.m.163.com/ug/api/wuhan/app/data/list-by-area-code?areaCode='
    '''
    分为国家、省份、城市数据爬取，首先进行国家爬取，其次进行省份爬取，最后进行城市爬取
    三级地区ID等数据来源为MongoAreaInfo()数据库
    '''
    #通过条件判断是国家、省份还是城市
    mongo = MongoAreaInfo()
#    conditions = {'country_id':'0',  'province_id':None, 'city_id':None}
    for area in mongo.find():
        #进行三级地区的判断
        if area.city_id:
            url = origin_url+area.city_id
        elif area.province_id:
            url = origin_url+area.province_id
        else:
            url = origin_url+area.country_id
        yield area, url
'''
爬虫请求发送模块：get请求的实现
'''
def get_content(url):
    request_header = {
        'User-Agent': random.choice(userAgent),
    }
    try:
        response = requests.get(url, headers=request_header)
        if response.status_code == 200:
            print(url+'\t爬取成功')
            logger.info(url+'\t爬取成功')
        else:
            print(url+'\t爬取失败， 请检查爬虫')
            logger.error(url+'\t爬取失败， 请检查爬虫')
        content = response.content.decode()
    except:
        content = ''
        print('爬取错误， 请检查爬虫')
        logger.error('爬取错误， 请检查爬虫')
    finally:
        pass
    return content


'''
处理爬虫返回数据
根据Data类定义数据范围
统一数据格式
'''
def handle_content(content, area):
    mongo = MongoPool()
    if json.loads(content).get('data'):
        content_list = json.loads(content)['data']['list']
        if len(content_list) == 0:
            print('无数据！')
            return
        '''
        这个地方可以进行修改，由于已经获取了历史数据，所以现在获取每日数据,即列表的最后一项.
        网易没有提供当日前一日的历史数据，所以当日前一日的数据在后一日获取
        '''
        #以下切片操作是为了数据更新获取而不是全部获取
        # if  len(mongo.find(conditions={'date':'2021-01-01'})) != 0:
        content_list = content_list[-2:]
        for every_content in content_list:
            now_time = datetime.datetime.now().strftime("%Y-%m-%d").__str__()
            date = every_content['date']
            get_date_info = date.split('-')
            system_date_info = now_time.split('-')
            #由于网易在2021年后些许新的历史数据返回时间仍然为2020年， 所以这里进行数据修正
            #需要经常观察，网易数据恢复正确后这里应该删去
            if get_date_info[0] == '2020' and int(get_date_info[1]+get_date_info[2]) <= int(system_date_info[1]+system_date_info[2]):
                print('进行数据时间修正：'+date)
                date = '2021-'+get_date_info[1]+'-'+get_date_info[2]
                print('修正后时间：'+date)
            if date == now_time:
                print('当日数据，暂不进入数据库')
                continue
            today_add = every_content['today']
            total_data = every_content['total']
            confirm_add = today_add['confirm']
            suspect_add = today_add['suspect']
            heal_add = today_add['heal']
            dead_add = today_add['dead']
            severe_add = today_add['severe']
            if today_add.get('input'):
                input_add = today_add['input']
            else:
                input_add = 0
            confirm_all = total_data['confirm']
            suspect_all = total_data['suspect']
            heal_all = total_data['heal']
            dead_all = total_data['dead']
            severe_all = total_data['severe']
            input_all = total_data['input']
            if total_data.get('storeConfirm'):
                confirm_now = total_data['storeConfirm']
            else:
                confirm_now = int(confirm_all)-int(heal_all)-int(dead_all)
            if area.city_id:
                data_to_database = Data(date=date, continent_name=area.continent_name, continent_eng=area.continent_eng,province_name=area.province_name, province_id=area.province_id, confirm_add=confirm_add, \
                                        suspect_add=suspect_add, heal_add=heal_add, dead_add=dead_add, severe_add=severe_add, input_add=input_add, confirm_all=confirm_all, \
                                        suspect_all=suspect_all, heal_all=heal_all, dead_all=dead_all, severe_all=severe_all, input_all=input_all, confirm_now=confirm_now, \
                                        country_name=area.country_name, country_eng=area.country_eng, country_id=area.country_id, city_name=area.city_name, city_id=area.city_id)
                print(data_to_database)
                mongo.insert_one(data_to_database)
                print(date+'\t'+area.country_name+':'+area.province_name+':'+area.city_name+'\t数据已写入数据库')
            elif area.province_id:
                data_to_database = Data(date=date, continent_name=area.continent_name, continent_eng=area.continent_eng,province_name=area.province_name, province_id=area.province_id,confirm_add=confirm_add, \
                                        suspect_add=suspect_add, heal_add=heal_add, dead_add=dead_add,severe_add=severe_add, input_add=input_add, confirm_all=confirm_all, \
                                        suspect_all=suspect_all, heal_all=heal_all, dead_all=dead_all,severe_all=severe_all, input_all=input_all, confirm_now=confirm_now, \
                                        country_name=area.country_name, country_eng=area.country_eng,country_id=area.country_id)

                mongo.insert_one(data_to_database)
                print(date+'\t'+area.country_name+':'+area.province_name+'\t数据已写入数据库')
            else:
                data_to_database = Data(date=date, continent_name=area.continent_name, continent_eng=area.continent_eng,confirm_add=confirm_add, \
                                        suspect_add=suspect_add, heal_add=heal_add, dead_add=dead_add,severe_add=severe_add, input_add=input_add, confirm_all=confirm_all, \
                                        suspect_all=suspect_all, heal_all=heal_all, dead_all=dead_all,severe_all=severe_all, input_all=input_all, confirm_now=confirm_now, \
                                        country_name=area.country_name, country_eng=area.country_eng,country_id=area.country_id)

                # print(data_to_database)
                # print("\n")
                mongo.insert_one(data_to_database)
                print(date + '\t' + area.country_name + '\t数据已写入数据库')
    else:
        print('该数据不存在：'+str(area))
        logger.error('该数据不存在：'+str(area))


def run():
    for area, url in get_url():
        content = get_content(url)
        handle_content(content, area)
        time.sleep(2)
run()
