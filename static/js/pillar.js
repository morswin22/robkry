class Pillar {
    constructor(day, x, y, w) {
        this.day = day;
        this.pos = createVector(x-12,y);
        this.w = w - 4;
        this.h = -10;
        this.value = {top: 0, bottom: 0};
        this.maxY = height;
    }

    update(x, y, w) {
        this.pos.x = x-12;
        if (!isNaN(this.pos.y)) this.pos.y = constrain(this.pos.y, 20, y);
        this.maxY = y;
        this.w = w - 4;
        if (!isNaN(this.h)) this.h = -constrain(-this.h, 10, height);
        
    }

    containsX(x) {
        return (x > this.pos.x && x < this.pos.x + this.w);
    }

    grab(y) {
        let top = this.h+this.pos.y;
        let bottom = this.pos.y;
        let threshold = 5;
        if (abs(top - y) < threshold) {
            this.grabbed = {
                name: 'top',
                pos: top
            };
        } else if (abs(bottom - y) < threshold) {
            this.grabbed = {
                name: 'bottom',
                pos: bottom
            };
        }
    }

    move(y) {
        if (this.grabbed) {
            switch(this.grabbed.name) {
                case 'top':
                    this.h = y-this.pos.y;
                    break;
                case 'bottom':
                    let delta = y-this.grabbed.pos;
                    if (this.pos.y + delta <= this.maxY) {
                        this.pos.y += delta;
                        this.h -= delta;
                        this.grabbed.pos = this.pos.y;
                    }
                    break;
            }
        }
    }

    stick(delimeters) {
        if (this.grabbed) {
            let y, recordI, record;
            switch(this.grabbed.name) {
                case 'top':
                    y = this.pos.y + this.h;
                    recordI = undefined;
                    record = Infinity;
                    for(let i in delimeters) {
                        if (abs(delimeters[i] - y) < record) {
                            record = abs(delimeters[i] - y);
                            recordI = i;
                        }
                    }
                    if (recordI !== undefined) {
                        this.value.top = maxHours - recordI;
                        this.h = delimeters[recordI] - this.pos.y;
                    }
                    break;
                case 'bottom':
                    recordI = undefined;
                    record = Infinity;
                    for(let i in delimeters) {
                        if (abs(delimeters[i] - this.pos.y) < record) {
                            record = abs(delimeters[i] - this.pos.y);
                            recordI = i;
                        }
                    }
                    let topOffset = 0;
                    if (recordI !== undefined) {
                        this.value.bottom = maxHours - recordI;
                        topOffset = this.pos.y - delimeters[recordI];
                        this.pos.y = delimeters[recordI];
                    }  
                    this.h += topOffset;
                    break;
            }
        }
        this.grabbed = undefined;
    }

    val(num = undefined) {
        if (num) {
            this.pos.y = delimeters[maxHours - num.bottom];
            this.h = delimeters[maxHours - num.top] - this.pos.y;
            this.value = num;
        } else {
            let y, recordI, record;
            let topI = undefined;
            let bottomI = undefined;

            // top
            y = this.pos.y + this.h;
            recordI = undefined;
            record = Infinity;
            for(let i in delimeters) {
                if (abs(delimeters[i] - y) < record) {
                    record = abs(delimeters[i] - y);
                    recordI = i;
                }
            }
            if (recordI !== undefined) {
                topI = recordI;
            }

            // bottom
            recordI = undefined;
            record = Infinity;
            for(let i in delimeters) {
                if (abs(delimeters[i] - this.pos.y) < record) {
                    record = abs(delimeters[i] - this.pos.y);
                    recordI = i;
                }
            }
            if (recordI !== undefined) {
                bottomI = recordI;
            }

            // count up
            if (topI !== undefined && bottomI !== undefined) {
                this.value.total = abs((maxHours - topI) - (maxHours - bottomI));
            } else {
                this.value.total = 0;
            }
            return this.value;
        }
    }

    render() {
        if (selected == this) {
            stroke(20,255,20,255);
            fill(100,255,100,220);
        } else if (this.val().total > 0) {
            stroke(20,255,20,160);
            fill(100,255,100,160);
        } else {
            stroke(255,255,0,160);
            fill(255,255,80,160);
        }
        rect(this.pos.x, this.pos.y, this.w, this.h);
    }
}