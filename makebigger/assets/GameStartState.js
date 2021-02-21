
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
		var result_node = document.getElementById("start_show")
		if(flag)
			result_node.style.visibility = "visible"
		else
			result_node.style.visibility = "hidden"
	}
}

function on_start_btn_click(){
	g_GameStateMgr.enterState(GAME_STATE.GAMING, null)
}

REGISTER_STATE(GameStartState)