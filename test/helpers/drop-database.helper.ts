import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";

export async function dropDatabase(configService: ConfigService): Promise<void> {
    let dataSource: DataSource;
    try {
        // create the connection dataSource
        dataSource = new DataSource({
            type: 'postgres',
            synchronize: configService.get('databaseConfig.synchronize'),
            database: configService.get('databaseConfig.database'),
            username: configService.get('databaseConfig.username'),
            password: configService.get('databaseConfig.password'),
            host: configService.get('databaseConfig.host'),
            port: +configService.get('databaseConfig.port'),
        });

        //test connection
        await dataSource.initialize();
        // Drop the database
        await dataSource.dropDatabase();

        // Close the connection
        await dataSource.destroy();
    } catch (error) {
        console.error('Error dropping database:', error);
        if (dataSource?.isInitialized) {
            await dataSource.destroy();
        }
        throw error;
    }
}
