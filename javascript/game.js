
let crossTurn = false;
let crossStartsGame = false;
let gameOver = false;
let winner;

let movesInGame = {};
let movesInTotal = {};
let inTraining = false;


function train(number){
   gameOver = true;
   inTraining = true;
   for(let i = 0; i<number; i++){
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
      let row = move.charAt(0);
      let column = move.charAt(1);
      let table =  document.getElementById("board");
      let cell = table.rows[row].cells[column];
      if(cellIsEmpty(cell)){
         return cell;
      }
   }
}


function getCellToWin(){
   return getDecisiveCell("circle.png");
}

function getCellToBlockOpponentFromWinning(){
   return getDecisiveCell("cross.png");
}

function getDecisiveCell(image){
   let cellToCompleteRow =   getOnlyEmptyCellInRows(image);
   if(cellToCompleteRow){
      return cellToCompleteRow;
   }
   let cellToCompleteColumn = getOnlyEmptyCellInColumns(image);
   if(cellToCompleteColumn){
      return cellToCompleteColumn;
   }
   return getOnlyEmptyCellInDiagonal(image);
}

function getOnlyEmptyCellInDiagonal(image){
   let diagonal1 = [];
   let table =  document.getElementById("board");
   diagonal1.push(table.rows[0].cells[0])
   diagonal1.push(table.rows[1].cells[1])
   diagonal1.push(table.rows[2].cells[2])
   let cellToCompleteDiagonal1 = getOnlyEmptyCellInCollection(diagonal1, image);
   if(cellToCompleteDiagonal1){
      return cellToCompleteDiagonal1;
   }
   let diagonal2 = [];
   diagonal2.push(table.rows[0].cells[2])
   diagonal2.push(table.rows[1].cells[1])
   diagonal2.push(table.rows[2].cells[0])
   let cellToCompleteDiagonal2 = getOnlyEmptyCellInCollection(diagonal2, image);
   if(cellToCompleteDiagonal2){
      return cellToCompleteDiagonal2;
   }
}

function getOnlyEmptyCellInColumns(image){
   let table =  document.getElementById("board");
   for(let column = 0; column < 3; column++){
      let fullColumn = [];
      for(let row = 0; row < 3; row++){
         fullColumn.push(table.rows[row].cells[column]);
      }
      let emptyCell = getOnlyEmptyCellInCollection(fullColumn, image);
      if(emptyCell){
         return emptyCell}
   }
}

function getOnlyEmptyCellInRows(image){
   let table =  document.getElementById("board");
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
   if(emptyCellCount == 1 && imageCount == 2){
      return emptyCell;
   }

}

function computerPlays(){
   let move = getComputerMove();
   let row = move.charAt(0);
   let column = move.charAt(1);
   let table =  document.getElementById("board");
   let cell = table.rows[row].cells[column];
   let gameState = tableToString();
   movesInGame[gameState] = move;
   if(!cellIsEmpty(cell)){
      updateMoves(gameState, move, -10);
      gameOver = true;
      let winnerText =  document.getElementById("winner");
      winnerText.innerText = "De computer probeerde een ongeldige zet jij wint"
      let  button =  document.getElementById("restart");
      button.disabled = false;
   }
   else{
      clickCell(cell);
   }
}

function getRandomMove() {
   let row = getRandomInt(3);
   let column = getRandomInt(3);
   return row + "" + column;
}

