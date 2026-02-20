/**
 * @file .ts
 * @description
 * @author Lucas
 * @license MIT
 */

import { DataSourceOptions, DataSource } from 'typeorm';
import { Env } from '@/config/env';

const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    url: Env.Pg.getConnectionURL(),
    synchronize: Env.Pg.sync,
    logging: Env.Pg.logging,

    entities: Env.App.entities,
    migrations: Env.App.migrations,
    subscribers: Env.App.subscribers
} as const;

export const dataSource = new DataSource(dataSourceOptions);
