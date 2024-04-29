import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env' });

const TypeORMMySqlTestingModule = (entities: any[]) =>
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: `${process.env.DB_HOST}`,
    port: parseInt(process.env.DB_PORT),
    username: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_NAME}`,
    autoLoadEntities: true,
    synchronize: true,
    migrations: ['dist/migrations/*.js'],
    entities: [...entities],
  });

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([User]),
        TypeORMMySqlTestingModule([User]),
      ],
      providers: [UsersService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('findOne', () => {
    it('retornar o primeiro usuário administrador', async () => {
      const user = await usersService.findOne(1);

      expect(user.email).toBe('israelmarmar@email.com');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
