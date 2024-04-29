import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

export class UserSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    const userData = {
      username: 'israelmarmar',
      name: 'Israel',
      lastname: 'Martins',
      email: 'israelmarmar@email.com',
      password: await bcrypt.hash('teste', 10),
      role: 'admin',
    };

    const userExists = await userRepository.findOneBy({
      email: userData.email,
    });

    if (!userExists) {
      const newUser = userRepository.create(userData);
      await userRepository.save(newUser);
    }
  }
}
