//------------------------------------------------------------------------------
// Graphics
//------------------------------------------------------------------------------
let graphics;
let width = 0;
let height = 0;

//------------------------------------------------------------------------------
// Alarm
//------------------------------------------------------------------------------
let alarm = document.getElementById("alarm");

//------------------------------------------------------------------------------
// Time
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
    return this.delta;
  }
})();

//------------------------------------------------------------------------------
// Timer
//------------------------------------------------------------------------------
timer = new (function(){
  this.canvas;

  this.time;
  this.timeProgress;
  this.progress = 0;
  this.favPieIndex = 0;

  this.counting = false;
  this.interval;

  this.init = function(){
    document.head = document.head || document.getElementsByTagName('head')[0];
    this.canvas = document.getElementById("main-canvas");
    graphics = this.canvas.getContext("2d");
    width = this.canvas.width;
    height = this.canvas.height;
    graphics.font = '110px Inconsolata';
    graphics.textAlign="center";
    graphics.textBaseline="middle";
    alarm = document.getElementById("alarm");
    alarm.loop = true;
    this.time = new Date(0);
    this.redraw();
  }

  //----------------------------------------------------------------------------
  // Timer - Change Time
  //----------------------------------------------------------------------------
  this.addMinute = function(){
    if(!this.counting){
      this.time.setMinutes(this.time.getMinutes() + 1);
      this.redraw();
    }
  }

  this.subMinute = function(){
    if(!this.counting){
      this.time.setMinutes(this.time.getMinutes() - 1);
      this.redraw();
    }
  }

  this.addSecond = function(){
    if(!this.counting){
      this.time.setSeconds(this.time.getSeconds() + 10);
      this.redraw();
    }
  }

  this.subSecond = function(){
    if(!this.counting){
      this.time.setSeconds(this.time.getSeconds() - 10);
      this.redraw();
    }
  }

  //----------------------------------------------------------------------------
  // Timer - Start & Stop
  //----------------------------------------------------------------------------
  this.start = function(){
    if(this.counting){
      this.stop();
    }
    time.updateDeltaTime();
    this.counting = true;
    let t = this.time;
    this.time = new Date(0);
    this.time.setMinutes(t.getMinutes());
    this.time.setSeconds(t.getSeconds());
    this.timeProgress = new Date(0);
    this.interval = setInterval(this.tick, 100,this);
  }

  this.stop = function(){
    clearInterval(this.interval);
    this.counting = false;
    alarm.pause();
    alarm.currentTime = 0;
    graphics.font = '110px Inconsolata';
    this.progress = 0;
    this.redraw();
    this.favPieIndex = 0;
    changeFavIcon(pieIcon[0]);
  }

  //----------------------------------------------------------------------------
  // Timer - Update
  //----------------------------------------------------------------------------
  this.tick = function(context){
    time.updateDeltaTime();
    context.timeProgress = new Date(context.timeProgress.getTime() +time.deltaTime());
    context.progress = 100*context.timeProgress.getTime()/context.time.getTime();
    if(context.progress >= 100){
      context.progress = 100;
      context.timeProgress = context.time;
      clearInterval(context.interval);
      context.interval = setInterval(context.flash,300,context);
      alarm.play();
    }
    context.redraw();
    let pieIndex = (8*context.progress/100)|0;
    if( pieIndex != context.favPieIndex){
      context.favPieIndex = pieIndex;
      changeFavIcon(pieIcon[pieIndex]);
    }
  }

  this.fontFlash = 0;
  this.flash = function(context){
    if(context.fontFlash === 0){
      graphics.font = '100px Inconsolata';
      context.fontFlash = 1;
    }else{
      graphics.font = '120px Inconsolata';
      context.fontFlash = 0;
    }
    context.redraw();
    alarmIconIndex = (alarmIconIndex+1)%2;
    changeFavIcon(alarmIcon[alarmIconIndex]);
  }

  //----------------------------------------------------------------------------
  // Timer - Redraw
  //----------------------------------------------------------------------------
  this.redraw = function(){
    graphics.clearRect(0,0,this.canvas.width,this.canvas.height);

    let m = this.time.getMinutes() + '';
    let s = this.time.getSeconds() + '';
    if(this.counting){
       t = new Date(this.time - this.timeProgress);
       m = t.getMinutes() + '';
       s = t.getSeconds() + '';
    }
    m = m.length >= 2 ? m : new Array( 2 - m.length + 1 ).join('0') + m;
    s = s.length >= 2 ? s : new Array( 2 - s.length + 1 ).join('0') + s;
    graphics.fillStyle = '#757980';
    graphics.fillText( `${m} ${s}`, width/2, height/2 );
    graphics.fillText( `    :    `, width/2, height/2-10 );

    graphics.beginPath();
    graphics.arc( width/2, height/2, 200, 0, 2*Math.PI );
    graphics.lineWidth = 10;
    graphics.strokeStyle = '#e5e5e6';
    graphics.stroke();

    graphics.beginPath();
    graphics.arc( width/2, height/2, 200, -Math.PI/2, 2*Math.PI - Math.PI/2 - this.progress/100*2*Math.PI);
    graphics.lineWidth = 40;
    graphics.strokeStyle = '#359edc';
    graphics.stroke();

  }

})();

//------------------------------------------------------------------------------
// Favicon
//------------------------------------------------------------------------------
const pieIcon = new Array(
  'icons/pie-0.ico',
  'icons/pie-1.ico',
  'icons/pie-2.ico',
  'icons/pie-3.ico',
  'icons/pie-4.ico',
  'icons/pie-5.ico',
  'icons/pie-6.ico',
  'icons/pie-7.ico',
  'icons/pie-8.ico'
);

let alarmIconIndex = 0;
const alarmIcon = new Array(
  'icons/alarm-0.ico',
  'icons/alarm-1.ico',
);

function changeFavIcon(src){
  var link = document.createElement('link'),
  oldLink = document.getElementById('favicon');
  link.id = 'favicon';
  link.rel = 'icon';
  link.type = 'img/ico';
  link.href = src;
  if (oldLink) {
    document.head.removeChild(oldLink);
  }
  document.head.appendChild(link);
}
