import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { InsertPost, posts as postsTable } from 'src/drizzle/schema';
import type { DrizzleDB } from 'src/drizzle/types/drizzle';
// import { CreatePostDto } from './dto/create-post.dto';
// import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}
  async create(createPostDto: Omit<InsertPost, 'id'>) {
    const [newPost] = await this.db
      .insert(postsTable)
      .values(createPostDto)
      .returning();

    if (!newPost) {
      throw new BadRequestException('Failed to create post');
    }
    return newPost;
  }

  async findAll() {
    const posts = await this.db.query.posts.findMany({
      // where(fields, operators) {
      //   return operators.eq(fields.id as PgColumn<'UUID'>, '1f36829a-5b95-468f-a77b-6fa9afbc4847');
      // },
      where: eq(postsTable.id, '1f36829a-5b95-468f-a77b-6fa9afbc4847'),
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
    return posts;
  }

  async findOne(id: string) {
    const post = await this.db.query.posts.findFirst({
      where: eq(postsTable.id, id),
    });

    if (!post) throw new NotFoundException('Post not found');

    return post;
  }

  async update(id: string, updatePostDto: Partial<Omit<InsertPost, 'id'>>) {
    const updatedPost = await this.db
      .update(postsTable)
      .set(updatePostDto)
      .where(eq(postsTable.id, id))
      .returning();

    if (!updatedPost) {
      throw new BadRequestException('Post not found');
    }
    return updatedPost;
  }

  async remove(id: string) {
    const post = await this.db
      .delete(postsTable)
      .where(eq(postsTable.id, id))
      .returning();
    return post;
  }
}
