var myCharts = echarts.init(document.getElementById("view"));
/* 基础数据 */
var base = [220, 150, 189, 40, 90, 126, 280];

var warningValue = 20;   //警告值
var errorValue = 220;    //错误值

var normal = [];	//正常范围 0~20
var warning = [];  //警告范围 20~200
var error = [];	//错误范围 200~

/* 简单的数据处理 */
base.forEach(function (value, index, data) {
    normal[index] = data[index] > warningValue ? warningValue : data[index];
});
base.forEach(function (value, index, data) {
    error[index] = data[index] < errorValue ? 0 : data[index] - errorValue;
});
base.forEach(function (value, index, data) {
    warning[index] = data[index] - normal[index] - error[index] < 0 ? 0 : data[index] - normal[index] - error[index];
});

myCharts.clear();

option = {
	/* 图表标题 */
    title: {
        show: true,
        text: 'Demo'
    },
    /* X 轴 */
    xAxis: [{
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        position: 'bottom'
    }],
    /* Y 轴 */
    yAxis: [{
        show: true,
        type: 'value',
        max: 300
    }],
    /* 相关数据 */
    series: [
    /* 正常范围数据 */
    {
    	   name: 'normal',
        type: 'bar',	// 折线图
        barWidth: 30,	//柱体宽度
        stack: 'a',	//分组
        data: normal,	
        color: function (p) {
            return 'rgb(0,255,0)';	// 绿色
        }
    },
    /* 警告范围数据 */
    {
        name: 'warning',
        type: 'bar',
        barWidth: 30,
        stack: 'a',	//同一分组  数据叠加
        data: warning,
        /* 该范围内颜色为渐变效果 */
        /* 渐变的结束色分两种情况：
			1：超过警告值一半：三色渐变，结束颜色为黄色与红色之间的某种颜色
			2：未超过警告值一半：两个渐变，结束颜色为绿色与黄色之间的某种颜色
			★ 并且，三色渐变情况下需要计算恰好到黄色时，黄色所在的位置比例
	   */
        color: function (p) {
        		var color;
        		mid = (errorValue - warningValue) / 2;
        		//三色渐变
              if (warning[p.dataIndex] > mid) {
            	//颜色范围   0,255,0  -->  255,255,0    &  255,255,0 -->  255,0,0     255*2
             	//值范围      (warningValue, errorValue)      
             	//颜色单位变化（前半段变化固定 只计算后半段(黄 - 红)变化）
             	ps = 255 / ((errorValue - warningValue) / 2);
             	//计算渐变比例
             	pb = mid / warning[p.dataIndex] * 1.0;
             	//计算第二段变色
             	startColor = 'rgb(255,255,0)';//后半段起始色
             	endColor = 'rgb(255,' + (255 - ((warning[p.dataIndex] - mid) * ps)) + ',0)';//后半段结束色
             	color = new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    { offset: 0, color: 'rgb(0,255,0)' },
                    { offset: pb, color: startColor },
                    { offset: 1, color: endColor }
                ]);
            }
            //双色渐变
            else {
                //颜色范围   0,255,0  -- >  255,255,0       Y --> G         255
                //值范围      (warningValue, (errorValue-warningValue)/2)        
                //颜色单位变化
                ps = 255 / ((errorValue - warningValue) / 2);
                //双色不需要计算渐变比例
                //起始色固定 计算终止色
                startColor = 'rgb(0,255,0)';
                endColor = 'rgb(' + (ps * warning[p.dataIndex]) + ', 255, 0)'; // G --> Y 255,255,0
                //console.log(startColor, endColor);
                //返回渐变值
                color = new echarts.graphic.LinearGradient(0, 1, 0, 0,
                    [
                        { offset: 0, color: startColor },
                        { offset: 0.5, color: endColor }
                    ]
                );
            }
            return color;
        }
    },
    /* 错误范围数据 */ 
    {
        name: 'error',
        type: 'bar',
        barWidth: 30,
        stack: 'a',
        data: error,
        color: 'rgb(255,0,0)'
    }]
};

myCharts.setOption(option);
