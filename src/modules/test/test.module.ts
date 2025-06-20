import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { Test, TestSchema } from './test.schema';
import { Option, OptionSchema } from '../option/option.schema';
import { AuthModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Test.name, schema: TestSchema },
      { name: Option.name, schema: OptionSchema },
    ]),
    AuthModule,
  ],
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}
