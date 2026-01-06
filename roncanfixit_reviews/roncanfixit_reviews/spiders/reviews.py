import scrapy
from roncanfixit_reviews.items import RoncanfixitReviewsItem
from urllib.parse import urljoin

class ReviewsSpider(scrapy.Spider):
    name = "reviews"
    allowed_domains = ["airtasker.com"]
    start_urls = ["https://www.airtasker.com/users/f072f5e4350a-p-31495627/reviews?showProfileAsRole=TASKER"]

    def parse(self, response):
        names = response.css(".review__name::text").getall()
        