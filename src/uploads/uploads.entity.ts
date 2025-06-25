import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileTypes } from './enums/file-types.enums';

@Entity()
export class Upload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  path: string;

  @Column({
    type: 'enum',
    enum: FileTypes,
    default: FileTypes.IMAGE,
    nullable: false,
  })
  type: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  mime_type: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  size: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
