var canvas = document.getElementById("miCanvas");
var ctx = canvas.getContext("2d");

var radioPelota = 10;
var x = canvas.width / 2;
var y = canvas.height / 2;
var dx = 5;
var dy = 5;

var raquetaAncho = 10, raquetaAlto = 100;
var velocidadRaqueta = 7;
var puntajeDePadel = [0, 15, 30, 40];
var jugadorIzquierda = {
    x: 0,
    y: canvas.height / 2 - raquetaAlto / 2,
    color: "orange",
    puntaje: 0,
    juegos: 0,
    arriba: false,
    abajo: false
};
var jugadorDerecha = {
    x: canvas.width - raquetaAncho,
    y: canvas.height / 2 - raquetaAlto / 2,
    color: "blue",
    puntaje: 0,
    juegos: 0,
    arriba: false,
    abajo: false
};

var anchoLadrillo = 75;
var altoLadrillo = 20;
var ladrillos = [];
var lineas = [
    canvas.width / 4,
    canvas.width / 2,
    (canvas.width / 4) * 3
];

lineas.forEach(function(lineX) {
    for (var y = altoLadrillo; y < canvas.height; y += altoLadrillo * 2) {
        ladrillos.push({ x: lineX - anchoLadrillo / 2, y: y, status: 1 });
    }
});

var puntuacionIzquierda = document.getElementById('puntuacionIzquierda');
var puntuacionDerecha = document.getElementById('puntuacionDerecha');
var juegosIzquierda = document.getElementById('juegosIzquierda');
var juegosDerecha = document.getElementById('juegosDerecha');
var mensajeVictoria = document.getElementById('mensajeVictoria');

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var fondo = new Image();
fondo.src = 'images/canchapadel.jpg';

function keyDownHandler(e) {
    if (e.key == "w") {
        jugadorIzquierda.arriba = true;
    } else if (e.key == "s") {
        jugadorIzquierda.abajo = true;
    }
    if (e.key == "ArrowUp") {
        jugadorDerecha.arriba = true;
    } else if (e.key == "ArrowDown") {
        jugadorDerecha.abajo = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "w") {
        jugadorIzquierda.arriba = false;
    } else if (e.key == "s") {
        jugadorIzquierda.abajo = false;
    }
    if (e.key == "ArrowUp") {
        jugadorDerecha.arriba = false;
    } else if (e.key == "ArrowDown") {
        jugadorDerecha.abajo = false;
    }
}

function deteccionColision() {
    ladrillos.forEach(function(ladrillo) {
        if (ladrillo.status == 1) {
            if (x > ladrillo.x && x < ladrillo.x + anchoLadrillo && y > ladrillo.y && y < ladrillo.y + altoLadrillo) {
                dy = -dy;
                ladrillo.status = 0;
            }
        }
    });
}

function dibujarPelota() {
    ctx.beginPath();
    ctx.arc(x, y, radioPelota, 0, Math.PI * 2);
    ctx.fillStyle = "#ccff00";
    ctx.fill();
    ctx.closePath();
}

function dibujarRaqueta(jugador) {
    ctx.beginPath();
    ctx.rect(jugador.x, jugador.y, raquetaAncho, raquetaAlto);
    ctx.fillStyle = jugador.color;
    ctx.fill();
    ctx.closePath();
}

function dibujarLadrillos() {
    ladrillos.forEach(function(ladrillo) {
        if (ladrillo.status == 1) {
            ctx.beginPath();
            ctx.rect(ladrillo.x, ladrillo.y, anchoLadrillo, altoLadrillo);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.closePath();
        }
    });
}

function dibujarRed() {
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
}

function moverRaquetas() {
    if (jugadorIzquierda.arriba && jugadorIzquierda.y > 0) {
        jugadorIzquierda.y -= velocidadRaqueta;
    }
    if (jugadorIzquierda.abajo && jugadorIzquierda.y < canvas.height - raquetaAlto) {
        jugadorIzquierda.y += velocidadRaqueta;
    }
    if (jugadorDerecha.arriba && jugadorDerecha.y > 0) {
        jugadorDerecha.y -= velocidadRaqueta;
    }
    if (jugadorDerecha.abajo && jugadorDerecha.y < canvas.height - raquetaAlto) {
        jugadorDerecha.y += velocidadRaqueta;
    }
}

