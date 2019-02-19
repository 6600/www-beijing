
// 计算2点间的角度值,则横竖
function getAngle(o, t) {
    var n = t.x - o.x
        , i = t.y - o.y
        // e根据斜边比例，求出角度  /_
        , e = Math.acos(i / Math.sqrt(n * n + i * i));
    return n >= 0 && i >= 0 ? e = 2 * Math.PI - e : n >= 0 && i <= 0 && (e = 2 * Math.PI - e),
        e
}

// 获得斜边长度
function getBevelingLength(o, t) {
    return Math.sqrt(Math.pow(o, 2) + Math.pow(t, 2))
}

// 画一条虚线
function drawDashBorder(o, t, n, i, e, a) {
    // o是画图上下文PIXI.Graphics
    // a是边框段长度，默认是5
    // t, n 是第一个点， i, e是第二个点
    a = void 0 === a ? 5 : a;
    for (var l = getBeveling(i - t, e - n), h = Math.floor(l / a), p = 0; p < h; p++)
        o[p % 2 == 0 ? "moveTo" : "lineTo"](t + (i - t) / h * p, n + (e - n) / h * p)
}