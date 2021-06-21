import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-zoom-in',
  templateUrl: './zoom-in.component.html',
  styleUrls: ['./zoom-in.component.scss']
})
export class ZoomInComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ZoomInComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log(data);
  }

  ngOnInit() {

  }

}
