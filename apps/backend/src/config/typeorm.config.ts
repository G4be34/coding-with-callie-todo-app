import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'gabrieljimenez',
  password: 'familia4eve',
  database: 'postgres',
  entities: [User],
  synchronize: true,
};
