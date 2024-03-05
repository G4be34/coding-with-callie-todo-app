import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Group } from './entities/group.entity';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

@Module({
  imports: [TypeOrmModule.forFeature([Group]), UsersModule],
  exports: [GroupsService],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
