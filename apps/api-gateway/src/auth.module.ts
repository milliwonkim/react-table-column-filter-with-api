import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";

@Module({
  imports: [
    JwtModule.register({
      secret: "supersecret", // 실제 서비스에서는 환경변수 사용 권장
      signOptions: { expiresIn: "1h" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
