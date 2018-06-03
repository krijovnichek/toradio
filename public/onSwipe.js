
// example: onSwipe(document.body, 'left', function(){ alert('left') })

function onSwipe(el, dir, cb, w, x, y, z) {
	try{
	for (y in {touchend: 0, touchstart: 0})
		el.addEventListener(y, function(ev) {
			w = ev.changedTouches[0];
			ev.type[5]=='e'
				&& (y = Math.abs)(z = x.pageX - w.pageX) > y(x.pageY - w.pageY)
				&& dir[0] == 'l' == z > 0
				&& y(z) > 42
				&& cb();
			x = w;
		});
}
catch (err) {
	console.log(err)
}
}