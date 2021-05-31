from core.spider.tenxun_source.chinaTotal import get_china_total
from core.spider.tenxun_source.chinaTotal import get_foreign_total
from core.spider.tenxun_source.get_area_info import get_area_info
from core.spider.tenxun_source.get_area_info import get_60days_history_total
from core.spider.tenxun_source.get_foreign_history import get_summary_history
from core.spider.tenxun_source.get_foreign_history import get_five_country_history
from core.spider.tenxun_source.get_foreign_info import get_country_info_from_continent
from core.spider.tenxun_source.get_hubei_info import get_china_history_total
from core.spider.tenxun_source.get_hubei_info import get_hubei_history_total
from core.spider.tenxun_source.get_province_data import get_province_data
from core.spider.tenxun_source.get_province_data import get_city_data


if __name__ == '__main__':
    #国外累计数据
    get_foreign_total()
    #中国累计数据
    get_china_total()
    #各省份今日历史累计数据
    get_area_info()
    #中国过去60天历史累计数据
    get_60days_history_total()
    #全球自1月28日的历史累计数据
    get_summary_history()
    #五个国家的60天内每天的历史累计数据，为什么是这五个国家暂时不知
    #这五个国家的数据最开始的从1月28日开始记录的，由于前段时间爬虫没有运行，导致现在只能获取60天内的数据
    get_five_country_history()
    #获取各大洲总体数据以及该大洲各个国家的数据
    get_country_info_from_continent()
    #中国累计数据：来源不同
    get_china_history_total()
    #湖北省累计数据
    get_hubei_history_total()
    #获取各省份历史数据以及各城市今日数据
    with open('../province.txt', 'r') as f:
        for province in f.readlines():
            province = province.strip()
            print(province+'省 数据正在写入数据库')
            get_province_data(province)
            print(province+'省 地级市数据正在写入数据库')
            get_city_data(province)
