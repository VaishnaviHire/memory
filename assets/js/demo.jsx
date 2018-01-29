
import React from 'react';

import ReactDOM from 'react-dom';

import { Button} from 'reactstrap';

export default function run_demo(root) {
  ReactDOM.render(<Demo />, root);
}

function randomSort(arr){

var n = arr.length;
var temp, rand_index;
var i = 0;
for (i = n-1;i>0;i-=1){
        rand_index = Math.floor(Math.random() * (i + 1));

        temp = arr[i];
        arr[i] = arr[rand_index];
        arr[rand_index] = temp;
}

return arr;
}

function loadGame(){
let grid = ['A', 'A','B','B','C','C','D','D','E','E','F','F','G','G','H','H'];
grid = randomSort(grid);

return grid;

}

const startState = {
startGrid : loadGame(),
active : ['?','?','?', '?','?','?','?','?','?','?','?','?','?','?','?','?'],
active1:'None',
active1_pos : '',
active2: 'None',
active2_pos :'',
clicks: 0,
score: 0,
limit: false}

class Demo extends React.Component{
     constructor(props){
        super(props);
        this.state = startState;

}

  stateChange(value,id){
let curr_grid = this.state.active;

let init_grid = this.state.startGrid;

let clickCount = this.state.clicks;

clickCount += 1;

if(this.state.active1 == 'None' || this.state.active2 == 'None')
{
  if(this.state.active[id] == '?')
    {
     curr_grid[id] = init_grid[id];
     this.setState({active: curr_grid});

      if(this.state.active1 == 'None')
        {
          this.setState({active1: curr_grid[id], active1_pos: id, limit: false});

        }
     else {
        if(this.state.active2 =='None')
         {
          this.setState({active2: curr_grid[id], active2_pos: id, limit: true});
          }
}
        }
  this.setState({clicks: clickCount});
} 

}


resetActiveState(){
let score1 = this.state.score + 5;
this.setState({active1:'None', active2:'None', score:score1});
}
resetGame(){
let curr_grid = this.state.active;
let score1 = this.state.score - 1;
curr_grid[this.state.active1_pos] = '?';
curr_grid[this.state.active2_pos] = '?';
this.setState({active1:'None', active2: 'None',score: score1, active1_pos: '', active2_pos:'',active: curr_grid, limit:false});
}


reset(){
this.setState(startState);
this.setState({active: ['?','?','?', '?','?','?','?','?','?','?','?','?','?','?','?','?'] });
}

componentDidUpdate(){

    let active1  = this.state.active1;
    let active2 =  this.state.active2;

if (active1 != 'None'  && active2!='None')
  {
      if(active1!=active2)
      {
        let a = document.getElementById("Grid");
        a.className += "disabledbutton";
        this.interval = setTimeout(this.timer.bind(this), 1000);
        a.classList.remove("disabledbutton");
        document.getElementById("status").innerHTML = "Try Again";
      }
      else {
        this.resetActiveState();
        if (this.state.active.indexOf('?') == -1)
       {
          document.getElementById("status").innerHTML = "Congrats!";
        }
        else{
          document.getElementById("status").innerHTML = "Matched";
        }

      }

    }

  }


timer(){
if(this.state.active1!= 'None'  && this.state.active2!= 'None')
{
this.resetGame();
clearInterval(this.interval);
}
}

setClassNames(value){

if(value == '?')
{
return "Square inactive";
}
else{
return "Square active";
}
}

render()
{
  let active1 = this.state.active1;
  let active2 = this.state.active2;
  let grid = this.state.active;
  return (
<div className = "row">
<div>
<Score value = {this.state.score} onClick = {() => {this.reset()}} Clicks = {this.state.clicks} />
</div>
<div className ="Grid" id = "Grid">
{
grid.map((v,i) => <Square className ={this.setClassNames(v)} onClick = {() => {this.stateChange(v,i)}} value ={v} key={i} />)
}</div>
</div>
);

}
}


function Square(props){
return (<div class= "but1" >
        <Button className ={props.className}  onClick ={props.onClick}>
        {props.value}
        </Button></div>);}
$(loadGame);
                              
function Score(props)
{
return (<div className ="score">
<h2> Score : {props.value}</h2><br />
<h2> Clicks: {props.Clicks}</h2><br />
<div id = "reset">
<div id = "status"> </div></div>
<Button className ="btn btn-primary" onClick = {props.onClick}> Reset Game </Button>
</div>);
}

                                    

