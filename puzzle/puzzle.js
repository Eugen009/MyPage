
var gPuzzleSize = 3;
var gPuzzleBlockNum = gPuzzleSize * gPuzzleSize;
var gPuzzleNode = null;//九宫格的HTML结构
var gBlockSize = [ 200, 200 ];
var gBorderSize = 2;
var gImageOffset = [0, 0]
var gPuzzleBlankId = gPuzzleBlockNum - 1;
var gImageFile = "http://www.clipstudio.net/view/img/en/howto/en_taira_akitsu.jpg";//"file:///E:/picture/art/ref/browser/39607774.jpg";
var gCurrentTime = 0;
var gStartGame = false;
var gGameTimer = null;
var gGameStartTimeout = null;

function ToStyleValue( value )
{
	var valueStr = "";
	valueStr += value;
	valueStr += "px";
	return valueStr;
}

function SetStyleBorder( node, width, type, color )
{
	var valueStr = "";
	valueStr = "";
	valueStr += gBorderSize;
	valueStr += "px ";
	if( type != null )
	{
		valueStr += type;
		valueStr += " ";
	}
	if( color != null )
	{
		valueStr += color;
	}
	node.style.border = valueStr;
}

function OnBlockOver( e )
{
	if( e != null && e.currentTarget )
	{
		var overIndex = GetBlockIndexByParent( e.currentTarget );
		if( overIndex == -1 ) return;
		var blockNode = gPuzzleNode[overIndex];
		if( blockNode.id == gPuzzleBlankId ) return;
		if( overIndex != -1 && GetNearBlankIndex( blockNode ) != -1 )
		{
			SetNodeStyle( e.currentTarget, true );
		}
	}
}

function OnBlockOut( e )
{
	if( e != null && e.currentTarget )
	{
		//这里就强制更新吧
		SetNodeStyle( e.currentTarget, false );
	}
}

function SetNodeStyle( node, bSelected )
{
	if( node != null )
	{
		if( bSelected )
		{
			SetStyleBorder( node, gBorderSize, "solid", "red" );
		}
		else
		{
			SetStyleBorder( node, gBorderSize, "solid", "black" );
		}
	}
}

function SetNodeVisible( node, visible )
{
	if( !node ) return;
	if( visible )
	{
		node.style.display = "block";
	}
	else
	{
		node.style.display = "none";
	}
}

function OnBlockClicked( e )
{
	if( e == null || e.currentTarget ==  null ) return;
	
	var blockIndex = GetBlockIndexByParent( e.currentTarget );
	if( blockIndex != -1 )
	{
		var blockNode = gPuzzleNode[blockIndex];
		SetNodeStyle( e.currentTarget, false );
		MoveToBlank( gPuzzleNode[blockIndex] );
		if( IsJigsawFinished() )
		{
			OnGameSuccess();
		}
	}
}

function CreatePuzzleBlock( index, id, node )
{
	var block = new Object();
	block.id = id;
	block.node = node;
	block.curIndex = index;
	return block;
}

function GetPosByIndex( index )
{
	var x = Math.floor(index % 3);// * gBlockSize[0];
	var y = Math.floor(index / 3);// *  gBlockSize[1];
	var pos = [x,y];
	return pos;
}

function ShowJigsawBorder( divNode, flag, x, y )
{
	if( flag ){
		if( x == null || y == null ) return;
		SetStyleBorder( divNode, gBorderSize, "solid", "black" );
		divNode.style.width = ToStyleValue(gBlockSize[0] - (gBorderSize*2));
		divNode.style.height = ToStyleValue(gBlockSize[1] - (gBorderSize*2));
		divNode.onmouseover = OnBlockOver;
		divNode.onmouseout = OnBlockOut;
		divNode.onclick = OnBlockClicked;
	}else{
		divNode.style.border = "none";
		divNode.style.width = ToStyleValue( gBlockSize[0] );
		divNode.style.height = ToStyleValue( gBlockSize[1] );
		divNode.onclick = null;
		divNode.onmouseover = null;
		divNode.onmouseout = null;
	}
}

function SetJigsawBorderVisible( flag )
{
	for( var y = 0; y < gPuzzleSize; y++ )
	{
		for( var x = 0; x < gPuzzleSize; x++ )
		{
			var index = x + y * gPuzzleSize;
			ShowJigsawBorder( GetDivNodeByJigsaw( gPuzzleNode[index] ), flag, x, y );
		}
	}
}

function OnImageLoadedFinish( e )
{
	if( !e || !e.currentTarget ) return;
	var img = e.currentTarget;
	if( img.width > img.height ) 
	{
		var minSize = gBlockSize[1] * gPuzzleSize;
		var realWidth = minSize/img.height * img.width ; 
		img.style.height = ToStyleValue( minSize );//(gBlockSize[1] * gPuzzleSize) );
		img.style.width = ToStyleValue( realWidth );
		//居中处理
		var offset = realWidth - minSize;
		offset /= 2;
		offset = Math.floor( offset );
		var org = parseInt( img.style.left );
		org -= offset;
		img.style.left = ToStyleValue( org );
	}
	else 
	{
		var minSize = gBlockSize[0] * gPuzzleSize;
		//alert("after set size:" + (img.height/img.width) );
		var realHeight = img.height/img.width * minSize;
		img.style.width = ToStyleValue( minSize );
		img.style.height = ToStyleValue( realHeight );
		//居中处理
		var offset = realHeight - minSize;
		offset /= 2;
		offset = Math.floor( offset );
		var org = parseInt( img.style.top );
		org -= offset;
		img.style.top = ToStyleValue( org );
		
	}
}

