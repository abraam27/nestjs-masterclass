import { Post } from "src/posts/post.entity";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne } from "typeorm";

@Entity()
export class MetaOption {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'json',
        nullable: false,
    })
    metaValue: string;

    @OneToOne(() => Post, (post) => post.metaOptions)
    post: Post;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}