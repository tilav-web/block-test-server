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
export class FileUploadInterceptor implements NestInterceptor {
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
        cb(null, `test-${uniqueSuffix}${ext}`);
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
      this.upload.single('file')(request as any, {} as any, (err: any) => {
        if (err) {
          observer.error(err);
          return;
        }

        // If file was uploaded, add the file path to the request body
        if (request.file) {
          const filePath = `/uploads/${request.file.filename}`;
          if (!request.body) {
            request.body = {};
          }
          request.body.question = filePath;
        }

        observer.next(next.handle());
        observer.complete();
      });
    });
  }
}
