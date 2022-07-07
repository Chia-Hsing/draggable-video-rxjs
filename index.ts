import { EMPTY, bufferTime, map, mergeAll, fromEvent, takeUntil, concatAll, withLatestFrom, filter, startWith, scan, merge } from 'rxjs';

const video = document.getElementById('video')!;
const anchor = document.getElementById('anchor')!;

fromEvent(document, 'scroll')
    .pipe(map((_event: any) => anchor.getBoundingClientRect().bottom < 0))
    .subscribe((isBottom: any) => {
        if (isBottom) video.classList.add('video-fixed');
        else video.classList.remove('video-fixed');
    });

const mouseDown = fromEvent(video, 'mousedown');
const mouseUp = fromEvent(document, 'mouseup');
const mouseMove = fromEvent(document, 'mousemove');

const validValue = (value: any, max: any, min: any) => {
    return Math.min(Math.max(value, min), max);
};

const videoHeight = video.getBoundingClientRect().height;
const videoWidth = video.getBoundingClientRect().width;

mouseDown
    .pipe(filter((_event: any) => video.classList.contains('video-fixed')))
    .pipe(
        map((_event: any) => mouseMove.pipe(takeUntil(mouseUp))),
        concatAll()
    )
    .pipe(
        withLatestFrom(mouseDown, (move: any, down: any) => ({
            x: validValue(move.clientX - down.offsetX, window.innerWidth - videoWidth, 0),
            y: validValue(move.clientY - down.offsetY, window.innerHeight - videoHeight, 0),
        }))
    )
    .subscribe((pos: any) => {
        video.style.top = pos.y + 'px';
        video.style.left = pos.x + 'px';
    });
