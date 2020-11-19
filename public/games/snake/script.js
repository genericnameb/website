document.addEventListener('DOMContentLoaded',function(){
    let newGrid;
    let backdrop=document.querySelector(".container");
    let snakeBody=[];
    let headLocation;
    let currentDirection="";
    let newHead;
    let oldHead;
    let leftTimerId;
    let righTimerId;
    let upTimerId;
    let downTimerId;
    let checkSquare;
    let checkSquareQuery;
    let removeBody;
    let checkCookie;
    let cutTail;


    class Grid{
        constructor(x, y){
            this.visual=document.createElement('div');
            const visual=this.visual;
            visual.classList.add('grid');
            backdrop.appendChild(visual);
            visual.setAttribute("id", "x-"+x+"-y-"+y);
        }
    }
    
    function clearMovement(){
        if (currentDirection=="up"){
            clearInterval(upTimerId);
        } else if (currentDirection=="down"){
            clearInterval(downTimerId);
        } else if (currentDirection=="left"){
            clearInterval(leftTimerId);
        } else if (currentDirection=="right"){
            clearInterval(rightTimerId);
        }
    }


    function controls(keycap){
        headLocation=document.getElementsByClassName('head');
        headLocation=headLocation[0].id;
        if (keycap.key=="ArrowUp" && currentDirection != "down"){
            clearMovement();
            upTimerId=setInterval(moveUp,100);
            currentDirection="up";
        } else if (keycap.key=="ArrowDown" && currentDirection != "up"){
            clearMovement();
            downTimerId=setInterval(moveDown,100);
            currentDirection="down";
        } else if (keycap.key=="ArrowLeft" && currentDirection != "right"){
            clearMovement();
            leftTimerId = setInterval(moveLeft,100);
            currentDirection="left";
        } else if (keycap.key=="ArrowRight" && currentDirection != "left"){
            clearMovement();
            rightTimerId = setInterval(moveRight,100);
            currentDirection="right";
        }
    }

    function moveLeft(){
        headLocation=document.getElementsByClassName('head');
        headLocation=headLocation[0].id;
        oldHead=headLocation;
        newHead = parseArray(headLocation);
        newHead[3] = parseInt(newHead[3])-1;

        if(newHead[3]<=0){
            gameOver();
        }
        newHead=newHead.join('-');

        checkSquareQuery=document.querySelector("#"+newHead);
        checkSquare=checkSquareQuery.className;

        newSquare();
    }
    
    function moveRight(){
        headLocation=document.getElementsByClassName('head');
        headLocation=headLocation[0].id;
        oldHead=headLocation;
        newHead = parseArray(headLocation);
        newHead[3] = parseInt(newHead[3])+1;
        if(newHead[3]>20){
            gameOver();
        }
        newHead=newHead.join('-');

        checkSquareQuery=document.querySelector("#"+newHead);
        checkSquare=checkSquareQuery.className;

        newSquare();
    }

    function moveUp(){
        headLocation=document.getElementsByClassName('head');
        headLocation=headLocation[0].id;
        oldHead=headLocation;
        newHead = parseArray(headLocation);
        newHead[1] = parseInt(newHead[1])-1;
        if(newHead[1]<=0){
            gameOver();
        }
        newHead=newHead.join('-');

        
        checkSquareQuery=document.querySelector("#"+newHead);
        checkSquare=checkSquareQuery.className;

        newSquare();
    }

    function moveDown(){
        headLocation=document.getElementsByClassName('head');
        headLocation=headLocation[0].id;
        oldHead=headLocation;
        newHead = parseArray(headLocation);
        newHead[1] = parseInt(newHead[1])+1;
        if(newHead[1]>20){
            gameOver();
        }
        newHead=newHead.join('-');

        checkSquareQuery=document.querySelector("#"+newHead);
        checkSquare=checkSquareQuery.className;

        newSquare();
    }

    function gridSetup(){
        for (let i=1;i<21;i++){
            for (let j=1; j<21;j++){
                newGrid=new Grid(i,j);
            }
        }
    }

    function newSquare(){
        console.log(snakeBody);
        if (checkSquare=="cookie"){
            document.getElementById(oldHead).classList.remove('head');
            document.getElementById(newHead).classList.remove('cookie');;
            document.getElementById(oldHead).classList.add('body');
            document.getElementById(newHead).classList.add('head');
            document.getElementById(newHead).classList.remove('grid');
            makeCookie();
            snakeBody.unshift(newHead);
        }
        
        if (checkSquare=="grid"){
            if (snakeBody.length==1){
                document.getElementById(newHead).classList.add('head');
                document.getElementById(newHead).classList.remove('grid');
                document.getElementById(oldHead).classList.remove('head');
                document.getElementById(oldHead).classList.add('grid');
            } else {
                document.getElementById(newHead).classList.add('head');
                document.getElementById(newHead).classList.remove('grid');
                document.getElementById(oldHead).classList.remove('head');
                document.getElementById(oldHead).classList.add('body')
            }
            snakeBody.unshift(newHead);
            cutTail=snakeBody.pop();
            document.getElementById(cutTail).classList.remove('body');
            document.getElementById(cutTail).classList.add('grid');
        }

        if (checkSquare=="body"){
            gameOver();
        }

        
    };

    function parseArray(arr){
        let newArr = arr.split('-');
        return newArr
    }

    function snakeHead(){
        let headX = (Math.floor(Math.random()*20))+1;
        let headY = (Math.floor(Math.random()*20))+1;
        let headId = "x-" + headX + "-y-" + headY;
        snakeBody.push(headId);
        console.log(snakeBody);
        document.getElementById(headId).classList.remove('grid');
        document.getElementById(headId).classList.add('head');
    }

    function makeCookie(){
        let cookieX = (Math.floor(Math.random()*20))+1;
        let cookieY = (Math.floor(Math.random()*20))+1;
        let cookieId = "x-" + cookieX + "-y-" + cookieY;
        document.getElementById(cookieId).classList.remove('grid');
        document.getElementById(cookieId).classList.add('cookie');
    }

    function gameOver(){
        clearMovement();
        alert("Score is:" + snakeBody.length);
        let node=document.getElementById('backdrop');
        node.querySelectorAll('*').forEach(n => n.remove());
        snakeBody=[];
        start();

    }
    
    function start(){
        gridSetup();
        snakeHead();
        makeCookie();
        document.addEventListener('keydown',controls);
    }



    start();
}
)