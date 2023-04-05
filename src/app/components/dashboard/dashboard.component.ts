import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeroService } from "../../api/services/hero/hero.service";
import { Hero } from "../../api/models/hero";
import { finalize, Subject, takeUntil } from "rxjs";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly destroyed$: Subject<void> = new Subject<void>();
  heroes: Hero[] = [];
  loading: boolean = false;

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  getHeroes() {
    this.loading = true;
    this.heroService.getHeroes()
      .pipe(
        finalize(() => this.loading = false),
        takeUntil(this.destroyed$))
      .subscribe(heroes => this.heroes = heroes.slice(1, 5));
  }
}
