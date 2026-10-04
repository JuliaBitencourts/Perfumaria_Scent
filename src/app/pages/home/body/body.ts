import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-body',
  standalone: true,
  imports:[RouterOutlet],
  styleUrl: './body.css',
  templateUrl: './body.html',
})
export class Body {}
