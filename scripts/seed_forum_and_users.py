from pymongo import MongoClient
from faker import Faker
from datetime import datetime, timedelta
import random
import os
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv('.env.local')
fake = Faker('tr_TR')

def generate_users(count: int = 20):
    users = []
    for _ in range(count):
        fake_username = fake.user_name()
        fake_name = fake.name()
        user = {
            "_id": ObjectId(),
            "username": fake_username,
            "name": fake_name,
            "email": fake.email(),
            "password": "hashed_password_here",  # In production, use proper hashing
            "joinDate": fake.date_time_between(start_date="-1y"),
            "bio": fake.text(max_nb_chars=200),
            "postCount": 0,
            "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={fake_username}"
        }
        users.append(user)
    return users

def generate_comments(users, post_date, max_depth=2, parent_chance=0.3):
    comments = []
    base_comments = random.randint(1, 8)  # Generate 1-8 base comments

    def create_comment(depth=0):
        comment_user = random.choice(users)
        comment_date = fake.date_time_between(start_date=post_date)

        comment = {
            "_id": ObjectId(),
            "content": fake.paragraph(),
            "author": comment_user["username"],
            "uploadTime": comment_date,
            "likes": random.randint(0, 30),
            "replies": []
        }

        # Add replies with decreasing probability
        if depth < max_depth and random.random() < parent_chance:
            reply_count = random.randint(1, 3)
            for _ in range(reply_count):
                reply = create_comment(depth + 1)
                comment["replies"].append(reply)

        return comment

    for _ in range(base_comments):
        comments.append(create_comment())

    return comments

def generate_forum_posts(users, post_count: int = 50):
    posts = []
    for _ in range(post_count):
        user = random.choice(users)
        post_date = fake.date_time_between(start_date="-6m")

        post = {
            "_id": ObjectId(),
            "title": fake.sentence(),
            "content": "\n\n".join(fake.paragraphs(nb=random.randint(3, 7))),
            "author": user["username"],
            "uploadTime": post_date,
            "likes": random.randint(0, 100),
            "views": random.randint(50, 1000),
            "comments": generate_comments(users, post_date),
            "tags": random.sample([
                "Yatırım", "Borsa", "Kripto", "Ekonomi",
                "Finans", "Teknik Analiz", "Portföy", "Piyasa",
                "Altın", "Döviz", "Emlak", "Hisse Senedi"
            ], random.randint(1, 4))
        }
        posts.append(post)
    return posts

def seed_database():
    try:
        client = MongoClient(os.getenv('MONGODB_URI'))
        db = client.midora

        # Clear existing data
        db.forum_posts.delete_many({})

        # Generate and insert users
        print("Generating users...")
        users = generate_users()
        db.users.insert_many(users)
        print(f"Created {len(users)} users")

        # Generate and insert forum posts
        print("Generating forum posts...")
        posts = generate_forum_posts(users)
        db.forum_posts.insert_many(posts)
        print(f"Created {len(posts)} forum posts")

        # Update user post counts
        for post in posts:
            db.users.update_one(
                {"username": post["author"]},
                {"$inc": {"postCount": 1}}
            )

        print("Database seeding completed successfully!")

    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    seed_database()
