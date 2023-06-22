import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { CreateCoffeeDto } from './dto/create-coffee.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}
  @Get()
  async findAll(@Query() paginationQuery) {
    return await this.coffeesService.findAll(paginationQuery);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.coffeesService.findOne(id);
  }

  @Post()
  async create(@Body() coffee: CreateCoffeeDto) {
    return await this.coffeesService.create(coffee);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() changes: UpdateCoffeeDto) {
    const coffee = await this.coffeesService.update(id, changes);
    if (!coffee) {
      throw new NotFoundException(`Coffe with id: ${id} not found`);
    }
    return coffee;
  }

  @Put(':id')
  async replace(@Param('id') id: string, @Body() newCoffee: CreateCoffeeDto) {
    return await this.coffeesService.replace(id, newCoffee);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.coffeesService.remove(id);
  }
}
