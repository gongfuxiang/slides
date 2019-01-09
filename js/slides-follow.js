/**
 * [幻灯片插件]
 * @author   Devil
 * @blog     http://gong.gg/
 * @version  0.0.1
 * @datetime 2017-07-26T14:21:50+0800
 */
(function(window)
{
    window.slides = {
        // 自动轮播临时值
        temp_time : 0,

        // 自动轮播间隔时间（单位秒）
        seconds : 5,

        // 滚动速度
        speed : 800,

        // 初始化索引
        index : 0,

        // 幻灯片对象
        tag : $('#slides'),

        // 轮播items个数
        count : 0,

        // 轮播状态
        status : true,

        // 动画效果[ size, follow ]
        animation : 'follow',

        // 准备开始了
        ready : function()
        {
            // 初始化
            slides.init();

            if(slides.count > 0)
            {
                slides.automatic();
            }
        },

        /**
         * [init 初始化方法]
         * @author   Devil
         * @blog     http://gong.gg/
         * @version  0.0.1
         * @datetime 2017-07-26T16:07:07+0800
         */
        init : function()
        {
            // 轮播间隔时间处理
            slides.seconds *= 1000;

            // 轮播items个数
            slides.count = slides.tag.find('.items').length;

            // 隐藏大于0索引的所有items
            slides.tag.find('.items:gt(0)').hide();

            // 处理左右按钮位置
            var width = slides.tag.find('.content').width();
            var height = slides.tag.height();
            var submit_hight = slides.tag.find('.content .left').height();
            var top = (height/2)-submit_hight/2;
            slides.tag.find('.content .left, .content .right').css("margin-top", top+"px");
            slides.tag.find('.content .left').css("margin-left", "50px");
            slides.tag.find('.content .right').css("margin-right", "50px");

            // 背景初始化
            slides.slides_background_init(slides.index);
        },

        /**
         * [automatic 自动轮播方法]
         * @author   Devil
         * @blog     http://gong.gg/
         * @version  0.0.1
         * @datetime 2017-07-26T16:06:53+0800
         */
        automatic : function()
        {
            // 定时轮播
            slides.temp_time = setInterval(function()
            {
                slides.index++;
                slides.shuffling();
            }, slides.seconds);
        },

        /**
         * [shuffling 轮播方法]
         * @author   Devil
         * @blog     http://gong.gg/
         * @version  0.0.1
         * @datetime 2017-07-26T16:06:09+0800
         * @param    {[string]}         direction [left向左, right向右（默认）]
         */
        shuffling : function(direction)
        {
            // 动画中则退出
            if(!slides.status)
            {
                return false;
            } else {
                // 幻灯片开始状态
                slides.status = false;
            }

            // 数据值处理
            if(slides.index >= slides.count) slides.index = 0;
            if(slides.index < 0) slides.index = slides.count-1;

            // 隐藏所有items
            slides.tag.find('.items').hide();

            // 显示当前index
            slides.tag.find('.items').eq(slides.index).show();

            // 获取当前浏览数可视宽度
            var window_width = parseInt($(window).width());

            // 获取当前index的背景图片的宽度
            var bd_img = slides.tag.find('.items').eq(slides.index).css("background-image");

            // 图片url截取
            var start_location = bd_img.indexOf('(');
            var end_location = bd_img.indexOf(')');
            var bd_img_url = bd_img.substr(0, end_location).substr(start_location+1).replace(/"|'/g, '');

            // 实例化图片对象
            var img = new Image();
            img.src = bd_img_url;
            var bd_img_width = parseInt(img.width) || 0;

            // 当前元素溢出像素
            var overflow = '-'+(window_width+bd_img_width)+'px';

            // 右, 左
            if((direction || 'right') == 'right')
            {
                // 幻灯片items
                slides.tag.find('.items').eq(slides.index).css({'margin-left':overflow}, 0);
                slides.tag.find('.items').eq(slides.index).stop(true,false).animate({'margin-left':'0px'}, slides.speed, function()
                {
                    // 背景初始化
                    slides.slides_background_init(slides.index);

                    // 幻灯片完成状态
                    slides.status = true;
                });

                // 动画效果
                switch(slides.animation)
                {
                    // 缩放
                    case 'size' :
                        slides.tag.css({'backgroundSize':'100%'});
                        slides.tag.stop(true,false).animate({'backgroundSize':'0%'}, slides.speed*1.8);
                        break;

                    // 跟随移动 默认
                    default :
                    slides.tag.css({'backgroundPositionX':'0px'});
                    slides.tag.stop(true,false).animate({'backgroundPositionX':(window_width+bd_img_width)+'px'}, slides.speed*1.8);
                }
            } else {
                // 幻灯片items
                slides.tag.find('.items').eq(slides.index).css({'margin-right':overflow}, 0);
                slides.tag.find('.items').eq(slides.index).stop(true,false).animate({'margin-right':'0px'}, slides.speed, function()
                {
                    // 背景初始化
                    slides.slides_background_init(slides.index);

                    // 幻灯片完成状态
                    slides.status = true;
                });

                // 动画效果
                switch(slides.animation)
                {
                    // 缩放
                    case 'size' :
                        slides.tag.css({'backgroundSize':'100%'});
                        slides.tag.stop(true,false).animate({'backgroundSize':'0%'}, slides.speed*1.8);
                        break;

                    // 跟随移动 默认
                    default :
                        slides.tag.css({'backgroundPositionX':(window_width-bd_img_width)+'px'});
                        slides.tag.stop(true,false).animate({'backgroundPositionX':'-'+bd_img_width+'px'}, slides.speed*1.5);
                }                
            }

            // 圆点处理
            slides.tag.find('.dot li').removeClass('active');
            slides.tag.find('.dot li').eq(slides.index).addClass('active');
        },

        /**
         * [slides_background_init 背景初始化]
         * @author   Devil
         * @blog     http://gong.gg/
         * @version  0.0.1
         * @datetime 2017-08-11T13:18:34+0800
         * @param    {[int]}                 index [元素索引值]
         */
        slides_background_init : function(index)
        {
            // 获取当前index的背景图片的宽度
            var bd_img = slides.tag.find('.items').eq(index).css("background-image");

            slides.tag.css({"background-image":bd_img});
        },

        /**
         * [manual_left 手动向左滚动方法]
         * @author   Devil
         * @blog     http://gong.gg/
         * @version  0.0.1
         * @datetime 2017-07-26T16:05:49+0800
         */
        manual_left : function()
        {
            clearInterval(slides.temp_time);
            slides.index--;
            slides.shuffling('left');
            slides.automatic();
        },

        /**
         * [manual_right 手动向右滚动方法]
         * @author   Devil
         * @blog     http://gong.gg/
         * @version  0.0.1
         * @datetime 2017-07-26T16:05:58+0800
         */
        manual_right : function()
        {
            clearInterval(slides.temp_time);
            slides.index++;
            slides.shuffling();
            slides.automatic();
        },

        /**
         * [manual_dot 圆点设置]
         * @author   Devil
         * @blog     http://gong.gg/
         * @version  0.0.1
         * @datetime 2017-08-11T13:48:12+0800
         * @param    {[int]}                 index [元素索引值]
         */
        manual_dot : function(index)
        {
            var active_index = slides.tag.find('.dot li.active').index();
            clearInterval(slides.temp_time);
            if(active_index < index || index == slides.count-1)
            {
                slides.index++;
                slides.shuffling();
            } else {
                slides.index--;
                slides.shuffling('left');
            }
            slides.automatic();
        }
    }
})(window);


$(function()
{
    // 首页幻灯片
    slides.ready();
    $('#slides .content').on('click', '.left', function()
    {
        slides.manual_left();
    });
    $('#slides .content').on('click', '.right', function()
    {
        slides.manual_right();
    });
    $('#slides .dot').on('click', 'li', function(e)
    {
        slides.manual_dot($(this).index());
    });
});