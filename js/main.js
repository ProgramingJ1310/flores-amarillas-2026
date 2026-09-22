const canvas = document.getElementById("galaxy");
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const soundButton = document.getElementById("sound-button");
const audio = document.getElementById("audio");
const fallback = document.getElementById("fallback");

const phrases = [
    "🌻 Como el girasol, miro hacia ti",
    "🌼 Gracias por ser mi sol de siempre",
    "🌻 Contigo hasta lo simple brilla",
    "🌼 Hoy el amarillo lleva tu nombre",
    "🌻 Esta flor te recuerda cuánto vales",
    "🌼 Tu amistad, mi lugar favorito",
    "🌻 21 de septiembre, contigo siempre",
    "🌼 Un girasol para quien ilumina",
    "🌻 Gracias por quedarte siempre",
    "🌼 Contigo el día pesa menos",
    "🌻 Un gracias que no necesita fecha",
    "🌼 Tu risa le hace bien a mis días",
    "🌻 Hoy celebro tenerte cerca",
    "🌼 Apareces cuando más hace falta",
    "🌻 Pétalos dorados solo para ti",
    "🌼 Feliz día, pienso en ti con cariño",
    "🌻 Contigo todo lugar es bonito",
    "🌼 Un ramo de gracias por estar ahí",
    "🌻 Que esta flor te alcance hoy",
    "🌼 Miras lo bueno, como el girasol",
    "🌻 El campo entero te manda saludos",
    "🌼 Tu cariño no pasa de moda",
    "🌻 Contigo las tardes se hacen cortas",
    "🌼 Esta flor guarda un abrazo para ti",
    "🌻 No necesito un motivo para quererte",
    "🌼 Quiero que sepas cuánto importas",
    "🌻 El amarillo también dice te quiero",
    "🌼 Gracias por sumar luz a mis días",
    "🌻 Aquí siempre tienes un lugar",
    "🌼 Feliz día, contigo todo es mejor",
    "🌻 Eres una razón para sonreír",
    "🌼 Tu presencia convierte lo simple en especial",
    "🌻 Que nunca te falte un motivo para florecer",
    "🌼 Gracias por hacer más bonitos mis días",
    "🌻 Tu luz también ilumina mi camino",
    "🌼 Un detalle amarillo para alguien especial",
    "🌻 Ojalá recibas todo el cariño que das",
    "🌼 Qué bonito coincidir contigo",
    "🌻 Tu corazón merece un jardín entero",
    "🌼 Siempre hay una flor pensando en ti",
    "🌻 Gracias por ser parte de mi historia",
    "🌼 Hoy el sol brilla un poquito más por ti",
    "🌻 Que esta galaxia te recuerde cuánto vales",
    "🌼 Tu forma de ser deja huellas bonitas",
    "🌻 Eres ese rayito de luz que alegra todo",
    "🌼 Cada momento contigo guarda algo especial",
    "🌻 Tu sonrisa tiene su propio amanecer",
    "🌼 Qué suerte tenerte en mis días",
    "🌻 Tu nobleza hace florecer cualquier lugar",
    "🌼 Hay personas que son hogar, como tú",
    "🌻 Tu manera de querer vale oro",
    "🌼 Gracias por llenar de calma mis momentos",
    "🌻 Tu compañía es mi pequeño milagro",
    "🌼 Donde estás tú, siempre nace algo bonito",
    "🌻 Eres una historia que me gusta celebrar",
    "🌼 Tu energía hace bailar hasta las estrellas",
    "🌻 El mundo se siente más cálido contigo",
    "🌼 Tu corazón tiene colores de primavera",
    "🌻 Qué bonito es compartir esta vida contigo",
    "🌼 Tu presencia es un regalo inesperado",
    "🌻 Hay abrazos que comienzan con una sonrisa tuya",
    "🌼 Tu cariño convierte cualquier día en fiesta",
    "🌻 Eres luz incluso en los días nublados",
    "🌼 Las cosas buenas también llevan tu nombre",
    "🌻 Tu amistad es un jardín que siempre florece",
    "🌼 Me alegra que nuestros caminos se encontraran",
    "🌻 Tu ternura hace más dulce cada recuerdo",
    "🌼 Eres de esas personas que hacen bien",
    "🌻 Tu alegría ilumina más que mil luceros",
    "🌼 Gracias por cada instante compartido",
    "🌻 Que la vida te devuelva todo lo bonito que das"
];

const photoUrls = [
    "css/assets/img1.png",
    "css/assets/img2.png",
    "css/assets/img3.png"
];

let renderer;
let scene;
let camera;
let ring;
let glow;
let core;
let textGroup;
let photoGroup;
let animationFrame;
let targetDistance = 300;
let currentDistance = 300;
let rotationX = .2;
let rotationY = 0;
let dragging = false;
let lastPoint = { x: 0, y: 0 };
let pinchDistance = 0;
let started = false;

