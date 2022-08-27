function HCurve(data, shift, option){
    this.data = data;
    this.shift = shift;
    this.vertexes = [];
    this.lines = [];
    this.texts = [];
    var dd = 1;
    this.option = option;

    const es = this.data.map(d => parseFloat(d[1]));
    var max = Math.ceil(Math.max(...es));
    var min = Math.ceil(Math.min(...es));

    var yy = 0;
    this.data.forEach(d => {
        const v = new Vertex("",  dd, (max - d[1]) - yy + 10 - this.shift.y, d[1]);
        const t = new Text(`${d[0]}`, {x: dd , y: (min - d[1] + 13 - yy - this.shift.y )});
        t.font = "5px Arial";
        this.texts.push(t)
        dd += 0.3;
        yy += 0
        v.pointSize = 2;
        this.vertexes.push(v);
    });
    
    for (let i = 0; i < this.vertexes.length - 1; i++){
        const l = new Line(this.vertexes[i], this.vertexes[i+1]);
        //l.setColor("#00ff00")
        l.setColor(this.option.lineColor || "#00ff00")
        this.lines.push(l)
    }
}



HCurve.prototype.draw = function (canvas) { 
    this.vertexes.forEach(v => v.draw(canvas))
    this.lines.forEach(l => l.draw(canvas))
    if (this.option.showMile)
        this.texts.forEach(t => t.drawSimple(canvas))
}


