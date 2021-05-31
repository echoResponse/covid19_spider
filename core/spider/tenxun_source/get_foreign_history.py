#历史数据不包括中国
from core.spider.tenxun_source.get_post_json import get_content_dict
from core.database.database import MongoPool
from core.Data import Data
from utils.get_country_and_continent import find_country_info

def get_content():
    url = 'https://wechat.wecity.qq.com/api/THPneumoniaOuterDataService/getForeignHistory'
    data = '{"args":{"req":{"none":"none"}},"service":"THPneumoniaOuterDataService","func":"getForeignHistory","context":{"userId":""}}'
    content = get_content_dict(url, data)
    data_area = content['args']['rsp']
    return data_area

#获取全球累计数据：自一月二十八日
def get_summary_history():
    data_area = get_content()
    summary_all_days = data_area['summaryHistory']
    print('自2020年1月28日全球（不含中国）的疫情累计数据')
    mongodb = MongoPool()
    print('全球累计数据：正在写入数据库')
    for summary_everyday in summary_all_days:
        day = summary_everyday['newDay']
        # day = day.split('-')[0]+'年'+day.split('-')[1]+'月'+day.split('-')[2]+'日'
        confirm_all = summary_everyday['confirm']
        dead_all = summary_everyday['dead']
        heal_all = summary_everyday['heal']
        confirm_all_modify = summary_everyday['modifyConfirm']
        update_time = summary_everyday['updateTime']
        print(day)
        #heal_rate = summary_everyday['healRate']
        # data = Data(date=day, continent='全球', continent_eng='earth', country='除中国', country_eng='all_but_china', confirm_all=confirm_all, dead_all=dead_all, heal_all=heal_all, confirm_add=confirm_all_modify, update_time=update_time)
        # mongodb.insert_one(data)
    print('全球累计数据：写入数据库完毕')

#获取五个国家与地区的历史累计数据（为什么？是因为只有他们有完整的数据吗？）
def get_five_country_history():
    data_area = get_content()
    five_country_history = data_area['totalHistorys']
    country_list = []
    for country in five_country_history:
        country_list.append(country)
    for country in country_list:
        print('正在获取国家信息：'+country)
        #获取国家对应的英文名、大洲中英文名
        country_info = find_country_info(country=country)
        country_history = five_country_history[country]
        if country_info != None:
            country_en = country_info.country_en
            continent = country_info.continent
            continent_en = country_info.continent_en
        else:
            country_en = str(None)
            continent = str(None)
            continent_en = str(None)
        mongo = MongoPool()
        print('正在写入数据库')
        for everyday_history in country_history:
            day = everyday_history['newDay']
            confirm_all = everyday_history['confirm']
            dead_all = everyday_history['dead']
            heal_all = everyday_history['heal']
            confirm_all_modify = everyday_history['modifyConfirm']
            heal_rate = heal_all / confirm_all
            heal_rate = round(heal_rate, 4)
            update_time = everyday_history['updateTime']
            # data = Data(date=date, country=country, country_eng=country_en, continent=continent, continent_eng=continent_en, confirm_all=confirm_all, \
            #             dead_all=dead_all, heal_all=heal_all, confirm_add=confirm_all_modify)
            # mongo.insert_one(data)
            print('国家：'+country+'信息写入数据库完毕')
            print('日期:'+day+country+'\t累计确诊:'+str(confirm_all)+'\t累计死亡:'+str(dead_all)+'\t累计治愈:'+str(heal_all)+'\t治愈率:'+str(heal_rate)+'\t累计确诊较昨日变化:'+str(confirm_all_modify)+'\t更新日期:'+update_time)


def main():
    get_five_country_history()

if __name__ == '__main__':
    main()