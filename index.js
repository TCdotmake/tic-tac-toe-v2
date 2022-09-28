function app(
){
    const setupFunctions = {
        initialSetup: function(){
            this.generateWinCondition();
            this.newGame(); 
        },
        newGame: function(){
            this.setupCells();
            this.setupBoardData();
            this.active = true;
            this.winner = null;
        },
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
                cell.addEventListener('click', e=>handleClick(e));
                gameBoard.insertAdjacentElement("beforeend", cell);
            }
        },
        setupBoardData: function(){
            this.board = [];
            for(let i = 0; i < 9; i++){this.board.push('');}
        },
    }

    function handleClick(e){
        ticTacToe.executeMove(e.target.dataset.cell);
    }

    const gameFlowFunctions = {
        nextTurn: function(){
            if(this.currentToken === '1'){
                this.currentToken = this.player_2.token;
                this.currnetIcon = this.player_2.icon;
            }else{
                this.currentToken = this.player_1.token;
                this.currnetIcon = this.player_1.icon;
            }
        },
        executeMove: function(index){
            if(this.board[index] === '' && this.active){
                this.board[index] = this.currentToken;
                const cells = document.querySelectorAll('.cell');
                cells[index].insertAdjacentElement("beforeend", this.createIcon());
                let result = this.checkForWin();
                if(result!==null){this.gameEnd();}
                if(this.active){
                    this.nextTurn();
                }
            }
        },
    }

    const gameEndMethods = {
        gameEnd: function(){this.active = false;},
        matchThree: function(a, b, c){
            let result = null;
            if(a===b && b===c && a!==''){
                result = a;
            }
            return result;
        },
        generateWinCondition: function(){
            this.winCondition = [];
            //rows
            for(let i =0; i<9; i+=3){
                this.winCondition.push([i, i+1, i+2]);
            }
            //columns
            for(let i=0; i<3; i++){
                this.winCondition.push([i, i+3, i+6]);
            }
            //diagonal
            this.winCondition.push([0,4,8]);
            this.winCondition.push([2,4,6]);
        },
        checkForWin: function(){
            for(cell of this.winCondition){
                let result = this.matchThree(this.board[cell[0]], this.board[cell[1]], this.board[cell[2]]);
                if(result!==null){return result;}
            }
            return null;
        }
    }

    const displayFunctions = {
        createIcon: function(){
            const newIcon = document.createElement('i');
            newIcon.classList.add('bi');
            newIcon.classList.add(this.currnetIcon);
            return newIcon;
        }
    }

    function createPlayer(token, icon){
        return{token, icon};
    }

    const ticTacToe = (function(){
        return{
            player_1: createPlayer('1', 'bi-x-lg'),
            player_2: createPlayer('2', 'bi-circle'),
            currentToken: '1',
            currnetIcon: 'bi-x-lg',
            active: true,
            ...setupFunctions,
            ...gameFlowFunctions,
            ...displayFunctions,
            ...gameEndMethods,
        }
    })();
    ticTacToe.initialSetup();
    console.log(ticTacToe.winCondition);
}
app();