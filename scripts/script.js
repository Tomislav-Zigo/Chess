//============================board interaction functions==========================

const flip = document.querySelector("#flip")
const settings = document.querySelector("#settings")
const resign = document.querySelector("#resign")
const boardCanvas = document.querySelector('#board-canvas')
boardCanvas.height = "700";
boardCanvas.width = "700";
const FENDisplay = document.querySelector("#fen-display")
let selectedSquare;
let dragStartSquare;
let boardFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
let alphabet = "abcdefgh"
let boardFacingWhite = true;
let squareSize = boardCanvas.getBoundingClientRect().height/8;
let dragging = false;
let boardArray = new Array(8);
let daBoard = new Board()
daBoard.initializeBoard();


for(let i = 0 ; i < 8 ; i++){
    boardArray[i] = new Array(8)
}
for(let i = 0 ; i < 8 ; i++){
    for(let j = 0 ; j < 8 ; j++){
        boardArray[i][j] = null;
    }
}

let mouseCoords = {"x":null,"y":null}
let draggedPiece = null;
let highlightedSquares = null;

let blackKingIMG = document.getElementById("black-king")
let blackQueenIMG = document.getElementById("black-queen")
let blackRookIMG = document.getElementById("black-rook")
let blackBishopIMG = document.getElementById("black-bishop")
let blackKnightIMG = document.getElementById("black-knight")
let blackPawnIMG = document.getElementById("black-pawn")
let whiteKingIMG = document.getElementById("white-king")
let whiteQueenIMG = document.getElementById("white-queen")
let whiteRookIMG = document.getElementById("white-rook")
let whiteBishopIMG = document.getElementById("white-bishop")
let whiteKnightIMG = document.getElementById("white-knight")
let whitePawnIMG = document.getElementById("white-pawn")
 



var c = boardCanvas.getContext("2d");
c.translate(0,boardCanvas.height);
c.scale(1,-1);

let debug = false;

let blackKingSquare = {"file":4,"rank":7}
let whiteKingSquare = {"file":4,"rank":0}

resign.addEventListener("click", ()=>{

})

flip.addEventListener("click", ()=>{
  flipBoard(boardFEN)
})

settings.addEventListener("click", ()=>{
  console.log("settings")
})



//dragging event listener

boardCanvas.addEventListener('mousedown', (e)=>{


    if(boardFacingWhite){
        file = Math.floor((e.clientX - boardCanvas.getBoundingClientRect().x)/squareSize);
        rank = 7-Math.floor((e.clientY - boardCanvas.getBoundingClientRect().y)/squareSize);
        dragStartSquare = {"file":file,"rank":rank}
        requestLegalMoves(dragStartSquare)
        
        //set dragged piece to the piece at the mouse coordinates
        if(boardArray[file][rank] != null) draggedPiece = boardArray[file][rank];
    }else{
        file = 7-Math.floor((e.clientX - boardCanvas.getBoundingClientRect().x)/squareSize);
        rank = Math.floor((e.clientY - boardCanvas.getBoundingClientRect().y)/squareSize);
        dragStartSquare = {"file":file,"rank":rank}
        requestLegalMoves(dragStartSquare)
        
        //set dragged piece to the piece at the mouse coordinates
        if(boardArray[file][rank] != null) draggedPiece = boardArray[file][rank];
    }
    dragging=true;
})

boardCanvas.addEventListener('mousemove', (e)=>{

    mouseCoords.x = e.clientX - boardCanvas.getBoundingClientRect().x;
    mouseCoords.y = e.clientY - boardCanvas.getBoundingClientRect().y;

})

boardCanvas.addEventListener('mouseup', (e)=>{
    if(boardFacingWhite){
        file = Math.floor((e.clientX - boardCanvas.getBoundingClientRect().x)/squareSize);
        rank = 7-Math.floor((e.clientY - boardCanvas.getBoundingClientRect().y)/squareSize);
        if(dragging)sendMoveToServer([dragStartSquare,{"file":file,"rank":rank}]) ; 
    }else{
        file = 7-Math.floor((e.clientX - boardCanvas.getBoundingClientRect().x)/squareSize);
        rank = Math.floor((e.clientY - boardCanvas.getBoundingClientRect().y)/squareSize);
        if(dragging)sendMoveToServer([dragStartSquare,{"file":file,"rank":rank}]) ; 
    }
    dragging = false;
    draggedPiece = null;
    dragStartSquare = null;
    highlightedSquares =  null;
})

