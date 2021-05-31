from core.spider import Jiangxi_Mongo
import re

#从数据库中获取江西省卫健委历史疫情文章
def sort_content():
    mongo = Jiangxi_Mongo()
    for year in (2020, 2021):
        for month in range(1, 13):
            for day in range(1, 32):
                if year==2021 and month==1 and day > 2:
                    exit(0)
                date = str(year)+'年'+str(month)+'月'+str(day)+'日'
                condition = {'date':date}
                if mongo.find(conditions=condition):
                    yield date, mongo.find(conditions=condition)[0].content

def handel_content(content):
    content_list = re.split('\n|。', content)
    confirm_add = '0'
    dead_add = '0'
    heal_add = '0'
    import_add = '0'
    suspect_add = '0'
    for i in content_list:
        if i == '\n' or re.search('江西省卫生健康委员会', i) or len(i) == 0:
            continue
        #处理省总体新增数据
        print(i)
        # if re.search('新增.*确诊病例', i) and re.search('江西省', i):
        #     for info in re.split('，', i):
        #         if re.search('新增.*确诊', info):
        #             if re.search('\d+', info):
        #                 confirm_add = re.findall('\d+', info)[0]
        #         elif re.search('新增.*疑似', info):
        #             if re.search('\d+', info):
        #                 suspect_add = re.findall('\d+', info)[0]
        #         elif re.search('新增.*治愈', info) or re.search('新增.*出院', info):
        #             if re.search('\d+', info):
        #                 heal_add = re.findall('\d+', info)[0]
        #         elif re.search('新增.*死亡', info):
        #             if re.search('\d+', info):
        #                 dead_add = re.findall('\d+', info)[0]
        #         elif re.search('境外', info):
        #             if re.search('\d+', info):
        #                 import_add = re.findall('\d+', info)[0]
        #处理各地市新增情况


def run():
    for date, content in sort_content():
        handel_content(content)
run()