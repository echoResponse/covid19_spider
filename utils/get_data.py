import time

def get_date_time():
    day = time.strftime('%Y年%m月%d日')
    return day

def format_date(date):
    src_date= str(date)
    year = str(2020)
    month = str(src_date.split('.')[0])
    day = str(src_date.split('.')[1])
    date = year+'年'+month+'月'+day+'日'
    return date
