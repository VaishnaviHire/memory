import React from 'react';

import ReactDOM from 'react-dom';

import { Button} from 'reactstrap';

export default function run_demo(root, channel) {
  ReactDOM.render(<Demo channel ={channel} />, root);
}



const initState = {
startGrid : [],
active : [],
active1:'None',
active1_pos : '',
active2: 'None',
active2_pos :'',
clicks: 0,
score: 0,
}

function Square(props){
	return (<div className = "but1" >
        	<Button className ={props.className}  onClick ={props.onClick}>
        	{props.value}
        	</Button></div>);
}


function Score(props){
	return (<div className ="score">
		<h3> Score : {props.value}</h3><br />
		<h3> Clicks: {props.Clicks}</h3><br />
		<div id = "status"> Click the squares </div>
		<div id = "reset"><Button className ="btn btn-success" onClick = {props.onClick}> Reset Game </Button>
		</div></div>);
}


class Demo extends React.Component{
    
 constructor(props){
        super(props);
        this.state = initState;
        this.channel = props.channel;
        this.channel.join()
        .receive("ok", this.gotView.bind(this))
        .receive("error", resp => { console.log("Unable to join", resp) })
  }

 gotView(view) {
	this.setState(view.gameState);
  }


 reset(){
	this.channel.push("reset", {}).receive("ok", this.gotView.bind(this))
 }

 componentDidUpdate(){
    console.log("start updation")
    let active1  = this.state.active1;
    let active2 =  this.state.active2;

    if (active1 != 'None'  && active2 != 'None'){
    	if(active1 != active2){
        	let a = document.getElementById("Grid");
        	a.className += "disabledbutton";
        	this.interval = setTimeout(this.timer.bind(this), 1000);
        	a.classList.remove("disabledbutton");
		document.getElementById("status").innerHTML = "Try Again";	
         }
        else {      
        	if (this.state.active.indexOf('?') == -1){
          		alert("Congrats!! You win!");}
		else{
                        document.getElementById("status").innerHTML = "It`s a Match!";}

        }

    }

  }


 timer(){
  
   this.channel.push("updates", 
	{active1: this.state.active1, active1_pos: this.state.active1_pos, active2: this.state.active2, 
		active2_pos: this.state.active2_pos}).receive("ok", this.gotView.bind(this))
   clearInterval(this.interval);

 }

 onSquareClick(value, index)
 {
	let activeList = this.state.active;
	if(activeList[index] == "?"){
 		this.channel.push("onsquareclick", {index: index, letter: value}).receive("ok", this.gotView.bind(this))
	}
 }


 setClassNames(value){
	if(value == '?'){
		return "Square inactive";}
	else{
		return "Square active";}
 }

 render(){
  	let grid = this.state.active;
  	return (
		<div className = "row">
			<div><Score value = {this.state.score} onClick = {this.reset.bind(this)} Clicks = {this.state.clicks} /></div>
			<div className ="Grid" id = "Grid">{
			grid.map((v,i) => <Square className ={this.setClassNames(v)} 
				  onClick = {this.onSquareClick.bind(this, v,i)} value ={v} key={i} />)}</div>

 		</div>);
 }
}
