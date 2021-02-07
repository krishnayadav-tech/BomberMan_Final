let grid = document.querySelector(".grid");
let finished = false;
let flag = 10;
let clicked = 0;
let _random = new Array(10);
let _flag = new Array();

const generator = ()=>{
  for(let i=0;i<10;i++){
    let _temp = Math.floor((Math.random() * 100));
    let _temp2 = _random.indexOf(_temp);
    while(_temp2 != -1){
      _temp = Math.floor((Math.random() * 100));
      _temp2 = _random.indexOf(_temp);
    }
    _random[i] = _temp;
    document.querySelector(`#cell_${_temp}`).classList.remove("valid");
    document.querySelector(`#cell_${_temp}`).classList.add("bomb");
    document.querySelector(`#cell_${_temp}`).setAttribute("iscell","2");
  }
}

const validmove = (x,y)=>{
  if(x < 0 || y < 0){
    return false;
  }
  if(x>9 || y > 9){
    return false;
  }
  return true;
}
const datafillerHelper = (cellid)=>{
  cellid = Number(cellid);
  let row = Math.floor(cellid/10);
  let col = cellid%10;
  //totaldata = X,Y  => {X+1,Y},{X-1,Y},{X,Y+1},{X,Y-1},{X-1,Y-1},{X-1,Y+1},{X+1,Y-1},{X+1,Y+1}
  let _temp = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,1],[-1,1],[1,-1]]
  let count = 0;
  for(let i=0;i<_temp.length;i++){
    let rowt = row + _temp[i][0];
    let colt = col + _temp[i][1];
    if(validmove(rowt,colt)){
      let _temp2 = rowt*10 + colt
      if(_random.indexOf(_temp2) >= 0){
        count++;
      }
    }
  }
  document.querySelector(`#cell_${cellid}`).setAttribute("data",count);
}
const datafiller =()=>{
  
  for(let i=0;i<100;i++){
    datafillerHelper(i);
  }
}
const init=()=>{
  for(let i=0;i<100;i++){
    const tile = document.createElement("div");
    tile.classList.add("valid");
    tile.setAttribute("tile-no", i);
    tile.setAttribute("data","0");
    tile.setAttribute("iscell","1");
    tile.setAttribute("id", `cell_${i}`);
    grid.appendChild(tile);
  }
  generator();
  datafiller();
}

init();


function ifwin(){
  for(let i=0;i<_random.length;i++){
    if(_flag.indexOf(_random[i]) == -1){
      return false;
    }
  }
  return true;
}

document.querySelectorAll(".bomb").forEach((x,i)=>{
  x.addEventListener('click',(event)=>{
    if(finished == true){
      return;
    }
    if(event.target.classList.contains("flag")){
      event.target.classList.remove("flag");
      const index = _flag.indexOf(Number(event.target.getAttribute("tile-no")));
      if (index > -1) {
         _flag.splice(index, 1);
      } 
    }

    for(let i=0;i<10;i++){
      let temp_ = _random[i];
      document.querySelector(`#cell_${temp_}`).innerHTML = "💣";
      document.querySelector(`#cell_${temp_}`).classList.add("checked");
    }
    finished = true;
    document.querySelector("#result").innerHTML = "YOU LOSE!";
  })
})

document.querySelectorAll(".valid").forEach(x=>{
    x.addEventListener("click",(event)=>{
      if(finished == true){
        return;
      }
      if(event.target.classList.contains("checked")){
        return;
      }
      let temp_ = Number(event.target.getAttribute("tile-no"));
      document.querySelector(`#cell_${temp_}`).textContent = event.target.getAttribute("data");
      event.target.classList.add("checked");
      document.querySelector("#score").innerHTML = clicked + 1;
      clicked++;
      if(clicked == 90){
        document.querySelector("#result").innerHTML = "YOU WIN!";
        finished = true;
      }
    })
})
function dosome(ev){
  if(finished == true){
    return;
  }
  if(ev.target.getAttribute("tile-no") != undefined){
    let _tmep = ev.target.classList.contains("checked");
    if(_tmep == false){

      if(ev.target.classList.contains("flag")){
        ev.target.innerHTML = '';
        ev.target.classList.remove("flag");
        const index = _flag.indexOf(Number(event.target.getAttribute("tile-no")));
        if (index > -1) {
          _flag.splice(index, 1);
        } 
        flag++;
      }else{
        if(flag == 0){
          return;
        }
        _flag.push(Number(event.target.getAttribute("tile-no")));
        ev.target.classList.add("flag");
        ev.target.innerHTML = '🚩';
        flag--;
        if(ifwin()){
          document.querySelector("#result").innerHTML = "YOU WIN!";
          finished = true;
        }
      }
      document.querySelector("#flagsLeft").innerHTML = flag;
    }
  }
}
document.querySelector('div').oncontextmenu = (ev)=>{
  ev.preventDefault();
  dosome(ev);
  return false;
}