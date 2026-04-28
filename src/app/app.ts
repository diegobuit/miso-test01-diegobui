import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SearchService } from './services/search.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  isDark = false;
  sidebarOpen = false;

  constructor(private searchService: SearchService) {}

  toggleDark(): void {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('dark', this.isDark);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchService.setTerm(term);
  }
}
