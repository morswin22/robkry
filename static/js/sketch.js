const maxHours = 24;
let total = 0;
let $total;

let pillars = [];
let delimeters = [];

let connection = true;

let canvas, $canvas;
function setup() {
	let container = $('.container');
	container.addClass('text-center');
	canvas = createCanvas(container.width(), container.width()*0.5625);
	$canvas = $(canvas.elt);
	$canvas.appendTo(container);
	$(window).resize(e=>{
		resizeCanvas(container.width(), container.width()*0.5625);
	})
	$total = $('<p>').css('text-align','center');
	$total.appendTo(container);

	createDelimeters();

	createPillars();
	initPillars();
}

function createPillars() {
	for(let i = 0; i<daysInMonth; i++) {
		pillars.push(new Pillar(i+1,((width-30)/daysInMonth)*i+30,height-30,((width-30)/daysInMonth)));
	}
}

function initPillars() {
	if (userData[year][month-1]) {
		for(let i in userData[year][month-1]) {
			if (userData[year][month-1][i] && pillars[i].day == userData[year][month-1][i].day) {
				pillars[i].val(userData[year][month-1][i].hours);
			}
		}
	}
}

function updatePillars() {
	for(let i = 0; i<daysInMonth; i++) {
		noStroke();
		fill(0);
		textAlign(LEFT, BOTTOM);
		text(i+1,((width-30)/daysInMonth)*i+30,height);
		pillars[i].update(
			((width-30)/daysInMonth)*i+30,
			height-20,
			((width)/daysInMonth)
		);
	}
}

function selectPillar() {
	if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
		isDragging = (startDrag == true && stopDrag == false);
		if (isDragging) {
			for(let pillar of pillars) {
				if(pillar.containsX(startDragX)) {
					selected = pillar;
					selected.grab(startDragY);
				}
			}
		}
	} else {
		selected = undefined;
	}
}

function renderPillars() {
	for(let pillar of pillars) {
		if (pillar != selected) {
			pillar.grab(pillar.h + pillar.pos.y); // grab top
			pillar.move(pillar.h + pillar.pos.y)
			pillar.stick(delimeters);
			pillar.grab(pillar.pos.y); // grab bottom
			pillar.move(pillar.pos.y)
			pillar.stick(delimeters);
			if (!isNaN(pillar.h)) pillar.h = -constrain(-pillar.h, 10, height);
		}
		pillar.render();
	}
}

function sumPillars() {
	total = 0;
	for(let pillar of pillars) {
		total += pillar.val().total;
	}
	$total.html('Łączna ilość przepracowanych godzin: '+total);
}

function createDelimeters() {
	for(let i = 0; i<=maxHours; i++) {
		delimeters.push(((height-20)/(maxHours+1))*i+20);
	}
}

function drawDelimeters() {
	for(let i = 0; i<=maxHours; i++) {
		let redundant = ((height-20)/(maxHours+1))*i+20;
		noStroke();
		fill(0);
		textAlign(LEFT, CENTER)
		text(maxHours-i,0,redundant);

		stroke(155);
		fill(155);
		line(15,redundant,width,redundant);
		delimeters.push(redundant);
	}
}

function checkConnection() {
	if (navigator.onLine != connection) {
		if (navigator.onLine) {
			$.notify('Odzyskano połączenie z internetem',{position:"top left",style:'bootstrap',className:'success'});
		} else {
			$.notify('Utracono połączenie z internetem',{position:"top left",style:'bootstrap',className:'error'});
		}
		connection = navigator.onLine;
	}
}

function draw() {
	checkConnection();

	background(255);

	delimeters = []; // delimeters reset
	drawDelimeters();
	
	updatePillars();
	selectPillar();
	renderPillars();

	if (selected) { // draw hours sum
		noStroke();
		fill(0);
		textAlign(RIGHT, CENTER);
		text(selected.val().total, mouseX-3, mouseY);
	}

	sumPillars();

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
			let data = [];
			for(let pillar of pillars) {
				data.push({
					day: parseInt(pillar.day),
					hours: pillar.val()
				});
			};
			$.ajax({
				url: '/save/'+userId,
				method: "POST",
				data: {
					year,
					month,
					data
				},
				success() {
					//console.log('Zapisano');
				},
				error() {
					$.notify('Błąd podczas zapisywania danych',{position:"top left",style:'bootstrap',className:'error'});
				}
			});
		}
		selected = undefined;
		startDrag = false;
		stopDrag = true;
	}
}