function makeGlow() {
    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = textureCanvas.height = 512;
    const context = textureCanvas.getContext("2d");
    const gradient = context.createRadialGradient(256, 256, 20, 256, 256, 256);
    gradient.addColorStop(0, "rgba(255,235,130,.55)");
    gradient.addColorStop(.5, "rgba(255,180,0,.25)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 512);
    return new THREE.CanvasTexture(textureCanvas);
}

function makeRingTexture() {
    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = textureCanvas.height = 1024;
    const context = textureCanvas.getContext("2d");
    context.translate(512, 512);
    const gradient = context.createRadialGradient(0, 0, 210, 0, 0, 500);
    gradient.addColorStop(0, "rgba(255,255,245,1)");
    gradient.addColorStop(.3, "rgba(255,235,120,1)");
    gradient.addColorStop(.65, "rgba(255,200,40,.95)");
    gradient.addColorStop(1, "rgba(255,160,0,.85)");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(0, 0, 500, 0, Math.PI * 2);
    context.arc(0, 0, 210, 0, Math.PI * 2, true);
    context.fill();

    // Franjas finas para dar al anillo una textura más parecida a Saturno.
    for (let index = 0; index < 34; index += 1) {
        const radius = 215 + (285 * index / 33);
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.lineWidth = 3 + (index % 4 === 0 ? 2 : 0);
        context.strokeStyle = index % 3 === 0
            ? "rgba(120, 68, 0, .22)"
            : "rgba(255, 255, 220, .2)";
        context.stroke();
    }

    return new THREE.CanvasTexture(textureCanvas);
}

function makeTextSprite(text, color) {
    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 512;
    textureCanvas.height = 128;
    const context = textureCanvas.getContext("2d");
    let fontSize = 56;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.shadowColor = color;
    context.shadowBlur = 28;
    do {
        context.font = `${fontSize}px "Indie Flower", cursive`;
        fontSize -= 2;
    } while (context.measureText(text).width > 464 && fontSize > 24);
    context.fillStyle = "#fff";
    context.fillText(text, 256, 64);
    return new THREE.CanvasTexture(textureCanvas);
}

function addStars() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(1400 * 3);
    for (let index = 0; index < 1400; index += 1) {
        const radius = 3000 * (.3 + Math.random() * .7);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[index * 3 + 1] = radius * Math.cos(phi);
        positions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    scene.add(new THREE.Points(geometry, new THREE.PointsMaterial({
        size: 1.5,
        color: 0xffffff,
        depthWrite: false
    })));
}

function createScene() {
    if (!window.THREE) {
        fallback.hidden = false;
        return false;
    }
    try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        renderer.setSize(window.innerWidth, window.innerHeight);
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, .1, 5000);
        addStars();

        core = new THREE.Mesh(
            new THREE.SphereGeometry(40, 48, 48),
            new THREE.MeshPhongMaterial({ color: 0x030303, shininess: 30 })
        );
        scene.add(core);

        glow = new THREE.Sprite(new THREE.SpriteMaterial({
            map: makeGlow(), transparent: true, depthWrite: false
        }));
        glow.scale.set(360, 360, 1);
        scene.add(glow);

        ring = new THREE.Mesh(
            new THREE.RingGeometry(42, 116, 128),
            new THREE.MeshBasicMaterial({
                map: makeRingTexture(), transparent: true,
                side: THREE.DoubleSide, blending: THREE.AdditiveBlending
            })
        );
        ring.rotation.x = Math.PI / 2;
        scene.add(ring);

        textGroup = new THREE.Group();
        photoGroup = new THREE.Group();
        scene.add(textGroup, photoGroup);

        phrases.forEach((phrase, index) => {
            const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
                map: makeTextSprite(phrase, ["#ffd700", "#ffe066", "#ffb347"][index % 3]),
                transparent: true
            }));
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = Math.random() * Math.PI * 2;
            const radius = 155 + Math.random() * 115;
            sprite.scale.set(68, 21.8, 1);
            sprite.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.cos(phi),
                radius * Math.sin(phi) * Math.sin(theta)
            );
            sprite.userData = { phi, theta, radius, speed: .0008 + Math.random() * .001 };
            textGroup.add(sprite);
        });

        const floatingBouquets = 18;
        for (let index = 0; index < floatingBouquets; index += 1) {
            const url = photoUrls[index % photoUrls.length];
            const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true }));
            const image = new Image();
            image.crossOrigin = "anonymous";
            image.onload = () => {
                const imageCanvas = document.createElement("canvas");
                imageCanvas.width = imageCanvas.height = 256;
                const context = imageCanvas.getContext("2d");
                const scale = Math.min(256 / image.naturalWidth, 256 / image.naturalHeight);
                context.drawImage(image, (256 - image.naturalWidth * scale) / 2,
                    (256 - image.naturalHeight * scale) / 2,
                    image.naturalWidth * scale, image.naturalHeight * scale);
                sprite.material.map = new THREE.CanvasTexture(imageCanvas);
                sprite.material.needsUpdate = true;
            };
            image.src = url;
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = Math.random() * Math.PI * 2;
            const radius = 165 + Math.random() * 150;
            const size = 24 + Math.random() * 20;
            sprite.scale.set(size, size, 1);
            sprite.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.cos(phi),
                radius * Math.sin(phi) * Math.sin(theta)
            );
            sprite.userData = {
                phi,
                theta,
                radius,
                speed: .0007 + Math.random() * .001
            };
            photoGroup.add(sprite);
        }
        return true;
    } catch (error) {
        console.error("No se pudo crear la escena 3D:", error);
        fallback.hidden = false;
        return false;
    }
}

