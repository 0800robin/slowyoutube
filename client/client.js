console.log('hello world');

document.addEventListener("DOMContentLoaded", function(event) {
  let audioContext = new AudioContext();
  const bufferSource = audioContext.createBufferSource()
  let speedSlider = document.getElementById('speed-slider');
  let speedValue = 1; 

  var haveSentRequest = false;
  var loading = false; 

  speedSlider.addEventListener('change', function(e) {
    speedValue = parseFloat(e.target.value);
    console.log(speedValue);
    bufferSource.playbackRate.value = speedValue;
  })



  var playButton = document.getElementById('play');
  // var pauseButton = document.getElementById('pause');

  var loadButton = document.getElementById('load');
  var linkInput = document.getElementById('link-input');
  var loadingText = document.getElementById('loading-text');
  var preview = document.getElementById('preview');

  var video_id = '';


  loadButton.addEventListener('click', function(e){
      sendRequest(sliceFullLink(linkInput.value), function(){
        hide(loadingText);
        show(speedSlider);
        show(playButton);
      })
    
  })

  if(window.location.search) {
    video_id = window.location.search ;
    console.log(video_id);

    sendRequest(video_id.slice(3), function() {
      hide(loadingText);
    
      show(speedSlider);
      show(playButton);

    });
  }


  playButton.addEventListener('click', function(e){
    audioContext.resume().then(()=> {
      bufferSource.start(0)
    })

  })

  // pauseButton.addEventListener('click', function(e){
  //   bufferSource.stop()
  // });



  
  function sendRequest(id, fn) {
    const request = new XMLHttpRequest()
    console.log(request);
    let thing = id;
    request.open('POST', `/stream/${id}`, true)

    request.responseType = 'arraybuffer'
    request.onload = function() {
      audioContext.decodeAudioData(request.response, buffer => {
  
        console.log(buffer);
        bufferSource.buffer = buffer
        bufferSource.playbackRate.value = speedValue;
        bufferSource.connect(audioContext.destination);

        if(fn) {
          fn();
        }
      })
    }
    request.send();
    haveSentRequest = true;
    sentRequest(id);
    
  }

  function sentRequest(id) {
    hide(linkInput);
    hide(loadButton);
    console.log("http://i3.ytimg.com/vi/"+id +"/hqdefault.jpg");
    preview.src = "http://i3.ytimg.com/vi/"+id +"/hqdefault.jpg";
    show(preview);
    show(loadingText);
  }


  
  function loading(){
  
  }
  
  function finishedLoading() {
  
  }
  
  function hide(elm) {
    elm.classList='hidden';
  }
  
  function show(elm) {
    console.log(elm.classList)
    elm.classList='';
  }

  function sliceFullLink(link) {
    let id = '';
    let slicePoint = link.indexOf('?v=')
    return link.slice(slicePoint+3)
  }
});

