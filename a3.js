/////////////////////////////////////////////////////////////////////////////////////////
//  UBC CPSC 314,  Vsep2018
//  Assignment 3 Template
/////////////////////////////////////////////////////////////////////////////////////////

console.log('hello world');
// a=5;
// b=2.6;
// console.log('a=',a,'b=',b);
// myvector = new THREE.Vector3(0,1,2);
// console.log('myvector =',myvector);

var animation = true;

var wave = false, dance0 = false, dance1 = false;

var myboxMotion = new Motion(myboxSetMatrices,true);
var handMotion = new Motion(handSetMatrices,true);
var alienStartPosition = new Motion(alienSetMatrices,true);
var alienWaveMotion = new Motion(alienSetMatrices,false);
var alienDance0 = new Motion(alienSetMatrices, false);
var alienDance1 = new Motion(alienSetMatrices, false);

var alienHead, alienNeck, alienShoulders,
alienTorso0, alienTorso1, alienTorso2, alienHip0, alienHip1,
alienJoint0, alienJoint1, alienJoint2, alienJoint3,
alienJoint4, alienJoint5, alienJoint6, alienJoint7,
alienLeg0, alienLeg1, alienLeg2, alienLeg3,
alienFoot0, alienFoot1,
alienArm0, alienArm1, alienArm2, alienArm3,
alienHand0, alienHand1;


var link1, link2, link3, link4, link5;
var linkFrame1, linkFrame2, linkFrame3, linkFrame4, linkFrame5;
var meshes = {};
var RESOURCES_LOADED = false;

// SETUP RENDERER & SCENE

var canvas = document.getElementById('canvas');
var camera;
var light;
var ambientLight;
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setClearColor(0x000000, 0.0);
canvas.appendChild(renderer.domElement);

//////////////////////////////////////////////////////////
//  initCamera():   SETUP CAMERA
//////////////////////////////////////////////////////////
function initCamera() {

    var cameraFov = 30;     // initial camera vertical field of view, in degrees

    // set up M_proj    (internally:  camera.projectionMatrix )
    camera = new THREE.PerspectiveCamera(cameraFov,1,0.1,1000);
      // view angle, aspect ratio, near, far

    // set up M_view:   (internally:  camera.matrixWorldInverse )
    camera.position.set(0,12,20);
    camera.up = new THREE.Vector3(0,1,0);
    camera.lookAt(0,0,0);
    scene.add(camera);

      // SETUP ORBIT CONTROLS OF THE CAMERA
    var controls = new THREE.OrbitControls(camera);
    controls.damping = 0.2;
    controls.autoRotate = false;
};

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
     window.scrollTo(0,0);
}

////////////////////////////////////////////////////////////////////////
// init():  setup up scene
////////////////////////////////////////////////////////////////////////

function init() {
    console.log('init called');

    initCamera();
    initMotions();
    initLights();
    initObjects();
    //initHand();
    initAlien();
    initFileObjects();

    window.addEventListener('resize',resize);
    resize();
};

////////////////////////////////////////////////////////////////////////
// initMotions():  setup Motion instances for each object that we wish to animate
////////////////////////////////////////////////////////////////////////

