

var themes = [ [ "#10222B", "#95AB63", "#BDD684", "#E2F0D6", "#F6FFE0" ],
[ "#362C2A", "#732420", "#BF734C", "#FAD9A0", "#736859" ],
[ "#0D1114", "#102C2E", "#695F4C", "#EBBC5E", "#FFFBB8" ],
[ "#2E2F38", "#FFD63E", "#FFB54B", "#E88638", "#8A221C" ],
[ "#121212", "#E6F2DA", "#C9F24B", "#4D7B85", "#23383D" ],
[ "#343F40", "#736751", "#F2D7B6", "#BFAC95", "#8C3F3F" ],
[ "#000000", "#2D2B2A", "#561812", "#B81111", "#FFFFFF" ],
[ "#333B3A", "#B4BD51", "#543B38", "#61594D", "#B8925A" ] ];
var theme;

class GamingState extends GameState{
	constructor(){
		super(GAME_STATE.GAMING);
		this.m_Canvas = null;
		this.m_CurScore = 0;
	}
	onEnter(stateData){
		super.onEnter(stateData);
		this.m_Canvas = document.getElementById( 'canvas' );
		this.m_ScoreEle = document.getElementById("score");
		initScene(this.m_Canvas);
		this.reset();
	}
	onUpdate(){
		if( getTheTopestOfBall() < stage[1] )
			this.m_isEnd = true;	
		updateScene(this.m_Canvas);
		updateBall(this.m_Canvas);
		if(this.m_CurScore != getBigBallCount()){
			this.m_CurScore = getBigBallCount();
			this.m_ScoreEle.innerHTML = "大："+ this.m_CurScore.toString();
		}
	}
	onLeave(){
		this.m_Canvas = null;
	}
	getNextState(){
		console.info("this game is end, try enter next state!!!")
		return GAME_STATE.END;
	}
	getNextData(){
		return {score: this.m_CurScore};
	}
	onMouseDown(){
		console.info("Gaming.onMouseDown")
		beginCreateBall(this.m_Canvas)
	}
	onMouseMove(event){
		mouse.x = event.clientX;
		mouse.y = event.clientY;
		if(curBallElement){
			curBallX = clamp(mouse.x, stage[0], stage[0] + stage[2] - curBallSize)
			curBallElement.style.left = curBallX + 'px';
		}
	}
	onMouseUp(){
		endCreateBall()
		return false;
	}
	reset() {
		removeAllBall();
		// color theme
		theme = themes[ Math.random() * themes.length >> 0 ];
		document.body.style[ 'backgroundColor' ] = theme[ 0 ];
	}	

}

REGISTER_STATE(GamingState)