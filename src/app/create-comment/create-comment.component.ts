import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { PostsService } from '../posts.service';
import {Comment} from "../comment";

@Component({
  selector: 'app-create-comment',
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.scss']
})
export class CreateCommentComponent {
  @Input() id: string = "";
  @Output() commentCreatedEvent: EventEmitter<Comment> = new EventEmitter<Comment>();
  @ViewChild('body') bodyElement!: ElementRef;

  constructor(
      private postsService: PostsService
  ) {}

  newComment(body: string, postId: number): void {
    this.postsService.newComment({body: body, post_id: postId}).subscribe((comment: Comment) => {
      this.commentCreatedEvent.emit(comment);
    });

    this.bodyElement.nativeElement.value = '';
  }

  protected readonly parseInt = parseInt;
}
