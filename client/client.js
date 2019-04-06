console.log('🔥');




document.addEventListener("DOMContentLoaded", function(event) {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  let audioContext = new AudioContext();

  let speedSlider = document.getElementById('speed-slider');
  let speedValue = 1; 

  let loadedBuffer; 
  let sourceNode;

  let timeAtPause = 0;

  speedSlider.addEventListener('input', function(e) {
    speedValue = parseFloat(e.target.value);
    displaySpeed(speedValue)
    sourceNode.playbackRate.value = speedValue;
  })


  let formDiv = document.getElementById('form')
  let loadButton = document.getElementById('load');
  let linkInput = document.getElementById('link-input');
  let info = document.getElementById('info');

  let loadingText = document.getElementById('loading-text');

  let controlsDiv = document.getElementById('controls')
  let playButton = document.getElementById('play');
  let preview = document.getElementById('preview');

  let isPlaying = false;
  let video_id = '';


  if(window.location.search) {
    video_id = window.location.search;
    show(loadingText)
    hide(formDiv);
    let linkSlice = sliceFullLink(linkInput.value);

    sendRequest(video_id.slice(3), function() {
      hide(loadingText);
      hide(info)
      show(controlsDiv);
      showPic(video_id.slice(3))
    });
  }

  loadButton.addEventListener('click', function(e){
      let linkSlice = sliceFullLink(linkInput.value);

      if(linkSlice.length > 0) {
        show(loadingText)
        hide(formDiv);
        sendRequest(linkSlice, function(){
          hide(loadingText);
          hide(info)
          show(controlsDiv);
          showPic(linkSlice)
        })
      }

    
  })


    function pause() {
      audioContext.suspend().then(() => {
        timeAtPause = audioContext.currentTime; 
        audioContext.pause
        sourceNode.stop(0);
        isPlaying = false;
      })
    }

    function playBuffer() {
      console.log("playing at")
      isPlaying = true
        sourceNode = audioContext.createBufferSource();
        sourceNode.loop = true;
        sourceNode.buffer = loadedBuffer;
        sourceNode.playbackRate.value = speedValue;
        sourceNode.connect(audioContext.destination);
        sourceNode.start(0, timeAtPause);
    }

  function play() {
    audioContext.resume().then(()=> {
      if(!isPlaying) {
        audioContext.resume().then(()=> {

        playBuffer();
        })
      } else {
        pause()
      }    
    }).then(() => {
      document.getElementById('play').innerHTML = isPlaying ? "Pause" :  "Play"
    })
  }

  playButton.addEventListener('click', function(e){
    play();
  })

  preview.addEventListener('click', function(){
    play();
  })
  
  function sendRequest(id, callback) {
    fetch(`/stream/${id}`, {
      method: 'POST'
    })
    .then(res => res.arrayBuffer())
    .then(data => {
      audioContext.decodeAudioData(data, buffer => {
        loadedBuffer = buffer
            // bufferSource.playbackRate.value = speedValue;
            // bufferSource.connect(audioContext.destination);
        callback();
      })
    })
  }

  function showPic(id) {
    preview.src = "http://i3.ytimg.com/vi/"+ id +"/hqdefault.jpg";

  }
  
  function hide(elm) {
    elm.classList = 'hidden';
  }
  
  function show(elm) {
    elm.classList = '';
  }

  function displaySpeed(speed) {
    document.getElementById('speed-display').innerHTML = speed + 'x';
  }

  function sliceFullLink(link) {
    let id = '';
    let slicePoint = link.indexOf('?v=')
    return link.slice(slicePoint+3)
  }
});