function getComputerMove(){
   if(inTraining){
      return getRandomMove();
   }
   let gameState = tableToString();
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
   // return the best move if its score positive or if all posibilties have been tried before
   if(Object.entries(movesInTotal[gameState]).length == 9 || bestScore > 0 ){
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

function tableToString(){
   let table =  document.getElementById("board");
   let s = "";
   for (let row = 0; row < 3; row++) {
      for(let column = 0; column < 3; column++){
         if(cellIsEmpty(table.rows[row].cells[column])){
            continue;
         }
         else if(cellHasXSymbol(table.rows[row].cells[column])){
            s +=  "x" + row + "" + column;
         }
         else{
            s +=  "o" + row + "" + column;
         }
      }
   }
   return s;
}

function getRandomInt(max) {
   return Math.floor(Math.random() * max);
 }

function clickCell(cell) {
   if(!cellIsEmpty(cell) || gameOver){
      return;
   }
   if(crossTurn) {
      cell.innerHTML = '<img src="cross.png">';
   }
   else{
      cell.innerHTML = '<img src="circle.png">';
   }
   crossTurn = !crossTurn;
   checkNoMoreMoves();
   checkWinner();
   if(gameOver){
     let  button =  document.getElementById("restart");
     button.disabled = false;
     displayWinnerAndUpdateMoves();
   }
   else if(crossTurn) {
      computerPlays(); 
   }
}

function displayWinnerAndUpdateMoves(){
   let winnerText =  document.getElementById("winner");
   if(winner === "gelijk"){
      winnerText.innerText =  "Er zijn geen zetten meer mogelijk gelijkspel";
      for (const [key, value] of Object.entries(movesInGame)) {
         updateMoves(key, value, 1)
      }
   }
   if(winner.endsWith("cross.png")){
      winnerText.innerText =  "De computer heeft gewonnen";
      for (const [key, value] of Object.entries(movesInGame)) {
         updateMoves(key, value, 2)
      }
   }
   if(winner.endsWith("circle.png")){
      winnerText.innerText =  "Jij wint";
      for (const [key, value] of Object.entries(movesInGame)) {
         updateMoves(key, value, -1)
      }
   }
}

function setWinner(image) {
   winner = image;
   gameOver = true;
}

function restart(){
   gameOver = false;
   let table =  document.getElementById("board");
   for (let row = 0; row < 3; row++) {
      for(let column = 0; column < 3; column++){
         table.rows[row].cells[column].innerHTML = '';
      }
   }
   crossStartsGame = !crossStartsGame;
   crossTurn = crossStartsGame;
   let  button =  document.getElementById("restart");
   button.disabled = true;
   let winnerText =  document.getElementById("winner");
   winnerText.innerHTML='';
   movesInGame = {};
   if(crossTurn){
      computerPlays();
   }
}

function checkNoMoreMoves(){
   let table =  document.getElementById("board");
   for (let row = 0; row < 3; row++) {
      for(let column = 0; column < 3; column++){
         if(cellIsEmpty(table.rows[row].cells[column])){
            return;
         }
      }
   }
   gameOver = true;
   winner = "gelijk";
}


function checkThreeInARow(row) {
   if (cellIsEmpty(row.cells[0])) {
      return;
   }
   let image = row.cells[0].lastChild.src;
   for (let column = 1; column < 3; column++) {
      if (cellIsEmpty(row.cells[column]) || row.cells[column].lastChild.src != image) {
         return;
      }
   }
   setWinner(image);
}

function checkDiagonal(table) {
   if (cellIsEmpty(table.rows[1].cells[1])) {
      return;
   }
   let image = table.rows[1].cells[1].lastChild.src;
   if(cellHasSameImage(table.rows[0].cells[0], image) && cellHasSameImage(table.rows[2].cells[2], image )){
      setWinner(image);
   }
   if(cellHasSameImage(table.rows[0].cells[2], image) && cellHasSameImage(table.rows[2].cells[0], image )){
      setWinner(image);
   }
}


function cellHasSameImage(cell, image){
   return !cellIsEmpty(cell) && cell.lastChild.src == image
}

function cellHasXSymbol(cell){
   return cell.lastChild.src.endsWith("cross.png");
}

function checkThreeInAColumn(table, column) {
   if (cellIsEmpty(table.rows[0].cells[column])) {
      return;
   }
   let image = table.rows[0].cells[column].lastChild.src;
   for (let row = 1; row < 3; row++) {
      if (cellIsEmpty(table.rows[row].cells[column]) || table.rows[row].cells[column].lastChild.src != image) {
         return;
      }
   }
   setWinner(image);
}

function checkWinner(){
  let table =  document.getElementById("board");
   for (let row = 0; row < 3; row++) {
       checkThreeInARow(table.rows[row]);
       checkThreeInAColumn(table, row);
   }
   checkDiagonal(table);

}

function cellIsEmpty(cell){
   return cell.lastChild == null;
}
