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

    saturation = saturation < 0 ? 0 :
        saturation > 1 ? 1 :
        saturation;

    value = value < 0 ? 0 :
        value > 1 ? 1 :
        value;

    value *= 255;
    hi = (hue / 60 | 0) % 6;
    f = hue / 60 - hi;
    p = value * (1 - saturation) | 0;
    q = value * (1 - f * saturation) | 0;
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



/**------------------変数定義------------------------------**/
/*サークルセレクタポイント中心X*/
var cspcx;
/*サークルセレクタポイント中心Y*/
var cspcy;
/*スクエアセレクタポイント中心X*/
var sspcx;
/*スクエアセレクタポイント中心Y*/
var sspcy;
/*スクエアセレクト評価*/
var Square_select_check = 0;
/*サークルセレクト評価*/
var Circle_select_check = 0;

/**------------------キャンバス定義------------------------------**/

/*キャンバス横幅*/
var width = 300;
/*キャンバス縦幅*/
var height = 300;

/*カラー用キャンバス*/
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.style.position = 'absolute';
canvas.style.left = "150px";
canvas.style.top = "110px";
canvas.width = width;
canvas.height = height;
//console.log(canvas.style.left)
document.body.appendChild(canvas);

/*ピッカー用キャンバス*/
var selcanvas = document.createElement("canvas");
var selctx = selcanvas.getContext('2d');
selcanvas.style.position = 'absolute';
selcanvas.style.left = canvas.style.left;
selcanvas.style.top = canvas.style.top;
selcanvas.width = canvas.width;
selcanvas.height = canvas.height;

document.body.appendChild(selcanvas);

console.log(sspcx, sspcy)
document.addEventListener("DOMContentLoaded", function () {

    document.addEventListener("mousedown", function (event) {
        if (event.clientX - selcanvas.offsetLeft >= cspcx - 7 && event.clientX - selcanvas.offsetLeft <= cspcx + 10 && event.clientY - selcanvas.offsetTop >= cspcy - 7 && event.clientY - selcanvas.offsetTop <= cspcy + 10) {

            Circle_select_check = 1;
        }
        if (event.clientX - selcanvas.offsetLeft >= sspcx - 7 && event.clientX - selcanvas.offsetLeft <= sspcx + 10 && event.clientY - selcanvas.offsetTop >= sspcy - 7 && event.clientY - selcanvas.offsetTop <= sspcy + 10) {
            Square_select_check = 1;
            console.log(Square_select_check)
        }
        console.log(event.clientX - selcanvas.offsetLeft, event.clientY - selcanvas.offsetTop)

    }, false);
    document.addEventListener("mouseup", function (event) {

        Circle_select_check = 0;
        Square_select_check = 0;


    }, false);
}, false);



document.onmousemove = function (e) {
    if (!e) e = window.event; // レガシー
    if (Circle_select_check == 1) {
        cicle_picker_draw(e.clientX - selcanvas.offsetLeft, e.clientY - selcanvas.offsetTop)
    }
    if (Square_select_check == 1) {
        /*ポインタ表示位置X　　マウス入力設置時は場所変更　毎入力ごとに初期化されてしまう*/
        var SSpointX = sspcx;
        /*ポインタ表示位置Y　　マウス入力設置時は場所変更　毎入力ごとに初期化されてしまう*/
        var SSpointY = sspcy

        if (e.clientX  >= canvas.offsetLeft + square_start_X && e.clientX <= canvas.offsetLeft + square_start_X + cwhlength) {
            SSpointX = e.clientX - canvas.offsetLeft;
        }
        console.log("B",e.clientY - selcanvas.offsetTop,canvas.offsetTop + square_start_Y)
        if (e.clientY  >= canvas.offsetTop + square_start_Y && e.clientY <= canvas.offsetTop + square_start_Y + cwhlength) {
            SSpointY = e.clientY - canvas.offsetTop;
            console.log("BB")
        }
        square_draw(SSpointX, SSpointY);
    }


};
/**------------------カラーサークル描画------------------------------**/

/*円の外側距離*/
var routside = Math.min(canvas.width, canvas.height) / 2;
/*円の幅*/
var widthofround = 30;
/*円の内側距離*/
var rinside = routside - widthofround;
/*キャンバス中心X点*/
var centerX = canvas.width / 2;
/*キャンバス中心Y点*/
var centerY = canvas.height / 2;

/*カラースクエア開始X点 */
var square_start_X = centerX + rinside * Math.cos(225 * (Math.PI / 180));
/*カラースクエア開始Y点 */
var square_start_Y = centerY + rinside * Math.sin(225 * (Math.PI / 180));
/*カラースクエア縦横長さ */
var cwhlength = (centerX - square_start_X) * 2

