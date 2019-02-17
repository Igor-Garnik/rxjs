import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { noop, interval, timer, fromEvent, of, concat } from 'rxjs';
import { createHttpObservable } from '../common/util';
import { map } from 'rxjs/operators';

const interval$ = interval(1000);
  // interval$.subscribe((data: number) => console.log(data));

  const timer$ = timer(3000, 1000);
  // timer$.subscribe(val => console.log('timer : ' + val));

  const click$ = fromEvent(document, 'click');
  // click$.subscribe(
  //   evt => console.log(evt),
  //   err => console.log(err),
  //   () => console.log('compleated')
  // );

  const source1$ = of(1, 2, 3);
  const source2$ = of(4, 5, 6);
  const result = concat(source1$, source2$);
  // result.subscribe(console.log);
  
@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() {}

  ngOnInit() {
    const http$ = createHttpObservable('/api/courses');

    const courses$ = http$
      .pipe(
        map(res => res['payload'])
      )
      
      courses$.subscribe(
      courses => console.log(courses),
      noop,    
      () => console.log('comleated')
    );
  }

}
