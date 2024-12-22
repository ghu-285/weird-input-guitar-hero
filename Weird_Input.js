// variables
let easy_first = false; // makes it so the easy trials are tested first

let bpm = 25; // beats per minute for the song

let phase1 = true; // study is in first set of trials

let instruments = ['bass', 'snare', 'hihat_closed', 'hihat_open', 'crash'];
let current_trial = 1;
let trial_num = 1; // change to what you think is adequate
let title_screen = true;
let title_screen2 = false;
let end_screen = false;
// let round = 0; // tracking which round user is on

let bass = 'd'; // current button for the bass drum
let snare = 'f';
let hihat_closed = 'g';
let hihat_open = 'h';
let crash = 'j';

let bass_ez = 'd';
let snare_ez = 'f';
let hihat_c_ez = 'g';
let hihat_o_ez = 'h';
let crash_ez = 'j';

let bass_hard = 'g';
let snare_hard = 'j';
let hihat_c_hard = 'd';
let hihat_o_hard = 'f';
let crash_hard = 'h';

let master_keys = [bass, snare, hihat_closed, hihat_open, crash];

// defunct
//let bass_keys = ['z','x','c','v']; // keys to cycle through
//let snare_keys = ['a','s','d','f'];
//let hihat_closed_keys = ['u','i','o','p'];
//let cycle_i = [0, 0, 0]; // array of current (instrument)_keys indices, in bass snare hihat order

let bass_x = 100; // x value at which bass drum notes spawn
let snare_x = 250;
let hihat_c_x = 400;
let hihat_o_x = 550;
let crash_x = 700;
let spawn = 0; // y value at which all notes spawn
let button = 900; // y value at which the notes match up with their button indicator

let playing = false; // is a song playing
let note_size = 35; // the size of the falling notes; think ddr arrows
let text_ybuffer = note_size + 38; // buffer between the button text and the button
let text_xbuffer = 50; // buffer text to the left of the button
let text_cbuffer = 6; // buffer so that open hihat and crash letters are centered
let letter_buffer = 30; // buffer between letters in the button ui
let res_x = 800;
let res_y = 1080;

let hitTimes = {'bass':0,'snare':0,'hihat_closed':0,'hihat_open':0,'crash':0}
let feedback_time = 50;

let hitThreshold = note_size * 1.95; // THIS CAN BE ADJUSTED to classify what counts as hit

let current_beat = 0; // this says "beat" but it is actually counting 16th notes, if you care
let current_notes = []; // list of all notes currently "in play" (on the screen), where a note is itself a list of two items: the instrument it belongs to, and the millisecond since song start it first appeared on screen
// EDIT: notes are now 3 items long, the third being a boolean for whether it has passed the hit threshold and is no longer hittable (for cycling purposes)
let song_start_ms; // the millisecond (counted in milliseconds after program start) that the current playing song begins
let note_delay = 3000; // how many milliseconds a note appears before it needs to be pressed

let num_notes = 0; // the number of notes that were spawned in the game


let piano_roll_1 = [["bass"], [], [], [], ["bass"], [], [], [], ["bass"], [], [], [], ["bass"], [], ["hihat_open"], [], ["bass", "crash"], [], [], [], ["snare"], [], ["snare"], [], ["bass", "hihat_open"], [], ["crash"], [], ["snare"], ["crash"], ["hihat_closed"], ["hihat_closed"], ["bass", "crash"], [], ["hihat_closed", "snare"], ["hihat_closed"], ["bass", "snare", "hihat_open"], ["bass"], ["hihat_closed"], ["hihat_closed"], ["bass", "hihat_closed"], ["hihat_closed", "bass"], ["hihat_open", "crash"], [], ["bass", "snare", "hihat_open"], ["bass"], ["hihat_open"], ["crash"], ["bass"], ["hihat_closed"], ["bass", "hihat_closed", "snare"], ["hihat_open"], ["snare", "crash"], ["hihat_closed"], ["bass", "hihat_closed"], ["hihat_open"],["bass"], ["hihat_closed"], ["bass", "crash"], ["hihat_closed"], ["snare"], ["hihat_open"], ["bass", "crash"], ["crash", "snare", "bass"]];


let score = 0; // Initialize score
let hitData = []; // Array to store hit/miss information
let instrumentKeys = {}; // Object to map keys to instruments

function setup() {
  //add code here that runs ONCE, on start of the program
  createCanvas(res_x, res_y);
  background(0, 0, 0);
  rectMode(RADIUS);
  strokeWeight(2);
  if (easy_first) {
    trial_num = 3;
  }
  else {
    trial_num = 7;
    bass = bass_hard;
    snare = snare_hard;
    hihat_closed = hihat_c_hard;
    hihat_open = hihat_o_hard;
    crash = crash_hard;
    master_keys = [bass, snare, hihat_closed, hihat_open, crash];
  }
  // control_first = random([true, false]); // as in players will go through the control version with normal inputs first
}

