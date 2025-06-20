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
export class OptionFileUploadInterceptor implements NestInterceptor {
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
        cb(null, `option-${uniqueSuffix}${ext}`);
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
      this.upload.array('optionFiles', 10)(
        request as any,
        {} as any,
        (err: any) => {
          if (err) {
            observer.error(err);
            return;
          }

          // If files were uploaded, process them and add to request body
          if (request.files && Array.isArray(request.files)) {
            if (!request.body) {
              request.body = {};
            }

            // Process uploaded files and update options
            const uploadedFiles = request.files as Express.Multer.File[];
            const options = request.body.options || [];

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
            uploadedFiles.forEach((file, fileIndex) => {
              if (fileOptions[fileIndex]) {
                const { index } = fileOptions[fileIndex];
                const filePath = `/uploads/${file.filename}`;
                options[index].value = filePath;
              }
            });

            request.body.options = options;
          }

          observer.next(next.handle());
          observer.complete();
        },
      );
    });
  }
}
