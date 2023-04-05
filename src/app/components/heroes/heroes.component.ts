import { Component, OnDestroy, OnInit } from '@angular/core';
import { Hero } from "../../api/models/hero";
import { HeroService } from "../../api/services/hero/hero.service";
import { finalize, Subject, takeUntil } from "rxjs";


@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit, OnDestroy {
  private readonly destroyed$: Subject<void> = new Subject<void>();
  heroes: Hero[] = [];
  loading: boolean = false;
  saving: boolean = false;

  constructor(private heroService: HeroService) { }

  ngOnInit() {
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
      .subscribe(heroes => this.heroes = heroes);
  }

  add(name: string) {
    name = name.trim();
    if (!name) { return; }
    this.saving = true;
    this.heroService.addHero({ name } as Hero)
      .pipe(
        finalize(() => this.saving = false),
        takeUntil(this.destroyed$))
      .subscribe(hero => { this.heroes.push(hero) });
  }

  delete(hero: Hero) {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe();
  }

}
