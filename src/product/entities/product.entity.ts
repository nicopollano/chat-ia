import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Product{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    category: string;
    
    @Column()
    brand: string;

    @Column('text', {array: true})
    colors: string[];

    @Column()
    price: string;

    @Column()
    quantity: number;

    @Column()
    info_about_product: string;

    @Column()
    extra_info: string;
}