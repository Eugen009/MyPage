
var gMarginWidth = 3;
var TotalImageCount = 11;
var CurLoadedCount = 0;
var ImageList = null;
var ImageInfos = null;
var ImageRefHeight = 300;
var gFixParentHeight = true;//是否保持图像区与其父节点的高度一致
function EAlert( str )
{
	var debug = false;
	var useDW = true;
	if( debug )
	{
		if( useDW ) 
		{
			document.write( str );
			document.write( "</br>");
		}
		else
		{
			alert( str );
		}
	}
}

function GetImageSrc( imageName ){
	var src = "file:///E:/work/dev/myhome/images/";
	src += imageName;
	src += ".jpg";
	return src;
}

function GetAllImagesInfo( imageList ) //Names )
{
	var infos = new Array();
	var count = imageList.length;
	// var tImage = new Image;
	for( var i = 0; i < count; i++ )
	{
		var tImage = imageList[i];//GetImageSrc( imageNames[i] );
		//tImage.onload = OnLoadImageFinish;
		var w = tImage.width;
		var h = tImage.height;
		
		//EAlert( "image src: " + tImage.src + " w:" + w + " h:" + h);
		if( w > 0 && h > 0 )
		{
			infos.push( w );
			infos.push( h );
		}
	}
	EAlert( "In GetAllImageInfo, count of image info:" + infos.length );
	ImageInfos = infos;
	return infos;
}

function GetCountInRow( imageInfos, startIndex, defaultHeight, totalWidth, marginWidth )
{
	var count = imageInfos.length;
	var curCin =  0;
	var curR = 0;
	var curW = marginWidth;
	var i = startIndex;
	for( ; i < count; i += 2 )
	{
		curCin ++;
		var w = imageInfos[i];
		var h = imageInfos[i+1];
		curW = totalWidth - (( curCin ) * marginWidth );
		curR += w / h;
		var curH = curW / curR;
		curH = Math.ceil( curH );
		if( curH < defaultHeight )
		{
			break;
		}
	}
	return curCin;
}

function GetAllCountInRow( imageInfos, defaultHeight, totalWidth, marginWidth )
{
	var count = imageInfos.length;
	var cins = new Array();
	var startIndex = 0;
	var tempTestTotal = 0;
	EAlert( "imageInfos.count" + count);
	while( startIndex < count )
	{
		var cin = GetCountInRow( imageInfos, startIndex, defaultHeight, totalWidth, marginWidth );
		startIndex += cin * 2;
		cins.push(cin);
		EAlert( "cur CIR: " + cin + "startIndex:" + startIndex );
		tempTestTotal += cin;
	}
	EAlert( "TempTestTotal: " + tempTestTotal + " startIndex: " + startIndex );
	return cins;
}

function GetAllRowsHeight( imageInfos, cins, totalWidth, marginWidth )
{
	var curImageIndex = 0;
	var curCINIndex = 0;
	var CINCount = cins.length;
	var rowHeights = new Array();
	for( ; curCINIndex < CINCount; curCINIndex ++)
	{
		var curCIN = cins[curCINIndex];
		var curRate = 0;
		for( var i = 0; i < curCIN; i ++ )
		{
			curRate += imageInfos[curImageIndex] / imageInfos[curImageIndex+1];
			curImageIndex += 2;
		}
		var targetWidth = totalWidth - ( (curCIN ) * marginWidth );
		
		var targetHeight = targetWidth / curRate;
		//像索不包括有小数，这里要进行向下舍入
		targetHeight = Math.floor( targetHeight );
		//图像的像索都为整数，这种高度反算出的宽像索可能会超出实际的最大宽度
		rowHeights.push( targetHeight );
	}

	return rowHeights;
}

