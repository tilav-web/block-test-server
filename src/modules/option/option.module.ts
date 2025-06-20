import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OptionService } from './option.service';
import { OptionController } from './option.controller';
import { Option, OptionSchema } from './option.schema';
import { AuthModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Option.name, schema: OptionSchema },
    ]),
    AuthModule,
  ],
  controllers: [OptionController],
  providers: [OptionService],
  exports: [OptionService],
})
export class OptionModule {}
