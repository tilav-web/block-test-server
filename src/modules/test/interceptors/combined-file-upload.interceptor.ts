import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class CombinedFileUploadInterceptor implements NestInterceptor {
  private upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const prefix = file.fieldname === 'file' ? 'question' : 'option';
        cb(null, `${prefix}-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      // Allow only image files
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
  });

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    return new Observable((observer) => {
      this.upload.fields([
        { name: 'file', maxCount: 1 },
        { name: 'optionFiles', maxCount: 10 },
      ])(request as any, {} as any, (err: any) => {
        if (err) {
          observer.error(err);
          return;
        }

        if (!request.body) {
          request.body = {};
        }

        // Handle question file - set as target if type is file
        if (request.files && 'file' in request.files) {
          const questionFile = (request.files as any).file[0];
          if (questionFile) {
            const filePath = `/uploads/${questionFile.filename}`;
            // If type is file, set target to file path, preserve question text
            if (request.body.type === 'file') {
              request.body.target = filePath;
              // Ensure question field exists and is not empty
              if (
                !request.body.question ||
                request.body.question.trim() === ''
              ) {
                request.body.question = 'Rasm haqida savol bering';
              }
            } else if (request.body.type === 'url') {
              request.body.target = request.body.question || '';
              request.body.question = "Rasm ko'rish uchun bosing";
            } else {
              // For text type, set question to file path (fallback)
              request.body.question = filePath;
            }
          }
        } else {
          // If no file uploaded but type is file, ensure question exists
          if (
            request.body.type === 'file' &&
            (!request.body.question || request.body.question.trim() === '')
          ) {
            request.body.question = 'Rasm haqida savol bering';
          }
        }

        // Handle option files
        if (request.files && 'optionFiles' in request.files) {
          const optionFiles = (request.files as any).optionFiles;
          const options = request.body.options || [];

          if (optionFiles && optionFiles.length > 0) {
            // Find options that should have files (type === 'file' but value is a filename)
            const fileOptions = options
              .map((option: any, index: number) => ({ option, index }))
              .filter(
                ({ option }: any) =>
                  option.type === 'file' &&
                  option.value &&
                  !option.value.startsWith('/uploads/'),
              );

            // Match uploaded files with file options
            optionFiles.forEach((file: any, fileIndex: number) => {
              if (fileOptions[fileIndex]) {
                const { index } = fileOptions[fileIndex];
                const filePath = `/uploads/${file.filename}`;
                options[index].value = filePath;
              }
            });

            request.body.options = options;
          }
        }

        // Call the next handler
        const result = next.handle();

        // Subscribe to the result and forward it to our observer
        result.subscribe({
          next: (value) => {
            observer.next(value);
          },
          error: (error) => {
            observer.error(error);
          },
          complete: () => {
            observer.complete();
          },
        });
      });
    });
  }
}
