import re
from utils.log import logger
from core.Data import Data
from core.database.database import MongoPool

"""
注意！！！
现有匹配规则适合2020年5月30日之后的国家卫健委通报
"""

#对卫健委的文本进行处理，将其有效文本段构成列表结构
def get_content_to_list(content):
    content_list = content
    return content_list

def get_text_from_list(text_list):
    text = ''
    if len(text_list) != 1:
        for i in text_list:
            text += i
    else:
        text = text_list[0]
    return text

def handel_new_add(text_list):
    print('正在处理新增数据')
    text = get_text_from_list(text_list)
    #获取所有有关新增数据的文本
    #将文本通过‘。’‘；’分离，获取不同类型的新增数据：新增确诊、新增死亡、新增疑似、新增治愈
    diff_add_list = re.split('。|；', text)
    confirm_add = 0
    heal_add = 0
    dead_add = 0
    suspect_add = 0
    for i in diff_add_list:
        if re.search('新增治愈', i) and not re.search('新增确诊', i):
            for j in i.split('，'):
                if re.search('新增治愈', j):
                    if re.search('\d+', j):
                        heal_add = re.findall('\d+', j)[0]
                if re.search('新增死亡', j):
                    if re.search('\d+', j):
                        dead_add = re.findall('\d+', j)[0]
            continue
        #多一个判断条件是因为国家卫健委的表述有变化
        #出现在2020年3月20日左右,下面类似
        if re.search('新增疑似', i) and not re.search('新增确诊', i):
            for j in i.split('，'):
                if re.search('新增疑似', j):
                    if re.search('\d+', j):
                        suspect_add = re.findall('\d+', j)[0]
                if re.search('新增死亡', j):
                    if re.search('\d+', j):
                        dead_add = re.findall('\d+', j)[0]
            continue
        if re.search('新增死亡', i) and not re.search('新增确诊', i):
            for j in i.split('，'):
                if re.search('新增死亡', j):
                    if re.search('\d+', j):
                        dead_add = re.findall('\d+', j)[0]
            continue
        if re.search('新增确诊', i):
            for j in i.split('，'):
                if re.search('新增确诊', j):
                    if re.search('\d+', j):
                        confirm_add = [i for i in re.findall('\d+', j) if i != '31'][0].__str__()
                if re.search('新增死亡', j):
                    if re.search('\d+', j):
                        dead_add = re.findall('\d+', j)[0]
                if re.search('新增疑似', j):
                    if re.search('\d+', j):
                        suspect_add = re.findall('\d+', j)[0]
                if re.search('新增治愈', j):
                    if re.search('\d+', j):
                        heal_add = re.findall('\d+', j)[0]
    return confirm_add, heal_add, dead_add, suspect_add

#获取境外输入相关数据
def handel_import_now_and_all(text_list):
    print('正在处理境外输入数据')
    text  = get_text_from_list(text_list)
    import_now = 0
    import_all = 0
    import_heal = 0
    import_dead = 0
    for data in re.split('（|，|。', text):
        if re.search('现有确诊', data):
            if re.search('\d+', data):
                import_now = re.findall('\d+', data)[0]
            continue
        if re.search('累计确诊', data) or re.search('累计报告', data):
            if re.search('\d+', data):
                import_all = re.findall('\d+', data)[0]
            continue
        if re.search('累计治愈', data):
            if re.search('\d+', data):
                import_heal = re.findall('\d+', data)[0]
            continue
        if re.search('死亡', data):
            if re.search('\d+', data):
                import_dead = re.findall('\d+', data)[0]
    return import_now, import_all, import_heal, import_dead

