import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

config();

const ds = new DataSource({
  type: 'sqlite',
  database: process.env.SQLITE_DB || './data/app.sqlite',
  entities: [User],
  synchronize: true,
});

async function run() {
  await ds.initialize();
  const repo = ds.getRepository(User);

  const email = process.env.ADMIN_EMAIL!;
  const pass = process.env.ADMIN_PASSWORD!;

  let u = await repo.findOne({ where: { email } });
  if (!u) {
    u = repo.create({
      email,
      passwordHash: await bcrypt.hash(pass, 10),
      role: 'admin',
    });
    await repo.save(u);
    console.log('Admin created:', email);
  } else {
    console.log('Admin exists:', email);
  }
  await ds.destroy();
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
