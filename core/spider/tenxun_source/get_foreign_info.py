from core.spider.tenxun_source.get_post_json import get_content_dict
from utils.get_country_and_continent import find_country_info
from utils.get_data import get_date_time
from core.database.database import MongoPool
from core.Data import Data

#获取有效数据区域
def get_data_area():
    url = 'https://wechat.wecity.qq.com/api/THPneumoniaOuterDataService/getForeignInfo'
    data = '{"args":{"req":{"none":"none"}},"service":"THPneumoniaOuterDataService","func":"getForeignInfo","context":{"userId":""}}'
    content = get_content_dict(url, data)
    data_area = content['args']['rsp']
    date = data_area['recentTime']
    print('最近更新时间：' + date)
    return data_area

#获取大洲总体信息,返回生成器
def get_every_continentTotal(data_area):
    continent_all_info = data_area['continentTotal']
    mongo = MongoPool()
    for continent in continent_all_info:
        name = continent['continentName']
        print('获取大洲信息: '+name)
        continent_info  = continent['continentInfo']
        all_country_info = continent['foreignInfo']
        confirm_total = continent_info['confirm']
        dead_total = continent_info['dead']
        heal_total = continent_info['heal']
        continent_info = find_country_info(continent=name)
        if continent_info == None:
            continent_en = str(None)
        else:
            continent_en = continent_info.continent_en
        # print('大洲统计数据正在写入数据库:\t'+name+'\t'+continent_en)
        # date = get_date_time()
        # data = Data(date=date, continent=name, continent_eng=continent_en, confirm_all=confirm_total, dead_all=dead_total, heal_all=heal_total, country=None, country_eng=None)
        # mongo.insert_one(data)
        print('大洲统计数据写入数据库完毕:\t'+name+'\t'+continent_en)
        all_country_info = [all_country_info, name, continent_en]
        yield all_country_info

#获取每个大洲的信息，提取大洲每个国家的信息
def get_country_info_from_continent():
    data_area = get_data_area()
    all_country_info = get_every_continentTotal(data_area)
    mongo = MongoPool()
    for country_infos in all_country_info:
        continent = country_infos[1]
        continent_en = country_infos[2]
        country_infos = country_infos[0]
        for country_info in country_infos:
            country_name = country_info['country']
            print('国家信息正在写入数据库：' + country_name)
            confirm_all = country_info['confirm']
            dead_all = country_info['dead']
            heal_all = country_info['heal']
            confirm_all_modify = country_info['modifyConfirm']
            dead_all_modify = country_info['modifyDead']
            heal_all_modify = country_info['modifyHeal']
            country_info = find_country_info(country_name)
            if country_info == None:
                country_en = str(None)
            else:
                country_en = country_info.country_en
                continent = country_info.continent
                continent_en = country_info.continent_en
            date = get_date_time()
            # data = Data(date=date, country=country_name, country_eng=country_en, continent=continent, continent_eng=continent_en, \
            #             confirm_all=confirm_all, dead_all=dead_all, heal_all=heal_all, confirm_add=confirm_all_modify, dead_add=dead_all_modify, heal_add=heal_all_modify)
            # mongo.insert_one(data)
            print('国家信息正在写入数据库完毕：' + country_name)
            print(country_name+'\t\t\t累计数据：')
            print('累计确诊:'+str(confirm_all)+'\t累计死亡:'+str(dead_all)+'\t累计治愈:'+str(heal_all))
            print(country_name+'\t\t\t累计较昨日变化数据：')
            print('确诊:'+str(confirm_all_modify)+'\t死亡:'+str(dead_all_modify)+'\t治愈:'+str(heal_all_modify))
            print()
        print('\n\n\n')


def get_every_country():
    data_area = get_data_area()
    all_country_info = data_area['foreignTotal']
    for country_info in all_country_info:
        country_name = country_info['country']
        confirm_all = country_info['confirm']
        dead_all = country_info['dead']
        heal_all = country_info['heal']
        confirm_all_modify = country_info['modifyConfirm']
        dead_all_modify = country_info['modifyDead']
        heal_all_modify = country_info['modifyHeal']
        # print('国家:'+country_name+'\t累计确诊:'+str(confirm_all)+'\t累计死亡:'+str(dead_all)+'\t累计治愈:'+str(heal_all)+'\t累计新增确诊:'+str(confirm_all_modify)+'\t累计新增死亡:'+str(dead_all_modify)+'\t累计新增治愈:'+str(heal_all_modify))
        country_info = find_country_info(country_name)
        if country_info == None:
            country_en = str(None)
            continent = str(None)
            continent_en = str(None)
        else:
            country_en = country_info.country_en
            continent = country_info.continent
            continent_en = country_info.continent_en
        print('国家信息：'+country_name+'\t'+country_en+'\t'+continent+'\t'+continent_en)

def main():
    get_data_area()

if __name__ == '__main__':
    main()