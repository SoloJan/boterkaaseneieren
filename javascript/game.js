/*
Below are a couple of constants and a couple of variables to store the state of the game, for example if its cross or circles turn
and how many games are played
-------------------------------------------------------------------------------------------------------------------
 */

const RESTART_BUTTON_ID = "restart";
const CROSS_IMAGE = "cross.png";
const CIRCLE_IMAGE = "circle.png";
const DRAW = "gelijk";
const BOARD_ID = "board";
const GAME_HEADER_ID = "winner";

let crossTurn = false;
let crossStartsGame = false;
let gameOver = false;
let winner;

let movesInGame = {};
let movesInTotal = {};
let inTraining = false;
let gameCount = 0;

let lastHundredGamesOfTraining = false;

let winCount =0;
let lossCount = 0;
let drawCount = 0;


/*
Below is all the logic which has to do with just playing the game, it is the biggest chunk of code
But it has nothing to do with artificial intelligence, you would write the same code for a player to player game.
Scroll down if you are only interested in the machine learning bit
-------------------------------------------------------------------------------------------------------------------
 */


function clickCell(cell) {
   if(!cellIsEmpty(cell) || gameOver){
      return;
   }
   if(crossTurn) {
      cell.innerHTML = '<img src="cross.png" alt="kruis">';
   }
   else{
      cell.innerHTML = '<img src="circle.png" alt="cirkel">';
   }
   switchTurns();
   checkNoMoreMoves();
   checkWinner();
   if(gameOver){
      endGame();
   }
   else if(crossTurn) {
      computerPlays();
   }
}

function checkWinner(){
   let table =  getBoard();
   for (let index = 0; index < 3; index++) {
      checkThreeInARow(table.rows[index]);
      checkThreeInAColumn(index);
   }
   checkDiagonal();
}


function restart(){
   gameOver = false;
   emptyBoard();
   crossStartsGame = !crossStartsGame;
   crossTurn = crossStartsGame;
   disableRestartButton(true);
   setGameHeaderText('Speel een spelletje');
   movesInGame = {};
   if(crossTurn){
      computerPlays();
   }
   updateStatistics();
}



function checkNoMoreMoves(){
   for (let row = 0; row < 3; row++) {
      for(let column = 0; column < 3; column++){
         if(cellIsEmpty(getCell(row, column))){
            return;
         }
      }
   }
   gameOver = true;
   winner = DRAW;
}

function emptyBoard() {
   for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
         getCell(row, column).innerHTML = ''
      }
   }
}


function checkThreeInARow(row) {
   if (cellIsEmpty(row.cells[0])) {
      return;
   }
   let image = row.cells[0].lastChild.src;
   for (let column = 1; column < 3; column++) {
      if (cellIsEmpty(row.cells[column]) || row.cells[column].lastChild.src !== image) {
         return;
      }
   }
   setWinner(image);
}

function checkDiagonal() {
   if (cellIsEmpty(getCell(1,1))) {
      return;
   }
   let image = getCell(1,1).lastChild.src;
   if(cellHasSameImage(getCell(0,0), image) && cellHasSameImage(getCell(2,2), image )){
      setWinner(image);
   }
   if(cellHasSameImage(getCell(0,2), image) && cellHasSameImage(getCell(2,0), image )){
      setWinner(image);
   }
}

function checkThreeInAColumn(column) {
   if (cellIsEmpty(getCell(0, column))) {
      return;
   }
   let image = getCell(0, column).lastChild.src;
   for (let row = 1; row < 3; row++) {
      if (cellIsEmpty(getCell(row, column)) || getCell(row, column).lastChild.src !== image) {
         return;
      }
   }
   setWinner(image);
}

function displayWinner() {
   if (isDraw()) {
      setGameHeaderText('Er zijn geen zetten meer mogelijk gelijkspel');
   }
   if (crossWins()) {
      setGameHeaderText('De computer heeft gewonnen');
   }
   if (circleWins()) {
      setGameHeaderText('Jij wint');
   }
}

function endGame(){
   displayWinner();
   updateMovesAfterGameIsFinished();
   disableRestartButton(false)
}

function setWinner(image) {
   winner = image;
   gameOver = true;
}





function switchTurns() {
   crossTurn = !crossTurn;
}

/*
In the section below we create the basic infrastructure for our learning algorithm, every time the computer plays
it stores the moves it did. Being able to store previous moves  is an important piece to enable a computer to learn.
-------------------------------------------------------------------------------------------------------------------
 */


function computerPlays(){
   let move = getComputerMove();
   let cell =  getCell(move.charAt(0), move.charAt(1));
   let gameState = tableToString();
   movesInGame[gameState] = move;
   if(!cellIsEmpty(cell)){
      handleIllegalMove(gameState, move);
   }
   else{
      clickCell(cell);
   }
}

