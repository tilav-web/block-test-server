# API Foydalanish Misollari

## 1. Tizimga kirish

```bash
# Login qilish
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

## 2. Subject yaratish (ADMIN kerak)

```bash
# Subject yaratish
curl -X POST http://localhost:3000/subjects \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Matematika"
  }'
```

## 3. Subjectlarni o'qish (Login kerak)

```bash
# Barcha subjectlarni olish
curl -X GET http://localhost:3000/subjects \
  -b cookies.txt

# Bitta subjectni olish
curl -X GET http://localhost:3000/subjects/64f1a2b3c4d5e6f7g8h9i0j1 \
  -b cookies.txt
```

## 4. Option yaratish (ADMIN kerak)

```bash
# Option yaratish
curl -X POST http://localhost:3000/options \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "type": "text",
    "test": "64f1a2b3c4d5e6f7g8h9i0j1",
    "value": "4"
  }'
```

## 5. Test yaratish (ADMIN kerak)

```bash
# Test yaratish
curl -X POST http://localhost:3000/tests \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "subject": "64f1a2b3c4d5e6f7g8h9i0j1",
    "question": "2 + 2 = ?",
    "type": "text",
    "options": ["64f1a2b3c4d5e6f7g8h9i0j2", "64f1a2b3c4d5e6f7g8h9i0j3"],
    "correctOptionId": "64f1a2b3c4d5e6f7g8h9i0j2"
  }'
```

## 6. Testlarni o'qish (Login kerak)

```bash
# Barcha testlarni olish
curl -X GET http://localhost:3000/tests \
  -b cookies.txt

# Subject ga bog'langan testlarni olish
curl -X GET http://localhost:3000/tests/subject/64f1a2b3c4d5e6f7g8h9i0j1 \
  -b cookies.txt
```

## 7. Optionlarni o'qish (Login kerak)

```bash
# Barcha optionlarni olish
curl -X GET http://localhost:3000/options \
  -b cookies.txt

# Test ga bog'langan optionlarni olish
curl -X GET http://localhost:3000/options/test/64f1a2b3c4d5e6f7g8h9i0j1 \
  -b cookies.txt
```

## 8. Ma'lumotlarni yangilash (ADMIN kerak)

```bash
# Subject yangilash
curl -X PATCH http://localhost:3000/subjects/64f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Yangi Matematika"
  }'

# Test yangilash
curl -X PATCH http://localhost:3000/tests/64f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "question": "Yangi savol?"
  }'
```

## 9. Ma'lumotlarni o'chirish (ADMIN kerak)

```bash
# Subject o'chirish (cascade deletion)
curl -X DELETE http://localhost:3000/subjects/64f1a2b3c4d5e6f7g8h9i0j1 \
  -b cookies.txt

# Test o'chirish (cascade deletion)
curl -X DELETE http://localhost:3000/tests/64f1a2b3c4d5e6f7g8h9i0j1 \
  -b cookies.txt

# Option o'chirish
curl -X DELETE http://localhost:3000/options/64f1a2b3c4d5e6f7g8h9i0j1 \
  -b cookies.txt
```

## Xatolik Xabarlari

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Token topilmadi. Iltimos, tizimga kiring."
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Bu sahifaga kirish uchun yetarli huquqlaringiz yo'q"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Subject with ID 64f1a2b3c4d5e6f7g8h9i0j1 not found"
}
```

## Muhim Eslatmalar

1. **Cookies** - Login qilgandan keyin cookie fayl saqlanadi
2. **Token** - JWT token cookie orqali avtomatik yuboriladi
3. **Authorization** - ADMIN roli talab qilinadigan endpointlar uchun
4. **Cascade Deletion** - Subject yoki test o'chirilganda bog'langan ma'lumotlar ham o'chiriladi 