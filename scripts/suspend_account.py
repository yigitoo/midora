import requests
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

def suspend_account(email: str, reason: str, days: int = 30):
    """
    Suspend a user account
    :param email: User's email address
    :param reason: Reason for suspension
    :param days: Number of days to suspend (default: 30)
    """

    # API endpoint
    url = "http://localhost:3000/api/admin/suspend-account"

    # Calculate suspension end date
    until = (datetime.now() + timedelta(days=days)).isoformat()

    # Request payload
    payload = {
        "email": email,
        "reason": reason,
        "until": until,
        "adminToken": os.getenv("ADMIN_SECRET")
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        print(f"Account {email} suspended successfully")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error suspending account: {e}")
        return None

if __name__ == "__main__":
    # Example usage
    email = input("Enter email to suspend: ")
    reason = input("Enter suspension reason: ")
    days = int(input("Enter suspension duration (days): "))

    suspend_account(email, reason, days)