#获取现存以及历史累计数据
def handel_now_and_all(text_list):
    print('正在处理现存和累计数据')
    text = get_text_from_list(text_list)
    comfirm_now = 0
    comfirm_all = 0
    dead_all = 0
    heal_all = 0
    toucher_all = 0
    toucher_now = 0
    suspect_now = 0
    for data in re.split('（|，|。', text):
        if re.search('现有确诊', data):
            if re.search('\d+', data):
                comfirm_now = re.findall('\d+', data)[0]
            continue
        if re.search('累计报告确诊', data):
            if re.search('\d+', data):
                comfirm_all = re.findall('\d+', data)[0]
            continue
        if re.search('累计死亡', data):
            if re.search('\d+', data):
                dead_all = re.findall('\d+', data)[0]
            continue
        if re.search('现有疑似', data):
            if re.search('\d+', data):
                suspect_now = re.findall('\d+', data)[0]
            continue
        if re.search('累计治愈', data):
            if re.search('\d+', data):
                heal_all = re.findall('\d+', data)[0]
            continue
        if re.search('累计追踪', data):
            if re.search('\d+', data):
                toucher_all = re.findall('\d+', data)[0]
            continue
        if re.search('医学观察', data):
            if re.search('\d+', data):
                toucher_now = re.findall('\d+', data)[0]
    return comfirm_now, comfirm_all, dead_all, heal_all, toucher_all, toucher_now, suspect_now

#无症状相关数据提取
def handel_now_noinfect(text_list):
    print('正在处理无症状数据')
    text = get_text_from_list(text_list)
    diff_list = re.split('。|；|（|）', text)
    noinfect_add = 0
    noinfect_to_confirm = 0
    noinfect_exit = 0
    noinfect_now = 0
    for i in diff_list:
        if re.search('新增无症状', i):
            if re.search('\d+', i):
                noinfect_add = re.findall('\d+', i)[0]
                continue
        elif re.search('转为确诊', i):
            if re.search('\d+', i):
                noinfect_to_confirm = re.findall('\d+', i)[0]
                continue
        elif re.search('解除医学观察',i):
            if re.search('\d+',i):
                noinfect_exit = re.findall('\d+', i)[0]
                continue
        elif re.search('尚在医学观察', i):
            if re.search('\d+', i):
                noinfect_now = re.findall('\d+', i)[0]
    return noinfect_add, noinfect_to_confirm, noinfect_exit, noinfect_now

#获取港澳台相关数据
def handel_HK_TW_MC(text_list):
    print('正在处理港澳台数据')
    text = get_text_from_list(text_list)
    diff_list = re.split('）|。|：', text)
    HK_confirm = 0
    HK_heal = 0
    HK_dead = 0
    MC_confirm = 0
    MC_heal = 0
    MC_dead = 0
    TW_confirm = 0
    TW_heal = 0
    TW_dead = 0
    for area_data in diff_list:
        if re.search('香港',area_data):
            for data in re.split('（|，', area_data):
                if re.search('香港', data):
                    if re.search('\d+', data):
                        HK_confirm = re.findall('\d+', data)[0]
                        continue
                if re.search('出院', data):
                    if re.search('\d+', data):
                        HK_heal = re.findall('\d+', data)[0]
                        continue
                if re.search('死亡', data):
                    if re.search('\d+', data):
                        HK_dead = re.findall('\d+', data)[0]
        elif re.search('澳门',area_data):
            for data in re.split('（|，', area_data):
                if re.search('澳门', data):
                    if re.search('\d+', data):
                        MC_confirm = re.findall('\d+', data)[0]
                        continue
                if re.search('出院', data):
                    if re.search('\d+', data):
                        MC_heal = re.findall('\d+', data)[0]
                        continue
                if re.search('死亡', data):
                    if re.search('\d+', data):
                        MC_dead = re.findall('\d+', data)[0]
        elif re.search('台湾', area_data):
            for data in re.split('（|，|\(', area_data):
                if re.search('台湾', data):
                    if re.search('\d+', data):
                        TW_confirm = re.findall('\d+', data)[0]
                    continue
                if re.search('出院', data):
                    if re.search('\d+', data):
                        TW_heal = re.findall('\d+', data)[0]
                    continue
                if re.search('死亡', data):
                    if re.search('\d+', data):
                        TW_dead = re.findall('\d+', data)[0]
    return HK_confirm, HK_heal, HK_dead, MC_confirm, MC_heal, MC_dead, TW_confirm, TW_heal, TW_dead

