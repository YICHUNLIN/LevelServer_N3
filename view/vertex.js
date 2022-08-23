export function Vertex(name, N, E, elevation){
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