function initMotions() {
      // keyframes for the mybox animated motion:   name, time, [x, y, z]
    myboxMotion.addKeyFrame(new Keyframe('rest pose',0.0, [-4, 4.9,-3]));
    myboxMotion.addKeyFrame(new Keyframe('rest pose',1.0, [-4, 5,  -3]));
    myboxMotion.addKeyFrame(new Keyframe('rest pose',2.0, [-4, 5.1,-3]));
    myboxMotion.addKeyFrame(new Keyframe('rest pose',3.0, [-4, 5.2,-3]));
    myboxMotion.addKeyFrame(new Keyframe('rest pose',4.0, [-4, 5.1,-3]));
    myboxMotion.addKeyFrame(new Keyframe('rest pose',5.0, [-4, 5,  -3]));
    myboxMotion.addKeyFrame(new Keyframe('rest pose',6.0, [-4, 4.9,-3]));
    //   // basic interpolation test
    // myboxMotion.currTime = 0.1;
    // console.log('kf',myboxMotion.currTime,'=',myboxMotion.getAvars());    // interpolate for t=0.1
    // myboxMotion.currTime = 2.9;
    // console.log('kf',myboxMotion.currTime,'=',myboxMotion.getAvars());    // interpolate for t=2.9

      // keyframes for hand:    name, time, [x, y, theta1, theta2, theta3, theta4, theta5, THETA6]
    handMotion.addKeyFrame(new Keyframe('straight',         0.0, [2, 5,    0, 0, 0, 0, 0, 0]));
    handMotion.addKeyFrame(new Keyframe('right finger curl',1.0, [2, 5,   0, -90, -150, 0,0,45]));
    handMotion.addKeyFrame(new Keyframe('straight',         2.0, [2, 5,    0, 0, 0, 0, 0,45]));
    handMotion.addKeyFrame(new Keyframe('left finger curl', 3.0, [2, 5,   0, 0, 0, -90,-90,45]));
    handMotion.addKeyFrame(new Keyframe('straight',         4.0, [2, 5,    0, 0, 0, 0, 0, 0]));
    handMotion.addKeyFrame(new Keyframe('both fingers curl',5.0, [2, 5,   0, -90, -150, -90,-90,-45]));
    handMotion.addKeyFrame(new Keyframe('straight',         6.0, [2, 5,    0, 0, 0, 0, 0,0]));

    alienStartPosition.addKeyFrame(new Keyframe('start pose',  0.0, [0,4.4,0,    0, 0,   0,    -3,0,0,0,0,0,0,0,0,0,0,0]));
    alienStartPosition.addKeyFrame(new Keyframe('start pose',  1.0, [0,4.4,0,    0, 0,   0,    -3,0,0,0,0,0,0,0,0,0,0,0]));

    // WAVE
    alienWaveMotion.addKeyFrame(new Keyframe('start pose',  0.0, [0,4.4,0,    0, 0,   0,    -3,0,0,0,0,0,0,0,0,-2,0,0]));
    alienWaveMotion.addKeyFrame(new Keyframe('',            1.0, [0,4.4,0,    40,80,  100,  -4,0,0,0,0,0,0,0,0,-2,0,0]));
    alienWaveMotion.addKeyFrame(new Keyframe('',            2.0, [0,4.4,0,    35,120,-100,  -5,0,0,0,0,0,0,0,0,-2,0,0]));
    alienWaveMotion.addKeyFrame(new Keyframe('',            3.0, [0,4.4,0,    35,80,    0,  -4,0,0,0,0,0,0,0,0,-2,0,0]));
    alienWaveMotion.addKeyFrame(new Keyframe('',            4.0, [0,4.4,0,    25,130,   0,  -3,0,0,0,0,0,0,0,0,-2,0,0]));
    alienWaveMotion.addKeyFrame(new Keyframe('',            6.0, [0,4.4,0,    0,0,   0,     -2,0,0,0,0,0,0,0,0,-2,0,0]));
    alienWaveMotion.addKeyFrame(new Keyframe('',            7.0, [0,4.4,0,    0,0,   0,     -3,0,0,0,0,0,0,0,0,-2,0,0]));

    alienDance0.addKeyFrame(new Keyframe('', 0.0, [0,4.4,-0.4, 10, 10,     0,   -10,   0,   0,   0,   0,  0,   0, 0, 0,0,0,0]));
    alienDance0.addKeyFrame(new Keyframe('', 1.0, [0,4.4,0,    90, 120,   90,   -90, -10,  90, -40,  25, 40,  10, -5,7,0,0,0]));
    alienDance0.addKeyFrame(new Keyframe('', 2.0, [0,4.4,0,    90,  10,  -90,   -90, -130,-90,   0, -25, 20,  5,  5,-7,0,0,0]));
    alienDance0.addKeyFrame(new Keyframe('', 3.0, [0,4.4,0,    90, 120,   90,   -90, -10,  90,   0,  25, 40,  5, -5,7,0,0,0]));
    alienDance0.addKeyFrame(new Keyframe('', 4.0, [0,4.4,0,    90,  10,  -90,   -90, -130,-90,   0, -25, 20,  5,  5,-7,0,0,0]));
    alienDance0.addKeyFrame(new Keyframe('', 5.0, [0,4.4,0,    90, 120,   90,   -90, -10,  90,   0,  25,  0,  5,  0,7,0,0,0]));
    alienDance0.addKeyFrame(new Keyframe('', 6.0, [0,4.4,-0.4,  5,   5,    0,    -5,   0,   0,   0,   0,  0,  0,  0,0,0,0,0]));

    alienDance1.addKeyFrame(new Keyframe('', 0.0, [0, 4.4,-0.4,  10,  5,  0, -10, 0, 0, 0,  0, 0, 0, 0, 0,-15,    0,0]));
    alienDance1.addKeyFrame(new Keyframe('', 0.5, [0, 4.4,-0.4,  10,  5,  5, -10, 0, 0, 0,-20, 0, 0, 0, 7,-22,   0,0]));
    alienDance1.addKeyFrame(new Keyframe('', 1.0, [0, 4.4,-0.4,  10,  5,  0, -10, 0, 0, 0,  0, 0, 0, 0, 0, 10,   0,0]));
    alienDance1.addKeyFrame(new Keyframe('', 1.5, [0, 4.4,-0.4,  10,  5, -5, -10, 0, 0, 0, 20, 0, 0, 0,-7,-22,   0,0]));
    alienDance1.addKeyFrame(new Keyframe('', 2.0, [0, 4.4,-0.4,  10,  5,  0, -10, 0, 0, 0,  0, 0, 0, 0, 0, 10,   0,0]));
    alienDance1.addKeyFrame(new Keyframe('', 2.5, [0, 4.4,-0.4,  10,  5,  5, -10, 0, 0, 0,-20, 0, 0, 0, 7,-22,   0,0]));
    alienDance1.addKeyFrame(new Keyframe('', 3.0, [0, 4.4,-0.4,  10,  5,  0, -10, 0, 0, 0,  0, 0, 0, 0, 0, 10,   0,0]));
    alienDance1.addKeyFrame(new Keyframe('', 3.5, [0, 4.4,-0.4,  10,  5, -5, -10, 0, 0, 0, 20, 0, 0, 0,-7,-22,   0,0]));
    alienDance1.addKeyFrame(new Keyframe('', 4.0, [0, 4.4,-0.4,  10,  5,  0, -10, 0, 0, 0,  0, 0, 0, 0, 0, 10,   0,0]));
    alienDance1.addKeyFrame(new Keyframe('', 4.5, [0, 4.4,-0.4,  100,25, -5, -10, 0, 0, 0, 0, 0, 0, 0,  7,-22,   0,0]));
    alienDance1.addKeyFrame(new Keyframe('', 5.0, [0,4.35,-0.4,  100,35, -5, -17, 0, 0, 0, 0, 0, 0, 0, 12, 10,-100,-20]));
    alienDance1.addKeyFrame(new Keyframe('', 5.5, [0, 4.4,-0.4,  100,37, -5, -17, 0, 0, 0, 0, 0, 0, 0, 12,-22,  10,-20]));
    alienDance1.addKeyFrame(new Keyframe('', 6.0, [0,4.35,-0.4,  100,37, -5,- 17, 0, 0, 0, 0, 0, 0, 0, 12, 10,-100,-20]));
    alienDance1.addKeyFrame(new Keyframe('', 6.5, [0, 4.4,-0.4,  100,37, -5, -17, 0, 0, 0, 0, 0, 0, 0, 12,-22,  10,-20]));
    alienDance1.addKeyFrame(new Keyframe('', 7.0, [0,4.35,-0.4,  100,37, -5, -17, 0, 0, 0, 0, 0, 0, 0, 12, 10,-100,-20]));
    alienDance1.addKeyFrame(new Keyframe('', 7.5, [0, 4.4,-0.4,  100,37, -5, -17, 0, 0, 0, 0, 0, 0, 0, 12,-22,  10,-20]));
    alienDance1.addKeyFrame(new Keyframe('', 8.0, [0,4.35,-0.4,  100,37, -5, -17, 0, 0, 0, 0, 0, 0, 0, 12, 10,-100,-20]));
    alienDance1.addKeyFrame(new Keyframe('', 9.5, [0, 4.4,-0.4,  10,  5,  0, -17, 0, 0, 0,  0, 0, 0, 0, 0,-15,    0,0]));
 }

