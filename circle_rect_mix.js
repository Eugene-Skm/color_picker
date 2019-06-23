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
canvas.width = width;
canvas.height = height;
canvas.id = 'colcanvas';
document.getElementById("hello4").appendChild(canvas);

/*ピッカー用キャンバス*/
var selcanvas = document.createElement("canvas");
var selctx = selcanvas.getContext('2d');
selcanvas.style.position = 'absolute';
canvas.id = 'selcanvas';
selcanvas.width = canvas.width;
selcanvas.height = canvas.height;
document.getElementById("hello4").appendChild(selcanvas);

//キャンバスプロパティ取得用
var clientRect;
//キャンバスページ内位置X,Y
var px,py;

document.addEventListener("DOMContentLoaded", function () {

    document.addEventListener("mousedown", function (e) {
        //要素のプロパティ取得
        clientRect = selcanvas.getBoundingClientRect();

        // ページ全体内での要素位置 　スクロール量-画面内の位置
        px = window.pageXOffset + clientRect.left;
        py = window.pageYOffset + clientRect.top;

        if (e.pageX - px >= cspcx - 7 && e.pageX - px <= cspcx + 10 && e.pageY - py >= cspcy - 7 && e.pageY - py <= cspcy + 10) {
            Circle_select_check = 1;
        }
        if (e.pageX - px >= sspcx - 7 && e.pageX - px <= sspcx + 10 && e.pageY - py >= sspcy - 7 && e.pageY - py <= sspcy + 10) {
            Square_select_check = 1;
        }

    }, false);
    document.addEventListener("mouseup", function (e) {
        Circle_select_check = 0;
        Square_select_check = 0;
    }, false);

    document.addEventListener("mousemove", function (e) {
        if (Circle_select_check == 1) {
            cicle_picker_draw(e.pageX - px, e.pageY - py)
        }

        if (Square_select_check == 1) {
            /*ポインタ表示位置X　　マウス入力設置時は場所変更　毎入力ごとに初期化されてしまう*/
            var SSpointX = sspcx;
            /*ポインタ表示位置Y　　マウス入力設置時は場所変更　毎入力ごとに初期化されてしまう*/
            var SSpointY = sspcy
            //e.pageX-px =クリックしたページ全体（HTMLドキュメント上端から）の位置　ー　同じくcanvasの位置=クリックしたキャンバス内の位置
            if ((e.pageX - px >= square_start_X) && (e.pageX - px <= square_start_X + cwhlength-1)) {
                SSpointX = Math.round(e.pageX - px);
            } else if ((e.pageX - px > square_start_X + cwhlength-1) && (sspcx < square_start_X + cwhlength-1)) {
                SSpointX = SSpointX + 1;
            } else if ((e.pageX - px < square_start_X) && (sspcx > square_start_X)) {
                SSpointX = SSpointX - 1;
            }
            if ((e.pageY - py >= square_start_Y) && (e.pageY - py <= square_start_Y + cwhlength-1)) {
                SSpointY = Math.round(e.pageY - py);
            } else if ((e.pageY - py > square_start_Y + cwhlength-1) && (sspcy < square_start_Y + cwhlength-1)) {
                SSpointY = SSpointY + 1;
            } else if ((e.pageY - py < square_start_Y) && (sspcy > square_start_Y)) {
                SSpointY = SSpointY - 1;
            }
            
            square_picker_draw(SSpointX, SSpointY);
        }
    }, false);
}, false);

/**------------------カラーサークル描画------------------------------**/
/*円の外側距離*/
var routside = Math.min(canvas.width, canvas.height) / 2;
/*円の幅*/
var widthofround = canvas.width * 0.1;
/*円の内側距離*/
var rinside = routside - widthofround;
/*キャンバス中心X点*/
var centerX = Math.round(canvas.width / 2);
/*キャンバス中心Y点*/
var centerY = Math.round(canvas.height / 2);

/*カラースクエア開始X点 */
var square_start_X = Math.round(centerX + rinside * Math.cos(225 * (Math.PI / 180)));
/*カラースクエア開始Y点 */
var square_start_Y = Math.round(centerY + rinside * Math.sin(225 * (Math.PI / 180)));
/*カラースクエア縦横長さ */
var cwhlength = Math.round((centerX - square_start_X) * 2)

sspcx = square_start_X + cwhlength-1;
sspcy = square_start_Y;
ctx.beginPath();
ctx.arc(centerX, centerY, routside, 0, Math.PI * 2, true);
ctx.arc(centerX, centerY, rinside, 0, Math.PI * 2, false);
ctx.fillStyle = "#3912ff";
ctx.fill();

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

/**------------------カラースクエア描画------------------------------**/
function drawsquare(Color2) {

    Color1 = [255, 255, 255];
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
        var grad = ctx.createLinearGradient(square_start_X, startyh, square_start_X + cwhlength-1, startyh);
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

    square_picker_draw(sspcx, sspcy);
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
    spoint_paint();
    col = ctx.getImageData(SpointX, SpointY, 1, 1).data;
    drawsquare(col);
}
/**------------------カラースクエアピックポイント描画------------------------------**/
function square_picker_draw(msx, msy) {
    sspcx = msx;
    sspcy = msy;
    spoint_paint();
}

function spoint_paint() {

    selctx.clearRect(0, 0, width, height)
    selctx.beginPath();
    selctx.arc(sspcx, sspcy, 7, 0, Math.PI * 2, true);
    selctx.arc(sspcx, sspcy, 4, 0, Math.PI * 2, false);
    selctx.strokeStyle = "#000000";
    selctx.stroke();
    selctx.fillStyle = "#ffffff";
    selctx.fill();

    selctx.beginPath();
    selctx.arc(cspcx, cspcy, 7, 0, Math.PI * 2, true);
    selctx.arc(cspcx, cspcy, 4, 0, Math.PI * 2, false);
    selctx.strokeStyle = "#000000";
    selctx.stroke();
    selctx.fillStyle = "#ffffff";
    selctx.fill();
    
    get_color();
}
function get_color(){
    var canvasdata = ctx.getImageData(sspcx, sspcy, 1, 1);
    var pixeldata = canvasdata.data;
    document.body.style.backgroundColor="rgb("+pixeldata[0]+","+pixeldata[1]+","+pixeldata[2]+")"
}