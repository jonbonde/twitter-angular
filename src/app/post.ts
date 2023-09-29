import { Image } from "./image";
import { User } from "./user";

export interface Post {
    id: number;
    body: string;
    likes_count: number;
    reposts_count: number;
    user_id: number;
    user?: User;
    image_id: number;
    image?: Image;
}