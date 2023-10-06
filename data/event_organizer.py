# Format events provided by the Wikimedia "On this day" API.
# Sort by date.

import json

month_days = [-1, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]


def parse_events(events, month, day):
    "Take a list of Wikimedia-formatted objects, turn into a list of events."
    new_events = []
    for event in events:
        new_events.append({
            "date": f"{str(event['year']).zfill(4)}-{month:02d}-{day:02d}",
            "text": event["text"]
        })
        if "thumbnail" in event["pages"][0]:
            new_events[-1]["thumbnail"] = event["pages"][0]["thumbnail"]["source"]
    return new_events


all_events = []

for month in range(1, 13):
    print(f"Processing month {month}...")
    for day in range(1, month_days[month] + 1):
        # Read the data and parse it
        with open(f"./historical_events/{month:02d}/{day:02d}.json", encoding="utf8") as fin:
            try:
                events = json.load(fin)["selected"]
            except Exception as e:
                print(e)
                print(month, day)
            all_events.extend(parse_events(events, month, day))


def split_date(date):
    if date[0] == "-":
        split = list(map(int, date[1:].split("-")))
        split[0] *= -1
        return split
    return list(map(int, date.split("-")))


all_events.sort(key=lambda event: split_date(event["date"]), reverse=True)
with open("./all_events.json", "w") as fout:
    json.dump(all_events, fout, indent=2)
