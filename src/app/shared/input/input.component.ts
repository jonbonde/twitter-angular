import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {
  @Input() label: string = "";
  @Input() id: string = "";
  @Input() name: string = "";
  @Input() placeholder: string = "";
  @Input() type: string = "";
  @Input() for: string = "";
  @Input() referance: string = "";
  @Input() value: string = "";

  @ViewChild('inputElement') inputElement!: ElementRef;

  getValue(): string {
    return this.inputElement.nativeElement.value;
  }

  getValueInt(): number {
    return this.inputElement.nativeElement.value;
  }
}
