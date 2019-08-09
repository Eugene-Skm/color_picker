/**------------------HSV→RGB変換------------------------------**/
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
//var flg = 0;

var agent = window.navigator.userAgent.toLowerCase();
var ie9 = (agent.indexOf('msie 9.') !== -1);
var ie11 = (agent.indexOf('trident/7') !== -1);

/**------------------キャンバス定義------------------------------**/

/*キャンバス横幅*/
var width;
/*キャンバス縦幅*/
var height;

/*カラー用キャンバス*/
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
/*ピッカー用キャンバス*/
var selcanvas = document.createElement("canvas");
var selctx = selcanvas.getContext('2d');

function color_picker(ids, width) {
    make_canvas(ids, width);
    draw_color_circle();
    square_picker_draw(sspcx, sspcy);
}

function make_canvas(id, widths) {
    width = widths;
    height = widths;
    canvas.style.position = 'absolute';
    canvas.width = width;
    canvas.height = height;
    canvas.id = 'colcanvas';
    document.getElementById(id).appendChild(canvas);

    selcanvas.style.position = 'absolute';
    canvas.id = 'selcanvas';
    selcanvas.width = canvas.width;
    selcanvas.height = canvas.height;
    document.getElementById(id).appendChild(selcanvas);
}
//キャンバスプロパティ取得用
var clientRect;
//キャンバスページ内位置X,Y
var px, py;

document.addEventListener("DOMContentLoaded", function () {

    document.addEventListener("mousedown", function (e) {
        //要素のプロパティ取得
        clientRect = selcanvas.getBoundingClientRect();

        // ページ全体内での要素位置 　スクロール量-画面内の位置
        px = window.pageXOffset + clientRect.left;
        py = window.pageYOffset + clientRect.top;

        if (e.pageX - px >= cspcx - 7 && e.pageX - px <= cspcx + 10 && e.pageY - py >= cspcy - 7 && e.pageY - py <= cspcy + 10) {
            Circle_select_check = 1;
        }else{
            var length_center_clickpoint=Math.sqrt(Math.pow((e.pageX-px)-centerX,2)+Math.pow((e.pageY-py)-centerY,2));
            if(length_center_clickpoint>=rinside&&length_center_clickpoint<=routside){
                cicle_picker_draw(e.pageX - px, e.pageY - py);
                Circle_select_check=1;
            }
        }
        if (e.pageX - px >= sspcx - 7 && e.pageX - px <= sspcx + 10 && e.pageY - py >= sspcy - 7 && e.pageY - py <= sspcy + 10) {
            Square_select_check = 1;
        }else if((e.pageX - px >= square_start_X) && (e.pageX - px <= square_endX)&&(e.pageY - py >= square_start_Y) && (e.pageY - py <= square_endY)){
            sspcx=Math.round(e.pageX - px);
            sspcy=Math.round(e.pageY - py);
            square_picker_draw(sspcx, sspcy);
            Square_select_check=1;
        }

    }, false);
    document.addEventListener("mouseup", function (e) {
        Circle_select_check = 0;
        Square_select_check = 0;
    }, false);

    document.addEventListener("mousemove", function (e) {
        if (Circle_select_check === 1) {
            cicle_picker_draw(e.pageX - px, e.pageY - py);
        }

        if (Square_select_check === 1) {
            //e.pageX-px =クリックしたページ全体~HTMLドキュメント上端からの位置~ー~同じくcanvasの位置=クリックしたキャンバス内の位置
            
            if ((e.pageX - px >= square_start_X) && (e.pageX - px <= square_endX)) {
                sspcx = Math.round(e.pageX - px);
            } else if ((e.pageX - px > square_endX) && (sspcx < square_endX)) {
                sspcx = sspcx + 1;
            } else if ((e.pageX - px < square_start_X) && (sspcx > square_start_X)) {
                sspcx = sspcx - 1;
            }
            if ((e.pageY - py >= square_start_Y) && (e.pageY - py <= square_endY)) {
                sspcy = Math.round(e.pageY - py);
            } else if ((e.pageY - py > square_endY) && (sspcy < square_endY)) {
                sspcy = sspcy + 1;
            } else if ((e.pageY - py < square_start_Y) && (sspcy > square_start_Y)) {
                sspcy = sspcy - 1;
            }
            square_picker_draw(sspcx, sspcy);
        }
    }, false);
}, false);

/**------------------カラーサークル描画------------------------------**/
/*円の外側距離*/
var routside;
/*円の幅*/
var round_width;
/*円の内側距離*/
var rinside;
/*キャンバス中心X点*/
var centerX;
/*キャンバス中心Y点*/
var centerY;

/*カラースクエア開始X点 */
var square_start_X;
/*カラースクエア開始Y点 */
var square_start_Y;
/*カラースクエア縦横長さ */
var cwhlength;
/*サークルの幅の中心距離*/
var rmiddle;
/*セレクトポインタの角度*/
var pointangle;
var square_endX;
var square_endY;

