
class GameEndState extends GameState{
	constructor(){
		super(GAME_STATE.END);
	}
	onEnter(stateData){
		super.onEnter(stateData);
		var result_node = document.getElementById("result")
		this.setResultDlgShow(true)
		var score = 0;
		if(stateData&&stateData.score)
			score = stateData.score;
		result_lst.innerHTML = "总共大大的数目：" + score.toString();
	}
	onLeave(){
		this.setResultDlgShow(false)
	}
	setResultDlgShow(flag){
		var result_node = document.getElementById("result_show")
		if(flag)
			result_node.style.visibility = "visible"
		else
			result_node.style.visibility = "hidden"
	}
}

function on_replay_btn_click(){
	g_GameStateMgr.enterState(GAME_STATE.GAMING, null)
}

function on_goto_menu_click(){
	g_GameStateMgr.enterState(GAME_STATE.START, null)
}

REGISTER_STATE(GameEndState)