import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TodosModule } from './todos/todos.module';
import { CategoriesController } from './categories/categories.controller';

@Module({
  imports: [PrismaModule, TodosModule],
  controllers: [AppController, CategoriesController],
  providers: [AppService],
})
export class AppModule {}
