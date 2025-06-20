import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { BlockService } from './block.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { AuthGuard } from '../user/guards/auth.guard';
import { RolesGuard } from '../user/guards/roles.guard';
import { Roles } from '../user/guards/roles.guard';
import { UserRole } from '../user/user.schema';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { User } from '../user/user.schema';

@Controller('blocks')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createBlockDto: CreateBlockDto) {
    return this.blockService.create(createBlockDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.blockService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.blockService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateBlockDto: UpdateBlockDto) {
    return this.blockService.update(id, updateBlockDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.blockService.remove(id);
  }

  @Get(':id/quiz')
  @UseGuards(AuthGuard)
  getBlockWithTests(@Param('id') id: string, @CurrentUser() user: User) {
    if (
      user.role !== UserRole.ADMIN &&
      !user.accessible_blocks.map((b) => b.toString()).includes(id)
    ) {
      throw new ForbiddenException("Sizda bu blok uchun ruxsat yo'q");
    }
    return this.blockService.getBlockWithTests(id);
  }
}
