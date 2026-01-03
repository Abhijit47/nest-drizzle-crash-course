import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { posts } from 'src/drizzle/schema';
import type { DrizzleDB } from 'src/drizzle/types/drizzle';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}
  create(createPostDto: CreatePostDto) {
    console.log(createPostDto);
    return `This action adds a new post`;
  }

  async findAll() {
    const posts = await this.db.query.posts.findMany();
    return posts;
  }

  findOne(id: string) {
    return `This action returns a #${id} post`;
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    console.log(updatePostDto);
    return `This action updates a #${id} post`;
  }

  async remove(id: string) {
    const post = await this.db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning();
    return post;
  }
}
