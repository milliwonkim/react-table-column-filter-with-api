import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(
    @Body() body: { username: string; password: string },
    @Res({ passthrough: true }) res: Response
  ) {
    const token = await this.authService.validateUserAndGetToken(
      body.username,
      body.password
    );

    if (!token) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // JWT 토큰을 쿠키로 설정
    res.cookie("access_token", token, {
      // httpOnly: true, // XSS 공격 방지
      secure: process.env.NODE_ENV === "production", // HTTPS에서만 전송
      sameSite: "strict", // CSRF 공격 방지
      maxAge: 60 * 60 * 1000, // 1시간 (밀리초)
      path: "/", // 모든 경로에서 접근 가능
    });

    // JSON 응답도 함께 반환 (passthrough: true로 인해 가능)
    return {
      success: true,
      message: "로그인 성공",
      access_token: token,
    };
  }
}
