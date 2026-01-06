import asyncio
import json
import random
from playwright.async_api import async_playwright
from playwright_stealth import Stealth  # Import Stealth class

async def scrape_roncan_reviews(url, target_count=20):
    async with async_playwright() as p:
        # Launching browser
        browser = await p.chromium.launch(headless=True) 
        context = await browser.new_context(
            viewport={'width': 1280, 'height': 800},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        
        page = await context.new_page()
        
        # Apply stealth to the page
        stealth = Stealth()
        await stealth.apply_stealth_async(page) 
        
        print(f"🚀 Navigating to Airtasker...")
        await page.goto(url, wait_until="networkidle")
        await asyncio.sleep(random.uniform(2, 4)) 

        unique_reviews = {}
        names_seen = set() 
        texts_seen = set() # Double protection: ensure text is unique too

        while len(unique_reviews) < target_count:
            # Find all review cards
            containers = await page.query_selector_all('div[class*="AdsUserReview__AdsUserReviewWrapper"]')
            
            for container in containers:
                try:
                    name_el = await container.query_selector('p[class*="gOGerw"]')
                    text_el = await container.query_selector('div[id="val-ads-content"]')
                    date_el = await container.query_selector('span[class*="LolKw"]')
                    task_el = await container.query_selector('p:last-child')

                    name = (await name_el.inner_text()).strip() if name_el else None
                    text = (await text_el.inner_text()).strip() if text_el else None
                    date = (await date_el.inner_text()).strip() if date_el else "Recent"
                    task = (await task_el.inner_text()).strip() if task_el else "Handyman Service"

                    # SUPER STRICT UNIQUE CHECK
                    if name and text and name not in names_seen and text not in texts_seen:
                        names_seen.add(name)
                        texts_seen.add(text)
                        
                        unique_reviews[name] = {
                            "name": name,
                            "text": text,
                            "task": task,
                            "date": date,
                            "rating": 5
                        }
                        print(f"✅ Unique Review Added: {name} ({len(unique_reviews)}/20)")

                    if len(unique_reviews) >= target_count: break
                except:
                    continue

            if len(unique_reviews) < target_count:
                print("--- Human-like scrolling for more... ---")
                await page.mouse.wheel(0, random.randint(800, 1500))
                await asyncio.sleep(random.uniform(2, 5))
            else:
                break

        # Convert to list and save
        final_data = list(unique_reviews.values())
        
        # Ensure the public folder exists or it might throw an error
        import os
        if not os.path.exists('public'):
            os.makedirs('public')

        with open('public/reviews.json', 'w', encoding='utf-8') as f:
            json.dump(final_data, f, indent=4)

        print(f"\n✨ Clean Data Saved! Found {len(final_data)} unique reviews.")
        await browser.close()

target = "https://www.airtasker.com/users/f072f5e4350a-p-31495627/reviews?showProfileAsRole=TASKER"
asyncio.run(scrape_roncan_reviews(target))