function GetAllImageBlock( imageInfos, cins, rowHeights, margin )
{
	var curImageIndex = 0;
	var curCINIndex = 0;
	var cinsCount = cins.length;
	var resImageInfos = new Array();
	var curX = 0;
	var curY = 0;
	EAlert( "imageInfos count: " + imageInfos.length );
	var tempImageCount = 0;
	for( ; curCINIndex < cinsCount; curCINIndex ++ )
	{
		var curCin = cins[curCINIndex];
		curX = 0;
		var curRowHeight = rowHeights[curCINIndex];
		for( var i = 0; i < curCin; i ++ )
		{
			tempImageCount ++;

			var w = imageInfos[curImageIndex];
			var h = imageInfos[curImageIndex+1];
			EAlert( "curImageIndex:" + curImageIndex + " w:"+w +" h:" + h);
			curImageIndex += 2;
			var targetWidth = w / h * curRowHeight;
			targetWidth = Math.floor( targetWidth );
			resImageInfos.push( curX );
			resImageInfos.push( curY );
			resImageInfos.push( targetWidth );
			resImageInfos.push( curRowHeight );
			if( targetWidth == NaN )
			{
				alert( "Get a nan value at i= " + i );
			}
			curX += targetWidth + margin;
		}
		curY += curRowHeight + margin;
	}
	EAlert( "GetAllImagePos: count by cin:" + tempImageCount );
	return resImageInfos;
}

function GetAllImagePos( imageInfos, cins, rowHeights, margin )
{
	var curImageIndex = 0;
	var curCINIndex = 0;
	var cinsCount = cins.length;
	var resPos = new Array();
	var curX = 0;
	var curY = 0;
	EAlert( "imageInfos count: " + imageInfos.length );
	var tempImageCount = 0;
	for( ; curCINIndex < cinsCount; curCINIndex ++ )
	{
		var curCin = cins[curCINIndex];
		curX = 0;
		var curRowHeight = rowHeights[curCINIndex];
		for( var i = 0; i < curCin; i ++ )
		{
			tempImageCount ++;
			resPos.push( curX );
			resPos.push( curY );
			var w = imageInfos[curImageIndex];
			var h = imageInfos[curImageIndex+1];
			EAlert( "curImageIndex:" + curImageIndex + " w:"+w +" h:" + h);
			curImageIndex += 2;
			var targetWidth = w / h * curRowHeight;
			if( targetWidth == NaN )
			{
				alert( "Get a nan value at i= " + i );
			}
			curX += targetWidth + margin;
		}
		curY += curRowHeight + margin;
	}
	EAlert( "GetAllImagePos: count by cin:" + tempImageCount );
	return resPos;
}

function PrintImagePos( imagePoses )
{
	var count = imagePoses.length;
	EAlert( "imagePoses count: " + count );
	for( var i = 0; i < count; i += 2 )
	{
		var str = "image";
		str += i;
		str += ": ";
		str += imagePoses[i];
		str += ", ";
		str += imagePoses[i + 1];
		EAlert( str );
	}
}

