var timer, alien, gameAge, BEAT_INTERVAL=100, GAME_LIFETIME_SECS=5;
var BODY_SIZE;

$(function() {
  BODY_SIZE = [$(window).width(), $(window).height()];
  startGame();
});

function startGame() {
  $("#arena").empty();
  $("#score").html("0");
  gameAge=0;
  alien = new Alien();
  alien.start();
  $("body").unbind("click").click(function(e) { if (e.target == alien.sprite.get(0)) alien.onSquish(); });
  beat();
  timer = setInterval(beat, BEAT_INTERVAL);
}

function beat() {
  forEachDim(function(dim) {
    alien.pos[dim] = alien.pos[dim] + alien.velocity[dim] % BODY_SIZE[0];
    if (alien.pos[dim]<0) {
      alien.velocity[dim] = Math.abs(alien.velocity[dim]);
      alien.pos[dim] += 2*alien.velocity[dim];
    }
    if (alien.pos[dim]+alien.size[dim] > BODY_SIZE[dim]) {
      alien.velocity[dim] = -Math.abs(alien.velocity[dim]);
      alien.pos[dim] += 2*alien.velocity[dim];
    }
  });
  alien.age+=BEAT_INTERVAL;
  alien.repaint();

  gameAge+=BEAT_INTERVAL;
  $("#lifetime").html(Math.ceil(GAME_LIFETIME_SECS-gameAge/1000));
  if (gameAge>=GAME_LIFETIME_SECS*1000) {
    clearTimeout(timer);
    $("body").unbind("click").dblclick(startGame);
  }
}

function Alien() {
  this.sprite = $("<div class='sprite'>&nbsp;</div>").appendTo($("#arena"));
}

Alien.prototype.start = function() {
  var alien = this;
  this.incarnation = (this.incarnation || 0) + 1;
  this.size = [50-this.incarnation, 50-this.incarnation];
  this.pos = [Math.floor(BODY_SIZE[0]*Math.random()), Math.floor(BODY_SIZE[1]*Math.random())];

  this.velocity = this.velocity || [];
  forEachDim(function(dim) {
    var velocityBase = Math.round(BODY_SIZE[dim]/(100*(1+alien.incarnation/10)));
    alien.velocity[dim] = velocityBase-(2*Math.random()/velocityBase);
  });

  this.age = 0;
}

Alien.prototype.repaint = function() {
  this.sprite.css({width:alien.size[0],height:alien.size[1],"left":this.pos[0],"top":this.pos[1]});
}

Alien.prototype.onSquish = function() {
  var score_base = 1000;
  var time_bonus = Math.max(0, Math.round((2000-this.age)/10));
  var incarnation_bonus = 300*this.incarnation;
  var squishScore = score_base+time_bonus+incarnation_bonus;
  var prevScore = parseInt($("#score").html());
  $("#score").fadeOut(function() { $(this).html(prevScore+squishScore); }).fadeIn();
  this.start();
}

function forEachDim(fn) {
  for (var dim=0; dim<=1; dim++) { fn(dim); }
}