'''
处理文本列表
将文本列表分类：新增、累计和现有、境外输入、无症状、港澳台
通过正则匹配进行文本处理
这里可以采用AI对文本分析，然而技术不够
'''
def handel_content(content, date):
    content_list = get_content_to_list(content)
    add_list = []
    import_list = []
    now_and_all_list = []
    noinfect_list = []
    HK_TW_MC = []
    mongo = MongoPool()
    origin_content = ''
    for i in content:
        origin_content += i+'\n'
    #开始文本正则匹配
    for text in content_list:
        if re.search('\d+月\d+日', text) and not re.search('报告境外输入', text):
            #提取日期
            if re.search('新增确诊', text):
                add_list.append(text)
            elif re.search('现有确诊', text) or re.search('累计报告确诊',text):
                now_and_all_list.append(text)
            continue
            #移除已经处理过的列表元素
        elif re.search('新增治愈',text) and not re.search('武汉', text):
            add_list.append(text)
            continue
        elif re.search('无症状感染者', text):
            noinfect_list.append(text)
            continue
        elif re.search('港澳台', text):
            HK_TW_MC.append(text)
            continue
        elif re.search('境外输入', text):
            import_list.append(text)
            continue
        elif re.search('武汉', text):
            print('湖北省数据，不在国家卫健委数据获取范围内')
            continue
        else:
            logger.error('无法匹配的文本'+text)
    print(date+'数据处理完毕,正在写入数据库')
    confirm_add, heal_add, dead_add, suspect_add = handel_new_add(add_list)
    noinfect_add, noinfect_to_confirm, noinfect_exit, noinfect_now = handel_now_noinfect(noinfect_list)
    HK_confirm, HK_heal, HK_dead, MC_confirm, MC_heal, MC_dead, TW_confirm, TW_heal, TW_dead = handel_HK_TW_MC(HK_TW_MC)
    import_now, import_all, import_heal, import_dead = handel_import_now_and_all(import_list)
    confirm_now, confirm_all, dead_all, heal_all, toucher_all, toucher_now, suspect_now = handel_now_and_all(now_and_all_list)
    if int(confirm_all) == 0:
        print('爬虫已被封禁，请稍后再试')
        exit(1)
    data = Data(date=date, confirm_add=confirm_add, heal_add=heal_add, dead_add=dead_add, suspect_add=suspect_add, noinfect_add=noinfect_add, noinfect_now=noinfect_now, \
                noinfect_to_confirm=noinfect_to_confirm, noinfect_exit=noinfect_exit, input_all=import_all, input_now=import_now, input_dead=import_dead, input_heal=import_heal, \
                confirm_now=confirm_now, confirm_all=confirm_all, dead_all=dead_all, heal_all=heal_all, toucher_all=toucher_all, toucher_now=toucher_now, \
                suspect_now=suspect_now, content=origin_content)
    data_HK = Data(date=date, province='香港', confirm_all=HK_confirm, heal_all=HK_heal, dead_all=HK_dead, content=origin_content)
    data_TW = Data(date=date, province='台湾', confirm_all=TW_confirm, heal_all=TW_heal, dead_all=TW_dead, content=origin_content)
    data_MC = Data(date=date, province='澳门', confirm_all=MC_confirm, heal_all=MC_heal, dead_all=MC_dead, content=origin_content)
    mongo.insert_one(data)
    mongo.insert_one(data_HK)
    mongo.insert_one(data_TW)
    mongo.insert_one(data_MC)
    print(date+'数据库写入完毕')