function CreatePuzzle( parentNode, imageName )
{
	if( parentNode == null )
		return;
	//test only
	var count = gPuzzleBlockNum;
	gPuzzleNode = new Array();
	for( var i = 0; i < count; i ++ )
	{
		var pos = GetPosByIndex( i );
		var divNode = document.createElement("div");
		if( pos[0] == 2 ){
			divNode.style.cssFloat = "none";
		}else{
			divNode.style.cssFloat = "left";
		}
		divNode.style.margin = "0px 0px";
		divNode.style.padding = "0px";
		divNode.style.overflow = "hidden";

		var imgNode = document.createElement("img");
		imgNode.src = imageName;
		imgNode.style.top = ToStyleValue( -pos[1] * gBlockSize[1] - gImageOffset[0] );
		imgNode.style.left = ToStyleValue( -pos[0] * gBlockSize[0] - gImageOffset[1] );
		imgNode.style.position = "relative";
		imgNode.onload = OnImageLoadedFinish;
		imgNode.style.height = "600px";//eugen test
		ShowJigsawBorder( divNode, false, pos[0], pos[1] );
		
		//构成HTML的结构
		divNode.appendChild( imgNode );
		parentNode.appendChild( divNode );
		
		//程序结构
		var puzzleBlock = CreatePuzzleBlock( i, i, imgNode );
		gPuzzleNode.push( puzzleBlock );
	}
}

function GetBlockIndexByParent( node )
{
	for( var i = 0; i < gPuzzleBlockNum; i ++)
	{
		var block = gPuzzleNode[i];
		var parentNode = GetDivNodeByJigsaw( block );
		if( parentNode == node )
			return i;
	}
	return -1;
}

function IsValidPosInPuzzle( x, y )
{
	if( x < 0 || x >= gPuzzleSize || 
		y < 0 || y >= gPuzzleSize )
		return false;
	return true;
}

function GetNearBlankIndex( block )
{
	var curIndex = block.curIndex;
	var x = Math.floor( curIndex % gPuzzleSize );
	var y = Math.floor( curIndex / gPuzzleSize );
	//搜索四个方向, 左上右下
	var dir = [ 
		-1, 0,
		0, -1, 
		1, 0,
		0, 1
		];
	for( var i = 0; i< 4; i ++ )
	{
		var dirIndex = i * 2;
		var curX = x + dir[dirIndex];
		var curY = y + dir[dirIndex + 1];
		if( !IsValidPosInPuzzle( curX, curY ) )
			continue;
		var curIndex = curY * gPuzzleSize + curX;
		var tempBlock = gPuzzleNode[curIndex];
		if( tempBlock && tempBlock.id == gPuzzleBlankId )
			return curIndex;
	}
	return -1;
}

function SwapBlockPos( b1, b2 )
{
	if( b1 == null || b2 == null )
		return;
	gPuzzleNode[b1.curIndex] = b2;
	gPuzzleNode[b2.curIndex] = b1;
	var tempId = b1.curIndex;
	b1.curIndex = b2.curIndex;
	b2.curIndex = tempId;
	
	//修改显示方式
	var b1Parent = b1.node.parentNode;
	b1Parent.removeChild( b1.node );
	var b2Parent = b2.node.parentNode;
	b2Parent.removeChild( b2.node );
	b1Parent.appendChild( b2.node );
	b2Parent.appendChild( b1.node );
}

function MoveToBlank( block )
{
	if( block == null ) return;
	var blankId = GetNearBlankIndex( block );
	if( blankId == -1 ) return;
	SwapBlockPos( block, gPuzzleNode[blankId] );
}

function MakeMessOfBlock()
{
	//var preId = gPuzzleBlockNum - 1;
	var dir = [ 
		-1, 0,
		0, -1, 
		1, 0,
		0, 1
	];
	var count = gPuzzleBlockNum;
	var curNum = 0;
	var x = gPuzzleSize - 1;
	var y = gPuzzleSize - 1;
	var preIds = new Array();
	var nextPoses = [
		-1,-1,-1,
		-1,-1,-1,
		-1,-1,-1,
		-1,-1,-1
	];
	// alert( "nextPoses Length:" + nextPoses.length );
	//算法为，从空白取邻坐的四点，去掉已经占用的，再随机抽一个，四周都无空时，结束
	while( curNum < count )
	{
		var curNextSize = 0;
		for( var k = 0; k < 8; k += 2 )
		{
			var nextX = x + dir[k];
			var nextY = y + dir[k+1];
			if( !IsValidPosInPuzzle( nextX, nextY ) )
			{
				continue;
			}
			var nextId = nextX + nextY * gPuzzleSize;
			var j = 0;
			for( j = 0; j < preIds.length && preIds[j]!= nextId; j ++){}
			if( j == preIds.length )
			{
				var tempIndex = curNextSize * 3;
				nextPoses[tempIndex] = nextId;
				nextPoses[tempIndex+1] = nextX;
				nextPoses[tempIndex+2] = nextY;
				curNextSize ++;
			}
		}
		if( curNextSize == 0 ) break;//已经在附近找不到移动的地方了		
		//随机找一个
		var num = Math.floor( Math.random() * 1000 );
		num = num % curNextSize;
		num *= 3;
		var preId = gPuzzleBlockNum - 1;
		var nextId = nextPoses[num ];
		if( preIds.length > 0 ) preId = preIds[preIds.length - 1];
		SwapBlockPos( gPuzzleNode[nextId], gPuzzleNode[preId] );
		preIds.push(nextId);
		x = nextPoses[num +1];
		y = nextPoses[num +2];
		curNum ++;
	}
}

