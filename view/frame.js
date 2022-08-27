
/** Frame object, contain multi shape */
function Frame(fdata, shift, option){
    this.data = fdata.data;
    this.meta = fdata.metadata;
    this.shift = shift
    this.vertexes = []
    this.lines = [];
    this.metas = [];
    this.showDiffLevel = option.showDiffLevel;
    this.showSlope = option.showSlope;
    this.lh = 0;
    this.rh = 0
    this.area = 0.0;
    this.__genZero();
}

/**
 * 
 * @param {float} lh 左邊+高程
 * @param {float} rh 右邊+高程
 */
Frame.prototype.setLRSHeightShift = function(lh, rh) {
    this.lh = lh;
    this.rh = rh;
}

Frame.prototype.det = function(vertexes) {
    let add = 0.0;
    let minus = 0.0;
    for(var i = 0; i < vertexes.length; i++) {
        let next = i + 1;
        if (next == vertexes.length) next = 0;
        add += vertexes[i].n * vertexes[next].e;
    }

    for(var i = 0; i < vertexes.length; i++) {
        let next = i + 1;
        if (next == vertexes.length) next = 0;
        minus += vertexes[next].n * vertexes[i].e;
    }
    return Math.abs(add - minus) / 2
}

Frame.prototype.__genZero = function(){
    if ( this.data.filter(d => d.distance == 0).length > 0) return;
    let native = this.data.filter(d => (d.distance < 0));
    const pastive = this.data.filter(d => (d.distance > 0))
    const native_Max_Index = native.map(d => d.distance).indexOfMax();
    const pastive_Min_Index = pastive.map(d => d.distance).indexOfMin();
    const n = native[native_Max_Index];
    const p = pastive[pastive_Min_Index];
    const y = n.elevation + (p.elevation - n.elevation) * ((0 - n.distance) / (p.distance - n.distance))
    const yl = n.reflevel + (p.reflevel - n.reflevel) * ((0 - n.distance) / (p.distance - n.distance))
    const zero = {name: (n.name + p.name)/2, distance: 0, reflevel: parseFloat(yl.toFixed(3)), elevation: parseFloat(y.toFixed(3))};
    native.push(zero)
    this.data = native.concat(pastive)
}

Frame.prototype.__getDistOfVertex = function(v1, v2) {
    return Math.sqrt((v1.n - v2.n) * (v1.n - v2.n) + (v1.e - v2.e) * (v1.e - v2.e)).toFixed(3)
}

Frame.prototype.__genOriLevelVertexes = function(){
    const es = this.data.map(d => parseFloat(d.elevation));
    var max = Math.ceil(Math.max(...es));
    this.data.forEach(d => {
        if (d.distance != null) {
            let elevation = d.elevation - this.shift.y// y軸
            let distance = d.distance + this.shift.x * 1.3// x軸
            let name = d.name;
            const v = new Vertex(name,  distance, max - elevation, (elevation));
            if(d.distance == 0) {
                v.setColor("#0000FF")
            }
            this.vertexes.push(v);
        }
    })
}

Frame.prototype.__genOriLevelLines = function(){
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

Frame.prototype.__getZeroIndex = function(){
    var Index = -1;
    this.data.forEach((v, i, a) => {
        if ((v.distance == 0) && (Index == -1)) {
            Index = i
        }
    });
    return Index;
}

Frame.prototype.drawSlope = function (canvas, e, color) { 
    const zeroIndex = this.__getZeroIndex();
    let vertex = this.vertexes[zeroIndex].copy();
    vertex.e = vertex.e - e
    vertex.setColor(color)
    vertex.draw(canvas)
    
    let vl = this.vertexes[0].copy();
    vl.e += this.lh;

    let vr = this.vertexes[this.vertexes.length - 1].copy();
    vr.e += this.rh;

    //左斜
    const ll = new Line(vl, vertex);
    ll.setColor(color)
    ll.draw(canvas)

    // 左邊斜率
    const slopel = Math.abs((ll.v1.e - ll.v2.e) / (ll.v1.n - ll.v2.n));

    //右斜
    const lr = new Line(vr, vertex);
    lr.setColor(color)
    lr.draw(canvas)

    // 距離測試
    this.vertexes.forEach((v, i) => {
        if (v.n > 0) {
            console.log('R', lr.vertexDistance(v))
        }
        if (v.n == 0) {
            console.log('C', this.__getDistOfVertex(v, vertex))
        }
        if (v.n < 0) {
            console.log('L', ll.vertexDistance(v))
        }
    })
    // 右邊斜率
    const sloper = Math.abs((lr.v1.e - lr.v2.e) / (lr.v1.n - lr.v2.n));

    // 計算面積
    const allPoints = this.vertexes.concat([vr, vertex, vl]);
    this.area = this.det(allPoints);

    //顯示文字
    const t = new Text(`左側斜率：${(slopel * 100.0).toFixed(3)}%, 右側斜率 ${(sloper * 100.0).toFixed(3)}%, 面積 ${this.area.toFixed(3)} m2, 體積 ${(this.area * 20).toFixed(3)}m3,平均厚 ${(this.area.toFixed(3) / (this.__getDistOfVertex(vl, vr))).toFixed(3)}m`, 
    {
        x: this.shift.x + 3,
        y: this.shift.y + 3
    });
    t.draw(canvas)
}

Frame.prototype.drawDiffLevel = function(canvas){
    const vd = new Vertex("",this.vertexes[this.vertexes.length - 1].n, this.vertexes[0].e, 0)
    const ld = new Line(this.vertexes[0], vd);
    ld.setColor("#0000f3")
    ld.draw(canvas)
}

Frame.prototype.getMetaName = function(){
    const n = `${this.meta['收方里程']}`.split('K+')
    return `${n[0]}${n[1]}`
}

Frame.prototype.drawName = function(canvas) {
    const diff = this.data[0].elevation - this.data[this.data.length - 1].elevation
    const t = new Text(`${this.getMetaName()}, 中心線高程 ${this.centerH.toFixed(3)}m, 左 - 右高差 ${diff.toFixed(3)}m`, 
    {
        x: this.shift.x + 3,
        y: this.shift.y + 2.5
    });
    t.draw(canvas)
}

Frame.prototype.setCenterH = function(centerH){
    this.centerH = centerH ;
}

Frame.prototype.getZero = function(){
    let zero = this.data.filter(d => (d.distance == 0));
    return zero[0];
}

Frame.prototype.getLeft = function () { 
    return this.data[0]
}

Frame.prototype.getRight = function(){
    return this.data[this.data.length - 1]
}

Frame.prototype.draw = function(canvas){
    this.__genOriLevelVertexes();
    this.__genOriLevelLines();
    this.vertexes.forEach(vertex => vertex.draw(canvas))
    this.lines.forEach(l => l.draw(canvas));
    if (this.showSlope)
        this.drawSlope(canvas, this.centerH, "#00f0f0");
    if (this.showDiffLevel)
        this.drawDiffLevel(canvas)
    this.drawName(canvas)
}