function ListAllBlock( imageBlockInfo, rowWidth, cirs, imageNames )
{
	var str = "<ul style = \" list-style: none; \"> ";
	// var str = "<ul style = \" list-style: none;width:";
	// str += rowWidth;
	// str += "px\">";
	var count = imageBlockInfo.length;
	if( count == 0 || cirs.length == 0 ) return;
	var colorFlag = true;
	var cirsCounter = -1;
	var curCirNum = -1;
	var totalHeight = 0;
	for( var i = 0; i < count; i += 4 )
	{
		str += "<li style = \" float:left; margin:";
		str += gMarginWidth;
		str += "px; width: ";
		str += imageBlockInfo[i + 2];
		str += "px;height: ";
		str += imageBlockInfo[i + 3];
		str += "px;";
		
		var displayFlag = true;
		// 处理是否显示该图片，有可能该高度不适合显示
		if( imageBlockInfo[i+3] > ImageRefHeight * 2 )
		{
			str += "display: none;";
			displayFlag = false;
		}
		else
		{
			str += "display:block;"
			displayFlag = true;
		}
		
		//for debug, 用颜色区分图块是否正常分隔
		// if( colorFlag ) 
			// str += "background-color: blue;";
		// else
			// str += "background-color: red;";
		
		//处理是否左浮动
		var floating = true;
		if( curCirNum <= 0 ) 
		{
			cirsCounter++;
			curCirNum = cirs[cirsCounter];
			floating = false;
			if ( displayFlag ) 
			{
				totalHeight += imageBlockInfo[i+3];
				totalHeight += gMarginWidth * 2;
			}
		}
		curCirNum--;
		
		colorFlag = !colorFlag;
		str += " \">";
		
		// add the image
		str += "<img src =\"";
		str += GetImageSrc( imageNames[ i/4 ] );
		str += " \" ";
		str += " style = \"";
		str += "height:";
		str += imageBlockInfo[i + 3];
		str += "px; width:auto; \"";
		str += " />"
		
		str +="</li>";
	}
	str += "</ul>";
	
	//修改right的高度

	var tempHeight = "";
	tempHeight += totalHeight;
	tempHeight += "px";
	
	// var tempNode = document.getElementById("content");
	// tempNode.style.height = tempHeight;
	tempNode = document.getElementById( "right" );
	if( tempNode != null && tempNode.parentNode != null )
	{
		var parentNode = tempNode.parentNode;
		if( gFixParentHeight || parentNode.offsetHeight < totalHeight )
		{
			parentNode.style.height = tempHeight;
		}
	}
	tempNode.style.height = tempHeight;
	
	// tempNode = document.getElementById("left");
	// tempNode.style.height = tempHeight;
	// tempNode = document.getElementById("center");
	// tempNode.style.height = tempHeight;
	
	tempNode = document.getElementById("images_show");
	tempNode.innerHTML = str;
}

function CalImageRefHeight( imageInfos )
{
	var count = imageInfos.length;
	var totalHeight = 0;
	for( var i = 0; i < count; i ++ )
	{
		totalHeight +=  imageInfos[i];
	}
	totalHeight /= count;
	var maxHeight = screen.availHeight * 0.85;
	if( totalHeight > maxHeight )
	{
		totalHeight = maxHeight;
	}
	totalHeight = Math.floor( totalHeight );
	return totalHeight;
}

function ListRows( imageNames ){
	if( ImageInfos == null ) 
		return;
	var imageInfos = ImageInfos;
	EAlert( "current the count of image infos:" + imageInfos.length );
	var curDiv = document.getElementById("right");
	var rowWidth = curDiv.offsetWidth;
	rowWidth = Math.floor( rowWidth );
	ImageRefHeight = CalImageRefHeight( imageInfos );
	var defaultHeight = ImageRefHeight;
	var marginWidth = gMarginWidth * 2;
	var cins = GetAllCountInRow( imageInfos, defaultHeight, rowWidth, marginWidth );
	var rowHeights =  GetAllRowsHeight( imageInfos, cins, rowWidth, marginWidth );
	//计算所有的显示结果
	//推算所有的图的位置
	var imageBlockInfo = GetAllImageBlock( imageInfos, cins, rowHeights, marginWidth );
	ListAllBlock( imageBlockInfo, rowWidth, cins, imageNames );
}

function ListAllImages(){
	// 这里为装填数据的地方
	//准备测试的数据
	var imageNames = [
		"1","2","3","4","5",
		"6","7","8","9","10",
		"11","12","13","14","15",
		"16","17","18" ];
	//暂时使用一些奇怪的数据
	var imageInfos = [
		500, 333, 
		500, 500, 
		500, 333, 
		500, 333,	
		500, 333,
		
		500, 500,
		500, 438,
		500, 333,
		500, 334,
		500, 333,
		
		500, 333,
		500, 333,
		500, 333,
		500, 333,
		500, 750,
		
		500, 333,
		500, 496,
		580, 940
	];
	ImageInfos = imageInfos;
	ListRows( imageNames );
}

ListAllImages();
var tempNode = document.getElementById("images_show");
if( tempNode != null )
{
	window.onresize = function()
	{
		ListAllImages();
	};
}