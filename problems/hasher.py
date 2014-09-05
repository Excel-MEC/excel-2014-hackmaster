import hashlib
import sys

print "To be hashed(sha1->md5)",str(sys.argv[1])
s = sys.argv[1]
x = hashlib.sha1(s).hexdigest()
y = hashlib.md5(x).hexdigest()

print y
