
let crossTurn = false;
let gameOver = false;
let winner;




function computerPlays(){
   let row = getRandomInt(3);
   let column = getRandomInt(3);
   let table =  document.getElementById("board");
   let cell = table.rows[row].cells[column];
   if(!cellIsEmpty(cell)){
      gameOver = true;
      let winnerText =  document.getElementById("winner");
      winnerText.innerText = "De computer probeerde een ongeldige zet jij wint"
      crossTurn = !crossTurn;
      let  button =  document.getElementById("restart");
      button.disabled = false;
   }
   else{
      clickCell(cell);
   }
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
      displayWinner();
   }
   else if(crossTurn) {
      computerPlays(); 
   }
}

function displayWinner(){
   let winnerText =  document.getElementById("winner");
   if(winner === "gelijk"){
      winnerText.innerText =  "Er zijn geen zetten meer mogelijk gelijkspel";
   }
   if(winner.endsWith("cross.png")){
      winnerText.innerText =  "De computer heeft gewonnen";
   }
   if(winner.endsWith("circle.png")){
      winnerText.innerText =  "Jij wint";
   }
}

function setWinner(image) {
   console.log("The winner is: " + image);
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
   let  button =  document.getElementById("restart");
   button.disabled = true;
   let winnerText =  document.getElementById("winner");
   winnerText.innerHTML='';
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