//defunct
//function cycle(instrument) {
//  if (instrument == "bass") {
//    if (cycle_i[0] == 3) {
//      cycle_i[0] = 0;
//    }
//    else {
//      cycle_i[0]++;
//    }
//    bass = bass_keys[cycle_i[0]];
//  }
//  else if (instrument == "snare") {
//    if (cycle_i[1] == 3) {
//      cycle_i[1] = 0;
//    }
//    else {
//      cycle_i[1]++;
//    }
//    snare = snare_keys[cycle_i[1]];
//  }
//  else if (instrument == "hihat_closed") {
//    if (cycle_i[2] == 3) {
//      cycle_i[2] = 0;
//    }
//    else {
//      cycle_i[2]++;
//    }
//    hihat_closed = hihat_closed_keys[cycle_i[2]];
//  }
//}

// not in use
//function assign_key() {
//  let letters = [['z','x','c','v'],['a','s','d','f'],['u','i','o','p'],['h','j','k','l'],['q','w','e','r']]; // array of possible letters for inputs
  
  // shuffle instrument order and choose which ones to change based on round
//  let instruments_to_change = shuffle(instruments).slice(0, round); 
  
//  for (let i = 0; i < round; i++) {
//    let instrument = instruments_to_change[i];
//    if (instrument === 'bass') {
//      bass = letters[0][round];
//    } else if (instrument === 'snare') {
//      snare = letters[1][round];
//    } else if (instrument === 'hihat_closed') {
//      hihat_closed = letters[2][round];
//    } else if (instrument === 'hihat_open') {
//      hihat_open = letters[3][round];
//    } else if (instrument === 'crash') {
//      crash = letters[4][round];
//    }
//  }
//  
//  instrumentKeys = {};
//  instrumentKeys[bass] = 'bass';
//  instrumentKeys[snare] = 'snare';
//  instrumentKeys[hihat_closed] = 'hihat_closed';
//  instrumentKeys[hihat_open] = 'hihat_open';
//  instrumentKeys[crash] = 'crash';
//}

