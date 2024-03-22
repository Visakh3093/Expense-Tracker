import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private firestore:Firestore){}
  title = 'expense_tracker';

  ngOnInit(): void {
    
  }
}
