

class GamingState extends GameState{
	constructor(){
		super(GAME_STATE.GAMING);
		this.m_Canvas = null;
		this.m_CurScore = 0;
	}
	onEnter(stateData){
		super.onEnter(stateData);
		this.m_Canvas = document.getElementById( 'canvas' );
		this.m_ScoreEle = document.getElementById("current_score");
		initScene(this.m_Canvas);
		this.reset();
		createHidShow(-100, -100, this.m_Canvas);
	}
	onUpdate(){
		if( getTheTopestOfBall() < stage[1] )
			this.m_isEnd = true;	
		updateScene(this.m_Canvas);
		updateBall(this.m_Canvas);
		if(this.m_CurScore != getBigBallCount()){
			this.m_CurScore = getBigBallCount();
			this.m_ScoreEle.innerText = this.m_CurScore.toString();
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
	}	

}

REGISTER_STATE(GamingState)