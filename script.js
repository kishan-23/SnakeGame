
let board,food,snake,dirn,speed,limit,running,paused,score,highScore,turn;

document.getElementById('playBtn').addEventListener('click',initialise_and_run);

function initialise_and_run(){
    board = document.querySelector('.board');
    food= {
        x:10, y:10
    };
    snake = [{x:10, y:5},{x:10,y:4},{x:10,y:3}];
    dirn ={x:0,y:1};
    speed = 2;
    limit = 10;
    running=true;
    paused = false;
    score = 0;
    turn=0;
    highScore = localStorage.getItem('highScore');
    if(highScore==null) highScore = 0;
    document.getElementById('highScore').innerText = highScore;
    move(turn);
}

function snakeIncludes(element,index){
    for(let i = index;i<snake.length;i++){
        if(element.x == snake[i].x && element.y == snake[i].y) return true;
    }

    return false;
}
function isvalid(){
    if(snake[0]['x']+dirn['x']>21||snake[0]['x']+dirn['x']<0) return false;
    if(snake[0]['y']+dirn['y']>21||snake[0]['y']+dirn['y']<0) return false;
    return !snakeIncludes(snake[0],1);
}


//display function 
function display(){
    board.innerHTML = "";
    //display food
    let foodBlock = document.createElement("div");
    foodBlock.className = 'food';
    foodBlock.style=`
    grid-column-start: ${food['x']};
    grid-row-start: ${food['y']};
    `;
    board.appendChild(foodBlock);

    //display snake
    snake.forEach((e,index) => {
        let sn = document.createElement("div");
        sn.style=`
        grid-column-start: ${e['x']};
        grid-row-start: ${e['y']};
        `;
        if(index==0) sn.className = 'head';
        else sn.className = 'tail';

        board.appendChild(sn);
    });
}



window.addEventListener("keydown",(event)=>{
    if(!running || paused) return;
    switch (event.key) {
        case "ArrowLeft":
            // Left pressed
            if(dirn.x!=1 || dirn.y!=0) dirn ={x:-1,y:0};
            break;
        case "ArrowRight":
            // Right pressed
            if(dirn.x!=-1 || dirn.y!=0) dirn ={x:1,y:0};
            break;
        case "ArrowUp":
            // Up pressed
            if(dirn.x!=0 || dirn.y!=1) dirn ={x:0,y:-1};
            break;
        case "ArrowDown":
            // Down pressed
            if(dirn.x!=0 || dirn.y!=-1) dirn ={x:0,y:1};
            break;
    }
    
    turn++;
    let myturn = turn;
    move(myturn);
});


function move(myturn){
    
    //food logic
    if(food.x===snake[0].x+dirn.x && food.y===snake[0].y+dirn.y){
        snake.unshift({x:food.x, y:food.y});
        do{
            food.x = Math.floor(Math.random() * 20) + 1;
            food.y = Math.floor(Math.random() * 20) + 1;
        }
        while(snakeIncludes(food,0));

        score++;
        limit--;

        document.getElementById('score').innerText = score;

        //high Score logic

        if(highScore<score){
            highScore = score;
            document.getElementById('highScore').innerText = highScore;
            localStorage.setItem('highScore',highScore);
        }

        //increase the speed if score increases after a limit
        if(score%5==0){
            speed++;
        }
    }

    else{
        //move the snake
        for(i=snake.length-1;i>0;i--){
            snake[i].x=snake[i-1].x;
            snake[i].y=snake[i-1].y;
        }
        snake[0].x=snake[0].x+dirn.x;
        snake[0].y=snake[0].y+dirn.y;
    }
    //out logic
    if(!isvalid()){
        food= {
            x:10, y:10
        };
        alert('Game over');
        dirn ={x:0,y:1};
        running=false;
        return;
    }

    display();

    

    setTimeout(()=>{
        if(running && !paused && myturn == turn) move(myturn);
    },1000/speed);
}

window.addEventListener('dblclick',()=>{
    if(running && !paused) paused = true;
    else{
        paused = false;
        move();
    }
});

