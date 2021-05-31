from core.spider.tenxun_source.get_post_json import get_content_dict

def  get_title(data_area):
    title = data_area['addNoShowText']
    confirm_total = data_area['confirm']
    dead_total = data_area['dead']
    print('国外疫情数据:'+title+'\n累计确诊:'+str(confirm_total)+'\t累计死亡:'+str(dead_total))

def get_foreign_total(data_area):
    data_area = data_area['foreignTotal']
    confirm_total = data_area['confirm']
    dead_total = data_area['dead']
    heal_total = data_area['heal']
    confirm_now = data_area['nowConfirm']
    print('国外疫情累计数据')
    print('累计确诊:'+str(confirm_total)+'\t累计死亡:'+str(dead_total)+'\t累计治愈:'+str(heal_total)+'\t现存确诊:'+str(confirm_now))

def get_foreign_total_modify(data_area):
    data_area = data_area['foreignDayModify']
    confirm_modify = data_area['confirm']
    dead_modify = data_area['dead']
    heal_modify = data_area['heal']
    confirm_now_modify = data_area['nowConfirm']
    print('国外疫情累计较昨日变化数据：')
    print('累计确诊:'+str(confirm_modify)+'\t累计死亡:'+str(dead_modify)+'\t累计治愈:'+str(heal_modify)+'\t现存确诊:'+str(confirm_now_modify))

def main():
    url = 'https://wechat.wecity.qq.com/api/THPneumoniaOuterDataService/getForeignTotal'
    data = '{"args":{"req":{"none":"none"}},"service":"THPneumoniaOuterDataService","func":"getForeignTotal","context":{"userId":""}}'
    dic = get_content_dict(url, data)
    data_area = dic['args']['rsp']['data']
    date = data_area['foreignTotalUpdateTime']
    print('更新时间：'+date)
    get_title(data_area)
    get_foreign_total(data_area)
    get_foreign_total_modify(data_area)

if __name__ == '__main__':
    main()