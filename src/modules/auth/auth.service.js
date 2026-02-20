import pkg from "../../models/index.cjs";
import { AppError } from "../../utils/app_error.js";
import { hash_password, compare_password } from "../../utils/password.js";
import { sign_token } from "../../utils/jwt.js";

const { User } = pkg;

export const register_user_service = async (payload) => {
    const { first_name, last_name, email, phone, password } = payload;

    const existing = await User.findOne({
        where: { email }
    });

    if (existing) {
        throw new AppError(
            "User already exists",
            400,
            "USER_ALREADY_EXISTS"
        );
    }

    const password_hash = await hash_password(password);

    const user = await User.create({
        first_name,
        last_name,
        email,
        phone,
        password: password_hash,
        role: "USER"
    });

    //exclude password hash from returned user object
    const new_user = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at
    }
    return new_user;
};

export const login_user_service = async (payload) => {
    const { email, password } = payload;

    const user = await User.findOne({ where: { email }, attributes: { exclude: ["password"] } });

    if (!user) {
        throw new AppError(
            "Invalid credentials",
            401,
            "AUTH_INVALID_CREDENTIALS"
        );
    }

    const is_match = await compare_password(
        password,
        user.password_hash
    );

    if (!is_match) {
        throw new AppError(
            "Invalid credentials",
            401,
            "AUTH_INVALID_CREDENTIALS"
        );
    }

    const token = sign_token({
        sub: user.id,
        role: user.role
    });

    return { user, token };
};
