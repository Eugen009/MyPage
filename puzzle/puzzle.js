//这里有三种信息，一是九宫格本身，二是HTML的结构，三图像的信息
//HTML的信息本身是不用变法的
//默认第号8是空的
var gCurImageInfo = [
	0, 1, 2,
	3, 4, 5,
	6, 7, 8
];

var gPuzzleNode = null;//九宫格的HTML结构
var gPuzzleDiv = null;//九宫格的内容
var gBlockSize = [ 400, 400 ];
var gBorderSize = 3;
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
		SetStyleBorder( e.currentTarget, gBorderSize, "solid", "red" );
	}
}

function OnBlockOut( e )
{
	if( e != null && e.currentTarget )
	{
		SetStyleBorder( e.currentTarget, gBorderSize, "solid", "black" );
	}
}

function SetNodeVisible( node, visible )
{
	// if( block == null ) return;
	// var node = block.node;
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

function CreatePuzzleBlock( id, node )
{
	var block = new Object();
	block.id = id;
	block.node = node;
	return block;
}

function CreatePuzzle( parentNode, imageName )
{
	if( parentNode == null )
		return;
	//test only
	var count = 9;
	gPuzzleNode = new Array();
	gPuzzleDiv = new Array();
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
		if( i < count -1 )
		{
			divNode.onmouseover = OnBlockOver;
			divNode.onmouseout = OnBlockOut;
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
		var puzzleBlock = CreatePuzzleBlock( i, imgNode );
		gPuzzleNode.push( puzzleBlock );
		gPuzzleDiv.push( divNode ); 
	}
	SetNodeVisible( gPuzzleNode[count-1].node, false );
	// HideImageByNode( gPuzzleDiv[count -1] );
}

function GetBlockPosition( block )
{
	var count = gPuzzleNode.
	for( var i = 0; i < count; i ++ )
	{
	
	}
}

function IsNearBlank( block )
{
	
}

function MoveToBlank( node )
{
	
}

var tempNode = document.getElementById( "main" )
CreatePuzzle( tempNode, gImageFile );