///////////////////////////////////////////////////////////////////////////////////////
// myboxSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////
function myboxSetMatrices(avars) {
    mybox.matrixAutoUpdate = false;     // tell three.js not to over-write our updates
    mybox.matrix.identity();
    mybox.matrix.multiply(new THREE.Matrix4().makeTranslation(avars[0], avars[1], avars[2]));
    mybox.matrix.multiply(new THREE.Matrix4().makeRotationY(-Math.PI/4));
    mybox.matrix.multiply(new THREE.Matrix4().makeScale(1.5,1.5,1.5));
    mybox.updateMatrixWorld();
}

function alienSetMatrices(avars) {
  var deg2rad = Math.PI/180;

  var theta2 = avars[3]*deg2rad;
  var theta3 = avars[4]*deg2rad;
  var theta4 = avars[5]*deg2rad;
  var theta5 = avars[6]*deg2rad;
  var theta6 = avars[7]*deg2rad;
  var theta7 = avars[8]*deg2rad;
  var theta8 = avars[9]*deg2rad;
  var theta9 = avars[10]*deg2rad;
  var theta10 = avars[11]*deg2rad;
  var theta11 = avars[12]*deg2rad;
  var theta12 = avars[13]*deg2rad;
  var theta13 = avars[14]*deg2rad;
  var theta14 = avars[15]*deg2rad;
  var theta15 = avars[16]*deg2rad;
  var theta16 = avars[17]*deg2rad;

  alienHead.matrix.identity();
  alienHead.matrix.multiply(new THREE.Matrix4().makeTranslation(avars[0],avars[1],avars[2]));
  //alienHead.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta2))


  alienNeck.matrix.copy(alienHead.matrix);
  alienNeck.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.375,0));
  //alienNeck.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta2));



  alienShoulders.matrix.copy(alienNeck.matrix);
  alienShoulders.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.25,0));


  alienTorso0.matrix.copy(alienShoulders.matrix);
  alienTorso0.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.25,0));


  alienTorso1.matrix.copy(alienTorso0.matrix);
  alienTorso1.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.25,0));

  alienTorso2.matrix.copy(alienTorso1.matrix);
  alienTorso2.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.25,0));

  alienHip0.matrix.copy(alienTorso2.matrix);
  alienHip0.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.25,0));
