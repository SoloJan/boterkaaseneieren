<?php

session_start();

$winnerText = "";
$gameOver = false;
$winner;

if (!isset($_SESSION["crossTurn"])) {
    $_SESSION["crossTurn"] = false;  
}

if (!isset($_SESSION["board"])) {
    $_SESSION["board"] = array (
        array("", "", ""),
        array("", "", ""),
        array("", "", ""),
    );
}


if (isset($_POST["row"]) && isset($_POST["column"])) {
    if ($_SESSION["crossTurn"]) {
        $_SESSION["board"][$_POST["row"]][$_POST["column"]] = "x";
        $_SESSION["crossTurn"] = false;
    } else {
        $_SESSION["board"][$_POST["row"]][$_POST["column"]] = "0";
        $_SESSION["crossTurn"] = true;
    }
    checkNoMoreMoves();
    checkWinner();
}

if (isset($_POST["restart"])) {
    $_SESSION["board"] = array (
        array("", "", ""),
        array("", "", ""),
        array("", "", ""),
    );
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
    global $winner, $gameOver;
    for ($row = 0; $row < 3; $row++) {
        for ($column = 0; $column < 3; $column++) {
            if ($_SESSION["board"][$row][$column] == "") {
                return;
            }
        }
    }
    $gameOver = true;
    $winner = "gelijk";
}


function checkThreeInAColumn($index)
{
    if ($_SESSION["board"][0][$index] == "") {
        return;
    }    
    $value = $_SESSION["board"][0][$index];
    for ($row = 1; $row < 3; $row++) {
        if ($_SESSION["board"][$row][$index] != $value) {
            return;
        }
    }
    setWinner($value);
}

function checkThreeInARow($index)
{
    $row =   $_SESSION["board"][$index];
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
    if ($_SESSION["board"][1][1] == "") {
        return;
    }
    $value = $_SESSION["board"][1][1];
    if ($_SESSION["board"][0][0] == $value  && $_SESSION["board"][2][2] == $value) {
        setWinner($value);
    }
    if ($_SESSION["board"][0][2] == $value  && $_SESSION["board"][2][0] == $value) {
        setWinner($value);
    }
}

function setWinner($value)
{
    global $winner, $gameOver;
    $winner = $value;
    $gameOver = true;
}

if ($gameOver) {
    if ($winner == "x") {
        $winnerText =  "De speler die speelde met X heeft gewonnen";
    } elseif ($winner == "0") {
        $winnerText =  "De speler die speelde met 0 heeft gewonnen";
    } elseif ($winner == "gelijk") {
        $winnerText =  "Er zijn geen zetten meer over het is een gelijk spel";
    }
}




?>
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="style.css">
    <title>Boter kaas en eiren</title>
</head>
<body class="center-screen">
    <H1 >Boter, Kaas en Eieren</H1>
    <h2 id="winner"><?php echo $winnerText?></h2>


    <table id ="board">
    <?php for ($row = 0; $row < 3; $row++) { ?>
        <tr>
        <?php for ($column = 0; $column < 3; $column++) { ?>
            <td>
            <?php if ($_SESSION["board"][$row][$column] == "") {?>
            <form name="add"  action="" method="POST">
                <input type="hidden"  name="row", value="<?php echo $row?>">
                <input type="hidden"  name="column", value="<?php echo $column?>">
                <input class="box-button" value = "",  type="submit">
            </form>    
            <?php } elseif ($_SESSION["board"][$row][$column] == "x") {?>
                <img src= "cross.png">

            <?php } else {?>
            <img src="circle.png">
            <?php } ?>

            </td>
        <?php } ?>
        </tr>
        <?php
    } ?> 
    </table>
    <form name="restart"  action="" method="POST">
        <input class="button" disabled=<?php echo $gameOver ? 'false' : 'true';?> name="restart" value = "herstart spell",  type="submit">
    </form> 
</body>
</html>