boardCanvas.addEventListener('mouseleave', (e)=>{
    dragging = false;
    draggedPiece = null;
    dragStartSquare = null;
    highlightedSquares = null;
})



//=============================Server Functions=======================

//sends a move to be sent to the server to be evaluated for legality
function sendMoveToServer(moveArray){
    if(moveArray[0] == null || moveArray[1] == null) return
    daBoard.attemptToMove(moveArray[0],moveArray[1]);
    updatePosition(daBoard.generateFEN());
}


function requestLegalMoves(square){
    highlightedSquares = daBoard.legalMovesFor(square);
    highlightedSquares.push(square);
}

function drawFENToBoard(FENString,squareBeingDragged){   

    if(squareBeingDragged!=null){

    }

    file = 1;
    rank = 8;
    
    for(i = 0 ; i < FENString.indexOf(" ") ; i++){
        //console.log(file,rank)

        if( dragging && squareBeingDragged!=null && squareBeingDragged.file == file-1 && squareBeingDragged.rank == rank-1 ){
            file++;
            continue;
        }

        switch(FENString.substring(i,i+1)){

            case "/":{
                rank--;
                file = 1;
            } break;
            case "1":{
                file+=1;
            } break;
            case "2":{
                file+=2;
            } break;
            case "3":{
                file+=3;
            } break;
            case "4":{
                file+=4;
            } break;
            case "5":{
                file+=5;
            } break;
            case "6":{
                file+=6;
            } break;
            case "7":{
                file+=7;
            } break;
            case "8":{
                file+=8;
            } break;
            case "k":{
                if(boardFacingWhite){
                    c.translate(file*squareSize,rank*squareSize)
                    c.rotate(Math.PI)
                    c.drawImage(blackKingIMG,0 , 0, squareSize, squareSize)
                    restoreContext()
                }else{
                    c.translate(  Math.abs(9-file) * squareSize  ,  Math.abs(9-rank) * squareSize  )
                    c.rotate(Math.PI)
                    c.drawImage(blackKingIMG,0 , 0, squareSize, squareSize)
                    restoreContext()
                }
                file++;
            } break;
            case "q":{
                if(boardFacingWhite){
                    c.translate(file*squareSize,rank*squareSize)
                    c.rotate(Math.PI)
                    c.drawImage(blackQueenIMG,0 , 0, squareSize, squareSize)
                    restoreContext()
                }else{
                    c.translate(  Math.abs(9-file) * squareSize  ,  Math.abs(9-rank) * squareSize  )
                    c.rotate(Math.PI)
                    c.drawImage(blackQueenIMG,0 , 0, squareSize, squareSize)
                    restoreContext()
                }
                file++;
            } break;
            case "r":{
                if(boardFacingWhite){
                    c.translate(file*squareSize,rank*squareSize)
                    c.rotate(Math.PI)
                    c.drawImage(blackRookIMG,0 , 0, squareSize, squareSize)
                    restoreContext()
                }else{
                    c.translate(  Math.abs(9-file) * squareSize  ,  Math.abs(9-rank) * squareSize  )
                    c.rotate(Math.PI)
                    c.drawImage(blackRookIMG,0 , 0, squareSize, squareSize)
                    restoreContext()
                }
                file++;
            } break;
            case "b":{
                if(boardFacingWhite){
                    c.translate(file*squareSize,rank*squareSize)
                    c.rotate(Math.PI)
                    c.drawImage(blackBishopIMG,0 , 0, squareSize, squareSize)
                    restoreContext()
                }else{
                    c.translate(  Math.abs(9-file) * squareSize  ,  Math.abs(9-rank) * squareSize  )
                    c.rotate(Math.PI)
                    c.drawImage(blackBishopIMG,0 , 0, squareSize, squareSize)
                    restoreContext()
                }
                file++;
            } break;
            case "n":{
                if(boardFacingWhite){
                    c.translate(file*squareSize,rank*squareSize)
                    c.rotate(Math.PI)
                    c.drawImage(blackKnightIMG,0 , 0, squareSize, squareSize)
                    restoreContext()
                }else{
                    c.translate(  Math.abs(9-file) * squareSize  ,  Math.abs(9-rank) * squareSize  )
                    c.rotate(Math.PI)
                    c.drawImage(blackKnightIMG,0 , 0, squareSize, squareSize)
                    restoreContext()
                }
                file++;
            } break;
            case "p":{
                if(boardFacingWhite){
                    c.translate(file*squareSize,rank*squareSize)
                    c.rotate(Math.PI)
                    c.drawImage(blackPawnIMG,0 , 0, squareSize, squareSize)
                    restoreContext()
                }else{
                    c.translate(  Math.abs(9-file) * squareSize  ,  Math.abs(9-rank) * squareSize  )
                    c.rotate(Math.PI)
                    c.drawImage(blackPawnIMG,0 , 0, squareSize, squareSize)
                    restoreContext()
                }
                file++;
            } break;
            case "K":{
                if(boardFacingWhite){
                    c.translate(file*squareSize,rank*squareSize)
                    c.rotate(Math.PI)
                    c.drawImage(whiteKingIMG,0 , 0, squareSize, squareSize)
                    restoreContext()
                }else{
                    c.translate(  Math.abs(9-file) * squareSize  ,  Math.abs(9-rank) * squareSize  )
                    c.rotate(Math.PI)
                    c.drawImage(whiteKingIMG,0 , 0, squareSize, squareSize)
                    restoreContext()
                }
                file++;
            } break;
            case "Q":{
                if(boardFacingWhite){
                    c.translate(file*squareSize,rank*squareSize)
                    c.rotate(Math.PI)
                    c.drawImage(whiteQueenIMG,0 , 0, squareSize, squareSize)
                    restoreContext()
                }else{
                    c.translate(  Math.abs(9-file) * squareSize  ,  Math.abs(9-rank) * squareSize  )
                    c.rotate(Math.PI)
                    c.drawImage(whiteQueenIMG,0 , 0, squareSize, squareSize)
                    restoreContext()
                }
                file++;
            } break;
            case "R":{
                if(boardFacingWhite){
                    c.translate(file*squareSize,rank*squareSize)
                    c.rotate(Math.PI)
                    c.drawImage(whiteRookIMG,0 , 0, squareSize, squareSize)
                    restoreContext()
                }else{
                    c.translate(  Math.abs(9-file) * squareSize  ,  Math.abs(9-rank) * squareSize  )
                    c.rotate(Math.PI)
                    c.drawImage(whiteRookIMG,0 , 0, squareSize, squareSize)
                    restoreContext()
                }
                file++;
            } break;
            case "B":{
                if(boardFacingWhite){
                    c.translate(file*squareSize,rank*squareSize)
                    c.rotate(Math.PI)
                    c.drawImage(whiteBishopIMG,0 , 0, squareSize, squareSize)
                    restoreContext()
                }else{
                    c.translate(  Math.abs(9-file) * squareSize  ,  Math.abs(9-rank) * squareSize  )
                    c.rotate(Math.PI)
                    c.drawImage(whiteBishopIMG,0 , 0, squareSize, squareSize)
                    restoreContext()
                }
                file++;
            } break;
            case "N":{
                if(boardFacingWhite){
                    c.translate(file*squareSize,rank*squareSize)
                    c.rotate(Math.PI)
                    c.drawImage(whiteKnightIMG,0 , 0, squareSize, squareSize)
                    restoreContext()
                }else{
                    c.translate(  Math.abs(9-file) * squareSize  ,  Math.abs(9-rank) * squareSize  )
                    c.rotate(Math.PI)
                    c.drawImage(whiteKnightIMG,0 , 0, squareSize, squareSize)
                    restoreContext()
                }
                file++;
            } break;
            case "P":{
                if(boardFacingWhite){
                    c.translate(file*squareSize,rank*squareSize)
                    c.rotate(Math.PI)
                    c.drawImage(whitePawnIMG,0 , 0, squareSize, squareSize)
                    restoreContext()
                }else{
                    c.translate(  Math.abs(9-file) * squareSize  ,  Math.abs(9-rank) * squareSize  )
                    c.rotate(Math.PI)
                    c.drawImage(whitePawnIMG,0 , 0, squareSize, squareSize)
                    restoreContext()
                }
                file++;
            } break;

        }
    }

}

