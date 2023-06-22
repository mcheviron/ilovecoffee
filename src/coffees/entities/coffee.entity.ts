import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Flavour } from './flavour.entity';

@Entity()
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  brand: string;

  @JoinTable()
  // cascade can be narrowed down to inserts only by ['insert']
  @ManyToMany(() => Flavour, (flavour) => flavour.coffees, { cascade: true })
  flavours: Flavour[];
}
