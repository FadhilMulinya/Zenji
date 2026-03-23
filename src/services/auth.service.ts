import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/User.ts";
import { ENV } from "../lib/environments.ts";

export class AuthService {
    private readonly jwtSecret: string = ENV.JWT_SECRET;
    private readonly jwtRefreshSecret: string = ENV.JWT_REFRESH_SECRET;

    /**
     * Standard login with username and password
     */
    async login(user_name: string, password: string): Promise<{ user: IUser; token: string } | null> {
        const user = await User.findOne({ user_name });
        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.password || "");
        if (!isMatch) return null;

        const token = this.generateToken(user);
        return { user, token };
    }

    /**
     * Passwordless login for WhatsApp or Telegram
     */
    async loginById(id: string, platform: "whatsapp" | "telegram"): Promise<{ user: IUser; token: string } | null> {
        const query = platform === "whatsapp"
            ? { $or: [{ whatsapp_user_id: id }, { whatsapp_user_phone: id }] }
            : { telegram_user_id: id };
        const user = await User.findOne(query);

        if (!user) return null;

        const token = this.generateToken(user);
        return { user, token };
    }

    /**
     * Create a new user (Standard registration)
     */
    async register(userData: Partial<IUser>): Promise<IUser> {
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }
        const user = new User(userData);
        return await user.save();
    }

    /**
     * Generate JWT token
     */
    private generateToken(user: IUser): string {
        return jwt.sign(
            {
                id: user._id,
                user_name: user.user_name,
                whatsapp_user_id: user.whatsapp_user_id,
                telegram_user_id: user.telegram_user_id
            },
            this.jwtSecret,
            { expiresIn: "1d" }
        );
    }

    /**
     * Verify JWT token
     */
    verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.jwtSecret);
        } catch (error) {
            return null;
        }
    }
}

export const authService = new AuthService();
