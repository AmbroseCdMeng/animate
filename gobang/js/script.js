/* 定义全局变量 me 代表黑白棋 */
var me = true; //默认黑棋先行

/* 定义全局变量 over 代表棋局是否结束 */
var over = false;

/* 定义全局二维数组并初始化 存储每个落子点的落子情况 */
var chessBoard = [];
for (var i = 0; i < 15; i++) {
 chessBoard[i] = [];
 for (var j = 0; j < 15; j++) {
  chessBoard[i][j] = 0; // 0 未落子；1 黑子；2 白子
 }
}

/* 定义全局变量 count 存储赢法ID */
var count = 0;

/* 定义全局三维数组 存储所有的赢法 并初始化 */
var wins = [];
for (var i = 0; i < 15; i++) {
 wins[i] = [];
 for (var j = 0; j < 15; j++) {
  wins[i][j] = [];
 }
}

/* 遍历所有赢法 填充赢法数组 */
/* 横向五子连线的情况 */
for (var i = 0; i < 15; i++) {
 for (var j = 0; j < 11; j++) {
  for (var k = 0; k < 5; k++) {
   wins[i][j + k][count] = true;
  }
  count++;
 }
}

/* 纵向五子连线的情况 */
for (var i = 0; i < 15; i++) {
 for (var j = 0; j < 11; j++) {
  for (var k = 0; k < 5; k++) {
   wins[j + k][i][count] = true;
  }
  count++;
 }
}
/* 正斜向五子连线的情况 */
for (var i = 0; i < 11; i++) {
 for (var j = 0; j < 11; j++) {
  for (var k = 0; k < 5; k++) {
   wins[i + k][j + k][count] = true;
  }
  count++;
 }
}
/* 反斜向五子连线的情况 */
for (var i = 0; i < 11; i++) {
 for (var j = 14; j > 3; j--) {
  for (var k = 0; k < 5; k++) {
   wins[i + k][j - k][count] = true;
  }
  count++;
 }
}
//console.log(count); //572 可知 15 * 15 的棋盘上 五子棋共有 572 种赢法

/* 定义全局一维数组 统计某种赢法下黑白棋子的状态 并初始化 */
var BlackWin = [];
var WhiteWin = [];
for (var i = 0; i < count; i++) {
 BlackWin[i] = 0; // 0：未落子  1：落下1子 …… 5：胜利  6:异常 - 对方已经落子（此赢法为不可能）
 WhiteWin[i] = 0; // 换句话说，当BlackWin和WhiteWin数组的所有值都为 6 时， 为和棋
}

/***** UI设计 -- 棋盘绘制 & 棋子绘制 & 落子动作 *****/

/* 获取Canvas面板 */
var chess = document.getElementById('chess');
/* 2D面板 */
var context = chess.getContext('2d');

/* 绘制棋盘 */
var drawChessBoard = function() {
 /* 线条颜色 */
 context.strokeStyle = "#BFBFBF";
 for (var i = 0; i < 15; i++) {
  /* 横线 */
  context.moveTo(15 + i * 30, 15);
  context.lineTo(15 + i * 30, 435);
  context.stroke();
  /* 纵线 */
  context.moveTo(15, 15 + i * 30);
  context.lineTo(435, 15 + i * 30);
  context.stroke();
 }
}

/* 加载棋盘背景图 */
var logo = new Image();
logo.src = "images/logo.png";
context.drawImage(logo, 0, 0, 450, 450);
drawChessBoard();
 
 
/* 走棋 */
/* param - i : 棋子落点第几行 */
/* param - j : 棋子落点第几列 */
/* param - me : 是否黑棋 */
var oneStep = function(i, j, me) {
 /* 画圆（棋子） */
 context.beginPath();
 context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI); //圆心x  圆心y  半径  弧度(起)  弧度(止)
 context.closePath();
 //context.stroke();//描边
 //context.fill();//填充
 
/* 棋子颜色渐变 */
 var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0); //外圆圆心坐标 半径， 内圆圆心坐标半径
 if (me) {
  //黑棋颜色
  gradient.addColorStop(0, "#0A0A0A"); //外圆颜色 0代表百分比
  gradient.addColorStop(1, "#636766"); //内圆颜色 1代表百分比
  } else {
  //白棋颜色
  gradient.addColorStop(0, "#D1D1D1");
  gradient.addColorStop(1, "#F9F9F9");
 }
 context.fillStyle = gradient;
 context.fill();
}

/* canvas绑定点击事件 实现点击落子 */
chess.onclick = function(e) {
 /* 如果棋局结束 点击不再产生效果 */
  if(over){return;}
 /* 如果没有轮到黑方行棋 点击不触发事件 (如需双人对战，则取消该判断与下方AI行棋方法) */
 if (!me) {return;}
 
 var x = e.offsetX; //点击位置横坐标
 var y = e.offsetY; //点击位置纵坐标
 var i = Math.floor(x / 30); //对应x坐标到棋盘所在交叉点
 var j = Math.floor(y / 30); //对应y坐标到棋盘所在交叉点

 /* 位置为空 可以落子 */
 if (chessBoard[i][j] == 0) {
  /* 落子 */
  oneStep(i, j, me);

  if (me) {
   chessBoard[i][j] = 1; //黑方落子
  } else {
   chessBoard[i][j] = 2; //白方落子 -- 人机对战时 该行不会执行
  }
  /* 轮流落子 */
  me = !me;

  /* 落子完成之后 遍历所有赢法 */
  for (var k = 0; k < count; k++) {
   /* 包含落子点的赢法的统计数组 + 1 */
   if(wins[i][j][k]){
    BlackWin[k]++; //黑棋在第k种赢法中统计数字 + 1
    WhiteWin[k] = 6; //同时白棋不可能以第k种赢法胜利
    /* 胜利判断 */
    if (BlackWin[k] == 5) {
     window.alert("you win");
     over = true; //棋局结束
    }
   }
  }

  /* 如果棋局未结束 计算机AI自动执白行棋 */
  if (!over) {
   computerAI();
  }
 }
}

