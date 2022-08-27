
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