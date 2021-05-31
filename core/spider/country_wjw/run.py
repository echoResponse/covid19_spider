from core.spider.country_wjw.weijianwei import get_content_and_date
from core.spider.country_wjw.get_data_from_content import handel_content

def run():
    print('国家卫健委数据获取开始：')
    for content, date in get_content_and_date():
        print('获取时间：'+date)
        handel_content(content, date)

run()