function applyFenToBoardArray(FENString){
    
    for(let i = 0 ; i < 8 ; i++){
        for(let j = 0 ; j < 8 ; j++){
            boardArray[i][j] = null;
        }
    }

    file = 0;
    rank = 7;
    
    for(i = 0 ; i < FENString.indexOf(" ") ; i++){
        switch(FENString.substring(i,i+1)){

            case "/":{
                rank--;
                file = 0;
            } break;
            case "1":{
                file+=1;
            } break;
            case "2":{
                file+=2;
            } break;
            case "3":{
                file+=3;
            } break;
            case "4":{
                file+=4;
            } break;
            case "5":{
                file+=5;
            } break;
            case "6":{
                file+=6;
            } break;
            case "7":{
                file+=7;
            } break;
            case "8":{
                file+=8;
            } break;
            case "k":{
                boardArray[file][rank] = document.getElementById("black-king")
                file++;
            } break;
            case "q":{
                boardArray[file][rank] = document.getElementById("black-queen")
                file++;
            } break;
            case "r":{
                boardArray[file][rank] = document.getElementById("black-rook")
                file++;
            } break;
            case "b":{
                boardArray[file][rank] = document.getElementById("black-bishop")
                file++;
            } break;
            case "n":{
                boardArray[file][rank] = document.getElementById("black-knight")
                file++;
            } break;
            case "p":{
                boardArray[file][rank] = document.getElementById("black-pawn")
                file++;
            } break;
            case "K":{
                boardArray[file][rank] = document.getElementById("white-king")
                file++;
            } break;
            case "Q":{
                boardArray[file][rank] = document.getElementById("white-queen")
                file++;
            } break;
            case "R":{
                boardArray[file][rank] = document.getElementById("white-rook")
                file++;
            } break;
            case "B":{
                boardArray[file][rank] = document.getElementById("white-bishop")
                file++;
            } break;
            case "N":{
                boardArray[file][rank] = document.getElementById("white-knight")
                file++;
            } break;
            case "P":{
                boardArray[file][rank] = document.getElementById("white-pawn")
                file++;
            } break;

        }
    }
}