//alienHip0.matrix.multiply(new THREE.Matrix4().makeRotationX(theta8));

  alienJoint0.matrix.copy(alienHip0.matrix);
  alienJoint0.matrix.multiply(new THREE.Matrix4().makeTranslation(0.35,-0.25,0));
  alienJoint0.matrix.multiply(new THREE.Matrix4().makeRotationX(theta8));
  //alienJoint0.matrix.multiply(new THREE.Matrix4().makeRotationY(theta10));
  //alienJoint0.matrix.multiply(new THREE.Matrix4().makeTranslation(avars[11],0,0));
  alienLeg0.matrix.copy(alienJoint0.matrix);
  alienLeg0.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.2,0));

  alienJoint2.matrix.copy(alienLeg0.matrix);
  alienJoint2.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.4,0));
  alienJoint2.matrix.multiply(new THREE.Matrix4().makeRotationX(theta10));
  //alienJoint2.matrix.multiply(new THREE.Matrix4().makeRotation(theta12));

  alienJoint1.matrix.copy(alienHip0.matrix);
  alienJoint1.matrix.multiply(new THREE.Matrix4().makeTranslation(-0.35,-0.25,0));
  alienJoint1.matrix.multiply(new THREE.Matrix4().makeRotationX(theta12));
  alienLeg1.matrix.copy(alienJoint1.matrix);
  alienLeg1.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.2,0));
  alienJoint3.matrix.copy(alienLeg1.matrix);
  alienJoint3.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.4,0));
  alienJoint3.matrix.multiply(new THREE.Matrix4().makeRotationX(theta11));
  alienLeg3.matrix.copy(alienJoint3.matrix);
  alienLeg3.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.4,0));

  alienLeg2.matrix.copy(alienJoint2.matrix);
  alienLeg2.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.4,0));



  alienFoot0.matrix.copy(alienLeg2.matrix);
  alienFoot0.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.5,0));
  alienFoot0.matrix.multiply(new THREE.Matrix4().makeRotationX(theta8));

  alienFoot1.matrix.copy(alienLeg3.matrix);
  alienFoot1.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.5,0));

  alienShoulders.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta13));
  // RIGHT ARM
  alienJoint4.matrix.copy(alienShoulders.matrix);
  alienJoint4.matrix.multiply(new THREE.Matrix4().makeTranslation(0.55,0,0));


  alienJoint4.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta2));

  alienArm0.matrix.copy(alienJoint4.matrix);
  alienArm0.matrix.multiply(new THREE.Matrix4().makeTranslation(0.05,-0.2,0));
  alienJoint6.matrix.copy(alienArm0.matrix);
  alienJoint6.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.3,0));
  alienJoint6.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta3));
  alienJoint6.matrix.multiply(new THREE.Matrix4().makeRotationX(theta15));
    alienJoint6.matrix.multiply(new THREE.Matrix4().makeRotationY(theta16));
  alienArm2.matrix.copy(alienJoint6.matrix);
  alienArm2.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.35,0));
  alienHand0.matrix.copy(alienArm2.matrix);
  alienHand0.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.25,0));
  alienHand0.matrix.multiply(new THREE.Matrix4().makeRotationY(theta4));

  //LEFT ARM
  alienJoint5.matrix.copy(alienShoulders.matrix);
  alienJoint5.matrix.multiply(new THREE.Matrix4().makeTranslation(-0.55,0,0));
  alienJoint5.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta5));
  alienArm1.matrix.copy(alienJoint5.matrix);
  alienArm1.matrix.multiply(new THREE.Matrix4().makeTranslation(-0.05,-0.2,0));
  alienJoint7.matrix.copy(alienArm1.matrix);
  alienJoint7.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.3,0));
  alienJoint7.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta6))
  alienArm3.matrix.copy(alienJoint7.matrix);
  alienArm3.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.35,0));
  alienHand1.matrix.copy(alienArm3.matrix);
  alienHand1.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-0.25,0));
  alienHand1.matrix.multiply(new THREE.Matrix4().makeRotationY(theta7))



  alienHead.matrix.multiply(new THREE.Matrix4().makeRotationY(theta9));
  alienHead.matrix.multiply(new THREE.Matrix4().makeRotationX(theta14));
  alienEye0.matrix.copy(alienHead.matrix);
  alienEye0.matrix.multiply(new THREE.Matrix4().makeTranslation(-0.22,0,0.25));
  alienEye1.matrix.copy(alienHead.matrix);
  alienEye1.matrix.multiply(new THREE.Matrix4().makeTranslation(0.22,0,0.25));

  alienEye0.updateMatrixWorld();
  alienHead.updateMatrixWorld();
  alienNeck.updateMatrixWorld();
  alienShoulders.updateMatrixWorld();
  alienTorso0.updateMatrixWorld();
  alienTorso1.updateMatrixWorld();
  alienTorso2.updateMatrixWorld();
  alienHip0.updateMatrixWorld();
  alienHip1.updateMatrixWorld();
  alienJoint0.updateMatrixWorld();
  alienJoint1.updateMatrixWorld();
  alienLeg0.updateMatrixWorld();
  alienLeg1.updateMatrixWorld();
  alienJoint2.updateMatrixWorld();
  alienJoint3.updateMatrixWorld();
  alienLeg2.updateMatrixWorld();
  alienFoot0.updateMatrixWorld();
  alienFoot1.updateMatrixWorld();

  alienJoint4.updateMatrixWorld();
  alienJoint5.updateMatrixWorld();
  alienArm0.updateMatrixWorld();
  alienArm1.updateMatrixWorld();
  alienJoint6.updateMatrixWorld();
  alienJoint7.updateMatrixWorld();
  alienArm2.updateMatrixWorld();
  alienArm3.updateMatrixWorld();
}

///////////////////////////////////////////////////////////////////////////////////////
// handSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function handSetMatrices(avars) {
    var deg2rad = Math.PI/180;
    var xPosition = avars[0];
    var yPosition = avars[1];
    var theta1 = avars[2]*deg2rad;
    var theta2 = avars[3]*deg2rad;
    var theta3 = avars[4]*deg2rad;
    var theta4 = avars[5]*deg2rad;
    var theta5 = avars[6]*deg2rad;

    var theta6 = avars[7]*deg2rad;

      ////////////// link1
    linkFrame1.matrix.identity();
    linkFrame1.matrix.multiply(new THREE.Matrix4().makeTranslation(xPosition,yPosition,0));
    linkFrame1.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta1));
    linkFrame1.matrix.multiply(new THREE.Matrix4().makeRotationX(theta6));
      // Frame 1 has been established
    link1.matrix.copy(linkFrame1.matrix);
    link1.matrix.multiply(new THREE.Matrix4().makeTranslation(2,0,0));
    //link1.matrix.multiply(new THREE.Matrix$().makeScale(4,1,1));
    link1.matrix.multiply(new THREE.Matrix4().makeScale(5,1,3));

      ////////////// link2
    linkFrame2.matrix.copy(linkFrame1.matrix);      // start with parent frame
    linkFrame2.matrix.multiply(new THREE.Matrix4().makeTranslation(4,0,1));
    linkFrame2.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta2));
      // Frame 2 has been established
    link2.matrix.copy(linkFrame2.matrix);
    link2.matrix.multiply(new THREE.Matrix4().makeTranslation(2,0,0));
    link2.matrix.multiply(new THREE.Matrix4().makeScale(4,1,1));

      ///////////////  link3
    linkFrame3.matrix.copy(linkFrame2.matrix);
    linkFrame3.matrix.multiply(new THREE.Matrix4().makeTranslation(4,0,0));
    linkFrame3.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta3));
      // Frame 3 has been established
    link3.matrix.copy(linkFrame3.matrix);
    link3.matrix.multiply(new THREE.Matrix4().makeTranslation(2,0,0));
    link3.matrix.multiply(new THREE.Matrix4().makeScale(4,1,1));

      /////////////// link4
    linkFrame4.matrix.copy(linkFrame1.matrix);
    linkFrame4.matrix.multiply(new THREE.Matrix4().makeTranslation(4,0,-1));
    linkFrame4.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta4));
      // Frame 4 has been established
    link4.matrix.copy(linkFrame4.matrix);
    link4.matrix.multiply(new THREE.Matrix4().makeTranslation(2,0,0));
    link4.matrix.multiply(new THREE.Matrix4().makeScale(4,1,1));

      // link5
    linkFrame5.matrix.copy(linkFrame4.matrix);
    linkFrame5.matrix.multiply(new THREE.Matrix4().makeTranslation(4,0,0));
    linkFrame5.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta5));
      // Frame 5 has been established
    link5.matrix.copy(linkFrame5.matrix);
    link5.matrix.multiply(new THREE.Matrix4().makeTranslation(2,0,0));
    link5.matrix.multiply(new THREE.Matrix4().makeScale(4,1,1));

    link1.updateMatrixWorld();
    link2.updateMatrixWorld();
    link3.updateMatrixWorld();
    link4.updateMatrixWorld();
    link5.updateMatrixWorld();

    linkFrame1.updateMatrixWorld();
    linkFrame2.updateMatrixWorld();
    linkFrame3.updateMatrixWorld();
    linkFrame4.updateMatrixWorld();
    linkFrame5.updateMatrixWorld();
}

