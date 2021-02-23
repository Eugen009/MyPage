
// 球的管理类

//
var curBallElement = null; // 當前創建的可見球
var curBallType = 0;
var curBallX = 0;
var curBallY = 0;
var curBallSize = 0;

// 管理容器
var bodies; // 所有的球都在这里
var elements;

// 與球創建相關的
var g_ballScale = 2;
var curBallIndex = 0;
var BALL_TYPES = [0, 1, 2, 3];
var TYPE_2_RADIUS = [10, 40, 80, 160];
for(var index in TYPE_2_RADIUS) TYPE_2_RADIUS[index]*=g_ballScale;
var TYPE_2_COLOR = ["#333B3A", "#B4BD51", "#543B38", "#61594D"]
var TYPE_MAX = BALL_TYPES.length -1;
var curBallBody = null;

var bigBallCount = 0

var hitElement = null;

function beginCreateBall(canvas){
    if(curBallElement==null&&isDropBallEnd()){
        curBallY = stage[1] + 50;
        curBallType = ((Math.random() * 10)>>0) %(BALL_TYPES.length -1)
        curBallSize = TYPE_2_RADIUS[curBallType] + 20;
        curBallX = window.innerWidth / 2 - curBallSize / 2;
        curBallElement = createBallEle(curBallX, curBallY, curBallType, curBallSize, canvas)
        console.info("Do create createBallEle!!")
    }
}

function endCreateBall(){
    if(curBallElement){
        elements.push( curBallElement );
        var halfSize = curBallSize / 2;
		curBallBody = createBallBody(curBallElement, curBallX+halfSize, curBallY+halfSize, curBallType, curBallSize)
		curBallElement = null
	}
}

function createBallEle(x, y, type, size, canvas){
	var element = document.createElement("img");//"canvas");
	element.src = "assets/images/ball.png"
	element.width = size;
	element.height = size;
	element.style.borderRadius = "50%";
	element.style.position = 'absolute';
	element.style.left = x + 'px';
	element.style.top = y + 'px';
	element.style.WebkitTransform = 'translateZ(0)';
	element.style.MozTransform = 'translateZ(0)';
	element.style.OTransform = 'translateZ(0)';
	element.style.msTransform = 'translateZ(0)';
	element.style.transform = 'translateZ(0)';

	canvas.appendChild(element);
	return element;
}

function createBallBody(element, x, y, type, size){
	var b2body = new b2BodyDef();
	var circle = new b2CircleDef();
	circle.radius = size >> 1;
	circle.density = 1;
	circle.friction = 1;
	circle.restitution = 0.5;
	b2body.AddShape(circle);
    b2body.userData = {element: element, ballType: type};
	b2body.position.Set( x, y  );
    b2body.linearVelocity.Set( 0, 0 );
    var curBody = world.CreateBody(b2body);
    bodies.push( curBody );
    return curBody;
}

function createBallInBox( x, y, type, canvas ) {

    var size = TYPE_2_RADIUS[type] + 20;
    var halfSize = size / 2;
    var right = stage[2] + stage[0] - halfSize;
    var bottom = stage[3] + stage[1] - halfSize;
    var left = stage[0] + halfSize;
    var top = stage[1] + halfSize;

    console.info("cur window size:%s, %s, %s, %s", left, top, right, bottom)
    console.info("old pos: %s, %s, %s", x, y, type)

    x = clamp(x, left, right)
    y = clamp(y, top, bottom)

    console.info("Do create ball: %s, %s, %s", x, y, type)

	var x = x || Math.random() * stage[2];
	var y = y || Math.random() * -200;
	var type = type || ((Math.random() * 10)>>0) %(BALL_TYPES.length -1)
	console.info("create ball type:%s", type);
    var element = createBallEle(x, y, type, size, canvas);
    elements.push( element );
	createBallBody(element, x, y, type, size)
}

function isDropBallHit(body){
    return body!=null&&body!= curBallBody&&body != walls[0]&&body != walls[2]&&body != walls[3];
}

function isDropBallEnd(){
    return curBallBody == null;
}

function createHidShow(x, y, canvas){
	console.log("Do create hit show!!!")
	var element = document.createElement("img");//"canvas");
	element.src = "assets/images/m.png"
	var w = 20;
	var h = 20;
	element.style.width = w.toString() + "px";
	element.style.height = h.toString() + "px";
	element.style.position = 'absolute';
	element.style.left = (x-w/2) + 'px';
	element.style.top = (y-h/2) + 'px';
	element.style.backgroundImage = "url(\"assets/images/m.jpg\")";
	element.style.rotate = (Math.random() * 100) >> 0 + "deg";
	element.style.zIndex = 1000;
	canvas.appendChild(element);
	var curTimer = setInterval(function(){
		element.style.transform = "scale(2, 2)";
		element.style.transition = "1.0s";
		clearTimeout(curTimer);
		curTimer = setInterval(function(){
			canvas.removeChild(element)
			clearTimeout(curTimer);
		}, 2000);
	}, 10)
}

