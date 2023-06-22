import { InjectRepository } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Flavour } from './entities/flavour.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';

export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeesRepository: Repository<Coffee>,
    @InjectRepository(Flavour)
    private readonly flavoursRepository: Repository<Flavour>,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto): Promise<Coffee[]> {
    const { limit, offset } = paginationQuery;
    return await this.coffeesRepository.find({
      skip: offset,
      take: limit,
      relations: ['flavours'],
    });
  }

  async findOne(id: string): Promise<Coffee> {
    const coffee = await this.coffeesRepository.findOne({
      where: { id: +id },
      relations: ['flavours'],
    });

    if (!coffee) {
      throw new NotFoundException(`Coffe with id: ${id} not found`);
    }

    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto): Promise<Coffee> {
    const flavours = await Promise.all(
      createCoffeeDto.flavours.map((flavour) => this.preloadFlavour(flavour)),
    );
    return await this.coffeesRepository.save({ ...createCoffeeDto, flavours });
  }

  async replace(id: string, createCoffeeDto: CreateCoffeeDto): Promise<Coffee> {
    const coffee = await this.coffeesRepository.findOneBy({ id: +id });
    if (!coffee) {
      throw new NotFoundException(`Coffe with id: ${id} not found`);
    }
    const flavours = await Promise.all(
      createCoffeeDto.flavours.map((flavour) => this.preloadFlavour(flavour)),
    );
    const newCoffee = await this.coffeesRepository.preload({
      id: +id,
      ...createCoffeeDto,
      flavours,
    });
    return await this.coffeesRepository.save(newCoffee);
  }

  async update(id: string, updatedFields: UpdateCoffeeDto): Promise<Coffee> {
    const exists = await this.coffeesRepository.findOneBy({ id: +id });
    if (!exists) {
      throw new NotFoundException(`Coffe with id: ${id} not found`);
    }

    const flavours =
      updatedFields.flavours &&
      (await Promise.all(
        updatedFields.flavours.map((flavour) => this.preloadFlavour(flavour)),
      ));
    const updatedCoffee = await this.coffeesRepository.preload({
      id: +id,
      ...updatedFields,
      flavours,
    });
    return await this.coffeesRepository.save(updatedCoffee);
  }

  async remove(id: string) {
    const coffeToRemove = await this.coffeesRepository.findOneBy({ id: +id });
    if (coffeToRemove) {
      return await this.coffeesRepository.remove(coffeToRemove);
    }
    throw new NotFoundException(`Coffe with id: ${id} not found`);
  }
  private async preloadFlavour(name: string): Promise<Flavour> {
    const existingFlavour = await this.flavoursRepository.findOneBy({ name });
    if (existingFlavour) {
      return existingFlavour;
    }
    return this.flavoursRepository.create({ name });
  }
}
