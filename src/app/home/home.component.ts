import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, Observable, of, timer, noop, throwError} from 'rxjs';
import {catchError, delayWhen, map, retryWhen, shareReplay, tap, finalize} from 'rxjs/operators';
import { createHttpObservable } from '../common/util';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    beginnerCourses$: Observable<Course[]>;
    advancedCourses$: Observable<Course[]>;

    ngOnInit() {
        const http$: Observable<Course[]> = createHttpObservable('/api/courses');

        const courses$ = http$
            .pipe(
                tap(() => console.log('Http request executed')),
                map(res => res['payload']),
                shareReplay(),
                retryWhen(errors => errors.pipe(
                    delayWhen(() => timer(2000)) //отстрочка на 2 секунды, после новая подписка 
                ))
            )

        // const courses$ = http$
        //     .pipe(
        //         catchError(err => {
        //             console.log('Error ocured : ' + err)
        //             return throwError(err);
        //         }),
        //         finalize(() => {
        //             console.log('Finalize executed :')
        //         }),
        //         tap(() => console.log('Http request executed')),
        //         map(res => res['payload']),
        //         shareReplay(),
        //     )

        this.beginnerCourses$ = courses$
            .pipe(
                map(courses => courses
                    .filter(course => course.category = 'BEGINNER'))
            );

        this.advancedCourses$ = courses$
            .pipe(
                map(courses => courses
                    .filter(course => course.category = 'ADVANCED'))
            );
    }
}
