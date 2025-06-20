# File Upload for Tests

## Overview
When creating a test with type `FILE`, you can upload an image file that will be stored in the `uploads` directory and the file path will be saved in the `question` field.

## API Usage

### Creating a Test with File Upload

**Endpoint:** `POST /tests`

**Content-Type:** `multipart/form-data`

**Required Fields:**
- `subject`: Subject ID (MongoDB ObjectId)
- `type`: Must be `"file"`
- `options`: Array of options
- `correctOptionValue`: The correct option value

**File Upload:**
- `file`: Image file (jpg, png, gif, etc.) - max 5MB

### Example Request

```bash
curl -X POST http://localhost:3000/tests \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "subject=507f1f77bcf86cd799439011" \
  -F "type=file" \
  -F "file=@/path/to/your/image.jpg" \
  -F "options[0][type]=text" \
  -F "options[0][value]=Option A" \
  -F "options[1][type]=text" \
  -F "options[1][value]=Option B" \
  -F "correctOptionValue=Option A"
```

### Response

The uploaded file will be saved in the `uploads` directory with a unique filename, and the file path will be stored in the `question` field:

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "subject": "507f1f77bcf86cd799439011",
  "question": "/uploads/test-1234567890-123456789.jpg",
  "type": "file",
  "options": [...],
  "correctOptionId": "...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### File Access

Uploaded files can be accessed via the `/uploads/` URL prefix:
- Example: `http://localhost:3000/uploads/test-1234567890-123456789.jpg`

## File Restrictions

- **File Types:** Only image files (jpg, png, gif, etc.)
- **File Size:** Maximum 5MB
- **Storage:** Files are stored in the `server/uploads/` directory

## Error Handling

- If a non-image file is uploaded, the request will be rejected
- If the file size exceeds 5MB, the request will be rejected
- If the test type is not `"file"`, the file upload will be ignored

## Security

- Only authenticated users with ADMIN role can upload files
- Files are stored with unique names to prevent conflicts
- File access is controlled through the static file serving middleware 