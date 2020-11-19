document.addEventListener('DOMContentLoaded',function () {
    let scrolledPast = false
    window.onscroll = function() {myFunction()};

    function myFunction() {
        
        profilePicQuery = document.getElementById('profile-pic');
        let scrollLength = 150
        if (document.body.scrollTop > scrollLength || document.documentElement.scrollTop > scrollLength) {
            
            profilePicQuery.classList.remove("profile-center");
            profilePicQuery.classList.add("profile-left");
            
            if (!scrolledPast) {
                scrolledPast = true;
                let chatBox = document.createElement("div");
                chatBox.setAttribute("id","chatbox")
                chatBox.classList.add('chat-box');
                chatBox.classList.add('hidden');
                let textBox = document.createElement('div');
                textBox.setAttribute('id','textbox');
                chatBox.appendChild(textBox);
                document.getElementById('upper').appendChild(chatBox);
                console.log('CHATBOX CREATED')
            }
            
        } else {
            profilePicQuery.classList.remove("profile-left");
            profilePicQuery.classList.add("profile-center");
            
            if (scrolledPast){
                document.getElementById("chatbox").remove();
                scrolledPast = false;
            }
        }
    }   

    let info = {
        practice_stock:"Express backend connecting to online database (MongoDB), implemented a login and verification system with bcrypt and passport.js.  Buy/sell according to real time stock market and compare your gains to S&P Index.  Create your own login or use user:genericnameb, password:password",
        calculator:"Front end library React to create an interactive calculator",
        snake:"Vanilla JS to recreate the snake game",
        doodle:"Made with Youtube video tutorial from Code with Ania Kubow #JavaScriptGames",
        train:"Inspired after creating doodle game",
        quote:"Random quote generator to practice using API calls",
        coke:"Interactive advertisement",
    }
    practiceStockQuery = document.getElementById('practice-stock');
    calculatorQuery = document.getElementById('calculator');
    snakeQuery = document.getElementById('snake');
    doodleQuery = document.getElementById('doodle');
    trainQuery = document.getElementById('train');
    quoteQuery = document.getElementById('quote');
    cokeQuery = document.getElementById('coke');

    practiceStockQuery.addEventListener('mouseenter', function(){
        removeHidden();
        chatQuery = document.getElementById('textbox');
        chatQuery.innerHTML = info.practice_stock
    })
    calculatorQuery.addEventListener('mouseenter', function(){
        removeHidden();
        chatQuery = document.getElementById('textbox');
        chatQuery.innerHTML = info.calculator;
    })
    snakeQuery.addEventListener('mouseenter', function(){
        removeHidden();
        chatQuery = document.getElementById('textbox');
        chatQuery.innerHTML = info.snake;
    })
    doodleQuery.addEventListener('mouseenter', function(){
        removeHidden();
        chatQuery = document.getElementById('textbox');
        chatQuery.innerHTML = info.doodle;
    })
    trainQuery.addEventListener('mouseenter', function(){
        removeHidden();
        chatQuery = document.getElementById('textbox');
        chatQuery.innerHTML = info.train;
    })
    quoteQuery.addEventListener('mouseenter', function(){
        removeHidden();
        chatQuery = document.getElementById('textbox');
        chatQuery.innerHTML = info.quote;
    })
    cokeQuery.addEventListener('mouseenter', function(){
        removeHidden();
        chatQuery = document.getElementById('textbox');
        chatQuery.innerHTML = info.coke;
    })


    practiceStockQuery.addEventListener('mouseleave', function(){
        addHidden()
    });
    calculatorQuery.addEventListener('mouseleave', function(){
        addHidden()
    });
    snakeQuery.addEventListener('mouseleave', function(){
        addHidden()
    });
    doodleQuery.addEventListener('mouseleave', function(){
        addHidden()
    });
    trainQuery.addEventListener('mouseleave', function(){
        addHidden()
    });
    quoteQuery.addEventListener('mouseleave', function(){
        addHidden()
    });
    cokeQuery.addEventListener('mouseleave', function(){
        addHidden()
    });

    function removeHidden(){
        if (scrolledPast){
            document.getElementById("chatbox").classList.remove("hidden")
        }
    }
    function addHidden(){
        if (scrolledPast){
            document.getElementById("chatbox").classList.add("hidden")
        }
    }


    let adj=["n aspiring    ", " dedicated    "," hardworking   "," passionate    ","n intelligent   "," logical   "];
    let string;
    let addContentLength;
    let temp = [];
    let removeStringTimingInterval;
    let addStringTimingInterval;
    let adjArrayPointer = 0;

    adjectiveQuery = document.getElementById("adjectives")

    function addString(providedString) {
        let addContent = adjectiveQuery.textContent;
        addContentLength = addContent.length;
        if (addContentLength == providedString.length){
            clearInterval(addStringTimingInterval);
            removeStringTimingInterval = setInterval(function(){
                removeString();
                adjectiveQuery.innerHTML=string;
            }, 50)
            temp=[];
            return null
        } else {
            temp.push(providedString[addContentLength]);
            string=temp.join('')
            return null
        }
    }


    function removeString(){
        let removeContent = adjectiveQuery.textContent;
        removeContentLength=removeContent.length;
        temp=string.split('');
        temp.pop();
        string=temp.join('');
        if (removeContentLength == 0){
            clearInterval(removeStringTimingInterval);
            temp=[];
            console.log("nothing left")
            adjArrayPointer++;
            if(adjArrayPointer>=adj.length){
                adjArrayPointer=0;
            }
            console.log(adjArrayPointer);
            start();
        }
    }


    function start(){
        addStringTimingInterval = setInterval(function(){
            addString(adj[adjArrayPointer]);            
            adjectiveQuery.innerHTML=string;
        }, 100)
    }

    start();

})