function IsJigsawFinished()
{
	var i = 0;
	for( ; i< gPuzzleBlockNum; i++ )
	{
		var block = gPuzzleNode[i];
		if( i != block.id ) break;
	}
	return i == gPuzzleBlockNum;
}

function GetDivNodeByJigsaw( block )
{
	var node = block.node;
	if( node && node.parentNode && node.parentNode )
		return node.parentNode;
	return null;
}

function ShowAllJigsaw()
{
	var blankNode = gPuzzleNode[gPuzzleBlankId];
	if( blankNode.id != gPuzzleBlankId ) return;
	SetNodeVisible( blankNode.node, true );
	for( var i = 0; i < gPuzzleBlockNum; i ++ )
	{
		var block = gPuzzleNode[i];
		var divNode = GetDivNodeByJigsaw( block );
		if( divNode )
		{
			ShowJigsawBorder( divNode, false, null, null );
		}
	}
}

function OnUpdateTimer()
{
	if( !gStartGame ) return;
	gCurrentTime +=1;
	var second = gCurrentTime % 60;
	var min = Math.floor( gCurrentTime / 60 );
	if( min > 99 ) min = 99;
	var node = document.getElementById("timer");
	if( node )
	{
		var minStr = "";
		if( min / 10 < 1 ) minStr += "0";
		minStr += min;
		var secStr ="";
		if( second /10 < 1) secStr += "0";
		secStr += second;
		node.innerHTML = minStr + ":" + secStr;
	}
	gGameTimer = setTimeout( OnUpdateTimer, 1000 );
}

function OnGameStartTimeout()
{
	gGameStartTimeout = null;
	if( gPuzzleNode == null || !gStartGame
		|| gPuzzleNode.length < gPuzzleBlockNum ) 
		return;
	//隐藏一块
	SetNodeVisible( gPuzzleNode[gPuzzleBlankId].node, false );
	//打乱顺序
	MakeMessOfBlock();
	//让按键产生作用
	SetJigsawBorderVisible( true );
	if( gGameTimer == null )
	{
		gGameTimer = setTimeout( OnUpdateTimer, 1000 );
	}
}

function StartGame()
{
	// gStartGame = false;
	var nextBtnStr = "";
	if( gStartGame ){
		nextBtnStr = "START!";
		if( gGameTimer != null )
		{
			clearTimeout( gGameTimer );
			gGameTimer = null;
		}
		if( gGameStartTimeout != null )
		{
			clearTimeout( gGameStartTimeout );
			gGameStartTimeout = null;
		}
	}else{			
		gCurrentTime = 0;
		var tempNode = document.getElementById( "puzzle" );
		var timerNode = document.getElementById( "timer" );
		timerNode.innerHTML = "00:00";
		tempNode.innerHTML = "";
		CreatePuzzle( tempNode, gImageFile );
		nextBtnStr = "STOP!";
		if( gGameStartTimeout == null )
		{
			gGameStartTimeout = setTimeout( OnGameStartTimeout, 5000 );
		}
	}
	var startBtn = document.getElementById( "start_btn" );
	startBtn.value = nextBtnStr;
	gStartGame = !gStartGame;
}

function OnGameSuccess()
{
	gStartGame = false;
	//stop timer
	if( gGameTimer != null )
	{
		clearTimeout( gGameTimer );
		gGameTimer = null;
	}
	// show all the image
	ShowAllJigsaw();
	var startBtn = document.getElementById( "start_btn" );
	startBtn.value = "START!";
}

function InitGame()
{
	var tempNode = document.getElementById("main");
	tempNode.style.height = ToStyleValue( gPuzzleSize * gBlockSize[1] );
	tempNode = document.getElementById( "puzzle" );
	tempNode.style.width = ToStyleValue( gPuzzleSize * gBlockSize[0] );
	tempNode.style.height = ToStyleValue( gPuzzleSize * gBlockSize[1] );
	tempNode = document.getElementById( "start_btn" );
	tempNode.onclick = StartGame;
	tempNode = document.getElementById( "puzzle_game" );
	tempNode.style.width = ToStyleValue( gPuzzleSize * gBlockSize[0] + 200 );
}

InitGame();
