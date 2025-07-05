import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TasksModule } from "./tasks/tasks.module";
import { AuthModule } from "./auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     type: "postgres",
    //     host: config.get("DB_HOST"),
    //     port: parseInt(config.get("DB_PORT"), 10),
    //     username: config.get("DB_USERNAME"),
    //     password: config.get("DB_PASSWORD"),
    //     database: config.get("DB_DATABASE"),
    //     autoLoadEntities: true,
    //     synchronize: true, // 운영 환경에서는 false 권장
    //   }),
    // }),
    TasksModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
