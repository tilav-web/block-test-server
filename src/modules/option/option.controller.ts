import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OptionService } from './option.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { AuthGuard } from '../user/guards/auth.guard';
import { RolesGuard } from '../user/guards/roles.guard';
import { Roles } from '../user/guards/roles.guard';
import { UserRole } from '../user/user.schema';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { User } from '../user/user.schema';

@Controller('options')
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createOptionDto: CreateOptionDto, @CurrentUser() user: User) {
    return this.optionService.create(createOptionDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@CurrentUser() user: User) {
    return this.optionService.findAll();
  }

  @Get('test/:testId')
  @UseGuards(AuthGuard)
  findByTest(@Param('testId') testId: string, @CurrentUser() user: User) {
    return this.optionService.findByTest(testId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.optionService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateOptionDto: UpdateOptionDto,
    @CurrentUser() user: User,
  ) {
    return this.optionService.update(id, updateOptionDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.optionService.remove(id);
  }
}
