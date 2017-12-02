//------------------------------------------------------------------------------
// Dimension
//------------------------------------------------------------------------------
function Dimension(height,width){
  this.height = height;
  this.width = width;
}

//------------------------------------------------------------------------------
// Point
//------------------------------------------------------------------------------
function Point(x,y){
  this.x = x;
  this.y = y;

  this.distance = function(point){
    var a = this.x - point.x;
    var b = this.y - point.y;
    return Math.sqrt( a*a + b*b );
  }
}

//------------------------------------------------------------------------------
// time
//------------------------------------------------------------------------------
time = new (function(){
  this.lastUpdate = Date.now();
  this.delta = 0;

  this.updateDeltaTime = function(){
    let now = Date.now();
    this.delta = now - this.lastUpdate;
    this.lastUpdate = now;
  }

  this.deltaTime = function(){
    return this.delta/1000;
  }
})();

//------------------------------------------------------------------------------
// Dot
//------------------------------------------------------------------------------
function Dot(point,size,speed){
  this.position = point;
  this.size = size;
  this.speed = speed;

  this.update = function(context){
    let height = context.dimensions.height;
    let width = context.dimensions.width;
    this.position.x = this.position.x + this.speed.x * time.deltaTime();
    this.position.y = this.position.y + this.speed.y * time.deltaTime();
    if(this.position.x < 0){
      this.position.x = 0;
      this.speed.x = - this.speed.x;
    }
    if(this.position.x > context.dimensions.width){
      this.position.x = context.dimensions.width;
      this.speed.x = - this.speed.x;
    }
    if(this.position.y < 0){
      this.position.y = 0;
      this.speed.y = - this.speed.y;
    }
    if( this.position.y > context.dimensions.height){
      this.position.y = context.dimensions.height;
      this.speed.y = - this.speed.y;
    }
    graphics.fillStyle = 'rgba(255, 165, 0, 0.5)';
    graphics.beginPath();
    graphics.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2, true);
    graphics.fill();
  }

  this.connect = function(dot, alpha){
    graphics.strokeStyle = 'rgba(255, 165, 0, ' + alpha + ')';
    graphics.beginPath();
    graphics.moveTo(this.position.x,this.position.y);
    graphics.lineTo(dot.position.x,dot.position.y);
    graphics.stroke();
  }
}

//------------------------------------------------------------------------------
// graphics
//------------------------------------------------------------------------------
var graphics = null;

//------------------------------------------------------------------------------
// lines
//------------------------------------------------------------------------------
lines = new (function(){
  this.dimensions = new Dimension(100,100);
  this.canvas = null;

  this.dots = new Array();
  this.connectDistance = 200;

  this.logUpdateTime = false;
  this.duration = 0;
  this.fps = 0;
  this.updateCounter = 0;

  this.init = function(){
    this.canvas = document.getElementById("main-canvas");
    graphics = this.canvas.getContext("2d");
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;
    this.dimensions.width = this.canvas.width;
    this.dimensions.height = this.canvas.height;

    let lp = new URL(window.location.href).searchParams.get("logperf");
    if(lp === 'true'){
      this.logUpdateTime = true;
    }
    let dotCount = 100;
    let dcount = new URL(window.location.href).searchParams.get("dot-count");
    if(Number(dcount)){
      dotCount = Number(dcount);
    }
    let speed = 50;
    let spd = new URL(window.location.href).searchParams.get("speed");
    if(Number(spd)){
      speed = Number(spd);
    }
    let condist = new URL(window.location.href).searchParams.get("connect-distance");
    if(Number(condist)){
      this.connectDistance = Number(condist);
    }
    for(var i=0; i < dotCount; i++){
      let x = Math.random() * this.dimensions.width;
      let y = Math.random() * this.dimensions.height;
      let xspeed = Math.random() * 2 * speed - speed;
      let yspeed = Math.random() * 2 * speed - speed;
      this.dots.push(new Dot(new Point(x,y),2,new Point(xspeed,yspeed)));
    }
    if( this.canvas.getContext ){
      setInterval( this.update , 1000/30 , this);
    }
  }

  this.resize = function(){
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;
    this.dimensions.width = this.canvas.width;
    this.dimensions.height = this.canvas.height;
  }

  this.update = function(context){
    const startTime = performance.now();
    time.updateDeltaTime();
    graphics.clearRect(0,0,context.canvas.width,context.canvas.height);
    for(let dot of context.dots){
      dot.update(context);
    }
    for(let dot of context.dots){
      for(let dot2 of context.dots){
        if(dot.position.distance(dot2.position) < context.connectDistance){
          let alpha = 1 - dot.position.distance(dot2.position)/ context.connectDistance;
          dot.connect(dot2,alpha);
        }
      }
    }
    const duration = performance.now() - startTime;
    if( context.updateCounter == 10){
      context.updateCounter = 0;
      context.duration = Math.round( duration * 10 ) / 10;
      context.fps = Math.round(1/time.deltaTime());
    }else{
      context.updateCounter += 1;
    }
    if(context.logUpdateTime){
      let updateDurationTxt = `Update took: ${context.duration}ms`;
      let fpsTxt = `Fps: ${context.fps}`;
      let txtSize = Math.max(
        graphics.measureText(updateDurationTxt).width+7,
        graphics.measureText(fpsTxt).width+7
      );
      graphics.font = '12px Arial';
      graphics.fillStyle = 'rgba(50, 50, 50, 0.8)';
      graphics.fillRect(7,9,graphics.measureText(updateDurationTxt).width+7,34)
      graphics.fillStyle = 'rgba(220, 220, 220, 0.8)';
      graphics.fillText(updateDurationTxt,10,22);
      graphics.fillText(fpsTxt,10,37);
    }
  }

})();
