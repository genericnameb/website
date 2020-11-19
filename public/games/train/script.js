document.addEventListener('DOMContentLoaded',function(){
    let background=document.querySelector('.container');
    let runnerClass=getComputedStyle(document.querySelector('.runner'));
    let runnerId=document.getElementById('runner');
    let trains=[];
    let newTrain;
    let trainTimerId;
    let movementTimerId;
    let trainLeft;
    let trainRight;
    let trainLength;
    let runnerLeft;
    let runnerRight;
    let runnerTop;
    let runnerBottom;
    let runnerDisplace = 180;
    let trainTop;
    let runnerVertical;
    let score=0;
    let scoreTimerId;
    let removalArray=[];

    class Train {
        constructor(){
            this.bottom= 800;
            this.width= Math.random()*30+10;
            this.left=Math.random()*400;
            this.height= Math.random()*1600;
            this.visual=document.createElement('div');
            this.speed= 5+Math.random()*20;

            const visual =  this.visual;
            visual.classList.add('train');
            visual.style.width = this.width + 'px'
            visual.style.left = this.left + 'px';
            visual.style.bottom  = this.bottom +'px';
            visual.style.height = this.height + 'px';
            background.appendChild(visual);
        }
    }


    function control(keycap){
        runnerDisplace=runnerClass.left;
        runnerVertical=runnerClass.bottom;
        runnerDisplace=parseInt(runnerDisplace.replace(/[^0-9]/gi,""));
        runnerVertical=parseInt(runnerVertical.replace(/[^0-9]/gi,""));
        if(keycap.key=="ArrowLeft"){
            if(runnerDisplace>0){
                runnerDisplace -= 10;
                runnerId.style.left=runnerDisplace+'px';
            }
        } else if(keycap.key=="ArrowRight"){
            if(runnerDisplace<380){
                runnerDisplace += 10;
                runnerId.style.left=runnerDisplace+'px';
            }
        } else if(keycap.key=="ArrowUp"){
            if(runnerVertical<780){
                runnerVertical += 10;
                runnerId.style.bottom=runnerVertical + 'px';
            }
        } else if(keycap.key=="ArrowDown"){
            if(runnerVertical>0){
            runnerVertical -= 10;
                runnerId.style.bottom=runnerVertical +'px';
            }
        }
    }
    
    function createTrain(){
        newTrain = new Train;
        trains.push(newTrain);
    }

    function moveTrain(){
        removalArray=[];
        for (let k=0; k<trains.length;k++){
            let visual=trains[k].visual;
            let trainBottom=visual.style.bottom;
            trainBottom=parseInt(trainBottom.replace(/[^0-9.-]/gi,""));
            trainBottom-=trains[k].speed;
            visual.style.bottom=trainBottom + 'px';
            
            trainLeft = visual.style.left;
            trainLeft=parseInt(trainLeft.replace(/[^0-9-.]/gi,""));
            trainHeight = visual.style.height;
            trainHeight=parseInt(trainHeight.replace(/[^0-9-.]/gi,""))
            trainRight = trainLeft + trains[k].width;
            runnerLeft=runnerDisplace;
            runnerRight=runnerDisplace+20;

            if(
            (trainLeft<runnerRight) &&
            (trainRight>(runnerLeft)) &&
            (trainBottom<=40) &&
            (trainBottom+trainHeight)>=20
            ){
                gameOver();                
            }

            if((trainBottom+trainHeight)<0){
                removalArray.unshift(k);
            }
        }
        for (let k=0; k<removalArray.length;k++){
            trains.splice(removalArray[k],1);
        }
    }

    function gameOver(){
        clearInterval(trainTimerId);
        clearInterval(movementTimerId);
        alert(score);
    }

    function scoreCount(){
        score++;
    }

    function start(){
        document.addEventListener('keydown',control)
        trainTimerId=setInterval(createTrain,500);
        movementTimerId=setInterval(moveTrain, 30);
        scoreTimerId=setInterval(scoreCount,1000);
    }

    start();
})