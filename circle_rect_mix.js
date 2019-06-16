/**------------------HSV　→　RGB変換------------------------------**/
/*function hsvToRGB borrowed by http://imaya.blog.jp/archives/6733658.html*/
function hsvToRGB(hue, saturation, value) {
    var hi;
    var f;
    var p;
    var q;
    var t;

    while (hue < 0) {
        hue += 360;
    }
    hue = hue % 360;

    saturation = saturation < 0 ? 0
        : saturation > 1 ? 1
        : saturation;

    value = value < 0 ? 0
        : value > 1 ? 1
        : value;

    value *= 255;
        hi = (hue / 60 | 0) % 6;
        f = hue / 60 - hi;
        p = value * (1 -           saturation) | 0;
        q = value * (1 -      f  * saturation) | 0;
        t = value * (1 - (1 - f) * saturation) | 0;
    value |= 0;

    switch (hi) {
        case 0:
            return [value, t, p];
        case 1:
            return [q, value, p];
        case 2:
            return [p, value, t];
        case 3:
            return [p, q, value];
        case 4:
            return [t, p, value];
        case 5:
            return [value, p, q];
    }
    throw new Error('invalid hue');
}

/**------------------キャンバス定義------------------------------**/

/*キャンバス横幅*/
var width=300;
/*キャンバス縦幅*/
var height=300;
var canvas=document.createElement("canvas");
/*カラーピッカー用キャンバス*/
var ctx=canvas.getContext("2d")

canvas.width=width;
canvas.height=height;
document.body.appendChild(canvas);

/**------------------カラーサークル描画------------------------------**/

/*円の外側距離*/
var routside=Math.min(canvas.width,canvas.height)/2
/*円の幅*/
var widthofround=30
/*円の内側距離*/
var rinside=routside-widthofround;
/*キャンバス中心X点*/
var centerX=canvas.width/2;
/*キャンバス中心Y点*/
var centerY=canvas.height/2;

ctx.beginPath();
ctx.arc(centerX, centerY, routside, 0, Math.PI * 2, true);
ctx.arc(centerX, centerY, rinside, 0, Math.PI * 2, false);
ctx.fillStyle="#3912ff"
ctx.fill();

var canvasdata=ctx.getImageData(0,0,width,height)
var pixeldata=canvasdata.data;

for(var x=0;x<canvas.width;x++){
    for(var y=0;y<canvas.height;y++){
        var basedindex=(y*width+x)*4;
        
        if(pixeldata[basedindex]>0){
            var hue=Math.atan2(y-centerY,x-centerX)/Math.PI/2*360;
            var colors=hsvToRGB(hue,100,100)
            
            pixeldata[basedindex]=colors[0]
            pixeldata[basedindex+1]=colors[1]
            pixeldata[basedindex+2]=colors[2]
            
        }
    }
}
ctx.putImageData(canvasdata,0,0)

/**------------------カラースクエア描画------------------------------**/

/*カラースクエア縦横長さ */
var cwhlength=160
/*カラースクエア開始X点 */
var swp=(width/2)-(cwhlength/2);
/*カラースクエア開始Y点 */
var shp=(height/2)-(cwhlength/2);

Color1=[255,255,255]
Color2=hsvToRGB(50,100,100)
var lr=Color1[0],lg=Color1[1],lb=Color1[2];
var rr=Color2[0],rg=Color2[1],rb=Color2[2];
var stepl=255/cwhlength;
var steprr=rr/cwhlength;
var steprg=rg/cwhlength;
var steprb=rb/cwhlength;

for(var startyh=shp;startyh<=shp+cwhlength;startyh++){
    ctx.beginPath();
    
    var grad= ctx.createLinearGradient(swp,startyh,swp+cwhlength,startyh);
  /* グラデーション終点のオフセットと色をセット */
  grad.addColorStop(0,'rgb('+lr+','+lg+' , '+lb+')');
  grad.addColorStop(1,'rgb('+rr+','+rg+' , '+rb+')');
  ctx.fillStyle = grad;
  ctx.rect(swp,startyh,cwhlength,1)
  ctx.fill();
        
    lr-=stepl;
    lg-=stepl;
    lb-=stepl;
    rr-=steprr;
    rg-=steprg;
    rb-=steprb;
    
}

/**------------------カラーサークルピックポイント描画------------------------------**/
/*サークルの幅の中心距離*/
var rmiddle=routside-(widthofround/2);
/*マウス座標のX（仮値）*/
var mx=200;
/*マウス座標のY（仮値）*/
var my=200;
/*セレクトポインタの角度*/
var pointangle=Math.atan2(my-centerY,mx-centerX)/Math.PI/2*360;

var SpointX=centerX+rmiddle*Math.cos(pointangle*(Math.PI/180))
var SpointY=centerY+rmiddle*Math.cos(pointangle*(Math.PI/180))

console.log(pointangle)
console.log(SpointX,SpointY)

ctx.beginPath();
ctx.arc(SpointX, SpointY, 7, 0, Math.PI * 2, true);
ctx.arc(SpointX, SpointY, 4, 0, Math.PI * 2, false);
ctx.strokeStyle="#000000"
ctx.stroke()
ctx.fillStyle="#ffffff"
ctx.fill();