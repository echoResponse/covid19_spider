import asyncio
from pyppeteer import launch
from bs4 import BeautifulSoup
import re

###获取国家卫健委网页内容信息，由于网页加密以及过多跳转
#这里采用浏览器模拟方式进行内容爬取
'''
注意：
在pyppeteer\launcher.py中将以下行注释，否则无法打开网页
--enable-automation
'''
async def pyppteer_fetchUrl(url):
    browser = await launch({'headless': False, 'dumpio': True, 'autoClose': True, 'args':['--no-sandbox']})
    page = await browser.newPage()

    await page.goto(url)
    await asyncio.wait([page.waitForNavigation()])
    str = await page.content()
    await browser.close()
    return str


def fetchUrl(url):
    return asyncio.get_event_loop().run_until_complete(pyppteer_fetchUrl(url))

def getPageUrl():
    for page in range(4,16):
        if page == 1:
            yield 'http://www.nhc.gov.cn/xcs/yqtb/list_gzbd.shtml'
        else:
            url = 'http://www.nhc.gov.cn/xcs/yqtb/list_gzbd_'+ str(page) +'.shtml'
            yield url


def getTitleUrl(html):
    bsobj = BeautifulSoup(html, 'html.parser')
    titleList = bsobj.find('div', attrs={"class": "list"}).ul.find_all("li")
    for item in titleList:
        link = "http://www.nhc.gov.cn" + item.a["href"];
        title = item.a["title"]
        #判断是否为疫情数据
        if not re.search('\d+月\d+日', title):
            continue
        date1 = re.findall('\d+月\d+日', title)[0]
        date2 = item.span.text
        date1_list = re.findall('\d+', date1)
        date2_list = date2.split('-')
        if int(date1_list[0]) == int(date2_list[1]):
            year = str(date2_list[0])
            month = str(date1_list[0])
            day = str(date1_list[1])
        elif int(date1_list[0]) != 12 and int(date1_list[1]) != 31:
            year = str(date2_list[0])
            month = str(date1_list[0])
            day = str(date1_list[1])
        else:
            year = str(int(date2_list[0])-1)
            month = str(date1_list[0])
            day = str(date1_list[1])
        if len(month) == 1:
            month = '0'+month
        if len(day) == 1:
            day = '0' + day
        date = year+'年'+month+'月'+day+'日'
        print(date)
        yield title, link, date


def getContent(html):
    bsobj = BeautifulSoup(html, 'html.parser')
    cnt = bsobj.find('div', attrs={"id": "xw_box"}).find_all("p")
    s = []
    if cnt:
        for item in cnt:
            s.append(item.text.strip('\n').strip())
        return s

    return "爬取失败！"


def get_content_and_date():
    for url in getPageUrl():
        s = fetchUrl(url)
        for title, link, date in getTitleUrl(s):
            print(title, link)
            html = fetchUrl(link)
            content = getContent(html)
            yield content, date