function draw_color_circle() {
    routside = Math.min(canvas.width, canvas.height) / 2;
    round_width = canvas.width * 0.1;
    rinside = routside - round_width;

    centerX = Math.round(canvas.width / 2);
    centerY = Math.round(canvas.height / 2);

    square_start_X = Math.floor(centerX + rinside * Math.cos(225 * (Math.PI / 180)));
    square_start_Y = Math.floor(centerY + rinside * Math.sin(225 * (Math.PI / 180)));

    cwhlength = Math.round((centerX - square_start_X) * 2);

    rmiddle = routside - (round_width / 2);

    square_endX = square_start_X + cwhlength-1 ;
    square_endY = square_start_Y + cwhlength ;

    sspcx = square_endX;
    sspcy = square_start_Y;
    ctx.beginPath();
    ctx.arc(centerX, centerY, routside, 0, Math.PI * 2, true);
    ctx.arc(centerX, centerY, rinside, 0, Math.PI * 2, false);
    ctx.fillStyle = "#3912ff";
    ctx.fill();

    var canvasdata = ctx.getImageData(0, 0, width, height);
    var pixeldata = canvasdata.data;

    for (var x = 0; x < canvas.width; x++) {
        for (var y = 0; y < canvas.height; y++) {
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

}



/**------------------カラースクエア描画------------------------------**/


var stepl;
var steprr;
var steprg;
var steprb;

function drawsquare(Color2) {
    var Color1 = [255, 255, 255];
    var lr = Color1[0],
        lg = Color1[1],
        lb = Color1[2];
    var rr = Color2[0],
        rg = Color2[1],
        rb = Color2[2];
    //switch (flg) {
        //case 0:
            /*if (ie9 || ie11) {
                stepl = Math.floor(255 / cwhlength,10);
                steprr = Math.floor(rr / cwhlength,10);
                steprg = Math.floor(rg / cwhlength,10);
                steprb = Math.floor(rb / cwhlength,10);
            } else {*/
                stepl = 255 / cwhlength;
                steprr = rr / cwhlength;
                steprg = rg / cwhlength;
                steprb = rb / cwhlength;
            /*}*/
           // flg = 1;
            //break;
    //}



    for (var startyh = square_start_Y; startyh <= square_start_Y + cwhlength; startyh++) {
        ctx.beginPath();
        var grad = ctx.createLinearGradient(square_start_X, startyh, square_endX, startyh);
        /* グラデーション終点のオフセットと色をセット */
        grad.addColorStop(0, 'rgba(' + Math.floor(lr) + ',' + Math.floor(lg) + ' , ' + Math.floor(lb) + ',1)');
        grad.addColorStop(1, 'rgba(' + Math.floor(rr) + ',' + Math.floor(rg) + ' , ' + Math.floor(rb) + ',1)');
        ctx.fillStyle = grad;
        ctx.rect(square_start_X, startyh, cwhlength, 1);
        ctx.fill();
       /* if (ie9 || ie11) {
            lr = Math.round(lr-stepl);
            lg = Math.round(lg-stepl);
            lb = Math.round(lb-stepl);
            rr = Math.round(rr-steprr);
            rg = Math.round(rg-steprg);
            rb = Math.round(rb-steprb);
        /*}else{*/
        
        lr -= stepl;
        lg -= stepl;
        lb -= stepl;
        rr -= steprr;
        rg -= steprg;
        rb -= steprb;
       /* }*/
    }


}
/**------------------カラーサークルピックポイント描画------------------------------**/

function cicle_picker_draw(mx, my) {
    /*セレクトポインタの角度*/
    var px = mx - centerX;
    var py = my - centerY;
    pointangle = Math.atan2(py, px) / Math.PI / 2 * 360;

    cspcx = centerX + rmiddle * Math.cos(pointangle * (Math.PI / 180));
    cspcy = centerY + rmiddle * Math.sin(pointangle * (Math.PI / 180));

    spoint_paint();
    var col = ctx.getImageData(cspcx, cspcy, 1, 1).data;
    //flg = 0;
    drawsquare(col);
}
/**------------------カラースクエアピックポイント描画------------------------------**/
function square_picker_draw(msx, msy) {
    sspcx = msx;
    sspcy = msy;
    spoint_paint();
}

function spoint_paint() {
    selctx.clearRect(0, 0, width, height);
    selctx.beginPath();
    selctx.arc(sspcx, sspcy, 7, 0, Math.PI * 2, true);
    selctx.arc(sspcx, sspcy, 4, 0, Math.PI * 2, false);
    selctx.strokeStyle = "#000000";
    selctx.stroke();
    selctx.fillStyle = "#ffffff";
    selctx.fill();

    selctx.beginPath();
    selctx.arc(cspcx, cspcy, 7, 0, Math.PI * 2, true);
    //selctx.arc(cspcx, cspcy, 4, 0, Math.PI * 2, false);
    selctx.strokeStyle = "#000000";
    selctx.lineWidth = 2;
    selctx.stroke();

    get_color();
}

function get_color() {
    var canvasdata = ctx.getImageData(sspcx, sspcy, 1, 1);
    var pixeldata = canvasdata.data;
    //document.body.style.backgroundColor = "rgb(" + pixeldata[0] + "," + pixeldata[1] + "," + pixeldata[2] + ")";
    console.log(pixeldata)
}

