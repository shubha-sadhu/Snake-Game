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
        document.getElementById("game-won-div").classList.add("show-outcome");
    },
    showGameLostCard:function() {
        document.getElementById("game-lost-div").classList.add("show-outcome");
    },
}

export default obj;