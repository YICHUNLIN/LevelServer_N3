/**
 * E 上下 y
 * N 左右 x
 */
function DataPatch() {
    this.xhttp = new XMLHttpRequest();
}

DataPatch.prototype.getData = function(ratio) {
    ratio = ratio || 1;
    return new Promise((resolve, reject) => {
        this.xhttp.open("GET", `http://localhost:3000/data`);
        this.xhttp.onload = function() {
            try{
                resolve(JSON.parse(this.responseText))
            }catch(err) {
                reject(err)
            }
        }
        this.xhttp.send();
    })
}


// vertex
function Vertex(name, N, E, elevation){
    this.name = name;
    this.n = N;
    this.e = E;
    this.ele = elevation;
    this.color = "#FF0000";
}

Vertex.prototype.setColor = function(color) {
    this.color = color;
}

Vertex.prototype.draw = function(canvas) {
    const ctx = canvas.context;
    const offset_n = canvas.offset_n;
    const offset_e = canvas.offset_e;
    const r = canvas.r
    const pointSize = 3.5;
    const n = (this.n - offset_n) * r;
    const e =  (this.e - offset_e) * r;
    ctx.font = "20px Arial";
    ctx.fillStyle = this.color;
    ctx.fillRect(n - pointSize/2, e - pointSize/2, pointSize,pointSize);
}


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

Line.prototype.slope = function(){
    return Math.abs((this.v1.e - this.v2.e) / (this.v1.n - this.v2.n)) * 100
}

Line.prototype.distance = function() {
    return Math.sqrt((this.v1.n - this.v2.n) * (this.v1.n - this.v2.n) + (this.v1.e - this.v2.e) * (this.v1.e - this.v2.e))
}

function Text(txt, location){
    this.txt = txt;
    this.location = location;
}

Text.prototype.draw = function(canvas) {
    const ctx = canvas.context;
    const offset_n = canvas.offset_n;
    const offset_e = canvas.offset_e;
    const r = canvas.r
    const x  =  (this.location.x - offset_n - 8 ) * r * 1.3;
    const y  =  (this.location.y- offset_e ) * r -  r;
    ctx.fillStyle = "#0000FF"
    ctx.font = "12px Arial";
    ctx.fillText(this.txt, x, y);
}

/// polygon
function Polygon(edges){
    this.edges = edges.map( edge => new Line(edge.v1, edge.v2))
}

Polygon.prototype.draw = function(canvas) {
    this.edges.forEach(edge => edge.draw(canvas))
    let index = 0
    let right_length = 0, left_length = 0;
    this.edges.forEach(edge => {
        edge.v1.drawPoint(canvas);
        edge.drawHint(canvas, `P${index + 1}`)
        index += 1
        if ((index < 30) || (index == 61) || (index == 62)) {
            right_length += edge.distance();
        }
        if ((index <= 59) && (index >= 39)) {
            left_length += edge.distance()
        }
    })
}


/// ------

function Canvas(canvas) {
    this.canvas = canvas;
    this.shapes = [];
    this.context = this.canvas.getContext("2d");
    this.setHDCanvas();
    this.offset_n = -10;
    this.offset_e = -3;
    this.r = 50;
}

Canvas.prototype.setHDCanvas = function(w=5000,h=5000) {
    var ratio = window.devicePixelRatio || 1;
    this.canvas.width = w * ratio; // 实际渲染像素
    this.canvas.height = h * ratio; // 实际渲染像素
    this.canvas.style.width = `${w}px`; // 控制显示大小
    this.canvas.style.height = `${h}px`; // 控制显示大小
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

Canvas.prototype.draw = function() {
    this.shapes.forEach(shape => {
        shape.draw(this);
    })
}

Canvas.prototype.addShape = function(shape) {
    this.shapes.push(shape);
}

Canvas.prototype.clearAll = function(){
    this.shapes = [];
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

/** Frame object, contain multi shape */
function Frame(fdata, shift, h){
    this.data = fdata.data;
    this.meta = fdata.metadata;
    this.shift = shift
    this.vertexes = []
    this.lines = [];
    this.metas = [];
    this.h = h
}

Frame.prototype.__getDistOfVertex = function(v1, v2) {

    return Math.sqrt((v1.n - v2.n) * (v1.n - v2.n) + (v1.e - v2.e) * (v1.e - v2.e))
}

Frame.prototype.__genLevelVertexes = function(){
    const es = this.data.map(d => parseFloat(d.elevation));
    var max = Math.ceil(Math.max(...es));
    this.data.forEach(d => {
        let elevation = d.elevation - this.shift.y// y軸
        let distance = d.distance + this.shift.x * 1.3// x軸
        let name = d.name;
        this.vertexes.push(new Vertex(name,  distance, max - elevation, (elevation + this.shift.y)));
    })
}

Frame.prototype.__genLevelLines = function(){
    for (let i = 0; i < this.vertexes.length - 1; i++){
        this.lines.push(new Line(this.vertexes[i], this.vertexes[i+1]))
    }
}

Frame.prototype.__genMeta = function(){
    let xx = 0;
    Object.keys(this.meta).map(k => `${k}: ${this.meta[k]}`)
        .forEach(d => {
            let x = this.shift.x + xx + 1;
            let y = this.shift.y + 3;
            this.metas.push(new Text(d, {x, y}))
            xx+=2;
        })
}

Frame.prototype.drawSlope = function (canvas, e, color) { 
    const d = this.__getDistOfVertex(this.vertexes[0], this.vertexes[this.vertexes.length - 1]);
    let vertex = new Vertex("center",  this.vertexes[0].n + d/2, this.vertexes[0].e - e, 0);
    vertex.setColor(color)
    vertex.draw(canvas)


    const ll = new Line(this.vertexes[0], vertex);
    ll.setColor(color)
    ll.draw(canvas)

    const lr = new Line(this.vertexes[this.vertexes.length - 1], vertex);
    lr.setColor(color)
    lr.draw(canvas)
    console.log(this.meta, ll.slope(), lr.slope())

}

Frame.prototype.draw = function(canvas){
    this.__genLevelVertexes();
    this.__genLevelLines();
    this.__genMeta();
    this.vertexes.forEach(vertex => vertex.draw(canvas))
    this.lines.forEach(l => l.draw(canvas));
    this.metas.forEach(l => l.draw(canvas));
    this.drawSlope(canvas, this.h || 0.12, "#00f0f0");

}



/// ---
window.onload = function(){
    const canvas = new Canvas(document.getElementById("view"));
    const dp = new DataPatch();

    $('#cal').click(e => {
        canvas.clearAll();
        const h = $("#h").val();
        dp.getData()
            .then(data => {
                let y = 0
                let x = 0;
                var count = 0;
                data.forEach(frame => {
                    let ff = new Frame(frame, {x: x, y: y}, h);
                    canvas.addShape(ff);
                    y += 3;
                    if (((count % 30) == 0) && (count > 0)){
                        x += 16;
                        y = 0;
                    }
                    count ++;
                })
                canvas.draw()
            })
            .catch(err => console.log(err))
    })

}