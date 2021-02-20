
var stage = [ window.screenX, window.screenY, window.innerWidth, window.innerHeight ];

var maxWidth = 300;
var maxHeight = 800;

// var worldAABB = null;
var world = null;

var walls = [];
var wall_thickness = 200;
var wallsSetted = false;

var delta = [ 0, 0 ];
var iterations = 1
var timeStep = 1 / 15;

var gravity = { x: 0, y: 1 };
var gravity_scale = 100;

function initScene(canvas){
    if(!world){
        var worldAABB = new b2AABB();
        var w = window.innerWidth; //canvas.clientWidth
        var h = window.innerHeight;//canvas.clientHeight
        worldAABB.minVertex.Set( -200, -200 );
        worldAABB.maxVertex.Set( w + 200, h + 200 );
        
        world = new b2World( worldAABB, new b2Vec2(0, 0), true );
        setWalls(canvas);
    }
}

function updateScene(canvas){
    if (getBrowserDimensions(canvas)) {
		setWalls(canvas);
    }
    
    delta[0] += (0 - delta[0]) * .5;
	delta[1] += (0 - delta[1]) * .5;

	world.m_gravity.x = gravity.x * gravity_scale + delta[0];
	world.m_gravity.y = gravity.y * gravity_scale + delta[1];

	//mouseDrag();
	world.Step(timeStep, iterations);

}

function setWalls(canvas) {

    stage = [
        canvas.offsetLeft, 
        canvas.offsetTop,
        canvas.clientWidth,
        canvas.clientHeight
    ]

	if (wallsSetted) {
		world.DestroyBody(walls[0]);
		world.DestroyBody(walls[1]);
		world.DestroyBody(walls[2]);
		world.DestroyBody(walls[3]);
		walls[0] = null; 
		walls[1] = null;
		walls[2] = null;
		walls[3] = null;
	}
    // top
    walls[0] = createBox(world, stage[2] / 2 + stage[0], stage[1]- wall_thickness, stage[2], wall_thickness);
    // bottom
    walls[1] = createBox(world, stage[2] / 2 + stage[0], stage[1] + stage[3] + wall_thickness, stage[2], wall_thickness);
    // left
    walls[2] = createBox(world, - wall_thickness + stage[0], stage[3] / 2 + stage[1], wall_thickness, stage[3]);
    // right
	walls[3] = createBox(world, stage[2] + wall_thickness + stage[0], stage[3] / 2 + stage[1], wall_thickness, stage[3]);
	wallsSetted = true;
}


// BROWSER DIMENSIONS
function getBrowserDimensions(canvas) {

	var changed = false;

	if (stage[0] != canvas.offsetLeft) {
		delta[0] = (canvas.offsetLeft - stage[0]) * 50;
		changed = true;
	}

	if (stage[1] != canvas.offsetTop) {
		delta[1] = (canvas.offsetTop - stage[1]) * 50;
		changed = true;
	}

	if (stage[2] != canvas.clientWidth) {
		changed = true;
	}

	if (stage[3] != canvas.clientHeight) {
		changed = true;
	}
	return changed;
}

// .. BOX2D UTILS
function createBox(world, x, y, width, height, fixed) {

	if (typeof(fixed) == 'undefined') {
		fixed = true;
	}

	var boxSd = new b2BoxDef();

	if (!fixed) {
		boxSd.density = 1.0;
	}

	boxSd.extents.Set(width, height);

	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(x,y);

	return world.CreateBody(boxBd);
}
