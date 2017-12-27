window.onload = function () {
    /*1.搜索显示*/
    search();
    /*2.轮播图*/
    banner();
    /*3.倒计时*/
    downTime();
}
var search = function () {
    /*1. 默认完全透明 顶部固定*/
    /*2. 当页面滚动的时候 距离越大透明度越大 */
    /*3. 当滚动超过了轮播图  透明度不变 0.85*/

    /*获取需要操作的dom*/
    var searchBox = document.querySelector('.jd_search_box');
    var banner = document.querySelector('.jd_banner');
    var height = banner.offsetHeight;
    /*监听页面滚动事件*/
    window.onscroll = function () {
        /*改变透明度*/
        var opacity = 0;
        /*判断条件*/
        /*获取实时 距离顶部的滚动距离--》卷曲的高度*/
        var top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        if (top < height) {
            /*做透明度改变 正比变化*/
            opacity = top / height * 0.85;
        } else {
            opacity = 0.85;
        }
        /*设置给dom*/
        searchBox.style.background = 'rgba(201,21,35,' + opacity + ')';
    }
};
var banner = function () {
    /*1. 自动轮播图  无缝滚动 无缝滑动  （图片更换：定时器，动画：过渡，无缝：过渡结束） */
    /*2. 点随着滚动  （根据图片索引 去找到对应的点  改变样式）*/
    /*3. 滑动效果    （touch事件组合  即时实时）*/
    /*4. 吸附效果    （touch事件组合  滑动结束 判断滑动的距离  动画：过渡）*/
    /*5. 滑动切换    （touch事件组合  滑动结束 判断滑动的距离 切换上一张下一张  动画：过渡）*/

    /*获取需要操作的dom*/
    var banner = document.querySelector('.jd_banner');
    var width = banner.offsetWidth;
    var imageBox = banner.querySelector('ul:first-child');
    var pointBox = banner.querySelector('ul:last-child');
    var lis = pointBox.querySelectorAll('li');


    var addTransition = function () {
        imageBox.style.transition = 'all 0.3s';
        imageBox.style.webkitTransition = 'all 0.3s';
    };
    var removeTransition = function () {
        imageBox.style.transition = 'none';
        imageBox.style.webkitTransition = 'none';
    }
    var setTranslateX = function (translateX) {
        imageBox.style.transform = 'translateX(' + translateX + 'px)';
        imageBox.style.webkitTransform = 'translateX(' + translateX + 'px)';
    }

    /*1.自动轮播图*/
    var index = 1;
    var timer = setInterval(function () {
        index++;
        /*加上过渡*/
        addTransition();
        /*做定位*/
        var translateX = -index * width;
        setTranslateX(translateX);
    }, 3000);

    imageBox.addEventListener('transitionend', function () {
        /*当索引为9瞬间定位到第一张 索引为1*/
        if (index >= 9) {
            /*无缝滚动*/
            index = 1;
            /*瞬间定位*/
            removeTransition();
            /*做定位*/
            var translateX = -index * width;
            setTranslateX(translateX);
        } else if (index <= 0) {
            /*无缝滑动 */
            index = 8;
            /*瞬间定位*/
            removeTransition();
            /*做定位*/
            var translateX = -index * width;
            setTranslateX(translateX);
        }
        /*每次过渡结束 切换点*/
        setPoint();
    });

    /*2. 点随着滚动*/
    /*问在这个执行环境当中 index 取值范围  0-9 */
    var setPoint = function () {
        /*根据index来对应点*/
        /*执行环境 transitionend index 取值范围  1-8 */
        /*点的index 0 - 7 */
        pointBox.querySelector('li.now').classList.remove('now');
        lis[index - 1].classList.add('now');
    }

    /*3. 滑动效果*/
    /*3.1 记录起始的触摸点X坐标*/
    /*3.2 监听滑动过程当中的X坐标*/
    /*3.3 计算两个坐标的位置改变 */
    /*3.4 使用这个改变的距离 去设置对应的操作元素 的位置*/
    var startX = 0;
    var distanceX = 0;
    var isMove = false;
    var startTime = 0;
    imageBox.addEventListener('touchstart', function (e) {
        startTime = Date.now();//new Date().getTime(); 获取当前时间的时间戳
        startX = e.touches[0].clientX;
        /*清除定时器*/
        clearInterval(timer);
    });
    imageBox.addEventListener('touchmove', function (e) {
        var moveX = e.touches[0].clientX;
        distanceX = moveX - startX;
        /*问题：distanceX 取值范围  可以为正负 */
        /*当前定位=原理的定位+位置的改变*/
        var translateX = -index * width + distanceX;
        /*去过渡*/
        removeTransition();
        /*做定位*/
        setTranslateX(translateX);
        isMove = true;
    });
    imageBox.addEventListener('touchend', function (e) {
        /*判断滑动的距离 三分之一 */
        if (isMove) {
            /*6. 滑动速度足够 进行切换*/
            /*6.1 速度 = 距离 / 时间（开始触摸到结束触摸）*/
            /*6.2 人体测试  正常的速度是多次*/
            /*6.3 根据这个速度去判断  满足条件去切换*/
            var totalTime = Date.now() - startTime;
            var speed = Math.abs(distanceX) / totalTime;
            console.log(speed);// 没毫秒移动多少PX  大概 0.2
            if(speed > 0.2){
                /* 左滑 下一张 */
                if (distanceX < 0) {
                    index++;
                }
                /* 右滑 上一张 */
                else {
                    index--;
                }
                addTransition();
                setTranslateX(-index * width);
                return false;
            }

            if (Math.abs(distanceX) < width / 3) {
                /*4. 吸附效果    （touch事件组合  滑动结束 判断滑动的距离  动画：过渡）*/
                /*回到原来定位*/
                addTransition();
                setTranslateX(-index * width);
            } else {
                /*5. 滑动切换    （touch事件组合  滑动结束 判断滑动的距离 切换上一张下一张  动画：过渡）*/
                /* 左滑 下一张 */
                if (distanceX < 0) {
                    index++;
                }
                /* 右滑 上一张 */
                else {
                    index--;
                }
                addTransition();
                setTranslateX(-index * width);
            }
        }

        /*开启定时器*/
        clearInterval(timer);
        timer = setInterval(function () {
            index++;
            /*加上过渡*/
            addTransition();
            /*做定位*/
            var translateX = -index * width;
            setTranslateX(translateX);
        }, 3000);

        /*严谨操作*/
        startX = 0;
        distanceX = 0;
        isMove = false;
    });

};
var downTime = function () {
    /*1. 模拟一个时间  5小时*/
    /*2. 定时器 更改 黑色容器的数字 */
    var spans = document.querySelectorAll('.sk_time span');
    var time = 5 * 60 * 60;

    var timer = setInterval(function () {
        time--;
        /*格式化*/
        var h = Math.floor(time / 3600);
        var m = Math.floor(time % 3600 / 60);
        var s = Math.floor(time % 60);
        /*更改 黑色容器的数字*/
        spans[0].innerHTML = Math.floor(h / 10);
        spans[1].innerHTML = h % 10;

        spans[3].innerHTML = Math.floor(m / 10);
        spans[4].innerHTML = m % 10;

        spans[6].innerHTML = Math.floor(s / 10);
        spans[7].innerHTML = s % 10;

        if(time <= 0){
            clearInterval(timer);
        }
    }, 1000);
};