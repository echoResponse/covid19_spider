from core.database.database import MongoPool
from core.Data import Data
from utils.get_city_info import MongoProvince

def get_city_and_province_code(city):
    mongo_city = MongoProvince()
    condition = {'city':city}
    city_code = mongo_city.find(conditions=condition)[0].city_code
    return city_code

def get_province_code(province):
    mongo_province = MongoProvince()
    condition = {'province':province}
    province_code = mongo_province.find(conditions=condition)[0].province_code
    return province_code

date = '2020年02月04日'
province = '江西'
province_code = get_province_code(province)

data = Data(date=date, province=province, province_code=province_code, confirm_all='550', \
            confirm_add='72', toucher_all='13753', toucher_now='11391', confirm_now='523', heal_add='8',\
            heal_all='27')
data1 = Data(date=date, province=province, province_code=province_code, city='新余市', \
             city_code=get_city_and_province_code('新余市'), confirm_all='69', confirm_add='10',\
             confirm_now='65', heal_add='1', heal_all='4')
data2 = Data(date=date, province=province, province_code=province_code, city='宜春市', \
             city_code=get_city_and_province_code('宜春市'),confirm_now='44', confirm_add='3', \
             confirm_all='48', heal_all='4', heal_add='2')
data3 = Data(date=date, province=province, province_code=province_code, city='南昌市', \
             city_code=get_city_and_province_code('南昌市'), confirm_all='134', confirm_add='13',\
             confirm_now='127', heal_all='7', heal_add='3')
data4 = Data(date=date, province=province, province_code=province_code, city='吉安市', \
             city_code=get_city_and_province_code('吉安市'), confirm_all='15', confirm_add='0',\
             confirm_now='14', heal_all='1', heal_add='0')
data5 = Data(date=date, province=province, province_code=province_code, city='萍乡市', \
             city_code=get_city_and_province_code('萍乡市'), confirm_all='22',\
             confirm_now='21', confirm_add='2', heal_all='1', heal_add='0')
data6 = Data(date=date, province=province, province_code=province_code, city='赣州市', \
             city_code=get_city_and_province_code('赣州市'), confirm_now='48', confirm_add='6', \
             confirm_all='49', heal_all='1', heal_add='0')
data7 = Data(date=date, province=province, province_code=province_code, city='九江市', \
             city_code=get_city_and_province_code('九江市'), confirm_all='87', confirm_add='8',\
             confirm_now='85', heal_all='2', heal_add='0')
data8 = Data(date=date, province=province, province_code=province_code, city='景德镇市', \
             city_code=get_city_and_province_code('景德镇市'),confirm_now='3', confirm_add='0',\
             confirm_all='4', heal_all='1', heal_add='0')
data9 = Data(date=date, province=province, province_code=province_code, city='上饶市', \
             city_code=get_city_and_province_code('上饶市'),confirm_now='64', confirm_all='69', \
             confirm_add='19', heal_all='5', heal_add='1')
data10 = Data(date=date, province=province, province_code=province_code, city='鹰潭市', \
              city_code=get_city_and_province_code('鹰潭市'),confirm_now='9', confirm_add='1',\
              confirm_all='9')
data11= Data(date=date, province=province, province_code=province_code, city='抚州市', \
             city_code=get_city_and_province_code('抚州市'), confirm_all='44', confirm_add='10',\
             confirm_now='43', heal_all='1', heal_add='1')
mongo = MongoPool()
mongo.insert_one(data)
mongo.insert_one(data1)
mongo.insert_one(data2)
mongo.insert_one(data3)
mongo.insert_one(data4)
mongo.insert_one(data5)
mongo.insert_one(data6)
mongo.insert_one(data7)
mongo.insert_one(data8)
mongo.insert_one(data9)
mongo.insert_one(data10)
mongo.insert_one(data11)