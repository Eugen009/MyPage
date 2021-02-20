
class GameStartState extends GameState{
	constructor(){
		super(GAME_STATE.START);
	}
	onEnter(stateData){
		super.onEnter(stateData);
		this.setStartDlgShow(true)
	}
	onLeave(){
		this.setStartDlgShow(false)
	}
	setStartDlgShow(flag){
		var result_node = document.getElementById("start")
		if(flag)
			result_node.style.cssText = "display:block"
		else
			result_node.style.cssText = "display:none"
	}
}

function on_start_btn_click(){
	g_GameStateMgr.enterState(GAME_STATE.GAMING, null)
}

REGISTER_STATE(GameStartState)