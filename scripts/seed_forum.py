from pymongo import MongoClient
from faker import Faker
from datetime import datetime, timedelta
import random
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

# Initialize Faker
fake = Faker('tr_TR')

def generate_forum_posts(count: int = 150):
    """Generate sample forum posts"""
    posts = []
    for _ in range(count):
        # Random date within last 30 days
        random_date = datetime.now() - timedelta(
            days=random.randint(0, 30),
            hours=random.randint(0, 23),
            minutes=random.randint(0, 59)
        )

        post = {
            "title": fake.sentence(nb_words=6),
            "content": fake.paragraph(nb_sentences=5),
            "author": fake.user_name(),
            "uploadTime": random_date,
            "likes": random.randint(0, 100),
            "comments": random.randint(0, 50),
            "tags": random.sample([
                "Yatırım", "Borsa", "Kripto", "Ekonomi",
                "Finans", "Teknik Analiz", "Portföy"
            ], random.randint(1, 3))
        }
        posts.append(post)
    return posts

def seed_database():
    """Seed the MongoDB database with forum posts"""
    try:
        # Connect to MongoDB
        client = MongoClient(os.getenv('MONGODB_URI'), connect=True)
        db = client.midora


        # Generate and insert new posts
        posts = generate_forum_posts()
        result = db.forum_posts.insert_many(posts)

        print(f"Successfully seeded {len(result.inserted_ids)} forum posts")

    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    seed_database()
