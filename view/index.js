/**
 * E 上下 y
 * N 左右 x
 */
function DataPatch() {
    this.xhttp = new XMLHttpRequest();
}

DataPatch.prototype.getData = function(name) {
    return new Promise((resolve, reject) => {
        this.xhttp.open("GET", `http://localhost:3000/${name}`);
        this.xhttp.onload = function() {
            try{
                resolve(JSON.parse(this.responseText))
            }catch(err) {
                console.log(err)
                reject(err)
            }
        }
        this.xhttp.send();
    })
}


function Canvas(canvas) {
    this.canvas = canvas;
    this.shapes = [];
    this.context = this.canvas.getContext("2d");
    this.setHDCanvas();
    this.offset_n = -7;
    this.offset_e = -1;
    this.r = 80;
    this.context.fillStyle = "#E4EBD1";
    this.context.fillRect(0, 0, canvas.width, canvas.height);
    this.context.save();
    $('#downloadLnk').click(function(e){
        var dt = canvas.toDataURL('image/png');
        this.href = dt;
    });
}

Canvas.prototype.fillCanvasBackground = function(color)
{
   this.context.save();
   this.context.globalCompositeOperation = 'destination-over';
   this.context.fillStyle = color;
   this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
   this.context.restore();
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


function FrameController(centers){
    this.frames = [];
    this.addcenters = centers;
    //console.log(this.addcenters)
}

FrameController.prototype.addFrame = function (nf) { 
    this.frames.push(nf)
}

FrameController.prototype.draw = function(canvas) {
    const center = [];
    const centerAdd = [];
    const left = [];
    const right = [];
    let vol = 0;
    this.frames.forEach((f, i) => {
        f.draw(canvas)
        if ((i == 0) || (i == (this.frames.length - 1))){
            vol += f.area * 10;
        }else{
            vol += f.area * 20;
        }
        center.push([f.getMetaName(), f.getZero().elevation])
        centerAdd.push([f.getMetaName(), f.getZero().elevation + this.addcenters[f.getMetaName()] / 100.0])
        left.push([f.getMetaName(), f.getLeft().elevation]);
        right.push([f.getMetaName(), f.getRight().elevation]);
    })
    $('#volume').text(`總體積：${vol.toFixed(3)}m3, 總重：${(vol * 2.35).toFixed(3)}t`)
    const centerCurve = new HCurve(center, {x: 0, y: 0}, {lineColor: "#FF0000", showMile: true});
    const centerAddCurve = new HCurve(centerAdd, {x: 0, y: 0}, {lineColor: "#F000F0", showMile: false});
    const leftCurve = new HCurve(left, {x: 0, y: 0}, {lineColor: "#00FF00", showMile: false});
    const rightCurve = new HCurve(right, {x: 0, y: 0}, {lineColor: "#0000FF", showMile: false});
    leftCurve.draw(canvas)
    centerCurve.draw(canvas)
    centerAddCurve.draw(canvas)
    rightCurve.draw(canvas)
}

/// ---
window.onload = function(){

    const canvas = new Canvas(document.getElementById("view"));
    const dp = new DataPatch();

    function drawData(data,  centers, option){
        const FC = new FrameController(centers);
        const centerH = parseFloat($("#centerH").val());
        const lh = parseFloat($("#lh").val());
        const rh = parseFloat($("#rh").val());

        let y = 0
        let x = 0;
        var count = 0;
        for(var i = 0; i < data.length; i++){
            var frame = data[i]
            let ff = new Frame(frame, {x: x, y: y}, option);
            ff.setLRSHeightShift(-lh, -rh)
            ff.setCenterH(centers[ff.getMetaName()] / 100.0 + centerH)
            FC.addFrame(ff)
            y += 2.5;
            if (((count % 20) == 0) && (count > 0)){
                x += 15;
                y = 0;
            }
            count ++;
            // 到1760結束後停止
            if (ff.getMetaName() == '2280'){
                break
            }
            //break;
        }
        canvas.addShape(FC);
        //FC.drawZeroCurve();
    }

    function makeCenterDict(centers) { 
        let r = {};
        centers.forEach(c => {
            r[c[0]] = parseFloat(c[1]);
        })
        return r;
    }
    $('#cal').click(e => {
        canvas.clearAll();
        const showDiffLevel = $('input[type="checkbox"]#showDiffLevel').is(':checked');
        const showSlope = $('input[type="checkbox"]#showSlope').is(':checked');
        const status = $('input[type="radio"]:checked').val();
        dp.getData('ori_data')
            .then(ori => {
                dp.getData('data')
                    .then(data => {
                        dp.getData('center')
                            .then(center => {
                                drawData(status == "before" ? ori : data, makeCenterDict(center), {showDiffLevel, showSlope})
                                canvas.draw()
                            })
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
        
    })

}