/// line
function Line(v1, v2) {
    this.v1 = v1;
    this.v2 = v2;
    this.color = "#000000"
}
Line.prototype.setColor = function(color) {
    this.color = color;
}
Line.prototype.draw = function(canvas) {
    const ctx = canvas.context;
    const offset_n = canvas.offset_n;
    const offset_e = canvas.offset_e;
    const r = canvas.r
    ctx.beginPath();
    ctx.moveTo((this.v1.n - offset_n) * r, (this.v1.e - offset_e ) * r)
    ctx.lineTo((this.v2.n - offset_n) * r, (this.v2.e - offset_e ) * r);
    ctx.strokeStyle = this.color
    ctx.stroke();
}

Line.prototype.vertexDistance = function(vertex){
    const m = (this.v1.e - this.v2.e) / (this.v1.n - this.v2.n);
    const y = m * (vertex.n - this.v1.n) + this.v1.e;
    return y.toFixed(3);
}

Line.prototype.slope = function(){
    return (Math.abs((this.v1.e - this.v2.e) / (this.v1.n - this.v2.n)) * 100).toFixed(3)
}

Line.prototype.distance = function() {
    return Math.sqrt((this.v1.n - this.v2.n) * (this.v1.n - this.v2.n) + (this.v1.e - this.v2.e) * (this.v1.e - this.v2.e))
}