(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.tus = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encode = encode;
/* global: window */

var _window = window,
    btoa = _window.btoa;
function encode(data) {
  return btoa(unescape(encodeURIComponent(data)));
}

var isSupported = exports.isSupported = "btoa" in window;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newRequest = newRequest;
exports.resolveUrl = resolveUrl;

var _resolveUrl = require("resolve-url");

var _resolveUrl2 = _interopRequireDefault(_resolveUrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function newRequest() {
  return new window.XMLHttpRequest();
} /* global window */
function resolveUrl(origin, link) {
  return (0, _resolveUrl2.default)(origin, link);
}

},{"resolve-url":10}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getSource = getSource;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileSource = function () {
  function FileSource(file) {
    _classCallCheck(this, FileSource);

    this._file = file;
    this.size = file.size;
  }

  _createClass(FileSource, [{
    key: "slice",
    value: function slice(start, end) {
      return this._file.slice(start, end);
    }
  }, {
    key: "close",
    value: function close() {}
  }]);

  return FileSource;
}();

function getSource(input) {
  // Since we emulate the Blob type in our tests (not all target browsers
  // support it), we cannot use `instanceof` for testing whether the input value
  // can be handled. Instead, we simply check is the slice() function and the
  // size property are available.
  if (typeof input.slice === "function" && typeof input.size !== "undefined") {
    return new FileSource(input);
  }

  throw new Error("source object may only be an instance of File or Blob in this environment");
}

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setItem = setItem;
exports.getItem = getItem;
exports.removeItem = removeItem;
/* global window, localStorage */

var hasStorage = false;
try {
  hasStorage = "localStorage" in window;

  // Attempt to store and read entries from the local storage to detect Private
  // Mode on Safari on iOS (see #49)
  var key = "tusSupport";
  localStorage.setItem(key, localStorage.getItem(key));
} catch (e) {
  // If we try to access localStorage inside a sandboxed iframe, a SecurityError
  // is thrown. When in private mode on iOS Safari, a QuotaExceededError is
  // thrown (see #49)
  if (e.code === e.SECURITY_ERR || e.code === e.QUOTA_EXCEEDED_ERR) {
    hasStorage = false;
  } else {
    throw e;
  }
}

var canStoreURLs = exports.canStoreURLs = hasStorage;

function setItem(key, value) {
  if (!hasStorage) return;
  return localStorage.setItem(key, value);
}

function getItem(key) {
  if (!hasStorage) return;
  return localStorage.getItem(key);
}

function removeItem(key) {
  if (!hasStorage) return;
  return localStorage.removeItem(key);
}

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DetailedError = function (_Error) {
  _inherits(DetailedError, _Error);

  function DetailedError(error) {
    var causingErr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var xhr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, DetailedError);

    var _this = _possibleConstructorReturn(this, (DetailedError.__proto__ || Object.getPrototypeOf(DetailedError)).call(this, error.message));

    _this.originalRequest = xhr;
    _this.causingError = causingErr;

    var message = error.message;
    if (causingErr != null) {
      message += ", caused by " + causingErr.toString();
    }
    if (xhr != null) {
      message += ", originated from request (response code: " + xhr.status + ", response text: " + xhr.responseText + ")";
    }
    _this.message = message;
    return _this;
  }

  return DetailedError;
}(Error);

exports.default = DetailedError;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fingerprint;
/**
 * Generate a fingerprint for a file which will be used the store the endpoint
 *
 * @param {File} file
 * @return {String}
 */
