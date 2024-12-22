// variables
let instruments = ['bass', 'snare', 'hihat_closed', 'hihat_open', 'crash'];
let round = 0; // tracking which round user is on

let bass = 'z'; // current button for the bass drum
let snare = 'a';
let hihat_closed = 'u';
let hihat_open = 'j';
let crash = 'k';

let bass_keys = ['z','x','c','v']; // keys to cycle through
let snare_keys = ['a','s','d','f'];
let hihat_closed_keys = ['u','i','o','p'];
let master_keys = [['z','x','c','v'], ['a','s','d','f'], ['u','i','o','p'], hihat_open, crash];

let cycle_i = [0, 0, 0]; // array of current (instrument)_keys indices, in bass snare hihat order

let bass_x = 100; // x value at which bass drum notes spawn
let snare_x = 250;
let hihat_c_x = 400;
let hihat_o_x = 550;
let crash_x = 700;
let spawn = 0; // y value at which all notes spawn
let button = 900; // y value at which the notes match up with their button indicator

let hitTimes = {'bass':0,'snare':0,'hihat_closed':0,'hihat_open':0,'crash':0}

let feedback_time = 150;

let playing = false; // is a song playing
let note_size = 35; // the size of the falling notes; think ddr arrows
let text_ybuffer = note_size + 38; // buffer between the button text and the button
let text_xbuffer = 50; // buffer text to the left of the button
let text_cbuffer = 6; // buffer so that open hihat and crash letters are centered
let letter_buffer = 30; // buffer between letters in the button ui
let res_x = 800;
let res_y = 1080;

let hitThreshold = note_size; // THIS CAN BE ADJUSTED to classify what counts as hit

let current_beat = 0; // this says "beat" but it is actually counting 16th notes, if you care
let current_notes = []; // list of all notes currently "in play" (on the screen), where a note is itself a list of two items: the instrument it belongs to, and the millisecond since song start it first appeared on screen
// EDIT: notes are now 3 items long, the third being a boolean for whether it has passed the hit threshold and is no longer hittable (for cycling purposes)
let song_start_ms; // the millisecond (counted in milliseconds after program start) that the current playing song begins
let bpm = 30; // beats per minute for the song
let note_delay = 3000; // how many milliseconds a note appears before it needs to be pressed


let piano_roll_1 = [["bass"], ["snare"], ["hihat_closed"], ["hihat_open"], ["crash"], ["bass", "snare", "hihat_closed", "hihat_open","crash"]];


let score = 0; // Initialize score
let hitData = []; // Array to store hit/miss information
let instrumentKeys = {}; // Object to map keys to instruments

function setup() {
  //add code here that runs ONCE, on start of the program
  createCanvas(res_x, res_y);
  background(0, 0, 0);
  rectMode(RADIUS);
  strokeWeight(2);
  // control_first = random([true, false]); // as in players will go through the control version with normal inputs first
}

function cycle(instrument) {
  if (instrument == "bass") {
    if (cycle_i[0] == 3) {
      cycle_i[0] = 0;
    }
    else {
      cycle_i[0]++;
    }
    bass = bass_keys[cycle_i[0]];
  }
  else if (instrument == "snare") {
    if (cycle_i[1] == 3) {
      cycle_i[1] = 0;
    }
    else {
      cycle_i[1]++;
    }
    snare = snare_keys[cycle_i[1]];
  }
  else if (instrument == "hihat_closed") {
    if (cycle_i[2] == 3) {
      cycle_i[2] = 0;
    }
    else {
      cycle_i[2]++;
    }
    hihat_closed = hihat_closed_keys[cycle_i[2]];
  }
}

