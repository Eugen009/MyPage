
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

