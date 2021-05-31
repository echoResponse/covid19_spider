from lxml import etree
with open('四川.html', 'r') as f:
    content = f.read()

html = etree.HTML(content)
script1 = html.xpath('//head/script[1]/text()')[0]
script2 = html.xpath('//head/script[2]/text()')[0]
print(script2)
