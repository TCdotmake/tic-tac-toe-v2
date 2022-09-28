function app(
){
    const setupFunctions = {
        setupCells: function(){
            const gameBoard = document.getElementById('gameBoard');
            //clear board if not empty
            while(gameBoard.firstChild){
                gameBoard.remove(gameBoard.lastChild);
            }
            for(let i = 0; i < 9; i++){
                let cell = document.createElement('button');
                cell.classList.add('cell');
                cell.setAttribute('data-cell', i);
                gameBoard.insertAdjacentElement("beforeend", cell);
            }
        },
    }
    const ticTacToe = (function(){
        return{
            ...setupFunctions,
        }
    })();
    ticTacToe.setupCells();
}
app();