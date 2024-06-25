
window.addEventListener('load', windowload, false)
function windowload() {
    canvasApp();
}
function canvasSupport() {
    return Modernizr.canvas;
}
function canvasApp() {
    if (!canvasSupport()) {
        return;
    }
    // fun options!
    const PARTICLES_PER_FIREWORK = 300; // 100 - 400 or try 1000
    const FIREWORK_CHANCE = 0.02; // percentage, set to 0 and click instead
    const BASE_PARTICLE_SPEED = 0.6; // between 0-4, controls the size of the overall fireworks
    const FIREWORK_LIFESPAN = 300; // ms
    const PARTICLE_INITIAL_SPEED = 4.5; // 2-8

    // not so fun options =\
    const GRAVITY = 9.8;

    var canvasElement = document.getElementById('fullstarbg');
    var cxt = canvasElement.getContext("2d");
    var windowW = window.screen.width;
    var windowh = window.screen.height;
    canvasElement.width = windowW;
    canvasElement.height = windowh;
    
    // 画烟花
    let particles = [];
    let disableAutoFireworks = false;
    let resetDisable = 0;
    let loop = () => {

        if (!disableAutoFireworks && Math.random() < FIREWORK_CHANCE) {
            createFirework();
        }
        particles.forEach((particle, i) => {
            particle.animate();
            particle.render();
            if (particle.y > canvasElement.height
                || particle.x < 0
                || particle.x > canvasElement.width
                || particle.alpha <= 0
            ) {
                particles.splice(i, 1);
            }
        });

        requestAnimationFrame(loop);

    };
    let createFirework = (
        x = Math.random() * canvasElement.width,
        y = Math.random() * canvasElement.height
    ) => {

        let speed = (Math.random() * 2) + BASE_PARTICLE_SPEED;
        let maxSpeed = speed;

        let red = ~~(Math.random() * 255);
        let green = ~~(Math.random() * 255);
        let blue = ~~(Math.random() * 255);

        // use brighter colours
        red = (red < 150 ? red + 150 : red);
        green = (green < 150 ? green + 150 : green);
        blue = (blue < 150 ? blue + 150 : blue);

        // inner firework
        for (let i = 0; i < PARTICLES_PER_FIREWORK; i++) {
            let particle = new Particle(x, y, red, green, blue, speed);
            particles.push(particle);

            maxSpeed = (speed > maxSpeed ? speed : maxSpeed);
        }

        // outer edge particles to make the firework appear more full
        for (let i = 0; i < 40; i++) {
            let particle = new Particle(x, y, red, green, blue, maxSpeed, true);
            particles.push(particle);
        }

    };
    class Particle {

        constructor(
            x = 0,
            y = 0,
            red = ~~(Math.random() * 255),
            green = ~~(Math.random() * 255),
            blue = ~~(Math.random() * 255),
            speed,
            isFixedSpeed
        ) {

            this.x = x;
            this.y = y;
            this.red = red;
            this.green = green;
            this.blue = blue;
            this.alpha = 0.05;
            this.radius = 1 + Math.random();
            this.angle = Math.random() * 360;
            this.speed = (Math.random() * speed) + 0.1;
            this.velocityX = Math.cos(this.angle) * this.speed;
            this.velocityY = Math.sin(this.angle) * this.speed;
            this.startTime = (new Date()).getTime();
            this.duration = Math.random() * 300 + FIREWORK_LIFESPAN;
            this.currentDiration = 0;
            this.dampening = 30; // slowing factor at the end

            this.colour = this.getColour();

            if (isFixedSpeed) {
                this.speed = speed;
                this.velocityY = Math.sin(this.angle) * this.speed;
                this.velocityX = Math.cos(this.angle) * this.speed;
            }

            this.initialVelocityX = this.velocityX;
            this.initialVelocityY = this.velocityY;

        }

        animate() {

            this.currentDuration = (new Date()).getTime() - this.startTime;

            // initial speed kick
            if (this.currentDuration <= 100) {

                this.x += this.initialVelocityX * PARTICLE_INITIAL_SPEED;
                this.y += this.initialVelocityY * PARTICLE_INITIAL_SPEED;
                this.alpha += 0.01;

                this.colour = this.getColour(240, 240, 240, 0.9);

            } else {

                // normal expansion
                this.x += this.velocityX;
                this.y += this.velocityY;
                this.colour = this.getColour(this.red, this.green, this.blue, 0.4 + (Math.random() * 0.3));

            }

            this.velocityY += GRAVITY / 1000;

            // slow down particles at the end
            if (this.currentDuration >= this.duration) {
                this.velocityX -= this.velocityX / this.dampening;
                this.velocityY -= this.velocityY / this.dampening;
            }

            if (this.currentDuration >= this.duration + this.duration / 1.1) {

                // fade out at the end
                this.alpha -= 0.02;
                this.colour = this.getColour();

            } else {

                // fade in during expansion
                if (this.alpha < 1) {
                    this.alpha += 0.03;
                }

            }
        }

        render() {

            cxt.beginPath();
            cxt.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
            cxt.lineWidth = this.lineWidth;
            cxt.fillStyle = this.colour;
            cxt.shadowBlur = 8;
            cxt.shadowColor = this.getColour(this.red + 150, this.green + 150, this.blue + 150, 1);
            cxt.fill();

        }

        getColour(red, green, blue, alpha) {

            return `rgba(${red || this.red}, ${green || this.green}, ${blue || this.blue}, ${alpha || this.alpha})`;

        }

    }

    //画星星
    var nums = 200;
    var starArr = [];
    for (var i = 0; i < nums; i++) {
        var arrs = ["t", "f"];
        var r = Math.random() * 1;  //生成星星的半径
        var ax = Math.random() * canvasElement.width;
        var ay = Math.random() * canvasElement.height;
        var opactityS = Math.random() * 1;
        opactityS = opactityS > 0.7 ? 0.7 : opactityS;
        var trues = arrs[Math.floor(Math.random() * 2)];

        starArr.push({
            x: ax,
            y: ay,
            R: r,
            initX: ax,
            initY: ay,
            moves: trues,
            initOpacity: opactityS,
            opacity: opactityS
        });
    }
    //流线

    var newLine = true;
    var linesArr = [];
    var conter = 0;
    function createLine() {
        if (newLine == true) {
            var lineNum = Math.ceil(Math.random() * 2);
            //#59576a;
            linesArr = []
            for (var i = 0; i < lineNum; i++) {
                var lx = Math.random() * canvasElement.width;
                var ly = Math.random() * canvasElement.height - Math.random() * 500;
                linesArr.push({
                    initX: lx,
                    initY: 0,
                    length: Math.random() * 50 + 30,
                    speed: Math.random() * 10
                })
            }
            newLine = false;
        }
    }
    //3秒之后让红色的圆形运动
    var redstart = false;
    setTimeout(function () {
        redstart = true;
    }, 3000)
    var yred = -0.25 * canvasElement.width * 0.22;
    var redYlimt = -0.35 * canvasElement.width * 0.22;;
    function draw() {
        cxt.clearRect(0, 0, canvasElement.width, canvasElement.height);
        var colors = cxt.createLinearGradient(0, 0, 0, canvasElement.height);
        colors.addColorStop(0, "#090723");
        colors.addColorStop(0.75, "#090723");
        colors.addColorStop(1, "#08071e")
        cxt.fillStyle = colors; //08071e
        cxt.fillRect(0, 0, canvasElement.width, canvasElement.height)
        //画圆 color r x y
        drawCircle("#f7f4d3", canvasElement.width * 0.12, 0.44 * canvasElement.width, redYlimt, "#fcf6ac");                         //红
        drawCircle("#201620", canvasElement.width * 0.025, 0.95 * canvasElement.width, 0.32 * canvasElement.height);       //灰
        drawCircle("#140c2a", canvasElement.width * 0.01, 0.75 * canvasElement.width, 0.22 * canvasElement.height);        //紫
        drawCircle("#090929", canvasElement.width * 0.018, 0.82 * canvasElement.width, 0.52 * canvasElement.height);       //蓝
        if (redstart == true) {
            redYlimt += 1;
        }
        if (redYlimt > yred) {
            redYlimt = yred;
        }
        //STAR
        for (var i = 0; i < starArr.length; i++) {
            var child = starArr[i];
            cxt.save();
            cxt.globalAlpha = child.opacity;
            cxt.beginPath();
            cxt.fillStyle = "#ffffff";
            cxt.arc(child.initX, child.initY, child.R, 0, Math.PI * 2, false);
            cxt.fill();
            cxt.closePath();
            //移动

            if (child.moves == 't') {
                child.initX -= Math.random() * 1 * 0.12;  //星星移动的速度
                if (child.initX < 0) {
                    child.initX = child.x;
                }
            }
            //透明度
            if (child.opacity < 0.8) {
                child.opacity += 0.005;
                if (child.opacity > 0.7) {
                    child.opacity = child.initOpacity;
                }
            }
            cxt.restore();
        }
        //lines
        createLine();

        for (var i = 0; i < linesArr.length; i++) {
            var child = linesArr[i];
            cxt.save();
            cxt.rotate(0);
            cxt.beginPath();
            cxt.strokeStyle = "#59576a";
            cxt.moveTo(child.initX, child.initY);
            cxt.lineTo(child.initX - Math.cos(Math.PI / 180 * 45) * child.length, child.initY + Math.sin(Math.PI / 180 * 45) * child.length);
            cxt.stroke();
            cxt.restore();
            child.speed += 0.1;
            var preX = Math.cos(Math.PI / 180 * 45) * child.speed;
            var preY = Math.sin(Math.PI / 180 * 45) * child.speed;
            child.initX = child.initX - preX;
            child.initY = child.initY + preY;
            if (child.initX < 0 || child.initY > canvasElement.height) {
                conter = i + 1;
            }
            if (conter == linesArr.length) {
                conter = 0;
                newLine = true;


            }

        }
    }
    draw();
    loop();
    setInterval(draw, 20);
    function drawCircle(color, R, x, y, color2) {
        cxt.beginPath();
        if (color2) {
            var gradient2 = cxt.createRadialGradient(x, y, R / 2, x, y, R);
            gradient2.addColorStop(0, color);
            gradient2.addColorStop(0.5, color);
            gradient2.addColorStop(1, color2);
            cxt.fillStyle = gradient2;
        } else {
            cxt.fillStyle = color;
        }

        var r = R;
        cxt.arc(x, y, R, 0, Math.PI * 2, false);
        cxt.fill();
        cxt.closePath();
    }

}