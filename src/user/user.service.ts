import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm'
import { CraeteUserDTO } from './dtos/create-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository : Repository<User>,
    ){}

    async checkUser(username: string, password: string) : Promise<User>{
        const user = await this.userRepository.findOne({ where: { username, password }});
        
        return user;
    }

    async create(user: CraeteUserDTO){
        const {password, username} = user;
        const newUser = await this.userRepository.create({
            username,
            password
        });

        if(!newUser) throw new InternalServerErrorException("Cannot create username");

        return await this.userRepository.save(newUser);
    }
}
