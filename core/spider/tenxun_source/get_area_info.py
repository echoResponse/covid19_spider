# -*- coding:utf-8 -*-
from core.spider.tenxun_source.get_post_json import get_content_dict
from core.database.database import MongoPool
from core.Data import Data
from utils.get_data import get_date_time
from utils.get_data import format_date

def get_content():
    url = 'https://wechat.wecity.qq.com/api/THPneumoniaOuterDataService/getAreaInfo'
    data = '{"args":{"req":{"none":"none"}},"service":"THPneumoniaOuterDataService","func":"getAreaInfo","context":{"userId":""}}'
    dic = get_content_dict(url, data)
    update_date = dic['args']['rsp']['recentTime']
    print('更新时间：' + update_date)
    return dic

def get_area_info():
    dic = get_content()
    area_total = dic['args']['rsp']['areaTotal']
    print('各省累计数据：')
    mongodb = MongoPool()
    print('数据正在写入数据库')
    for province_data in area_total:
        country = province_data['country']
        province_code = province_data['provinceCode']
        province = province_data['area']
        confirm_all = province_data['confirm']
        dead_all = province_data['dead']
        heal_all = province_data['heal']
        confirm_all_modify = province_data['modifyConfirm']
        dead_all_modify = province_data['modifyDead']
        heal_all_modify = province_data['modifyHeal']
        confirm_now = province_data['nowConfirm']
        import_now = province_data['import']
        data = Data(country=country, province=province, province_code=province_code, date=get_date_time(),  \
                    confirm_all=confirm_all, dead_all=dead_all, heal_all=heal_all, confirm_now=confirm_now, input_all=import_now, confirm_add=confirm_all_modify, \
                    dead_add=dead_all_modify, heal_add=heal_all_modify)
        mongodb.insert_one(data)
    print('数据库写入完毕')

#国内60天历史累计信息
def get_60days_history_total():
    dic = get_content()
    history_total = dic['args']['rsp']['chinaHistoryTotal']
    print('最近两月每天的历史累计信息：')
    mongodb = MongoPool()
    print('数据正在写入数据库')
    for everyday_total in history_total:
        date = everyday_total['day']
        confirm = everyday_total['confirm']
        now_suspect = everyday_total['suspect']
        dead = everyday_total['dead']
        heal = everyday_total['heal']
        now_heavy = everyday_total['heavy']
        import_all = everyday_total['import']
        data = Data(date=format_date(date), confirm_all=confirm, suspect_now=now_suspect, dead_all=dead, heal_all=heal, heavy_now=now_heavy, input_all=import_all)
        mongodb.insert_one(data)
    print('数据库写入完毕')
        # print('日期:'+date+'\t累计确诊:'+str(confirm)+'\t累计死亡:'+str(dead)+'\t累计治愈:'+str(heal)+'\t累计输入:'+str(import_all)+'\t现存疑似:'+str(now_suspect)+'\t现存重症:'+str(now_heavy))

def get_60days_history_total_modify():
    dic = get_content()
    history_total_modify = dic['args']['rsp']['modifyHistoryTotal']
    print('最近两月较昨日累计数据的变化，其中疑似只写增加值，不变或减少均为0')
    for everyday_total_modify in history_total_modify:
        date = str(everyday_total_modify['day'])
        confirm_modify = everyday_total_modify['confirm']
        suspect_modify = everyday_total_modify['suspect']
        dead_modify = everyday_total_modify['dead']
        heal_modify = everyday_total_modify['heal']
        heavy_modify = everyday_total_modify['heavy']
        import_modify = everyday_total_modify['import']
        date = format_date(date)
        # print(date)
        print('日期:' + date + '\t累计确诊:' + str(confirm_modify) + '\t累计死亡:' + str(dead_modify) + '\t累计治愈:' + str(heal_modify) + '\t累计输入:' + str(import_modify) + '\t现存疑似:' + str(suspect_modify) + '\t现存重症:' + str(heavy_modify))

def main():
    get_60days_history_total_modify()

if __name__ == '__main__':
    main()