// not in use
function assign_key() {
  let letters = [['z','x','c','v'],['a','s','d','f'],['u','i','o','p'],['h','j','k','l'],['q','w','e','r']]; // array of possible letters for inputs
  
  // shuffle instrument order and choose which ones to change based on round
  let instruments_to_change = shuffle(instruments).slice(0, round); 
  
  for (let i = 0; i < round; i++) {
    let instrument = instruments_to_change[i];
    if (instrument === 'bass') {
      bass = letters[0][round];
    } else if (instrument === 'snare') {
      snare = letters[1][round];
    } else if (instrument === 'hihat_closed') {
      hihat_closed = letters[2][round];
    } else if (instrument === 'hihat_open') {
      hihat_open = letters[3][round];
    } else if (instrument === 'crash') {
      crash = letters[4][round];
    }
  }
  
  instrumentKeys = {};
  instrumentKeys[bass] = 'bass';
  instrumentKeys[snare] = 'snare';
  instrumentKeys[hihat_closed] = 'hihat_closed';
  instrumentKeys[hihat_open] = 'hihat_open';
  instrumentKeys[crash] = 'crash';
}

function keyPressed() { 
  //button presses
  if (keyCode == 32) {
    if(!playing){
      playing = true;
      song_start_ms = millis();
    }
  } else{
    let instrument = null;
    if (key == bass) {
      instrument = 'bass';
    } else if (key == snare) {
      instrument = 'snare';
    } else if (key == hihat_closed) {
      instrument = 'hihat_closed';
    } else if (key == hihat_open) {
      instrument = 'hihat_open';
    } else if (key == crash) {
      instrument = 'crash';
    }

    if (instrument != null) {
      checkNote(instrument);
    }
  }
}

function checkNote(instrument) {
  let note_hit = false;

  for (let i = 0; i < current_notes.length; i++) {
    let note = current_notes[i];
    if (note[0] == instrument) {
      let elapsed_time = millis() - note[1];// record the time the note is hit
      let y = spawn + (elapsed_time / note_delay) * (button - spawn); // calculate the note's position

      // check if the note is hit or missed
      // EDIT: moved hitThreshold to be global -austin
      let position_Difference = y - button; // record difference between the note's position and the base position

      if (abs(position_Difference) <= hitThreshold) {// note is within the hit area
        note_hit = true;
        score += 1;
        let hitInfo = {// Store in data
          instrument: instrument,
          time: millis(),
          positionDifference: position_Difference,
          hit: true
        }
        hitData.push(hitInfo);

        hitTimes[instrument] = millis();

        console.log("Hit:", hitInfo);

        current_notes.splice(i, 1); // remove the note from current_notes
        i--; // adjust index
        
        cycle(instrument); // cycle the button -austin
        
        break; // found the note, break
      } else {
        //the right key is pressed but the timing is off
        let missInfo = {
          instrument: instrument,
          time: millis(),
          positionDifference: position_Difference,
          hit: false
        }
        hitData.push(missInfo);

        console.log('Miss (Timing Off):', missInfo);

        break;
      }
    }
  }

  if (!note_hit) {     // if the key pressed does not match any note in the hit area
    // Record a miss
    let missInfo = {
      instrument: instrument,
      time: millis(),
      positionDifference: null,
      hit: false
    }
    hitData.push(missInfo);

    console.log("Miss:",missInfo);
  }
}

function piano_rolling(roll) {
  if (current_beat < roll.length) {
    let calced_beat = ((millis() - song_start_ms) * bpm) / 60000 * 4;
    if (calced_beat >= current_beat + 1) {
      for (let j = 0; j < roll[current_beat].length; j++) {
        current_notes.push([roll[current_beat][j], millis(), false]);
      }
      current_beat += 1;
    }
  } else {
    if (current_notes.length == 0) {
      fill("white");
      text("Song is done", 300, 300);
      playing = false; // Stop playing when song is done

      console.log("Song is Over. Final Data:", hitData);
    }
  }
}

