import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../posts.service';
import { Post } from '../post';
import { LocalService } from '../local.service';
import { User } from '../user';
import { UsersService } from '../users.service';
import { ImageService } from '../image.service';
import {select, Store} from "@ngrx/store";
import {changePostState, changeCommentsState} from "../timeline/show-form.actions";
import {Observable} from "rxjs";
import {Comment} from "../comment";

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss'],
})
export class AccountDetailComponent {
  posts: Post[] = [];
  account: User = { id: 0, username: '', email: '', password: '', bio: '' };
  username: string | null = '';
  currentUser: string | null = '';
  isLogedIn: string | null = 'false';
  showForm: boolean = false;
  btnMessage: string = 'Update bio';
  commentsToPost: number = 0;
  showComments$!: Observable<number>;
  comments: Comment[] = [];

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private localStore: LocalService,
    private usersService: UsersService,
    private imageService: ImageService,
    private store: Store<{ showComments: number }>
  ) {
    this.showComments$ = store.select('showComments');
  }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username');

    this.usersService.getUser(this.username).subscribe((user) => {
      this.account = user;

      this.postsService.getPostsByUserId(this.account.id).subscribe((data) => {
        this.posts = data;
      });
    });

    this.currentUser = this.localStore.getData('currentUser');
    this.isLogedIn = this.localStore.getData('isLogedIn');
  }

  changCommentsState(postId: number): void {
    this.store.dispatch(changeCommentsState({ postId: postId }));

    this.showComments$.subscribe(value => {
      console.log(value);
      console.log(postId);
      this.commentsToPost = value;
      this.toggleComments(value);
    });
  }

  toggleComments(postId: number): void {
    //this.showComments = postId;

    this.postsService.getComments(postId).subscribe(data => {
      this.comments = data;
      console.log(this.comments);
    });
  }

  hideComments(): void {
    //this.showComments = 0;
    console.log('irbhguoer');
    this.store.dispatch(changeCommentsState({ postId: 0 }));
    this.comments = [];
  }

  onCommentCreated(comment: Comment): void {
    this.comments.unshift(comment);
  }

  likeComment(id: number): void {
    this.postsService.likeComment(id).subscribe(comment => {
      console.log(comment);

      const match = this.comments.find(c => c.id === comment.id);
      if (match) {
        const index = this.comments.indexOf(match);
        this.comments[index] = comment;
      }
    });
  }

  likePost(id: number): void {
    this.postsService.likePost(id).subscribe((post) => {
      console.log(post);

      const match = this.posts.find((p) => p.id === post.id);
      if (match) {
        const index = this.posts.indexOf(match);
        this.posts[index] = post;
      }
    });
  }

  repostPost(id: number): void {
    this.postsService.repostPost(id).subscribe((post) => {
      console.log(post);

      const match = this.posts.find((p) => p.id === post.id);
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

    if (this.showForm) this.btnMessage = 'Cancel';
    else this.btnMessage = 'Update bio';
  }

  saveBio(bio: string, id: number): void {
    this.usersService.saveBio({ bio } as User, id).subscribe((user) => {
      this.account = user;
    });

    this.showForm = !this.showForm;
    if (this.showForm) this.btnMessage = 'Cancel';
    else this.btnMessage = 'Update bio';
  }
}
