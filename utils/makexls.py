import requests
import json
import datetime
import time

from xlwt import *

w = Workbook()
sheet = w.add_sheet('EPK2012')

seen = []
evts = []
types = []

order = []

r = 0
c = 0

for i in range(1,13):
    data = json.loads(open('data%s.json' % i).read())

    if not order:
        # for el in data['list'][0]:
        #     # print el+"\t",
        #     if el != "description":
        #         order.append(el)
        # order = [u'start', u'end', u'title', u'tags', u'types', u'venue', u'venueId', u'id', u'thumbUrl']

        order = ['date', 'title', 'month', 'city']

        for item in order:
            sheet.write(r, c, item)
            sheet.col(c).width = 2265 * len(item)

            c += 1
        r += 1
        print order

    for event in data['list']:
        if event.get('id') not in seen:
            seen.append( event.get('id') )
            evts.append(event)

            for t in event['types']:
                if t not in types:
                    types.append(t)
            
            # pprint(event)
            # break
            c = 0
            # for el in order:
            #     if event.get(el):
            #         sheet.write(r, c, unicode(event.get(el)))
            #     c += 1

            start = event.get('start')[0:10]
            sheet.write(r, 0, start)
            sheet.write(r, 1, event.get('title'))

            #"2012-08-01
            if '000113893' in event.get('tags'):
                month = 'Lent'
            else:
                start_date = datetime.datetime(*time.strptime(start, '%Y-%m-%d')[:6])
                month = start_date.strftime('%B')
            sheet.write(r, 2, month)

            if event.get('venue').get('city'):
                city = event.get('venue').get('city')
                sheet.write(r, 3, city)

            r += 1
                    # print [event[el]]
                    # print unicode(event[el]).encode('utf-8')+"\t",

w.save('epk2012 - data.xls')
# pprint(evts)
# print types

# f = open('epk2012.json', 'w')
# f.write(json.dumps(evts))
# f.close()