function animate(time = 0) {
    animationFrame = requestAnimationFrame(animate);
    if (!renderer || document.hidden) return;
    const seconds = time * .001;
    ring.rotation.z += .003;
    const glowScale = 360 * (1 + Math.sin(seconds * .4) * .03);
    glow.scale.set(glowScale, glowScale, 1);
    const pulse = 1 + .05 * Math.sin(seconds * 3);
    core.scale.set(pulse, pulse, pulse);
    [textGroup, photoGroup].forEach((group) => {
        group.children.forEach((sprite) => {
            const data = sprite.userData;
            data.theta += data.speed;
            sprite.position.x = data.radius * Math.sin(data.phi) * Math.cos(data.theta);
            sprite.position.z = data.radius * Math.sin(data.phi) * Math.sin(data.theta);
            sprite.material.opacity = .82 + .18 * Math.sin(seconds * 2 + data.radius);
        });
    });
    currentDistance += (targetDistance - currentDistance) * .06;
    const cosX = Math.cos(rotationX);
    camera.position.set(
        currentDistance * Math.sin(rotationY) * cosX,
        currentDistance * Math.sin(rotationX),
        currentDistance * Math.cos(rotationY) * cosX
    );
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
}

function resize() {
    if (!renderer || !camera) return;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

function updatePointer(point) {
    if (!dragging) return;
    rotationY -= ((point.x - lastPoint.x) / window.innerWidth) * 5;
    rotationX = Math.max(-1.2, Math.min(1.2,
        rotationX + ((point.y - lastPoint.y) / window.innerHeight) * 3.5));
    lastPoint = point;
}

function startExperience() {
    if (started) return;
    started = true;
    startScreen.classList.add("hidden");
    soundButton.hidden = false;
    audio.play().then(() => {
        soundButton.textContent = "🔊";
        soundButton.setAttribute("aria-pressed", "true");
        soundButton.setAttribute("aria-label", "Silenciar música");
    }).catch(() => {
        soundButton.textContent = "🔇";
    });
}

startButton.addEventListener("click", startExperience);
soundButton.addEventListener("click", () => {
    if (audio.paused) {
        audio.play().then(() => {
            soundButton.textContent = "🔊";
            soundButton.setAttribute("aria-pressed", "true");
            soundButton.setAttribute("aria-label", "Silenciar música");
        }).catch(() => {});
    } else {
        audio.pause();
        soundButton.textContent = "🔇";
        soundButton.setAttribute("aria-pressed", "false");
        soundButton.setAttribute("aria-label", "Activar música");
    }
});

canvas.addEventListener("pointerdown", (event) => {
    dragging = true;
    lastPoint = { x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
});
canvas.addEventListener("pointermove", (event) => updatePointer({ x: event.clientX, y: event.clientY }));
canvas.addEventListener("pointerup", () => { dragging = false; });
canvas.addEventListener("pointercancel", () => { dragging = false; });
canvas.addEventListener("wheel", (event) => {
    targetDistance = Math.max(160, Math.min(600, targetDistance + event.deltaY * .25));
}, { passive: true });
canvas.addEventListener("touchmove", (event) => {
    if (event.touches.length !== 2) return;
    event.preventDefault();
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    const distance = Math.hypot(dx, dy);
    if (pinchDistance) targetDistance = Math.max(160, Math.min(600, targetDistance + (pinchDistance - distance) * .5));
    pinchDistance = distance;
}, { passive: false });
canvas.addEventListener("touchend", () => { pinchDistance = 0; }, { passive: true });
window.addEventListener("resize", resize);
document.addEventListener("visibilitychange", () => {
    if (!document.hidden && started && !animationFrame) animate();
});

if (createScene()) animate();
