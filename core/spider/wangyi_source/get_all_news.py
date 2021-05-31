from core.spider.wangyi_source.get_post_json import get_content_dict, get_post_json, str_to_dict
from pymongo import MongoClient
from core.settings import MONGO
from utils.log import logger
import json
import re
import random
import requests
from core.settings import userAgent
#将图片以二进制的形式存入MongoDB中
from bson import binary
import time

class MongoNews():
    #建立新的数据库连接
    def __init__(self):
        self.client = MongoClient(MONGO)
        self.news_data = self.client['covid']['covid_news']
    #关闭数据库连接
    def __del__(self):
        self.client.close()
    #增加功能，使用日期+国家+省份+市作为主键
    def insert_one(self, data):
        is_exist = self.news_data.count_documents({'_id':str(data.id)})
        if is_exist == 0:
            dic = data.__dict__
            dic['_id'] = str(data.id)
            self.news_data.insert_one(dic)
            logger.info("疫情新闻插入成功:{}".format(data))
        #date为now表示实时数据，每一次应该更新
        else:
            logger.debug("疫情新闻已经存在:{}".format(data))
    #删除功能
    def delete_one(self, data):
        self.news_data.delete_one({'_id':str(data.id)})
    def find(self, conditions={}, count=0):
        cursor = self.news_data.find(conditions, limit=count)
        data_list = []
        for item in cursor:
            item.pop('_id')
            data = DataNews(**item)
            data_list.append(data)
        return data_list

class DataNews(object):
    def __init__(self, id=None, title=None, desc=None, url=None, source=None, public_time=None, area=None, global_area=None, image=None, content=None, image_source=None):
        self.id = id
        self.title = title
        self.desc = desc
        self.url = url
        self.source = source
        self.public_time = public_time
        self.image = image
        self.image_source = image_source
        self.content = content
        self.area = area
        self.global_area = global_area

    def __str__(self):
        return str(self.__dict__)

def get_content(area):
    url = 'https://wechat.wecity.qq.com/api/THPneumoniaService/getAreaContents'
    data = '{"args":{"req":{"tab":"shishitongbao","readIds":[],"reqType":2,"limit":50,"areaName":"'+area+\
           '","appData":""}},"service":"THPneumoniaOuterService","func":"getAreaContents","context":{"userId":""}}'
    data = data.encode('utf-8')
    content = get_content_dict(url, data)
    return content

def handle_content(content):
    if not content.get('args'):
        return None
    real_data = content['args']['rsp']['contents']
    for news in real_data:
        id = news['id']
        title = news['title']
        desc = news['desc']
        url = repr(news['jumpLink']['url']).replace("\\\\", '').strip("'")
        source = news['from']
        public_time = news['publicTime']
        area = news['area']
        global_area = news['garea']
        yield url, id, title, desc, source, public_time, area, global_area

def get_news_info(origin_url):
    url_id = re.split('=|&', origin_url)[1]
    url = 'https://h5.baike.qq.com/api/access/json/cmd/GetMediaDocDataInfo'
    data = '{"header":{"version":2,"flag":0},"body":{"seq":6,"cmd":"GetMediaDocDataInfo","token":"4dbef382-d097-498a-8a37-7c5eb9f7b033-yk",\
    "client":{"platform":1,"os":"","env":"","isTourist":49,"adtag":"wxjk.yqssc.yqdt","vnk":"5b2b908e","product":0},"payload":{"docid":"'+url_id+'","type":1},"traceid":""}}'
    news_content = ''
    image_url = ''
    image_source = ''
    ###解决腾讯新闻返回值触发bug
    content = get_post_json(url, data)
#    content = content.split(',"author_doctor"')[0]+'}}}'
#    content = str_to_dict(content)
    content = json.loads(content)
#    if content['body']['payload'].get('content'):
#        return news_content, image_url, image_source
    news_info = content['body']['payload']['content']
    for p in re.split('<p>|</p>', news_info):
        if re.search('来源', p):
            continue
        if re.search('img src', p):
            image_url = p.split("'")[1]
        else:
            if re.search('图源', p):
                image_source_part = p.split('：')
                if len(image_source_part) < 3:
                    image_source = ''
                else:
                    image_source = image_source_part[1]
            else:
                if len(p) != 0:
                    news_content += p.replace("<strong>", '').replace("</strong>", '')+'\n'
    return news_content, image_url, image_source

def get_image(url):
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
        content = response.content
    except:
        content = ''
        print('爬取错误， 请检查爬虫')
        logger.error('爬取错误， 请检查爬虫')
    finally:
        pass
    return content

def run():
    for garea in ["国内","国外"]:
        content = get_content(garea)
        mongo = MongoNews()
        for news_url, id, title, desc, source, public_time, area, global_area in handle_content(content):
            news_content = ''
            image = ''
            image_source = ''
            #判断url是否存在
            if news_url:
                news_content, image_url, image_source = get_news_info(news_url)
                if len(image_url) != 0:
                    image_content = get_image(image_url)
                    image = binary.Binary(image_content)
            news_content = re.sub('<.*?>', '', news_content)
            data = DataNews(id=id, title=title, desc=desc, source=source, public_time=public_time, \
                            area=area, global_area=global_area, image=image, image_source=image_source, \
                            content=news_content)
            mongo.insert_one(data)
            time.sleep(1)

def test():
    import matplotlib.pyplot as plt  # plt 用于显示图片
    import matplotlib.image as mpimg  # mpimg 用于读取图片
    import numpy as np


    mongo = MongoNews()
    data = mongo.find(conditions={'id':28451})[0]
    with open('1', 'bw') as f:
        f.write(data.image)
    lena = mpimg.imread('1')  # 读取和代码处于同一目录下的 lena.png
    # 此时 lena 就已经是一个 np.array 了，可以对它进行任意处理
    lena.shape  # (512, 512, 3)

    plt.imshow(lena)  # 显示图片
    plt.axis('off')  # 不显示坐标轴
    plt.show()

if __name__ == '__main__':
    run()
