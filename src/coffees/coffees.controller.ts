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
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}
  @Get()
  findAll() {
    // findAll(@Query() paginationQuery) {
    return this.coffeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const coffee = this.coffeesService.findOne(id + '');
    if (!coffee) {
      throw new NotFoundException(`Coffe with id: ${id} not found`);
    }
    return coffee;
  }

  @Post()
  create(@Body() coffee: CreateCoffeeDto) {
    this.coffeesService.new(coffee);
    return coffee;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() changes: UpdateCoffeeDto) {
    const coffee = this.coffeesService.update(id, changes);
    if (!coffee) {
      throw new NotFoundException(`Coffe with id: ${id} not found`);
    }
    return coffee;
  }

  @Put(':id')
  replace(@Param('id') id: string, @Body() coffee: CreateCoffeeDto) {
    return this.coffeesService.replace(id, coffee);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    const coffee = this.coffeesService.remove(id);
    if (!coffee) {
      throw new NotFoundException(`Coffe with id: ${id} not found`);
    }
    return coffee;
  }
}
