import { Role } from 'src/common/decorators/role.decorator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    surname: string;

    @Column({ default: Role.user })
    role: Role;
    
}