/////////////////////////////////////
// initLights():  SETUP LIGHTS
/////////////////////////////////////

function initLights() {
    // light = new THREE.PointLight(0xffffff, 0.25);
    // light.position.set(0,4,15);
    // scene.add(light);
    // ambientLight = new THREE.AmbientLight(0xf2f1e7, 0.005);
    // scene.add(ambientLight);

    hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.3 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
		hemiLight.position.set( 0, 20, 0 );

    dirLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( -1, 1.75, 1 );
    dirLight.position.multiplyScalar( 10 );
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    scene.add( hemiLight );
    scene.add( dirLight );


}

/////////////////////////////////////
// MATERIALS
/////////////////////////////////////

var diffuseMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
var diffuseMaterial2 = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide } );
var basicMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} );
var armadilloMaterial = new THREE.MeshBasicMaterial( {color: 0x7fff7f} );







/////////////////////////////////////
// initObjects():  setup objects in the scene
/////////////////////////////////////

function initObjects() {
    //worldFrame = new THREE.AxesHelper(5) ;
    //scene.add(worldFrame);

    // mybox
    myboxGeometry = new THREE.BoxGeometry(1.5,1.5,1.5);    // width, height, depth
    mybox = new THREE.Mesh( myboxGeometry, diffuseMaterial );
    scene.add( mybox );

    // textured floor
    floorTexture = new THREE.TextureLoader().load('images/floor.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(1, 1);
    // floorMaterial = new THREE.MeshPhongMaterial({
    //   //flatShading:true,
    //   color: 0x66c5cd


      floorMaterial = new THREE.MeshNormalMaterial({transparent: true, opacity:0.975} );
    floorGeometry = new THREE.BoxGeometry(15, 15, 4);
    floor = new THREE.Mesh(floorGeometry, floorMaterial);

    floor.position.y = -1.1;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);

    //sphere, located at light position
    // sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);    // radius, segments, segments
    // sphere = new THREE.Mesh(sphereGeometry, basicMaterial);
    // sphere.position.set(0,4,2);
    // sphere.position.set(light.position.x, light.position.y, light.position.z);
    // scene.add(sphere);

    // box
    boxGeometry = new THREE.BoxGeometry( 2,2,2);    // width, height, depth
    box = new THREE.Mesh( boxGeometry, new THREE.MeshLambertMaterial( {
      color:0xfbf4b2,
      flatShading:true}));
    box.position.set(-6, 7, -6);
    box.rotation.x = -Math.PI / 6;
    box.rotation.y = Math.PI / 4;
    box.rotation.z = Math.PI / 4;
    scene.add( box );

    box1 = new THREE.Mesh(boxGeometry, new THREE.MeshLambertMaterial({
      color:0xffff66,
      flatShading:true}));
    box1.position.set(-4,8,-4);
    box1.rotation.z = -Math.PI / 8;
    box1.scale.set(0.83,0.83,0.83);
    scene.add(box1);

    box2 = new THREE.Mesh(boxGeometry, new THREE.MeshLambertMaterial({
      color:0xcd7666,
      flatShading:true}));
    box2.position.set(4,6,-3);
    box2.rotation.z = Math.PI / 9;
    scene.add(box2);

    box3 = new THREE.Mesh(boxGeometry, new THREE.MeshLambertMaterial({
      color:0xc3d9f6,
      flatShading:true}));
    box3.position.set(5,9,-4);
    box3.rotation.x = Math.PI / 9;
    box3.scale.set(1.2,1.2,1.2);
    scene.add(box3);

    box4 = new THREE.Mesh(boxGeometry, new THREE.MeshLambertMaterial({
      color:0xc3d9f6,
      flatShading:true}));
    box4.position.set(2,9,-5);
    box4.rotation.y = -Math.PI / 10;
    box4.scale.set(0.9,0.9,0.9);
    scene.add(box4);

    box5 = new THREE.Mesh(boxGeometry, new THREE.MeshLambertMaterial({
      color:0xfbb875,
      flatShading:true}));
    box5.position.set(0,4,-6);
    box5.rotation.x = Math.PI / 12;
    box5.rotation.z = -Math.PI / 12;
    box5.rotation.y = -Math.PI / 11;
    box5.scale.set(1.1,1.1,1.1);
    scene.add(box5);

    var geometries = [
    					new THREE.BoxBufferGeometry( 1, 1, 1 ),
    					//new THREE.SphereBufferGeometry( 0.5, 12, 8 ),
    					//new THREE.DodecahedronBufferGeometry( 0.4 ),
    					//new THREE.CylinderBufferGeometry( 0.5, 0.5, 1, 12 )
    				];
var geometry = geometries[ geometries.length * Math.random() | 0 ];
    for ( var i = 0; i < 130; i ++ ) {
    					var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
    					object.position.x = Math.random()*13-6.5;
    					object.position.y = Math.random()*10-12.25;
    					object.position.z = Math.random()*13-6.55;
    					//object.rotation.x = Math.random() * 2 * Math.PI;
    					object.rotation.y = Math.random() * 2 * Math.PI;
    					//object.rotation.z = Math.random() * 2 * Math.PI;
    					object.scale.x = Math.random() + 5;
    					object.scale.y = Math.random() + 5;
    					object.scale.z = Math.random() + 5;
    					scene.add( object );
    				}



    // cylinder
    // parameters:  radiusAtTop, radiusAtBottom, height, radialSegments, heightSegments
    // cylinderGeometry = new THREE.CylinderGeometry( 0.30, 0.30, 0.80, 20, 4 );
    // cylinder = new THREE.Mesh( cylinderGeometry, diffuseMaterial);
    // cylinder.position.set(2, 0, 0);
    // scene.add( cylinder );

    // cone:   parameters --  radiusTop, radiusBot, height, radialSegments, heightSegments
    // coneGeometry = new THREE.CylinderGeometry( 0.0, 0.30, 0.80, 20, 4 );
    // cone = new THREE.Mesh( coneGeometry, diffuseMaterial);
    // cone.position.set(4, 0, 0);
    // scene.add( cone);

    // torus:   parameters -- radius, diameter, radialSegments, torusSegments
    // torusGeometry = new THREE.TorusGeometry( 1.2, 0.4, 10, 20 );
    // torus = new THREE.Mesh( torusGeometry, diffuseMaterial);
    // torus.position.set(6, 0, 0);   // translation
    // torus.rotation.set(0,0,0);     // rotation about x,y,z axes
    // scene.add( torus );

    // custom object
    // var geom = new THREE.Geometry();
    // var v0 = new THREE.Vector3(0,0,0);
    // var v1 = new THREE.Vector3(3,0,0);
    // var v2 = new THREE.Vector3(0,3,0);
    // var v3 = new THREE.Vector3(3,3,0);
    // geom.vertices.push(v0);
    // geom.vertices.push(v1);
    // geom.vertices.push(v2);
    // geom.vertices.push(v3);
    // geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
    // geom.faces.push( new THREE.Face3( 1, 3, 2 ) );
    // geom.computeFaceNormals();
    // customObject = new THREE.Mesh( geom, diffuseMaterial2 );
    // customObject.position.set(0, 0, -2);
    // scene.add(customObject);


    // star field
    var starsGeom = new THREE.Geometry();
    for (var i = 0; i < 1500; i ++) {
    	var star = new THREE.Vector3();
    	star.x = THREE.Math.randFloatSpread( 200 );
    	star.y = THREE.Math.randFloatSpread( 200 );
    	star.z = THREE.Math.randFloatSpread( 200 );
    	starsGeom.vertices.push( star );
    }

    var starsMaterial = new THREE.PointsMaterial( { color: 0xffffff } );
    var starField = new THREE.Points( starsGeom, starsMaterial );
    scene.add( starField );

    scene.fog=new THREE.Fog( 0xffffff, 0.01);
    //scene.fog = new THREE.FogExp2( 0xefd1b5, 0.0025 );

}

