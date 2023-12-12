const 
	block = document.querySelector('.block'),
	box = document.querySelector('.box'),
	span = document.querySelector(".block span"),
	legend = document.querySelector(".legend"),
	positCorner = document.querySelector(".positCorner"),
	boxWrapper = document.querySelector(".boxWrapper"),
	positCornerTooltip = document.querySelector(".positCornerTooltip"),
	H = block.offsetHeight,
	W = block.offsetWidth,
	b = parseInt(getComputedStyle(box).borderLeftWidth);

let 
	mPosOn_X,
	mPosOn_Y,
	boxWith,
	boxHeight,
	stepValue = 26,
	calcLeft,
	calcRight,
	calcTop,
	calcBottom;

block.style.left = "8px";
block.style.top = box.offsetHeight-b*2-block.offsetHeight-8+"px";

positCorner.addEventListener("mousedown", cornerOn);
document.addEventListener('keydown', moving);

function cornerOn(event){
	positCorner.style.borderBottomColor = "rgba(228, 107, 27, 0.808)";
	document.documentElement.style.cursor = "nwse-resize";
	positCorner.style.cursor = "nwse-resize";	
	positCornerTooltip.innerHTML = "Hold and move. <br> Then release it.";
	document.addEventListener("mouseup", cornerOff, {once: true});
	document.addEventListener("mousemove", cornerMove);
	mPosOn_X = event.pageX;
	mPosOn_Y = event.pageY;
	boxWith = parseInt(getComputedStyle(box).width);
	boxHeight = parseInt(getComputedStyle(box).height);
}

function cornerOff(){
	positCorner.style.borderBottomColor = "";
	document.removeEventListener("mousemove", cornerMove);
	document.documentElement.style.cursor = "";
	positCorner.style.cursor = "";
	positCornerTooltip.innerHTML = "Click the corner<br>and hold<br>for strething box.";	
}

function cornerMove(event){
	event.preventDefault();
	let 
		posDistance_X = event.pageX - mPosOn_X,
		posDistance_Y = event.pageY - mPosOn_Y,
		newWidth = boxWith + posDistance_X,
		newHeight = boxHeight + posDistance_Y;

	if (newWidth<=900 && newWidth>190) {
		box.style.width = newWidth+"px";	
		if ((newWidth - b*2 - block.offsetLeft - W)<0) {
			block.style.left = (newWidth - b*2 - W-8) +"px";			
		}
	}

	if (newHeight<=800 & newHeight>190) {
		box.style.height = newHeight+"px";
		if ((newHeight - b*2 - block.offsetTop - W)<0) {
			block.style.top = (newHeight - b*2 - W-8) +"px";			
		}
	}

	if (newWidth<=newHeight){
		stepValue = newWidth*0.07;
	} else stepValue = newHeight*0.07;
}

let keys = {
	32: function(){	//подпрыгивание		
		block.classList.add("action-jump");
		document.removeEventListener('keydown', moving);
		setTimeout (function () {
			block.classList.remove("action-jump");
			document.addEventListener('keydown', moving);
		}, 700);
	},
	17: function(){ //приседание
		document.removeEventListener('keydown', moving);
		block.style.transition = '0.1s';		
		block.style.height = H*0.5+"px";
		block.style.top = calcTop+H*0.5+'px';
		block.style.width = W*1.3+"px";
		block.style.left = calcLeft-W*0.3/2+'px';
		document.addEventListener('keyup', standUp);
	},
	38: function(){	//вверх
		if (calcTop<stepValue){					
			bems("Top");			
		} else block.style.top = calcTop-stepValue+'px';
	},
	40: function(){ //вниз		
		if (calcBottom < stepValue){							
			bems("Bottom");
		} else block.style.top = calcTop+stepValue+'px';
	},
	37: function(){ //влево
		if (calcLeft<stepValue){				
			bems("Left");
		} else block.style.left = calcLeft-stepValue+'px';		
	},
	39: function(){	//вправо		
		if (calcRight < stepValue){						
			bems("Right");
		} else block.style.left = calcLeft+stepValue+'px';
	}
}