sspcx = square_start_X + cwhlength;
sspcy = square_start_Y;
//console.log(square_start_X, square_start_Y, sspcx, sspcy, cwhlength)
ctx.beginPath();
ctx.arc(centerX, centerY, routside, 0, Math.PI * 2, true);
ctx.arc(centerX, centerY, rinside, 0, Math.PI * 2, false);
ctx.fillStyle = "#3912ff";
ctx.fill();
console.log(sspcx, sspcy)
var canvasdata = ctx.getImageData(0, 0, width, height);
var pixeldata = canvasdata.data;

for (x = 0; x < canvas.width; x++) {
    for (y = 0; y < canvas.height; y++) {
        var basedindex = (y * width + x) * 4;

        if (pixeldata[basedindex] > 0) {
            var hue = (Math.atan2(y - centerY, x - centerX) / Math.PI / 2 * 360) + 90;
            var colors = hsvToRGB(hue, 100, 100);

            pixeldata[basedindex] = colors[0];
            pixeldata[basedindex + 1] = colors[1];
            pixeldata[basedindex + 2] = colors[2];

        }
    }
}
ctx.putImageData(canvasdata, 0, 0);
cicle_picker_draw(width / 2, 0);
//drawsquare(hue)

/**------------------カラースクエア描画------------------------------**/


function drawsquare(Color2) {
    //cwhlength = 160;
    //square_start_X = (width / 2) - (cwhlength / 2);
    //square_start_Y = (height / 2) - (cwhlength / 2);

    Color1 = [255, 255, 255];
    //Color2 = hsvToRGB(huei, 100, 100);
    var lr = Color1[0],
        lg = Color1[1],
        lb = Color1[2];
    var rr = Color2[0],
        rg = Color2[1],
        rb = Color2[2];
    var stepl = 255 / cwhlength;
    var steprr = rr / cwhlength;
    var steprg = rg / cwhlength;
    var steprb = rb / cwhlength;

    for (startyh = square_start_Y; startyh <= square_start_Y + cwhlength; startyh++) {
        ctx.beginPath();

        var grad = ctx.createLinearGradient(square_start_X, startyh, square_start_X + cwhlength, startyh);
        /* グラデーション終点のオフセットと色をセット */
        grad.addColorStop(0, 'rgb(' + lr + ',' + lg + ' , ' + lb + ')');
        grad.addColorStop(1, 'rgb(' + rr + ',' + rg + ' , ' + rb + ')');
        ctx.fillStyle = grad;
        ctx.rect(square_start_X, startyh, cwhlength, 1);
        ctx.fill();

        lr -= stepl;
        lg -= stepl;
        lb -= stepl;
        rr -= steprr;
        rg -= steprg;
        rb -= steprb;
    }
    square_draw(sspcx, sspcy);
}

/**------------------カラーサークルピックポイント描画------------------------------**/

function cicle_picker_draw(mx, my) {
    
    /*サークルの幅の中心距離*/
    var rmiddle = routside - (widthofround / 2);
    /*セレクトポインタの角度*/
    var pointangle = Math.atan2(my - centerY, mx - centerX) / Math.PI / 2 * 360;

    var SpointX = centerX + rmiddle * Math.cos(pointangle * (Math.PI / 180));
    var SpointY = centerY + rmiddle * Math.sin(pointangle * (Math.PI / 180));
    cspcx = SpointX;
    cspcy = SpointY;
    Spointpaint(SpointX, SpointY);
    col = ctx.getImageData(SpointX, SpointY, 1, 1).data;
    drawsquare(col);
}
/**------------------カラースクエアピックポイント描画------------------------------**/

function square_draw(msx, msy) {

    sspcx = msx;
    sspcy = msy;
    Spointpaint(msx, msy);
}

function Spointpaint(PX, PY) {
<<<<<<< HEAD
=======
    selctx.clearRect(0, 0, width, height)
    
    selctx.beginPath();
    selctx.arc(sspcx, sspcy, 7, 0, Math.PI * 2, true);
    selctx.arc(sspcx, sspcy, 4, 0, Math.PI * 2, false);
    selctx.strokeStyle = "#000000";
    selctx.stroke();
    selctx.fillStyle = "#ffffff";
    selctx.fill();
    
>>>>>>> db002451ede09f244c740ce8b3edf8df18ab698a
    selctx.beginPath();
    selctx.arc(cspcx, cspcy, 7, 0, Math.PI * 2, true);
    selctx.arc(cspcx, cspcy, 4, 0, Math.PI * 2, false);
    selctx.strokeStyle = "#000000";
    selctx.stroke();
    selctx.fillStyle = "#ffffff";
    selctx.fill();
}
