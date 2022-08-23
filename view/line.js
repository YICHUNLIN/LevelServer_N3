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

Line.prototype.distance = function() {
    return Math.sqrt((this.v1.n - this.v2.n) * (this.v1.n - this.v2.n) + (this.v1.e - this.v2.e) * (this.v1.e - this.v2.e))
}