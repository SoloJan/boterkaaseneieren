<?php

$gameOver = false;
$crossTurn = false;
$board = array (
    array("", "", ""),
    array("", "", ""),
    array("", "", ""),
);

function move($row, $column){
    global $board, $crossTurn;
        if ($crossTurn) {
            $board[$row][$column]  = "x";
            $crossTurn = false;
        } else {
            $board[$row][$column]  = "0";
            $crossTurn = true;
        }
        checkNoMoreMoves();
        checkWinner();
}



function checkWinner()
{
    for ($index = 0; $index < 3; $index++) {
        checkThreeInARow($index);
        checkThreeInAColumn($index);
    }
    checkDiagonal();
}

function checkNoMoreMoves()
{
    global $winner, $gameOver, $board;
    for ($row = 0; $row < 3; $row++) {
        for ($column = 0; $column < 3; $column++) {
            if ($board[$row][$column] == "") {
                return;
            }
        }
    }
    $gameOver = true;
    $winner = "gelijk";
}


function checkThreeInAColumn($index)
{
    global $board;
    if ($board[0][$index] == "") {
        return;
    }    
    $value = $board[0][$index];
    for ($row = 1; $row < 3; $row++) {
        if ($board[$row][$index] != $value) {
            return;
        }
    }
    setWinner($value);
}

function checkThreeInARow($index)
{
    global $board;
    $row =   $board[$index];
    if ($row[0] == "") {
        return;
    }
    $value = $row[0];
    for ($column = 1; $column < 3; $column++) {
        if ($row[$column] != $value) {
            return;
        }
    }
    setWinner($value);
}

function checkDiagonal()
{
    global $board;
    if ($board[1][1] == "") {
        return;
    }
    $value = $board[1][1];
    if ($board[0][0] == $value  && $board[2][2] == $value) {
        setWinner($value);
    }
    if ($board[0][2] == $value  && $board[2][0] == $value) {
        setWinner($value);
    }
}

function setWinner($value)
{
    global $winner, $gameOver;
    $winner = $value;
    $gameOver = true;
}

function printBoard(){
    global $board;
    for ($row = 0; $row < 3; $row++) {
        $line = "";
        for ($column = 0; $column < 3; $column++) {
            $line = $line . "[" . $board[$row][$column] . "]";
        }
        echo $line . PHP_EOL; 
    }
}

function printWinnerAndExit(){
    global $gameOver, $winner;
    if ($gameOver) {
        if ($winner == "x") {
            exit( "De speler die speelde met X heeft gewonnen");
        } elseif ($winner == "0") {
            exit(  "De speler die speelde met 0 heeft gewonnen");
        } elseif ($winner == "gelijk") {
            exit( "Er zijn geen zetten meer over het is een gelijk spel");
        }
    }
    
}

while(!$gameOver){
    printBoard();
    print_r("Maak een zet door rij en column op te geven,  bijv 00 voor de linker bovenhoek?" . PHP_EOL);
    $input = readline();
    move(intval(substr($input, 0, 1)), intval(substr($input, -1, 1)));
    printWinnerAndExit();
}

?>