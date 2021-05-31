import requests
from core.settings import userAgent
import random
import re
from lxml import etree
from core.spider.jxs_wjw.database import Jiangxi_Mongo
from core.spider.jxs_wjw.database import Jiangxi_data


def get_page_url():
    url = 'http://hc.jiangxi.gov.cn/module/web/jpage/dataproxy.jsp?startrecord=1&endrecord=45&perpage=15'
    data = 'col=1&webid=221&path=http%3A%2F%2Fhc.jiangxi.gov.cn%2F&columnid=38268&sourceContentType=1&unitid=368486&webname=%E6%B1%9F%E8%A5%BF%E7%9C%81%E5%8D%AB%E7%94%9F%E5%81%A5%E5%BA%B7%E5%A7%94%E5%91%98%E4%BC%9A&permissiontype=0'
    headers = {
        'Accept': 'application/xml, text/xml, */*; q=0.01',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Connection': 'keep-alive',
        'Content-Length': '219',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': 'JSESSIONID=D35E77B28F9E29AE4FD4ECAA2D2EA17F; yfx_c_g_u_id_10000015=_ck20112216503317374539179186559; yfx_key_10000015=; yfx_mr_10000015=%3A%3Amarket_type_free_search%3A%3A%3A%3Abaidu%3A%3A%3A%3A%3A%3A%3A%3Awww.baidu.com%3A%3A%3A%3Apmf_from_free_search; BIGipServerSZF-jiyuehua-10.4.81.17-20-80=290522122.20480.0000; zh_choose_221=s; yfx_f_l_v_t_10000015=f_t_1606035033729__r_t_1609585772780__v_t_1609596154507__r_c_1',
        'DNT': '1',
        'Host': 'hc.jiangxi.gov.cn',
        'Origin': 'http://hc.jiangxi.gov.cn',
        'Referer': 'http://hc.jiangxi.gov.cn/col/col38268/index.html?uid=368486&pageNum=12',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
    }

    response = requests.post(url, headers=headers, data=data)
    content = response.content.decode()
    all_record = re.split('<totalrecord>|</totalrecord>', content)[1]
    print('共有\t'+all_record+'\t项数据')
    all_record = int(all_record)
    global count
    count = int(all_record/45) + 1
    while count != 0:
        end = 45*count
        start = end - 44
        if end > all_record:
            end = all_record
        count -= 1
        url = 'http://hc.jiangxi.gov.cn/module/web/jpage/dataproxy.jsp?startrecord='+str(start)+'&endrecord='+str(end)+'&perpage=15'
        response = requests.post(url, headers=headers, data=data)
        content = response.content.decode()
        single_list = re.split('<record>|</record>', content)
        for single in single_list:
            if re.search('\d+年\d+月\d+日', single):
                info = re.findall("a href='.*'", single)[0]
                info = info.split("'")
                href = info[1]
                title = info[3]
                # print(href+'\t'+title)
                yield href, title

def get_content_from_url(url):
    headers = {
        'User-Agent':random.choice(userAgent),
    }
    response = requests.get(url, headers=headers)
    content = response.content.decode()
    html = etree.HTML(content)
    global text
    text = ''
    for i in html.xpath('//div[@id="zoom"]/p'):
        if len(i.xpath('./text()')) == 0:
            continue
        text += i.xpath('./text()')[0]+'\n'
    return text
    # print(content)

def run():
    mongo = Jiangxi_Mongo()
    for url, title in get_page_url():
        print('正在获取信息：'+title)
        content = get_content_from_url(url)
        date = re.findall('\d+年\d+月\d+日', title)[0]
        data = Jiangxi_data(date=date, title=title, content=content)
        print(date+'\t写入数据库')
        mongo.insert_one(data)
        # print(content)

run()