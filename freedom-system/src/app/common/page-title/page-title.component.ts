import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent implements OnInit {

  pageTitle: String;

  constructor(private route: ActivatedRoute) {}
    
  ngOnInit() {
    this.pageTitle = this.route.snapshot.data['title'];
  }

}
