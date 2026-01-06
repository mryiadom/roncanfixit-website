# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class RoncanfixitReviewsItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    task = scrapy.Field()
    name = scrapy.Field()
    stars = scrapy.Field()
    date = scrapy.Field()
    location = scrapy.Field()
    review = scrapy.Field()
    pass