function dibujar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);

    dibujarRed();
    dibujarLadrillos();
    dibujarPelota();
    dibujarRaqueta(jugadorIzquierda);
    dibujarRaqueta(jugadorDerecha);
    actualizarPuntuacion();
    deteccionColision();

    if (x + dx > canvas.width - radioPelota) {
        if (y > jugadorDerecha.y && y < jugadorDerecha.y + raquetaAlto) {
            dx = -dx;
        } else {
            actualizarPuntaje(jugadorIzquierda);
            resetearPelota();
        }
    } else if (x + dx < radioPelota) {
        if (y > jugadorIzquierda.y && y < jugadorIzquierda.y + raquetaAlto) {
            dx = -dx;
        } else {
            actualizarPuntaje(jugadorDerecha);
            resetearPelota();
        }
    }

    if (y + dy > canvas.height - radioPelota || y + dy < radioPelota) {
        dy = -dy;
    }

    moverRaquetas();

    x += dx;
    y += dy;
    animationFrameId = requestAnimationFrame(dibujar);
}

function actualizarPuntaje(jugador) {
    if (jugador.puntaje === 40) {
        if (jugador === jugadorIzquierda && jugadorDerecha.puntaje === 40) {
            if (jugador.puntaje === 'AD') {
                jugador.juegos++;
                resetearPuntajes();
                comprobarVictoria(jugador);
            } else {
                jugador.puntaje = 'AD';
            }
        } else {
            jugador.juegos++;
            resetearPuntajes();
            comprobarVictoria(jugador);
        }
    } else {
        jugador.puntaje = puntajeDePadel[puntajeDePadel.indexOf(jugador.puntaje) + 1];
    }
}

function resetearPuntajes() {
    jugadorIzquierda.puntaje = 0;
    jugadorDerecha.puntaje = 0;
}

function actualizarPuntuacion() {
    puntuacionIzquierda.innerText = "Puntos: " + (jugadorIzquierda.puntaje === 0 ? "0" : jugadorIzquierda.puntaje);
    puntuacionDerecha.innerText = "Puntos: " + (jugadorDerecha.puntaje === 0 ? "0" : jugadorDerecha.puntaje);
    juegosIzquierda.innerText = "Juegos: " + jugadorIzquierda.juegos;
    juegosDerecha.innerText = "Juegos: " + jugadorDerecha.juegos;
}

function resetearPelota() {
    x = canvas.width / 2;
    y = canvas.height / 2;
    dx = -dx;
}

function comprobarVictoria(jugador) {
    if (jugador.juegos >= 6) {
        mensajeVictoria.style.display = 'block';
        cancelAnimationFrame(animationFrameId);
    }
}

var animationFrameId;
fondo.onload = function() {
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);

        dibujarRed();
        dibujarLadrillos();
        dibujarPelota();
        dibujarRaqueta(jugadorIzquierda);
        dibujarRaqueta(jugadorDerecha);
        actualizarPuntuacion();
        deteccionColision();

        if (x + dx > canvas.width - radioPelota) {
            if (y > jugadorDerecha.y && y < jugadorDerecha.y + raquetaAlto) {
                dx = -dx;
            } else {
                actualizarPuntaje(jugadorIzquierda);
                resetearPelota();
            }
        } else if (x + dx < radioPelota) {
            if (y > jugadorIzquierda.y && y < jugadorIzquierda.y + raquetaAlto) {
                dx = -dx;
            } else {
                actualizarPuntaje(jugadorDerecha);
                resetearPelota();
            }
        }

        if (y + dy > canvas.height - radioPelota || y + dy < radioPelota) {
            dy = -dy;
        }

        moverRaquetas();

        x += dx;
        y += dy;
        animationFrameId = requestAnimationFrame(draw);
    }
    draw();
};