function tableToString(){
   let s = "";
   for (let row = 0; row < 3; row++) {
      for(let column = 0; column < 3; column++){
         let cell = getCell(row, column)
         if(cellIsEmpty(cell)){
            continue;
         }
         else if(cellHasXSymbol(cell)){
            s +=  "x" + row + "" + column;
         }
         else{
            s +=  "o" + row + "" + column;
         }
      }
   }
   return s;
}

/*
In the section below we have the real learning logic, we score the computer depending on if he won the game.
If the computer loses because of an illegal game we give the final move -10 points
If the computer loses because of any other reason we give all moves which led to the loss -1 points
If the game ands in a draw all moves witch led to the equalizing game are rewarded with a point.
If the computer wins we give all moves which contributed to the win 2 points

Points add up. Suppose the computer always starts with a cross in the middle on position [1][1] and he plays three
games, one of which he wins, one of which he loses, and one which ends in a draw than the score of starting in the middle
will be (2, -1 + 1)  = 2

Feel free to change the logic it will also change how the computer learns
-------------------------------------------------------------------------------------------------------------------
 */


function handleIllegalMove(gameState, move) {
   updateMoves(gameState, move, -10);
   gameOver = true;
   setGameHeaderText("De computer probeerde een ongeldige zet jij wint");
   disableRestartButton(false);
}


function updateMovesAfterGameIsFinished(){
   if(isDraw()){
      for (const [key, value] of Object.entries(movesInGame)) {
         updateMoves(key, value, 1)
      }
   }
   if(crossWins()){
      for (const [key, value] of Object.entries(movesInGame)) {
         updateMoves(key, value, 2)
      }
   }
   if(circleWins()){
      for (const [key, value] of Object.entries(movesInGame)) {
         updateMoves(key, value, -1)
      }
   }
}



function updateMoves(gameState, move, points){
   if(movesInTotal[gameState]){
      if(movesInTotal[gameState][move]){
         movesInTotal[gameState][move] += points;
      }
      else{
         movesInTotal[gameState][move] = points;
      }
   }
   else {
      movesInTotal[gameState] = {[move]: points};
   }
}

/*
In the section below we define the computer move, which contains all the logic of when the computer does which move,
Again feel free to change it if you want different learning behavior
-------------------------------------------------------------------------------------------------------------------
 */

function getComputerMove(){
   let gameState = tableToString();

   // if the computer is in training we will try a random move, but we will avoid moves which have a very bad score
   // The last hundred games of training the computer will play using the knowledge from the rest of the training
   if(inTraining && !lastHundredGamesOfTraining){
      let attempts = 0;
      while(true){
         let move = getRandomMove();
         attempts++;
         if(!movesInTotal[gameState] || !movesInTotal[gameState][move] || attempts > 20 || movesInTotal[gameState][move] > -10){
            return move;
         }
      }
   }

   // if the state is unknown we try a new move
   if(!movesInTotal[gameState]){
      return getRandomMove();
   }

   // find the best score
   let bestScore = -1000;
   let bestMove = "";
   for (const [key, value] of Object.entries(movesInTotal[gameState])) {
      if(value >= bestScore){
         bestScore = value;
         bestMove = key;
      }
   }
   // return the best move if its score positive or if all possibilities have been tried before
   if(Object.entries(movesInTotal[gameState]).length === 9 || bestScore > 0 ){
      return bestMove;
   }
   // if all moves known so far are negative we will try a move we have not done before
   while(true){
      let move = getRandomMove();
      if(!movesInTotal[gameState][move]){
         return move;
      }
   }

}


/*
In the section below we define how the computer is trained, this has a biggest affect on how the computer will behave.

The computer is trained by another computer who plays a bit similar to how a human being would play. The trainer does
a random move except for two scenario's. The first scenario is if the computer notices that he can win in this round by completing a row, column or diagonal.
The second scenario is when the trainer notices that he has to block to make sure his opponent can not win in the next round

The way the computer is trained has a big affect on its final results, there are scenario's which will never happen in training because of the way the trainer plays.
And if the computer hasn't seen a scenario in practice he won't know how to deal with it later on.

-------------------------------------------------------------------------------------------------------------------
 */

function train(number){
   gameOver = true;
   inTraining = true;
   lastHundredGamesOfTraining = false;
   winCount = 0;
   lossCount = 0;
   drawCount = 0;

   for(let i = 0; i<number; i++){
      if(number-i<100){
         lastHundredGamesOfTraining = true;
      }
      trainingGame();
      restart();
   }
   inTraining = false;
}

function trainingGame(){
   while(!gameOver){
      if(crossTurn){
         computerPlays();
      }
      else{
         trainerPlays();
      }
   }
}

function trainerPlays(){
   let cell = getTrainerMove();
   clickCell(cell);
}

