from pymongo import MongoClient
from core.settings import MONGO

class Jiangxi_Mongo(object):
    def __init__(self):
        self.client = MongoClient(MONGO)
        self.jiangxi_data = self.client['origin_content']['jiangxi_province']

    #关闭数据库连接
    def __del__(self):
        self.client.close()
    #增加功能，使用日期+国家+省份+市作为主键
    def insert_one(self, data):
        is_exist = self.jiangxi_data.count_documents({'_id':str(data.date)})
        if is_exist == 0:
            dic = data.__dict__
            dic['_id'] = str(data.date)
            self.jiangxi_data.insert_one(dic)

    def find(self, conditions={}, count=0):
        '''
        实现查询功能：
        根据条件查询
        :param conditions:查询条件
        :param count: 查询数量
        :return:
        '''
        cursor = self.jiangxi_data.find(conditions, limit=count)
        data_list = []
        for item in cursor:
            item.pop('_id')
            data = Jiangxi_data(**item)
            data_list.append(data)
        return data_list

    #删除功能
    def delete_one(self, data):
        self.jiangxi_data.delete_one({'_id':str(data.date)})

class Jiangxi_data(object):
    def __init__(self, date=None, title=None, content=None):
        self.date = date
        self.title = title
        self.content = content

    def __str__(self):
        return '日期：'+self.date+'\n'+'标题：'+self.title+'\n'+'文章内容：'+self.content

