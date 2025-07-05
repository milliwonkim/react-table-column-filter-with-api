import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  // 임시 유저 (실제 DB 대신)
  private users = [{ id: 1, username: "test", password: "test123" }];

  constructor(private readonly jwtService: JwtService) {}

  async validateUserAndGetToken(
    username: string,
    password: string
  ): Promise<string | null> {
    const user = this.users.find(
      (u) => u.username === username && u.password === password
    );
    if (!user) return null;
    const payload = { sub: user.id, username: user.username };
    return this.jwtService.signAsync(payload);
  }
}
