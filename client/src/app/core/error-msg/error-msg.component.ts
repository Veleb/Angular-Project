import { Component, OnInit } from '@angular/core';
import { ErrorMsgService } from './error-msg.service';

@Component({
  selector: 'app-error-msg',
  standalone: true,
  imports: [],
  templateUrl: './error-msg.component.html',
  styleUrl: './error-msg.component.css'
})
export class ErrorMsgComponent implements OnInit {
  errorMsg: string = '';

  constructor(private errorMsgService: ErrorMsgService) {}

  ngOnInit(): void {
    this.errorMsgService.errorMsg$.subscribe((error: any) => {
      this.errorMsg = error?.message;

      setTimeout(() => {
        this.errorMsg = '';
      }, 3000);
    })
  }
}
