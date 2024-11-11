import { User } from "./User";

export default interface News {
    id: number;
    title: string;
    content: string;
    image: string;
    created_at: Date;
    user?: User; 

}
