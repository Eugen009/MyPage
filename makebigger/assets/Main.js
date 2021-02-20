
var createMode = false;
var destroyMode = false;

var mouseJoint;
var mouse = { x: 0, y: 0 };

var timeOfLastTouch = 0;

init();
play();

function init() {

	document.onmousedown = onDocumentMouseDown;
	document.onmouseup = onDocumentMouseUp;
	document.onmousemove = onDocumentMouseMove;
	document.ondblclick = onDocumentDoubleClick;

	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	document.addEventListener( 'touchend', onDocumentTouchEnd, false );
	
	window.addEventListener( 'deviceorientation', onWindowDeviceOrientation, false );

	g_GameStateMgr.enterState(GAME_STATE.START, null);

}

function play() {
	setInterval( OnUpdate, 1000 / 40 );
}

function OnUpdate(){
	g_GameStateMgr.update();
}

function onDocumentMouseDown(){
	g_GameStateMgr.onMouseDown();
}
function onDocumentMouseUp(){
	g_GameStateMgr.onMouseUp();
}
function onDocumentMouseMove(event){
	g_GameStateMgr.onMouseMove(event);
}

function onDocumentDoubleClick() {
}

function onDocumentTouchStart( event ) {

	if( event.touches.length == 1 ) {

		event.preventDefault();
		var now = new Date().getTime();

		if ( now - timeOfLastTouch  < 250 ) {
			reset();
			return;
		}

		timeOfLastTouch = now;

		mouse.x = event.touches[ 0 ].pageX;
		mouse.y = event.touches[ 0 ].pageY;
		isMouseDown = true;
	}
}

function onDocumentTouchMove( event ) {
	if ( event.touches.length == 1 ) {
		event.preventDefault();
		mouse.x = event.touches[ 0 ].pageX;
		mouse.y = event.touches[ 0 ].pageY;
	}
}

function onDocumentTouchEnd( event ) {
	if ( event.touches.length == 0 ) {
		event.preventDefault();
		isMouseDown = false;
	}
}

function onWindowDeviceOrientation( event ) {
	if ( event.beta ) {
		gravity.x = Math.sin( event.gamma * Math.PI / 180 );
		gravity.y = Math.sin( ( Math.PI / 4 ) + event.beta * Math.PI / 180 );
	}
}




