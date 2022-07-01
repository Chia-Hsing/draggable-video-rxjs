const { map, fromEvent, takeUntil, concatAll, withLatestFrom, filter } = require('rxjs');

const video = document.getElementById('video');
const anchor = document.getElementById('anchor');

fromEvent(document, 'scroll')
    .pipe(map((event) => anchor.getBoundingClientRect().bottom < 0))
    .subscribe((isBottom) => {
        if (isBottom) video.classList.add('video-fixed');
        else video.classList.remove('video-fixed');
    });

const mouseDown = fromEvent(video, 'mousedown');
const mouseUp = fromEvent(document, 'mouseup');
const mouseMove = fromEvent(document, 'mousemove');

const validValue = (value, max, min) => {
    return Math.min(Math.max(value, min), max);
};

const videoHeight = video.getBoundingClientRect().height;
const videoWidth = video.getBoundingClientRect().width;

mouseDown
    .pipe(filter((event) => video.classList.contains('video-fixed')))
    .pipe(
        map((event) => mouseMove.pipe(takeUntil(mouseUp))),
        concatAll()
    )
    .pipe(
        withLatestFrom(mouseDown, (move, down) => ({
            x: validValue(move.clientX - down.offsetX, window.innerWidth - videoWidth, 0),
            y: validValue(move.clientY - down.offsetY, window.innerHeight - videoHeight, 0),
        }))
    )
    .subscribe((pos) => {
        video.style.top = pos.y + 'px';
        video.style.left = pos.x + 'px';
    });
