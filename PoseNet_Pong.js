// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let poseNet;
let poses = [];
 
var x, y;
var vx, vy;
var leftPaddle;
var rightPaddle;
var rightScore = 0;
var leftScore = 0;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
 
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
 
  x = width / 2;
  y = height / 2;
  vx = 3;
  vy = 1.2;
 
  leftPaddle = height / 2;
  rightPaddle = height / 2;
 
  rectMode(CENTER);
}
 
function modelReady() {
  select('#status').html('Model Loaded');
}
 
function draw() {
  image(video, 0, 0, width, height);
 
  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
 
  // background(220);
 
  rect(20, leftPaddle, 10, 50);
  rect(width-20, rightPaddle, 10, 50);
 
  ellipse(x, y, 20);
  
  fill(255);
  textSize(24);
  text("Player 1: " + leftScore, 10, 25);
  
  fill(255);
  textSize(24);
  text("Player 2: " + rightScore, 510, 25);
  
 
  x = x + vx;
  y = y + vy;
 
  if (y < 10) {
    vy = -vy;
  }
  if (y > height-10) {
    vy = -vy;
  }
  if (x < 35) {
    if (y < leftPaddle+25 && y > leftPaddle-25) {
      vx = -vx;
    } else {
      // game over
    }
  }
  if (x > width - 35) {
    if (y < rightPaddle+25 && y > rightPaddle-25) {
      vx = -vx;
    } else {
      // game over
    }
  }
 
  if(poses.length >= 2) {
  leftPaddle = poses[0].pose.nose.y;
  rightPaddle = poses[1].pose.nose.y;
  }
  
  if(x > width) {
    leftScore++;
    x = width/2;
    y = height/2;
}
  if(leftScore >= 3) {
    print("left player wins!");
    fill(255);
    textSize(48);
    text("Left Player Wins!", 150, 340);
  }
  
  if(x < 0) {
    rightScore++;
    x = width/2;
    y = height/2;
  }
  if(rightScore >= 3) {
    print("right player wins!");
    fill(255);
    textSize(48);
    text("Right Player Wins!", 150, 340);
  }
}

 
// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255);
        noStroke();
        //ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}
 
// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      fill(255);
      //line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}