function initAlien() {
  var alienMaterial = new THREE.MeshPhongMaterial({
    color:0x66cd68,
    flatShading:true
  })
  var eyeMaterial = new THREE.MeshLambertMaterial({
    color:0x484a54
  })

  headGeom = new THREE.CylinderGeometry(0.4,0.4,0.55,6,6);
  neckGeom = new THREE.CylinderGeometry(0.125,0.125,0.25,6,6);
  shoulderGeom = new THREE.CylinderGeometry(0.6, 0.6,0.3,6,6);
  torso0Geom = new THREE.CylinderGeometry(0.5,0.5,0.3,6,6);
  torso1Geom = new THREE.CylinderGeometry(0.4, 0.4,0.3,6,6);
  jointGeom = new THREE.SphereGeometry(0.13,3,3);
  legGeom0 = new THREE.CylinderGeometry(0.15, 0.15, 0.7,3,3);
  legGeom1 = new THREE.CylinderGeometry(0.15, 0.15,1.0,3,3);
  footGeom = new THREE.BoxGeometry(0.35,0.25,0.55);
  armGeom0 = new THREE.CylinderGeometry(0.15,0.15,0.5,3,3);
  armGeom1 = new THREE.CylinderGeometry(0.15,0.15,0.7,3,3);
  handGeom = new THREE.BoxGeometry(0.35,0.25,0.35);
  eyeGeom = new THREE.SphereGeometry(0.05,5,5);

  alienEye0 = new THREE.Mesh(eyeGeom, eyeMaterial);
  alienEye1 = new THREE.Mesh(eyeGeom, eyeMaterial);
  alienHead = new THREE.Mesh(headGeom, alienMaterial);
  alienNeck = new THREE.Mesh(neckGeom, alienMaterial);
  alienShoulders = new THREE.Mesh(shoulderGeom, alienMaterial);
  alienTorso0 = new THREE.Mesh(torso0Geom, alienMaterial);
  alienTorso1 = new THREE.Mesh(torso1Geom, alienMaterial);
  alienTorso2 = new THREE.Mesh(torso1Geom, alienMaterial);
  alienHip0 = new THREE.Mesh(torso0Geom, alienMaterial);
  alienHip1 = new THREE.Mesh(shoulderGeom, alienMaterial);
  alienJoint0 = new THREE.Mesh(jointGeom, alienMaterial);
  alienJoint1 = alienJoint0.clone();
  alienLeg0 = new THREE.Mesh(legGeom0, alienMaterial);
  alienLeg1 = alienLeg0.clone();
  alienJoint2 = alienJoint0.clone();
  alienJoint3 = alienJoint0.clone();
  alienLeg2 = new THREE.Mesh(legGeom1, alienMaterial);
  alienLeg3 = alienLeg2.clone();
  alienFoot0 = new THREE.Mesh(footGeom, alienMaterial);
  alienFoot1 = alienFoot0.clone();
  alienJoint4 = alienJoint0.clone();
  alienJoint5 = alienJoint0.clone();
  alienArm0 = new THREE.Mesh(armGeom0, alienMaterial);
  alienArm1 = alienArm0.clone();
  alienJoint6 = alienJoint0.clone();
  alienJoint7 = alienJoint0.clone();
  alienArm2 = new THREE.Mesh(armGeom1, alienMaterial);
  alienArm3 = alienArm2.clone();
  alienHand0 = new THREE.Mesh(handGeom, alienMaterial);
  alienHand1 = alienHand0.clone();

  scene.add(alienEye0);
  scene.add(alienEye1);
  scene.add(alienShoulders);
  scene.add(alienNeck);
  scene.add(alienHead);
  scene.add(alienTorso0);
  scene.add(alienTorso1);
  scene.add(alienTorso2);
  scene.add(alienHip0);
  scene.add(alienHip1);
  scene.add(alienJoint0);
  scene.add(alienJoint1);
  scene.add(alienLeg0);
  scene.add(alienLeg1);
  scene.add(alienJoint2);
  scene.add(alienJoint3);
  scene.add(alienLeg2);
  scene.add(alienLeg3);
  scene.add(alienFoot0);
  scene.add(alienFoot1);
  scene.add(alienJoint4);
  scene.add(alienJoint5);
  scene.add(alienArm0);
  scene.add(alienArm1);
  scene.add(alienJoint6);
  scene.add(alienJoint7);
  scene.add(alienArm2);
  scene.add(alienArm3);
  scene.add(alienHand0);
  scene.add(alienHand1);

  alienEye0.matrixAutoUpdate = false;
  alienEye1.matrixAutoUpdate = false;
  alienHead.matrixAutoUpdate = false;
  alienNeck.matrixAutoUpdate = false;
  alienShoulders.matrixAutoUpdate = false;
  alienTorso0.matrixAutoUpdate = false;
  alienTorso1.matrixAutoUpdate = false;
  alienTorso2.matrixAutoUpdate = false;
  alienHip0.matrixAutoUpdate = false;
  alienHip1.matrixAutoUpdate = false;
  alienJoint0.matrixAutoUpdate = false;
  alienJoint1.matrixAutoUpdate = false;
  alienLeg0.matrixAutoUpdate = false;
  alienLeg1.matrixAutoUpdate = false;
  alienJoint2.matrixAutoUpdate = false;
  alienJoint3.matrixAutoUpdate = false;
  alienLeg2.matrixAutoUpdate = false;
  alienLeg3.matrixAutoUpdate = false;
  alienFoot0.matrixAutoUpdate = false;
  alienFoot1.matrixAutoUpdate = false;
  alienJoint4.matrixAutoUpdate = false;
  alienJoint5.matrixAutoUpdate = false;
  alienArm0.matrixAutoUpdate = false;
  alienArm1.matrixAutoUpdate = false;
  alienJoint6.matrixAutoUpdate = false;
  alienJoint7.matrixAutoUpdate = false;
  alienArm2.matrixAutoUpdate = false;
  alienArm3.matrixAutoUpdate = false;
  alienHand0.matrixAutoUpdate = false;
  alienHand1.matrixAutoUpdate = false;
}

