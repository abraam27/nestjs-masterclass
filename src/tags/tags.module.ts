import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { Tag } from './tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsService } from './providers/tags.service';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
  exports: [],
  imports: [TypeOrmModule.forFeature([Tag])],
})
export class TagsModule {}
