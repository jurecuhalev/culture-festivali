#!/usr/bin/env python

import requests

#r = requests.get('http://www.culture.si/en/Special:Ask/-5B-5BCategory:Festivals-5D-5D-0A-5B-5BCategory:INFOBOX_DONE-5D-5D/-3FFrequency/-3FOrganised-20by/-3FWebsite/-3FEmail/-3FTelephone/-3FStreet/-3FTown/-3FDuration_weeks/format%3Djson/sep%3D,/headers%3Dshow/limit%3D500')
r = requests.get('http://www.culture.si/en/Special:Ask/-5B-5BCategory:Festivals-5D-5D-0A-5B-5BCategory:NODEPO-5D-5D/-3FFrequency/-3FOrganised-20by/-3FWebsite/-3FEmail/-3FTelephone/-3FStreet/-3FTown/-3FDuration_weeks/-3FCategory/format%3Djson/sep%3D,/headers%3Dshow/limit%3D500')
f = open('data.json', 'wb')
f.write(r.content.encode('utf-8'))
f.close()



# Architecture + Design = Architecture & Design
# Dance + Theather = Theatre & Theatre
# New media art + Visual arts = New media & Visual arts
# Film
# Literature
# Music
# Combined (dve ali vec kategorij)