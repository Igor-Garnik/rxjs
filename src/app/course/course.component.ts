import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import { createHttpObservable } from '../common/util';
import { $ } from 'protractor';
import { debug, RxJsLoginLevel } from '../common/debag';

@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;
    courseId: string;

    @ViewChild('searchInput') input: ElementRef;

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this. courseId = this.route.snapshot.params['id'];
        this.course$ = createHttpObservable(`/api/courses/${this.courseId}`)
            .pipe(
                debug(RxJsLoginLevel.INFO, 'course value')
            )
    }

    ngAfterViewInit() {
        this.lessons$= fromEvent<any>(this.input.nativeElement, 'keyup')
            .pipe(
                map(event => event.target.value),
                startWith(''),
                debug(RxJsLoginLevel.INFO, 'search'),
                debounceTime(400),
                // tap((search) => console.log('search : ' + search)), 
                distinctUntilChanged(),
                switchMap(search => this.loadLessons(search)),
                debug(RxJsLoginLevel.INFO, 'lessons value')
            )
    }

    loadLessons(search: string = ''): Observable<Lesson[]> {
        return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
            .pipe(
                map(res => res['payload'])
            );
    }
}
