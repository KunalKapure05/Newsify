import { JwtPayload } from "jsonwebtoken";

export interface CustomJwtPayload extends JwtPayload{
    name?: string;
}

