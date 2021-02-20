

class GameStateMgr {
	constructor(){
		this.curState = null;
		this.registerStates = {};
		this.nextType = GAME_STATE.NONE;
		this.nextData = null;
	}
	register(type, state){
		this.registerStates[type] = state;
	}
	enterState(type, nextData){
		this.nextType = type;
		this.nextData = nextData;
	}
	update(){
		if(this.nextType!=null&&this.registerStates){
			var nextState = this.registerStates[this.nextType]
			if(nextState != null){
				if(this.curState){
					this.curState.onLeave()
				}
				nextState.onEnter(this.nextData);
				console.info("Enter state %s, and next State %s", this.curState, nextState)
			}
			this.curState = nextState;
			this.nextType = null;
		}
		if(this.curState){
			if(this.curState.isEnd())
				this.enterState(this.curState.getNextState(), this.curState.getNextData())
			else
				this.curState.onUpdate();
		}
	}
	onMouseDown(){
		if(this.curState != null){
			this.curState.onMouseDown();
		}
	}
	onMouseUp(){
		if(this.curState){
			this.curState.onMouseUp();
		}
	}
	onMouseMove(event){
		if(this.curState){
			this.curState.onMouseMove(event);
		}
	}
}

var g_GameStateMgr = new GameStateMgr();

class GameState{
	constructor(type){
	  this.m_StateType = type;
	  this.m_isEnd = false;
	}
	onEnter(stateData){
	  console.info("GameState.OnEnter!!!");
	  this.m_isEnd = false;
	}
	onUpdate(){}
	onLeave(){}
	isEnd(){return this.m_isEnd ;}
	getType(){return this.m_StateType;}
	getNextState(){return GAME_STATE.NONE;}
	getNextData(){return null;}
	onMouseDown(){}
	onMouseMove(){}
	onMouseUp(){}
}

function REGISTER_STATE(state_class){
	var state_inst = new state_class()
	g_GameStateMgr.register(state_inst.getType(), state_inst);

}