/////////////////////////////////////////////////////////////////////////////////////
//  initHand():  define all geometry associated with the hand
/////////////////////////////////////////////////////////////////////////////////////
function initHand() {
    handMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
    boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );    // width, height, depth

    link1 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link1 );
    linkFrame1   = new THREE.AxesHelper(1) ;   scene.add(linkFrame1);
    link2 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link2 );
    linkFrame2   = new THREE.AxesHelper(1) ;   scene.add(linkFrame2);
    link3 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link3 );
    linkFrame3   = new THREE.AxesHelper(1) ;   scene.add(linkFrame3);
    link4 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link4 );
    linkFrame4   = new THREE.AxesHelper(1) ;   scene.add(linkFrame4);
    link5 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link5 );
    linkFrame5   = new THREE.AxesHelper(1) ;   scene.add(linkFrame5);

    link1.matrixAutoUpdate = false;
    link2.matrixAutoUpdate = false;
    link3.matrixAutoUpdate = false;
    link4.matrixAutoUpdate = false;
    link5.matrixAutoUpdate = false;
    linkFrame1.matrixAutoUpdate = false;
    linkFrame2.matrixAutoUpdate = false;
    linkFrame3.matrixAutoUpdate = false;
    linkFrame4.matrixAutoUpdate = false;
    linkFrame5.matrixAutoUpdate = false;
}

/////////////////////////////////////////////////////////////////////////////////////
//  create customShader material
/////////////////////////////////////////////////////////////////////////////////////

var customShaderMaterial = new THREE.ShaderMaterial( {
//        uniforms: { textureSampler: {type: 't', value: floorTexture}},
	vertexShader: document.getElementById( 'customVertexShader' ).textContent,
	fragmentShader: document.getElementById( 'customFragmentShader' ).textContent
} );

// Added new customShaderMaterial
var customShaderMaterial2 = new THREE.ShaderMaterial ({
  //uniforms: uniforms,
  vertexShader: document.getElementById('customVertexShader2').textContent,
  fragmentShader: document.getElementById('customFragmentShader2').textContent
});

var ctx = renderer.context;
ctx.getShaderInfoLog = function () { return '' };   // stops shader warnings, seen in some browsers

