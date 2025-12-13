import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as relations from './relations';

const fullSchema = { ...schema, ...relations };

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  private client: ReturnType<typeof postgres>;
  public db: PostgresJsDatabase<typeof fullSchema>;

  constructor() {
    this.client = postgres(process.env.DATABASE_URL!);
    this.db = drizzle(this.client, { schema: fullSchema });
  }

  async onModuleInit() {
    // Connexion établie automatiquement
    console.log('✓ Drizzle ORM connecté à la base de données');
  }

  async onModuleDestroy() {
    await this.client.end();
    console.log('✓ Drizzle ORM déconnecté de la base de données');
  }
}

