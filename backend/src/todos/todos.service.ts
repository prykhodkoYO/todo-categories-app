import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async create(createTodoDto: CreateTodoDto) {
    const count = await this.prisma.todo.count({
      where: {
        category: createTodoDto.category,
      },
    });

    if (count >= 5) {
      throw new BadRequestException(
        'Category already has 5 tasks',
      );
    }

    return this.prisma.todo.create({
      data: {
        text: createTodoDto.text,
        category: createTodoDto.category,
      },
    });
  }

  async findAll(category?: string) {
    return this.prisma.todo.findMany({
      where: category
        ? {
            category,
          }
        : {},
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    const todo = await this.prisma.todo.findUnique({
      where: {
        id,
      },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return this.prisma.todo.update({
      where: {
        id,
      },
      data: {
        completed: updateTodoDto.completed,
      },
    });
  }

  async remove(id: number) {
    const todo = await this.prisma.todo.findUnique({
      where: {
        id,
      },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return this.prisma.todo.delete({
      where: {
        id,
      },
    });
  }

  async getCategories() {
    const todos = await this.prisma.todo.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
    });

    return todos.map((todo) => todo.category);
  }
}
