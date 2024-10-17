import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, TokenExpiredError, verify } from "jsonwebtoken";
import { config } from '../config/config';
import { AuthRequest } from '../Interfaces/AuthRequest';
import { CustomJwtPayload } from '../Interfaces/CustomJwtPayload';

const jwtAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
   
    const authorization = req.headers.authorization;
    
    if (!authorization) {
        return res.status(401).json({ message: "Token not found" });
    }

    try {
       
        const token = authorization.split(" ")[1];

       
        const decoded = verify(token, config.jwt_key) as CustomJwtPayload;

        
        const _req = req as unknown as AuthRequest;
            _req.userId = decoded.userId as string;

    
        next();
        
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res.status(401).send("Expired token");
        } else if (error instanceof JsonWebTokenError) {
            return res.status(401).send("Invalid JWT token");
        } else {
            return res.status(401).send("Token verification failed");
        }
    }
}

export default jwtAuthMiddleware;
