var audioContext = new (window.AudioContext || window.webkitAudioContext)();
var bufferSize = 4096;
var brownNoise = (function() {
    var lastOut = 0.0;
    var node = audioContext.createScriptProcessor(bufferSize, 1, 1);
    node.onaudioprocess = function(e) {
        var output = e.outputBuffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
            var white = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5; // (roughly) compensate for gain
        }
    }
    return node;
})();

function makeNoise() {
  document.querySelector('.button').setAttribute('id', 'noisy')
  document.querySelector('.button').innerText = "Okay, I'm done now"
  return brownNoise.connect(audioContext.destination);
}

function shutUp() {
  document.querySelector('.button').setAttribute('id', 'quiet')
  document.querySelector('.button').innerText = "TUNE OUT THE WORLD"
  return brownNoise.disconnect(audioContext.destination);
}

$('body').on('click', '.button#quiet', function(e) {
  e.preventDefault()
  makeNoise()
})

$('body').on('click', '.button#noisy', function(e) {
  e.preventDefault()
  shutUp()
})
