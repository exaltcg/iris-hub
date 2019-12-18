class Repository(object):
    def __init__(self, adapter=None):
        self.client = adapter()

    def find_all(self, selector, excluding=None):
        return self.client.find_all(selector, excluding)

    def find_with_sort_limit(self, selector, excluding, sort, limit):
        return self.client.find_all(selector, excluding).sort(sort).limit(limit)

    def get_count(self, selector):
        return self.client.get_count(selector)

    def find(self, selector, excluding=None):
        return self.client.find(selector, excluding)

    def create(self, item):
        return self.client.create(item)

    def update(self, selector, item):
        return self.client.update(selector, item)

    def delete(self, selector):
        return self.client.delete(selector)
