import pymongo

from core.Data import Data
from pymongo import MongoClient
from core.settings import MONGO
from utils.log import logger
'''
建立数据库，存储疫情数据
实现功能：增加，修改，删除，查询
'''
class MongoPool():
    #建立新的数据库连接
    def __init__(self):
        self.client = MongoClient(MONGO)
        self.covid_data = self.client['covid']['covid_data']

    #关闭数据库连接
    def __del__(self):
        self.client.close()
    #增加功能，使用日期+国家+省份+市作为主键
    def insert_one(self, data):
        is_exist = self.covid_data.count_documents({'_id':str(data.date)+str(data.country_name)+str(data.province_name)+str(data.city_name)})
        if is_exist == 0:
            dic = data.__dict__
            dic['_id'] = str(data.date)+str(data.country_name)+str(data.province_name)+str(data.city_name)
            self.covid_data.insert_one(dic)
            logger.info("疫情数据插入成功:{}".format(data))
        #date为now表示实时数据，每一次应该更新
        elif data.date == 'now':
            self.delete_one(data)
            dic = data.__dict__
            dic['_id'] = str(data.date) + str(data.country_name) + str(data.province_name) + str(data.city_name)
            self.covid_data.insert_one(dic)
            logger.debug("疫情数据更新成功:{}".format(data))
        else:
            logger.debug("疫情数据已经存在:{}".format(data))
    #删除功能
    def delete_one(self, data):
        self.covid_data.delete_one({'_id':str(data.date)+str(data.country_name)+str(data.province_name)+str(data.city_name)})

    def find(self, conditions={}, count=0):
        '''
        实现查询功能：
        根据条件查询
        :param conditions:查询条件
        :param count: 查询数量
        :return:
        '''
        cursor = self.covid_data.find(conditions, limit=count)
        data_list = []
        for item in cursor:
            item.pop('_id')
            data = Data(**item)
            data_list.append(data)
        return data_list

# if __name__ == '__main__':
#     mongo = MongoPool()
#     for day in range(1, 10):
#         if len(str(day)) == 1:
#             day = '0' + str(day)
#             date = '2021-01-03'
#             for city in mongo.find({'date':date}):
#                 mongo.delete_one(city)