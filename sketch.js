var ps = [];
var time;
var refresh = 5;
var run = true,visual=false;
var bx,by=10;
var absolute=false;
var checkAbs;
var clearButton,duoButton, triButton,stopButton;
var duoMassInput,duospaceInput;
var triMassInput,spaceInput;
var plot = [];
var points = [];
var pointsV=[];

function setup() {
    var canvas = createCanvas(1400, 700);
    bx=width + 20;
    canvas.position(0,0);
    time = 500;

    checkAbs = createCheckbox('Absolute aceleration', false);
    checkAbs.changed(check_Abs);
    checkAbs.position(bx, by+170);

    stopButton = createButton("pause");
    stopButton.position(bx, by);
    stopButton.mousePressed(stop_Button);

    clearButton = createButton("clear");
    clearButton.position(bx, by+40);
    clearButton.mousePressed(clear_Button);

    duoButton = createButton("duo");
    duoButton.position(bx, by+80);
    duoButton.mousePressed(duo_Button);

    duoMassInput = createInput();
    duoMassInput.position(bx + 40, by + 70);
    duoMassInput.size(40, 15);
    duoMassInput.value(30);

    duospaceInput = createInput();
    duospaceInput.position(bx + 40, by + 70 + 20);
    duospaceInput.size(40, 15);
    duospaceInput.value(300);

    var disp = 50;
    triButton = createButton("tri");
    triButton.position(bx, by+80+disp);
    triButton.mousePressed(tri_Button);

    triMassInput = createInput();
    triMassInput.position(bx + 30, by + 70+disp);
    triMassInput.size(40, 15);
    triMassInput.value(50);

    spaceInput = createInput();
    spaceInput.position(bx + 30, by + 70 + 20+disp);
    spaceInput.size(40, 15);
    spaceInput.value(100);






    // for (i = 0; i < ps.length; i++) {
		// 	points[i] = new GPoint(i, 10 * noise(0.1 * i + 100));
		// }
    plot[0] = new GPlot(this);
		plot[0].setPos(0,this.height/2);
		plot[0].setOuterDim(this.width/2, this.height/2);
    //plot.fixedXLim=true;
    plot[0].fixedYLim=false;//record system! (make more viewable)  yLim = [ 0, 1 ];
    plot[0].setPoints(points);
    plot[0].setTitleText("Aceleretion");
    plot[0].getXAxis().setAxisLabelText("Time");
    plot[0].getYAxis().setAxisLabelText("Aceleration");


    plot[1] = new GPlot(this);
    plot[1].setPos(this.width/2,this.height/2);
    plot[1].setOuterDim(this.width/2, this.height/2);
    //plot.fixedXLim=true;
    plot[1].fixedYLim=false;//record system! (make more viewable)  yLim = [ 0, 1 ];
    plot[1].setPoints(pointsV);
    plot[1].setTitleText("Velocity");
    plot[1].getXAxis().setAxisLabelText("Time");
    plot[1].getYAxis().setAxisLabelText("Velocity");

}

function draw() {
  if (run) {
    visual=false;
    background(255);
    if (ps[0] != undefined) {
      points=[];
      for (i = ps[0].acelT.length-1; i >= 0; i--) {
        if(absolute){//absolute//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  			points[i] = new GPoint(i,abs((ps[0].acelT[i].x+ps[0].acelT[i].y)/2));
      }else{
        points[i] = new GPoint(i,(ps[0].acelT[i].x+ps[0].acelT[i].y)/2);
      }
        var pt = [];
        arrayCopy(points,pt);
        pt.sort(function(a, b){return b - a});
        plot[0].yLim = [ 0, pt[0] ];
        //console.log(pt[0]);
  		}
    }
    plot[0].setPoints(points);
    plot[0].defaultDraw();

    if (ps[0] != undefined) {
      pointsV=[];
      for (i = ps[0].velT.length-1; i >= 0; i--) {
  			pointsV[i] = new GPoint(i,(ps[0].velT[i].x+ps[0].velT[i].y)/2);
        var ptv = [];
        arrayCopy(pointsV,ptv);
        ptv.sort(function(a, b){return b - a});
        plot[1].yLim = [ 0, pt[0] ];
        //console.log(pt[0]);
  		}
    }
    plot[1].setPoints(pointsV);
    plot[1].defaultDraw();


    for (var i = ps.length - 1; i >= 0; i--) {
        var p = ps[i];
        for (var j = ps.length - 1; j >= 0; j--) {
            var other = ps[j];
            if (p != other) {
                p.atract(other);
                stroke(200, 100);
                strokeWeight(1);
                //strokeWeight(map(p.mass + other.mass, 0, 100, 0.1, 2));
                //line(p.pos.x, p.pos.y, other.pos.x, other.pos.y);
            }
        }
        p.edge(ps, i);
        p.update();
        p.display();

    }
  }else if(visual){

  }

}

