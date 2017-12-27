window.onload = function () {
    /*左侧栏 区域滚动效果 */
    new IScroll('.jd_left');
    /*右侧栏 区域滚动效果 */
    new IScroll('.jd_right',{
        /*参数*/
        scrollX:true,
        scrollY:false
    });
    /*1.注意 默认初始化的是纵向滚动*/
    /*2.如果想 横向滚动 有配置参数*/
    /*3.产生滚动的前提是：滚动方向的内容宽度高度一定要超过父容器*/

}