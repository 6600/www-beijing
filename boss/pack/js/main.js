var allText = [
    '考勤灵活，错峰上班',
    '批评鼓励，缺一不可',
    '关注新人，培养黑马',
    '定期培训，提升技能',
    '带薪年假，遵守国法',
    '锻炼常做，过劳不肥',
    '二月十四，不要加班',
    '多搞团建，增加默契',
    '三餐不误，劳逸结合',
    '沟通顺畅，不打官腔'
]


var shareText = [];
var shareImg = [];


// 默认分享语句
window.wxData = {
    // 测试, 修改图片
    "imgUrl": "http://m.people.cn/img/WIRELESS/2018/12/200321/images/share.jpg",
    "link": window.location.href.split('?')[0],
    "title": '锦鲤驾到，捡起你的flag',
    "desc": allText[parseInt(Math.random() * 100) % 8]
};

function setShareData() {
    if (!window.WXSignReady) {
        setTimeout(function() {
            setShareData()
        }, 310)
    } else {
        if (window.location.href.indexOf('people') === -1) {
            console.log('[测试]分享标题是: ' + wxData.desc)
        }
        window.shareWXData()
        console.log('微信分享语句', JSON.stringify(window.wxData))
    }
}

// 设置微信分享语
setShareData()

var $select_module = $('.page-list').clone(true);

const addTouchEvent = () => {
    var $flag = $select_module.clone(true);
    var $selectedImg = $('.select-img');
    var contW = $(".select-img").width();
    var contH = $(".select-img").height();
    var startX, startY, sX, sY, moveX, moveY, endX, endY;
    var winW = $(window).width();
    var winH = $(window).height();
    var index = -1;
    var $selected_box = $('.page-selected').find('.selected-imgs');
    $selectedImg.on({ //绑定事件
        touchstart: function(e) {
            e.preventDefault();
            startX = e.originalEvent.targetTouches[0].pageX; //获取点击点的X坐标    
            startY = e.originalEvent.targetTouches[0].pageY; //获取点击点的Y坐标
            console.log("startX=" + startX + "************startY=" + startY);
            sX = $(this).offset().left; //相对于当前窗口X轴的偏移量
            sY = $(this).offset().top; //相对于当前窗口Y轴的偏移量
            //console.log("sX="+sX+"***************sY="+sY);
            leftX = startX - sX; //鼠标所能移动的最左端是当前鼠标距div左边距的位置
            rightX = winW - contW + leftX; //鼠标所能移动的最右端是当前窗口距离减去鼠标距div最右端位置
            topY = startY - sY; //鼠标所能移动最上端是当前鼠标距div上边距的位置
            bottomY = winH - contH + topY; //鼠标所能移动最下端是当前窗口距离减去鼠标距div最下端位置                
        },
        touchmove: function(e) {
            e.preventDefault();
            moveX = e.originalEvent.targetTouches[0].pageX; //移动过程中X轴的坐标
            moveY = e.originalEvent.targetTouches[0].pageY; //移动过程中Y轴的坐标

            $(this).css({
                "left": moveX + sX - startX,
                "top": moveY + sY - startY,
            })
        },
        touchend: function(e) {
            e.preventDefault();
            endY = e.originalEvent.changedTouches[0].pageY;
            var distanceY = endY - startY;
            if (distanceY < -100) {
                $(this).animate({ top: '-1000px' });
                var $url = $(this).find('img:eq(1)').attr('src');
                index += 1;
                $('.selected-box div').each(function(idx) {
                    if (idx === index) {
                        $(this).find('img:eq(1)').attr('src', $url);
                    }
                })
                $('.add-1').show().fadeOut(400);
                shareText.push($(this).find('div').text());
                shareImg.push($(this).find('img:eq(1)').attr('src'));
                $selected_box.find('img:eq(0)').attr('src', shareImg[0]);
                $selected_box.find('img:eq(1)').attr('src', shareImg[1]);
                $selected_box.find('img:eq(2)').attr('src', shareImg[2]);
                $selected_box.find('.select-text:eq(0)').innerHTML = shareText[0];

            } else if (distanceY > 100) {
                var $one_img = $(".img-box div:eq(0)");
                $(this).animate({ top: '2000px' }, 500, function() {
                    $(this).insertBefore($one_img);
                }).animate({
                    top: 0,
                    left: 0
                }, 0)
            } else {
                $(this).animate({
                    'left': 0,
                    'top': 0
                }, 100);
            }
            if ($('.selected-box div:eq(2)').find('img:eq(1)').attr('src')) {
                setTimeout(function() {
                    $('.page-list').replaceWith($flag);
                    addTouchEvent();
                    index = -1;
                    $('.page-list').hide();

                }, 1000);
                setTimeout(function() {
                    $('.page-loading').show();
                }, 600);
                var $num = $('.progress-num');
                setChangeImg = setInterval(function() {
                    var src = shareImg.shift();
                    var text = shareText.shift();
                    shareImg.push(src);
                    shareText.push(text);
                    $selected_box.find('img:eq(0)').attr('src', shareImg[0]);
                    $selected_box.find('img:eq(1)').attr('src', shareImg[1]);
                    $selected_box.find('img:eq(2)').attr('src', shareImg[2]);
                    $selected_box.find('.select-text').innerHTML = shareText[0];
                }, 2000);
                PEOPLE.preloadImages(
                    shareImg,
                    function() {
                        setTimeout(function() {
                            $('.page-loading').fadeOut(600, function() {
                                console.log(123);
                                // $('.paper').attr('src', 'pack/images/paper.gif')
                            })
                        }, 800)
                    },
                    function(progress) {
                        $num.html(progress + '%')
                    }
                )
            }
        }

    })
}

