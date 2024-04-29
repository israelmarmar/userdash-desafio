import { DataSource } from 'typeorm';
import { runSeeder, Seeder } from 'typeorm-extension';
import { UserSeeder } from './UserSeeder';

export class MainSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    await runSeeder(dataSource, UserSeeder);
  }
}
