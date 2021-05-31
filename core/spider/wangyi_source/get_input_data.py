import requests
import random
from core.settings import userAgent
from utils.log import logger
import json
from core.settings import MONGO
from pymongo import MongoClient
import time

"""
功能描述：
此脚本用于获取境外输入数据
source为输入源国家， target为输入目标国内省份
"""

#输入数据存储格式
class Data(object):
    def __init__(self, target_province=None, source_country=None, value=0, update_time=None):
        self.target_province = target_province
        self.source_country = source_country
        self.value = value
        self.update_time = update_time
    def __str__(self):
        return str(self.__dict__)

class MongoInput(object):
    def __init__(self):
        self.client = MongoClient(MONGO)
        self.input_data = self.client['covid']['input_data']

        # 关闭数据库连接

    def __del__(self):
        self.client.close()
        # 增加功能，使用日期+国家+省份+市作为主键

    def insert_one(self, data):
        is_exist = self.input_data.count_documents({'_id': str(data.target_province) + str(data.source_country)})
        dic = data.__dict__
        dic['_id'] = str(data.target_province) + str(data.source_country)
        if is_exist == 0:
            self.input_data.insert_one(dic)
            logger.info("输入数据插入成功:{}".format(data))
        else:
            self.delete_one(data)
            self.input_data.insert_one(dic)
            logger.debug("输入数据进行更新:{}".format(data))
        # 删除功能

    def delete_one(self, data):
        self.input_data.delete_one({'_id': str(data.target_province) + str(data.source_country)})

    def find(self, conditions={}, count=0):
        '''
        实现查询功能：
        根据条件查询
        :param conditions:查询条件
        :param count: 查询数量
        :return:
        '''
        cursor = self.input_data.find(conditions, limit=count)
        data_list = []
        for item in cursor:
            item.pop('_id')
            data = Data(**item)
            data_list.append(data)
        return data_list

def get_content():
    url = 'https://c.m.163.com/ug/api/wuhan/app/index/input-data-list'
    request_header = {
        'User-Agent': random.choice(userAgent),
    }
    try:
        response = requests.get(url, headers=request_header)
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
    if len(content) != 0:
        content = json.loads(content)
        if content.get('data'):
            mongo = MongoInput()
            for input_info in content['data']['list']:
                source_country = input_info['source']
                target_province = input_info['target']
                value = input_info['value']
                data = Data(source_country=source_country, target_province=target_province, value=value, update_time=str(time.strftime('%Y-%m-%d %H:%M:%S')))
                mongo.insert_one(data)
        else:
            print('数据无效！\n' + content)
            logger.error('数据无效！\n' + content)
    else:
        print('数据获取错误！\n'+content)
        logger.error('数据获取错误！\n'+content)

#纯属娱乐
# if input_target_dist.get(input_info['target']):
#     input_target_dist[input_info['target']]['source_country'] = input_target_dist[input_info['target']][
#                                                                     'source_country'] + [
#                                                                     {input_info['source']: input_info['value']}]
# else:
#     input_target_dist[input_info['target']] = {'source_country': [{input_info['source']: input_info['value']}]}
# return input_target_dist
# def handle_data(data_dist):
#     for province in data_dist.keys():
#         value = 0
#         for source_country in data_dist[province]['source_country']:
#             for country_value in source_country.values():
#                 value += country_value
#         print(province+'\t输入病例数：'+str(value))
#     pass

def run():
    content = get_content()
    handle_content(content)

if __name__ == '__main__':
    run()