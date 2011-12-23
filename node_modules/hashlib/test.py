#/usr/bin/env python
import hashlib
import datetime

m1=datetime.datetime.now()
for i in range(0,100000):
	h=hashlib.md5('EdPy2H71Q1MjTzkuRxAr1CJWs2ZapZEuaY3XwJL8mpxaTBLWZPkw1yakKLv2r79eHmNQ1m2Cc6PErAkH5FR3Nmd011F09LCas76Z'+str(i))
	h=h.hexdigest()
m2=datetime.datetime.now()

print(m2-m1)
