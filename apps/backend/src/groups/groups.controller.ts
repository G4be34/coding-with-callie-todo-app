import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupsService } from './groups.service';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  @Public()
  async findAll(@Query('user') userId: string) {
    return this.groupsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(+id);
  }

  @Patch(':id')
  @Public()
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    console.log('the id: ', id);
    return this.groupsService.update(+id, updateGroupDto);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }
}
