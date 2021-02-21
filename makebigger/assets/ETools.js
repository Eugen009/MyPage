
var PI2 = Math.PI * 2;

var GAME_STATE = {
  NONE: 0,
  START: 1,
  GAMING: 2,
  END: 3
}

function ShowObjProperty2( obj ) { 
  // 用来保存所有的属性名称和值 
  var attributes = '' ; 
  var methods = ''
  // 开始遍历 
  for ( var p in obj ){ 
      // 方法 
      if ( typeof( obj[p] ) === "function" ){ 
          attributes += '方法：' + p + '\r\n'
          // obj[p](); 
      } else { 
          // p 为属性名称，obj[p]为对应属性的值 
          methods += '屬性：' + p + " = " + obj[p] + "\r\n" ; 
      } 
  } 
  // 最后显示所有的属性 
  console.info("obj :%s, %s", attributes, methods)
  return attributes, methods
}

function clamp(v, minV, maxV){
	return Math.max(minV, Math.min(maxV, v));
}

function CreateBackShow(node, imgName, imgWidth, imgHeight, imgType){
  if(node.childNodes.length <= 0)
    return;
  if(imgType==null)
    imgType= ".png";

  var child = node.childNodes[1];
  var width = child.clientWidth;
  var height = child.clientHeight;

  var totalWidth = imgWidth * 2 + width;
  var totalHeight = imgHeight * 2 + height;

  console.log("the width and height is:%s, %s", totalWidth, totalHeight);

  var heightStr = "height:"+ totalHeight.toString()+"px;";
  var widthStr = "width:"+ totalWidth.toString()+"px;"
  var imageWidthStr = "width:" + imgWidth.toString() + "px;";
  var imageHeightStr = "height:" + imgHeight.toString() + "px;";

  node.style.cssText = "\
    flex-direction: column;\
    display: -webkit-flex;\
    display: flex;\
  "
  node.style.cssText += heightStr;
  node.style.cssText += widthStr;

  // top
  var topNode = document.createElement("div");
  var leftNode = document.createElement("div");
  var centerNode = document.createElement("div");
  var rightNode = document.createElement("div");
  topNode.appendChild(leftNode);
  topNode.appendChild(centerNode);
  topNode.appendChild(rightNode);
  // 設置樣式
  topNode.style.cssText = "\
    flex-direction: row;\
    justify-content:space-between;\
    flex-wrap: nowrap;\
    display: -webkit-flex;\
    display: flex;" + widthStr;
  leftNode.style.cssText = 
    imageWidthStr + 
    imageHeightStr + 
    "background-image: url(assets/images/"+imgName+"_left_top"+imgType+")";
  centerNode.style.cssText = 
    imageHeightStr + 
    "flex-grow: 1;"+
    "background-image: url(assets/images/"+imgName+"_top"+imgType+")";
  rightNode.style.cssText = 
    imageWidthStr + 
    imageHeightStr + 
    "background-image: url(assets/images/"+imgName+"_right_top"+imgType+")";
  

  var middleNode = document.createElement("div");
  leftNode = document.createElement("div");
  centerNode = document.createElement("div");
  rightNode = document.createElement("div");
  middleNode.appendChild(leftNode);
  middleNode.appendChild(centerNode);
  middleNode.appendChild(rightNode);
  node.removeChild(child);
  centerNode.appendChild(child);

  middleNode.style.cssText = "\
    flex-direction: row;\
    flex-wrap: nowrap;\
    justify-content:space-between;\
    display: -webkit-flex;\
    display: flex;\
    flex-grow: 1;\
    align-items: stretch;" + widthStr;
  leftNode.style.cssText = 
    imageWidthStr +
    "background-image: url(assets/images/"+imgName+"_left"+imgType+")";
  centerNode.style.cssText = 
    "flex-grow: 1;";
  rightNode.style.cssText = 
    imageWidthStr +
    "background-image: url(assets/images/"+imgName+"_right"+imgType+")";

  var bottomNode = document.createElement("div");
  leftNode = document.createElement("div");
  centerNode = document.createElement("div");
  rightNode = document.createElement("div");
  bottomNode.appendChild(leftNode);
  bottomNode.appendChild(centerNode);
  bottomNode.appendChild(rightNode);

  bottomNode.style.cssText = "\
    flex-direction: row;\
    flex-wrap: nowrap;\
    justify-content:space-between;\
    display: -webkit-flex;\
    display: flex;\
    align-self: flex-end;" + widthStr;
  leftNode.style.cssText = 
    imageHeightStr + 
    imageWidthStr + 
    "background-image: url(assets/images/"+imgName+"_left_bottom"+imgType+")";
  centerNode.style.cssText = 
    imageHeightStr + 
    "flex-grow: 1;" +
    "background-image: url(assets/images/"+imgName+"_bottom"+imgType+")";
  rightNode.style.cssText = 
    imageWidthStr + 
    imageHeightStr + 
    "align-self: flex-end;" +
    "background-image: url(assets/images/"+imgName+"_right_bottom"+imgType+")";

  node.appendChild(topNode);
  node.appendChild(middleNode);
  node.appendChild(bottomNode);

}