function getTrainerMove(){
   let cellToWin = getCellToWin()
   if(cellToWin){
      return cellToWin;
   }
   let cellToBlockOpponentFromWinning = getCellToBlockOpponentFromWinning();
   if(cellToBlockOpponentFromWinning){
      return cellToBlockOpponentFromWinning;
   }
   while(true){
      let move = getRandomMove();
      let cell = getCell(move.charAt(0), move.charAt(1));
      if(cellIsEmpty(cell)){
         return cell;
      }
   }
}



function getCellToWin(){
   return getDecisiveCell(CIRCLE_IMAGE);
}



function getCellToBlockOpponentFromWinning(){
   return getDecisiveCell(CROSS_IMAGE);
}

function getDecisiveCell(image){
   let cellToCompleteRow =   getDecisiveCellInRow(image);
   if(cellToCompleteRow){
      return cellToCompleteRow;
   }
   let cellToCompleteColumn = getDecisiveCellInColumns(image);
   if(cellToCompleteColumn){
      return cellToCompleteColumn;
   }
   return getDecisiveCellInDiagonals(image);
}

function getDecisiveCellInDiagonals(image){
   let cellToCompleteDiagonal1 = getOnlyEmptyCellInCollection([getCell(0,0), getCell(1,1), getCell(2,2)], image);
   if(cellToCompleteDiagonal1){
      return cellToCompleteDiagonal1;
   }
   let cellToCompleteDiagonal2 = getOnlyEmptyCellInCollection([getCell(0,2), getCell(1,1), getCell(2,0)], image);
   if(cellToCompleteDiagonal2){
      return cellToCompleteDiagonal2;
   }
}



function getDecisiveCellInColumns(image){
   for(let column = 0; column < 3; column++){
      let fullColumn = [];
      for(let row = 0; row < 3; row++){
         fullColumn.push(getCell(row, column));
      }
      let emptyCell = getOnlyEmptyCellInCollection(fullColumn, image);
      if(emptyCell){
         return emptyCell}
   }
}

function getDecisiveCellInRow(image){
   let table =  getBoard();
   for(let row = 0; row < 3; row++){
      let emptyCell = getOnlyEmptyCellInCollection(table.rows[row].cells, image)
      if(emptyCell){
         return emptyCell;
      }
   }
}

function getOnlyEmptyCellInCollection(cells, image){
   let imageCount = 0;
   let emptyCellCount = 0;
   let emptyCell;
   for (let i = 0; i < 3; i++) {
      let cell = cells[i];
      if(cellIsEmpty(cell)){
         emptyCell = cell;
         emptyCellCount++;
      }
      else if(cell.lastChild.src.endsWith(image)) {
            imageCount++;
      }
   }
   if(emptyCellCount === 1 && imageCount === 2){
      return emptyCell;
   }

}

/*
   The following section contains some methods to update the statistics about the game
   -------------------------------------------------------------------------------------------------------------------
 */




function updateGameCount() {
   gameCount++;
   let countText = document.getElementById("count");
   countText.innerHTML = "" + gameCount;
}

function updateStatistics(){
   updateGameCount();
   if(inTraining && lastHundredGamesOfTraining){
      if(isDraw()){
         updateDrawCount();
      }
      if(crossWins()){
         updateWinCount();
      }
      if(circleWins()){
         updateLossCount();
      }
   }
}

function updateWinCount() {
   winCount++;
   let countText = document.getElementById("win-count");
   countText.innerHTML = "" + winCount;
}

function updateLossCount() {
   lossCount++;
   let countText = document.getElementById("loss-count");
   countText.innerHTML = "" + lossCount;
}

function updateDrawCount() {
   drawCount++;
   let countText = document.getElementById("draw-count");
   countText.innerHTML = "" + drawCount;
}


/*
The final section contains some helper methods wich are used in the rest of the code there is a method to check if a
cell in the board is empty for example
-------------------------------------------------------------------------------------------------------------------
 */



function getBoard() {
   return document.getElementById(BOARD_ID);
}

function getCell(row, column) {
   return getBoard().rows[row].cells[column];
}

function getRandomMove() {
   let row = getRandomInt(3);
   let column = getRandomInt(3);
   return row + "" + column;
}

function getRandomInt(max) {
   return Math.floor(Math.random() * max);
}

function cellHasSameImage(cell, image){
   return !cellIsEmpty(cell) && cell.lastChild.src === image
}

function cellHasXSymbol(cell){
   return cell.lastChild.src.endsWith(CROSS_IMAGE);
}

function cellIsEmpty(cell){
   return cell.lastChild == null;
}



function disableRestartButton(disable) {
   let button = document.getElementById(RESTART_BUTTON_ID);
   button.disabled = disable;
}

function isDraw() {
   return winner === DRAW;
}

function crossWins() {
   return winner.endsWith(CROSS_IMAGE);
}

function circleWins() {
   return winner.endsWith(CIRCLE_IMAGE);
}


function setGameHeaderText(text) {
   let winnerText = document.getElementById(GAME_HEADER_ID);
   winnerText.innerHTML = text;
}