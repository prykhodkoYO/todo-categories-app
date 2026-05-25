import { Controller, Get } from '@nestjs/common';
import { TodosService } from '../todos/todos.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  getCategories() {
    return this.todosService.getCategories();
  }
}
