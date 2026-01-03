import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { InsertPost, posts } from 'src/drizzle/schema';
import type { DrizzleDB } from 'src/drizzle/types/drizzle';
// import { CreatePostDto } from './dto/create-post.dto';
// import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}
  async create(createPostDto: Omit<InsertPost, 'id'>) {
    const [newPost] = await this.db
      .insert(posts)
      .values(createPostDto)
      .returning();
    return newPost;
  }

  async findAll() {
    const docs = await this.db.query.posts.findMany({
      // where(fields, operators) {
      //   return operators.eq(fields.id as PgColumn<'UUID'>, '1f36829a-5b95-468f-a77b-6fa9afbc4847');
      // },
      where: eq(posts.id, '1f36829a-5b95-468f-a77b-6fa9afbc4847'),
      // eq(posts.id, '1f36829a-5b95-468f-a77b-6fa9afbc4847'),
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
          with: {
            usersToGroups: {
              columns: {
                userId: false,
                groupId: false,
              },
              with: {
                group: {
                  columns: {
                    name: true,
                  },
                },
                user: {
                  columns: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        comments: true,
      },
    });
    return docs;
  }

  async findOne(id: string) {
    const post = await this.db.query.posts.findFirst({
      where: eq(posts.id, id),
    });

    if (!post) throw new BadRequestException('Post not found');

    return post;
  }

  async update(id: string, updatePostDto: InsertPost) {
    const updatePost = await this.db
      .update(posts)
      .set(updatePostDto)
      .where(eq(posts.id, id))
      .returning();
    return updatePost;
  }

  async remove(id: string) {
    const post = await this.db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning();
    return post;
  }
}
