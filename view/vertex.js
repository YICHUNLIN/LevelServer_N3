

// vertex
function Vertex(name, x, y, elevation){
    this.name = name;
    this.n = x;
    this.e = y;
    this.ele = elevation;
    this.color = "#FF0000";
    this.pointSize = 2.5
}

Vertex.prototype.copy = function(){
    return new Vertex(this.name, this.n, this.e, this.ele)
}

Vertex.prototype.setColor = function(color) {
    this.color = color;
}

Vertex.prototype.getCanvasLocation = function(canvas){
    const offset_n = canvas.offset_n;
    const offset_e = canvas.offset_e;
    const r = canvas.r
    const n = (this.n - offset_n) * r;
    const e =  (this.e - offset_e) * r;
    return {y: e, x: n}
}

Vertex.prototype.draw = function(canvas) {
    const ctx = canvas.context;
    const offset_n = canvas.offset_n;
    const offset_e = canvas.offset_e;
    const r = canvas.r
    const n = (this.n - offset_n) * r;
    const e =  (this.e - offset_e) * r;
    ctx.font = "20px Arial";
    ctx.fillStyle = this.color;
    ctx.fillRect(n - this.pointSize/2, e - this.pointSize/2, this.pointSize,this.pointSize);
}