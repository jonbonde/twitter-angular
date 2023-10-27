import { Component, ElementRef, ViewChild } from '@angular/core';
import { UsersService } from '../users.service';
import { User } from '../user';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  result!: User[];
  @ViewChild('searchInput', { static: false }) searchElement!: ElementRef;

  constructor(private usersService: UsersService) {}

  onInputChange(event: Event): void {
    const searchVal = (event.target as HTMLInputElement).value;
    if (!searchVal) {
      this.result = [];
      return;
    }
    this.searchUsers(searchVal);
  }

  searchUsers(search: string): void {
    this.usersService.searchUsers(search).subscribe((users) => {
      this.result = users;
    });
  }

  clear(): void {
    this.result = [];
    console.log('Hoppsann heisann svisjen sveisann der feis han');
    console.log('SHAMBALAYA Dette er valuen ' + this.searchElement.nativeElement.value);
    this.searchElement.nativeElement.value = '';
  }
}
