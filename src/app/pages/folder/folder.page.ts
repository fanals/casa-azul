import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrinterService } from 'src/app/services/printer.service';

declare let cordova: any;

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;

  constructor(private activatedRoute: ActivatedRoute, private printer: PrinterService) {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }

  print() {
    this.printer.print();
  }

}
