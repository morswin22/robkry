const maxHours = 12;

let pillars = [];
let delimeters = [];

let canvas, $canvas;
function setup() {
	let container = $('.container');
	container.addClass('text-center');
	canvas = createCanvas(container.width(), container.width()*0.5625);
	$canvas = $(canvas.elt);
	$canvas.appendTo(container);
	let $btn = $('<button class="btn btn-outline-primary my-3" />').html('Zapisz');
	$btn.click(e=>{
		e.preventDefault();
		let data = [];
		for(let pillar of pillars) {
			data.push({
				day: parseInt(pillar.day),
				hours: parseInt(pillar.val())
			});
		};
		$.ajax({
			url: '/save/'+userId,
			method: "POST",
			data: {
				month,
				data
			},
			success() {
				console.log('Zapisano');
			},
			error() {
				console.error('Błąd');
			}
		});
	})
	$btn.appendTo(container);
	$(window).resize(e=>{
		resizeCanvas(container.width(), container.width()*0.5625);
	})
	for(let i = 0; i<daysInMonth; i++) {
		pillars.push(new Pillar(i+1,((width-30)/daysInMonth)*i+30,height-30,((width-30)/daysInMonth)));
	}
	for(let i = 0; i<=maxHours; i++) {
		delimeters.push((height/(maxHours+1))*i+29);
	}
	for(let i in userData) {
		if (pillars[i].day == userData[i].day) {
			pillars[i].val(parseInt(userData[i].hours));
		}
	}
}

function draw() {
	background(255);

	delimeters = [];
	for(let i = 0; i<=maxHours; i++) {
		stroke(51);
		fill(51);
		text(maxHours-i,0,(height/(maxHours+1))*i+10);

		stroke(155);
		fill(155);
		line(0,(height/(maxHours+1))*i+29,width,(height/(maxHours+1))*i+29);
		delimeters.push((height/(maxHours+1))*i+29);
	}
	
	stroke(51);
	fill(51);
	for(let i = 0; i<daysInMonth; i++) {
		text(i+1,((width-30)/daysInMonth)*i+30,height);
		pillars[i].update(((width-30)/daysInMonth)*i+30,height-20,((width-30)/daysInMonth));
	}

	isDragging = (startDrag == true && stopDrag == false);
	if (isDragging) {
		for(let pillar of pillars) {
			if(pillar.containsX(startDragX)) {
				selected = pillar;
			}
		}
	}

	for(let pillar of pillars) {
		pillar.render();
	}

}

let startDrag = false; 
let stopDrag = true; 
let isDragging = false;
let startDragX = 0;
let startDragY = 0;
let selected = undefined;
function mousePressed() {
	if (stopDrag) {
		startDragX = mouseX;
		startDragY = mouseY;
		startDrag = true;
		stopDrag = false;
	}
}

function mouseDragged() {
	if (selected && isDragging) {
		selected.move(mouseY);
	}
}

function mouseClicked() {
	if (startDrag) {
		if (selected) {
			selected.move(mouseY);
			selected.stick(delimeters);
		}
		selected = undefined;
		startDrag = false;
		stopDrag = true;
		// TODO: on this call $.ajax
	}
}