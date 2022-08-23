
// vertex
function Vertex(name, N, E, elevation){
    this.name = name;
    this.n = N;
    this.e = E;
    this.ele = elevation;
}


Vertex.prototype.toJson = function() {
    return {
        name: this.name,
        n: this.n ,
        e: this.e ,
        ele: this.ele
    }
}

Vertex.Convert = function(t_string) {
    const p = t_string.split(',');
    if (p.length == 4) {
        return new Vertex(p[0], parseFloat(p[1]), parseFloat(p[2]), parseFloat(p[3]))
    }
}


/// line
function Line(v1, v2) {
    this.v1 = v1;
    this.v2 = v2;
}

Line.prototype.toJson = function(){
    return {
        v1: this.v1,
        v2: this.v2
    }
}


Line.prototype.area_pre_cal = function() {
    return this.v1.n * this.v2.e - this.v1.e * this.v2.n
}

/// polygon
function Polygon(){
    this.edges = [];
}

Polygon.prototype.addEdge = function(edge) {
    this.edges.push(edge);
}

Polygon.prototype.toJson = function() {
    return this.edges;
}

Polygon.prototype.cal_area = function() {
    let a = 0.0;
    this.edges.forEach(edge => {
        a += edge.area_pre_cal();
    })
    a *= 0.5
    return a < 0 ? -a : a;
}

Polygon.prototype.genPathView = function(r) {
    r = r || 1
    let offset_n = 2700000 + 3500 + 100, offset_e = 180000 + 400 ;
    console.log(`ctx.moveTo(${(this.edges[0].v1.n - offset_n) * r}, ${(this.edges[0].v1.e - offset_e ) * r})`)
    this.edges.forEach(edge => {
        console.log(`ctx.lineTo(${(edge.v2.n - offset_n ) * r}, ${(edge.v2.e - offset_e ) * r})`)
    })
}
