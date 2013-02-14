import requests
import json

from pprint import pprint

# tmpl = "http://cloudetek.appspot.com/api/v2.0/event?apikey=agljbG91ZGV0ZWtyIwsSCUFwaUtleURBTyIUd3d3Lm1hcmlib3IyMDEyLmluZm8M&pageSize=3000&fs=light&from=2012-%02d-01+00%%3A00%%3A00+%%2B0200&_=1347481693646"

# for i in range(1,13):
# 	url = tmpl % i
# 	print url

# 	r = requests.get(url)
# 	data = r.json

# 	# print data

# 	f = open('data%s.json' % i, 'w')
# 	f.write(json.dumps(data))
# 	f.close()

# 	# break


seen = []
evts = []
types = []

order = []

for i in range(1,13):
	data = json.loads(open('data%s.json' % i).read())

	if not order:
		for el in data['list'][0]:
			print el+"\t",
			if el != "description":
				order.append(el)


	for event in data['list']:
		if event.get('id') not in seen:
			seen.append( event.get('id') )
			evts.append(event)

			for t in event['types']:
				if t not in types:
					types.append(t)
			
			# pprint(event)
			# break
			for el in order:
				if event.get(el):
					print [event[el]]
					# print unicode(event[el]).encode('utf-8')+"\t",
			print "\n",

# pprint(evts)
# print types

f = open('epk2012.json', 'w')
f.write(json.dumps(evts))
f.close()



from collections import namedtuple

csv.read()

seznam =[12,45,3,5,7,23,5]

jabuk = seznam[3]
neki = seznam[6]


drevo = namedtuple('Drevo', vrsta, neki, neki)
drevo.vrsta = seznam[3]



# print "neki %s neki %s" % (drevo.vrsta, drevo.neki)
# print "neki %s neki %s" % (seznam[2], str(int(seznam[4])))

# print "neki %{vrsta} neki %{neki}" % (**drevo)


