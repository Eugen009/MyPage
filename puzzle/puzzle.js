//这里有三种信息，一是九宫格本身，二是HTML的结构，三图像的信息
//HTML的信息本身是不用变法的
//默认第号8是空的
var gCurImageInfo = [
	0, 1, 2,
	3, 4, 5,
	6, 7, 8
];

var gPuzzleSize = 3;
var gPuzzleBlockNum = gPuzzleSize * gPuzzleSize;
var gPuzzleNode = null;//九宫格的HTML结构
var gBlockSize = [ 400, 400 ];
var gBorderSize = 3;
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
	// if ( node.style == null ) return;
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
			SetStyleBorder( e.currentTarget, gBorderSize, "solid", "red" );
		}
	}
}

function OnBlockOut( e )
{
	if( e != null && e.currentTarget )
	{
		//这里就强制更新吧
		SetStyleBorder( e.currentTarget, gBorderSize, "solid", "black" );
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
		// alert( blockNode.id );
		MoveToBlank( gPuzzleNode[blockIndex] );
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

function CreatePuzzle( parentNode, imageName )
{
	if( parentNode == null )
		return;
	//test only
	var count = gPuzzleBlockNum;
	gPuzzleNode = new Array();
	for( var i = 0; i < count; i ++ )
	{
		var x = Math.floor(i % 3);// * gBlockSize[0];
		var y = Math.floor(i / 3);// *  gBlockSize[1];
		var divNode = document.createElement("div");
		if( x == 2 )
		{
			divNode.style.cssFloat = "none";
		}
		else
		{
			divNode.style.cssFloat = "left";
		}
		var valueStr = "";
		valueStr += (gBlockSize[0] - gBorderSize);
		valueStr += "px";
		divNode.style.width = valueStr;
		valueStr = "";
		valueStr += (gBlockSize[1] - gBorderSize);
		valueStr += "px";
		divNode.style.height = valueStr;
		divNode.style.margin = "0px 0px";
		divNode.style.padding = "0px";
		divNode.style.overflow = "hidden";
		SetStyleBorder( divNode, gBorderSize, "solid", "black" );
		// if( i != gPuzzleBlankId )
		{
			divNode.onmouseover = OnBlockOver;
			divNode.onmouseout = OnBlockOut;
			divNode.onclick = OnBlockClicked;
		}
		var imgNode = document.createElement("img");
		imgNode.src = imageName;
		imgNode.style.top = ToStyleValue( -y * gBlockSize[1] );
		imgNode.style.left = ToStyleValue( -x * gBlockSize[0] );
		imgNode.style.position = "relative";
		
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
		// if( curX < 0 || curX >= gPuzzleSize || 
			// curY < 0 || curY >= gPuzzleSize )
			// continue;
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
		// alert( "preId:" + preId + " nextIndex:" + nextIndex );
		SwapBlockPos( gPuzzleNode[nextIndex], gPuzzleNode[preId] );
		// MoveToBlank( gPuzzleNode[nextIndex] );
		preId = nextIndex;
		x = nextX;
		y = nextY;
		curNum ++;
	}
}

function StartGame()
{
	var tempNode = document.getElementById( "main" )
	CreatePuzzle( tempNode, gImageFile );
	MakeMessOfBlock();
}

StartGame();