function draw_notes() {
  for (let i = 0; i < current_notes.length; i++) {
    let note = current_notes[i];
    let instrument = note[0];
    let start_ms = note[1];
    let elapsed_ms = millis() - start_ms;
    let y = spawn + (elapsed_ms / note_delay) * (button - spawn);
    if (y > button + hitThreshold && !note[3]) { // if no longer a hittable note, and this is the first time this is detected
      current_notes[i][3] = true;
      cycle(instrument);
    }
    if (y > res_y) { // check if note is leaving the screen
      current_notes.splice(i, 1); // Note missed, remove from list
      i--; // Adjust index
      let missInfo = { // Record a miss
        instrument: instrument,
        time: millis(),
        positionDifference: null,
        hit: false
      }
      hitData.push(missInfo);

      console.log('Miss:',missInfo);
    } else {
      if (instrument == "bass") {
        fill("red");
        rect(bass_x, y, note_size, note_size);
      } else if (instrument == "snare") {
        fill("orange");
        rect(snare_x, y, note_size, note_size);
      } else if (instrument == "hihat_closed") {
        fill("yellow");
        rect(hihat_c_x, y, note_size, note_size);
      } else if (instrument == "hihat_open") {
        fill("green");
        rect(hihat_o_x, y, note_size, note_size);
      } else if (instrument == "crash") {
        fill("blue");
        rect(crash_x, y, note_size, note_size);
      }
    }
  }
}


function draw_base(){
  let colors = ["darkred", "darkorange", "khaki", "darkgreen", "darkblue"];
  let x = [bass_x, snare_x, hihat_c_x, hihat_o_x, crash_x];
  base_buffer = 0;
  for (k = 0; k < 5; k++){
    let instrument = instruments[k];
    let time = millis();
    let is_hit = (time - hitTimes[instrument] < feedback_time);
    let borderColor = is_hit ? "white" : colors[k];
    stroke(borderColor);
    strokeWeight(5);

    line(x[k] - note_size - base_buffer, button - note_size - base_buffer, x[k] + note_size + base_buffer, button - note_size - base_buffer);
    line(x[k] - note_size - base_buffer, button + note_size + base_buffer, x[k] + note_size + base_buffer, button + note_size + base_buffer);
    line(x[k] - note_size - base_buffer, button - note_size - base_buffer, x[k] - note_size - base_buffer, button + note_size + base_buffer);
    line(x[k] + note_size + base_buffer, button - note_size - base_buffer, x[k] + note_size + base_buffer, button + note_size + base_buffer);
    stroke("black");
    if (k < 3) { // if bass, snare, or hihat; i.e. if a cycling instrument
      for (c = 0; c < 4; c++) { // iterating through the 4 keys
        textSize(32);
        fill("darkgrey");
        if (c == cycle_i[k]) { // if this is the current keybind
          fill("white");
          textSize(42);
        }
        text(master_keys[k][c], x[k] - text_xbuffer + (c * letter_buffer), button + text_ybuffer);
      }
    }
    else {
      fill("white");
      textSize(42);
      text(master_keys[k], x[k] - text_cbuffer, button + text_ybuffer);
      textSize(32);
    }
  }
  strokeWeight(2);
}

function draw() {
  // initialize canvas
  background("black");
  fill("white");
  textSize(32);
  
  if (playing) {
    text("Score: " + score, 20, 50);
    // assign new keys if round changes
    // DAVID TO UPDATE BASED ON APPROPRIATE ROUND PROGRESSION LOGIC
    //if (current_beat % 16 == 0 && current_beat !== 0 && round < 5) {
    //  assign_key();
    //  round +=1;
    //}
    
    piano_rolling(piano_roll_1);
    draw_notes();
    draw_base();
  }
  else {
    if (current_beat >= piano_roll_1.length && current_notes.length == 0) {
      // song is over
      fill("white");
      textSize(32);
      text("Song is done", 300, 300);
      text("Final Score: " + score, 300, 350);
    } else {
    textStyle(BOLD);
    text("WELCOME TO RYTHM MASTER!", 20, 100);
    textStyle(NORMAL);
    textStyle(ITALIC);
    text("You can control 5 instruments with different keys on your keyboard to play a song.\nWhen a note lands, press the corresponding key below each instrument to play.\nThe set of key used will shift 4 times throughout the game.\nYour goal is to adjust to the new set of keys as quickly as possible.", 20, 160);
    textStyle(NORMAL);
    textStyle(BOLD);
    text("Press the space bar to let the music begin!", 20, 350);
        if (current_beat >= piano_roll_1.length && current_notes.length == 0) {
      text("Final Score: " + score, 20, 400);
        }
    }
  }
}