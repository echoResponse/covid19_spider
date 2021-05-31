from core.spider.wangyi_source.get_area_id import MongoAreaInfo


mongo = MongoAreaInfo()
area_js_str = 'var provinceArr = [];\n'
i = 0
with open('/root/covid/core/spider/province.txt', 'r') as f:
    for line in f.readlines():
        area_js_str+='provinceArr['+str(i)+'] = [\''+line.strip()+'\'];\n'
        i+=1

area_js_str+='var cityArr = [];\n'
with open('/root/covid/core/spider/province.txt', 'r') as f:
    i=0
    for line in f.readlines():
        province = line.strip()
        area_js_str+='cityArr['+str(i)+'] = [\''+province+'\','
        mongo = MongoAreaInfo()
        conditions = {'country_name':'中国', 'province_name':province}
        data = mongo.find(conditions)
        for j in data:
            if j.city_name:
                area_js_str+='\''+j.city_name+'\','
        area_js_str+='];\n'
        i+=1

with open('/root/covid/core/web/myapp/app/static/js/china_area.js', 'w') as f:
    f.write(area_js_str)