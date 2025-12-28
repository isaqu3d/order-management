import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../configs/env';
import { User } from '../models/User';
import { IAuthResponse, ILoginRequest, IRegisterRequest } from '../types/user.types';

export class AuthService {
  async register(data: IRegisterRequest): Promise<IAuthResponse> {
    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      email: data.email,
      password: hashedPassword,
    });

    const token = this.generateToken(user._id.toString());

    return {
      token,
      user: {
        _id: user._id.toString(),
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async login(data: ILoginRequest): Promise<IAuthResponse> {
    const user = await User.findOne({ email: data.email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user._id.toString());

    return {
      token,
      user: {
        _id: user._id.toString(),
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, env.jwtSecret, { expiresIn: '7d' });
  }

  verifyToken(token: string): { userId: string } {
    try {
      const decoded = jwt.verify(token, env.jwtSecret) as { userId: string };
      return decoded;
    } catch {
      throw new Error('Invalid token');
    }
  }
}

export const authService = new AuthService();
