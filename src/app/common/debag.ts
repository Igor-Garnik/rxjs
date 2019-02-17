import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export enum RxJsLoginLevel {
    TRACE,
    DEBUG,
    iNFO,
    ERROR,
    INFO
}

let rxjsLoginLevel = RxJsLoginLevel.INFO;

export function setRxJsLoginLevel(level: RxJsLoginLevel) {
    rxjsLoginLevel = level;
}

export const debug = (level: number, message: string) => 
    (sourse: Observable<any>) => sourse
        .pipe(
            tap(val => {
                if (level >= rxjsLoginLevel) {
                    console.log(message + ' :', val);
                }
            })
        )