function mousePressed() {
    //ps.push(new Particle(mouseX, mouseY, 80));
    time = millis();
}

function mouseReleased() {
    //console.log(0.1 * (millis() - time));
    var t;
    if (ps[0]==undefined) {
      t=true;
    }else {
      t=false;
    }
    ps.push(new Particle(mouseX, mouseY, 0.1 * (millis() - time),t));
    console.log(ps[ps.length-1]);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Particle(x, y, mass_,toPlot_) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.vels = createVector(0, 0);
    this.acel = createVector(0, 0);
    this.acels = createVector(0, 0);
    this.mass = mass_*2;
    this.acelT = [];
    this.acelT.push(this.acels);
    this.velT = [];
    this.velT.push(this.vels);
    this.toPlot = toPlot_;

    this.update = function() {
        //this.acel.mult(this.mass);
        this.vel.add(this.acel);
        this.pos.add(this.vel);
        if (this.toPlot) {
          this.acels = this.acel.copy();
          this.vels = this.vel.copy()
          if (frameCount%refresh==1) this.acelT.push(this.acels);
          if (frameCount%refresh==1) this.velT.push(this.vels);
          if (this.acelT.length>80) this.acelT.shift();
          if (this.velT.length>80) this.velT.shift();
        }
        this.acel.mult(0);
    };
    this.edge = function(ps, i) {
        if (width < this.pos.x || 0 > this.pos.x || height < this.pos.y || 0 > this.pos.y) {
            ps.splice(i, 1);
        }
    };
    this.display = function() {
        // strocke(map(vel.x,0,)
        noStroke();
        if (this.toPlot) {
          fill(0, 255, 0, 200);
        }else {
          fill(0, 200);
        }
        var d=sqrt(this.mass)*4;
        ellipse(this.pos.x, this.pos.y,d,d);
    };
    this.applyForce = function(force) {
        var f = p5.Vector.div(force, this.mass);
        this.acel.add(f);
    };
    this.atract = function(other) {
        var d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        var m;
        if (this.mass > other.mass) {
            m = this.mass;
        } else {
            m = other.mass;
        }
        d = constrain(d, m*1, 20000000);
        var f = 5 * 9.8 * ((this.mass + other.mass) / sq(d));
        var force = createVector(other.pos.x - this.pos.x, other.pos.y - this.pos.y);
        force.normalize();
        force.mult(f);
        this.applyForce(force);
    };
}

function check_Abs(){
  if (this.checked()) {
      absolute=true;
    } else {
      absolute=false;
    }

};

function clear_Button() {
    ps = [];
};

function stop_Button() {
  if (run) {
    stopButton.html('resume');
    run=false;
    visual=true;
  } else {
    stopButton.html('pause');
    run=true;
    visual=false;
  }
};

function duo_Button() {
    ps = []
    var space=duospaceInput.value();
    var mass=duoMassInput.value();
    ps.push(new Particle(width/2-space/2, height/2-height/4, mass,true));
    ps.push(new Particle(width/2+space/2, height/2-height/4, mass,false));
};

function tri_Button() {
    ps = []
    var space=spaceInput.value();
    var mass=triMassInput.value();
    ps.push(new Particle(width/2, height/2-sqrt(sq(space )-sq(space/2))-height/4, mass,true));
    ps.push(new Particle(width/2+space/2, height/2-height/4, mass,false));
    ps.push(new Particle(width/2-space/2, height/2-height/4, mass,false));
};
