from core.spider.tenxun_source.get_post_json import get_content_dict
import json
from core.spider.tenxun_source.get_post_json import str_to_dict
from core.Data import Data
from core.database.database import MongoPool
import time

#解析数据结构
def parse_data_arch(province):
    url = 'https://wechat.wecity.qq.com/api/THPneumoniaOuterDataService/getInfoBatch'
    post_data = {"args": {"req": {"batchReq": {"getKeyCity": "{\"area\":\"default\"}", "getCityInfo": "{\"area\":\"default\"}"}}},
                 "service": "THPneumoniaOuterDataService", "func": "getInfoBatch",
                 "context": {"userId": "98d84292859f45c381a1644a93d873ca"}}
    post_data['args']['req']['batchReq']['getKeyCity'] = '{\"area\":\"' + province + '\"}'
    post_data['args']['req']['batchReq']['getCityInfo'] = '{\"area\":\"' + province + '\"}'
    post_data = json.dumps(post_data)
    content = get_content_dict(url, post_data)
    return str_to_dict(content['args']['sRsp'])


##各省的数据结构很复杂，是多种结构混合在一起，所以需要操作多次
def get_province_data(province):
    content = parse_data_arch(province)
    province_info_history = str_to_dict(content['batchRsp']['getKeyCity'])
    #获取该省最近两个月历史数据
    mongo = MongoPool()
    for province_info in province_info_history['areaHistory']:
        # print(province_info)
        province = province_info['province']
        data = province_info['date']
        confirm = province_info['confirm']
        dead = province_info['dead']
        heal = province_info['heal']
        suspect = province_info['suspect']
        day = str(province_info['day'])
        heavy = province_info['heavy'] if province_info['heavy']>0 else 0
        format_day = '2020年'+day.split('.')[0]+'月'+day.split('.')[1]+'日'
        province_data = Data(country='中国',province=province, date=format_day,confirm_all=confirm, dead_all=dead, heal_all=heal, suspect_now=suspect, heavy_now=heavy)
        mongo.insert_one(province_data)
        # print(format_day)

##获取该省份各城市疫情数据
def get_city_data(province):
    content  = parse_data_arch(province)
    all_city_info = str_to_dict(content['batchRsp']['getCityInfo'])
    day = time.strftime('%Y年%m月%d日')
    mongo  = MongoPool()
    #获取该省各地级市数据
    city_code_dic = {}
    for city_info in all_city_info['city']:
        country = city_info['country']
        province_name = city_info['province']
        city = city_info['city']
        confirm = city_info['confirm']
        confirm_now = city_info['nowConfirm']
        suspect_now = city_info['suspect']
        dead = city_info['dead']
        heal = city_info['heal'] if city_info['showHeal'] ==1 else 0
        city_full_name = city_info.get('mapCity',0)
        city_code = city_info.get('cityCode',0)
        province_code = city_info.get('provinceCode',0)
        confirm_modify = city_info['modifyConfirm']
        suspect_modify = city_info['modifySuspect']
        dead_modify = city_info['modifyDead']
        heal_modify = city_info['modifyHeal']
        import_now = city_info['import']
        is_modify = '是' if city_info['showAdd']==1 else '否'
        city_data = Data(date=day,continent='亚洲',continent_eng='Asia',country='中国',country_eng='China',province=province,city=city,city_code=city_code,province_code=province_code, \
                         confirm_all=confirm,confirm_now=confirm_now, dead_all=dead, heal_all=heal, suspect_now=suspect_now, input_now=import_now, confirm_add=confirm_modify, \
                         suspect_add=suspect_modify, dead_add=dead_modify)
        mongo.insert_one(city_data)


if __name__ == '__main__':
    # get_city_data('贵州')
    # get_city_data('江西')
    # province_list = []
    with open('../province.txt', 'r') as f:
        for line in f.readlines():
            get_city_data(line.strip())
