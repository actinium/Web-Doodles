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
// circles
//------------------------------------------------------------------------------
circles = new (function(){
  this.height = 100;
  this.width = 100;
  this.canvas = null;
  this.pref = new Point(100,100);
  this.pref_speed = new Point(86,110);

  this.init = function(){
    this.canvas = document.getElementById("main-canvas");
    graphics = this.canvas.getContext("2d");
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    if( this.canvas.getContext ){
      setInterval( update , 1000/30);
    }
  }

  this.resize = function(){
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  this.update = function(){
    time.updateDeltaTime();
    graphics.clearRect(0,0,this.width,this.height);

    this.pref.x += this.pref_speed.x * time.deltaTime();
    if(this.pref.x < 0){
      this.pref.x = 0;
      this.pref_speed.x = - this.pref_speed.x;
    }
    if(this.pref.x > this.width){
      this.pref.x = this.width;
      this.pref_speed.x = - this.pref_speed.x;
    }
    this.pref.y += this.pref_speed.y * time.deltaTime();
    if(this.pref.y < 0){
      this.pref.y = 0;
      this.pref_speed.y = - this.pref_speed.y;
    }
    if(this.pref.y > this.height){
      this.pref.y = this.height;
      this.pref_speed.y = - this.pref_speed.y;
    }

    graphics.strokeStyle = '#111155';
    for(x=15; x < this.width-15; x+=20){
      for(y=15; y < this.height-15; y+=20){
        let p = new Point(x,y);
        graphics.beginPath();
        graphics.arc(x,y,Math.max(15-(this.pref.distance(p)/20),1),0,2*Math.PI);
        graphics.stroke();
      }
    }
  }
})();

function update(){
  circles.update();
}
