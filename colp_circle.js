var width=300;
var height=300;
var canvas=document.createElement("canvas");
var ctx=canvas.getContext("2d")

canvas.width=width;
canvas.height=height;
document.body.appendChild(canvas);

var routside=Math.min(canvas.width,canvas.height)/2
var rinside=routside-30;

var centerX=canvas.width/2;
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