function keyPressed() { 
  //button presses
  if (keyCode == 32) {
    if(!playing && current_trial <= trial_num){
      playing = true;
      song_start_ms = millis();
      logged = false;
      title_screen = false;
      title_screen2 = false;
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

        // console.log("Hit:", hitInfo);

        current_notes.splice(i, 1); // remove the note from current_notes
        i--; // adjust index
        
        //cycle(instrument); // cycle the button -austin
        
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

        // console.log('Miss (Timing Off):', missInfo);

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

    // console.log("Miss:",missInfo);
  }
}

function logData(){
  console.log("Instrument,Time,PositionDifference,Hit");
  hitData.forEach(function(item){
    console.log(
      item.instrument + ',' +
      item.time + ',' +
      item.positionDifference+ ',' +
      item.hit
    );
  });
}

function piano_rolling(roll) {
  if (current_beat < roll.length) {
    let calced_beat = ((millis() - song_start_ms) * bpm) / 60000 * 4;
    if (calced_beat >= current_beat + 1) {
      for (let j = 0; j < roll[current_beat].length; j++) {
        current_notes.push([roll[current_beat][j], millis(), false]);
        num_notes++;
      }
      current_beat += 1;
    }
  } else {
    if (current_notes.length == 0) {
      // text("Song is done", 300, 300);
      current_trial++;
      playing = false; // Stop playing when song is done

      console.log("Trial " + (current_trial - 1) + " finished");
      logData();
      console.log(score)

      //reset all vars
      current_beat = 0;
      num_notes = 0;
      score = 0;
      hitData = [];
      hitTimes = {'bass':0,'snare':0,'hihat_closed':0,'hihat_open':0,'crash':0};
      if (current_trial > trial_num) {
        console.log("Phase finished");
        if (phase1) {
          if (easy_first) {  
            trial_num = 7;
            bass = bass_hard;
            snare = snare_hard;
            hihat_closed = hihat_c_hard;
            hihat_open = hihat_o_hard;
            crash = crash_hard;
          }
          else {
            trial_num = 3;
            bass = bass_ez;
            snare = snare_ez;
            hihat_closed = hihat_c_ez;
            hihat_open = hihat_o_ez;
            crash = crash_ez;
          }
          master_keys = [bass, snare, hihat_closed, hihat_open, crash];
          current_trial = 1;
          title_screen2 = true;
        }
        else {
          end_screen = true;
        }
        phase1 = false;
      }
    }
    if (current_notes.length == 0 && current_trial == trial_num && !logged){
      fill("white");
      logData();
      console.log(score);
      logged = true;
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
    //if (y > button + hitThreshold && !note[2]) { // if no longer a hittable note, and this is the first time this is detected
    //  current_notes[i][2] = true;
    //  cycle(instrument);
    //}
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

      // console.log('Miss:',missInfo);
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
    fill("white");
    textSize(42);
    text(master_keys[k], x[k] - text_cbuffer, button + text_ybuffer);
    textSize(32);
  }
  strokeWeight(2);
}

function draw() {
  // initialize canvas
  background("black");
  fill("white");
  textSize(32);
  
  if (playing) {
    // text("Score: " + score, 20, 50);
    // assign new keys if round changes
    //if (current_beat % 16 == 0 && current_beat !== 0 && round < 5) {
    //  assign_key();
    //  round +=1;
    //}
    
    piano_rolling(piano_roll_1);
    draw_notes();
    draw_base();
  }
  else {
    if (title_screen) {
      textStyle(BOLD);
      text("Welcome to Generic Rhythm Game!", 125, 100);
      textStyle(NORMAL);
      textStyle(ITALIC);
      text("In GRG, you will control 5 instruments to play a song.\n"+
          "Each instrument has its own column, and falling notes \n" +
          "will move towards a hollow indicator. When a note \n" +
          "aligns within the indicator, you will press the keyboard \n" +
          "button associated with that instrument. Your timing \n" +
          "matters, so try to press the button when the note is \n" +
          "perfectly aligned. Do not spam.", 20, 160);
      if (easy_first) {
        text("Please prepare to press the following keys:", 90, 480);
        textStyle(NORMAL);
        textStyle(BOLD);
        textSize(64);
        fill("red");
        text("D", 270, 575);
        fill("orange");
        text("F", 320, 575);
        fill("yellow");
        text("G", 365, 575);
        fill("green");
        text("H", 420, 575);
        fill("blue");
        text("J", 472, 575);
        textStyle(NORMAL);
        textStyle(BOLD);
        textSize(32);
        fill("pink");
        text("Press the space bar to start!", 175, 675);
        fill("white");
      }
      else {
        text("Please prepare to press the following keys:", 90, 480);
        textStyle(NORMAL);
        textStyle(BOLD);
        textSize(64);
        fill("yellow");
        text("D", 270, 575);
        fill("green");
        text("F", 320, 575);
        fill("red");
        text("G", 365, 575);
        fill("blue");
        text("H", 420, 575);
        fill("orange");
        text("J", 472, 575);
        textStyle(NORMAL);
        textStyle(BOLD);
        textSize(32);
        fill("pink");
        text("Press the space bar to start!", 175, 675);
        fill("white");
      }
    }
    else if (title_screen2) {
      text("Phase 1 complete.", res_x / 2 - 125, 50);
      text("Phase 2 will use different buttons for each \n" +
           "instrument. Everything else is the same.", 100, 100);
      if (easy_first) {
        text("Old buttons:", res_x / 2 - 90, 300);
        textStyle(NORMAL);
        textStyle(BOLD);
        textSize(64);
        fill("red");
        text("D", 280, 400);
        fill("orange");
        text("F", 330, 400);
        fill("yellow");
        text("G", 375, 400);
        fill("green");
        text("H", 430, 400);
        fill("blue");
        text("J", 482, 400);
        
        textStyle(NORMAL);
        fill("white");
        textSize(32);
        text("New buttons:", res_x / 2 - 90, 500);
        textStyle(BOLD);
        textSize(64);
        fill("yellow");
        text("D", 280, 600);
        fill("green");
        text("F", 330, 600);
        fill("red");
        text("G", 375, 600);
        fill("blue");
        text("H", 430, 600);
        fill("orange");
        text("J", 482, 600);
        textSize(32);
        fill("white");
      }
      else {
        text("Old buttons:", res_x / 2 - 90, 300);
        textStyle(NORMAL);
        textStyle(BOLD);
        textSize(64);
        fill("yellow");
        text("D", 280, 400);
        fill("green");
        text("F", 330, 400);
        fill("red");
        text("G", 375, 400);
        fill("blue");
        text("H", 430, 400);
        fill("orange");
        text("J", 482, 400);
        
        textStyle(NORMAL);
        fill("white");
        textSize(32);
        text("New buttons:", res_x / 2 - 90, 500);
        textStyle(BOLD);
        textSize(64);
        fill("red");
        text("D", 280, 600);
        fill("orange");
        text("F", 330, 600);
        fill("yellow");
        text("G", 375, 600);
        fill("green");
        text("H", 430, 600);
        fill("blue");
        text("J", 482, 600);
        textSize(32);
      }
      fill("pink");
      textSize(32);
      text("Press the space bar to continue.", 160, 700);
      fill("white");
    }
    else if (end_screen) {
      text("Tests complete. Thank you!", res_x / 2 - 190, res_y / 2 - 25);
    }
    else {
      // song is over
      fill("white");
      textSize(32);
      text("Trial "+(current_trial-1)+" complete.", res_x / 2 - 125, res_y / 2 - 50);
      text("Press the space bar to continue.", res_x / 2 - 250, res_y / 2);
      // text("Final Score: " + score + " / " + num_notes, res_x / 2 - 125, res_y / 2 + 50);
    }
  }
}