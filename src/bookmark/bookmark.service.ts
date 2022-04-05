import { ForbiddenException, Injectable } from '@nestjs/common';
import { Bookmark } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private readonly prisma: PrismaService) {}

  async getBookmarks(userId: number): Promise<Bookmark[]> {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  async getBookmarkById(userId: number, bookmarkId: number): Promise<Bookmark> {
    return this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }

  async createBookmark(
    userId: number,
    createBookmarkDto: CreateBookmarkDto,
  ): Promise<Bookmark> {
    return this.prisma.bookmark.create({
      data: {
        ...createBookmarkDto,
        userId,
      },
    });
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    editBookmarkDto: EditBookmarkDto,
  ): Promise<Bookmark> {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
    if (!bookmark) {
      throw new ForbiddenException(`Bookmark with id ${bookmarkId} not found`);
    }
    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...editBookmarkDto,
      },
    });
  }

  async deleteBookmarkById(userId: number, bookmarkId: number): Promise<void> {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
    if (!bookmark) {
      throw new ForbiddenException(`Bookmark with id ${bookmarkId} not found`);
    }
    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
