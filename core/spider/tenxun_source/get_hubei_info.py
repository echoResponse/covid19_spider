from core.spider.tenxun_source.get_post_json import get_content_dict
from core.database.database import MongoPool
from core.Data import Data
from utils.get_data import format_date

def get_data_area():
    url = 'https://wechat.wecity.qq.com/api/THPneumoniaOuterDataService/getHubeiInfo'
    data = '{"args":{"req":{"none":"none"}},"service":"THPneumoniaOuterDataService","func":"getHubeiInfo","context":{"userId":""}}'
    content = get_content_dict(url, data)
    data_area = content['args']['rsp']
    return data_area
#获取中国过去两个月的累计数据
def get_china_history_total():
    data_area = get_data_area()
    mongo = MongoPool()
    data = data_area['chinaHistoryTotal']
    print('中国最近两个月疫情累计数据正在写入数据库：')
    for every_day_total in data:
        day = every_day_total['day']
        confirm_all = every_day_total['confirm']
        dead_all  = every_day_total['dead']
        heal_all = every_day_total['heal']
        heavy_now = every_day_total['heavy']
        import_all = every_day_total['import']
        suspect_now = every_day_total['suspect']
        date = format_date(day)
        data_real = Data(date=date, confirm_all=confirm_all, dead_all=dead_all, heal_all=heal_all, heavy_now=heavy_now, input_all=import_all, suspect_now=suspect_now)
        mongo.insert_one(data_real)
        print('中国最近两个月疫情累计数据写入数据库完毕：')
        # print('日期:'+day+'\t累计确诊:'+str(confirm_all)+'\t累计死亡:'+str(dead_all)+'\t累计治愈:'+str(heal_all)+'\t现存重症:'+str(heavy_now)+'\t累计输入:'+str(import_all)+'\t现存疑似:'+str(suspect_now))

#获取中国过去两个月累计数据较昨日变化量
def get_china_history_modify():
    data_area = get_data_area()
    data = data_area['chinaModifyTotal']
    print('中国最近两月每日累计变化数据：')
    for everyday_modify in data:
        day = everyday_modify['day']
        confirm_modify = everyday_modify['confirm']
        dead_modify  = everyday_modify['dead']
        heal_modify = everyday_modify['heal']
        heavy_modify = everyday_modify['heavy']
        import_modify = everyday_modify['import']
        suspect_modify = everyday_modify['suspect']
        print('日期:'+day+'\t累计确诊:'+str(confirm_modify)+'\t累计死亡:'+str(dead_modify)+'\t累计治愈:'+str(heal_modify)+'\t现存重症:'+str(heavy_modify)+'\t累计输入:'+str(import_modify)+'\t现存疑似:'+str(suspect_modify))

#获取中国最近两个月各项数据比率
def get_china_history_rate():
    data_area = get_data_area()
    data = date_area['chinaRateHistory']
    print('中国最近两月比率数据：')
    for every_rate in data:
        day = every_rate['day']
        dead_rate = every_rate['dead']
        heal_rate = every_rate['heal']
        heavy_rate = every_rate['heavy']
        print('日期:'+day+'\t死亡率:'+str(dead_rate)+'\t治愈率:'+str(heal_rate)+'\t重症率:'+str(heavy_rate))

#获取湖北省过去两个月每日的总体累计数据
def get_hubei_history_total():
    data_area = get_data_area()
    data = data_area['hubeiTotalHistory']
    print('湖北省最近两月每日历史累计数据正在写入数据库：')
    mongo = MongoPool()
    for everyday_all in data:
        day = everyday_all['day']
        confirm_all = everyday_all['confirm']
        heal_all = everyday_all['heal']
        dead_all = everyday_all['dead']
        heavy_all = everyday_all['heavy']
        import_all = everyday_all['import']
        suspect_now = everyday_all['suspect']
        confirm_all_modify = everyday_all['modifyConfirm']
        date = format_date(day)
        data_real = Data(date=date, province='湖北', confirm_all=confirm_all, dead_all=dead_all, heal_all=heal_all, heavy_now=heavy_all, input_all=import_all, suspect_now=suspect_now)
        mongo.insert_one(data_real)
        print('湖北省最近两月每日历史累计数据写入数据库完毕：')
        # print('日期:'+day+'\t累计确诊:'+str(confirm_all)+'\t累计死亡:'+str(dead_all)+'\t累计治愈:'+str(heal_all)+'\t现存重症:'+str(heavy_all)+'\t累计输入:'+str(import_all)+'\t现存确诊:'+str(confirm_all_modify))


#获取湖北省最近两月每日历史累计数据较昨日变化
def get_hubei_history_modify():
    data_area = get_data_area()
    data = data_area['hubeiModifyHistory']
    print('湖北省最近两月每日历史累计数据较昨日变化')
    for everyday_modify in data:
        day = everyday_modify['day']
        confirm_modify = everyday_modify['confirm']
        dead_modify = everyday_modify['dead']
        heal_modify = everyday_modify['heal']
        heavy_modify = everyday_modify['heavy']
        import_modify = everyday_modify['import']
        suspect_modify = everyday_modify['suspect']
        print('日期:'+day+'\t累计确诊'+str(confirm_modify)+'\t累计死亡:'+str(dead_modify)+'\t累计治愈:'+str(heal_modify)+'\t现存重症:'+str(heavy_modify)+'\t累计输入:'+str(import_modify)+'\t现存疑似:'+str(suspect_modify))

#获取湖北最近两月各项数据比率
def get_hubei_history_rate():
    data_area = get_data_area()
    data = date_area['hubeiRateHistory']
    print('湖北省最近两月比率数据：')
    for every_rate in data:
        day = every_rate['day']
        dead_rate = every_rate['dead']
        heal_rate = every_rate['heal']
        heavy_rate = every_rate['heavy']
        print('日期:'+day+'\t死亡率:'+str(dead_rate)+'\t治愈率:'+str(heal_rate)+'\t重症率:'+str(heavy_rate))


def main():
    pass
    # get_china_history_total(data_area)
    # get_china_history_modify(data_area)
    # get_china_history_rate(data_area)
    # get_hubei_history_total(data_area)
    # get_hubei_history_modify(data_area)
    # get_hubei_history_rate(data_area)

if __name__ == '__main__':
    main()