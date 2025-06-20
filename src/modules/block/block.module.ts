import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';
import { Block, BlockSchema } from './block.schema';
import { AuthModule } from '../user/user.module';
import { TestModule } from '../test/test.module';
import { SubjectModule } from '../subject/subject.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Block.name, schema: BlockSchema }]),
    AuthModule,
    TestModule,
    SubjectModule,
  ],
  controllers: [BlockController],
  providers: [BlockService],
  exports: [BlockService],
})
export class BlockModule {}
