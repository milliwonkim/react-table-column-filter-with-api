import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TasksController } from "./tasks.controller";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Module({
  imports: [
    JwtModule.register({
      secret: "supersecret",
      signOptions: { expiresIn: "1h" },
    }),
  ],
  controllers: [TasksController],
  providers: [JwtAuthGuard],
})
export class TasksModule {}
