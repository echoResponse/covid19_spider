from core.spider.tenxun_source.get_post_json import get_content_dict
from core.database.database import MongoPool
from core.Data import Data
from utils.get_data import get_date_time

def get_content():
    data = '{"args":{"req":{"none":"none"}},"service":"THPneumoniaOuterDataService","func":"getChinaTotal","context":{"userId":""}}'
    url = 'https://wechat.wecity.qq.com/api/THPneumoniaOuterDataService/getChinaTotal'
    dic = get_content_dict(url=url, data=data)
    return dic

#获取国外累计数据
def get_foreign_total():
    dic = get_content()
    foreign_total = dic['args']['rsp']['foreign']['foreignTotal']
    confirm_all = foreign_total['confirm']
    dead_all = foreign_total['dead']
    heal_all = foreign_total['heal']
    import_all = foreign_total['import']
    noinfect_all = foreign_total['noinfect']
    confirm_now = foreign_total['nowConfirm']
    heavy_now = foreign_total['heavy']
    data = Data(date=get_date_time(), continent='全球', continent_eng='earth', country='除中国', country_eng='all_but_china',confirm_all=confirm_all, dead_all=dead_all, heal_all=heal_all, input_all=import_all, confirm_now=confirm_now, noinfect_now=noinfect_all,heavy_now=heavy_now)
    mongodb = MongoPool()
    mongodb.insert_one(data)

#获取国内累计数据
def get_china_total():
    dic = get_content()
    update_time = dic['args']['rsp']['data']['chinaTotalUpdateTime']
    china_day_all_modify = dic['args']['rsp']['data']['chinaDayModify']
    confirm_all_modify = china_day_all_modify['confirm']
    dead_all_modify = china_day_all_modify['dead']
    heal_all_modify = china_day_all_modify['heal']
    import_all_modify = china_day_all_modify['import']
    noinfect_all_modify = china_day_all_modify['noinfect']
    confirm_now_modify = china_day_all_modify['nowConfirm']
    print('较昨日变化[不进数据库]\t\t更新时间：'+update_time)
    print('累计确诊：'+str(confirm_all_modify)+'\t累计死亡：'+str(dead_all_modify)+'\t累计治愈：'+str(heal_all_modify)+'\t累计输入：'+str(import_all_modify)+'\t累计无症状：'+str(noinfect_all_modify)+'\t现存确诊：'+str(confirm_now_modify))
    china_total = dic['args']['rsp']['data']['chinaTotal']
    confirm_all = china_total['confirm']
    dead_all = china_total['dead']
    heal_all = china_total['heal']
    import_all = china_total['import']
    noinfect_all = china_total['noinfect']
    confirm_now = china_total['nowConfirm']
    data = Data(date=get_date_time(), confirm_all=confirm_all, dead_all=dead_all, heal_all=heal_all, input_all=import_all, confirm_now=confirm_now, noinfect_now=noinfect_all)
    mongodb = MongoPool()
    mongodb.insert_one(data)


if __name__ == '__main__':
    get_china_total()