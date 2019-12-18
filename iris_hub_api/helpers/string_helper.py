import hashlib


def get_hash(input_string):
    return hashlib.md5(input_string.encode('utf-8')).hexdigest()


platforms = ['osx', 'linux', 'win', 'win7']