function standUp (evt){
	if (evt.keyCode == 17 ){
		block.style.transition = '0.15s';
		block.style.height = H+"px";
		block.style.top = calcTop+'px';
		block.style.width = W+"px";
		block.style.left = calcLeft+'px';
		setTimeout (function () {
			block.style.transition = '';
			document.addEventListener('keydown', moving);
		}, 200);
	}
}

function moving(event){	
	calcLeft = block.offsetLeft;
	calcRight = box.offsetWidth - b*2 - block.offsetLeft - W;
	calcTop = block.offsetTop;
	calcBottom = box.offsetHeight - b*2 - block.offsetTop - H;	
	let code = event.keyCode;
	keys[code] && keys[code]();
}

function bems (side) {		
	span.style.transition = "0.2s";
	span.style.opacity = "1";
	span.style.transform = "scale(1, 1.2)";
	block.style.transition = "0.06s";
	document.removeEventListener('keydown', moving);
	let classSide = "redBorder" + side;
	var bordBleem = setInterval(() => {//включаем мигающий бордер со стороны удара
		block.classList.toggle(classSide);
	}, 50);

	switch (side){ //отрисовка красной тени в зависимости от ударенной стороны
		case "Right":
			block.style.left = calcLeft+calcRight+'px';		
			setTimeout(() => {
				block.style.boxShadow = "22px 0px 21px -9px rgba(255,16,51,0.75)";				
				block.style.left = calcLeft+calcRight-stepValue*0.9+'px';			
			}, 70);
		break;

		case "Left":
			block.style.left = 0;
			setTimeout(() => {				
				block.style.boxShadow = "-22px 0px 21px -9px rgba(255,16,51,0.75)";
				block.style.left = stepValue*0.9+'px';			
			}, 70);
		break;

		case "Top":
			block.style.top = 0+'px';
			setTimeout(() => {
				block.style.boxShadow = "0px -22px 21px -9px rgba(255,16,51,0.75)";
				block.style.top = stepValue*0.9+'px';		
			}, 70);
		break;

		case "Bottom":
			block.style.top = calcTop+calcBottom+'px';
			setTimeout(() => {
				block.style.boxShadow = "0px 22px 21px -9px rgba(255,16,51,0.75)";
				block.style.top = calcTop+calcBottom-stepValue*0.9+'px';			
			}, 70);
	};
	
	setTimeout(function () {
		span.style.transition = "1.5s"
		block.style.transition = "0.15s";
		box.classList.add("box-swing"+ side);
		legend.classList.add("box-swing"+ side);
		boxWrapper.classList.add("box-swing"+ side);		
	}, 70);
	setTimeout(function () {		
		block.style.boxShadow = "";
		box.classList.remove("box-swingRight", "box-swingLeft", "box-swingTop", "box-swingBottom");
		legend.classList.remove("box-swingRight", "box-swingLeft", "box-swingTop", "box-swingBottom");
		boxWrapper.classList.remove("box-swingRight", "box-swingLeft", "box-swingTop", "box-swingBottom");
	}, 500);
	setTimeout(function () {
		block.style.transition = "";
		document.addEventListener('keydown', moving);
	}, 600);	
	setTimeout(function () {		
		span.style.transform = "scale(1, 0.2)";		
	}, 1000);
	setTimeout(function () {		
		span.style.opacity = "";
		clearInterval(bordBleem);//выключаем мигающий бордер со стороны удара
		block.classList.remove("redBorderRight", "redBorderLeft", "redBorderTop", "redBorderBottom");
	}, 1300);
}


function startInstruction(){
	setTimeout(function (){
		positCornerTooltip.style.display = "block";
	},1000)
	setTimeout(function (){
		positCornerTooltip.style.display = "";
	},6000);
}

window.onload = discriptionUp;

const popupDiscription_container = document.querySelector(".popupDiscription-container");
const popupDiscription_content = document.querySelector(".popupDiscription-content");
const mainContent = document.querySelector(".mainContent");

function discriptionUp() {
    popupDiscription_container.classList.add("popupDiscription-container-active");
    popupDiscription_container.addEventListener("click", discriptionDown, { once: true });
    mainContent.classList.add("mainContent-freezed");
}

function discriptionDown() {
    popupDiscription_container.classList.remove("popupDiscription-container-active");
    mainContent.classList.remove("mainContent-freezed");
	startInstruction();
}

