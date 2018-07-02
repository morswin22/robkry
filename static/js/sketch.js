
let canvas, $canvas;
function setup() {
	let container = $('.container');
	canvas = createCanvas(container.width(), container.width()*0.5625);
	$canvas = $(canvas.elt);
	$canvas.appendTo(container);
	$(window).resize(e=>{
		resizeCanvas(container.width(), container.width()*0.5625);
	})
}

function draw() {
	background(51);
	
}