function updatePosition(FENString){
  drawFENToBoard(FENString);
  applyFenToBoardArray(FENString);
  boardFEN = FENString;
}

function flipBoard(){

  if(boardFacingWhite){
  
    boardFacingWhite = false;
    drawFENToBoard(boardFEN)



  }else if(!boardFacingWhite){

    boardFacingWhite = true;
    drawFENToBoard(boardFEN)

  }

}

function displayVictoryFor(color){
  if(color === "white"){
      boardContainer.innerHTML += `<div class = "display-victory , white">'WHITE WINS'</div>`
  }else if(color === "black"){
      boardContainer.innerHTML += `<div class = "display-victory , black">'BLACK WINS'</div>`
  }else{
      boardContainer.innerHTML += `<div class = "display-victory , stalemate">'STALEMATE'</div>`
  }
}

function restoreContext(){
    c.setTransform(1,0,0,1,0,0)
    c.translate(0,boardCanvas.height);
    c.scale(1,-1);
}

function animate(){

    //draw board to canvas
    for(let i = 0 ; i < 8 ; i++){
        for(let j = 0 ; j < 8 ; j++){
            if( (i + j) % 2 == 0){
                c.fillStyle = "#65c44b"
                c.fillRect( i * squareSize , j *squareSize , squareSize , squareSize)
            }else{
                c.fillStyle = "#f0f0f0"
                c.fillRect( i * squareSize , j *squareSize , squareSize , squareSize)
            }
        }
    } 

    //highlight legal moves
    if(dragging && highlightedSquares != null){
        highlightedSquares.forEach( (square)=>{
            c.fillStyle = 'rgba(100,100,100,0.5)'
            boardFacingWhite ? c.fillRect( square.file * squareSize , square.rank * squareSize , squareSize , squareSize) : 
                               c.fillRect( Math.abs(7-square.file) * squareSize , Math.abs(7-square.rank) * squareSize , squareSize , squareSize) ;
        })
    }

    //draw pieces to the board with exception of a piece being dragged
    drawFENToBoard(boardFEN,dragStartSquare);
    //draw the selected piece to the board at mouse coords
    if(dragging && draggedPiece != null){
        c.translate( mouseCoords.x + (squareSize*.6) , boardCanvas.height - mouseCoords.y + (squareSize*.6))
        c.rotate(Math.PI)
        c.drawImage( draggedPiece ,0 , 0 , squareSize * 1.20, squareSize * 1.20)
        restoreContext()
    }

    window.requestAnimationFrame(animate);
}

updatePosition("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");

animate();

//============================chess engine functions===============================

var socket = io();
socket.emit("computer move req" , boardFEN)

/* ================================Change Log========================



*/

