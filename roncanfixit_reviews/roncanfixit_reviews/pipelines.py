# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter


class RoncanfixitReviewsPipeline:
    def process_item(self, item, spider):

        adapter = ItemAdapter(item)
        if adapter.get('name'):
            adapter['name'] = ' '.join(adapter['name'].split())
        
        if adapter.get('link') and not adapter.get('link').startswith('http'):
            adapter['link'] = spider.start_urls[0] + adapter['link']

        if adapter.get('review'):
            adapter['review'] = ' '.join(adapter['review'].split())

        if adapter.get('date'):
            adapter['date'] = ' '.join(adapter['date'].split())

        if adapter.get('stars'):
            adapter['stars'] = int(adapter['stars'])

        if adapter.get('task'):
            adapter['task'] = ' '.join(adapter['task'].split())
            
        return item
