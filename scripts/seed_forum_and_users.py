from faker import Faker
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv
import random
from datetime import datetime, timedelta

load_dotenv('.env.local')
fake = Faker('tr_TR')

def generate_users(count: int = 50):
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

def generate_comment(author, post_date, depth=0, max_depth=3):
    if depth > max_depth:
        return None

    comment = {
        "_id": str(ObjectId()),
        "content": fake.paragraph(),
        "author": author["username"],
        "uploadTime": fake.date_time_between(start_date=post_date).isoformat(),
        "likes": random.randint(0, 30),
        "replies": [],
        "depth": depth
    }

    # Generate replies with decreasing probability
    if depth < max_depth and random.random() < 0.3:
        reply_count = random.randint(1, 3)
        for _ in range(reply_count):
            reply = generate_comment(
                random.choice(users_global),
                post_date,
                depth + 1,
                max_depth
            )
            if reply:
                comment["replies"].append(reply)

    return comment

def generate_forum_posts(users, post_count: int = 50):
    global users_global
    users_global = users
    posts = []

    for _ in range(post_count):
        user = random.choice(users)
        post_date = fake.date_time_between(start_date="-6m")

        # Generate base comments
        comments = []
        comment_count = random.randint(0, 10)
        for _ in range(comment_count):
            comment = generate_comment(
                random.choice(users),
                post_date,
                depth=0
            )
            if comment:
                comments.append(comment)

        post = {
            "_id": str(ObjectId()),
            "title": fake.sentence(),
            "content": "\n\n".join(fake.paragraphs(nb=random.randint(3, 7))),
            "author": user["username"],
            "uploadTime": post_date.isoformat(),
            "likes": random.randint(0, 100),
            "comments": comments,
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
        print("Clearing existing data...")
        db.forum_posts.delete_many({})

        # Generate and insert users
        print("Generating users...")
        users = generate_users(50)
        result = db.users.insert_many(users)
        print(f"Created {len(result.inserted_ids)} users")

        # Generate and insert forum posts
        print("Generating forum posts...")
        posts = generate_forum_posts(users)
        result = db.forum_posts.insert_many(posts)
        print(f"Created {len(result.inserted_ids)} forum posts")

        # Update user post counts
        print("Updating user post counts...")
        for post in posts:
            db.users.update_one(
                {"username": post["author"]},
                {"$inc": {"postCount": 1}}
            )

        print("Database seeding completed successfully!")

    except Exception as e:
        print(f"Error seeding database: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    seed_database()
