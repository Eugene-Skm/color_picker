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


var width=300;
var height=300;
var canvas=document.createElement("canvas");
var ctx=canvas.getContext("2d")

canvas.width=width;
canvas.height=height;
document.body.appendChild(canvas);



var yh=0;
Color1=[255,255,255]
Color2=hsvToRGB(100,100,100)
var lr=Color1[0],lg=Color1[1],lb=Color1[2];
var rr=Color2[0],rg=Color2[1],rb=Color2[2];
var stepl=255/height;
var steprr=rr/height;
var steprg=rr/height;
var steprb=rr/height;
console.log(steprb)

for(var startyh=yh;startyh<=height;startyh++){
    var grad=null;
      grad= ctx.createLinearGradient(0,startyh,width,startyh);
  /* グラデーション終点のオフセットと色をセット */
  grad.addColorStop(0,'rgb('+lr+','+lg+' , '+lb+')');
  grad.addColorStop(1,'rgb('+rr+','+rg+' , '+rb+')');
/* グラデーションをfillStyleプロパティにセット */
  ctx.fillStyle = grad;
  /* 矩形を描画 */
  ctx.rect(0,startyh,width,1)
  ctx.fill();
    
    lr-=stepl;
    lg-=stepl;
    lb-=stepl;
    rr-=steprr;
    rg-=steprg;
    rb-=steprb;
    //console.log(rr+','+rg+' , '+rb)
    console.log(lr+','+lg+' , '+lb)

}
    
    /*
    
var grad  = ctx.createLinearGradient(0,0, 140,0);
  /* グラデーション終点のオフセットと色をセット 
  grad.addColorStop(0,'rgb(255, 255, 255)');
  grad.addColorStop(1,'rgb(128, 100, 162)');
/* グラデーションをfillStyleプロパティにセット 
  ctx.fillStyle = grad;
  /* 矩形を描画 
  ctx.rect(0,0, 140,140);
  ctx.fill();*/