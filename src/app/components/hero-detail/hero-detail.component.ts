import { Component, OnDestroy, OnInit } from '@angular/core';
import { Hero } from "../../api/models/hero";
import { ActivatedRoute } from "@angular/router";
import { HeroService } from "../../api/services/hero/hero.service";
import { Location } from "@angular/common";
import { finalize, Subject, takeUntil } from "rxjs";


@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss']
})
export class HeroDetailComponent implements OnInit, OnDestroy {
  private readonly destroyed$: Subject<void> = new Subject<void>();
  hero: Hero | undefined;
  loading: boolean = false;
  saving: boolean = false;
  saveDisabled: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getHero();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  getHero() {
    this.loading = true;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id)
      .pipe(
        finalize(() => this.loading = false),
        takeUntil(this.destroyed$))
      .subscribe(hero => this.hero = hero);
  }

  goBack() {
    this.location.back();
  }

  save() {
    if (this.hero) {
      this.saveDisabled = true;
      this.saving = true;
      this.heroService.updateHero(this.hero)
        .pipe(
          finalize(() => this.saving = false),
          takeUntil(this.destroyed$))
        .subscribe(() => this.goBack());
    }
  }
}
