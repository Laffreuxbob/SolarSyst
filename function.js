/* function clearTest(r, x, y) {
           ctx.beginPath();
           ctx.rect(0, 0, 400, 400);
           ctx.fillStyle = "red";
           ctx.fill();
           ctx.closePath();

           console.log("clearGraph");
           ctx.beginPath();
           ctx.clearRect(x - r - 1, y - r - 1, r * 2 + 2, r * 2 + 2);
           ctx.closePath();
       }
   */

/*  function test() {
      let liste = [];
      for (let i = 0; i < 5; i++) {
          let planete = new Astre(20 + i * 50, 20, 20, "green");
          liste.push(planete);
      }
      console.log(liste);

      for (let i = 0; i < 40; i++) {

      }
  }*/


/* setStyle() {
     let style = {'line': false, 'traj': false};
     Astre.getColorType();
     if (Astre.getColorType() === "line") {
         style['line'] = true;
     } else if (Astre.getColorType() === "traj") {
         style['traj'] = true;
     } else {
         if (!this.sun) {
             style = {'line': false, 'traj': false};
         }
     }
     return style;
 }*/
/*
static getColorType() {
    let colortype = document.getElementsByName('color');
    let infoColor = document.getElementById("colorType");
    infoColor.innerHTML = "Couleur fixe.";
    for (let c = 1; c < colortype.length; c++) {
        if (colortype[c].checked) {
            infoColor.innerHTML = "Couleur en fonction de la " + colortype[c]['value'] + ".";
            return (colortype[c]['value']);
        }
    }
}
*/
/*static getColorType() {
    let styletype = document.getElementsByName('style');
    let infostyle = document.getElementById("styleType");
    infostyle.innerHTML = "Aucun style";
    for (let s = 1; s < styletype.length; s++) {
        if (styletype[s].checked) {
            infostyle.innerHTML = "Style : " + styletype[s]['value'] + ".";
            return (styletype[s]['value']);
        }
    }
}
*/
function setColorPosition() {
    if (!this.sun) {
        this.color = "rgb(" + (this.x / graphW) * 240 + 20 + "," + (Math.sqrt(this.x ** 2 + this.y ** 2) / graphH) * 255 + "," + (this.x / graphH) * 240 + 20 + ")";
    }
}
function setColorVelocity() {
    if (!this.sun) {
        if ((Math.sqrt(this.vx ** 2 + this.vy ** 2) / 2) > 15) {
            this.color = "red";
        } else {
            this.color = "blue";
        }
    }
}