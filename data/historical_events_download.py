# https://api.wikimedia.org/wiki/Feed_API/Reference/On_this_day

import requests
import json
import os
from tqdm import tqdm

os.chdir(os.path.dirname(__file__))


def fetch_events(month, day):
    save_path = f"./historical_events/{month:02d}/{day:02d}.json"
    if os.path.exists(save_path):
        return

    res = requests.get(
        f"https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/selected/{month:02d}/{day:02d}")

    os.makedirs(f"./historical_events/{month:02d}", exist_ok=True)
    with open(save_path, "w", encoding="utf8") as fout:
        json.dump(res.json(), fout)


if __name__ == "__main__":
    month_days = [-1, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    for month in range(1, 13):
        print(f"Fetching month {month}...")
        for day in tqdm(range(1, month_days[month] + 1), ncols=70):
            fetch_events(month, day)
            print(f"{day}, ", end="")
        print()
