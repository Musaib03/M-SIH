# scraper/views.py
import asyncio
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from telethon.sync import TelegramClient
from telethon.tl.types import MessageMediaPhoto
from django.utils.decorators import sync_and_async_middleware
import requests
import re
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

api_id = os.getenv('API_ID')
api_hash = os.getenv('API_HASH')
phone_number = os.getenv('PHONE_NUMBER')

media_folder = 'media'
if not os.path.exists(media_folder):
    os.makedirs(media_folder)

# Drug keywords list for both scrapers
drug_keywords = ['mdma', 'cocaine', 'kush', 'weed', 'pills', 'xans', '💊', '🍃', 'drug', 'cocaine', 'marijuana', 'meth', 'heroin', 
                 'weed', 'lsd', 'meth', 'ketamine', 'ecstasy', 'xanax', 'oxycontin', 'adderall', 'fentanyl', 'molly', 'benzo', 
                 'deal', 'buy', 'sell', 'purchase', 'drug', 'narcotic']

# Telegram scraping function
async def scrape_telegram(wallet_addresses, drug_keywords):
    results = []
    async with TelegramClient('session_name', api_id, api_hash) as client:
        async for dialog in client.iter_dialogs():
            async for message in client.iter_messages(dialog, limit=100):
                if message.text:
                    # Check if the message contains any drug keywords or wallet addresses
                    for keyword in drug_keywords + wallet_addresses:
                        if keyword in message.text.lower():
                            # Get the sender information (user or channel)
                            sender = await client.get_entity(message.sender_id)
                            
                            # Check if the sender is a user or a channel and extract the appropriate name
                            if hasattr(sender, 'first_name'):  # User
                                sender_info = sender.first_name if sender.first_name else 'N/A'
                            elif hasattr(sender, 'title'):  # Channel or Group
                                sender_info = sender.title
                            else:
                                sender_info = 'Unknown Sender'
                            
                            # Append the dialog name, message, and sender info to the results
                            results.append({
                                'dialog_name': dialog.name,
                                'sender': sender_info,
                                'message': message.text,
                            })
    return results

# Reddit scraping function
def scrape_reddit(wallet_address):
    search_url = f"https://www.reddit.com/search.json?q={wallet_address}&type=link"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
    
    response = requests.get(search_url, headers=headers)
    data_list = []

    if response.status_code == 200:
        data = response.json()
        for post in data['data']['children']:
            post_data = post['data']
            username = post_data.get('author', 'N/A')
            content_type = post_data.get('title', 'N/A')
            post_url = f"https://reddit.com{post_data.get('permalink', '')}"
            content = post_data.get('title', '') + ' ' + post_data.get('selftext', '')
            content_lower = content.lower()
            found_keywords = [kw for kw in drug_keywords if kw in content_lower]

            if found_keywords:
                email = re.search(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', content)
                email = email.group(0) if email else 'N/A'
                phone_number = re.search(r'\b\d{10}\b', content)
                phone_number = phone_number.group(0) if phone_number else 'N/A'

                data_list.append({
                    'username': username,
                    'content_type': content_type,
                    'contact_number': phone_number,
                    'email_address': email,
                    'keywords_found': ', '.join(found_keywords),
                    'url': post_url
                })
    return data_list

# View function to handle scraper selection and execution
@csrf_exempt
def scrape_view(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        wallet_addresses = body.get('wallet_addresses', [])
        wallet_addresses = [address.lower() for address in wallet_addresses]
        platform = body.get('platform', 'telegram')  # Default to telegram if no platform selected

        if platform == 'telegram':
            # Correctly pass drug keywords and run asynchronously
            try:
                results = asyncio.run(scrape_telegram(wallet_addresses, drug_keywords))
                return JsonResponse({'results': results}, status=200)
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)

        elif platform == 'reddit':
            # Synchronous scraping for Reddit
            try:
                results = []
                for address in wallet_addresses:
                    reddit_results = scrape_reddit(address)
                    results.extend(reddit_results)
                return JsonResponse({'results': results}, status=200)
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)

        return JsonResponse({'error': 'Invalid platform selected'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=400)
