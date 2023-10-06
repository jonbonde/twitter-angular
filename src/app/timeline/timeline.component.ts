import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { PostsService } from '../posts.service';
import { Post } from '../post';
import { Comment } from "../comment";
import { Observable } from 'rxjs';
import { CreatePostComponent } from '../create-post/create-post.component';
import { LocalService } from '../local.service';
import { UsersService } from '../users.service';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent {
  posts: Post[] = [];
  comments: Comment[] = [];
  public showForm: boolean = false;
  public toggleMessage: string = "Make new post";
  showComments: number = 0;
  currentUser: string | null = "";
  isLogedIn: string | null = "false";

  constructor(private postsService: PostsService, private localStore: LocalService, private usersService: UsersService, private imageService: ImageService) {}

  ngOnInit(): void {
    this.postsService.getPosts().subscribe((data) => {
      this.posts = data;
    });
    this.currentUser = this.localStore.getData("currentUser");
    this.isLogedIn = this.localStore.getData("isLogedIn");
  }

  likePost(id: number): void {
    this.postsService.likePost(id).subscribe(post => {
      console.log(post);

      const match = this.posts.find(p => p.id === post.id);
      if (match) {
        const index = this.posts.indexOf(match);
        this.posts[index] = post;
      }
    });
  }

  likeComment(id: number): void {
    this.postsService.likeComment(id).subscribe(comment => {
      console.log(comment);

      const match = this.comments.find(c => c.id === comment.id);
      if (match) {
        const index = this.comments.indexOf(match);
        this.comments[index] = comment;
      }
      //this.comments = this.comments.sort((a, b) => a.likes_count < b.likes_count ? 1 : -1);
    });
  }

  repostPost(id: number): void {
    this.postsService.repostPost(id).subscribe(post => {
      console.log(post);

      const match = this.posts.find(p => p.id === post.id);
      if (match) {
        const index = this.posts.indexOf(match);
        this.posts[index] = post;
      }
    });
  }

  deletePost(id: number, imageName: string | undefined): void {
    const formData = new FormData();
    formData.append('file', "images/" + imageName?.substring(imageName.lastIndexOf('/') + 1));

    this.postsService.deletePost(id).subscribe(post => {
      console.log(post);
      const match = this.posts.find(p => p.id === post.id);
      if (match) {
        const index = this.posts.indexOf(match);
        this.posts.splice(index, 1);
      }
    });

    if (imageName) {
      this.imageService.deleteImage(formData).subscribe((image) => {
        console.log(image);
      })

      this.imageService.deletePath(imageName).subscribe((image) => {
        console.log(image);
      });
    }
  }

  toggleForm(): void {
    this.showForm = !this.showForm;

    if (this.showForm)
      this.toggleMessage = "Cancel";
    else
      this.toggleMessage = "Make new post";
  }

  toggleComments(postId: number): void {
    this.showComments = postId;

    this.postsService.getComments(postId).subscribe(data => {
      this.comments = data;
      console.log(this.comments);
    });
  }

  hideComments(): void {
    this.showComments = 0;
    this.comments = [];
  }

  onPostCreated(post: Post): void {
    this.posts.unshift(post);
  }

  onCommentCreated(comment: Comment): void {
    this.comments.unshift(comment);
  }
}
