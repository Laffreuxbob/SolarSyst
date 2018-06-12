
// Element canva de base
let c1;
c1 = document.getElementById("myCanvasGraph");
let ctx1 = c1.getContext("2d");
// Constantes pour l'init des coordonnées
let H = c1.height;
let W = c1.width;
// Auto play
let auto;

//Fonction mère
function start() {
    auto = true;
    clear();
    let liste;
    let nb = document.getElementById("nb").value;
    if (nb <= 0) {
        nb = 2;
    }
    liste = new ListeAstres(nb);
    liste.init();
    play(liste, auto);
}

function stop() {
    auto = false;
    clear();
}

function getStyleType() {
    let getColorType = document.getElementsByName('Color');
    let divInfoColor = document.getElementById("colorType");
    divInfoColor.innerHTML = "Couleur fixe";
    for (let s = 1; s < getColorType.length; s++) {
        if (getColorType[s].checked) {
            divInfoColor.innerHTML = "Couleur : " + getColorType[s]['value'] + ".";
            return (getColorType[s]['value']);
        }
    }
}

function play(listeP, auto) {
    if (auto) {
        clear();
        setInterval(function () {
            listeP.moveL();
            if (!document.getElementById("styleTrajectoire").checked) {
                clear();
            }
            listeP.drawL();
            getStyleType();
        }, 30);
    }
}

//Clear ctx
function clear() {
    ctx1.clearRect(0, 0, W, H);
}

class Astre {
    constructor(sun, x, y, vx, vy, r, color) {
        this.sun = sun;
        this.x = x;
        this.y = y;

        this.vx = vx;
        this.vy = vy;

        this.r = r;
        this.color = color;
    }

    draw(doc) { // Beginpath et stroke sont dans drawL
        if (document.getElementById('styleLine').checked) {
            doc.strokeStyle = 'grey';
            doc.moveTo(W / 2, H / 2);
            doc.lineTo(this.x, this.y);
            doc.stroke();
        }
        this.setColor();
        doc.beginPath();
        doc.arc(this.x, this.y, this.r / 10, 0, 2 * Math.PI);
        doc.fillStyle = this.color;
        doc.fill();
    }

    setColor() {
        if (this.sun) {
            this.color = "yellow"
        } else {
            if (document.getElementById('colorPosition').checked) {
                this.setColorPosition();
            }
            else if (document.getElementById('colorVitesse').checked) {
                this.setColorVitesse();
            }


        }
    }

    setColorPosition() {
        console.log(H);
        console.log(W);
        this.color = "rgb(" + (this.x / W) * 255 + "," + (Math.sqrt(this.x ** 2 + this.y ** 2) / Math.sqrt(H ** 2 + W ** 2)) * 255 + "," + (this.y / H) * 255 + ")";
        this.color = "rgb(" + Math.abs(Math.sin(this.x)) * 255 + "," + Math.abs(Math.sin(Math.sqrt(this.x ** 2 + this.y ** 2))) + "," + Math.abs(Math.sin(this.y)) * 255;
        console.log(this.color);
    }

    setColorVitesse() {
        if (Math.sqrt(this.vx ** 2 + this.vy ** 2) < 50) {
            this.color = 'green';
        }
    }

    force(sun) {
        let G = 600;  // Constante gravitationnelle 6.67 E-11  m3 kg-1 s-2
        let dist = Math.sqrt((sun.x - this.x) ** 2 + (sun.y - this.y) ** 2);
        let coef = (G * this.r / 10 * sun.r / 10) / (dist ** 3);  // (G * mA * mB) / d3
        return [coef * (sun.x - this.x), coef * (sun.y - this.y)];
    }

    move(sun) {
        if (!this.sun) {
            let dt = 0.1;

            let force = this.force(sun);

            let ax = force[0];
            let ay = force[1];

            this.x = this.x + this.vx * dt + ax * dt * dt * (1 / 2);
            this.y = this.y + this.vy * dt + ay * dt * dt * (1 / 2);

            this.x = cadre(this.x, W);
            this.y = cadre(this.y, H);

            this.vx = this.vx + ax * dt;
            this.vy = this.vy + ay * dt;
        }
    }
}

class ListeAstres {
    constructor(len) {
        this.len = len;
        this.listeInit = [];
    }

    init() {
        let dist = H / (2 * this.len);
        this.listeInit[0] = new Astre(true, W / 2, H / 2, 0, 0, 100, "yellow");
        for (let i = 1; i < this.len; i++) {
            let v = (20 - i) * (-1) ** i;
            this.listeInit.push(new Astre(false, W / 2, H / 2 + i * dist, v, v, 40, 'blue'));
        }
    }

    moveL() {
        let sun = this.listeInit[0];
        for (let i = 0; i < this.listeInit.length; i++) {
            this.listeInit[i].move(sun);
        }
    }

    drawL() {
        if (!document.getElementById("styleTrajectoire").checked) {
            clear();
        }
        for (let p = 0; p < this.listeInit.length; p++) {
            let planete = this.listeInit[p];
            /*
                            planete.setColorPosition();
            */
            ctx1.beginPath();
            planete.draw(ctx1);
            ctx1.stroke();
        }
    }
}

function cadre(t, Max) {
    if (t > Max) {
        t = 0;
    } else if (t < 0) {
        t = Max;
    }
    return t;
}

let c2;
c2 = document.getElementById("myCanvasStats");
let ctx2 = c2.getContext("2d");

ctx2.beginPath();

ctx2.arc(5, 5, 5, 0, 2 * Math.PI);

ctx2.fillStyle = "green";
ctx2.fill();
ctx2.stroke();
