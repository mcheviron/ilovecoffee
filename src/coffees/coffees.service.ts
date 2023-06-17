import { Injectable } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Shipwreck Roast',
      brand: 'Buddy Brew',
      flavors: ['chocolate', 'vanilla'],
    }
  ];

  findAll() {
    return this.coffees;
  }

  findOne(id: string) {
    return this.coffees.find((coffee) => coffee.id === +id);
  }

  new(coffee: any) {
    coffee = {
      id: this.coffees.length + 1,
      ...coffee,
    };
    this.coffees.push(coffee);
  }

  update(id: string, updatedFields: any): Coffee | null {
    const coffeeToUpdate = this.coffees.find(coffee => coffee.id === +id);
    if (!coffeeToUpdate) {
      return null;
    }

    const updatedCoffee = {
      ...coffeeToUpdate,
      ...updatedFields,
    };

    const coffeeIndex = this.coffees.indexOf(coffeeToUpdate);
    this.coffees[coffeeIndex] = updatedCoffee;

    return updatedCoffee;
  }

  replace(id: string, newCoffee: any): Coffee | null {
    const index = Number(id) - 1;
    const coffee = newCoffee;
    const coffeeArray = this.coffees;

    if (index >= 0 && index < coffeeArray.length) {
      coffeeArray[index] = coffee;
      return coffee;
    }

    return null;
  }

  remove(id: string): Coffee | null {
    const coffeeIndex = Number(id) - 1;
    const coffeeExists = coffeeIndex >= 0 && coffeeIndex < this.coffees.length;

    if (coffeeExists) {
      const [removedCoffee] = this.coffees.splice(coffeeIndex, 1);
      return removedCoffee;
    }

    return null;
  }
}
