function app() {
  const setupFunctions = {
    initialSetup: function () {
      this.generateWinCondition();
      this.newGame();
    },
    newGame: function () {
      this.setupCells();
      this.setupBoardData();
      this.active = true;
      this.firstTurn();
    },
    clearCells: function () {
      const gameBoard = document.getElementById("gameBoard");
      //clear board if not empty
      while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.lastChild);
      }
    },
    setupCells: function () {
      const gameBoard = document.getElementById("gameBoard");
      this.clearCells();
      for (let i = 0; i < 9; i++) {
        let cell = document.createElement("button");
        cell.classList.add("cell");
        cell.setAttribute("data-cell", i);
        cell.addEventListener("click", (e) => handleClick(e));
        gameBoard.insertAdjacentElement("beforeend", cell);
      }
    },
    setupBoardData: function () {
      this.board = [];
      for (let i = 0; i < 9; i++) {
        this.board.push("");
      }
    },
  };

  function handleClick(e) {
    ticTacToe.executeMove(e.target.dataset.cell);
  }

  const gameBoardFunctions = {
    isEmpty: function (cell) {
      return cell === "";
    },
  };

  const aiFunctions = {
    toggleAI: function (playerNum) {
      if (playerNum == 1) {
        this.player_1.ai = !this.player_1.ai;
      }
      if (playerNum == 2) {
        this.player_2.ai = !this.player_2.ai;
      }
      if (this.currentToken == playerNum) {
        this.executeMove(this.aiMove());
      }
    },
    aiMove: function () {
      return this.minimax(this.board, 0, true, this.currentToken).move;
    },

    getScore: function (endResult, maximizerToken) {
      if (endResult === 0) {
        return endResult;
      } else if (endResult === maximizerToken) {
        return 10;
      } else {
        return -10;
      }
    },
    opponentToken: function (token) {
      if (token === "1") {
        return "2";
      } else return "1";
    },

    minimax: function (board, depth, isMaxmizing, token) {
      let result = this.checkGameEnd(board);
      if (result !== null) {
        let best = this.getScore(result, token) - depth;
        return { best };
      } else if (result === null) {
        let scoreArr = [];
        let moveArr = [];
        //populate score and move
        for (let i = 0; i < board.length; i++) {
          if (board[i] === "") {
            moveArr.push(i);
            if (isMaxmizing) {
              board[i] = token;
              scoreArr.push(this.minimax(board, depth + 1, false, token).best);
            } else {
              board[i] = this.opponentToken(token);
              scoreArr.push(this.minimax(board, depth + 1, true, token).best);
            }
            board[i] = "";
          }
        }
        let best;
        if (isMaxmizing) {
          best = Math.max(...scoreArr);
        } else {
          best = Math.min(...scoreArr);
        }
        // let index = scoreArr.indexOf(best);
        let move = moveArr[scoreArr.indexOf(best)];
        return { best, move };
      }
    },
  };

  const gameFlowFunctions = {
    firstTurn: function () {
      if (this.aiTurn()) {
        this.executeMove(this.aiMove());
      }
    },
    aiTurn: function () {
      if (this.currentToken == 1) {
        return this.player_1.ai;
      }
      if (this.currentToken == 2) {
        return this.player_2.ai;
      }
    },
    nextTurn: function () {
      let ai;
      if (this.currentToken === "1") {
        this.currentToken = this.player_2.token;
        this.currnetIcon = this.player_2.icon;
      } else {
        this.currentToken = this.player_1.token;
        this.currnetIcon = this.player_1.icon;
      }
      if (this.aiTurn()) {
        this.executeMove(this.aiMove());
      }
    },
    executeMove: function (index) {
      if (this.board[index] === "" && this.active) {
        this.board[index] = this.currentToken;
        const cells = document.querySelectorAll(".cell");
        cells[index].insertAdjacentElement("beforeend", this.createIcon());
        let result = this.checkGameEnd(this.board);
        if (result !== null) {
          this.gameEnd();
        }
        if (this.active) {
          this.nextTurn();
        }
      }
    },
  };

  const gameEndMethods = {
    gameEnd: function () {
      this.active = false;
    },
    matchThree: function (a, b, c) {
      let result = null;
      if (a === b && b === c && a !== "") {
        result = a;
      }
      return result;
    },
    generateWinCondition: function () {
      this.winCondition = [];
      //rows
      for (let i = 0; i < 9; i += 3) {
        this.winCondition.push([i, i + 1, i + 2]);
      }
      //columns
      for (let i = 0; i < 3; i++) {
        this.winCondition.push([i, i + 3, i + 6]);
      }
      //diagonal
      this.winCondition.push([0, 4, 8]);
      this.winCondition.push([2, 4, 6]);
    },
    checkForWin: function (board) {
      let result = null;
      for (cell of this.winCondition) {
        result = this.matchThree(
          board[cell[0]],
          board[cell[1]],
          board[cell[2]]
        );
        if (result !== null) {
          break;
        }
      }
      return result;
    },
    checkGameEnd: function (board) {
      let result = this.checkForWin(board);
      if (result !== null) {
        //result contains winner's token, do nothing
      } else if (board.includes("")) {
        //do nothing
      }
      // if the board is full
      else result = 0;
      return result;
    },
  };

  const displayFunctions = {
    createIcon: function () {
      const newIcon = document.createElement("i");
      newIcon.classList.add("bi");
      newIcon.classList.add(this.currnetIcon);
      return newIcon;
    },
  };

  function createPlayer(token, icon) {
    return { token, icon, ai: false };
  }

  const ticTacToe = (function () {
    return {
      player_1: createPlayer("1", "bi-x-lg"),
      player_2: createPlayer("2", "bi-circle"),
      currentToken: "1",
      currnetIcon: "bi-x-lg",
      currentAI: false,
      active: true,
      ...setupFunctions,
      ...gameFlowFunctions,
      ...displayFunctions,
      ...gameEndMethods,
      ...aiFunctions,
      ...gameBoardFunctions,
    };
  })();
  ticTacToe.initialSetup();

  const aiBtn2 = document.getElementById("aiToggle2");
  aiBtn2.addEventListener("click", () => {
    ticTacToe.toggleAI(2);
  });
  const aiBtn1 = document.getElementById("aiToggle1");
  aiBtn1.addEventListener("click", () => {
    ticTacToe.toggleAI(1);
  });
  const ngBtn = document.getElementById("newGame");
  ngBtn.addEventListener("click", () => {
    ticTacToe.newGame();
  });
}
app();
