
##获取post方式返回json的通用方法
import requests
import random
from core.settings import userAgent
import ast

#构造随机请求头
def get_random_header():
    user_agent = random.choice(userAgent)
    header = {}
    header['User-Agent'] = user_agent
    header['Content-Type'] = 'application/json;charset=UTF-8'
    return header

def get_post_json(url, data):
    response = requests.post(url, headers=get_random_header(), data=data)
    content = response.content.decode()
    return content

def str_to_dict(content):
    print(content)
    return ast.literal_eval(content)

def get_content_dict(url, data):
    content = get_post_json(url, data)
    return str_to_dict(content)