function addEvent() {
    // PEOPLE.showBgm()
    // PEOPLE.hideBgm()
    $(window).scrollTop(0)

    // 上滑下滑检测，切换愿望
    var $pageCover = $('.page-cover');
    var hm = new Hammer($pageCover.get(0));
    var $bgm = $('#bgm');
    var $pageRule = $('.page-rule');



    $pageCover.on('touchstart click', function(e) {
        e.stopPropagation()
        var animationEnd = (function(el) {
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                    return animations[t];
                }
            }
        })(document.createElement('div'));

        $pageCover.one(animationEnd, function() {
            setTimeout(function() {
                $pageCover.hide()
            }, 100)
        })

        $pageCover.addClass('animated fadeOutUp')

        $bgm.get(0).play()
        $('#music').show()

    })

    $pageRule.on('touchstart click', function(e) {
        e.stopPropagation()
        var animationEnd = (function(el) {
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                    return animations[t];
                }
            }
        })(document.createElement('div'));

        $pageRule.one(animationEnd, function() {
            setTimeout(function() {
                $pageRule.hide()
            }, 100)
        })

        $pageRule.addClass('animated fadeOutUp')
    })

    addTouchEvent();

    var $button_1 = $('.button-1');
    var $button_2 = $('.button-2');
    var c = document.getElementById('poster');
    var ctx = c.getContext('2d');
    $button_1.on('touchstart click', function() {
        $('.page-list').show();
        clearInterval(setChangeImg);
    })
    $button_2.on('touchstart', function() {
        // console.log(123);
        clearInterval(setChangeImg);
        // $('.page-selected').hide();
        $('.page-poster').slideDown(600);
        $('.page-poster').on('touchstart', function(e) {
            $(this).slideUp();
        });
        $('.page-poster img:eq(0)').on('touchstart click', function(e) {
                e.stopPropagation();
            })
            // $('.page-poster img:eq(0)').show(1000);
        drawPoster(ctx);
    })
    var $changeShareImg = $('.change-img img');
    $changeShareImg.on('touchstart', function(e) {
            e.stopPropagation();
            var src = shareImg.shift();
            var text = shareText.shift();
            shareImg.push(src);
            shareText.push(text);
            drawContentImg(ctx);
        })
        // $('#poster').on('touchstart', function() {
        //     e.stopPropagation();
        // })
        // $('.page-poster').on('touchstart', function(e) {
        //     $('.page-poster').hide();
        // })

}
addEvent();

