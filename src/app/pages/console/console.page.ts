import { Component, OnInit } from '@angular/core';
import { ConsoleService } from 'src/app/services/console.service';

@Component({
  selector: 'app-console',
  templateUrl: './console.page.html',
  styleUrls: ['./console.page.scss'],
})
export class ConsolePage implements OnInit {

  constructor(public console:ConsoleService) {}

  ngOnInit() {
  }

}
