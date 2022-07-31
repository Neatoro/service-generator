import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
class Person {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    firstName: string;
    @Column()
    lastName: string;
    @Column()
    age: number;
}
