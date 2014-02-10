
var gPuzzleSize = 3;
var gPuzzleBlockNum = gPuzzleSize * gPuzzleSize;
var gPuzzleNode = null;//九宫格的HTML结构
var gBlockSize = [ 200, 200 ];
var gBorderSize = 3;
var gImageOffset = [300, 300]
var gPuzzleBlankId = gPuzzleBlockNum - 1;
var gImageFile = "file:///E:/picture/art/ref/browser/39607774.jpg";

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
			ShowAllJigsaw();
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
		divNode.style.width = ToStyleValue(gBlockSize[0] - (gBorderSize* (x+1)*2));
		divNode.style.height = ToStyleValue(gBlockSize[1] - (gBorderSize* (y+1)*2));
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
		ShowJigsawBorder( divNode, true, pos[0], pos[1] );
		
		var aNode = document.createElement( "a" );
		aNode.href = "#";
		
		//构成HTML的结构
		aNode.appendChild( imgNode );
		divNode.appendChild( aNode );
		parentNode.appendChild( divNode );
		
		//程序结构
		var puzzleBlock = CreatePuzzleBlock( i, i, imgNode );
		gPuzzleNode.push( puzzleBlock );
	}
	SetNodeVisible( gPuzzleNode[count-1].node, false );
}

function GetBlockIndexByParent( node )
{
	for( var i = 0; i < gPuzzleBlockNum; i ++)
	{
		var block = gPuzzleNode[i];
		if( block.node.parentNode.parentNode == node )
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
	var preId = gPuzzleBlockNum - 1;
	var dir = [ 
		-1, 0,
		0, -1, 
		1, 0,
		0, 1
	];
	var count = gPuzzleBlockNum;
	for( var i = 0; i < count; i ++ )
	var curNum = 0;
	var x = gPuzzleSize - 1;//Math.floor( curBlankId % gPuzzleSize );
	var y = gPuzzleSize - 1;//Math.floor( curBlankId 
	while( curNum < count )
	{
		var num = Math.floor( Math.random() * 1000 );
		num = num % 4;
		num *= 2;
		var nextX = x + dir[ num ];
		var nextY = y + dir[ num + 1 ];
		if( !IsValidPosInPuzzle( nextX, nextY ) ) continue;
		var nextIndex = nextX + nextY * gPuzzleSize;
		if( nextIndex == preId ) continue;
		SwapBlockPos( gPuzzleNode[nextIndex], gPuzzleNode[preId] );
		preId = nextIndex;
		x = nextX;
		y = nextY;
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
	if( node && node.parentNode && node.parentNode.parentNode )
		return node.parentNode.parentNode;
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

function StartGame()
{
	var tempNode = document.getElementById( "puzzle" );
	tempNode.innerHTML = "";
	CreatePuzzle( tempNode, gImageFile );
	MakeMessOfBlock();
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
}

InitGame();