////////////////////////////////////////////////////////////////////////
// initFileObjects():    read object data from OBJ files;  see onResourcesLoaded() for instances
////////////////////////////////////////////////////////////////////////

function initFileObjects() {
        // list of OBJ files that we want to load, and their material
    models = {
//	bunny:     {obj:"obj/bunny.obj", mtl: diffuseMaterial, mesh: null},
//	horse:     {obj:"obj/horse.obj", mtl: diffuseMaterial, mesh: null },
//	minicooper:{obj:"obj/minicooper.obj", mtl: diffuseMaterial, mesh: null },
//	trex:      { obj:"obj/trex.obj", mtl: normalShaderMaterial, mesh: null },
// teapot:    {obj:"obj/teapot.obj", mtl: customShaderMaterial, mesh: null	},

	armadillo: {obj:"obj/armadillo.obj", mtl: customShaderMaterial, mesh: null },
	dragon:    {obj:"obj/dragon.obj", mtl: customShaderMaterial2, mesh: null }
  };

    var manager = new THREE.LoadingManager();
    manager.onLoad = function () {
	console.log("loaded all resources");
	RESOURCES_LOADED = true;
	 onResourcesLoaded();
    }
    var onProgress = function ( xhr ) {
	if ( xhr.lengthComputable ) {
	    var percentComplete = xhr.loaded / xhr.total * 100;
	    console.log( Math.round(percentComplete, 2) + '% downloaded' );
	}
    };
    var onError = function ( xhr ) {
    };

    // Load models;  asynchronous in JS, so wrap code in a fn and pass it the index
    for( var _key in models ){
	console.log('Key:', _key);
	(function(key){
	    var objLoader = new THREE.OBJLoader( manager );
	    objLoader.load( models[key].obj, function ( object ) {
		object.traverse( function ( child ) {
		    if ( child instanceof THREE.Mesh ) {
			child.material = models[key].mtl;
			child.material.shading = THREE.SmoothShading;
		    }	} );
		models[key].mesh = object;
		//scene.add( object );
	    }, onProgress, onError );
	})(_key);
    }
}

/////////////////////////////////////////////////////////////////////////////////////
// onResourcesLoaded():  once all OBJ files are loaded, this gets called
//                       Object instancing is done here
/////////////////////////////////////////////////////////////////////////////////////

function onResourcesLoaded() {

 // Clone models into meshes;   [Michiel:  AFAIK this makes a "shallow" copy of the model,
 //                             i.e., creates references to the geometry, and not full copies ]
    // meshes["armadillo1"] = models.armadillo.mesh.clone();
    // meshes["armadillo2"] = models.armadillo.mesh.clone();
    meshes["dragon1"] = models.dragon.mesh.clone();

    // position the object instances and parent them to the scene, i.e., WCS
    //
    // meshes["armadillo1"].position.set(-6, 1.5, 2);
    // meshes["armadillo1"].rotation.set(0,-Math.PI/2,0);
    // meshes["armadillo1"].scale.set(1,1,1);
    // scene.add(meshes["armadillo1"]);

    // meshes["armadillo2"].position.set(-3, 1.5, 2);
    // meshes["armadillo2"].rotation.set(0,-Math.PI/2,0);
    // meshes["armadillo2"].scale.set(1,1,1);
    // scene.add(meshes["armadillo2"]);

    /*
    meshes["dragon1"].position.set(0, 10, 0);
    meshes["dragon1"].rotation.set(Math.PI,0, 0);

    dragon2 = meshes["dragon1"].clone(); // "Add an extra dragon to your scene at a desired location and in a desired orientation"
    dragon2.rotation.set(0,0,0);
    dragon2.position.set(0,10,0);

    scene.add(meshes["dragon1"]);
    scene.add(dragon2);
    */
}


///////////////////////////////////////////////////////////////////////////////////////
// LISTEN TO KEYBOARD
///////////////////////////////////////////////////////////////////////////////////////

var keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("1")) {
    animation = true;
    wave = true;
    dance0 = false;
    dance1 = false;
    alienWaveMotion.currTime = 0.0;
  } else if (keyboard.pressed("2")) {
    animation = true;
    dance0 = true;
    wave = false;
    dance1 = false;
    alienDance0.currTime = 0.0;
  } else if (keyboard.pressed("3")) {
    animation = true;
    dance1 = true;
    wave = false;
    dance0 = false;
    alienDance1.currTime = 0.0

  }
  // if (keyboard.pressed("W"))
  //   light.position.y += 0.1;
  // else if (keyboard.pressed("S"))
  //   light.position.y -= 0.1;
  // else if (keyboard.pressed("A"))
  //   light.position.x -= 0.1;
  // else if (keyboard.pressed("D"))
  //   light.position.x += 0.1;
  // else if (keyboard.pressed(" "))
  //   animation = !animation;

    else if (keyboard.pressed(" "))
      animation = !animation;
}

///////////////////////////////////////////////////////////////////////////////////////
// UPDATE CALLBACK:    This is the main animation loop
///////////////////////////////////////////////////////////////////////////////////////

function update() {

    var dt=0.02;
    checkKeyboard();
    if (animation) {
      if(wave == true){
        alienWaveMotion.timestep(dt);
      } else if (dance0 == true) {
        alienDance0.timestep(dt);
      } else if (dance1 == true) {
        alienDance1.timestep(dt);
      } else {
        alienStartPosition.timestep(dt);
      }

	    myboxMotion.timestep(dt);
	    //handMotion.timestep(dt);
      //alienStartPosition.timestep(dt);
    }
  //  sphere.position.set(light.position.x, light.position.y, light.position.z);
    requestAnimationFrame(update);      // requests the next update call;  this creates a loop
    renderer.render(scene, camera);
}

init();


update();