function checkBallContact(canvas){
    
    // 检查下落的对象是否已碰撞
    // 左右上都不算
    if( curBallBody != null){
        var curContact = curBallBody.GetContactList();
        for(;curContact!=null&&curContact.contact!=null; curContact = curContact.next){
            var contact = curContact.contact;
            var b1 = contact.GetShape1().GetBody();
            var b2 = contact.GetShape2().GetBody();
            if(isDropBallHit(b1)||isDropBallHit(b2)){
                curBallBody = null;
                break;
            }
        }
    }

	var col = new Array();
	var center = new b2Vec2(0,0);

	for(var index in bodies){
		var contactCount = 0;
		var item = bodies[index]
		var curContact = item.GetContactList();
		while(curContact) {
			var contanct = curContact.contact;
			var u1 = contanct.GetShape1().GetBody().GetUserData();
			var u2 = contanct.GetShape2().GetBody().GetUserData();
			if(u1&&u2){
				if(u1.ballType!=null && u2.ballType!=null && 
					u1.ballType < TYPE_MAX && u2.ballType < TYPE_MAX && 
					u1.ballType == u2.ballType){
					col.push(contanct.GetShape1().GetBody())
                    col.push(contanct.GetShape2().GetBody())
                    if(contanct.GetManifoldCount()>0){
                        var points = contanct.GetManifolds()[0].points
                        if(points.length>0){
                            var p = points[0].position
                            center.Add(p)
                        }
                    }
					contactCount++;		
				}
			};
			curContact = curContact.next;
		}
		if(contactCount>0){
			console.info("find the same ball!!!%s", contactCount);
			break;
		}
	}

	// 刪除相同碰撞的
	// 同時要求中心位置
	if(col.length > 0){
		var curType = 0;
		curType = col[0].GetUserData().ballType + 1
		for(var index in col){
			removeBall(col[index], canvas);
		}
		if(curType == TYPE_MAX){
            bigBallCount ++;
        }
		center.Multiply(1/contactCount);
		createHidShow(center.x, center.y, canvas)
		createBallInBox(center.x, center.y, curType, canvas)
	}
}

function getBigBallCount(){
    return bigBallCount;
}

function removeBall(body, canvas){
	if(!body||!body.GetUserData())
		return;
	
	var index = bodies.indexOf(body);
	if(index > -1 ){
		//console.info("remove body at:%s", index)
		bodies.splice(index, 1)
	}
	index = elements.indexOf(body.GetUserData().element)
	if(index>-1){
		elements.splice(index, 1)
	}
	canvas.removeChild( body.GetUserData().element );
	world.DestroyBody( body );
}

function removeAllBall(){
	var i;

	if ( bodies ) {
		for ( i = 0; i < bodies.length; i++ ) {
			var body = bodies[ i ]
			canvas.removeChild( body.GetUserData().element );
			world.DestroyBody( body );
			body = null;
		}
	}

	bodies = [];
	elements = [];

    curBallIndex = 0;
    bigBallCount = 0;
    curBallBody = null

}

function getBodyAtMouse() {

	// Make a small box.
	var mousePVec = new b2Vec2();
	mousePVec.Set(mouse.x, mouse.y);

	var aabb = new b2AABB();
	aabb.minVertex.Set(mouse.x - 1, mouse.y - 1);
	aabb.maxVertex.Set(mouse.x + 1, mouse.y + 1);

	// Query the world for overlapping shapes.
	var k_maxCount = 10;
	var shapes = new Array();
	var count = world.Query(aabb, shapes, k_maxCount);
	var body = null;

	for (var i = 0; i < count; ++i) {
		if (shapes[i].m_body.IsStatic() == false) {
			if ( shapes[i].TestPoint(mousePVec) ) {
				body = shapes[i].m_body;
				break;
			}
		}
	}
	return body;
}

function updateBall(canvas){
    checkBallContact(canvas);

	for (i = 0; i < bodies.length; i++) {

		var body = bodies[i];
		var element = elements[i];

		element.style.left = (body.m_position0.x - (element.width >> 1)) + 'px';
		element.style.top = (body.m_position0.y - (element.height >> 1)) + 'px';

		if (element.tagName == 'DIV') {
			var style = 'rotate(' + (body.m_rotation0 * 57.2957795) + 'deg) translateZ(0)';
			text.style.WebkitTransform = style;
			text.style.MozTransform = style;
			text.style.OTransform = style;
			text.style.msTransform = style;
			text.style.transform = style;
		}
	}
}

function getTheTopestOfBall(){
    var top = stage[3] + stage[0]
    for(var index in elements){
        var node = elements[index]
        if( top > node.offsetTop){
            top = node.offsetTop
        }
    }
    return top;
}