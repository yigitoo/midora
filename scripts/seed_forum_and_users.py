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
        users.append({
            "_id": ObjectId(),
            "username": fake.user_name(),
            "email": fake.email(),
            "password": fake.password(),
            "createdAt": fake.date_time_this_decade()
        })
    return users

def generate_comment(author, post_date, depth=0, max_depth=3):
    comment = {
        "_id": ObjectId(),
        "author": author,
        "content": fake.paragraph(),
        "createdAt": post_date + timedelta(days=random.randint(1, 30)),
        "likes": random.randint(0, 100),
        "likedBy": [fake.user_name() for _ in range(random.randint(0, 10))],
        "replies": []
    }
    if depth < max_depth:
        for _ in range(random.randint(0, 3)):
            comment["replies"].append(generate_comment(fake.user_name(), comment["createdAt"], depth + 1, max_depth))
    return comment

def generate_forum_posts(users, post_count: int = 50):
    posts = []
    for _ in range(post_count):
        author = random.choice(users)
        post_date = fake.date_time_this_decade()
        post = {
            "_id": ObjectId(),
            "title": fake.sentence(),
            "content": fake.paragraph(nb_sentences=5),
            "author": author["username"],
            "uploadTime": post_date,
            "likes": random.randint(0, 100),
            "likedBy": [random.choice(users)["username"] for _ in range(random.randint(0, 10))],
            "comments": [generate_comment(random.choice(users)["username"], post_date) for _ in range(random.randint(0, 5))],
            "tags": [fake.word() for _ in range(random.randint(1, 5))]
        }
        posts.append(post)
    return posts

def seed_database():
    client = MongoClient(os.getenv('MONGODB_URI'))
    db = client.get_database(os.getenv('MONGODB_DB'))

    users = generate_users()
    posts = generate_forum_posts(users)

    db.users.insert_many(users)
    db.forum_posts.insert_many(posts)

if __name__ == "__main__":
    seed_database()
