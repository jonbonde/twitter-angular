import { Component, EventEmitter, Output } from '@angular/core';
import { Post } from '../post';
import { PostsService } from '../posts.service';
import { UsersService } from '../users.service';
import { ImageService } from '../image.service';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent {
  posts: Post[] = [];
  response: string = '';
  selectedFile: File = new File([], 'empty.txt', { type: 'text/plain' });
  imageId: number | null = null;

  @Output() postCreatedEvent: EventEmitter<Post> = new EventEmitter<Post>();

  constructor(
    private postsService: PostsService,
    private usersService: UsersService,
    private imageService: ImageService
  ) {}

  newPost(body: string): void {
    if (this.selectedFile.name != 'empty.txt') {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);

      this.imageService.upload(formData).subscribe(
        (response) => {
          console.log('Dette er responsen');
          console.log(response);
        },
        (error) => {
          console.log('Dette er error');
          console.error(error);
        }
      );

      combineLatest([
        this.imageService.savePath({
          image_path: 'http://localhost:9000/images/' + this.selectedFile.name,
        }),
        this.usersService.getUser(localStorage.getItem('currentUser')),
      ]).subscribe(([cool, user]) => {
        this.imageId = cool.id;
        this.postsService
          .newPost({ body, user_id: user.id, image_id: this.imageId } as Post)
          .subscribe((post: Post) => {
            this.postCreatedEvent.emit(post);
          });
      });
    } else {
    this.usersService.getUser(localStorage.getItem('currentUser')).subscribe(
      (user) => {
        this.postsService
          .newPost({ body, user_id: user.id } as Post)
          .subscribe((post: Post) => {
            this.postCreatedEvent.emit(post);
          });
      },
      (error) => {
        this.response = error;
      }
    );
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = <File>event.target.files[0];
  }
}
