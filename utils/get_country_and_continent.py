from lxml import etree
import pymongo
from pymongo import MongoClient
from core.settings import MONGO
from utils.log import logger


def get_web_content():
    with open('country.html', 'r') as f:
        content = f.read()
    return content

'''获取国家信息：
包括国家中文名、英文名、大洲中文名、大洲英文名'''
def get_country_dic():
    group_xpath = '//table[@class="sites-layout-name-one-column sites-layout-hbox"]/tbody/tr/td/div/table/tbody/tr[position()>1]'
    country_xpath = './td[3]/text()'
    country_eng_xpath = './td[2]/text()'
    continent_xpath = './td[5]/text()'
    continent_eng_xpath = './td[4]/text()'
    content = get_web_content()
    html = etree.HTML(content)
    mongo = MongoCountry()
    print('正在获取国家信息')
    for countries in html.xpath(group_xpath):
        country = countries.xpath(country_xpath)[0]
        country_en = countries.xpath(country_eng_xpath)[0]
        continent = countries.xpath(continent_xpath)[0]
        continent_en = countries.xpath(continent_eng_xpath)[0].capitalize()
        data = Data(country=country, country_en=country_en, continent=continent, continent_en=continent_en)
        mongo.insert_one(data)
    print('国家信息已写入数据库')

#获取国家信息，调用时请注意参数
def find_country_info(country=None, country_en=None, continent=None, continent_en=None):
    country_dist={}
    mongo = MongoCountry()
    if country != None:
        country_dist['country']=country
    if country_en != None:
        country_dist['country_en']=country_en
    if continent != None:
        country_dist['continent']=continent
    if continent_en != None:
        country_dist['continent_en']=continent_en
    if mongo.find(country_dist):
        country_info = mongo.find(country_dist)[0]
        return country_info
    return None

def find_all_country():
    mongo = MongoCountry()
    country_list = mongo.find()
    return country_list

'''
    定义数据格式
    国家名称
    大洲名称
'''
class Data(object):
    def __init__(self, country=None, country_en=None, continent=None, continent_en=None):
        self.country = country
        self.country_en = country_en
        self.continent = continent
        self.continent_en = continent_en

    #返回字符串
    def __str__(self):
        return str(self.__dict__)

'''
定义数据库
将全球国家信息存入数据库
'''
class MongoCountry(object):
    def __init__(self):
        self.client = MongoClient(MONGO)
        self.country_data = self.client['country']['country']

    def __del__(self):
        self.client.close()

    #插入国家信息
    def insert_one(self, data):
        is_exist = self.country_data.count_documents({'_id':str(data.country)})
        if is_exist == 0:
            dic = data.__dict__
            dic['_id'] = str(data.country)
            self.country_data.insert_one(dic)
            logger.info("新疫情数据插入成功:{}".format(data))
        else:
            logger.debug("疫情数据已经存在:{}".format(data))

    #获取国家信息
    def find(self, conditions={}, count=0):
        '''
        实现查询功能：
        根据条件查询
        :param conditions:查询条件
        :param count: 查询数量
        :return:
        '''
        cursor = self.country_data.find(conditions, limit=count)
        data_list = []
        for item in cursor:
            item.pop('_id')
            data = Data(**item)
            data_list.append(data)
        if len(data_list) == 0:
            return None
        return data_list


# mongo = MongoCountry()
# for country in mongo.find():
#     print(country)