/***** AI算法基本思路与实现 *****/
/* 1、计算机执白后行 */
/* 2、计算目标：阻止黑棋五子连线 && 试图白棋五子连线 */
/* 3、记录棋盘中可能出现的所有赢法。 三维数组(棋子x, 棋子y, 赢法ID) */
/* 4、赢法统计数组。 对每一种赢法的当前落子情况统计 */
/* 5、胜负判定 */
/* 6、计算机落子优先系数 */
/* 7、计算机执白后行，同情况下白棋优先级需要高于黑棋。 即黑白棋同时4子连线时，需优先连接白棋第5子而非拦截黑棋 */
/* 8、得分累加来判定某一点落子的价值大小*/
/* 9、获取落子价值得分最高的点 */
/* 10、落子的价值分相同时， 优先级顺序的选择：高 --> 低   行白+拦黑  >  行白  >  拦黑+行白  >  拦黑 */

/* AI算法实现 */
var computerAI = function(){

 /* 定义变量 保存落子价值得分最高的分数和点坐标 */
 var max = 0;
 var u = 0;
 var v = 0;

 /* 定义两个一维数组 存储当前黑棋和白棋的落子评分 并初始化*/
 var BlackScore = [];
 var WhiteScore = [];
 for (var i = 0; i < 15; i++) {
  BlackScore[i] = [];
  WhiteScore[i] = [];
  for (var j = 0; j < 15; j++) {
   BlackScore[i][j] = 0;
   WhiteScore[i][j] = 0;
  }
 }

 /* 评分方法 */
 for (var i = 0; i < 15; i++) {
  for (var j = 0; j < 15; j++) {
   /* 该点无落子 */
   if (chessBoard[i][j] == 0) {
    /* 遍历所有赢法 */
    for (var k = 0; k < count; k++) {
     /* 对包含该点的赢法 所对应的赢法统计数组进行加分 -- 说明在该点落子是有价值的 */
     if (wins[i][j][k]) {
      /* 如果黑棋在这种赢法中已有1个落子 */
      if (BlackWin[k] == 1) {
       BlackScore[i][j] += 200;
      /* 如果黑棋在这种赢法中已有2个落子 */
      }else if (BlackWin[k] == 2) {
       BlackScore[i][j] += 400;
      /* 如果黑棋在这种赢法中已有3个落子 */
      }else if (BlackWin[k] == 3) {
       BlackScore[i][j] += 2000;
      /* 如果黑棋在这种赢法中已有4个落子 */
      }else if (BlackWin[k] == 4) {
       BlackScore[i][j] += 10000;
      }

      /* 如果白棋在这种赢法中已有1个落子 */
      if (WhiteWin[k] == 1) {
       WhiteScore[i][j] += 220;
      /* 如果白棋在这种赢法中已有2个落子 */
      }else if (WhiteWin[k] == 2) {
       WhiteScore[i][j] += 420;
      /* 如果白棋在这种赢法中已有3个落子 */
      }else if (WhiteWin[k] == 3) {
       WhiteScore[i][j] += 2100;
      /* 如果白棋在这种赢法中已有4个落子 */
      }else if (WhiteWin[k] == 4) {
       WhiteScore[i][j] += 20000;
      }
     }
    }

    /* 记录价值最高分和最高价值落子点坐标 */
    /* 优先级问题  越靠后，优先级越高*/

    /* 1、拦截黑棋 */
    if (BlackScore[i][j] > max) {
     max = BlackScore[i][j];
     u = i;
     v = j;
    /* 2、当对黑棋的拦截价值分数相同时 优先选择在拦截基础上对白棋价值分更高的点位 */
    }else if(BlackScore[i][j] == max){
     if (WhiteScore[i][j] > WhiteScore[u][v]) {
      u = i;
      v = j;
     }
    }
    /* 3、当行白棋和拦截黑棋价值分相同时，优先行走白棋*/
    if (WhiteScore[i][j] > max) {
     max = WhiteScore[i][j];
     u = i;
     v = j;
    /* 4、当多个行走白棋的方案价值分相同时，优先选择在行走白棋基础上对黑棋拦截价值分更高的点位 */
    }else if(WhiteScore[i][j] == max){
     if (BlackScore[i][j] > BlackScore[u][v]) {
      u = i;
      v = j;
     }
    }
   }
  }
 }

 /* 计算机AI计算完毕 落子 */
 oneStep(u, v, false);
 /* 改变落子点状态 */
 chessBoard[u][v] = 2; //白棋落子
 /* 胜负判定*/
 for (var k = 0; k < count; k++) {
  if (wins[u][v][k]) {
   /* 白棋在该赢法下胜利系数 + 1 */
   WhiteWin[k]++;
   /* 黑棋不可能在该赢法下胜利 */
   BlackScore[k] = 6;
   if (WhiteWin[k] == 5) {
    window.alert("Computer Win");
    over = true;
   }
  }
 }
 /* 如果未结束 改变落子方 */
 if (!over) {
  me = !me;
 }
}
