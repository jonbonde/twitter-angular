import { User } from "./user";

export interface Post {
    id: number;
    body: string;
    likes_count: number;
    reposts_count: number;
    user_id: number;
    user?: User;
}