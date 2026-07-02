let mode="black";
let chMode=document.querySelector(".mode-ball");
chMode.addEventListener("click",()=>{
    if(mode==="black"){
        mode="light";
        document.querySelector("body").style.backgroundColor="white";
                document.querySelector(".mode-area").style.backgroundColor="#00796B";


        document.querySelector("body").style.boxShadow="inset 30px 0 50px rgba(255, 242, 0, 0.35),inset -30px 0 50px rgba(255, 242, 0, 0.35),inset 0 -20px 50px rgba(255, 242, 0, 0.35),inset 0 10px 30px rgba(255, 242, 0, 0.35)";
        document.querySelectorAll('.head,.con2, .con1').forEach(el=>{
            el.style.color="#333333";
        });


        // chMode.classList.add("slide");
        chMode.style.left="60%";
        document.querySelectorAll('.reset,span,.outarea').forEach(el=>{
            el.style.color="#00796B";
        })


        document.querySelectorAll(".inbox").forEach(el=>{
            if(!el.classList.contains("winner")){
            el.style.background="linear-gradient(135deg, #FFF9A6 0%, #FFF200 60%, #FFCC00 100%)";
            }
                el.style.color="#00796B"

        });

        
        document.querySelector(".reset").style.backgroundColor="#FFCC00";
        document.querySelector("#icon").innerText="☀️";
    }
    else{
        mode="black";
                document.querySelector("body").style.backgroundColor="black";
                document.querySelectorAll('.head,.con2,.con1').forEach(el=>{
                    el.style.color="white";
                })
                        document.querySelector("body").style.boxShadow="inset 30px 0 50px rgba(0, 255, 255, 0.5),inset -30px 0 50px rgba(0, 255, 255, 0.5),inset 0 -20px 50px rgba(0, 255, 255, 0.5),inset 0 10px 30px rgba(0, 255, 255, 0.5)";
                        chMode.style.left="0%";
                document.querySelector(".mode-area").style.backgroundColor="#FFFF33";
        document.querySelectorAll('.reset,span,.outarea').forEach(el=>{
            el.style.color="#FFFF33";
        })
        document.querySelectorAll(".inbox").forEach(el=>{
            if(!el.classList.contains("winner")){
            el.style.background="linear-gradient(135deg, #00FFFF 0%, #E0FFFF 100%)";
            }
            el.style.color="#FFFF33"
        });
                document.querySelector(".reset").style.backgroundColor="#00FFFF";
                document.querySelector("#icon").innerText="🌙";


    }
})
//mode changes end

let boxes=document.querySelectorAll(".inbox");
let resetbtn=document.querySelector(".reset");
const resetGame=()=>{
    for(let btn of boxes){
        btn.innerText="";
        btn.classList.remove("winner");
        btn.style.background=(mode==="light")?"linear-gradient(135deg, #FFF9A6 0%, #FFF200 60%, #FFCC00 100%)":"linear-gradient(135deg, #00FFFF 0%, #E0FFFF 100%)";
        btn.disabled=false;
            turn0 = true; // reset turn
    document.querySelector(".win").innerText = "";
}
btn.disabled=false;
}


let turn0=true;
let winCon=[[0,1,2],[0,3,6],[6,7,8],[2,5,8],[0,4,8],[2,4,6],[1,4,7],[3,4,5]];
   const dis=()=>{
    for(let btn of boxes){
        btn.disabled=true;
    }
   }
//creating function to know who wins
const checkWin= () => {
    for(pattern of winCon){
        let pos1=boxes[pattern[0]].innerText;
        let pos2=boxes[pattern[1]].innerText;
        let pos3=boxes[pattern[2]].innerText;
        if(pos1!="" && pos2!="" && pos3!=""){
            if(pos1===pos2 && pos2===pos3 && pos3==="O"){
                document.querySelector(".win").innerText="🎉Player 1 wins";
                console.log("win");
                boxes[pattern[0]].classList.add("winner");
                boxes[pattern[1]].classList.add("winner");
                boxes[pattern[2]].classList.add("winner");
                document.querySelectorAll(".winner").forEach(col=>{
                    col.style.background=" linear-gradient(135deg, #FFA500 0%, #FF4500 100%)";
                });
                playGif();
                    dis();

            }
            else if(pos1===pos2 && pos2===pos3 && pos3==="X"){
                document.querySelector(".win").innerText="🎉Player 2 wins";
                boxes[pattern[0]].classList.add("winner");
                boxes[pattern[1]].classList.add("winner");
                boxes[pattern[2]].classList.add("winner");
                document.querySelectorAll(".winner").forEach(col=>{
                    col.style.background="linear-gradient(135deg, #FF6B00 0%, #FF00AA 100%)";
                });
                playGif();
                    dis();

            }
        }
        
    }
};
//condition when game draw
let draw=()=>{
    let fill=0;
    for(let box of boxes){
 if(box.innerText !== ""){
    fill++;
 }

      if(fill===9 && document.querySelector(".win").innerText===""){
        document.querySelector(".win").innerText="It is a draw📍";
     }

}
};

   //playing and disabling all buttons after winning

boxes.forEach((fill)=>{
    fill.addEventListener("click",()=>{
  if(turn0==true){
        turn0=false;
        fill.innerText="O";
    }
    else{
        turn0=true;
        fill.innerText="X";
    }
fill.disabled=true;
        checkWin();
        draw();
    });
});
resetbtn.addEventListener("click",resetGame);

const playGif=()=>{
    document.querySelector(".gif").style.visibility="visible";
    setTimeout(()=>{
        document.querySelector(".gif").style.visibility="hidden";
    },2500);
}

