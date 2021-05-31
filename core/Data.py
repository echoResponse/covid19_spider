###定义每一条数据的内容、含义
'''
实现数据类，定义数据内容
continent：大洲
continent_eng：大洲英文名称
country：国家
ocuntry_eng：国家英文名称
province：省份
province_code：省份代码
city：城市
city_code：城市代码
confirm_all：累计确诊
dead_all：累计死亡
heal_all：累计治愈
input_all：累计境外输入
toucher_all: 累计追踪到的密切接触者
toucher_now: 尚在医学观察的密切接触者
confirm_now：现存确诊
input_add：新增境外输入
suspect_now：现存疑似
noinfect_now：现存无症状
noinfect_to_confirm: 无症状转为确诊
noinfect_exit: 无症状解除医学观察
noinfect_add: 新增无症状
confirm_add: 新增确诊
dead_add: 新增死亡
heal_add: 新增治愈
suspect_add: 新增疑似
severe_add：新增重症
severe_all：累计重症
update_time：更新时间
confirm_now_add：现存确诊新增
'''

class Data():
    def __init__(self, date=None, continent_name=None, continent_eng=None, country_name=None, country_eng=None, country_id=None,province_name=None, \
                 province_id=None, city_name=None, city_id=None, confirm_all=None, dead_all=None, heal_all=None, \
                 input_all=None, confirm_now=None, input_add=None, suspect_all=None, noinfect_now=None, confirm_add=None, dead_add=None, heal_add=None, suspect_add=None, \
                 toucher_all=None, toucher_now=None, noinfect_add=None, noinfect_to_confirm=None, noinfect_exit=None, severe_add=None, severe_all=None, update_time=None, confirm_now_add=None):
        self.date = date
        self.continent_name=continent_name
        self.continent_eng = continent_eng
        self.country_name = country_name
        self.country_eng = country_eng
        self.country_id = country_id
        self.province_name = province_name
        self.province_id = province_id
        self.city_name = city_name
        self.city_id = city_id
        self.confirm_all = confirm_all
        self.dead_all = dead_all
        self.heal_all = heal_all
        self.input_all = input_all
        self.confirm_now = confirm_now
        self.confirm_now_add = confirm_now_add
        self.input_add = input_add
        self.suspect_all  = suspect_all
        self.noinfect_now = noinfect_now
        self.confirm_add = confirm_add
        self.dead_add = dead_add
        self.heal_add = heal_add
        self.suspect_add = suspect_add
        self.toucher_all = toucher_all
        self.toucher_now = toucher_now
        self.noinfect_add = noinfect_add
        self.noinfect_to_confirm = noinfect_to_confirm
        self.noinfect_exit = noinfect_exit
        self.severe_add = severe_add
        self.severe_all = severe_all
        self.update_time = update_time

    #返回字符串
    def __str__(self):
        return str(self.__dict__)