function fingerprint(file) {
  return ["tus", file.name, file.type, file.size, file.lastModified].join("-");
}

},{}],7:[function(require,module,exports){
"use strict";

var _upload = require("./upload");

var _upload2 = _interopRequireDefault(_upload);

var _storage = require("./node/storage");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global window */
var defaultOptions = _upload2.default.defaultOptions;


if (typeof window !== "undefined") {
  // Browser environment using XMLHttpRequest
  var _window = window,
      XMLHttpRequest = _window.XMLHttpRequest,
      Blob = _window.Blob;


  var isSupported = XMLHttpRequest && Blob && typeof Blob.prototype.slice === "function";
} else {
  // Node.js environment using http module
  var isSupported = true;
}

// The usage of the commonjs exporting syntax instead of the new ECMAScript
// one is actually inteded and prevents weird behaviour if we are trying to
// import this module in another module using Babel.
module.exports = {
  Upload: _upload2.default,
  isSupported: isSupported,
  canStoreURLs: _storage.canStoreURLs,
  defaultOptions: defaultOptions
};

},{"./node/storage":4,"./upload":8}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global window */


// We import the files used inside the Node environment which are rewritten
// for browsers using the rules defined in the package.json


var _fingerprint = require("./fingerprint");

var _fingerprint2 = _interopRequireDefault(_fingerprint);

var _error = require("./error");

var _error2 = _interopRequireDefault(_error);

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _request = require("./node/request");

var _source = require("./node/source");

var _base = require("./node/base64");

var Base64 = _interopRequireWildcard(_base);

var _storage = require("./node/storage");

var Storage = _interopRequireWildcard(_storage);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultOptions = {
  endpoint: "",
  fingerprint: _fingerprint2.default,
  resume: true,
  onProgress: null,
  onChunkComplete: null,
  onSuccess: null,
  onError: null,
  headers: {},
  chunkSize: Infinity,
  withCredentials: false,
  uploadUrl: null,
  uploadSize: null,
  overridePatchMethod: false,
  retryDelays: null
};

var Upload = function () {
  function Upload(file, options) {
    _classCallCheck(this, Upload);

    this.options = (0, _extend2.default)(true, {}, defaultOptions, options);

    // The underlying File/Blob object
    this.file = file;

    // The URL against which the file will be uploaded
    this.url = null;

    // The underlying XHR object for the current PATCH request
    this._xhr = null;

    // The fingerpinrt for the current file (set after start())
    this._fingerprint = null;

    // The offset used in the current PATCH request
    this._offset = null;

    // True if the current PATCH request has been aborted
    this._aborted = false;

    // The file's size in bytes
    this._size = null;

    // The Source object which will wrap around the given file and provides us
    // with a unified interface for getting its size and slice chunks from its
    // content allowing us to easily handle Files, Blobs, Buffers and Streams.
    this._source = null;

    // The current count of attempts which have been made. Null indicates none.
    this._retryAttempt = 0;

    // The timeout's ID which is used to delay the next retry
    this._retryTimeout = null;

    // The offset of the remote upload before the latest attempt was started.
    this._offsetBeforeRetry = 0;
  }

  _createClass(Upload, [{
    key: "start",
    value: function start() {
      var _this = this;

      var file = this.file;

      if (!file) {
        this._emitError(new Error("tus: no file or stream to upload provided"));
        return;
      }

      if (!this.options.endpoint) {
        this._emitError(new Error("tus: no endpoint provided"));
        return;
      }

      var source = this._source = (0, _source.getSource)(file, this.options.chunkSize);

      // Firstly, check if the caller has supplied a manual upload size or else
      // we will use the calculated size by the source object.
      if (this.options.uploadSize != null) {
        var size = +this.options.uploadSize;
        if (isNaN(size)) {
          throw new Error("tus: cannot convert `uploadSize` option into a number");
        }

        this._size = size;
      } else {
        var _size = source.size;

        // The size property will be null if we cannot calculate the file's size,
        // for example if you handle a stream.
        if (_size == null) {
          throw new Error("tus: cannot automatically derive upload's size from input and must be specified manually using the `uploadSize` option");
        }

        this._size = _size;
      }

      var retryDelays = this.options.retryDelays;
      if (retryDelays != null) {
        if (Object.prototype.toString.call(retryDelays) !== "[object Array]") {
          throw new Error("tus: the `retryDelays` option must either be an array or null");
        } else {
          var errorCallback = this.options.onError;
          this.options.onError = function (err) {
            // Restore the original error callback which may have been set.
            _this.options.onError = errorCallback;

            // We will reset the attempt counter if
            // - we were already able to connect to the server (offset != null) and
            // - we were able to upload a small chunk of data to the server
            var shouldResetDelays = _this._offset != null && _this._offset > _this._offsetBeforeRetry;
            if (shouldResetDelays) {
              _this._retryAttempt = 0;
            }

            var isOnline = true;
            if (typeof window !== "undefined" && "navigator" in window && window.navigator.onLine === false) {
              isOnline = false;
            }

            // We only attempt a retry if
            // - we didn't exceed the maxium number of retries, yet, and
            // - this error was caused by a request or it's response and
            // - the error is not a client error (status 4xx) and
            // - the browser does not indicate that we are offline
            var shouldRetry = _this._retryAttempt < retryDelays.length && err.originalRequest != null && !inStatusCategory(err.originalRequest.status, 400) && isOnline;

            if (!shouldRetry) {
              _this._emitError(err);
              return;
            }

            var delay = retryDelays[_this._retryAttempt++];

            _this._offsetBeforeRetry = _this._offset;
            _this.options.uploadUrl = _this.url;

            _this._retryTimeout = setTimeout(function () {
              _this.start();
            }, delay);
          };
        }
      }

      // Reset the aborted flag when the upload is started or else the
      // _startUpload will stop before sending a request if the upload has been
      // aborted previously.
      this._aborted = false;

      // A URL has manually been specified, so we try to resume
      if (this.options.uploadUrl != null) {
        this.url = this.options.uploadUrl;
        this._resumeUpload();
        return;
      }

      // Try to find the endpoint for the file in the storage
      if (this.options.resume) {
        this._fingerprint = this.options.fingerprint(file);
        var resumedUrl = Storage.getItem(this._fingerprint);

        if (resumedUrl != null) {
          this.url = resumedUrl;
          this._resumeUpload();
          return;
        }
      }

      // An upload has not started for the file yet, so we start a new one
      this._createUpload();
    }
  }, {
    key: "abort",
    value: function abort() {
      if (this._xhr !== null) {
        this._xhr.abort();
        this._source.close();
        this._aborted = true;
      }

      if (this._retryTimeout != null) {
        clearTimeout(this._retryTimeout);
        this._retryTimeout = null;
      }
    }
  }, {
    key: "cancel",
    value: function cancel() {
      var _this2 = this;

      if (this._xhr != null && this._aborted == false) {
        this._xhr.onabort = function () {
          _this2._cancelUpload();
        };
        this.abort();
      } else {
        this._cancelUpload();
      }
    }
  }, {
    key: "_emitXhrError",
    value: function _emitXhrError(xhr, err, causingErr) {
      this._emitError(new _error2.default(err, causingErr, xhr));
    }
  }, {
    key: "_emitError",
    value: function _emitError(err) {
      if (typeof this.options.onError === "function") {
        this.options.onError(err);
      } else {
        throw err;
      }
    }
  }, {
    key: "_emitXhrCancelError",
    value: function _emitXhrCancelError(xhr, err, causingErr) {
      this._emitCancelError(new _error2.default(err, causingErr, xhr));
    }
  }, {
    key: "_emitCancelError",
    value: function _emitCancelError(err) {
      if (typeof this.options.onError === "function") {
        this.options.onCancelError(err);
      } else {
        throw err;
      }
    }
  }, {
    key: "_emitSuccess",
    value: function _emitSuccess() {
      if (typeof this.options.onSuccess === "function") {
        this.options.onSuccess();
      }
    }
  }, {
    key: "_emitonCancelSuccess",
    value: function _emitonCancelSuccess() {
      if (typeof this.options.onCancelSuccess === "function") {
        this.options.onCancelSuccess();
      }
    }

    /**
     * Publishes notification when data has been sent to the server. This
     * data may not have been accepted by the server yet.
     * @param  {number} bytesSent  Number of bytes sent to the server.
     * @param  {number} bytesTotal Total number of bytes to be sent to the server.
     */

  }, {
    key: "_emitProgress",
    value: function _emitProgress(bytesSent, bytesTotal) {
      if (typeof this.options.onProgress === "function") {
        this.options.onProgress(bytesSent, bytesTotal);
      }
    }

    /**
     * Publishes notification when a chunk of data has been sent to the server
     * and accepted by the server.
     * @param  {number} chunkSize  Size of the chunk that was accepted by the
     *                             server.
     * @param  {number} bytesAccepted Total number of bytes that have been
     *                                accepted by the server.
     * @param  {number} bytesTotal Total number of bytes to be sent to the server.
     */

  }, {
    key: "_emitChunkComplete",
    value: function _emitChunkComplete(chunkSize, bytesAccepted, bytesTotal) {
      if (typeof this.options.onChunkComplete === "function") {
        this.options.onChunkComplete(chunkSize, bytesAccepted, bytesTotal);
      }
    }

    /**
     * Set the headers used in the request and the withCredentials property
     * as defined in the options
     *
     * @param {XMLHttpRequest} xhr
     */

  }, {
    key: "_setupXHR",
    value: function _setupXHR(xhr) {
      this._xhr = xhr;

      xhr.setRequestHeader("Tus-Resumable", "1.0.0");
      var headers = this.options.headers;

      for (var name in headers) {
        xhr.setRequestHeader(name, headers[name]);
      }

      xhr.withCredentials = this.options.withCredentials;
    }

    /**
     * Create a new upload using the creation extension by sending a POST
     * request to the endpoint. After successful creation the file will be
     * uploaded
     *
     * @api private
     */

  }, {
    key: "_createUpload",
    value: function _createUpload() {
      var _this3 = this;

      var xhr = (0, _request.newRequest)();
      xhr.open("POST", this.options.endpoint, true);

      xhr.onload = function () {
        if (!inStatusCategory(xhr.status, 200)) {
          _this3._emitXhrError(xhr, new Error("tus: unexpected response while creating upload"));
          return;
        }

        _this3.url = (0, _request.resolveUrl)(_this3.options.endpoint, xhr.getResponseHeader("Location"));

        if (_this3.options.resume) {
          Storage.setItem(_this3._fingerprint, _this3.url);
        }

        _this3._offset = 0;
        _this3._startUpload();
      };

      xhr.onerror = function (err) {
        _this3._emitXhrError(xhr, new Error("tus: failed to create upload"), err);
      };

      this._setupXHR(xhr);
      xhr.setRequestHeader("Upload-Length", this._size);

      // Add metadata if values have been added
      var metadata = encodeMetadata(this.options.metadata);
      if (metadata !== "") {
        xhr.setRequestHeader("Upload-Metadata", metadata);
      }

      xhr.send(null);
    }

    /**
     * Cancel upload using the delete extension by sending a DELETE
     * request to the uploadUrl.
     *
     * @api private
     */

  }, {
    key: "_cancelUpload",
    value: function _cancelUpload() {
      var _this4 = this;

      var xhr = (0, _request.newRequest)();
      xhr.open("DELETE", this.url, true);

      xhr.onload = function () {
        if (!inStatusCategory(xhr.status, 200)) {
          if (xhr.status === 423) {
            _this4._cancelUpload();
            return;
          }

          if (inStatusCategory(xhr.status, 400)) {
            Storage.removeItem(_this4._fingerprint);
            _this4._emitonCancelSuccess();
            return;
          }
        }

        Storage.removeItem(_this4._fingerprint);
        _this4._emitonCancelSuccess();
        return;
      };

      xhr.onerror = function (err) {
        _this4._emitXhrCancelError(xhr, new Error("tus: failed to cancel upload"), err);
      };

      this._setupXHR(xhr);
      xhr.send(null);
    }

    /*
     * Try to resume an existing upload. First a HEAD request will be sent
     * to retrieve the offset. If the request fails a new upload will be
     * created. In the case of a successful response the file will be uploaded.
     *
     * @api private
     */

  }, {
    key: "_resumeUpload",
    value: function _resumeUpload() {
      var _this5 = this;

      var xhr = (0, _request.newRequest)();
      xhr.open("HEAD", this.url, true);

      xhr.onload = function () {
        if (!inStatusCategory(xhr.status, 200)) {
          if (_this5.options.resume && inStatusCategory(xhr.status, 400)) {
            // Remove stored fingerprint and corresponding endpoint,
            // on client errors since the file can not be found
            Storage.removeItem(_this5._fingerprint);
          }

          // If the upload is locked (indicated by the 423 Locked status code), we
          // emit an error instead of directly starting a new upload. This way the
          // retry logic can catch the error and will retry the upload. An upload
          // is usually locked for a short period of time and will be available
          // afterwards.
          if (xhr.status === 423) {
            _this5._emitXhrError(xhr, new Error("tus: upload is currently locked; retry later"));
            return;
          }

          // Try to create a new upload
          _this5.url = null;
          _this5._createUpload();
          return;
        }

        var offset = parseInt(xhr.getResponseHeader("Upload-Offset"), 10);
        if (isNaN(offset)) {
          _this5._emitXhrError(xhr, new Error("tus: invalid or missing offset value"));
          return;
        }

        var length = parseInt(xhr.getResponseHeader("Upload-Length"), 10);
        if (isNaN(length)) {
          _this5._emitXhrError(xhr, new Error("tus: invalid or missing length value"));
          return;
        }

        // Upload has already been completed and we do not need to send additional
        // data to the server
        if (offset === length) {
          _this5._emitProgress(length, length);
          _this5._emitSuccess();
          return;
        }

        _this5._offset = offset;
        _this5._startUpload();
      };

      xhr.onerror = function (err) {
        _this5._emitXhrError(xhr, new Error("tus: failed to resume upload"), err);
      };

      this._setupXHR(xhr);
      xhr.send(null);
    }

    /**
     * Start uploading the file using PATCH requests. The file will be divided
     * into chunks as specified in the chunkSize option. During the upload
     * the onProgress event handler may be invoked multiple times.
     *
     * @api private
     */

  }, {
    key: "_startUpload",
    value: function _startUpload() {
      var _this6 = this;

      // If the upload has been aborted, we will not send the next PATCH request.
      // This is important if the abort method was called during a callback, such
      // as onChunkComplete or onProgress.
      if (this._aborted) {
        return;
      }

      var xhr = (0, _request.newRequest)();

      // Some browser and servers may not support the PATCH method. For those
      // cases, you can tell tus-js-client to use a POST request with the
      // X-HTTP-Method-Override header for simulating a PATCH request.
      if (this.options.overridePatchMethod) {
        xhr.open("POST", this.url, true);
        xhr.setRequestHeader("X-HTTP-Method-Override", "PATCH");
      } else {
        xhr.open("PATCH", this.url, true);
      }

      xhr.onload = function () {
        if (!inStatusCategory(xhr.status, 200)) {
          _this6._emitXhrError(xhr, new Error("tus: unexpected response while uploading chunk"));
          return;
        }

        var offset = parseInt(xhr.getResponseHeader("Upload-Offset"), 10);
        if (isNaN(offset)) {
          _this6._emitXhrError(xhr, new Error("tus: invalid or missing offset value"));
          return;
        }

        _this6._emitProgress(offset, _this6._size);
        _this6._emitChunkComplete(offset - _this6._offset, offset, _this6._size);

        _this6._offset = offset;

        if (offset == _this6._size) {
          // Yay, finally done :)
          _this6._emitSuccess();
          _this6._source.close();
          return;
        }

        _this6._startUpload();
      };

      xhr.onerror = function (err) {
        // Don't emit an error if the upload was aborted manually
        if (_this6._aborted) {
          return;
        }

        _this6._emitXhrError(xhr, new Error("tus: failed to upload chunk at offset " + _this6._offset), err);
      };

      // Test support for progress events before attaching an event listener
      if ("upload" in xhr) {
        xhr.upload.onprogress = function (e) {
          if (!e.lengthComputable) {
            return;
          }

          _this6._emitProgress(start + e.loaded, _this6._size);
        };
      }

      this._setupXHR(xhr);

      xhr.setRequestHeader("Upload-Offset", this._offset);
      xhr.setRequestHeader("Content-Type", "application/offset+octet-stream");

      var start = this._offset;
      var end = this._offset + this.options.chunkSize;

      // The specified chunkSize may be Infinity or the calcluated end position
      // may exceed the file's size. In both cases, we limit the end position to
      // the input's total size for simpler calculations and correctness.
      if (end === Infinity || end > this._size) {
        end = this._size;
      }

      xhr.send(this._source.slice(start, end));
    }
  }]);

  return Upload;
}();

function encodeMetadata(metadata) {
  if (!Base64.isSupported) {
    return "";
  }

  var encoded = [];

  for (var key in metadata) {
    encoded.push(key + " " + Base64.encode(metadata[key]));
  }

  return encoded.join(",");
}

/**
 * Checks whether a given status is in the range of the expected category.
 * For example, only a status between 200 and 299 will satisfy the category 200.
 *
 * @api private
 */
function inStatusCategory(status, category) {
  return status >= category && status < category + 100;
}

Upload.defaultOptions = defaultOptions;

exports.default = Upload;

},{"./error":5,"./fingerprint":6,"./node/base64":1,"./node/request":2,"./node/source":3,"./node/storage":4,"extend":9}],9:[function(require,module,exports){
'use strict';

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) { /**/ }

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone;
	var target = arguments[0];
	var i = 1;
	var length = arguments.length;
	var deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}
	if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};

},{}],10:[function(require,module,exports){
// Copyright 2014 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)

void (function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define(factory)
  } else if (typeof exports === "object") {
    module.exports = factory()
  } else {
    root.resolveUrl = factory()
  }
}(this, function() {

  function resolveUrl(/* ...urls */) {
    var numUrls = arguments.length

    if (numUrls === 0) {
      throw new Error("resolveUrl requires at least one argument; got none.")
    }

    var base = document.createElement("base")
    base.href = arguments[0]

    if (numUrls === 1) {
      return base.href
    }

    var head = document.getElementsByTagName("head")[0]
    head.insertBefore(base, head.firstChild)

    var a = document.createElement("a")
    var resolved

    for (var index = 1; index < numUrls; index++) {
      a.href = arguments[index]
      resolved = a.href
      base.href = resolved
    }

    head.removeChild(base)

    return resolved
  }

  return resolveUrl

}));

},{}]},{},[7])(7)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvYnJvd3Nlci9iYXNlNjQuanMiLCJsaWIvYnJvd3Nlci9yZXF1ZXN0LmpzIiwibGliL2Jyb3dzZXIvc291cmNlLmpzIiwibGliL2Jyb3dzZXIvc3RvcmFnZS5qcyIsImxpYi9lcnJvci5qcyIsImxpYi9maW5nZXJwcmludC5qcyIsImxpYi9pbmRleC5qcyIsImxpYi91cGxvYWQuanMiLCJub2RlX21vZHVsZXMvZXh0ZW5kL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Jlc29sdmUtdXJsL3Jlc29sdmUtdXJsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7UUNJZ0IsTSxHQUFBLE07QUFKaEI7O2NBRWUsTTtJQUFSLEksV0FBQSxJO0FBRUEsU0FBUyxNQUFULENBQWdCLElBQWhCLEVBQXNCO0FBQzNCLFNBQU8sS0FBSyxTQUFTLG1CQUFtQixJQUFuQixDQUFULENBQUwsQ0FBUDtBQUNEOztBQUVNLElBQU0sb0NBQWMsVUFBVSxNQUE5Qjs7Ozs7Ozs7UUNMUyxVLEdBQUEsVTtRQUlBLFUsR0FBQSxVOztBQU5oQjs7Ozs7O0FBRU8sU0FBUyxVQUFULEdBQXNCO0FBQzNCLFNBQU8sSUFBSSxPQUFPLGNBQVgsRUFBUDtBQUNELEMsQ0FMRDtBQU9PLFNBQVMsVUFBVCxDQUFvQixNQUFwQixFQUE0QixJQUE1QixFQUFrQztBQUN2QyxTQUFPLDBCQUFRLE1BQVIsRUFBZ0IsSUFBaEIsQ0FBUDtBQUNEOzs7Ozs7Ozs7OztRQ0llLFMsR0FBQSxTOzs7O0lBYlYsVTtBQUNKLHNCQUFZLElBQVosRUFBa0I7QUFBQTs7QUFDaEIsU0FBSyxLQUFMLEdBQWEsSUFBYjtBQUNBLFNBQUssSUFBTCxHQUFZLEtBQUssSUFBakI7QUFDRDs7OzswQkFFSyxLLEVBQU8sRyxFQUFLO0FBQ2hCLGFBQU8sS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixLQUFqQixFQUF3QixHQUF4QixDQUFQ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O0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbDogd2luZG93ICovXG5cbmNvbnN0IHtidG9hfSA9IHdpbmRvdztcblxuZXhwb3J0IGZ1bmN0aW9uIGVuY29kZShkYXRhKSB7XG4gIHJldHVybiBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChkYXRhKSkpO1xufVxuXG5leHBvcnQgY29uc3QgaXNTdXBwb3J0ZWQgPSBcImJ0b2FcIiBpbiB3aW5kb3c7XG4iLCIvKiBnbG9iYWwgd2luZG93ICovXG5pbXBvcnQgcmVzb2x2ZSBmcm9tIFwicmVzb2x2ZS11cmxcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIG5ld1JlcXVlc3QoKSB7XG4gIHJldHVybiBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0KCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlVXJsKG9yaWdpbiwgbGluaykge1xuICByZXR1cm4gcmVzb2x2ZShvcmlnaW4sIGxpbmspO1xufVxuIiwiY2xhc3MgRmlsZVNvdXJjZSB7XG4gIGNvbnN0cnVjdG9yKGZpbGUpIHtcbiAgICB0aGlzLl9maWxlID0gZmlsZTtcbiAgICB0aGlzLnNpemUgPSBmaWxlLnNpemU7XG4gIH1cblxuICBzbGljZShzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ZpbGUuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gIH1cblxuICBjbG9zZSgpIHt9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTb3VyY2UoaW5wdXQpIHtcbiAgLy8gU2luY2Ugd2UgZW11bGF0ZSB0aGUgQmxvYiB0eXBlIGluIG91ciB0ZXN0cyAobm90IGFsbCB0YXJnZXQgYnJvd3NlcnNcbiAgLy8gc3VwcG9ydCBpdCksIHdlIGNhbm5vdCB1c2UgYGluc3RhbmNlb2ZgIGZvciB0ZXN0aW5nIHdoZXRoZXIgdGhlIGlucHV0IHZhbHVlXG4gIC8vIGNhbiBiZSBoYW5kbGVkLiBJbnN0ZWFkLCB3ZSBzaW1wbHkgY2hlY2sgaXMgdGhlIHNsaWNlKCkgZnVuY3Rpb24gYW5kIHRoZVxuICAvLyBzaXplIHByb3BlcnR5IGFyZSBhdmFpbGFibGUuXG4gIGlmICh0eXBlb2YgaW5wdXQuc2xpY2UgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgaW5wdXQuc2l6ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiBuZXcgRmlsZVNvdXJjZShpbnB1dCk7XG4gIH1cblxuICB0aHJvdyBuZXcgRXJyb3IoXCJzb3VyY2Ugb2JqZWN0IG1heSBvbmx5IGJlIGFuIGluc3RhbmNlIG9mIEZpbGUgb3IgQmxvYiBpbiB0aGlzIGVudmlyb25tZW50XCIpO1xufVxuIiwiLyogZ2xvYmFsIHdpbmRvdywgbG9jYWxTdG9yYWdlICovXG5cbmxldCBoYXNTdG9yYWdlID0gZmFsc2U7XG50cnkge1xuICBoYXNTdG9yYWdlID0gXCJsb2NhbFN0b3JhZ2VcIiBpbiB3aW5kb3c7XG5cbiAgLy8gQXR0ZW1wdCB0byBzdG9yZSBhbmQgcmVhZCBlbnRyaWVzIGZyb20gdGhlIGxvY2FsIHN0b3JhZ2UgdG8gZGV0ZWN0IFByaXZhdGVcbiAgLy8gTW9kZSBvbiBTYWZhcmkgb24gaU9TIChzZWUgIzQ5KVxuICB2YXIga2V5ID0gXCJ0dXNTdXBwb3J0XCI7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XG5cbn0gY2F0Y2ggKGUpIHtcbiAgLy8gSWYgd2UgdHJ5IHRvIGFjY2VzcyBsb2NhbFN0b3JhZ2UgaW5zaWRlIGEgc2FuZGJveGVkIGlmcmFtZSwgYSBTZWN1cml0eUVycm9yXG4gIC8vIGlzIHRocm93bi4gV2hlbiBpbiBwcml2YXRlIG1vZGUgb24gaU9TIFNhZmFyaSwgYSBRdW90YUV4Y2VlZGVkRXJyb3IgaXNcbiAgLy8gdGhyb3duIChzZWUgIzQ5KVxuICBpZiAoZS5jb2RlID09PSBlLlNFQ1VSSVRZX0VSUiB8fCBlLmNvZGUgPT09IGUuUVVPVEFfRVhDRUVERURfRVJSKSB7XG4gICAgaGFzU3RvcmFnZSA9IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHRocm93IGU7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGNhblN0b3JlVVJMcyA9IGhhc1N0b3JhZ2U7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRJdGVtKGtleSwgdmFsdWUpIHtcbiAgaWYgKCFoYXNTdG9yYWdlKSByZXR1cm47XG4gIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEl0ZW0oa2V5KSB7XG4gIGlmICghaGFzU3RvcmFnZSkgcmV0dXJuO1xuICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUl0ZW0oa2V5KSB7XG4gIGlmICghaGFzU3RvcmFnZSkgcmV0dXJuO1xuICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbn1cbiIsImNsYXNzIERldGFpbGVkRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKGVycm9yLCBjYXVzaW5nRXJyID0gbnVsbCwgeGhyID0gbnVsbCkge1xuICAgIHN1cGVyKGVycm9yLm1lc3NhZ2UpO1xuXG4gICAgdGhpcy5vcmlnaW5hbFJlcXVlc3QgPSB4aHI7XG4gICAgdGhpcy5jYXVzaW5nRXJyb3IgPSBjYXVzaW5nRXJyO1xuXG4gICAgbGV0IG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIGlmIChjYXVzaW5nRXJyICE9IG51bGwpIHtcbiAgICAgIG1lc3NhZ2UgKz0gYCwgY2F1c2VkIGJ5ICR7Y2F1c2luZ0Vyci50b1N0cmluZygpfWA7XG4gICAgfVxuICAgIGlmICh4aHIgIT0gbnVsbCkge1xuICAgICAgbWVzc2FnZSArPSBgLCBvcmlnaW5hdGVkIGZyb20gcmVxdWVzdCAocmVzcG9uc2UgY29kZTogJHt4aHIuc3RhdHVzfSwgcmVzcG9uc2UgdGV4dDogJHt4aHIucmVzcG9uc2VUZXh0fSlgO1xuICAgIH1cbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERldGFpbGVkRXJyb3I7XG4iLCIvKipcbiAqIEdlbmVyYXRlIGEgZmluZ2VycHJpbnQgZm9yIGEgZmlsZSB3aGljaCB3aWxsIGJlIHVzZWQgdGhlIHN0b3JlIHRoZSBlbmRwb2ludFxuICpcbiAqIEBwYXJhbSB7RmlsZX0gZmlsZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmaW5nZXJwcmludChmaWxlKSB7XG4gIHJldHVybiBbXG5cdFx0XCJ0dXNcIixcblx0XHRmaWxlLm5hbWUsXG5cdFx0ZmlsZS50eXBlLFxuXHRcdGZpbGUuc2l6ZSxcblx0XHRmaWxlLmxhc3RNb2RpZmllZFxuICBdLmpvaW4oXCItXCIpO1xufVxuIiwiLyogZ2xvYmFsIHdpbmRvdyAqL1xuaW1wb3J0IFVwbG9hZCBmcm9tIFwiLi91cGxvYWRcIjtcbmltcG9ydCB7Y2FuU3RvcmVVUkxzfSBmcm9tIFwiLi9ub2RlL3N0b3JhZ2VcIjtcblxuY29uc3Qge2RlZmF1bHRPcHRpb25zfSA9IFVwbG9hZDtcblxuaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgLy8gQnJvd3NlciBlbnZpcm9ubWVudCB1c2luZyBYTUxIdHRwUmVxdWVzdFxuICBjb25zdCB7WE1MSHR0cFJlcXVlc3QsIEJsb2J9ID0gd2luZG93O1xuXG4gIHZhciBpc1N1cHBvcnRlZCA9IChcbiAgICBYTUxIdHRwUmVxdWVzdCAmJlxuICAgIEJsb2IgJiZcbiAgICB0eXBlb2YgQmxvYi5wcm90b3R5cGUuc2xpY2UgPT09IFwiZnVuY3Rpb25cIlxuICApO1xufSBlbHNlIHtcbiAgLy8gTm9kZS5qcyBlbnZpcm9ubWVudCB1c2luZyBodHRwIG1vZHVsZVxuICB2YXIgaXNTdXBwb3J0ZWQgPSB0cnVlO1xufVxuXG4vLyBUaGUgdXNhZ2Ugb2YgdGhlIGNvbW1vbmpzIGV4cG9ydGluZyBzeW50YXggaW5zdGVhZCBvZiB0aGUgbmV3IEVDTUFTY3JpcHRcbi8vIG9uZSBpcyBhY3R1YWxseSBpbnRlZGVkIGFuZCBwcmV2ZW50cyB3ZWlyZCBiZWhhdmlvdXIgaWYgd2UgYXJlIHRyeWluZyB0b1xuLy8gaW1wb3J0IHRoaXMgbW9kdWxlIGluIGFub3RoZXIgbW9kdWxlIHVzaW5nIEJhYmVsLlxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFVwbG9hZCxcbiAgaXNTdXBwb3J0ZWQsXG4gIGNhblN0b3JlVVJMcyxcbiAgZGVmYXVsdE9wdGlvbnNcbn07XG4iLCIvKiBnbG9iYWwgd2luZG93ICovXG5pbXBvcnQgZmluZ2VycHJpbnQgZnJvbSBcIi4vZmluZ2VycHJpbnRcIjtcbmltcG9ydCBEZXRhaWxlZEVycm9yIGZyb20gXCIuL2Vycm9yXCI7XG5pbXBvcnQgZXh0ZW5kIGZyb20gXCJleHRlbmRcIjtcblxuLy8gV2UgaW1wb3J0IHRoZSBmaWxlcyB1c2VkIGluc2lkZSB0aGUgTm9kZSBlbnZpcm9ubWVudCB3aGljaCBhcmUgcmV3cml0dGVuXG4vLyBmb3IgYnJvd3NlcnMgdXNpbmcgdGhlIHJ1bGVzIGRlZmluZWQgaW4gdGhlIHBhY2thZ2UuanNvblxuaW1wb3J0IHtuZXdSZXF1ZXN0LCByZXNvbHZlVXJsfSBmcm9tIFwiLi9ub2RlL3JlcXVlc3RcIjtcbmltcG9ydCB7Z2V0U291cmNlfSBmcm9tIFwiLi9ub2RlL3NvdXJjZVwiO1xuaW1wb3J0ICogYXMgQmFzZTY0IGZyb20gXCIuL25vZGUvYmFzZTY0XCI7XG5pbXBvcnQgKiBhcyBTdG9yYWdlIGZyb20gXCIuL25vZGUvc3RvcmFnZVwiO1xuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgZW5kcG9pbnQ6IFwiXCIsXG4gIGZpbmdlcnByaW50LFxuICByZXN1bWU6IHRydWUsXG4gIG9uUHJvZ3Jlc3M6IG51bGwsXG4gIG9uQ2h1bmtDb21wbGV0ZTogbnVsbCxcbiAgb25TdWNjZXNzOiBudWxsLFxuICBvbkVycm9yOiBudWxsLFxuICBoZWFkZXJzOiB7fSxcbiAgY2h1bmtTaXplOiBJbmZpbml0eSxcbiAgd2l0aENyZWRlbnRpYWxzOiBmYWxzZSxcbiAgdXBsb2FkVXJsOiBudWxsLFxuICB1cGxvYWRTaXplOiBudWxsLFxuICBvdmVycmlkZVBhdGNoTWV0aG9kOiBmYWxzZSxcbiAgcmV0cnlEZWxheXM6IG51bGxcbn07XG5cbmNsYXNzIFVwbG9hZCB7XG4gIGNvbnN0cnVjdG9yKGZpbGUsIG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBleHRlbmQodHJ1ZSwge30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcblxuICAgIC8vIFRoZSB1bmRlcmx5aW5nIEZpbGUvQmxvYiBvYmplY3RcbiAgICB0aGlzLmZpbGUgPSBmaWxlO1xuXG4gICAgLy8gVGhlIFVSTCBhZ2FpbnN0IHdoaWNoIHRoZSBmaWxlIHdpbGwgYmUgdXBsb2FkZWRcbiAgICB0aGlzLnVybCA9IG51bGw7XG5cbiAgICAvLyBUaGUgdW5kZXJseWluZyBYSFIgb2JqZWN0IGZvciB0aGUgY3VycmVudCBQQVRDSCByZXF1ZXN0XG4gICAgdGhpcy5feGhyID0gbnVsbDtcblxuICAgIC8vIFRoZSBmaW5nZXJwaW5ydCBmb3IgdGhlIGN1cnJlbnQgZmlsZSAoc2V0IGFmdGVyIHN0YXJ0KCkpXG4gICAgdGhpcy5fZmluZ2VycHJpbnQgPSBudWxsO1xuXG4gICAgLy8gVGhlIG9mZnNldCB1c2VkIGluIHRoZSBjdXJyZW50IFBBVENIIHJlcXVlc3RcbiAgICB0aGlzLl9vZmZzZXQgPSBudWxsO1xuXG4gICAgLy8gVHJ1ZSBpZiB0aGUgY3VycmVudCBQQVRDSCByZXF1ZXN0IGhhcyBiZWVuIGFib3J0ZWRcbiAgICB0aGlzLl9hYm9ydGVkID0gZmFsc2U7XG5cbiAgICAvLyBUaGUgZmlsZSdzIHNpemUgaW4gYnl0ZXNcbiAgICB0aGlzLl9zaXplID0gbnVsbDtcblxuICAgIC8vIFRoZSBTb3VyY2Ugb2JqZWN0IHdoaWNoIHdpbGwgd3JhcCBhcm91bmQgdGhlIGdpdmVuIGZpbGUgYW5kIHByb3ZpZGVzIHVzXG4gICAgLy8gd2l0aCBhIHVuaWZpZWQgaW50ZXJmYWNlIGZvciBnZXR0aW5nIGl0cyBzaXplIGFuZCBzbGljZSBjaHVua3MgZnJvbSBpdHNcbiAgICAvLyBjb250ZW50IGFsbG93aW5nIHVzIHRvIGVhc2lseSBoYW5kbGUgRmlsZXMsIEJsb2JzLCBCdWZmZXJzIGFuZCBTdHJlYW1zLlxuICAgIHRoaXMuX3NvdXJjZSA9IG51bGw7XG5cbiAgICAvLyBUaGUgY3VycmVudCBjb3VudCBvZiBhdHRlbXB0cyB3aGljaCBoYXZlIGJlZW4gbWFkZS4gTnVsbCBpbmRpY2F0ZXMgbm9uZS5cbiAgICB0aGlzLl9yZXRyeUF0dGVtcHQgPSAwO1xuXG4gICAgLy8gVGhlIHRpbWVvdXQncyBJRCB3aGljaCBpcyB1c2VkIHRvIGRlbGF5IHRoZSBuZXh0IHJldHJ5XG4gICAgdGhpcy5fcmV0cnlUaW1lb3V0ID0gbnVsbDtcblxuICAgIC8vIFRoZSBvZmZzZXQgb2YgdGhlIHJlbW90ZSB1cGxvYWQgYmVmb3JlIHRoZSBsYXRlc3QgYXR0ZW1wdCB3YXMgc3RhcnRlZC5cbiAgICB0aGlzLl9vZmZzZXRCZWZvcmVSZXRyeSA9IDA7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBsZXQgZmlsZSA9IHRoaXMuZmlsZTtcblxuICAgIGlmICghZmlsZSkge1xuICAgICAgdGhpcy5fZW1pdEVycm9yKG5ldyBFcnJvcihcInR1czogbm8gZmlsZSBvciBzdHJlYW0gdG8gdXBsb2FkIHByb3ZpZGVkXCIpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5lbmRwb2ludCkge1xuICAgICAgICB0aGlzLl9lbWl0RXJyb3IobmV3IEVycm9yKFwidHVzOiBubyBlbmRwb2ludCBwcm92aWRlZFwiKSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgc291cmNlID0gdGhpcy5fc291cmNlID0gZ2V0U291cmNlKGZpbGUsIHRoaXMub3B0aW9ucy5jaHVua1NpemUpO1xuXG4gICAgLy8gRmlyc3RseSwgY2hlY2sgaWYgdGhlIGNhbGxlciBoYXMgc3VwcGxpZWQgYSBtYW51YWwgdXBsb2FkIHNpemUgb3IgZWxzZVxuICAgIC8vIHdlIHdpbGwgdXNlIHRoZSBjYWxjdWxhdGVkIHNpemUgYnkgdGhlIHNvdXJjZSBvYmplY3QuXG4gICAgaWYgKHRoaXMub3B0aW9ucy51cGxvYWRTaXplICE9IG51bGwpIHtcbiAgICAgIGxldCBzaXplID0gK3RoaXMub3B0aW9ucy51cGxvYWRTaXplO1xuICAgICAgaWYgKGlzTmFOKHNpemUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInR1czogY2Fubm90IGNvbnZlcnQgYHVwbG9hZFNpemVgIG9wdGlvbiBpbnRvIGEgbnVtYmVyXCIpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9zaXplID0gc2l6ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHNpemUgPSBzb3VyY2Uuc2l6ZTtcblxuICAgICAgLy8gVGhlIHNpemUgcHJvcGVydHkgd2lsbCBiZSBudWxsIGlmIHdlIGNhbm5vdCBjYWxjdWxhdGUgdGhlIGZpbGUncyBzaXplLFxuICAgICAgLy8gZm9yIGV4YW1wbGUgaWYgeW91IGhhbmRsZSBhIHN0cmVhbS5cbiAgICAgIGlmIChzaXplID09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHVzOiBjYW5ub3QgYXV0b21hdGljYWxseSBkZXJpdmUgdXBsb2FkJ3Mgc2l6ZSBmcm9tIGlucHV0IGFuZCBtdXN0IGJlIHNwZWNpZmllZCBtYW51YWxseSB1c2luZyB0aGUgYHVwbG9hZFNpemVgIG9wdGlvblwiKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fc2l6ZSA9IHNpemU7XG4gICAgfVxuXG4gICAgbGV0IHJldHJ5RGVsYXlzID0gdGhpcy5vcHRpb25zLnJldHJ5RGVsYXlzO1xuICAgIGlmIChyZXRyeURlbGF5cyAhPSBudWxsKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHJldHJ5RGVsYXlzKSAhPT0gXCJbb2JqZWN0IEFycmF5XVwiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInR1czogdGhlIGByZXRyeURlbGF5c2Agb3B0aW9uIG11c3QgZWl0aGVyIGJlIGFuIGFycmF5IG9yIG51bGxcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgZXJyb3JDYWxsYmFjayA9IHRoaXMub3B0aW9ucy5vbkVycm9yO1xuICAgICAgICB0aGlzLm9wdGlvbnMub25FcnJvciA9IChlcnIpID0+IHtcbiAgICAgICAgICAvLyBSZXN0b3JlIHRoZSBvcmlnaW5hbCBlcnJvciBjYWxsYmFjayB3aGljaCBtYXkgaGF2ZSBiZWVuIHNldC5cbiAgICAgICAgICB0aGlzLm9wdGlvbnMub25FcnJvciA9IGVycm9yQ2FsbGJhY2s7XG5cbiAgICAgICAgICAvLyBXZSB3aWxsIHJlc2V0IHRoZSBhdHRlbXB0IGNvdW50ZXIgaWZcbiAgICAgICAgICAvLyAtIHdlIHdlcmUgYWxyZWFkeSBhYmxlIHRvIGNvbm5lY3QgdG8gdGhlIHNlcnZlciAob2Zmc2V0ICE9IG51bGwpIGFuZFxuICAgICAgICAgIC8vIC0gd2Ugd2VyZSBhYmxlIHRvIHVwbG9hZCBhIHNtYWxsIGNodW5rIG9mIGRhdGEgdG8gdGhlIHNlcnZlclxuICAgICAgICAgIGxldCBzaG91bGRSZXNldERlbGF5cyA9IHRoaXMuX29mZnNldCAhPSBudWxsICYmICh0aGlzLl9vZmZzZXQgPiB0aGlzLl9vZmZzZXRCZWZvcmVSZXRyeSk7XG4gICAgICAgICAgaWYgKHNob3VsZFJlc2V0RGVsYXlzKSB7XG4gICAgICAgICAgICB0aGlzLl9yZXRyeUF0dGVtcHQgPSAwO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCBpc09ubGluZSA9IHRydWU7XG4gICAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiZcbiAgICAgICAgICAgICBcIm5hdmlnYXRvclwiIGluIHdpbmRvdyAmJlxuICAgICAgICAgICAgIHdpbmRvdy5uYXZpZ2F0b3Iub25MaW5lID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgaXNPbmxpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBXZSBvbmx5IGF0dGVtcHQgYSByZXRyeSBpZlxuICAgICAgICAgIC8vIC0gd2UgZGlkbid0IGV4Y2VlZCB0aGUgbWF4aXVtIG51bWJlciBvZiByZXRyaWVzLCB5ZXQsIGFuZFxuICAgICAgICAgIC8vIC0gdGhpcyBlcnJvciB3YXMgY2F1c2VkIGJ5IGEgcmVxdWVzdCBvciBpdCdzIHJlc3BvbnNlIGFuZFxuICAgICAgICAgIC8vIC0gdGhlIGVycm9yIGlzIG5vdCBhIGNsaWVudCBlcnJvciAoc3RhdHVzIDR4eCkgYW5kXG4gICAgICAgICAgLy8gLSB0aGUgYnJvd3NlciBkb2VzIG5vdCBpbmRpY2F0ZSB0aGF0IHdlIGFyZSBvZmZsaW5lXG4gICAgICAgICAgbGV0IHNob3VsZFJldHJ5ID0gdGhpcy5fcmV0cnlBdHRlbXB0IDwgcmV0cnlEZWxheXMubGVuZ3RoICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyLm9yaWdpbmFsUmVxdWVzdCAhPSBudWxsICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIWluU3RhdHVzQ2F0ZWdvcnkoZXJyLm9yaWdpbmFsUmVxdWVzdC5zdGF0dXMsIDQwMCkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc09ubGluZTtcblxuICAgICAgICAgIGlmICghc2hvdWxkUmV0cnkpIHtcbiAgICAgICAgICAgIHRoaXMuX2VtaXRFcnJvcihlcnIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCBkZWxheSA9IHJldHJ5RGVsYXlzW3RoaXMuX3JldHJ5QXR0ZW1wdCsrXTtcblxuICAgICAgICAgIHRoaXMuX29mZnNldEJlZm9yZVJldHJ5ID0gdGhpcy5fb2Zmc2V0O1xuICAgICAgICAgIHRoaXMub3B0aW9ucy51cGxvYWRVcmwgPSB0aGlzLnVybDtcblxuICAgICAgICAgIHRoaXMuX3JldHJ5VGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICAgIH0sIGRlbGF5KTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXNldCB0aGUgYWJvcnRlZCBmbGFnIHdoZW4gdGhlIHVwbG9hZCBpcyBzdGFydGVkIG9yIGVsc2UgdGhlXG4gICAgLy8gX3N0YXJ0VXBsb2FkIHdpbGwgc3RvcCBiZWZvcmUgc2VuZGluZyBhIHJlcXVlc3QgaWYgdGhlIHVwbG9hZCBoYXMgYmVlblxuICAgIC8vIGFib3J0ZWQgcHJldmlvdXNseS5cbiAgICB0aGlzLl9hYm9ydGVkID0gZmFsc2U7XG5cbiAgICAvLyBBIFVSTCBoYXMgbWFudWFsbHkgYmVlbiBzcGVjaWZpZWQsIHNvIHdlIHRyeSB0byByZXN1bWVcbiAgICBpZiAodGhpcy5vcHRpb25zLnVwbG9hZFVybCAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMudXJsID0gdGhpcy5vcHRpb25zLnVwbG9hZFVybDtcbiAgICAgICAgdGhpcy5fcmVzdW1lVXBsb2FkKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBUcnkgdG8gZmluZCB0aGUgZW5kcG9pbnQgZm9yIHRoZSBmaWxlIGluIHRoZSBzdG9yYWdlXG4gICAgaWYgKHRoaXMub3B0aW9ucy5yZXN1bWUpIHtcbiAgICAgICAgdGhpcy5fZmluZ2VycHJpbnQgPSB0aGlzLm9wdGlvbnMuZmluZ2VycHJpbnQoZmlsZSk7XG4gICAgICAgIGxldCByZXN1bWVkVXJsID0gU3RvcmFnZS5nZXRJdGVtKHRoaXMuX2ZpbmdlcnByaW50KTtcblxuICAgICAgICBpZiAocmVzdW1lZFVybCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnVybCA9IHJlc3VtZWRVcmw7XG4gICAgICAgICAgICB0aGlzLl9yZXN1bWVVcGxvYWQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFuIHVwbG9hZCBoYXMgbm90IHN0YXJ0ZWQgZm9yIHRoZSBmaWxlIHlldCwgc28gd2Ugc3RhcnQgYSBuZXcgb25lXG4gICAgdGhpcy5fY3JlYXRlVXBsb2FkKCk7XG4gIH1cblxuICBhYm9ydCgpIHtcbiAgICBpZiAodGhpcy5feGhyICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl94aHIuYWJvcnQoKTtcbiAgICAgIHRoaXMuX3NvdXJjZS5jbG9zZSgpO1xuICAgICAgdGhpcy5fYWJvcnRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3JldHJ5VGltZW91dCAhPSBudWxsKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fcmV0cnlUaW1lb3V0KTtcbiAgICAgIHRoaXMuX3JldHJ5VGltZW91dCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgY2FuY2VsKCkge1xuICAgIGlmICh0aGlzLl94aHIgIT0gbnVsbCAmJiB0aGlzLl9hYm9ydGVkID09IGZhbHNlKSB7XG4gICAgICB0aGlzLl94aHIub25hYm9ydCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5fY2FuY2VsVXBsb2FkKCk7XG4gICAgICB9O1xuICAgICAgdGhpcy5hYm9ydCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jYW5jZWxVcGxvYWQoKTtcbiAgICB9XG4gIH1cblxuICBfZW1pdFhockVycm9yKHhociwgZXJyLCBjYXVzaW5nRXJyKSB7XG4gICAgdGhpcy5fZW1pdEVycm9yKG5ldyBEZXRhaWxlZEVycm9yKGVyciwgY2F1c2luZ0VyciwgeGhyKSk7XG4gIH1cblxuICBfZW1pdEVycm9yKGVycikge1xuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLm9uRXJyb3IgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhpcy5vcHRpb25zLm9uRXJyb3IoZXJyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH1cbiAgfVxuXG4gIF9lbWl0WGhyQ2FuY2VsRXJyb3IoeGhyLCBlcnIsIGNhdXNpbmdFcnIpIHtcbiAgICB0aGlzLl9lbWl0Q2FuY2VsRXJyb3IobmV3IERldGFpbGVkRXJyb3IoZXJyLCBjYXVzaW5nRXJyLCB4aHIpKTtcbiAgfVxuXG4gIF9lbWl0Q2FuY2VsRXJyb3IoZXJyKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMub25FcnJvciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aGlzLm9wdGlvbnMub25DYW5jZWxFcnJvcihlcnIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfVxuICB9XG5cbiAgX2VtaXRTdWNjZXNzKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLm9uU3VjY2VzcyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aGlzLm9wdGlvbnMub25TdWNjZXNzKCk7XG4gICAgfVxuICB9XG5cbiAgX2VtaXRvbkNhbmNlbFN1Y2Nlc3MoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMub25DYW5jZWxTdWNjZXNzID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5vbkNhbmNlbFN1Y2Nlc3MoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHVibGlzaGVzIG5vdGlmaWNhdGlvbiB3aGVuIGRhdGEgaGFzIGJlZW4gc2VudCB0byB0aGUgc2VydmVyLiBUaGlzXG4gICAqIGRhdGEgbWF5IG5vdCBoYXZlIGJlZW4gYWNjZXB0ZWQgYnkgdGhlIHNlcnZlciB5ZXQuXG4gICAqIEBwYXJhbSAge251bWJlcn0gYnl0ZXNTZW50ICBOdW1iZXIgb2YgYnl0ZXMgc2VudCB0byB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGJ5dGVzVG90YWwgVG90YWwgbnVtYmVyIG9mIGJ5dGVzIHRvIGJlIHNlbnQgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIF9lbWl0UHJvZ3Jlc3MoYnl0ZXNTZW50LCBieXRlc1RvdGFsKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMub25Qcm9ncmVzcyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aGlzLm9wdGlvbnMub25Qcm9ncmVzcyhieXRlc1NlbnQsIGJ5dGVzVG90YWwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaXNoZXMgbm90aWZpY2F0aW9uIHdoZW4gYSBjaHVuayBvZiBkYXRhIGhhcyBiZWVuIHNlbnQgdG8gdGhlIHNlcnZlclxuICAgKiBhbmQgYWNjZXB0ZWQgYnkgdGhlIHNlcnZlci5cbiAgICogQHBhcmFtICB7bnVtYmVyfSBjaHVua1NpemUgIFNpemUgb2YgdGhlIGNodW5rIHRoYXQgd2FzIGFjY2VwdGVkIGJ5IHRoZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyLlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGJ5dGVzQWNjZXB0ZWQgVG90YWwgbnVtYmVyIG9mIGJ5dGVzIHRoYXQgaGF2ZSBiZWVuXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2NlcHRlZCBieSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGJ5dGVzVG90YWwgVG90YWwgbnVtYmVyIG9mIGJ5dGVzIHRvIGJlIHNlbnQgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIF9lbWl0Q2h1bmtDb21wbGV0ZShjaHVua1NpemUsIGJ5dGVzQWNjZXB0ZWQsIGJ5dGVzVG90YWwpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5vbkNodW5rQ29tcGxldGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhpcy5vcHRpb25zLm9uQ2h1bmtDb21wbGV0ZShjaHVua1NpemUsIGJ5dGVzQWNjZXB0ZWQsIGJ5dGVzVG90YWwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGhlYWRlcnMgdXNlZCBpbiB0aGUgcmVxdWVzdCBhbmQgdGhlIHdpdGhDcmVkZW50aWFscyBwcm9wZXJ0eVxuICAgKiBhcyBkZWZpbmVkIGluIHRoZSBvcHRpb25zXG4gICAqXG4gICAqIEBwYXJhbSB7WE1MSHR0cFJlcXVlc3R9IHhoclxuICAgKi9cbiAgX3NldHVwWEhSKHhocikge1xuICAgIHRoaXMuX3hociA9IHhocjtcblxuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiVHVzLVJlc3VtYWJsZVwiLCBcIjEuMC4wXCIpO1xuICAgIGxldCBoZWFkZXJzID0gdGhpcy5vcHRpb25zLmhlYWRlcnM7XG5cbiAgICBmb3IgKGxldCBuYW1lIGluIGhlYWRlcnMpIHtcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIGhlYWRlcnNbbmFtZV0pO1xuICAgIH1cblxuICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0aGlzLm9wdGlvbnMud2l0aENyZWRlbnRpYWxzO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyB1cGxvYWQgdXNpbmcgdGhlIGNyZWF0aW9uIGV4dGVuc2lvbiBieSBzZW5kaW5nIGEgUE9TVFxuICAgKiByZXF1ZXN0IHRvIHRoZSBlbmRwb2ludC4gQWZ0ZXIgc3VjY2Vzc2Z1bCBjcmVhdGlvbiB0aGUgZmlsZSB3aWxsIGJlXG4gICAqIHVwbG9hZGVkXG4gICAqXG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cbiAgX2NyZWF0ZVVwbG9hZCgpIHtcbiAgICBsZXQgeGhyID0gbmV3UmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKFwiUE9TVFwiLCB0aGlzLm9wdGlvbnMuZW5kcG9pbnQsIHRydWUpO1xuXG4gICAgeGhyLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgIGlmICghaW5TdGF0dXNDYXRlZ29yeSh4aHIuc3RhdHVzLCAyMDApKSB7XG4gICAgICAgIHRoaXMuX2VtaXRYaHJFcnJvcih4aHIsIG5ldyBFcnJvcihcInR1czogdW5leHBlY3RlZCByZXNwb25zZSB3aGlsZSBjcmVhdGluZyB1cGxvYWRcIikpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMudXJsID0gcmVzb2x2ZVVybCh0aGlzLm9wdGlvbnMuZW5kcG9pbnQsIHhoci5nZXRSZXNwb25zZUhlYWRlcihcIkxvY2F0aW9uXCIpKTtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5yZXN1bWUpIHtcbiAgICAgICAgU3RvcmFnZS5zZXRJdGVtKHRoaXMuX2ZpbmdlcnByaW50LCB0aGlzLnVybCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX29mZnNldCA9IDA7XG4gICAgICB0aGlzLl9zdGFydFVwbG9hZCgpO1xuICAgIH07XG5cbiAgICB4aHIub25lcnJvciA9IChlcnIpID0+IHtcbiAgICAgIHRoaXMuX2VtaXRYaHJFcnJvcih4aHIsIG5ldyBFcnJvcihcInR1czogZmFpbGVkIHRvIGNyZWF0ZSB1cGxvYWRcIiksIGVycik7XG4gICAgfTtcblxuICAgIHRoaXMuX3NldHVwWEhSKHhocik7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJVcGxvYWQtTGVuZ3RoXCIsIHRoaXMuX3NpemUpO1xuXG4gICAgLy8gQWRkIG1ldGFkYXRhIGlmIHZhbHVlcyBoYXZlIGJlZW4gYWRkZWRcbiAgICB2YXIgbWV0YWRhdGEgPSBlbmNvZGVNZXRhZGF0YSh0aGlzLm9wdGlvbnMubWV0YWRhdGEpO1xuICAgIGlmIChtZXRhZGF0YSAhPT0gXCJcIikge1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlVwbG9hZC1NZXRhZGF0YVwiLCBtZXRhZGF0YSk7XG4gICAgfVxuXG4gICAgeGhyLnNlbmQobnVsbCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FuY2VsIHVwbG9hZCB1c2luZyB0aGUgZGVsZXRlIGV4dGVuc2lvbiBieSBzZW5kaW5nIGEgREVMRVRFXG4gICAqIHJlcXVlc3QgdG8gdGhlIHVwbG9hZFVybC5cbiAgICpcbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuICBfY2FuY2VsVXBsb2FkKCkge1xuICAgIGxldCB4aHIgPSBuZXdSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oXCJERUxFVEVcIiwgdGhpcy51cmwsIHRydWUpO1xuXG4gICAgeGhyLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgIGlmICghaW5TdGF0dXNDYXRlZ29yeSh4aHIuc3RhdHVzLCAyMDApKSB7XG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09PSA0MjMpIHtcbiAgICAgICAgICB0aGlzLl9jYW5jZWxVcGxvYWQoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW5TdGF0dXNDYXRlZ29yeSh4aHIuc3RhdHVzLCA0MDApKSB7XG4gICAgICAgICAgU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMuX2ZpbmdlcnByaW50KTtcbiAgICAgICAgICB0aGlzLl9lbWl0b25DYW5jZWxTdWNjZXNzKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLl9maW5nZXJwcmludCk7XG4gICAgICB0aGlzLl9lbWl0b25DYW5jZWxTdWNjZXNzKCk7XG4gICAgICByZXR1cm47XG4gICAgfTtcblxuICAgIHhoci5vbmVycm9yID0gKGVycikgPT4ge1xuICAgICAgdGhpcy5fZW1pdFhockNhbmNlbEVycm9yKHhociwgbmV3IEVycm9yKFwidHVzOiBmYWlsZWQgdG8gY2FuY2VsIHVwbG9hZFwiKSwgZXJyKTtcbiAgICB9O1xuXG4gICAgdGhpcy5fc2V0dXBYSFIoeGhyKTtcbiAgICB4aHIuc2VuZChudWxsKTtcbiAgfVxuXG4gIC8qXG4gICAqIFRyeSB0byByZXN1bWUgYW4gZXhpc3RpbmcgdXBsb2FkLiBGaXJzdCBhIEhFQUQgcmVxdWVzdCB3aWxsIGJlIHNlbnRcbiAgICogdG8gcmV0cmlldmUgdGhlIG9mZnNldC4gSWYgdGhlIHJlcXVlc3QgZmFpbHMgYSBuZXcgdXBsb2FkIHdpbGwgYmVcbiAgICogY3JlYXRlZC4gSW4gdGhlIGNhc2Ugb2YgYSBzdWNjZXNzZnVsIHJlc3BvbnNlIHRoZSBmaWxlIHdpbGwgYmUgdXBsb2FkZWQuXG4gICAqXG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cbiAgX3Jlc3VtZVVwbG9hZCgpIHtcbiAgICBsZXQgeGhyID0gbmV3UmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKFwiSEVBRFwiLCB0aGlzLnVybCwgdHJ1ZSk7XG5cbiAgICB4aHIub25sb2FkID0gKCkgPT4ge1xuICAgICAgaWYgKCFpblN0YXR1c0NhdGVnb3J5KHhoci5zdGF0dXMsIDIwMCkpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5yZXN1bWUgJiYgaW5TdGF0dXNDYXRlZ29yeSh4aHIuc3RhdHVzLCA0MDApKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIHN0b3JlZCBmaW5nZXJwcmludCBhbmQgY29ycmVzcG9uZGluZyBlbmRwb2ludCxcbiAgICAgICAgICAvLyBvbiBjbGllbnQgZXJyb3JzIHNpbmNlIHRoZSBmaWxlIGNhbiBub3QgYmUgZm91bmRcbiAgICAgICAgICBTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5fZmluZ2VycHJpbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlIHVwbG9hZCBpcyBsb2NrZWQgKGluZGljYXRlZCBieSB0aGUgNDIzIExvY2tlZCBzdGF0dXMgY29kZSksIHdlXG4gICAgICAgIC8vIGVtaXQgYW4gZXJyb3IgaW5zdGVhZCBvZiBkaXJlY3RseSBzdGFydGluZyBhIG5ldyB1cGxvYWQuIFRoaXMgd2F5IHRoZVxuICAgICAgICAvLyByZXRyeSBsb2dpYyBjYW4gY2F0Y2ggdGhlIGVycm9yIGFuZCB3aWxsIHJldHJ5IHRoZSB1cGxvYWQuIEFuIHVwbG9hZFxuICAgICAgICAvLyBpcyB1c3VhbGx5IGxvY2tlZCBmb3IgYSBzaG9ydCBwZXJpb2Qgb2YgdGltZSBhbmQgd2lsbCBiZSBhdmFpbGFibGVcbiAgICAgICAgLy8gYWZ0ZXJ3YXJkcy5cbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDQyMykge1xuICAgICAgICAgIHRoaXMuX2VtaXRYaHJFcnJvcih4aHIsIG5ldyBFcnJvcihcInR1czogdXBsb2FkIGlzIGN1cnJlbnRseSBsb2NrZWQ7IHJldHJ5IGxhdGVyXCIpKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUcnkgdG8gY3JlYXRlIGEgbmV3IHVwbG9hZFxuICAgICAgICB0aGlzLnVybCA9IG51bGw7XG4gICAgICAgIHRoaXMuX2NyZWF0ZVVwbG9hZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxldCBvZmZzZXQgPSBwYXJzZUludCh4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJVcGxvYWQtT2Zmc2V0XCIpLCAxMCk7XG4gICAgICBpZiAoaXNOYU4ob2Zmc2V0KSkge1xuICAgICAgICB0aGlzLl9lbWl0WGhyRXJyb3IoeGhyLCBuZXcgRXJyb3IoXCJ0dXM6IGludmFsaWQgb3IgbWlzc2luZyBvZmZzZXQgdmFsdWVcIikpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxldCBsZW5ndGggPSBwYXJzZUludCh4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJVcGxvYWQtTGVuZ3RoXCIpLCAxMCk7XG4gICAgICBpZiAoaXNOYU4obGVuZ3RoKSkge1xuICAgICAgICB0aGlzLl9lbWl0WGhyRXJyb3IoeGhyLCBuZXcgRXJyb3IoXCJ0dXM6IGludmFsaWQgb3IgbWlzc2luZyBsZW5ndGggdmFsdWVcIikpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFVwbG9hZCBoYXMgYWxyZWFkeSBiZWVuIGNvbXBsZXRlZCBhbmQgd2UgZG8gbm90IG5lZWQgdG8gc2VuZCBhZGRpdGlvbmFsXG4gICAgICAvLyBkYXRhIHRvIHRoZSBzZXJ2ZXJcbiAgICAgIGlmIChvZmZzZXQgPT09IGxlbmd0aCkge1xuICAgICAgICB0aGlzLl9lbWl0UHJvZ3Jlc3MobGVuZ3RoLCBsZW5ndGgpO1xuICAgICAgICB0aGlzLl9lbWl0U3VjY2VzcygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX29mZnNldCA9IG9mZnNldDtcbiAgICAgIHRoaXMuX3N0YXJ0VXBsb2FkKCk7XG4gICAgfTtcblxuICAgIHhoci5vbmVycm9yID0gKGVycikgPT4ge1xuICAgICAgdGhpcy5fZW1pdFhockVycm9yKHhociwgbmV3IEVycm9yKFwidHVzOiBmYWlsZWQgdG8gcmVzdW1lIHVwbG9hZFwiKSwgZXJyKTtcbiAgICB9O1xuXG4gICAgdGhpcy5fc2V0dXBYSFIoeGhyKTtcbiAgICB4aHIuc2VuZChudWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB1cGxvYWRpbmcgdGhlIGZpbGUgdXNpbmcgUEFUQ0ggcmVxdWVzdHMuIFRoZSBmaWxlIHdpbGwgYmUgZGl2aWRlZFxuICAgKiBpbnRvIGNodW5rcyBhcyBzcGVjaWZpZWQgaW4gdGhlIGNodW5rU2l6ZSBvcHRpb24uIER1cmluZyB0aGUgdXBsb2FkXG4gICAqIHRoZSBvblByb2dyZXNzIGV2ZW50IGhhbmRsZXIgbWF5IGJlIGludm9rZWQgbXVsdGlwbGUgdGltZXMuXG4gICAqXG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cbiAgX3N0YXJ0VXBsb2FkKCkge1xuICAgIC8vIElmIHRoZSB1cGxvYWQgaGFzIGJlZW4gYWJvcnRlZCwgd2Ugd2lsbCBub3Qgc2VuZCB0aGUgbmV4dCBQQVRDSCByZXF1ZXN0LlxuICAgIC8vIFRoaXMgaXMgaW1wb3J0YW50IGlmIHRoZSBhYm9ydCBtZXRob2Qgd2FzIGNhbGxlZCBkdXJpbmcgYSBjYWxsYmFjaywgc3VjaFxuICAgIC8vIGFzIG9uQ2h1bmtDb21wbGV0ZSBvciBvblByb2dyZXNzLlxuICAgIGlmICh0aGlzLl9hYm9ydGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHhociA9IG5ld1JlcXVlc3QoKTtcblxuICAgIC8vIFNvbWUgYnJvd3NlciBhbmQgc2VydmVycyBtYXkgbm90IHN1cHBvcnQgdGhlIFBBVENIIG1ldGhvZC4gRm9yIHRob3NlXG4gICAgLy8gY2FzZXMsIHlvdSBjYW4gdGVsbCB0dXMtanMtY2xpZW50IHRvIHVzZSBhIFBPU1QgcmVxdWVzdCB3aXRoIHRoZVxuICAgIC8vIFgtSFRUUC1NZXRob2QtT3ZlcnJpZGUgaGVhZGVyIGZvciBzaW11bGF0aW5nIGEgUEFUQ0ggcmVxdWVzdC5cbiAgICBpZiAodGhpcy5vcHRpb25zLm92ZXJyaWRlUGF0Y2hNZXRob2QpIHtcbiAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCB0aGlzLnVybCwgdHJ1ZSk7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlgtSFRUUC1NZXRob2QtT3ZlcnJpZGVcIiwgXCJQQVRDSFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgeGhyLm9wZW4oXCJQQVRDSFwiLCB0aGlzLnVybCwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgeGhyLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgIGlmICghaW5TdGF0dXNDYXRlZ29yeSh4aHIuc3RhdHVzLCAyMDApKSB7XG4gICAgICAgIHRoaXMuX2VtaXRYaHJFcnJvcih4aHIsIG5ldyBFcnJvcihcInR1czogdW5leHBlY3RlZCByZXNwb25zZSB3aGlsZSB1cGxvYWRpbmcgY2h1bmtcIikpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxldCBvZmZzZXQgPSBwYXJzZUludCh4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJVcGxvYWQtT2Zmc2V0XCIpLCAxMCk7XG4gICAgICBpZiAoaXNOYU4ob2Zmc2V0KSkge1xuICAgICAgICB0aGlzLl9lbWl0WGhyRXJyb3IoeGhyLCBuZXcgRXJyb3IoXCJ0dXM6IGludmFsaWQgb3IgbWlzc2luZyBvZmZzZXQgdmFsdWVcIikpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2VtaXRQcm9ncmVzcyhvZmZzZXQsIHRoaXMuX3NpemUpO1xuICAgICAgdGhpcy5fZW1pdENodW5rQ29tcGxldGUob2Zmc2V0IC0gdGhpcy5fb2Zmc2V0LCBvZmZzZXQsIHRoaXMuX3NpemUpO1xuXG4gICAgICB0aGlzLl9vZmZzZXQgPSBvZmZzZXQ7XG5cbiAgICAgIGlmIChvZmZzZXQgPT0gdGhpcy5fc2l6ZSkge1xuICAgICAgICAvLyBZYXksIGZpbmFsbHkgZG9uZSA6KVxuICAgICAgICB0aGlzLl9lbWl0U3VjY2VzcygpO1xuICAgICAgICB0aGlzLl9zb3VyY2UuY2xvc2UoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9zdGFydFVwbG9hZCgpO1xuICAgIH07XG5cbiAgICB4aHIub25lcnJvciA9IChlcnIpID0+IHtcbiAgICAgIC8vIERvbid0IGVtaXQgYW4gZXJyb3IgaWYgdGhlIHVwbG9hZCB3YXMgYWJvcnRlZCBtYW51YWxseVxuICAgICAgaWYgKHRoaXMuX2Fib3J0ZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9lbWl0WGhyRXJyb3IoeGhyLCBuZXcgRXJyb3IoXCJ0dXM6IGZhaWxlZCB0byB1cGxvYWQgY2h1bmsgYXQgb2Zmc2V0IFwiICsgdGhpcy5fb2Zmc2V0KSwgZXJyKTtcbiAgICB9O1xuXG4gICAgLy8gVGVzdCBzdXBwb3J0IGZvciBwcm9ncmVzcyBldmVudHMgYmVmb3JlIGF0dGFjaGluZyBhbiBldmVudCBsaXN0ZW5lclxuICAgIGlmIChcInVwbG9hZFwiIGluIHhocikge1xuICAgICAgeGhyLnVwbG9hZC5vbnByb2dyZXNzID0gKGUpID0+IHtcbiAgICAgICAgaWYgKCFlLmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9lbWl0UHJvZ3Jlc3Moc3RhcnQgKyBlLmxvYWRlZCwgdGhpcy5fc2l6ZSk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHRoaXMuX3NldHVwWEhSKHhocik7XG5cbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlVwbG9hZC1PZmZzZXRcIiwgdGhpcy5fb2Zmc2V0KTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL29mZnNldCtvY3RldC1zdHJlYW1cIik7XG5cbiAgICBsZXQgc3RhcnQgPSB0aGlzLl9vZmZzZXQ7XG4gICAgbGV0IGVuZCA9IHRoaXMuX29mZnNldCArIHRoaXMub3B0aW9ucy5jaHVua1NpemU7XG5cbiAgICAvLyBUaGUgc3BlY2lmaWVkIGNodW5rU2l6ZSBtYXkgYmUgSW5maW5pdHkgb3IgdGhlIGNhbGNsdWF0ZWQgZW5kIHBvc2l0aW9uXG4gICAgLy8gbWF5IGV4Y2VlZCB0aGUgZmlsZSdzIHNpemUuIEluIGJvdGggY2FzZXMsIHdlIGxpbWl0IHRoZSBlbmQgcG9zaXRpb24gdG9cbiAgICAvLyB0aGUgaW5wdXQncyB0b3RhbCBzaXplIGZvciBzaW1wbGVyIGNhbGN1bGF0aW9ucyBhbmQgY29ycmVjdG5lc3MuXG4gICAgaWYgKGVuZCA9PT0gSW5maW5pdHkgfHwgZW5kID4gdGhpcy5fc2l6ZSkge1xuICAgICAgZW5kID0gdGhpcy5fc2l6ZTtcbiAgICB9XG5cbiAgICB4aHIuc2VuZCh0aGlzLl9zb3VyY2Uuc2xpY2Uoc3RhcnQsIGVuZCkpO1xuICB9XG5cbn1cblxuZnVuY3Rpb24gZW5jb2RlTWV0YWRhdGEobWV0YWRhdGEpIHtcbiAgICBpZiAoIUJhc2U2NC5pc1N1cHBvcnRlZCkge1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG5cbiAgICB2YXIgZW5jb2RlZCA9IFtdO1xuXG4gICAgZm9yICh2YXIga2V5IGluIG1ldGFkYXRhKSB7XG4gICAgICAgIGVuY29kZWQucHVzaChrZXkgKyBcIiBcIiArIEJhc2U2NC5lbmNvZGUobWV0YWRhdGFba2V5XSkpO1xuICAgIH1cblxuICAgIHJldHVybiBlbmNvZGVkLmpvaW4oXCIsXCIpO1xufVxuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIGEgZ2l2ZW4gc3RhdHVzIGlzIGluIHRoZSByYW5nZSBvZiB0aGUgZXhwZWN0ZWQgY2F0ZWdvcnkuXG4gKiBGb3IgZXhhbXBsZSwgb25seSBhIHN0YXR1cyBiZXR3ZWVuIDIwMCBhbmQgMjk5IHdpbGwgc2F0aXNmeSB0aGUgY2F0ZWdvcnkgMjAwLlxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBpblN0YXR1c0NhdGVnb3J5KHN0YXR1cywgY2F0ZWdvcnkpIHtcbiAgcmV0dXJuIChzdGF0dXMgPj0gY2F0ZWdvcnkgJiYgc3RhdHVzIDwgKGNhdGVnb3J5ICsgMTAwKSk7XG59XG5cblVwbG9hZC5kZWZhdWx0T3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zO1xuXG5leHBvcnQgZGVmYXVsdCBVcGxvYWQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxudmFyIGlzQXJyYXkgPSBmdW5jdGlvbiBpc0FycmF5KGFycikge1xuXHRpZiAodHlwZW9mIEFycmF5LmlzQXJyYXkgPT09ICdmdW5jdGlvbicpIHtcblx0XHRyZXR1cm4gQXJyYXkuaXNBcnJheShhcnIpO1xuXHR9XG5cblx0cmV0dXJuIHRvU3RyLmNhbGwoYXJyKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbnZhciBpc1BsYWluT2JqZWN0ID0gZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvYmopIHtcblx0aWYgKCFvYmogfHwgdG9TdHIuY2FsbChvYmopICE9PSAnW29iamVjdCBPYmplY3RdJykge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHZhciBoYXNPd25Db25zdHJ1Y3RvciA9IGhhc093bi5jYWxsKG9iaiwgJ2NvbnN0cnVjdG9yJyk7XG5cdHZhciBoYXNJc1Byb3RvdHlwZU9mID0gb2JqLmNvbnN0cnVjdG9yICYmIG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgJiYgaGFzT3duLmNhbGwob2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSwgJ2lzUHJvdG90eXBlT2YnKTtcblx0Ly8gTm90IG93biBjb25zdHJ1Y3RvciBwcm9wZXJ0eSBtdXN0IGJlIE9iamVjdFxuXHRpZiAob2JqLmNvbnN0cnVjdG9yICYmICFoYXNPd25Db25zdHJ1Y3RvciAmJiAhaGFzSXNQcm90b3R5cGVPZikge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIE93biBwcm9wZXJ0aWVzIGFyZSBlbnVtZXJhdGVkIGZpcnN0bHksIHNvIHRvIHNwZWVkIHVwLFxuXHQvLyBpZiBsYXN0IG9uZSBpcyBvd24sIHRoZW4gYWxsIHByb3BlcnRpZXMgYXJlIG93bi5cblx0dmFyIGtleTtcblx0Zm9yIChrZXkgaW4gb2JqKSB7IC8qKi8gfVxuXG5cdHJldHVybiB0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJyB8fCBoYXNPd24uY2FsbChvYmosIGtleSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGV4dGVuZCgpIHtcblx0dmFyIG9wdGlvbnMsIG5hbWUsIHNyYywgY29weSwgY29weUlzQXJyYXksIGNsb25lO1xuXHR2YXIgdGFyZ2V0ID0gYXJndW1lbnRzWzBdO1xuXHR2YXIgaSA9IDE7XG5cdHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuXHR2YXIgZGVlcCA9IGZhbHNlO1xuXG5cdC8vIEhhbmRsZSBhIGRlZXAgY29weSBzaXR1YXRpb25cblx0aWYgKHR5cGVvZiB0YXJnZXQgPT09ICdib29sZWFuJykge1xuXHRcdGRlZXAgPSB0YXJnZXQ7XG5cdFx0dGFyZ2V0ID0gYXJndW1lbnRzWzFdIHx8IHt9O1xuXHRcdC8vIHNraXAgdGhlIGJvb2xlYW4gYW5kIHRoZSB0YXJnZXRcblx0XHRpID0gMjtcblx0fVxuXHRpZiAodGFyZ2V0ID09IG51bGwgfHwgKHR5cGVvZiB0YXJnZXQgIT09ICdvYmplY3QnICYmIHR5cGVvZiB0YXJnZXQgIT09ICdmdW5jdGlvbicpKSB7XG5cdFx0dGFyZ2V0ID0ge307XG5cdH1cblxuXHRmb3IgKDsgaSA8IGxlbmd0aDsgKytpKSB7XG5cdFx0b3B0aW9ucyA9IGFyZ3VtZW50c1tpXTtcblx0XHQvLyBPbmx5IGRlYWwgd2l0aCBub24tbnVsbC91bmRlZmluZWQgdmFsdWVzXG5cdFx0aWYgKG9wdGlvbnMgIT0gbnVsbCkge1xuXHRcdFx0Ly8gRXh0ZW5kIHRoZSBiYXNlIG9iamVjdFxuXHRcdFx0Zm9yIChuYW1lIGluIG9wdGlvbnMpIHtcblx0XHRcdFx0c3JjID0gdGFyZ2V0W25hbWVdO1xuXHRcdFx0XHRjb3B5ID0gb3B0aW9uc1tuYW1lXTtcblxuXHRcdFx0XHQvLyBQcmV2ZW50IG5ldmVyLWVuZGluZyBsb29wXG5cdFx0XHRcdGlmICh0YXJnZXQgIT09IGNvcHkpIHtcblx0XHRcdFx0XHQvLyBSZWN1cnNlIGlmIHdlJ3JlIG1lcmdpbmcgcGxhaW4gb2JqZWN0cyBvciBhcnJheXNcblx0XHRcdFx0XHRpZiAoZGVlcCAmJiBjb3B5ICYmIChpc1BsYWluT2JqZWN0KGNvcHkpIHx8IChjb3B5SXNBcnJheSA9IGlzQXJyYXkoY29weSkpKSkge1xuXHRcdFx0XHRcdFx0aWYgKGNvcHlJc0FycmF5KSB7XG5cdFx0XHRcdFx0XHRcdGNvcHlJc0FycmF5ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdGNsb25lID0gc3JjICYmIGlzQXJyYXkoc3JjKSA/IHNyYyA6IFtdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Y2xvbmUgPSBzcmMgJiYgaXNQbGFpbk9iamVjdChzcmMpID8gc3JjIDoge307XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIE5ldmVyIG1vdmUgb3JpZ2luYWwgb2JqZWN0cywgY2xvbmUgdGhlbVxuXHRcdFx0XHRcdFx0dGFyZ2V0W25hbWVdID0gZXh0ZW5kKGRlZXAsIGNsb25lLCBjb3B5KTtcblxuXHRcdFx0XHRcdC8vIERvbid0IGJyaW5nIGluIHVuZGVmaW5lZCB2YWx1ZXNcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBjb3B5ICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdFx0dGFyZ2V0W25hbWVdID0gY29weTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBSZXR1cm4gdGhlIG1vZGlmaWVkIG9iamVjdFxuXHRyZXR1cm4gdGFyZ2V0O1xufTtcbiIsIi8vIENvcHlyaWdodCAyMDE0IFNpbW9uIEx5ZGVsbFxyXG4vLyBYMTEgKOKAnE1JVOKAnSkgTGljZW5zZWQuIChTZWUgTElDRU5TRS4pXHJcblxyXG52b2lkIChmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XHJcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICBkZWZpbmUoZmFjdG9yeSlcclxuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKVxyXG4gIH0gZWxzZSB7XHJcbiAgICByb290LnJlc29sdmVVcmwgPSBmYWN0b3J5KClcclxuICB9XHJcbn0odGhpcywgZnVuY3Rpb24oKSB7XHJcblxyXG4gIGZ1bmN0aW9uIHJlc29sdmVVcmwoLyogLi4udXJscyAqLykge1xyXG4gICAgdmFyIG51bVVybHMgPSBhcmd1bWVudHMubGVuZ3RoXHJcblxyXG4gICAgaWYgKG51bVVybHMgPT09IDApIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwicmVzb2x2ZVVybCByZXF1aXJlcyBhdCBsZWFzdCBvbmUgYXJndW1lbnQ7IGdvdCBub25lLlwiKVxyXG4gICAgfVxyXG5cclxuICAgIHZhciBiYXNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJhc2VcIilcclxuICAgIGJhc2UuaHJlZiA9IGFyZ3VtZW50c1swXVxyXG5cclxuICAgIGlmIChudW1VcmxzID09PSAxKSB7XHJcbiAgICAgIHJldHVybiBiYXNlLmhyZWZcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXVxyXG4gICAgaGVhZC5pbnNlcnRCZWZvcmUoYmFzZSwgaGVhZC5maXJzdENoaWxkKVxyXG5cclxuICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIilcclxuICAgIHZhciByZXNvbHZlZFxyXG5cclxuICAgIGZvciAodmFyIGluZGV4ID0gMTsgaW5kZXggPCBudW1VcmxzOyBpbmRleCsrKSB7XHJcbiAgICAgIGEuaHJlZiA9IGFyZ3VtZW50c1tpbmRleF1cclxuICAgICAgcmVzb2x2ZWQgPSBhLmhyZWZcclxuICAgICAgYmFzZS5ocmVmID0gcmVzb2x2ZWRcclxuICAgIH1cclxuXHJcbiAgICBoZWFkLnJlbW92ZUNoaWxkKGJhc2UpXHJcblxyXG4gICAgcmV0dXJuIHJlc29sdmVkXHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzb2x2ZVVybFxyXG5cclxufSkpO1xyXG4iXX0=
