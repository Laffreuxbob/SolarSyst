// Element canva de base
let c1;
c1 = document.getElementById("myCanvasGraph");
let graphCtx = c1.getContext("2d");

let c2;
c2 = document.getElementById("myCanvasStats");
let statCtx = c2.getContext("2d");

// Constantes pour l'init des coordonnées
let graphH = c1.height;
let graphW = c1.width;

let statH = c2.height;
let statW = c2.width;
console.log(statW);
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
    graphCtx.clearRect(0, 0, graphW, graphH);
}

function clearStats(){
    statCtx.clearRect(0,0,graphW,graphH)
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

    draw(doc1, doc2, index=2, total) { // Beginpath et stroke sont dans drawL
        if (document.getElementById('styleLine').checked) {
            doc1.strokeStyle = 'grey';
            doc1.moveTo(graphW / 2, graphH / 2);
            doc1.lineTo(this.x, this.y);
            doc1.stroke();
        }
        this.setColor();
        doc1.beginPath();
        doc1.arc(this.x, this.y, this.r , 0, 2 * Math.PI);
        doc1.fillStyle = this.color;
        doc1.fill();


        if(!this.sun){
            let vit = (Math.sqrt(this.vx ** 2 + this.vy ** 2) / 2);
            let v = vit.toFixed(4);
            doc2.beginPath();
            doc2.strokeStyle = 'grey';
            doc2.moveTo(200, 390 );
            doc2.lineTo(200, 400 - vit*4);
            let info = "p"+index;
            doc2.fillText(v,(statW/total)*index,statH - statH/15);
            doc2.fillText(info,(statW/total)*index,vit*4);

            doc2.moveTo((statW/total)*index,statH - statH/15);
            doc2.lineTo((statW/total)*index,vit*4);

            doc2.stroke();
        }

    }
    setColor() {
        this.color = "blue";
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
        console.log(graphH);
        console.log(graphW);
        this.color = "rgb(" + (this.x / graphW) * 255 + "," + (Math.sqrt(this.x ** 2 + this.y ** 2) / Math.sqrt(graphH ** 2 + graphW ** 2)) * 255 + "," + (this.y / graphH) * 255 + ")";
        this.color = "rgb(" + Math.abs(Math.sin(this.x)) * 255 + "," + Math.abs(Math.sin(Math.sqrt(this.x ** 2 + this.y ** 2))) + "," + Math.abs(Math.sin(this.y)) * 255+ ")";
        console.log(this.color);
    }

    setColorVitesse() {
        let vTot = Math.sqrt(this.vx ** 2 + this.vy ** 2) / 2;
        if (vTot > 80) {
            this.color = 'red';
        } else if (vTot > 50) {
            this.color = "orange";
        } else if (vTot > 30) {
            this.color = "yellow";
        }
    }

    force(sun) {
        let G = 20000;  // Constante gravitationnelle 6.67 E-11  m3 kg-1 s-2
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


            if(!document.getElementById('cadre').checked){
                this.x = cadre(this.x, graphW-1);
                this.y = cadre(this.y, graphH-1);
            }


            this.vx = this.vx + ax * dt;
            this.vy = this.vy + ay * dt;

/*
            console.log(("vy : " + this.vy + " -- vx : " + this.vx));
*/

            clearStats();


            return((Math.sqrt(this.vx ** 2 + this.vy ** 2) / 2));

        }

    }

    static getVitesse() {
        return [, this.vx, this.vy];
    }
}

class ListeAstres {
    constructor(len) {
        this.len = len;
        this.listeInit = [];
    }

    init() {
        let dist = graphH / (2 * this.len);
        this.listeInit[0] = new Astre(true, graphW / 2, graphH / 2, 0, 0, 10, "yellow");
        for (let i = 1; i < this.len; i++) {
            let v = (20 - i) * (-1) ** i;
            this.listeInit.push(new Astre(false, graphW / 2, graphH / 2 + i * dist, v, v, 4, 'blue'));
        }
    }

    moveL() {
        let sun = this.listeInit[0];
        for (let i = 0; i < this.listeInit.length; i++) {
            this.listeInit[i].move(sun);
        }
    }

    drawL() {

        let nb= this.listeInit.length;
        if (!document.getElementById("styleTrajectoire").checked) {
            clear();
        }
        for (let p = 0; p < nb; p++) {
            let planete = this.listeInit[p];
            /*
                            planete.setColorPosition();
            */
            graphCtx.beginPath();
            planete.draw(graphCtx, statCtx, p, nb);
            graphCtx.stroke();
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



