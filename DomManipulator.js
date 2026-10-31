const obj = {
    updateCurrentScore:function(currScore) {
        document.getElementById("current-score-span").textContent=currScore;
    },
    updateBestScore:function(bestScore) {
        document.getElementById("best-score-span").textContent=bestScore;
    },
    updateCanvasDimensions:function(width,height) {
        const canvasElement=document.getElementById("canvas");
        canvasElement.width=width;
        canvasElement.height=height;
    },
    showGameWonCard:function() {
        document.getElementById("game-outcome-div").classList.add("show-outcome");
        document.getElementById("game-outcome-text").textContent="You Won!";
    },
    showGameLostCard:function() {
        document.getElementById("game-outcome-div").classList.add("show-outcome");
        document.getElementById("game-outcome-text").textContent="You Lost!";
    },
    hideGameOutcomeCard:function() {
        document.getElementById("game-outcome-div").classList.remove("show-outcome");
        document.getElementById("game-outcome-text").textContent="";
    },
    allowRestart:function() {
        return new Promise((resolve,reject)=>{
            document.getElementById("restart-button").addEventListener("click",(event)=>{
                this.hideGameOutcomeCard();
                resolve(0);
            },{once:true});
        });
    }
}

export default obj;