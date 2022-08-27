
function Text(txt, location){
    this.txt = txt;
    this.location = location;
    this.color = '#0000FF'
    this.font = "12px Arial"
}

Text.prototype.draw = function(canvas) {
    const ctx = canvas.context;
    const offset_n = canvas.offset_n;
    const offset_e = canvas.offset_e;
    const r = canvas.r
    const x  =  (this.location.x - offset_n - 8 ) * r * 1.3;
    const y  =  (this.location.y- offset_e ) * r -  r;
    ctx.fillStyle = this.color
    ctx.font = this.font;
    ctx.fillText(this.txt, x, y);
}

Text.prototype.drawSimple = function(canvas) {
    const ctx = canvas.context;
    const offset_n = canvas.offset_n;
    const offset_e = canvas.offset_e;
    const r = canvas.r
    const x  =  (this.location.x - offset_n  ) * r ;
    const y  =  (this.location.y- offset_e ) * r ;
    ctx.fillStyle = this.color
    ctx.font = this.font;
    ctx.fillText(this.txt, x, y);
}