import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(createUserDto: CreateUserDto) {
    const existingEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    const existingUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUsername || existingEmail) {
      throw new ConflictException('Email or username already exists');
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    return this.userRepository.save(createUserDto);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async countRoles(): Promise<{ role: string; count: number }[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    const result = await queryBuilder
      .select('user.role  as role, COUNT(*) as count')
      .groupBy('user.role')
      .getRawMany();

    return result;
  }
}
