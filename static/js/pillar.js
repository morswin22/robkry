class Pillar {
    constructor(day, x, y, w) {
        this.day = day;
        this.pos = createVector(x-12,y);
        this.w = w - 4;
        this.h = -10;
        this.value = 0;
    }

    update(x, y, w) {
        this.pos.x = x-12;
        this.pos.y = y;
        this.w = w - 4;
        this.h = -constrain(-this.h, 10, height);
    }

    containsX(x) {
        return (x > this.pos.x && x < this.pos.x + this.w);
    }

    move(y) {
        this.h = y-this.pos.y;
    }

    stick(delimeters) {
        let y = this.pos.y + this.h;
        for(let i in delimeters) {
            if (y < delimeters[i]) {
                this.value = maxHours - i;
                this.h = delimeters[i]-25 - this.pos.y;
                break;
            }
        }
    }

    val(num = undefined) {
        if (num) {
            this.h = delimeters[maxHours - num]-35 - this.pos.y;
            this.value = num;
        } else {
            return this.value;
        }
    }

    render() {
        stroke(20,255,20,160);
        fill(100,255,100,160);
        rect(this.pos.x, this.pos.y, this.w, this.h);
    }
}