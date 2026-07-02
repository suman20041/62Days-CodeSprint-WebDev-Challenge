let userScore=0;
let compScore=0;
let choices=document.querySelectorAll(".emoji");

const playGame=(userChoice)=>{
    //generating computer choice
    let options=["rock","paper","scissor"];
    let comNum=Math.floor(Math.random()*3);
    let comChoice=options[comNum];
        if(comChoice==="rock"){
        document.querySelector(".comImg").setAttribute("src","r-p-s-images/rock-icon.jpg");        }
        else if(comChoice==="paper"){
        document.querySelector(".comImg").setAttribute("src","r-p-s-images/paper-icon.jpg");
        }
        else{
        document.querySelector(".comImg").setAttribute("src","r-p-s-images/scissor-icon.jpg");
        }
           let userWin="None";
        //choosing who win
        if(userChoice===comChoice){
            userWin="None";
        }
        else if(userChoice==="rock"){
            userWin=(comChoice==="paper")?"false":"true";
        }
        else if(userChoice==="paper"){
            userWin=(comChoice==="scissor")?"false":"true";
        }
        else if(userChoice==="scissor"){
            userWin=(comChoice==="rock")?"false":"true";
        }
        
        if(userWin==="true"){
            userScore++;
            document.querySelector(".you-score").innerText=`${userScore}`;

            document.querySelector(".message").innerText="🎉you win!🎊";
        }
        else if(userWin==="false"){
            document.querySelector(".message").innerText="you lose!🥹";
                        compScore++;
            document.querySelector(".com-score").innerText=`${compScore}`;

        }else{
            document.querySelector(".message").innerText="📍Game Draw";
        }
    
}


//fetching user choice
choices.forEach((choice)=>{
    choice.addEventListener("click",()=>{
        let userChoice=choice.getAttribute("id");
        if(userChoice==="rock"){
        document.querySelector(".youImg").setAttribute("src","r-p-s-images/rock-icon.jpg");
        }
        else if(userChoice==="paper"){
        document.querySelector(".youImg").setAttribute("src","r-p-s-images/paper-icon.jpg");
        }
        else{
        document.querySelector(".youImg").setAttribute("src","r-p-s-images/scissor-icon.jpg");
        }
            playGame(userChoice);
    })
});
document.querySelector(".reimg").addEventListener("click",()=>{
    userScore=0;
    compScore=0;
        document.querySelector(".youImg").setAttribute("src","r-p-s-images/user.png");
        document.querySelector(".comImg").setAttribute("src","r-p-s-images/computer.png");
         document.querySelector(".you-score").innerText=`${userScore}`;
            document.querySelector(".com-score").innerText=`${compScore}`;
            document.querySelector(".message").innerText="Start the game by choosing the icon";
})


