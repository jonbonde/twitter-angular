import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {PostsService} from '../posts.service';
import {Post} from '../post';
import { User } from '../user';
import {Comment} from "../comment";
import {Observable} from 'rxjs';
import {CreatePostComponent} from '../create-post/create-post.component';
import {LocalService} from '../local.service';
import {UsersService} from '../users.service';
import {ImageService} from '../image.service';
import {select, Store} from "@ngrx/store";
import {changePostState, changeCommentsState} from "./show-form.actions";
import { Like } from '../like';

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
    commentsToPost: number = 0;
    currentUser: string | null = "";
    isLogedIn: string | null = "false";
    showForm$!: Observable<boolean>;
    showComments$!: Observable<number>;
    user_id!: number;
    likedPosts!: number[];

    constructor(private postsService: PostsService, private localStore: LocalService, private usersService: UsersService, private imageService: ImageService, private store: Store<{
        showForm: boolean,
        showComments: number
    }>) {
        this.showForm$ = store.select('showForm');
        this.showComments$ = store.select('showComments');
    }

    ngOnInit(): void {
        this.postsService.getPosts().subscribe((data) => {
            this.posts = data;
        });
        this.currentUser = this.localStore.getData("currentUser");
        this.isLogedIn = this.localStore.getData("isLogedIn");

        this.showComments$.subscribe(value => {
            console.log(value);
            this.commentsToPost = value;
            this.toggleComments(value);
        });

        this.showForm$.subscribe(value => {
            console.log(value);
            if (value)
                this.toggleMessage = "Cancel";
            else
                this.toggleMessage = "Make new post";
        });

        this.usersService.getUserId(this.currentUser !== null ? this.currentUser : "").subscribe((user: number) => {
            this.user_id = user;
            console.log("Første gang user id " + this.user_id);

            this.postsService.getLikedPosts(this.user_id).subscribe(data => {
                this.likedPosts = new Array(data.length);
                for (let index = 0; index < data.length; index++) {
                    this.likedPosts[index] = data[index].post_id;
                }
                console.log("Dette er liked posts" + this.likedPosts);
            });
        });
    }

    changCommentsState(postId: number): void {
        this.store.dispatch(changeCommentsState({ postId: postId }));
    }

    changePostState() {
        this.store.dispatch(changePostState());
    }

    likePost(id: number, post_id: number): void {
        this.postsService.likePost(id, post_id, this.user_id).subscribe(post => {
            console.log(post);

            const match = this.posts.find(p => p.id === post.id);
            if (match) {
                const index = this.posts.indexOf(match);
                this.posts[index] = post;
            }
        });
    }

    likeComment(id: number): void {
        this.postsService.likeComment(id, this.user_id).subscribe(comment => {
            console.log(comment);

            const match = this.comments.find(c => c.id === comment.id);
            if (match) {
                const index = this.comments.indexOf(match);
                this.comments[index] = comment;
            }
        });
    }

    repostPost(id: number, post_id: number): void {
        this.postsService.repostPost(id, post_id, this.user_id).subscribe(post => {
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

    onPostCreated(post: Post): void {
        this.posts.unshift(post);
    }

    onCommentCreated(comment: Comment): void {
        this.comments.unshift(comment);
    }

    protected readonly parseInt = parseInt;
}
