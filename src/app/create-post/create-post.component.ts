import { Component, EventEmitter, Output } from '@angular/core';
import { Post } from '../post';
import { PostsService } from '../posts.service';
import { UsersService } from '../users.service';
import { User } from '../user';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent {
  posts: Post[] = [];
  response: string = "";

  @Output() postCreatedEvent: EventEmitter<Post> = new EventEmitter<Post>();

  constructor(private postsService: PostsService, private usersService: UsersService) {}

  newPost(body: string): void {
    this.usersService.getUser(localStorage.getItem("currentUser")).subscribe((user) => {
      this.postsService.newPost({ body, user_id: user.id } as Post).subscribe((post: Post) => {
        console.log(post);
        this.postCreatedEvent.emit(post);
      });
    },
    error => {
      this.response = error;
    });
  }
}
