import { Post } from "./post";

export interface Comment {
    id: number;
    body: string;
    likes_count: number;
    post_id: number;
    post: Post;
}