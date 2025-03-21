# CODE TẠO BẢNG SHOWTIMES VÀ BOOKING CHO 3 NGÀY
import json
from datetime import datetime, timedelta
import random

# Khởi tạo danh sách các rạp (cinema_01 đến cinema_10)
cinemas = [f"cinema_0{i}" if i < 10 else f"cinema_{i}" for i in range(1, 11)]

# Khởi tạo danh sách các phim (1 đến 23 và 41 đến 56)
movies = list(range(1, 24)) + list(range(41, 57))

# Hàm tạo khung giờ ngẫu nhiên (giữ nguyên từ code của bạn)
def generate_random_showtimes():
    showtimes = []
    for _ in range(3):
        hour = random.randint(9, 22)
        minute = random.choice([0, 15, 30, 45])
        showtime = f"{hour:02d}:{minute:02d}"
        showtimes.append(showtime)
    return sorted(showtimes)

# Tính thời gian kết thúc (giữ nguyên từ code của bạn)
def calculate_end_time(start_time):
    start = datetime.strptime(start_time, "%H:%M")
    total_minutes = start.hour * 60 + start.minute + 1 * 60 + 54
    end_hour = (total_minutes // 60) % 24
    end_minute = total_minutes % 60
    return f"{end_hour:02d}:{end_minute:02d}"

# Hàm tạo danh sách ghế "sold" (2-4 ghế ngẫu nhiên)
def generate_sold_seats():
    rows = ["a", "b", "c", "d", "e", "f", "g", "h"]
    seats = {}
    seat_keys = [f"{row}{i}" for row in rows for i in range(1, 11)]  # Tạo danh sách ghế từ a1 đến h10
    seats_to_book = random.randint(2, 4)
    sold_seats = random.sample(seat_keys, seats_to_book)

    for seat in sold_seats:
        seats[seat] = {"status": "sold"}
    return seats

# Tạo dữ liệu showtimes trước
showtimes_data = {"Showtimes": {}}
start_date = datetime(2025, 3, 21)
days = [start_date + timedelta(days=i) for i in range(3)]

for day in days:
    date = day.strftime("%Y-%m-%d")
    showtimes_hours = generate_random_showtimes()
    print(f"Khung giờ cho ngày {date}: {showtimes_hours}")

    for cinema in cinemas:
        room = "Room 1"
        for movie in movies:
            for start_hour in showtimes_hours:
                showtime_key = f"showtime_{date.replace('-', '')}_{start_hour.replace(':', '')}_{cinema}_movie{movie}"
                end_hour = calculate_end_time(start_hour)

                showtime_info = {
                    "cinema_id": cinema,
                    "room": room,
                    "movie_id": movie,
                    "start_time": f"{date} {start_hour}",
                    "end_time": f"{date} {end_hour}"
                }
                showtimes_data["Showtimes"][showtime_key] = showtime_info

# Tạo dữ liệu bookings dựa trên showtimes đã tạo
bookings_data = {"Bookings": {}}
for showtime_key in showtimes_data["Showtimes"].keys():
    seats = generate_sold_seats()  # Chỉ tạo các ghế "sold"
    bookings_data["Bookings"][showtime_key] = {"seats": seats}

# Ghi dữ liệu vào file JSON
with open('showtimes_3days.json', 'w', encoding='utf-8') as file:
    json.dump(showtimes_data, file, ensure_ascii=False, indent=4)

with open('bookings_3days_sold_only.json', 'w', encoding='utf-8') as file:
    json.dump(bookings_data, file, ensure_ascii=False, indent=4)

print("File JSON 'showtimes_3days.json' và 'bookings_3days_sold_only.json' đã được tạo thành công!")