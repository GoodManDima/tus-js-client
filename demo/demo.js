/* global tus */
/* eslint no-console: 0 */

var upload = null;
var file = null;
var options = null;

var resumeBtn = document.querySelector("#resume-btn");
var pauseBtn = document.querySelector("#pause-btn");
var cancelBtn = document.querySelector("#cancel-btn");

var resumeCheckbox = document.querySelector("#resume");
var input = document.querySelector("input[type=file]");
var progress = document.querySelector(".progress");
var progressBar = progress.querySelector(".progress-bar");
var alertBox = document.querySelector("#support-alert");
var chunkInput = document.querySelector("#chunksize");
var endpointInput = document.querySelector("#endpoint");
var uploaded = document.querySelector("#uploaded");

if (!tus.isSupported) {
  alertBox.removeAttribute("hidden");
}

pauseBtn.addEventListener("click", function (e) {
  e.preventDefault();

  if (upload) {
    upload.abort();
    resumeBtn.removeAttribute("hidden");
    pauseBtn.setAttribute("hidden", true);
  }

});

resumeBtn.addEventListener("click", function (e) {
  e.preventDefault();

  if (upload) {
    startUpload();
    resumeBtn.setAttribute("hidden", true);
    pauseBtn.removeAttribute("hidden");
  }

});

cancelBtn.addEventListener("click", function (e) {
  e.preventDefault();

  if (upload) {
    upload.cancel();
  }

});

input.addEventListener("change", function (e) {
  file = e.target.files[0];

  if (!file) {
      return;
  }

  startUpload();

});

function startUpload(){

  pauseBtn.removeAttribute("hidden");
  cancelBtn.removeAttribute("hidden");

  var chunkSize = parseInt(chunkInput.value, 10);
  if (isNaN(chunkSize)) {
    chunkSize = Infinity;
  }

  options = {
    endpoint: endpointInput.value,
    resume: !resumeCheckbox.checked,
    chunkSize: chunkSize,
    retryDelays: [0, 1000, 2000],
    metadata: {
        filename: file.name
    },
    onError: function (error) {
      if (error.originalRequest) {
        if (confirm("Failed because: " + error + "\nDo you want to retry?")) {
          options.resume = false;
          options.uploadUrl = upload.url;
          upload = new tus.Upload(file, options);
          upload.start();
          return;
        }
      } else {
        alert("Failed because: " + error);
      }

      reset();
    },
    onProgress: function (bytesUploaded, bytesTotal) {
      var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
      progressBar.style.width = percentage + "%";
    },
    onSuccess: function () {
      reset();
      var anchor = document.createElement("a");
      anchor.textContent = "Download " + upload.file.name + " (" + upload.file.size + " bytes)";
      anchor.href = upload.url;
      anchor.className = "btn btn-success";
      uploaded.appendChild(anchor);
    },
    onCancelError: function (error) {
      console.log(error);
    },
    onCancelSuccess: function () {
      upload = null;
      reset();
    }
  };

  upload = new tus.Upload(file, options);
  upload.start();
}

function reset() {
  input.value = "";
  progressBar.style.width = "0%";
  resumeBtn.setAttribute("hidden", true);
  cancelBtn.setAttribute("hidden", true);
  pauseBtn.setAttribute("hidden", true);
  progress.classList.remove("active");
}