//     canvas
function drawPoster(ctx) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 330, 500);
    drawBg(ctx);

}

function drawBg(ctx) {
    var bgImg = new Image();
    bgImg.src = 'pack/images/canvas-bg.png';
    bgImg.onload = function() {
        ctx.drawImage(bgImg, 0, 0, 320, 550);
        drawTitleText(ctx);
        drawText(ctx, shareText[0], 20, 410, 70);
        drawText(ctx, shareText[1], 90, 410, 70);
        drawText(ctx, shareText[2], 160, 410, 70);
        drawLine(ctx);
        drawContentImg(ctx);
        drawTip(ctx, '1.', 8, 434);
        drawTip(ctx, '2.', 78, 434);
        drawTip(ctx, '3.', 148, 434);
    }
}

function drawTip(ctx, t, x, y) {
    ctx.fillStyle = "rgb(242, 130, 77)";
    ctx.font = "14px usedFont";
    ctx.fillText(t, x, y);
}

function drawLine(ctx) {
    ctx.strokeStyle = 'rgb(242, 130, 77)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, 468);
    ctx.lineTo(80, 468);
    ctx.moveTo(90, 468);
    ctx.lineTo(150, 468);
    ctx.moveTo(160, 468);
    ctx.lineTo(220, 468);
    ctx.closePath();
    ctx.stroke();
}

function drawText(ctx, t, x, y, w) {
    ctx.fillStyle = "rgb(242, 130, 77)";
    var chr = t.split("");
    var temp = "";
    var row = [];

    ctx.font = "14px usedFont";
    ctx.textBaseline = "middle";

    for (var a = 0; a < chr.length; a++) {

        if (ctx.measureText(temp).width < w && ctx.measureText(temp + (chr[a])).width <= w) {
            temp += chr[a];
        } //context.measureText(text).width  测量文本text的宽度
        else {
            row.push(temp);
            temp = chr[a];
        }
    }
    row.push(temp);

    for (var b = 0; b < row.length; b++) {
        ctx.fillText(row[b], x, y + (b + 1) * 24); //字体20，间隔24。类似行高
    }

}

// function drawSeconedText(ctx) {
//     ctx.fillStyle = "rgb(242, 130, 77)";
//     ctx.font = "18px Arial";
//     ctx.fillText(shareText[1], 80, 440);
// }

// function drawThirdText(ctx) {
//     ctx.fillStyle = "rgb(242, 130, 77)";
//     ctx.font = "18px Arial";
//     ctx.fillText(shareText[2], 140, 440);
// }

function drawTitleText(ctx) {
    ctx.fillStyle = "rgb(79, 51, 96)";
    ctx.font = "18px usedFont";
    ctx.fillText('老板，开年我想对你说', 60, 40);
}

function drawContentImg(ctx) {
    var contentImg = new Image();
    contentImg.src = shareImg[0];
    contentImg.onload = function() {
        ctx.drawImage(contentImg, 20, 80, 260, 300);
        drawContentText(ctx);
    }
}

function drawContentText(ctx) {
    var contentText = new Image();
    contentText.src = 'pack/images/canvas-text.png';
    contentText.onload = function() {
        ctx.drawImage(contentText, 20, 400, 220, 20);
        drawQrcode(ctx);
    }
}

function drawQrcode(ctx) {
    var contentText = new Image();
    contentText.src = 'pack/images/qrcode.png';
    contentText.onload = function() {
        ctx.drawImage(contentText, 230, 430, 60, 60);
        drawLogoImg(ctx);
    }
}

function drawLogoImg(ctx) {
    var logoImg = new Image();
    logoImg.src = 'pack/images/bottom-logo.png';
    logoImg.onload = function() {
        ctx.drawImage(logoImg, 20, 470, 220, 20);
        var canvas = document.getElementById('poster');
        console.log(canvas.toDataURL('image/png'));
        $('.canvas-img').attr('src', canvas.toDataURL('image/png'));
    }
}