/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@transloadit/prettier-bytes/prettierBytes.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@transloadit/prettier-bytes/prettierBytes.js ***!
  \*******************************************************************/
/***/ ((module) => {

// Adapted from https://github.com/Flet/prettier-bytes/
// Changing 1000 bytes to 1024, so we can keep uppercase KB vs kB
// ISC License (c) Dan Flettre https://github.com/Flet/prettier-bytes/blob/master/LICENSE
module.exports = function prettierBytes (num) {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new TypeError('Expected a number, got ' + typeof num)
  }

  var neg = num < 0
  var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  if (neg) {
    num = -num
  }

  if (num < 1) {
    return (neg ? '-' : '') + num + ' B'
  }

  var exponent = Math.min(Math.floor(Math.log(num) / Math.log(1024)), units.length - 1)
  num = Number(num / Math.pow(1024, exponent))
  var unit = units[exponent]

  if (num >= 10 || num % 1 === 0) {
    // Do not show decimals when the number is two-digit, or if the number has no
    // decimal component.
    return (neg ? '-' : '') + num.toFixed(0) + ' ' + unit
  } else {
    return (neg ? '-' : '') + num.toFixed(1) + ' ' + unit
  }
}


/***/ }),

/***/ "./node_modules/@uppy/companion-client/lib/AuthError.js":
/*!**************************************************************!*\
  !*** ./node_modules/@uppy/companion-client/lib/AuthError.js ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";


class AuthError extends Error {
  constructor() {
    super('Authorization required');
    this.name = 'AuthError';
    this.isAuthError = true;
  }

}

module.exports = AuthError;

/***/ }),

/***/ "./node_modules/@uppy/companion-client/lib/Provider.js":
/*!*************************************************************!*\
  !*** ./node_modules/@uppy/companion-client/lib/Provider.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const RequestClient = __webpack_require__(/*! ./RequestClient */ "./node_modules/@uppy/companion-client/lib/RequestClient.js");

const tokenStorage = __webpack_require__(/*! ./tokenStorage */ "./node_modules/@uppy/companion-client/lib/tokenStorage.js");

const getName = id => {
  return id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
};

module.exports = class Provider extends RequestClient {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.provider = opts.provider;
    this.id = this.provider;
    this.name = this.opts.name || getName(this.id);
    this.pluginId = this.opts.pluginId;
    this.tokenKey = `companion-${this.pluginId}-auth-token`;
    this.companionKeysParams = this.opts.companionKeysParams;
    this.preAuthToken = null;
  }

  headers() {
    return Promise.all([super.headers(), this.getAuthToken()]).then(_ref => {
      let [headers, token] = _ref;
      const authHeaders = {};

      if (token) {
        authHeaders['uppy-auth-token'] = token;
      }

      if (this.companionKeysParams) {
        authHeaders['uppy-credentials-params'] = btoa(JSON.stringify({
          params: this.companionKeysParams
        }));
      }

      return { ...headers,
        ...authHeaders
      };
    });
  }

  onReceiveResponse(response) {
    response = super.onReceiveResponse(response);
    const plugin = this.uppy.getPlugin(this.pluginId);
    const oldAuthenticated = plugin.getPluginState().authenticated;
    const authenticated = oldAuthenticated ? response.status !== 401 : response.status < 400;
    plugin.setPluginState({
      authenticated
    });
    return response;
  }

  setAuthToken(token) {
    return this.uppy.getPlugin(this.pluginId).storage.setItem(this.tokenKey, token);
  }

  getAuthToken() {
    return this.uppy.getPlugin(this.pluginId).storage.getItem(this.tokenKey);
  }
  /**
   * Ensure we have a preauth token if necessary. Attempts to fetch one if we don't,
   * or rejects if loading one fails.
   */


  async ensurePreAuth() {
    if (this.companionKeysParams && !this.preAuthToken) {
      await this.fetchPreAuthToken();

      if (!this.preAuthToken) {
        throw new Error('Could not load authentication data required for third-party login. Please try again later.');
      }
    }
  }

  authUrl(queries) {
    if (queries === void 0) {
      queries = {};
    }

    const params = new URLSearchParams(queries);

    if (this.preAuthToken) {
      params.set('uppyPreAuthToken', this.preAuthToken);
    }

    return `${this.hostname}/${this.id}/connect?${params}`;
  }

  fileUrl(id) {
    return `${this.hostname}/${this.id}/get/${id}`;
  }

  async fetchPreAuthToken() {
    if (!this.companionKeysParams) {
      return;
    }

    try {
      const res = await this.post(`${this.id}/preauth/`, {
        params: this.companionKeysParams
      });
      this.preAuthToken = res.token;
    } catch (err) {
      this.uppy.log(`[CompanionClient] unable to fetch preAuthToken ${err}`, 'warning');
    }
  }

  list(directory) {
    return this.get(`${this.id}/list/${directory || ''}`);
  }

  logout() {
    return this.get(`${this.id}/logout`).then(response => Promise.all([response, this.uppy.getPlugin(this.pluginId).storage.removeItem(this.tokenKey)])).then(_ref2 => {
      let [response] = _ref2;
      return response;
    });
  }

  static initPlugin(plugin, opts, defaultOpts) {
    plugin.type = 'acquirer';
    plugin.files = [];

    if (defaultOpts) {
      plugin.opts = { ...defaultOpts,
        ...opts
      };
    }

    if (opts.serverUrl || opts.serverPattern) {
      throw new Error('`serverUrl` and `serverPattern` have been renamed to `companionUrl` and `companionAllowedHosts` respectively in the 0.30.5 release. Please consult the docs (for example, https://uppy.io/docs/instagram/ for the Instagram plugin) and use the updated options.`');
    }

    if (opts.companionAllowedHosts) {
      const pattern = opts.companionAllowedHosts; // validate companionAllowedHosts param

      if (typeof pattern !== 'string' && !Array.isArray(pattern) && !(pattern instanceof RegExp)) {
        throw new TypeError(`${plugin.id}: the option "companionAllowedHosts" must be one of string, Array, RegExp`);
      }

      plugin.opts.companionAllowedHosts = pattern;
    } else if (/^(?!https?:\/\/).*$/i.test(opts.companionUrl)) {
      // does not start with https://
      plugin.opts.companionAllowedHosts = `https://${opts.companionUrl.replace(/^\/\//, '')}`;
    } else {
      plugin.opts.companionAllowedHosts = new URL(opts.companionUrl).origin;
    }

    plugin.storage = plugin.opts.storage || tokenStorage;
  }

};

/***/ }),

/***/ "./node_modules/@uppy/companion-client/lib/RequestClient.js":
/*!******************************************************************!*\
  !*** ./node_modules/@uppy/companion-client/lib/RequestClient.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _class, _getPostResponseFunc, _getUrl, _errorHandler, _temp;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const fetchWithNetworkError = __webpack_require__(/*! @uppy/utils/lib/fetchWithNetworkError */ "./node_modules/@uppy/utils/lib/fetchWithNetworkError.js");

const AuthError = __webpack_require__(/*! ./AuthError */ "./node_modules/@uppy/companion-client/lib/AuthError.js"); // Remove the trailing slash so we can always safely append /xyz.


function stripSlash(url) {
  return url.replace(/\/$/, '');
}

async function handleJSONResponse(res) {
  if (res.status === 401) {
    throw new AuthError();
  }

  const jsonPromise = res.json();

  if (res.status < 200 || res.status > 300) {
    let errMsg = `Failed request with status: ${res.status}. ${res.statusText}`;

    try {
      const errData = await jsonPromise;
      errMsg = errData.message ? `${errMsg} message: ${errData.message}` : errMsg;
      errMsg = errData.requestId ? `${errMsg} request-Id: ${errData.requestId}` : errMsg;
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      throw new Error(errMsg);
    }
  }

  return jsonPromise;
}

module.exports = (_temp = (_getPostResponseFunc = /*#__PURE__*/_classPrivateFieldLooseKey("getPostResponseFunc"), _getUrl = /*#__PURE__*/_classPrivateFieldLooseKey("getUrl"), _errorHandler = /*#__PURE__*/_classPrivateFieldLooseKey("errorHandler"), _class = class RequestClient {
  // eslint-disable-next-line global-require
  constructor(uppy, opts) {
    Object.defineProperty(this, _errorHandler, {
      value: _errorHandler2
    });
    Object.defineProperty(this, _getUrl, {
      value: _getUrl2
    });
    Object.defineProperty(this, _getPostResponseFunc, {
      writable: true,
      value: skip => response => skip ? response : this.onReceiveResponse(response)
    });
    this.uppy = uppy;
    this.opts = opts;
    this.onReceiveResponse = this.onReceiveResponse.bind(this);
    this.allowedHeaders = ['accept', 'content-type', 'uppy-auth-token'];
    this.preflightDone = false;
  }

  get hostname() {
    const {
      companion
    } = this.uppy.getState();
    const host = this.opts.companionUrl;
    return stripSlash(companion && companion[host] ? companion[host] : host);
  }

  headers() {
    const userHeaders = this.opts.companionHeaders || {};
    return Promise.resolve({ ...RequestClient.defaultHeaders,
      ...userHeaders
    });
  }

  onReceiveResponse(response) {
    const state = this.uppy.getState();
    const companion = state.companion || {};
    const host = this.opts.companionUrl;
    const {
      headers
    } = response; // Store the self-identified domain name for the Companion instance we just hit.

    if (headers.has('i-am') && headers.get('i-am') !== companion[host]) {
      this.uppy.setState({
        companion: { ...companion,
          [host]: headers.get('i-am')
        }
      });
    }

    return response;
  }

  preflight(path) {
    if (this.preflightDone) {
      return Promise.resolve(this.allowedHeaders.slice());
    }

    return fetch(_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path), {
      method: 'OPTIONS'
    }).then(response => {
      if (response.headers.has('access-control-allow-headers')) {
        this.allowedHeaders = response.headers.get('access-control-allow-headers').split(',').map(headerName => headerName.trim().toLowerCase());
      }

      this.preflightDone = true;
      return this.allowedHeaders.slice();
    }).catch(err => {
      this.uppy.log(`[CompanionClient] unable to make preflight request ${err}`, 'warning');
      this.preflightDone = true;
      return this.allowedHeaders.slice();
    });
  }

  preflightAndHeaders(path) {
    return Promise.all([this.preflight(path), this.headers()]).then(_ref => {
      let [allowedHeaders, headers] = _ref;
      // filter to keep only allowed Headers
      Object.keys(headers).forEach(header => {
        if (!allowedHeaders.includes(header.toLowerCase())) {
          this.uppy.log(`[CompanionClient] excluding disallowed header ${header}`);
          delete headers[header]; // eslint-disable-line no-param-reassign
        }
      });
      return headers;
    });
  }

  get(path, skipPostResponse) {
    const method = 'get';
    return this.preflightAndHeaders(path).then(headers => fetchWithNetworkError(_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path), {
      method,
      headers,
      credentials: this.opts.companionCookiesRule || 'same-origin'
    })).then(_classPrivateFieldLooseBase(this, _getPostResponseFunc)[_getPostResponseFunc](skipPostResponse)).then(handleJSONResponse).catch(_classPrivateFieldLooseBase(this, _errorHandler)[_errorHandler](method, path));
  }

  post(path, data, skipPostResponse) {
    const method = 'post';
    return this.preflightAndHeaders(path).then(headers => fetchWithNetworkError(_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path), {
      method,
      headers,
      credentials: this.opts.companionCookiesRule || 'same-origin',
      body: JSON.stringify(data)
    })).then(_classPrivateFieldLooseBase(this, _getPostResponseFunc)[_getPostResponseFunc](skipPostResponse)).then(handleJSONResponse).catch(_classPrivateFieldLooseBase(this, _errorHandler)[_errorHandler](method, path));
  }

  delete(path, data, skipPostResponse) {
    const method = 'delete';
    return this.preflightAndHeaders(path).then(headers => fetchWithNetworkError(`${this.hostname}/${path}`, {
      method,
      headers,
      credentials: this.opts.companionCookiesRule || 'same-origin',
      body: data ? JSON.stringify(data) : null
    })).then(_classPrivateFieldLooseBase(this, _getPostResponseFunc)[_getPostResponseFunc](skipPostResponse)).then(handleJSONResponse).catch(_classPrivateFieldLooseBase(this, _errorHandler)[_errorHandler](method, path));
  }

}), _class.VERSION = "2.0.5", _class.defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'Uppy-Versions': `@uppy/companion-client=${_class.VERSION}`
}, _temp);

function _getUrl2(url) {
  if (/^(https?:|)\/\//.test(url)) {
    return url;
  }

  return `${this.hostname}/${url}`;
}

function _errorHandler2(method, path) {
  return err => {
    var _err;

    if (!((_err = err) != null && _err.isAuthError)) {
      const error = new Error(`Could not ${method} ${_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path)}`);
      error.cause = err;
      err = error; // eslint-disable-line no-param-reassign
    }

    return Promise.reject(err);
  };
}

/***/ }),

/***/ "./node_modules/@uppy/companion-client/lib/SearchProvider.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@uppy/companion-client/lib/SearchProvider.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const RequestClient = __webpack_require__(/*! ./RequestClient */ "./node_modules/@uppy/companion-client/lib/RequestClient.js");

const getName = id => {
  return id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
};

module.exports = class SearchProvider extends RequestClient {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.provider = opts.provider;
    this.id = this.provider;
    this.name = this.opts.name || getName(this.id);
    this.pluginId = this.opts.pluginId;
  }

  fileUrl(id) {
    return `${this.hostname}/search/${this.id}/get/${id}`;
  }

  search(text, queries) {
    queries = queries ? `&${queries}` : '';
    return this.get(`search/${this.id}/list?q=${encodeURIComponent(text)}${queries}`);
  }

};

/***/ }),

/***/ "./node_modules/@uppy/companion-client/lib/Socket.js":
/*!***********************************************************!*\
  !*** ./node_modules/@uppy/companion-client/lib/Socket.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _queued, _emitter, _isOpen, _socket, _handleMessage;

let _Symbol$for, _Symbol$for2;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const ee = __webpack_require__(/*! namespace-emitter */ "./node_modules/namespace-emitter/index.js");

module.exports = (_queued = /*#__PURE__*/_classPrivateFieldLooseKey("queued"), _emitter = /*#__PURE__*/_classPrivateFieldLooseKey("emitter"), _isOpen = /*#__PURE__*/_classPrivateFieldLooseKey("isOpen"), _socket = /*#__PURE__*/_classPrivateFieldLooseKey("socket"), _handleMessage = /*#__PURE__*/_classPrivateFieldLooseKey("handleMessage"), _Symbol$for = Symbol.for('uppy test: getSocket'), _Symbol$for2 = Symbol.for('uppy test: getQueued'), class UppySocket {
  constructor(opts) {
    Object.defineProperty(this, _queued, {
      writable: true,
      value: []
    });
    Object.defineProperty(this, _emitter, {
      writable: true,
      value: ee()
    });
    Object.defineProperty(this, _isOpen, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _socket, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _handleMessage, {
      writable: true,
      value: e => {
        try {
          const message = JSON.parse(e.data);
          this.emit(message.action, message.payload);
        } catch (err) {
          // TODO: use a more robust error handler.
          console.log(err); // eslint-disable-line no-console
        }
      }
    });
    this.opts = opts;

    if (!opts || opts.autoOpen !== false) {
      this.open();
    }
  }

  get isOpen() {
    return _classPrivateFieldLooseBase(this, _isOpen)[_isOpen];
  }

  [_Symbol$for]() {
    return _classPrivateFieldLooseBase(this, _socket)[_socket];
  }

  [_Symbol$for2]() {
    return _classPrivateFieldLooseBase(this, _queued)[_queued];
  }

  open() {
    _classPrivateFieldLooseBase(this, _socket)[_socket] = new WebSocket(this.opts.target);

    _classPrivateFieldLooseBase(this, _socket)[_socket].onopen = () => {
      _classPrivateFieldLooseBase(this, _isOpen)[_isOpen] = true;

      while (_classPrivateFieldLooseBase(this, _queued)[_queued].length > 0 && _classPrivateFieldLooseBase(this, _isOpen)[_isOpen]) {
        const first = _classPrivateFieldLooseBase(this, _queued)[_queued].shift();

        this.send(first.action, first.payload);
      }
    };

    _classPrivateFieldLooseBase(this, _socket)[_socket].onclose = () => {
      _classPrivateFieldLooseBase(this, _isOpen)[_isOpen] = false;
    };

    _classPrivateFieldLooseBase(this, _socket)[_socket].onmessage = _classPrivateFieldLooseBase(this, _handleMessage)[_handleMessage];
  }

  close() {
    var _classPrivateFieldLoo;

    (_classPrivateFieldLoo = _classPrivateFieldLooseBase(this, _socket)[_socket]) == null ? void 0 : _classPrivateFieldLoo.close();
  }

  send(action, payload) {
    // attach uuid
    if (!_classPrivateFieldLooseBase(this, _isOpen)[_isOpen]) {
      _classPrivateFieldLooseBase(this, _queued)[_queued].push({
        action,
        payload
      });

      return;
    }

    _classPrivateFieldLooseBase(this, _socket)[_socket].send(JSON.stringify({
      action,
      payload
    }));
  }

  on(action, handler) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].on(action, handler);
  }

  emit(action, payload) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].emit(action, payload);
  }

  once(action, handler) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].once(action, handler);
  }

});

/***/ }),

/***/ "./node_modules/@uppy/companion-client/lib/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@uppy/companion-client/lib/index.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/**
 * Manages communications with Companion
 */

const RequestClient = __webpack_require__(/*! ./RequestClient */ "./node_modules/@uppy/companion-client/lib/RequestClient.js");

const Provider = __webpack_require__(/*! ./Provider */ "./node_modules/@uppy/companion-client/lib/Provider.js");

const SearchProvider = __webpack_require__(/*! ./SearchProvider */ "./node_modules/@uppy/companion-client/lib/SearchProvider.js");

const Socket = __webpack_require__(/*! ./Socket */ "./node_modules/@uppy/companion-client/lib/Socket.js");

module.exports = {
  RequestClient,
  Provider,
  SearchProvider,
  Socket
};

/***/ }),

/***/ "./node_modules/@uppy/companion-client/lib/tokenStorage.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@uppy/companion-client/lib/tokenStorage.js ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";

/**
 * This module serves as an Async wrapper for LocalStorage
 */

module.exports.setItem = (key, value) => {
  return new Promise(resolve => {
    localStorage.setItem(key, value);
    resolve();
  });
};

module.exports.getItem = key => {
  return Promise.resolve(localStorage.getItem(key));
};

module.exports.removeItem = key => {
  return new Promise(resolve => {
    localStorage.removeItem(key);
    resolve();
  });
};

/***/ }),

/***/ "./node_modules/@uppy/core/lib/BasePlugin.js":
/*!***************************************************!*\
  !*** ./node_modules/@uppy/core/lib/BasePlugin.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Core plugin logic that all plugins share.
 *
 * BasePlugin does not contain DOM rendering so it can be used for plugins
 * without a user interface.
 *
 * See `Plugin` for the extended version with Preact rendering for interfaces.
 */
const Translator = __webpack_require__(/*! @uppy/utils/lib/Translator */ "./node_modules/@uppy/utils/lib/Translator.js");

module.exports = class BasePlugin {
  constructor(uppy, opts) {
    if (opts === void 0) {
      opts = {};
    }

    this.uppy = uppy;
    this.opts = opts;
  }

  getPluginState() {
    const {
      plugins
    } = this.uppy.getState();
    return plugins[this.id] || {};
  }

  setPluginState(update) {
    const {
      plugins
    } = this.uppy.getState();
    this.uppy.setState({
      plugins: { ...plugins,
        [this.id]: { ...plugins[this.id],
          ...update
        }
      }
    });
  }

  setOptions(newOpts) {
    this.opts = { ...this.opts,
      ...newOpts
    };
    this.setPluginState(); // so that UI re-renders with new options

    this.i18nInit();
  }

  i18nInit() {
    const translator = new Translator([this.defaultLocale, this.uppy.locale, this.opts.locale]);
    this.i18n = translator.translate.bind(translator);
    this.i18nArray = translator.translateArray.bind(translator);
    this.setPluginState(); // so that UI re-renders and we see the updated locale
  }
  /**
   * Extendable methods
   * ==================
   * These methods are here to serve as an overview of the extendable methods as well as
   * making them not conditional in use, such as `if (this.afterUpdate)`.
   */
  // eslint-disable-next-line class-methods-use-this


  addTarget() {
    throw new Error('Extend the addTarget method to add your plugin to another plugin\'s target');
  } // eslint-disable-next-line class-methods-use-this


  install() {} // eslint-disable-next-line class-methods-use-this


  uninstall() {}
  /**
   * Called when plugin is mounted, whether in DOM or into another plugin.
   * Needed because sometimes plugins are mounted separately/after `install`,
   * so this.el and this.parent might not be available in `install`.
   * This is the case with @uppy/react plugins, for example.
   */


  render() {
    throw new Error('Extend the render method to add your plugin to a DOM element');
  } // eslint-disable-next-line class-methods-use-this


  update() {} // Called after every state update, after everything's mounted. Debounced.
  // eslint-disable-next-line class-methods-use-this


  afterUpdate() {}

};

/***/ }),

/***/ "./node_modules/@uppy/core/lib/Restricter.js":
/*!***************************************************!*\
  !*** ./node_modules/@uppy/core/lib/Restricter.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable max-classes-per-file, class-methods-use-this */

/* global AggregateError */
const prettierBytes = __webpack_require__(/*! @transloadit/prettier-bytes */ "./node_modules/@transloadit/prettier-bytes/prettierBytes.js");

const match = __webpack_require__(/*! mime-match */ "./node_modules/mime-match/index.js");

const defaultOptions = {
  maxFileSize: null,
  minFileSize: null,
  maxTotalFileSize: null,
  maxNumberOfFiles: null,
  minNumberOfFiles: null,
  allowedFileTypes: null,
  requiredMetaFields: []
};

class RestrictionError extends Error {
  constructor() {
    super(...arguments);
    this.isRestriction = true;
  }

}

if (typeof AggregateError === 'undefined') {
  // eslint-disable-next-line no-global-assign
  // TODO: remove this "polyfill" in the next major.
  globalThis.AggregateError = class AggregateError extends Error {
    constructor(errors, message) {
      super(message);
      this.errors = errors;
    }

  };
}

class Restricter {
  constructor(getOpts, i18n) {
    this.i18n = i18n;

    this.getOpts = () => {
      const opts = getOpts();

      if (opts.restrictions.allowedFileTypes != null && !Array.isArray(opts.restrictions.allowedFileTypes)) {
        throw new TypeError('`restrictions.allowedFileTypes` must be an array');
      }

      return opts;
    };
  }

  validate(file, files) {
    const {
      maxFileSize,
      minFileSize,
      maxTotalFileSize,
      maxNumberOfFiles,
      allowedFileTypes
    } = this.getOpts().restrictions;

    if (maxNumberOfFiles && files.length + 1 > maxNumberOfFiles) {
      throw new RestrictionError(`${this.i18n('youCanOnlyUploadX', {
        smart_count: maxNumberOfFiles
      })}`);
    }

    if (allowedFileTypes) {
      const isCorrectFileType = allowedFileTypes.some(type => {
        // check if this is a mime-type
        if (type.includes('/')) {
          if (!file.type) return false;
          return match(file.type.replace(/;.*?$/, ''), type);
        } // otherwise this is likely an extension


        if (type[0] === '.' && file.extension) {
          return file.extension.toLowerCase() === type.slice(1).toLowerCase();
        }

        return false;
      });

      if (!isCorrectFileType) {
        const allowedFileTypesString = allowedFileTypes.join(', ');
        throw new RestrictionError(this.i18n('youCanOnlyUploadFileTypes', {
          types: allowedFileTypesString
        }));
      }
    } // We can't check maxTotalFileSize if the size is unknown.


    if (maxTotalFileSize && file.size != null) {
      const totalFilesSize = files.reduce((total, f) => total + f.size, file.size);

      if (totalFilesSize > maxTotalFileSize) {
        throw new RestrictionError(this.i18n('exceedsSize', {
          size: prettierBytes(maxTotalFileSize),
          file: file.name
        }));
      }
    } // We can't check maxFileSize if the size is unknown.


    if (maxFileSize && file.size != null && file.size > maxFileSize) {
      throw new RestrictionError(this.i18n('exceedsSize', {
        size: prettierBytes(maxFileSize),
        file: file.name
      }));
    } // We can't check minFileSize if the size is unknown.


    if (minFileSize && file.size != null && file.size < minFileSize) {
      throw new RestrictionError(this.i18n('inferiorSize', {
        size: prettierBytes(minFileSize)
      }));
    }
  }

  validateMinNumberOfFiles(files) {
    const {
      minNumberOfFiles
    } = this.getOpts().restrictions;

    if (Object.keys(files).length < minNumberOfFiles) {
      throw new RestrictionError(this.i18n('youHaveToAtLeastSelectX', {
        smart_count: minNumberOfFiles
      }));
    }
  }

  getMissingRequiredMetaFields(file) {
    const error = new RestrictionError(this.i18n('missingRequiredMetaFieldOnFile', {
      fileName: file.name
    }));
    const {
      requiredMetaFields
    } = this.getOpts().restrictions; // TODO: migrate to Object.hasOwn in the next major.

    const own = Object.prototype.hasOwnProperty;
    const missingFields = [];

    for (const field of requiredMetaFields) {
      if (!own.call(file.meta, field) || file.meta[field] === '') {
        missingFields.push(field);
      }
    }

    return {
      missingFields,
      error
    };
  }

}

module.exports = {
  Restricter,
  defaultOptions,
  RestrictionError
};

/***/ }),

/***/ "./node_modules/@uppy/core/lib/UIPlugin.js":
/*!*************************************************!*\
  !*** ./node_modules/@uppy/core/lib/UIPlugin.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const {
  render
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const findDOMElement = __webpack_require__(/*! @uppy/utils/lib/findDOMElement */ "./node_modules/@uppy/utils/lib/findDOMElement.js");

const BasePlugin = __webpack_require__(/*! ./BasePlugin */ "./node_modules/@uppy/core/lib/BasePlugin.js");
/**
 * Defer a frequent call to the microtask queue.
 *
 * @param {() => T} fn
 * @returns {Promise<T>}
 */


function debounce(fn) {
  let calling = null;
  let latestArgs = null;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    latestArgs = args;

    if (!calling) {
      calling = Promise.resolve().then(() => {
        calling = null; // At this point `args` may be different from the most
        // recent state, if multiple calls happened since this task
        // was queued. So we use the `latestArgs`, which definitely
        // is the most recent call.

        return fn(...latestArgs);
      });
    }

    return calling;
  };
}
/**
 * UIPlugin is the extended version of BasePlugin to incorporate rendering with Preact.
 * Use this for plugins that need a user interface.
 *
 * For plugins without an user interface, see BasePlugin.
 */


var _updateUI = /*#__PURE__*/_classPrivateFieldLooseKey("updateUI");

class UIPlugin extends BasePlugin {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, _updateUI, {
      writable: true,
      value: void 0
    });
  }

  /**
   * Check if supplied `target` is a DOM element or an `object`.
   * If it’s an object — target is a plugin, and we search `plugins`
   * for a plugin with same name and return its target.
   */
  mount(target, plugin) {
    const callerPluginName = plugin.id;
    const targetElement = findDOMElement(target);

    if (targetElement) {
      this.isTargetDOMEl = true; // When target is <body> with a single <div> element,
      // Preact thinks it’s the Uppy root element in there when doing a diff,
      // and destroys it. So we are creating a fragment (could be empty div)

      const uppyRootElement = document.createDocumentFragment(); // API for plugins that require a synchronous rerender.

      _classPrivateFieldLooseBase(this, _updateUI)[_updateUI] = debounce(state => {
        // plugin could be removed, but this.rerender is debounced below,
        // so it could still be called even after uppy.removePlugin or uppy.close
        // hence the check
        if (!this.uppy.getPlugin(this.id)) return;
        render(this.render(state), uppyRootElement);
        this.afterUpdate();
      });
      this.uppy.log(`Installing ${callerPluginName} to a DOM element '${target}'`);

      if (this.opts.replaceTargetContent) {
        // Doing render(h(null), targetElement), which should have been
        // a better way, since because the component might need to do additional cleanup when it is removed,
        // stopped working — Preact just adds null into target, not replacing
        targetElement.innerHTML = '';
      }

      render(this.render(this.uppy.getState()), uppyRootElement);
      this.el = uppyRootElement.firstElementChild;
      targetElement.appendChild(uppyRootElement);
      this.onMount();
      return this.el;
    }

    let targetPlugin;

    if (typeof target === 'object' && target instanceof UIPlugin) {
      // Targeting a plugin *instance*
      targetPlugin = target;
    } else if (typeof target === 'function') {
      // Targeting a plugin type
      const Target = target; // Find the target plugin instance.

      this.uppy.iteratePlugins(p => {
        if (p instanceof Target) {
          targetPlugin = p;
          return false;
        }
      });
    }

    if (targetPlugin) {
      this.uppy.log(`Installing ${callerPluginName} to ${targetPlugin.id}`);
      this.parent = targetPlugin;
      this.el = targetPlugin.addTarget(plugin);
      this.onMount();
      return this.el;
    }

    this.uppy.log(`Not installing ${callerPluginName}`);
    let message = `Invalid target option given to ${callerPluginName}.`;

    if (typeof target === 'function') {
      message += ' The given target is not a Plugin class. ' + 'Please check that you\'re not specifying a React Component instead of a plugin. ' + 'If you are using @uppy/* packages directly, make sure you have only 1 version of @uppy/core installed: ' + 'run `npm ls @uppy/core` on the command line and verify that all the versions match and are deduped correctly.';
    } else {
      message += 'If you meant to target an HTML element, please make sure that the element exists. ' + 'Check that the <script> tag initializing Uppy is right before the closing </body> tag at the end of the page. ' + '(see https://github.com/transloadit/uppy/issues/1042)\n\n' + 'If you meant to target a plugin, please confirm that your `import` statements or `require` calls are correct.';
    }

    throw new Error(message);
  }

  update(state) {
    if (this.el != null) {
      var _classPrivateFieldLoo, _classPrivateFieldLoo2;

      (_classPrivateFieldLoo = (_classPrivateFieldLoo2 = _classPrivateFieldLooseBase(this, _updateUI))[_updateUI]) == null ? void 0 : _classPrivateFieldLoo.call(_classPrivateFieldLoo2, state);
    }
  }

  unmount() {
    if (this.isTargetDOMEl) {
      var _this$el;

      (_this$el = this.el) == null ? void 0 : _this$el.remove();
    }

    this.onUnmount();
  } // eslint-disable-next-line class-methods-use-this


  onMount() {} // eslint-disable-next-line class-methods-use-this


  onUnmount() {}

}

module.exports = UIPlugin;

/***/ }),

/***/ "./node_modules/@uppy/core/lib/Uppy.js":
/*!*********************************************!*\
  !*** ./node_modules/@uppy/core/lib/Uppy.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* eslint-disable max-classes-per-file */

/* global AggregateError */


let _Symbol$for, _Symbol$for2;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const Translator = __webpack_require__(/*! @uppy/utils/lib/Translator */ "./node_modules/@uppy/utils/lib/Translator.js");

const ee = __webpack_require__(/*! namespace-emitter */ "./node_modules/namespace-emitter/index.js");

const {
  nanoid
} = __webpack_require__(/*! nanoid/non-secure */ "./node_modules/nanoid/non-secure/index.cjs");

const throttle = __webpack_require__(/*! lodash.throttle */ "./node_modules/lodash.throttle/index.js");

const DefaultStore = __webpack_require__(/*! @uppy/store-default */ "./node_modules/@uppy/store-default/lib/index.js");

const getFileType = __webpack_require__(/*! @uppy/utils/lib/getFileType */ "./node_modules/@uppy/utils/lib/getFileType.js");

const getFileNameAndExtension = __webpack_require__(/*! @uppy/utils/lib/getFileNameAndExtension */ "./node_modules/@uppy/utils/lib/getFileNameAndExtension.js");

const generateFileID = __webpack_require__(/*! @uppy/utils/lib/generateFileID */ "./node_modules/@uppy/utils/lib/generateFileID.js");

const supportsUploadProgress = __webpack_require__(/*! ./supportsUploadProgress */ "./node_modules/@uppy/core/lib/supportsUploadProgress.js");

const getFileName = __webpack_require__(/*! ./getFileName */ "./node_modules/@uppy/core/lib/getFileName.js");

const {
  justErrorsLogger,
  debugLogger
} = __webpack_require__(/*! ./loggers */ "./node_modules/@uppy/core/lib/loggers.js");

const {
  Restricter,
  defaultOptions: defaultRestrictionOptions,
  RestrictionError
} = __webpack_require__(/*! ./Restricter */ "./node_modules/@uppy/core/lib/Restricter.js");

const locale = __webpack_require__(/*! ./locale */ "./node_modules/@uppy/core/lib/locale.js"); // Exported from here.

/**
 * Uppy Core module.
 * Manages plugins, state updates, acts as an event bus,
 * adds/removes files and metadata.
 */


var _plugins = /*#__PURE__*/_classPrivateFieldLooseKey("plugins");

var _restricter = /*#__PURE__*/_classPrivateFieldLooseKey("restricter");

var _storeUnsubscribe = /*#__PURE__*/_classPrivateFieldLooseKey("storeUnsubscribe");

var _emitter = /*#__PURE__*/_classPrivateFieldLooseKey("emitter");

var _preProcessors = /*#__PURE__*/_classPrivateFieldLooseKey("preProcessors");

var _uploaders = /*#__PURE__*/_classPrivateFieldLooseKey("uploaders");

var _postProcessors = /*#__PURE__*/_classPrivateFieldLooseKey("postProcessors");

var _informAndEmit = /*#__PURE__*/_classPrivateFieldLooseKey("informAndEmit");

var _checkRequiredMetaFieldsOnFile = /*#__PURE__*/_classPrivateFieldLooseKey("checkRequiredMetaFieldsOnFile");

var _checkRequiredMetaFields = /*#__PURE__*/_classPrivateFieldLooseKey("checkRequiredMetaFields");

var _assertNewUploadAllowed = /*#__PURE__*/_classPrivateFieldLooseKey("assertNewUploadAllowed");

var _checkAndCreateFileStateObject = /*#__PURE__*/_classPrivateFieldLooseKey("checkAndCreateFileStateObject");

var _startIfAutoProceed = /*#__PURE__*/_classPrivateFieldLooseKey("startIfAutoProceed");

var _addListeners = /*#__PURE__*/_classPrivateFieldLooseKey("addListeners");

var _updateOnlineStatus = /*#__PURE__*/_classPrivateFieldLooseKey("updateOnlineStatus");

var _createUpload = /*#__PURE__*/_classPrivateFieldLooseKey("createUpload");

var _getUpload = /*#__PURE__*/_classPrivateFieldLooseKey("getUpload");

var _removeUpload = /*#__PURE__*/_classPrivateFieldLooseKey("removeUpload");

var _runUpload = /*#__PURE__*/_classPrivateFieldLooseKey("runUpload");

_Symbol$for = Symbol.for('uppy test: getPlugins');
_Symbol$for2 = Symbol.for('uppy test: createUpload');

class Uppy {
  // eslint-disable-next-line global-require

  /** @type {Record<string, BasePlugin[]>} */

  /**
   * Instantiate Uppy
   *
   * @param {object} opts — Uppy options
   */
  constructor(_opts) {
    Object.defineProperty(this, _runUpload, {
      value: _runUpload2
    });
    Object.defineProperty(this, _removeUpload, {
      value: _removeUpload2
    });
    Object.defineProperty(this, _getUpload, {
      value: _getUpload2
    });
    Object.defineProperty(this, _createUpload, {
      value: _createUpload2
    });
    Object.defineProperty(this, _addListeners, {
      value: _addListeners2
    });
    Object.defineProperty(this, _startIfAutoProceed, {
      value: _startIfAutoProceed2
    });
    Object.defineProperty(this, _checkAndCreateFileStateObject, {
      value: _checkAndCreateFileStateObject2
    });
    Object.defineProperty(this, _assertNewUploadAllowed, {
      value: _assertNewUploadAllowed2
    });
    Object.defineProperty(this, _checkRequiredMetaFields, {
      value: _checkRequiredMetaFields2
    });
    Object.defineProperty(this, _checkRequiredMetaFieldsOnFile, {
      value: _checkRequiredMetaFieldsOnFile2
    });
    Object.defineProperty(this, _informAndEmit, {
      value: _informAndEmit2
    });
    Object.defineProperty(this, _plugins, {
      writable: true,
      value: Object.create(null)
    });
    Object.defineProperty(this, _restricter, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _storeUnsubscribe, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _emitter, {
      writable: true,
      value: ee()
    });
    Object.defineProperty(this, _preProcessors, {
      writable: true,
      value: new Set()
    });
    Object.defineProperty(this, _uploaders, {
      writable: true,
      value: new Set()
    });
    Object.defineProperty(this, _postProcessors, {
      writable: true,
      value: new Set()
    });
    Object.defineProperty(this, _updateOnlineStatus, {
      writable: true,
      value: this.updateOnlineStatus.bind(this)
    });
    this.defaultLocale = locale;
    const defaultOptions = {
      id: 'uppy',
      autoProceed: false,

      /**
       * @deprecated The method should not be used
       */
      allowMultipleUploads: true,
      allowMultipleUploadBatches: true,
      debug: false,
      restrictions: defaultRestrictionOptions,
      meta: {},
      onBeforeFileAdded: currentFile => currentFile,
      onBeforeUpload: files => files,
      store: DefaultStore(),
      logger: justErrorsLogger,
      infoTimeout: 5000
    }; // Merge default options with the ones set by user,
    // making sure to merge restrictions too

    this.opts = { ...defaultOptions,
      ..._opts,
      restrictions: { ...defaultOptions.restrictions,
        ...(_opts && _opts.restrictions)
      }
    }; // Support debug: true for backwards-compatability, unless logger is set in opts
    // opts instead of this.opts to avoid comparing objects — we set logger: justErrorsLogger in defaultOptions

    if (_opts && _opts.logger && _opts.debug) {
      this.log('You are using a custom `logger`, but also set `debug: true`, which uses built-in logger to output logs to console. Ignoring `debug: true` and using your custom `logger`.', 'warning');
    } else if (_opts && _opts.debug) {
      this.opts.logger = debugLogger;
    }

    this.log(`Using Core v${this.constructor.VERSION}`);
    this.i18nInit(); // ___Why throttle at 500ms?
    //    - We must throttle at >250ms for superfocus in Dashboard to work well
    //    (because animation takes 0.25s, and we want to wait for all animations to be over before refocusing).
    //    [Practical Check]: if thottle is at 100ms, then if you are uploading a file,
    //    and click 'ADD MORE FILES', - focus won't activate in Firefox.
    //    - We must throttle at around >500ms to avoid performance lags.
    //    [Practical Check] Firefox, try to upload a big file for a prolonged period of time. Laptop will start to heat up.

    this.calculateProgress = throttle(this.calculateProgress.bind(this), 500, {
      leading: true,
      trailing: true
    });
    this.store = this.opts.store;
    this.setState({
      plugins: {},
      files: {},
      currentUploads: {},
      allowNewUpload: true,
      capabilities: {
        uploadProgress: supportsUploadProgress(),
        individualCancellation: true,
        resumableUploads: false
      },
      totalProgress: 0,
      meta: { ...this.opts.meta
      },
      info: [],
      recoveredState: null
    });
    _classPrivateFieldLooseBase(this, _restricter)[_restricter] = new Restricter(() => this.opts, this.i18n);
    _classPrivateFieldLooseBase(this, _storeUnsubscribe)[_storeUnsubscribe] = this.store.subscribe((prevState, nextState, patch) => {
      this.emit('state-update', prevState, nextState, patch);
      this.updateAll(nextState);
    }); // Exposing uppy object on window for debugging and testing

    if (this.opts.debug && typeof window !== 'undefined') {
      window[this.opts.id] = this;
    }

    _classPrivateFieldLooseBase(this, _addListeners)[_addListeners]();
  }

  emit(event) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    _classPrivateFieldLooseBase(this, _emitter)[_emitter].emit(event, ...args);
  }

  on(event, callback) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].on(event, callback);

    return this;
  }

  once(event, callback) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].once(event, callback);

    return this;
  }

  off(event, callback) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].off(event, callback);

    return this;
  }
  /**
   * Iterate on all plugins and run `update` on them.
   * Called each time state changes.
   *
   */


  updateAll(state) {
    this.iteratePlugins(plugin => {
      plugin.update(state);
    });
  }
  /**
   * Updates state with a patch
   *
   * @param {object} patch {foo: 'bar'}
   */


  setState(patch) {
    this.store.setState(patch);
  }
  /**
   * Returns current state.
   *
   * @returns {object}
   */


  getState() {
    return this.store.getState();
  }
  /**
   * Back compat for when uppy.state is used instead of uppy.getState().
   *
   * @deprecated
   */


  get state() {
    // Here, state is a non-enumerable property.
    return this.getState();
  }
  /**
   * Shorthand to set state for a specific file.
   */


  setFileState(fileID, state) {
    if (!this.getState().files[fileID]) {
      throw new Error(`Can’t set state for ${fileID} (the file could have been removed)`);
    }

    this.setState({
      files: { ...this.getState().files,
        [fileID]: { ...this.getState().files[fileID],
          ...state
        }
      }
    });
  }

  i18nInit() {
    const translator = new Translator([this.defaultLocale, this.opts.locale]);
    this.i18n = translator.translate.bind(translator);
    this.i18nArray = translator.translateArray.bind(translator);
    this.locale = translator.locale;
  }

  setOptions(newOpts) {
    this.opts = { ...this.opts,
      ...newOpts,
      restrictions: { ...this.opts.restrictions,
        ...(newOpts && newOpts.restrictions)
      }
    };

    if (newOpts.meta) {
      this.setMeta(newOpts.meta);
    }

    this.i18nInit();

    if (newOpts.locale) {
      this.iteratePlugins(plugin => {
        plugin.setOptions();
      });
    } // Note: this is not the preact `setState`, it's an internal function that has the same name.


    this.setState(); // so that UI re-renders with new options
  }

  resetProgress() {
    const defaultProgress = {
      percentage: 0,
      bytesUploaded: 0,
      uploadComplete: false,
      uploadStarted: null
    };
    const files = { ...this.getState().files
    };
    const updatedFiles = {};
    Object.keys(files).forEach(fileID => {
      const updatedFile = { ...files[fileID]
      };
      updatedFile.progress = { ...updatedFile.progress,
        ...defaultProgress
      };
      updatedFiles[fileID] = updatedFile;
    });
    this.setState({
      files: updatedFiles,
      totalProgress: 0
    });
    this.emit('reset-progress');
  }

  addPreProcessor(fn) {
    _classPrivateFieldLooseBase(this, _preProcessors)[_preProcessors].add(fn);
  }

  removePreProcessor(fn) {
    return _classPrivateFieldLooseBase(this, _preProcessors)[_preProcessors].delete(fn);
  }

  addPostProcessor(fn) {
    _classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors].add(fn);
  }

  removePostProcessor(fn) {
    return _classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors].delete(fn);
  }

  addUploader(fn) {
    _classPrivateFieldLooseBase(this, _uploaders)[_uploaders].add(fn);
  }

  removeUploader(fn) {
    return _classPrivateFieldLooseBase(this, _uploaders)[_uploaders].delete(fn);
  }

  setMeta(data) {
    const updatedMeta = { ...this.getState().meta,
      ...data
    };
    const updatedFiles = { ...this.getState().files
    };
    Object.keys(updatedFiles).forEach(fileID => {
      updatedFiles[fileID] = { ...updatedFiles[fileID],
        meta: { ...updatedFiles[fileID].meta,
          ...data
        }
      };
    });
    this.log('Adding metadata:');
    this.log(data);
    this.setState({
      meta: updatedMeta,
      files: updatedFiles
    });
  }

  setFileMeta(fileID, data) {
    const updatedFiles = { ...this.getState().files
    };

    if (!updatedFiles[fileID]) {
      this.log('Was trying to set metadata for a file that has been removed: ', fileID);
      return;
    }

    const newMeta = { ...updatedFiles[fileID].meta,
      ...data
    };
    updatedFiles[fileID] = { ...updatedFiles[fileID],
      meta: newMeta
    };
    this.setState({
      files: updatedFiles
    });
  }
  /**
   * Get a file object.
   *
   * @param {string} fileID The ID of the file object to return.
   */


  getFile(fileID) {
    return this.getState().files[fileID];
  }
  /**
   * Get all files in an array.
   */


  getFiles() {
    const {
      files
    } = this.getState();
    return Object.values(files);
  }

  getObjectOfFilesPerState() {
    const {
      files: filesObject,
      totalProgress,
      error
    } = this.getState();
    const files = Object.values(filesObject);
    const inProgressFiles = files.filter(_ref => {
      let {
        progress
      } = _ref;
      return !progress.uploadComplete && progress.uploadStarted;
    });
    const newFiles = files.filter(file => !file.progress.uploadStarted);
    const startedFiles = files.filter(file => file.progress.uploadStarted || file.progress.preprocess || file.progress.postprocess);
    const uploadStartedFiles = files.filter(file => file.progress.uploadStarted);
    const pausedFiles = files.filter(file => file.isPaused);
    const completeFiles = files.filter(file => file.progress.uploadComplete);
    const erroredFiles = files.filter(file => file.error);
    const inProgressNotPausedFiles = inProgressFiles.filter(file => !file.isPaused);
    const processingFiles = files.filter(file => file.progress.preprocess || file.progress.postprocess);
    return {
      newFiles,
      startedFiles,
      uploadStartedFiles,
      pausedFiles,
      completeFiles,
      erroredFiles,
      inProgressFiles,
      inProgressNotPausedFiles,
      processingFiles,
      isUploadStarted: uploadStartedFiles.length > 0,
      isAllComplete: totalProgress === 100 && completeFiles.length === files.length && processingFiles.length === 0,
      isAllErrored: !!error && erroredFiles.length === files.length,
      isAllPaused: inProgressFiles.length !== 0 && pausedFiles.length === inProgressFiles.length,
      isUploadInProgress: inProgressFiles.length > 0,
      isSomeGhost: files.some(file => file.isGhost)
    };
  }
  /*
  * @constructs
  * @param { Error } error
  * @param { undefined } file
  */

  /*
  * @constructs
  * @param { RestrictionError } error
  * @param { UppyFile | undefined } file
  */


  validateRestrictions(file, files) {
    if (files === void 0) {
      files = this.getFiles();
    }

    // TODO: directly return the Restriction error in next major version.
    // we create RestrictionError's just to discard immediately, which doesn't make sense.
    try {
      _classPrivateFieldLooseBase(this, _restricter)[_restricter].validate(file, files);

      return {
        result: true
      };
    } catch (err) {
      return {
        result: false,
        reason: err.message
      };
    }
  }

  checkIfFileAlreadyExists(fileID) {
    const {
      files
    } = this.getState();

    if (files[fileID] && !files[fileID].isGhost) {
      return true;
    }

    return false;
  }
  /**
   * Create a file state object based on user-provided `addFile()` options.
   *
   * Note this is extremely side-effectful and should only be done when a file state object
   * will be added to state immediately afterward!
   *
   * The `files` value is passed in because it may be updated by the caller without updating the store.
   */


  /**
   * Add a new file to `state.files`. This will run `onBeforeFileAdded`,
   * try to guess file type in a clever way, check file against restrictions,
   * and start an upload if `autoProceed === true`.
   *
   * @param {object} file object to add
   * @returns {string} id for the added file
   */
  addFile(file) {
    _classPrivateFieldLooseBase(this, _assertNewUploadAllowed)[_assertNewUploadAllowed](file);

    const {
      files
    } = this.getState();

    let newFile = _classPrivateFieldLooseBase(this, _checkAndCreateFileStateObject)[_checkAndCreateFileStateObject](files, file); // Users are asked to re-select recovered files without data,
    // and to keep the progress, meta and everthing else, we only replace said data


    if (files[newFile.id] && files[newFile.id].isGhost) {
      newFile = { ...files[newFile.id],
        data: file.data,
        isGhost: false
      };
      this.log(`Replaced the blob in the restored ghost file: ${newFile.name}, ${newFile.id}`);
    }

    this.setState({
      files: { ...files,
        [newFile.id]: newFile
      }
    });
    this.emit('file-added', newFile);
    this.emit('files-added', [newFile]);
    this.log(`Added file: ${newFile.name}, ${newFile.id}, mime type: ${newFile.type}`);

    _classPrivateFieldLooseBase(this, _startIfAutoProceed)[_startIfAutoProceed]();

    return newFile.id;
  }
  /**
   * Add multiple files to `state.files`. See the `addFile()` documentation.
   *
   * If an error occurs while adding a file, it is logged and the user is notified.
   * This is good for UI plugins, but not for programmatic use.
   * Programmatic users should usually still use `addFile()` on individual files.
   */


  addFiles(fileDescriptors) {
    _classPrivateFieldLooseBase(this, _assertNewUploadAllowed)[_assertNewUploadAllowed](); // create a copy of the files object only once


    const files = { ...this.getState().files
    };
    const newFiles = [];
    const errors = [];

    for (let i = 0; i < fileDescriptors.length; i++) {
      try {
        let newFile = _classPrivateFieldLooseBase(this, _checkAndCreateFileStateObject)[_checkAndCreateFileStateObject](files, fileDescriptors[i]); // Users are asked to re-select recovered files without data,
        // and to keep the progress, meta and everthing else, we only replace said data


        if (files[newFile.id] && files[newFile.id].isGhost) {
          newFile = { ...files[newFile.id],
            data: fileDescriptors[i].data,
            isGhost: false
          };
          this.log(`Replaced blob in a ghost file: ${newFile.name}, ${newFile.id}`);
        }

        files[newFile.id] = newFile;
        newFiles.push(newFile);
      } catch (err) {
        if (!err.isRestriction) {
          errors.push(err);
        }
      }
    }

    this.setState({
      files
    });
    newFiles.forEach(newFile => {
      this.emit('file-added', newFile);
    });
    this.emit('files-added', newFiles);

    if (newFiles.length > 5) {
      this.log(`Added batch of ${newFiles.length} files`);
    } else {
      Object.keys(newFiles).forEach(fileID => {
        this.log(`Added file: ${newFiles[fileID].name}\n id: ${newFiles[fileID].id}\n type: ${newFiles[fileID].type}`);
      });
    }

    if (newFiles.length > 0) {
      _classPrivateFieldLooseBase(this, _startIfAutoProceed)[_startIfAutoProceed]();
    }

    if (errors.length > 0) {
      let message = 'Multiple errors occurred while adding files:\n';
      errors.forEach(subError => {
        message += `\n * ${subError.message}`;
      });
      this.info({
        message: this.i18n('addBulkFilesFailed', {
          smart_count: errors.length
        }),
        details: message
      }, 'error', this.opts.infoTimeout);

      if (typeof AggregateError === 'function') {
        throw new AggregateError(errors, message);
      } else {
        const err = new Error(message);
        err.errors = errors;
        throw err;
      }
    }
  }

  removeFiles(fileIDs, reason) {
    const {
      files,
      currentUploads
    } = this.getState();
    const updatedFiles = { ...files
    };
    const updatedUploads = { ...currentUploads
    };
    const removedFiles = Object.create(null);
    fileIDs.forEach(fileID => {
      if (files[fileID]) {
        removedFiles[fileID] = files[fileID];
        delete updatedFiles[fileID];
      }
    }); // Remove files from the `fileIDs` list in each upload.

    function fileIsNotRemoved(uploadFileID) {
      return removedFiles[uploadFileID] === undefined;
    }

    Object.keys(updatedUploads).forEach(uploadID => {
      const newFileIDs = currentUploads[uploadID].fileIDs.filter(fileIsNotRemoved); // Remove the upload if no files are associated with it anymore.

      if (newFileIDs.length === 0) {
        delete updatedUploads[uploadID];
        return;
      }

      updatedUploads[uploadID] = { ...currentUploads[uploadID],
        fileIDs: newFileIDs
      };
    });
    const stateUpdate = {
      currentUploads: updatedUploads,
      files: updatedFiles
    }; // If all files were removed - allow new uploads,
    // and clear recoveredState

    if (Object.keys(updatedFiles).length === 0) {
      stateUpdate.allowNewUpload = true;
      stateUpdate.error = null;
      stateUpdate.recoveredState = null;
    }

    this.setState(stateUpdate);
    this.calculateTotalProgress();
    const removedFileIDs = Object.keys(removedFiles);
    removedFileIDs.forEach(fileID => {
      this.emit('file-removed', removedFiles[fileID], reason);
    });

    if (removedFileIDs.length > 5) {
      this.log(`Removed ${removedFileIDs.length} files`);
    } else {
      this.log(`Removed files: ${removedFileIDs.join(', ')}`);
    }
  }

  removeFile(fileID, reason) {
    if (reason === void 0) {
      reason = null;
    }

    this.removeFiles([fileID], reason);
  }

  pauseResume(fileID) {
    if (!this.getState().capabilities.resumableUploads || this.getFile(fileID).uploadComplete) {
      return undefined;
    }

    const wasPaused = this.getFile(fileID).isPaused || false;
    const isPaused = !wasPaused;
    this.setFileState(fileID, {
      isPaused
    });
    this.emit('upload-pause', fileID, isPaused);
    return isPaused;
  }

  pauseAll() {
    const updatedFiles = { ...this.getState().files
    };
    const inProgressUpdatedFiles = Object.keys(updatedFiles).filter(file => {
      return !updatedFiles[file].progress.uploadComplete && updatedFiles[file].progress.uploadStarted;
    });
    inProgressUpdatedFiles.forEach(file => {
      const updatedFile = { ...updatedFiles[file],
        isPaused: true
      };
      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles
    });
    this.emit('pause-all');
  }

  resumeAll() {
    const updatedFiles = { ...this.getState().files
    };
    const inProgressUpdatedFiles = Object.keys(updatedFiles).filter(file => {
      return !updatedFiles[file].progress.uploadComplete && updatedFiles[file].progress.uploadStarted;
    });
    inProgressUpdatedFiles.forEach(file => {
      const updatedFile = { ...updatedFiles[file],
        isPaused: false,
        error: null
      };
      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles
    });
    this.emit('resume-all');
  }

  retryAll() {
    const updatedFiles = { ...this.getState().files
    };
    const filesToRetry = Object.keys(updatedFiles).filter(file => {
      return updatedFiles[file].error;
    });
    filesToRetry.forEach(file => {
      const updatedFile = { ...updatedFiles[file],
        isPaused: false,
        error: null
      };
      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles,
      error: null
    });
    this.emit('retry-all', filesToRetry);

    if (filesToRetry.length === 0) {
      return Promise.resolve({
        successful: [],
        failed: []
      });
    }

    const uploadID = _classPrivateFieldLooseBase(this, _createUpload)[_createUpload](filesToRetry, {
      forceAllowNewUpload: true // create new upload even if allowNewUpload: false

    });

    return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
  }

  cancelAll() {
    this.emit('cancel-all');
    const {
      files
    } = this.getState();
    const fileIDs = Object.keys(files);

    if (fileIDs.length) {
      this.removeFiles(fileIDs, 'cancel-all');
    }

    this.setState({
      totalProgress: 0,
      error: null,
      recoveredState: null
    });
  }

  retryUpload(fileID) {
    this.setFileState(fileID, {
      error: null,
      isPaused: false
    });
    this.emit('upload-retry', fileID);

    const uploadID = _classPrivateFieldLooseBase(this, _createUpload)[_createUpload]([fileID], {
      forceAllowNewUpload: true // create new upload even if allowNewUpload: false

    });

    return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
  }

  reset() {
    this.cancelAll();
  }

  logout() {
    this.iteratePlugins(plugin => {
      if (plugin.provider && plugin.provider.logout) {
        plugin.provider.logout();
      }
    });
  }

  calculateProgress(file, data) {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    } // bytesTotal may be null or zero; in that case we can't divide by it


    const canHavePercentage = Number.isFinite(data.bytesTotal) && data.bytesTotal > 0;
    this.setFileState(file.id, {
      progress: { ...this.getFile(file.id).progress,
        bytesUploaded: data.bytesUploaded,
        bytesTotal: data.bytesTotal,
        percentage: canHavePercentage ? Math.round(data.bytesUploaded / data.bytesTotal * 100) : 0
      }
    });
    this.calculateTotalProgress();
  }

  calculateTotalProgress() {
    // calculate total progress, using the number of files currently uploading,
    // multiplied by 100 and the summ of individual progress of each file
    const files = this.getFiles();
    const inProgress = files.filter(file => {
      return file.progress.uploadStarted || file.progress.preprocess || file.progress.postprocess;
    });

    if (inProgress.length === 0) {
      this.emit('progress', 0);
      this.setState({
        totalProgress: 0
      });
      return;
    }

    const sizedFiles = inProgress.filter(file => file.progress.bytesTotal != null);
    const unsizedFiles = inProgress.filter(file => file.progress.bytesTotal == null);

    if (sizedFiles.length === 0) {
      const progressMax = inProgress.length * 100;
      const currentProgress = unsizedFiles.reduce((acc, file) => {
        return acc + file.progress.percentage;
      }, 0);
      const totalProgress = Math.round(currentProgress / progressMax * 100);
      this.setState({
        totalProgress
      });
      return;
    }

    let totalSize = sizedFiles.reduce((acc, file) => {
      return acc + file.progress.bytesTotal;
    }, 0);
    const averageSize = totalSize / sizedFiles.length;
    totalSize += averageSize * unsizedFiles.length;
    let uploadedSize = 0;
    sizedFiles.forEach(file => {
      uploadedSize += file.progress.bytesUploaded;
    });
    unsizedFiles.forEach(file => {
      uploadedSize += averageSize * (file.progress.percentage || 0) / 100;
    });
    let totalProgress = totalSize === 0 ? 0 : Math.round(uploadedSize / totalSize * 100); // hot fix, because:
    // uploadedSize ended up larger than totalSize, resulting in 1325% total

    if (totalProgress > 100) {
      totalProgress = 100;
    }

    this.setState({
      totalProgress
    });
    this.emit('progress', totalProgress);
  }
  /**
   * Registers listeners for all global actions, like:
   * `error`, `file-removed`, `upload-progress`
   */


  updateOnlineStatus() {
    const online = typeof window.navigator.onLine !== 'undefined' ? window.navigator.onLine : true;

    if (!online) {
      this.emit('is-offline');
      this.info(this.i18n('noInternetConnection'), 'error', 0);
      this.wasOffline = true;
    } else {
      this.emit('is-online');

      if (this.wasOffline) {
        this.emit('back-online');
        this.info(this.i18n('connectedToInternet'), 'success', 3000);
        this.wasOffline = false;
      }
    }
  }

  getID() {
    return this.opts.id;
  }
  /**
   * Registers a plugin with Core.
   *
   * @param {object} Plugin object
   * @param {object} [opts] object with options to be passed to Plugin
   * @returns {object} self for chaining
   */
  // eslint-disable-next-line no-shadow


  use(Plugin, opts) {
    if (typeof Plugin !== 'function') {
      const msg = `Expected a plugin class, but got ${Plugin === null ? 'null' : typeof Plugin}.` + ' Please verify that the plugin was imported and spelled correctly.';
      throw new TypeError(msg);
    } // Instantiate


    const plugin = new Plugin(this, opts);
    const pluginId = plugin.id;

    if (!pluginId) {
      throw new Error('Your plugin must have an id');
    }

    if (!plugin.type) {
      throw new Error('Your plugin must have a type');
    }

    const existsPluginAlready = this.getPlugin(pluginId);

    if (existsPluginAlready) {
      const msg = `Already found a plugin named '${existsPluginAlready.id}'. ` + `Tried to use: '${pluginId}'.\n` + 'Uppy plugins must have unique `id` options. See https://uppy.io/docs/plugins/#id.';
      throw new Error(msg);
    }

    if (Plugin.VERSION) {
      this.log(`Using ${pluginId} v${Plugin.VERSION}`);
    }

    if (plugin.type in _classPrivateFieldLooseBase(this, _plugins)[_plugins]) {
      _classPrivateFieldLooseBase(this, _plugins)[_plugins][plugin.type].push(plugin);
    } else {
      _classPrivateFieldLooseBase(this, _plugins)[_plugins][plugin.type] = [plugin];
    }

    plugin.install();
    return this;
  }
  /**
   * Find one Plugin by name.
   *
   * @param {string} id plugin id
   * @returns {BasePlugin|undefined}
   */


  getPlugin(id) {
    for (const plugins of Object.values(_classPrivateFieldLooseBase(this, _plugins)[_plugins])) {
      const foundPlugin = plugins.find(plugin => plugin.id === id);
      if (foundPlugin != null) return foundPlugin;
    }

    return undefined;
  }

  [_Symbol$for](type) {
    return _classPrivateFieldLooseBase(this, _plugins)[_plugins][type];
  }
  /**
   * Iterate through all `use`d plugins.
   *
   * @param {Function} method that will be run on each plugin
   */


  iteratePlugins(method) {
    Object.values(_classPrivateFieldLooseBase(this, _plugins)[_plugins]).flat(1).forEach(method);
  }
  /**
   * Uninstall and remove a plugin.
   *
   * @param {object} instance The plugin instance to remove.
   */


  removePlugin(instance) {
    this.log(`Removing plugin ${instance.id}`);
    this.emit('plugin-remove', instance);

    if (instance.uninstall) {
      instance.uninstall();
    }

    const list = _classPrivateFieldLooseBase(this, _plugins)[_plugins][instance.type]; // list.indexOf failed here, because Vue3 converted the plugin instance
    // to a Proxy object, which failed the strict comparison test:
    // obj !== objProxy


    const index = list.findIndex(item => item.id === instance.id);

    if (index !== -1) {
      list.splice(index, 1);
    }

    const state = this.getState();
    const updatedState = {
      plugins: { ...state.plugins,
        [instance.id]: undefined
      }
    };
    this.setState(updatedState);
  }
  /**
   * Uninstall all plugins and close down this Uppy instance.
   */


  close() {
    this.log(`Closing Uppy instance ${this.opts.id}: removing all files and uninstalling plugins`);
    this.reset();

    _classPrivateFieldLooseBase(this, _storeUnsubscribe)[_storeUnsubscribe]();

    this.iteratePlugins(plugin => {
      this.removePlugin(plugin);
    });

    if (typeof window !== 'undefined' && window.removeEventListener) {
      window.removeEventListener('online', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
      window.removeEventListener('offline', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
    }
  }

  hideInfo() {
    const {
      info
    } = this.getState();
    this.setState({
      info: info.slice(1)
    });
    this.emit('info-hidden');
  }
  /**
   * Set info message in `state.info`, so that UI plugins like `Informer`
   * can display the message.
   *
   * @param {string | object} message Message to be displayed by the informer
   * @param {string} [type]
   * @param {number} [duration]
   */


  info(message, type, duration) {
    if (type === void 0) {
      type = 'info';
    }

    if (duration === void 0) {
      duration = 3000;
    }

    const isComplexMessage = typeof message === 'object';
    this.setState({
      info: [...this.getState().info, {
        type,
        message: isComplexMessage ? message.message : message,
        details: isComplexMessage ? message.details : null
      }]
    });
    setTimeout(() => this.hideInfo(), duration);
    this.emit('info-visible');
  }
  /**
   * Passes messages to a function, provided in `opts.logger`.
   * If `opts.logger: Uppy.debugLogger` or `opts.debug: true`, logs to the browser console.
   *
   * @param {string|object} message to log
   * @param {string} [type] optional `error` or `warning`
   */


  log(message, type) {
    const {
      logger
    } = this.opts;

    switch (type) {
      case 'error':
        logger.error(message);
        break;

      case 'warning':
        logger.warn(message);
        break;

      default:
        logger.debug(message);
        break;
    }
  }
  /**
   * Restore an upload by its ID.
   */


  restore(uploadID) {
    this.log(`Core: attempting to restore upload "${uploadID}"`);

    if (!this.getState().currentUploads[uploadID]) {
      _classPrivateFieldLooseBase(this, _removeUpload)[_removeUpload](uploadID);

      return Promise.reject(new Error('Nonexistent upload'));
    }

    return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
  }
  /**
   * Create an upload for a bunch of files.
   *
   * @param {Array<string>} fileIDs File IDs to include in this upload.
   * @returns {string} ID of this upload.
   */


  [_Symbol$for2]() {
    return _classPrivateFieldLooseBase(this, _createUpload)[_createUpload](...arguments);
  }

  /**
   * Add data to an upload's result object.
   *
   * @param {string} uploadID The ID of the upload.
   * @param {object} data Data properties to add to the result object.
   */
  addResultData(uploadID, data) {
    if (!_classPrivateFieldLooseBase(this, _getUpload)[_getUpload](uploadID)) {
      this.log(`Not setting result for an upload that has been removed: ${uploadID}`);
      return;
    }

    const {
      currentUploads
    } = this.getState();
    const currentUpload = { ...currentUploads[uploadID],
      result: { ...currentUploads[uploadID].result,
        ...data
      }
    };
    this.setState({
      currentUploads: { ...currentUploads,
        [uploadID]: currentUpload
      }
    });
  }
  /**
   * Remove an upload, eg. if it has been canceled or completed.
   *
   * @param {string} uploadID The ID of the upload.
   */


  /**
   * Start an upload for all the files that are not currently being uploaded.
   *
   * @returns {Promise}
   */
  upload() {
    var _classPrivateFieldLoo;

    if (!((_classPrivateFieldLoo = _classPrivateFieldLooseBase(this, _plugins)[_plugins].uploader) != null && _classPrivateFieldLoo.length)) {
      this.log('No uploader type plugins are used', 'warning');
    }

    let {
      files
    } = this.getState();
    const onBeforeUploadResult = this.opts.onBeforeUpload(files);

    if (onBeforeUploadResult === false) {
      return Promise.reject(new Error('Not starting the upload because onBeforeUpload returned false'));
    }

    if (onBeforeUploadResult && typeof onBeforeUploadResult === 'object') {
      files = onBeforeUploadResult; // Updating files in state, because uploader plugins receive file IDs,
      // and then fetch the actual file object from state

      this.setState({
        files
      });
    }

    return Promise.resolve().then(() => _classPrivateFieldLooseBase(this, _restricter)[_restricter].validateMinNumberOfFiles(files)).catch(err => {
      _classPrivateFieldLooseBase(this, _informAndEmit)[_informAndEmit](err);

      throw err;
    }).then(() => {
      if (!_classPrivateFieldLooseBase(this, _checkRequiredMetaFields)[_checkRequiredMetaFields](files)) {
        throw new RestrictionError(this.i18n('missingRequiredMetaField'));
      }
    }).catch(err => {
      // Doing this in a separate catch because we already emited and logged
      // all the errors in `checkRequiredMetaFields` so we only throw a generic
      // missing fields error here.
      throw err;
    }).then(() => {
      const {
        currentUploads
      } = this.getState(); // get a list of files that are currently assigned to uploads

      const currentlyUploadingFiles = Object.values(currentUploads).flatMap(curr => curr.fileIDs);
      const waitingFileIDs = [];
      Object.keys(files).forEach(fileID => {
        const file = this.getFile(fileID); // if the file hasn't started uploading and hasn't already been assigned to an upload..

        if (!file.progress.uploadStarted && currentlyUploadingFiles.indexOf(fileID) === -1) {
          waitingFileIDs.push(file.id);
        }
      });

      const uploadID = _classPrivateFieldLooseBase(this, _createUpload)[_createUpload](waitingFileIDs);

      return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
    }).catch(err => {
      this.emit('error', err);
      this.log(err, 'error');
      throw err;
    });
  }

}

function _informAndEmit2(error, file) {
  const {
    message,
    details = ''
  } = error;

  if (error.isRestriction) {
    this.emit('restriction-failed', file, error);
  } else {
    this.emit('error', error);
  }

  this.info({
    message,
    details
  }, 'error', this.opts.infoTimeout);
  this.log(`${message} ${details}`.trim(), 'error');
}

function _checkRequiredMetaFieldsOnFile2(file) {
  const {
    missingFields,
    error
  } = _classPrivateFieldLooseBase(this, _restricter)[_restricter].getMissingRequiredMetaFields(file);

  if (missingFields.length > 0) {
    this.setFileState(file.id, {
      missingRequiredMetaFields: missingFields
    });
    this.log(error.message);
    this.emit('restriction-failed', file, error);
    return false;
  }

  return true;
}

function _checkRequiredMetaFields2(files) {
  let success = true;

  for (const file of Object.values(files)) {
    if (!_classPrivateFieldLooseBase(this, _checkRequiredMetaFieldsOnFile)[_checkRequiredMetaFieldsOnFile](file)) {
      success = false;
    }
  }

  return success;
}

function _assertNewUploadAllowed2(file) {
  const {
    allowNewUpload
  } = this.getState();

  if (allowNewUpload === false) {
    const error = new RestrictionError(this.i18n('noMoreFilesAllowed'));

    _classPrivateFieldLooseBase(this, _informAndEmit)[_informAndEmit](error, file);

    throw error;
  }
}

function _checkAndCreateFileStateObject2(files, fileDescriptor) {
  const fileType = getFileType(fileDescriptor);
  const fileName = getFileName(fileType, fileDescriptor);
  const fileExtension = getFileNameAndExtension(fileName).extension;
  const isRemote = Boolean(fileDescriptor.isRemote);
  const fileID = generateFileID({ ...fileDescriptor,
    type: fileType
  });

  if (this.checkIfFileAlreadyExists(fileID)) {
    const error = new RestrictionError(this.i18n('noDuplicates', {
      fileName
    }));

    _classPrivateFieldLooseBase(this, _informAndEmit)[_informAndEmit](error, fileDescriptor);

    throw error;
  }

  const meta = fileDescriptor.meta || {};
  meta.name = fileName;
  meta.type = fileType; // `null` means the size is unknown.

  const size = Number.isFinite(fileDescriptor.data.size) ? fileDescriptor.data.size : null;
  let newFile = {
    source: fileDescriptor.source || '',
    id: fileID,
    name: fileName,
    extension: fileExtension || '',
    meta: { ...this.getState().meta,
      ...meta
    },
    type: fileType,
    data: fileDescriptor.data,
    progress: {
      percentage: 0,
      bytesUploaded: 0,
      bytesTotal: size,
      uploadComplete: false,
      uploadStarted: null
    },
    size,
    isRemote,
    remote: fileDescriptor.remote || '',
    preview: fileDescriptor.preview
  };
  const onBeforeFileAddedResult = this.opts.onBeforeFileAdded(newFile, files);

  if (onBeforeFileAddedResult === false) {
    // Don’t show UI info for this error, as it should be done by the developer
    const error = new RestrictionError('Cannot add the file because onBeforeFileAdded returned false.');
    this.emit('restriction-failed', fileDescriptor, error);
    throw error;
  } else if (typeof onBeforeFileAddedResult === 'object' && onBeforeFileAddedResult !== null) {
    newFile = onBeforeFileAddedResult;
  }

  try {
    const filesArray = Object.keys(files).map(i => files[i]);

    _classPrivateFieldLooseBase(this, _restricter)[_restricter].validate(newFile, filesArray);
  } catch (err) {
    _classPrivateFieldLooseBase(this, _informAndEmit)[_informAndEmit](err, newFile);

    throw err;
  }

  return newFile;
}

function _startIfAutoProceed2() {
  if (this.opts.autoProceed && !this.scheduledAutoProceed) {
    this.scheduledAutoProceed = setTimeout(() => {
      this.scheduledAutoProceed = null;
      this.upload().catch(err => {
        if (!err.isRestriction) {
          this.log(err.stack || err.message || err);
        }
      });
    }, 4);
  }
}

function _addListeners2() {
  /**
   * @param {Error} error
   * @param {object} [file]
   * @param {object} [response]
   */
  const errorHandler = (error, file, response) => {
    let errorMsg = error.message || 'Unknown error';

    if (error.details) {
      errorMsg += ` ${error.details}`;
    }

    this.setState({
      error: errorMsg
    });

    if (file != null && file.id in this.getState().files) {
      this.setFileState(file.id, {
        error: errorMsg,
        response
      });
    }
  };

  this.on('error', errorHandler);
  this.on('upload-error', (file, error, response) => {
    errorHandler(error, file, response);

    if (typeof error === 'object' && error.message) {
      const newError = new Error(error.message);
      newError.details = error.message;

      if (error.details) {
        newError.details += ` ${error.details}`;
      }

      newError.message = this.i18n('failedToUpload', {
        file: file.name
      });

      _classPrivateFieldLooseBase(this, _informAndEmit)[_informAndEmit](newError);
    } else {
      _classPrivateFieldLooseBase(this, _informAndEmit)[_informAndEmit](error);
    }
  });
  this.on('upload', () => {
    this.setState({
      error: null
    });
  });
  this.on('upload-started', file => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    this.setFileState(file.id, {
      progress: {
        uploadStarted: Date.now(),
        uploadComplete: false,
        percentage: 0,
        bytesUploaded: 0,
        bytesTotal: file.size
      }
    });
  });
  this.on('upload-progress', this.calculateProgress);
  this.on('upload-success', (file, uploadResp) => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    const currentProgress = this.getFile(file.id).progress;
    this.setFileState(file.id, {
      progress: { ...currentProgress,
        postprocess: _classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors].size > 0 ? {
          mode: 'indeterminate'
        } : null,
        uploadComplete: true,
        percentage: 100,
        bytesUploaded: currentProgress.bytesTotal
      },
      response: uploadResp,
      uploadURL: uploadResp.uploadURL,
      isPaused: false
    }); // Remote providers sometimes don't tell us the file size,
    // but we can know how many bytes we uploaded once the upload is complete.

    if (file.size == null) {
      this.setFileState(file.id, {
        size: uploadResp.bytesUploaded || currentProgress.bytesTotal
      });
    }

    this.calculateTotalProgress();
  });
  this.on('preprocess-progress', (file, progress) => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    this.setFileState(file.id, {
      progress: { ...this.getFile(file.id).progress,
        preprocess: progress
      }
    });
  });
  this.on('preprocess-complete', file => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    const files = { ...this.getState().files
    };
    files[file.id] = { ...files[file.id],
      progress: { ...files[file.id].progress
      }
    };
    delete files[file.id].progress.preprocess;
    this.setState({
      files
    });
  });
  this.on('postprocess-progress', (file, progress) => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    this.setFileState(file.id, {
      progress: { ...this.getState().files[file.id].progress,
        postprocess: progress
      }
    });
  });
  this.on('postprocess-complete', file => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    const files = { ...this.getState().files
    };
    files[file.id] = { ...files[file.id],
      progress: { ...files[file.id].progress
      }
    };
    delete files[file.id].progress.postprocess;
    this.setState({
      files
    });
  });
  this.on('restored', () => {
    // Files may have changed--ensure progress is still accurate.
    this.calculateTotalProgress();
  });
  this.on('dashboard:file-edit-complete', file => {
    if (file) {
      _classPrivateFieldLooseBase(this, _checkRequiredMetaFieldsOnFile)[_checkRequiredMetaFieldsOnFile](file);
    }
  }); // show informer if offline

  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('online', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
    window.addEventListener('offline', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
    setTimeout(_classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus], 3000);
  }
}

function _createUpload2(fileIDs, opts) {
  if (opts === void 0) {
    opts = {};
  }

  // uppy.retryAll sets this to true — when retrying we want to ignore `allowNewUpload: false`
  const {
    forceAllowNewUpload = false
  } = opts;
  const {
    allowNewUpload,
    currentUploads
  } = this.getState();

  if (!allowNewUpload && !forceAllowNewUpload) {
    throw new Error('Cannot create a new upload: already uploading.');
  }

  const uploadID = nanoid();
  this.emit('upload', {
    id: uploadID,
    fileIDs
  });
  this.setState({
    allowNewUpload: this.opts.allowMultipleUploadBatches !== false && this.opts.allowMultipleUploads !== false,
    currentUploads: { ...currentUploads,
      [uploadID]: {
        fileIDs,
        step: 0,
        result: {}
      }
    }
  });
  return uploadID;
}

function _getUpload2(uploadID) {
  const {
    currentUploads
  } = this.getState();
  return currentUploads[uploadID];
}

function _removeUpload2(uploadID) {
  const currentUploads = { ...this.getState().currentUploads
  };
  delete currentUploads[uploadID];
  this.setState({
    currentUploads
  });
}

async function _runUpload2(uploadID) {
  let {
    currentUploads
  } = this.getState();
  let currentUpload = currentUploads[uploadID];
  const restoreStep = currentUpload.step || 0;
  const steps = [..._classPrivateFieldLooseBase(this, _preProcessors)[_preProcessors], ..._classPrivateFieldLooseBase(this, _uploaders)[_uploaders], ..._classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors]];

  try {
    for (let step = restoreStep; step < steps.length; step++) {
      if (!currentUpload) {
        break;
      }

      const fn = steps[step];
      const updatedUpload = { ...currentUpload,
        step
      };
      this.setState({
        currentUploads: { ...currentUploads,
          [uploadID]: updatedUpload
        }
      }); // TODO give this the `updatedUpload` object as its only parameter maybe?
      // Otherwise when more metadata may be added to the upload this would keep getting more parameters

      await fn(updatedUpload.fileIDs, uploadID); // Update currentUpload value in case it was modified asynchronously.

      currentUploads = this.getState().currentUploads;
      currentUpload = currentUploads[uploadID];
    }
  } catch (err) {
    _classPrivateFieldLooseBase(this, _removeUpload)[_removeUpload](uploadID);

    throw err;
  } // Set result data.


  if (currentUpload) {
    // Mark postprocessing step as complete if necessary; this addresses a case where we might get
    // stuck in the postprocessing UI while the upload is fully complete.
    // If the postprocessing steps do not do any work, they may not emit postprocessing events at
    // all, and never mark the postprocessing as complete. This is fine on its own but we
    // introduced code in the @uppy/core upload-success handler to prepare postprocessing progress
    // state if any postprocessors are registered. That is to avoid a "flash of completed state"
    // before the postprocessing plugins can emit events.
    //
    // So, just in case an upload with postprocessing plugins *has* completed *without* emitting
    // postprocessing completion, we do it instead.
    currentUpload.fileIDs.forEach(fileID => {
      const file = this.getFile(fileID);

      if (file && file.progress.postprocess) {
        this.emit('postprocess-complete', file);
      }
    });
    const files = currentUpload.fileIDs.map(fileID => this.getFile(fileID));
    const successful = files.filter(file => !file.error);
    const failed = files.filter(file => file.error);
    await this.addResultData(uploadID, {
      successful,
      failed,
      uploadID
    }); // Update currentUpload value in case it was modified asynchronously.

    currentUploads = this.getState().currentUploads;
    currentUpload = currentUploads[uploadID];
  } // Emit completion events.
  // This is in a separate function so that the `currentUploads` variable
  // always refers to the latest state. In the handler right above it refers
  // to an outdated object without the `.result` property.


  let result;

  if (currentUpload) {
    result = currentUpload.result;
    this.emit('complete', result);

    _classPrivateFieldLooseBase(this, _removeUpload)[_removeUpload](uploadID);
  }

  if (result == null) {
    this.log(`Not setting result for an upload that has been removed: ${uploadID}`);
  }

  return result;
}

Uppy.VERSION = "2.1.7";
module.exports = Uppy;

/***/ }),

/***/ "./node_modules/@uppy/core/lib/getFileName.js":
/*!****************************************************!*\
  !*** ./node_modules/@uppy/core/lib/getFileName.js ***!
  \****************************************************/
/***/ ((module) => {

module.exports = function getFileName(fileType, fileDescriptor) {
  if (fileDescriptor.name) {
    return fileDescriptor.name;
  }

  if (fileType.split('/')[0] === 'image') {
    return `${fileType.split('/')[0]}.${fileType.split('/')[1]}`;
  }

  return 'noname';
};

/***/ }),

/***/ "./node_modules/@uppy/core/lib/index.js":
/*!**********************************************!*\
  !*** ./node_modules/@uppy/core/lib/index.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const Uppy = __webpack_require__(/*! ./Uppy */ "./node_modules/@uppy/core/lib/Uppy.js");

const UIPlugin = __webpack_require__(/*! ./UIPlugin */ "./node_modules/@uppy/core/lib/UIPlugin.js");

const BasePlugin = __webpack_require__(/*! ./BasePlugin */ "./node_modules/@uppy/core/lib/BasePlugin.js");

const {
  debugLogger
} = __webpack_require__(/*! ./loggers */ "./node_modules/@uppy/core/lib/loggers.js");

module.exports = Uppy;
module.exports.Uppy = Uppy;
module.exports.UIPlugin = UIPlugin;
module.exports.BasePlugin = BasePlugin;
module.exports.debugLogger = debugLogger;

/***/ }),

/***/ "./node_modules/@uppy/core/lib/locale.js":
/*!***********************************************!*\
  !*** ./node_modules/@uppy/core/lib/locale.js ***!
  \***********************************************/
/***/ ((module) => {

module.exports = {
  strings: {
    addBulkFilesFailed: {
      0: 'Failed to add %{smart_count} file due to an internal error',
      1: 'Failed to add %{smart_count} files due to internal errors'
    },
    youCanOnlyUploadX: {
      0: 'You can only upload %{smart_count} file',
      1: 'You can only upload %{smart_count} files'
    },
    youHaveToAtLeastSelectX: {
      0: 'You have to select at least %{smart_count} file',
      1: 'You have to select at least %{smart_count} files'
    },
    exceedsSize: '%{file} exceeds maximum allowed size of %{size}',
    missingRequiredMetaField: 'Missing required meta fields',
    missingRequiredMetaFieldOnFile: 'Missing required meta fields in %{fileName}',
    inferiorSize: 'This file is smaller than the allowed size of %{size}',
    youCanOnlyUploadFileTypes: 'You can only upload: %{types}',
    noMoreFilesAllowed: 'Cannot add more files',
    noDuplicates: "Cannot add the duplicate file '%{fileName}', it already exists",
    companionError: 'Connection with Companion failed',
    authAborted: 'Authentication aborted',
    companionUnauthorizeHint: 'To unauthorize to your %{provider} account, please go to %{url}',
    failedToUpload: 'Failed to upload %{file}',
    noInternetConnection: 'No Internet connection',
    connectedToInternet: 'Connected to the Internet',
    // Strings for remote providers
    noFilesFound: 'You have no files or folders here',
    selectX: {
      0: 'Select %{smart_count}',
      1: 'Select %{smart_count}'
    },
    allFilesFromFolderNamed: 'All files from folder %{name}',
    openFolderNamed: 'Open folder %{name}',
    cancel: 'Cancel',
    logOut: 'Log out',
    filter: 'Filter',
    resetFilter: 'Reset filter',
    loading: 'Loading...',
    authenticateWithTitle: 'Please authenticate with %{pluginName} to select files',
    authenticateWith: 'Connect to %{pluginName}',
    signInWithGoogle: 'Sign in with Google',
    searchImages: 'Search for images',
    enterTextToSearch: 'Enter text to search for images',
    search: 'Search',
    emptyFolderAdded: 'No files were added from empty folder',
    folderAlreadyAdded: 'The folder "%{folder}" was already added',
    folderAdded: {
      0: 'Added %{smart_count} file from %{folder}',
      1: 'Added %{smart_count} files from %{folder}'
    }
  }
};

/***/ }),

/***/ "./node_modules/@uppy/core/lib/loggers.js":
/*!************************************************!*\
  !*** ./node_modules/@uppy/core/lib/loggers.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable no-console */
const getTimeStamp = __webpack_require__(/*! @uppy/utils/lib/getTimeStamp */ "./node_modules/@uppy/utils/lib/getTimeStamp.js"); // Swallow all logs, except errors.
// default if logger is not set or debug: false


const justErrorsLogger = {
  debug: () => {},
  warn: () => {},
  error: function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return console.error(`[Uppy] [${getTimeStamp()}]`, ...args);
  }
}; // Print logs to console with namespace + timestamp,
// set by logger: Uppy.debugLogger or debug: true

const debugLogger = {
  debug: function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return console.debug(`[Uppy] [${getTimeStamp()}]`, ...args);
  },
  warn: function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return console.warn(`[Uppy] [${getTimeStamp()}]`, ...args);
  },
  error: function () {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return console.error(`[Uppy] [${getTimeStamp()}]`, ...args);
  }
};
module.exports = {
  justErrorsLogger,
  debugLogger
};

/***/ }),

/***/ "./node_modules/@uppy/core/lib/supportsUploadProgress.js":
/*!***************************************************************!*\
  !*** ./node_modules/@uppy/core/lib/supportsUploadProgress.js ***!
  \***************************************************************/
/***/ ((module) => {

// Edge 15.x does not fire 'progress' events on uploads.
// See https://github.com/transloadit/uppy/issues/945
// And https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12224510/
module.exports = function supportsUploadProgress(userAgent) {
  // Allow passing in userAgent for tests
  if (userAgent == null) {
    userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : null;
  } // Assume it works because basically everything supports progress events.


  if (!userAgent) return true;
  const m = /Edge\/(\d+\.\d+)/.exec(userAgent);
  if (!m) return true;
  const edgeVersion = m[1];
  let [major, minor] = edgeVersion.split('.');
  major = parseInt(major, 10);
  minor = parseInt(minor, 10); // Worked before:
  // Edge 40.15063.0.0
  // Microsoft EdgeHTML 15.15063

  if (major < 15 || major === 15 && minor < 15063) {
    return true;
  } // Fixed in:
  // Microsoft EdgeHTML 18.18218


  if (major > 18 || major === 18 && minor >= 18218) {
    return true;
  } // other versions don't work.


  return false;
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/AddFiles.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/AddFiles.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

let _Symbol$for;

const {
  h,
  Component
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

_Symbol$for = Symbol.for('uppy test: disable unused locale key warning');

class AddFiles extends Component {
  constructor() {
    super(...arguments);

    this.triggerFileInputClick = () => {
      this.fileInput.click();
    };

    this.triggerFolderInputClick = () => {
      this.folderInput.click();
    };

    this.onFileInputChange = event => {
      this.props.handleInputChange(event); // We clear the input after a file is selected, because otherwise
      // change event is not fired in Chrome and Safari when a file
      // with the same name is selected.
      // ___Why not use value="" on <input/> instead?
      //    Because if we use that method of clearing the input,
      //    Chrome will not trigger change if we drop the same file twice (Issue #768).

      event.target.value = null;
    };

    this.renderHiddenInput = (isFolder, refCallback) => {
      return h("input", {
        className: "uppy-Dashboard-input",
        hidden: true,
        "aria-hidden": "true",
        tabIndex: -1,
        webkitdirectory: isFolder,
        type: "file",
        name: "files[]",
        multiple: this.props.maxNumberOfFiles !== 1,
        onChange: this.onFileInputChange,
        accept: this.props.allowedFileTypes,
        ref: refCallback
      });
    };

    this.renderMyDeviceAcquirer = () => {
      return h("div", {
        className: "uppy-DashboardTab",
        role: "presentation",
        "data-uppy-acquirer-id": "MyDevice"
      }, h("button", {
        type: "button",
        className: "uppy-u-reset uppy-c-btn uppy-DashboardTab-btn",
        role: "tab",
        tabIndex: 0,
        "data-uppy-super-focusable": true,
        onClick: this.triggerFileInputClick
      }, h("svg", {
        "aria-hidden": "true",
        focusable: "false",
        width: "32",
        height: "32",
        viewBox: "0 0 32 32"
      }, h("g", {
        fill: "none",
        fillRule: "evenodd"
      }, h("rect", {
        className: "uppy-ProviderIconBg",
        width: "32",
        height: "32",
        rx: "16",
        fill: "#2275D7"
      }), h("path", {
        d: "M21.973 21.152H9.863l-1.108-5.087h14.464l-1.246 5.087zM9.935 11.37h3.958l.886 1.444a.673.673 0 0 0 .585.316h6.506v1.37H9.935v-3.13zm14.898 3.44a.793.793 0 0 0-.616-.31h-.978v-2.126c0-.379-.275-.613-.653-.613H15.75l-.886-1.445a.673.673 0 0 0-.585-.316H9.232c-.378 0-.667.209-.667.587V14.5h-.782a.793.793 0 0 0-.61.303.795.795 0 0 0-.155.663l1.45 6.633c.078.36.396.618.764.618h13.354c.36 0 .674-.246.76-.595l1.631-6.636a.795.795 0 0 0-.144-.675z",
        fill: "#FFF"
      }))), h("div", {
        className: "uppy-DashboardTab-name"
      }, this.props.i18n('myDevice'))));
    };

    this.renderBrowseButton = (text, onClickFn) => {
      const numberOfAcquirers = this.props.acquirers.length;
      return h("button", {
        type: "button",
        className: "uppy-u-reset uppy-Dashboard-browse",
        onClick: onClickFn,
        "data-uppy-super-focusable": numberOfAcquirers === 0
      }, text);
    };

    this.renderDropPasteBrowseTagline = () => {
      const numberOfAcquirers = this.props.acquirers.length;
      const browseFiles = this.renderBrowseButton(this.props.i18n('browseFiles'), this.triggerFileInputClick);
      const browseFolders = this.renderBrowseButton(this.props.i18n('browseFolders'), this.triggerFolderInputClick); // in order to keep the i18n CamelCase and options lower (as are defaults) we will want to transform a lower
      // to Camel

      const lowerFMSelectionType = this.props.fileManagerSelectionType;
      const camelFMSelectionType = lowerFMSelectionType.charAt(0).toUpperCase() + lowerFMSelectionType.slice(1);
      return h("div", {
        class: "uppy-Dashboard-AddFiles-title"
      }, // eslint-disable-next-line no-nested-ternary
      this.props.disableLocalFiles ? this.props.i18n('importFiles') : numberOfAcquirers > 0 ? this.props.i18nArray(`dropPasteImport${camelFMSelectionType}`, {
        browseFiles,
        browseFolders,
        browse: browseFiles
      }) : this.props.i18nArray(`dropPaste${camelFMSelectionType}`, {
        browseFiles,
        browseFolders,
        browse: browseFiles
      }));
    };

    this.renderAcquirer = acquirer => {
      return h("div", {
        className: "uppy-DashboardTab",
        role: "presentation",
        "data-uppy-acquirer-id": acquirer.id
      }, h("button", {
        type: "button",
        className: "uppy-u-reset uppy-c-btn uppy-DashboardTab-btn",
        role: "tab",
        tabIndex: 0,
        "data-cy": acquirer.id,
        "aria-controls": `uppy-DashboardContent-panel--${acquirer.id}`,
        "aria-selected": this.props.activePickerPanel.id === acquirer.id,
        "data-uppy-super-focusable": true,
        onClick: () => this.props.showPanel(acquirer.id)
      }, acquirer.icon(), h("div", {
        className: "uppy-DashboardTab-name"
      }, acquirer.name)));
    };

    this.renderAcquirers = (acquirers, disableLocalFiles) => {
      // Group last two buttons, so we don’t end up with
      // just one button on a new line
      const acquirersWithoutLastTwo = [...acquirers];
      const lastTwoAcquirers = acquirersWithoutLastTwo.splice(acquirers.length - 2, acquirers.length);
      return h("div", {
        className: "uppy-Dashboard-AddFiles-list",
        role: "tablist"
      }, !disableLocalFiles && this.renderMyDeviceAcquirer(), acquirersWithoutLastTwo.map(acquirer => this.renderAcquirer(acquirer)), h("span", {
        role: "presentation",
        style: {
          'white-space': 'nowrap'
        }
      }, lastTwoAcquirers.map(acquirer => this.renderAcquirer(acquirer))));
    };
  }

  [_Symbol$for]() {
    // Those are actually used in `renderDropPasteBrowseTagline` method.
    this.props.i18nArray('dropPasteBoth');
    this.props.i18nArray('dropPasteFiles');
    this.props.i18nArray('dropPasteFolders');
    this.props.i18nArray('dropPasteImportBoth');
    this.props.i18nArray('dropPasteImportFiles');
    this.props.i18nArray('dropPasteImportFolders');
  }

  renderPoweredByUppy() {
    const {
      i18nArray
    } = this.props;
    const uppyBranding = h("span", null, h("svg", {
      "aria-hidden": "true",
      focusable: "false",
      className: "uppy-c-icon uppy-Dashboard-poweredByIcon",
      width: "11",
      height: "11",
      viewBox: "0 0 11 11"
    }, h("path", {
      d: "M7.365 10.5l-.01-4.045h2.612L5.5.806l-4.467 5.65h2.604l.01 4.044h3.718z",
      fillRule: "evenodd"
    })), h("span", {
      className: "uppy-Dashboard-poweredByUppy"
    }, "Uppy"));
    const linkText = i18nArray('poweredBy', {
      uppy: uppyBranding
    });
    return h("a", {
      tabIndex: "-1",
      href: "https://uppy.io",
      rel: "noreferrer noopener",
      target: "_blank",
      className: "uppy-Dashboard-poweredBy"
    }, linkText);
  }

  render() {
    return h("div", {
      className: "uppy-Dashboard-AddFiles"
    }, this.renderHiddenInput(false, ref => {
      this.fileInput = ref;
    }), this.renderHiddenInput(true, ref => {
      this.folderInput = ref;
    }), this.renderDropPasteBrowseTagline(), this.props.acquirers.length > 0 && this.renderAcquirers(this.props.acquirers, this.props.disableLocalFiles), h("div", {
      className: "uppy-Dashboard-AddFiles-info"
    }, this.props.note && h("div", {
      className: "uppy-Dashboard-note"
    }, this.props.note), this.props.proudlyDisplayPoweredByUppy && this.renderPoweredByUppy(this.props)));
  }

}

module.exports = AddFiles;

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/AddFilesPanel.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/AddFilesPanel.js ***!
  \**********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const classNames = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");

const AddFiles = __webpack_require__(/*! ./AddFiles */ "./node_modules/@uppy/dashboard/lib/components/AddFiles.js");

const AddFilesPanel = props => {
  return h("div", {
    className: classNames('uppy-Dashboard-AddFilesPanel', props.className),
    "data-uppy-panelType": "AddFiles",
    "aria-hidden": props.showAddFilesPanel
  }, h("div", {
    className: "uppy-DashboardContent-bar"
  }, h("div", {
    className: "uppy-DashboardContent-title",
    role: "heading",
    "aria-level": "1"
  }, props.i18n('addingMoreFiles')), h("button", {
    className: "uppy-DashboardContent-back",
    type: "button",
    onClick: () => props.toggleAddFilesPanel(false)
  }, props.i18n('back'))), h(AddFiles, props));
};

module.exports = AddFilesPanel;

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/Dashboard.js":
/*!******************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/Dashboard.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const classNames = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");

const isDragDropSupported = __webpack_require__(/*! @uppy/utils/lib/isDragDropSupported */ "./node_modules/@uppy/utils/lib/isDragDropSupported.js");

const FileList = __webpack_require__(/*! ./FileList */ "./node_modules/@uppy/dashboard/lib/components/FileList.js");

const AddFiles = __webpack_require__(/*! ./AddFiles */ "./node_modules/@uppy/dashboard/lib/components/AddFiles.js");

const AddFilesPanel = __webpack_require__(/*! ./AddFilesPanel */ "./node_modules/@uppy/dashboard/lib/components/AddFilesPanel.js");

const PickerPanelContent = __webpack_require__(/*! ./PickerPanelContent */ "./node_modules/@uppy/dashboard/lib/components/PickerPanelContent.js");

const EditorPanel = __webpack_require__(/*! ./EditorPanel */ "./node_modules/@uppy/dashboard/lib/components/EditorPanel.js");

const PanelTopBar = __webpack_require__(/*! ./PickerPanelTopBar */ "./node_modules/@uppy/dashboard/lib/components/PickerPanelTopBar.js");

const FileCard = __webpack_require__(/*! ./FileCard */ "./node_modules/@uppy/dashboard/lib/components/FileCard/index.js");

const Slide = __webpack_require__(/*! ./Slide */ "./node_modules/@uppy/dashboard/lib/components/Slide.js"); // http://dev.edenspiekermann.com/2016/02/11/introducing-accessible-modal-dialog
// https://github.com/ghosh/micromodal


const WIDTH_XL = 900;
const WIDTH_LG = 700;
const WIDTH_MD = 576;
const HEIGHT_MD = 400;

module.exports = function Dashboard(props) {
  const noFiles = props.totalFileCount === 0;
  const isSizeMD = props.containerWidth > WIDTH_MD;
  const wrapperClassName = classNames({
    'uppy-Root': props.isTargetDOMEl
  });
  const dashboardClassName = classNames({
    'uppy-Dashboard': true,
    'uppy-Dashboard--isDisabled': props.disabled,
    'uppy-Dashboard--animateOpenClose': props.animateOpenClose,
    'uppy-Dashboard--isClosing': props.isClosing,
    'uppy-Dashboard--isDraggingOver': props.isDraggingOver,
    'uppy-Dashboard--modal': !props.inline,
    'uppy-size--md': props.containerWidth > WIDTH_MD,
    'uppy-size--lg': props.containerWidth > WIDTH_LG,
    'uppy-size--xl': props.containerWidth > WIDTH_XL,
    'uppy-size--height-md': props.containerHeight > HEIGHT_MD,
    'uppy-Dashboard--isAddFilesPanelVisible': props.showAddFilesPanel,
    'uppy-Dashboard--isInnerWrapVisible': props.areInsidesReadyToBeVisible
  }); // Important: keep these in sync with the percent width values in `src/components/FileItem/index.scss`.

  let itemsPerRow = 1; // mobile

  if (props.containerWidth > WIDTH_XL) {
    itemsPerRow = 5;
  } else if (props.containerWidth > WIDTH_LG) {
    itemsPerRow = 4;
  } else if (props.containerWidth > WIDTH_MD) {
    itemsPerRow = 3;
  }

  const showFileList = props.showSelectedFiles && !noFiles;
  const numberOfFilesForRecovery = props.recoveredState ? Object.keys(props.recoveredState.files).length : null;
  const numberOfGhosts = props.files ? Object.keys(props.files).filter(fileID => props.files[fileID].isGhost).length : null;

  const renderRestoredText = () => {
    if (numberOfGhosts > 0) {
      return props.i18n('recoveredXFiles', {
        smart_count: numberOfGhosts
      });
    }

    return props.i18n('recoveredAllFiles');
  };

  const dashboard = h("div", {
    className: dashboardClassName,
    "data-uppy-theme": props.theme,
    "data-uppy-num-acquirers": props.acquirers.length,
    "data-uppy-drag-drop-supported": !props.disableLocalFiles && isDragDropSupported(),
    "aria-hidden": props.inline ? 'false' : props.isHidden,
    "aria-disabled": props.disabled,
    "aria-label": !props.inline ? props.i18n('dashboardWindowTitle') : props.i18n('dashboardTitle'),
    onPaste: props.handlePaste,
    onDragOver: props.handleDragOver,
    onDragLeave: props.handleDragLeave,
    onDrop: props.handleDrop
  }, h("div", {
    "aria-hidden": "true",
    className: "uppy-Dashboard-overlay",
    tabIndex: -1,
    onClick: props.handleClickOutside
  }), h("div", {
    className: "uppy-Dashboard-inner",
    "aria-modal": !props.inline && 'true',
    role: !props.inline && 'dialog',
    style: {
      width: props.inline && props.width ? props.width : '',
      height: props.inline && props.height ? props.height : ''
    }
  }, !props.inline ? h("button", {
    className: "uppy-u-reset uppy-Dashboard-close",
    type: "button",
    "aria-label": props.i18n('closeModal'),
    title: props.i18n('closeModal'),
    onClick: props.closeModal
  }, h("span", {
    "aria-hidden": "true"
  }, "\xD7")) : null, h("div", {
    className: "uppy-Dashboard-innerWrap"
  }, h("div", {
    className: "uppy-Dashboard-dropFilesHereHint"
  }, props.i18n('dropHint')), showFileList && h(PanelTopBar, props), numberOfFilesForRecovery && h("div", {
    className: "uppy-Dashboard-serviceMsg"
  }, h("svg", {
    className: "uppy-Dashboard-serviceMsg-icon",
    "aria-hidden": "true",
    focusable: "false",
    width: "21",
    height: "16",
    viewBox: "0 0 24 19"
  }, h("g", {
    transform: "translate(0 -1)",
    fill: "none",
    fillRule: "evenodd"
  }, h("path", {
    d: "M12.857 1.43l10.234 17.056A1 1 0 0122.234 20H1.766a1 1 0 01-.857-1.514L11.143 1.429a1 1 0 011.714 0z",
    fill: "#FFD300"
  }), h("path", {
    fill: "#000",
    d: "M11 6h2l-.3 8h-1.4z"
  }), h("circle", {
    fill: "#000",
    cx: "12",
    cy: "17",
    r: "1"
  }))), h("strong", {
    className: "uppy-Dashboard-serviceMsg-title"
  }, props.i18n('sessionRestored')), h("div", {
    className: "uppy-Dashboard-serviceMsg-text"
  }, renderRestoredText())), showFileList ? h(FileList, _extends({}, props, {
    itemsPerRow: itemsPerRow
  })) : h(AddFiles, _extends({}, props, {
    isSizeMD: isSizeMD
  })), h(Slide, null, props.showAddFilesPanel ? h(AddFilesPanel, _extends({
    key: "AddFiles"
  }, props, {
    isSizeMD: isSizeMD
  })) : null), h(Slide, null, props.fileCardFor ? h(FileCard, _extends({
    key: "FileCard"
  }, props)) : null), h(Slide, null, props.activePickerPanel ? h(PickerPanelContent, _extends({
    key: "Picker"
  }, props)) : null), h(Slide, null, props.showFileEditor ? h(EditorPanel, _extends({
    key: "Editor"
  }, props)) : null), h("div", {
    className: "uppy-Dashboard-progressindicators"
  }, props.progressindicators.map(target => {
    return props.uppy.getPlugin(target.id).render(props.state);
  })))));
  return (// Wrap it for RTL language support
    h("div", {
      className: wrapperClassName,
      dir: props.direction
    }, dashboard)
  );
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/EditorPanel.js":
/*!********************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/EditorPanel.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const classNames = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");

function EditorPanel(props) {
  const file = props.files[props.fileCardFor];
  return h("div", {
    className: classNames('uppy-DashboardContent-panel', props.className),
    role: "tabpanel",
    "data-uppy-panelType": "FileEditor",
    id: "uppy-DashboardContent-panel--editor"
  }, h("div", {
    className: "uppy-DashboardContent-bar"
  }, h("div", {
    className: "uppy-DashboardContent-title",
    role: "heading",
    "aria-level": "1"
  }, props.i18nArray('editing', {
    file: h("span", {
      className: "uppy-DashboardContent-titleFile"
    }, file.meta ? file.meta.name : file.name)
  })), h("button", {
    className: "uppy-DashboardContent-back",
    type: "button",
    onClick: props.hideAllPanels
  }, props.i18n('cancel')), h("button", {
    className: "uppy-DashboardContent-save",
    type: "button",
    onClick: props.saveFileEditor
  }, props.i18n('save'))), h("div", {
    className: "uppy-DashboardContent-panelBody"
  }, props.editors.map(target => {
    return props.uppy.getPlugin(target.id).render(props.state);
  })));
}

module.exports = EditorPanel;

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/FileCard/index.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/FileCard/index.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h,
  Component
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const classNames = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");

const {
  nanoid
} = __webpack_require__(/*! nanoid/non-secure */ "./node_modules/nanoid/non-secure/index.cjs");

const getFileTypeIcon = __webpack_require__(/*! ../../utils/getFileTypeIcon */ "./node_modules/@uppy/dashboard/lib/utils/getFileTypeIcon.js");

const ignoreEvent = __webpack_require__(/*! ../../utils/ignoreEvent.js */ "./node_modules/@uppy/dashboard/lib/utils/ignoreEvent.js");

const FilePreview = __webpack_require__(/*! ../FilePreview */ "./node_modules/@uppy/dashboard/lib/components/FilePreview.js");

class FileCard extends Component {
  constructor(props) {
    super(props);
    this.form = document.createElement('form');

    this.updateMeta = (newVal, name) => {
      this.setState(_ref => {
        let {
          formState
        } = _ref;
        return {
          formState: { ...formState,
            [name]: newVal
          }
        };
      });
    };

    this.handleSave = e => {
      e.preventDefault();
      const fileID = this.props.fileCardFor;
      this.props.saveFileCard(this.state.formState, fileID);
    };

    this.handleCancel = () => {
      this.props.toggleFileCard(false);
    };

    this.saveOnEnter = ev => {
      if (ev.keyCode === 13) {
        ev.stopPropagation();
        ev.preventDefault();
        const file = this.props.files[this.props.fileCardFor];
        this.props.saveFileCard(this.state.formState, file.id);
      }
    };

    this.renderMetaFields = () => {
      const metaFields = this.getMetaFields() || [];
      const fieldCSSClasses = {
        text: 'uppy-u-reset uppy-c-textInput uppy-Dashboard-FileCard-input'
      };
      return metaFields.map(field => {
        const id = `uppy-Dashboard-FileCard-input-${field.id}`;
        const required = this.props.requiredMetaFields.includes(field.id);
        return h("fieldset", {
          key: field.id,
          className: "uppy-Dashboard-FileCard-fieldset"
        }, h("label", {
          className: "uppy-Dashboard-FileCard-label",
          htmlFor: id
        }, field.name), field.render !== undefined ? field.render({
          value: this.state.formState[field.id],
          onChange: newVal => this.updateMeta(newVal, field.id),
          fieldCSSClasses,
          required,
          form: this.form.id
        }, h) : h("input", {
          className: fieldCSSClasses.text,
          id: id,
          form: this.form.id,
          type: field.type || 'text',
          required: required,
          value: this.state.formState[field.id],
          placeholder: field.placeholder // If `form` attribute is not supported, we need to capture pressing Enter to avoid bubbling in case Uppy is
          // embedded inside a <form>.
          ,
          onKeyUp: 'form' in HTMLInputElement.prototype ? undefined : this.saveOnEnter,
          onKeyDown: 'form' in HTMLInputElement.prototype ? undefined : this.saveOnEnter,
          onKeyPress: 'form' in HTMLInputElement.prototype ? undefined : this.saveOnEnter,
          onInput: ev => this.updateMeta(ev.target.value, field.id),
          "data-uppy-super-focusable": true
        }));
      });
    };

    const _file = this.props.files[this.props.fileCardFor];

    const _metaFields = this.getMetaFields() || [];

    const storedMetaData = {};

    _metaFields.forEach(field => {
      storedMetaData[field.id] = _file.meta[field.id] || '';
    });

    this.state = {
      formState: storedMetaData
    };
    this.form.id = nanoid();
  } // TODO(aduh95): move this to `UNSAFE_componentWillMount` when updating to Preact X+.


  componentWillMount() {
    // eslint-disable-line react/no-deprecated
    this.form.addEventListener('submit', this.handleSave);
    document.body.appendChild(this.form);
  }

  componentWillUnmount() {
    this.form.removeEventListener('submit', this.handleSave);
    document.body.removeChild(this.form);
  }

  getMetaFields() {
    return typeof this.props.metaFields === 'function' ? this.props.metaFields(this.props.files[this.props.fileCardFor]) : this.props.metaFields;
  }

  render() {
    const file = this.props.files[this.props.fileCardFor];
    const showEditButton = this.props.canEditFile(file);
    return h("div", {
      className: classNames('uppy-Dashboard-FileCard', this.props.className),
      "data-uppy-panelType": "FileCard",
      onDragOver: ignoreEvent,
      onDragLeave: ignoreEvent,
      onDrop: ignoreEvent,
      onPaste: ignoreEvent
    }, h("div", {
      className: "uppy-DashboardContent-bar"
    }, h("div", {
      className: "uppy-DashboardContent-title",
      role: "heading",
      "aria-level": "1"
    }, this.props.i18nArray('editing', {
      file: h("span", {
        className: "uppy-DashboardContent-titleFile"
      }, file.meta ? file.meta.name : file.name)
    })), h("button", {
      className: "uppy-DashboardContent-back",
      type: "button",
      form: this.form.id,
      title: this.props.i18n('finishEditingFile'),
      onClick: this.handleCancel
    }, this.props.i18n('cancel'))), h("div", {
      className: "uppy-Dashboard-FileCard-inner"
    }, h("div", {
      className: "uppy-Dashboard-FileCard-preview",
      style: {
        backgroundColor: getFileTypeIcon(file.type).color
      }
    }, h(FilePreview, {
      file: file
    }), showEditButton && h("button", {
      type: "button",
      className: "uppy-u-reset uppy-c-btn uppy-Dashboard-FileCard-edit",
      onClick: event => {
        // When opening the image editor we want to save any meta fields changes.
        // Otherwise it's confusing for the user to click save in the editor,
        // but the changes here are discarded. This bypasses validation,
        // but we are okay with that.
        this.handleSave(event);
        this.props.openFileEditor(file);
      },
      form: this.form.id
    }, this.props.i18n('editFile'))), h("div", {
      className: "uppy-Dashboard-FileCard-info"
    }, this.renderMetaFields()), h("div", {
      className: "uppy-Dashboard-FileCard-actions"
    }, h("button", {
      className: "uppy-u-reset uppy-c-btn uppy-c-btn-primary uppy-Dashboard-FileCard-actionsBtn" // If `form` attribute is supported, we want a submit button to trigger the form validation.
      // Otherwise, fallback to a classic button with a onClick event handler.
      ,
      type: 'form' in HTMLButtonElement.prototype ? 'submit' : 'button',
      onClick: 'form' in HTMLButtonElement.prototype ? undefined : this.handleSave,
      form: this.form.id
    }, this.props.i18n('saveChanges')), h("button", {
      className: "uppy-u-reset uppy-c-btn uppy-c-btn-link uppy-Dashboard-FileCard-actionsBtn",
      type: "button",
      onClick: this.handleCancel,
      form: this.form.id
    }, this.props.i18n('cancel')))));
  }

}

module.exports = FileCard;

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/FileItem/Buttons/index.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/FileItem/Buttons/index.js ***!
  \*******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const copyToClipboard = __webpack_require__(/*! ../../../utils/copyToClipboard */ "./node_modules/@uppy/dashboard/lib/utils/copyToClipboard.js");

function EditButton(_ref) {
  let {
    file,
    uploadInProgressOrComplete,
    metaFields,
    canEditFile,
    i18n,
    onClick
  } = _ref;

  if (!uploadInProgressOrComplete && metaFields && metaFields.length > 0 || !uploadInProgressOrComplete && canEditFile(file)) {
    return h("button", {
      className: "uppy-u-reset uppy-Dashboard-Item-action uppy-Dashboard-Item-action--edit",
      type: "button",
      "aria-label": i18n('editFileWithFilename', {
        file: file.meta.name
      }),
      title: i18n('editFileWithFilename', {
        file: file.meta.name
      }),
      onClick: () => onClick()
    }, h("svg", {
      "aria-hidden": "true",
      focusable: "false",
      className: "uppy-c-icon",
      width: "14",
      height: "14",
      viewBox: "0 0 14 14"
    }, h("g", {
      fillRule: "evenodd"
    }, h("path", {
      d: "M1.5 10.793h2.793A1 1 0 0 0 5 10.5L11.5 4a1 1 0 0 0 0-1.414L9.707.793a1 1 0 0 0-1.414 0l-6.5 6.5A1 1 0 0 0 1.5 8v2.793zm1-1V8L9 1.5l1.793 1.793-6.5 6.5H2.5z",
      fillRule: "nonzero"
    }), h("rect", {
      x: "1",
      y: "12.293",
      width: "11",
      height: "1",
      rx: ".5"
    }), h("path", {
      fillRule: "nonzero",
      d: "M6.793 2.5L9.5 5.207l.707-.707L7.5 1.793z"
    }))));
  }

  return null;
}

function RemoveButton(_ref2) {
  let {
    i18n,
    onClick,
    file
  } = _ref2;
  return h("button", {
    className: "uppy-u-reset uppy-Dashboard-Item-action uppy-Dashboard-Item-action--remove",
    type: "button",
    "aria-label": i18n('removeFile', {
      file: file.meta.name
    }),
    title: i18n('removeFile', {
      file: file.meta.name
    }),
    onClick: () => onClick()
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "18",
    height: "18",
    viewBox: "0 0 18 18"
  }, h("path", {
    d: "M9 0C4.034 0 0 4.034 0 9s4.034 9 9 9 9-4.034 9-9-4.034-9-9-9z"
  }), h("path", {
    fill: "#FFF",
    d: "M13 12.222l-.778.778L9 9.778 5.778 13 5 12.222 8.222 9 5 5.778 5.778 5 9 8.222 12.222 5l.778.778L9.778 9z"
  })));
}

const copyLinkToClipboard = (event, props) => {
  copyToClipboard(props.file.uploadURL, props.i18n('copyLinkToClipboardFallback')).then(() => {
    props.uppy.log('Link copied to clipboard.');
    props.uppy.info(props.i18n('copyLinkToClipboardSuccess'), 'info', 3000);
  }).catch(props.uppy.log) // avoid losing focus
  .then(() => event.target.focus({
    preventScroll: true
  }));
};

function CopyLinkButton(props) {
  const {
    i18n
  } = props;
  return h("button", {
    className: "uppy-u-reset uppy-Dashboard-Item-action uppy-Dashboard-Item-action--copyLink",
    type: "button",
    "aria-label": i18n('copyLink'),
    title: i18n('copyLink'),
    onClick: event => copyLinkToClipboard(event, props)
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "14",
    height: "14",
    viewBox: "0 0 14 12"
  }, h("path", {
    d: "M7.94 7.703a2.613 2.613 0 0 1-.626 2.681l-.852.851a2.597 2.597 0 0 1-1.849.766A2.616 2.616 0 0 1 2.764 7.54l.852-.852a2.596 2.596 0 0 1 2.69-.625L5.267 7.099a1.44 1.44 0 0 0-.833.407l-.852.851a1.458 1.458 0 0 0 1.03 2.486c.39 0 .755-.152 1.03-.426l.852-.852c.231-.231.363-.522.406-.824l1.04-1.038zm4.295-5.937A2.596 2.596 0 0 0 10.387 1c-.698 0-1.355.272-1.849.766l-.852.851a2.614 2.614 0 0 0-.624 2.688l1.036-1.036c.041-.304.173-.6.407-.833l.852-.852c.275-.275.64-.426 1.03-.426a1.458 1.458 0 0 1 1.03 2.486l-.852.851a1.442 1.442 0 0 1-.824.406l-1.04 1.04a2.596 2.596 0 0 0 2.683-.628l.851-.85a2.616 2.616 0 0 0 0-3.697zm-6.88 6.883a.577.577 0 0 0 .82 0l3.474-3.474a.579.579 0 1 0-.819-.82L5.355 7.83a.579.579 0 0 0 0 .819z"
  })));
}

module.exports = function Buttons(props) {
  const {
    uppy,
    file,
    uploadInProgressOrComplete,
    canEditFile,
    metaFields,
    showLinkToFileUploadResult,
    showRemoveButton,
    i18n,
    toggleFileCard,
    openFileEditor
  } = props;

  const editAction = () => {
    if (metaFields && metaFields.length > 0) {
      toggleFileCard(true, file.id);
    } else {
      openFileEditor(file);
    }
  };

  return h("div", {
    className: "uppy-Dashboard-Item-actionWrapper"
  }, h(EditButton, {
    i18n: i18n,
    file: file,
    uploadInProgressOrComplete: uploadInProgressOrComplete,
    canEditFile: canEditFile,
    metaFields: metaFields,
    onClick: editAction
  }), showLinkToFileUploadResult && file.uploadURL ? h(CopyLinkButton, {
    file: file,
    uppy: uppy,
    i18n: i18n
  }) : null, showRemoveButton ? h(RemoveButton, {
    i18n: i18n,
    file: file,
    uppy: uppy,
    onClick: () => props.uppy.removeFile(file.id, 'removed-by-user')
  }) : null);
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/FileItem/FileInfo/index.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/FileItem/FileInfo/index.js ***!
  \********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h,
  Fragment
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const prettierBytes = __webpack_require__(/*! @transloadit/prettier-bytes */ "./node_modules/@transloadit/prettier-bytes/prettierBytes.js");

const truncateString = __webpack_require__(/*! @uppy/utils/lib/truncateString */ "./node_modules/@uppy/utils/lib/truncateString.js");

const MetaErrorMessage = __webpack_require__(/*! ../MetaErrorMessage */ "./node_modules/@uppy/dashboard/lib/components/FileItem/MetaErrorMessage.js");

const renderFileName = props => {
  const {
    author,
    name
  } = props.file.meta;

  function getMaxNameLength() {
    if (props.containerWidth <= 352) {
      return 35;
    }

    if (props.containerWidth <= 576) {
      return 60;
    } // When `author` is present, we want to make sure
    // the file name fits on one line so we can place
    // the author on the second line.


    return author ? 20 : 30;
  }

  return h("div", {
    className: "uppy-Dashboard-Item-name",
    title: name
  }, truncateString(name, getMaxNameLength()));
};

const renderAuthor = props => {
  const {
    author
  } = props.file.meta;
  const {
    providerName
  } = props.file.remote;
  const dot = `\u00B7`;

  if (!author) {
    return null;
  }

  return h("div", {
    className: "uppy-Dashboard-Item-author"
  }, h("a", {
    href: `${author.url}?utm_source=Companion&utm_medium=referral`,
    target: "_blank",
    rel: "noopener noreferrer"
  }, truncateString(author.name, 13)), providerName ? h(Fragment, null, ` ${dot} `, providerName, ` ${dot} `) : null);
};

const renderFileSize = props => props.file.size && h("div", {
  className: "uppy-Dashboard-Item-statusSize"
}, prettierBytes(props.file.size));

const ReSelectButton = props => props.file.isGhost && h("span", null, ' \u2022 ', h("button", {
  className: "uppy-u-reset uppy-c-btn uppy-Dashboard-Item-reSelect",
  type: "button",
  onClick: props.toggleAddFilesPanel
}, props.i18n('reSelect')));

const ErrorButton = _ref => {
  let {
    file,
    onClick
  } = _ref;

  if (file.error) {
    return h("button", {
      className: "uppy-u-reset uppy-Dashboard-Item-errorDetails",
      "aria-label": file.error,
      "data-microtip-position": "bottom",
      "data-microtip-size": "medium",
      onClick: onClick,
      type: "button"
    }, "?");
  }

  return null;
};

module.exports = function FileInfo(props) {
  const {
    file
  } = props;
  return h("div", {
    className: "uppy-Dashboard-Item-fileInfo",
    "data-uppy-file-source": file.source
  }, h("div", {
    className: "uppy-Dashboard-Item-fileName"
  }, renderFileName(props), h(ErrorButton, {
    file: props.file // eslint-disable-next-line no-alert
    ,
    onClick: () => alert(props.file.error) // TODO: move to a custom alert implementation

  })), h("div", {
    className: "uppy-Dashboard-Item-status"
  }, renderAuthor(props), renderFileSize(props), ReSelectButton(props)), h(MetaErrorMessage, {
    file: props.file,
    i18n: props.i18n,
    toggleFileCard: props.toggleFileCard,
    metaFields: props.metaFields
  }));
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/FileItem/FilePreviewAndLink/index.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/FileItem/FilePreviewAndLink/index.js ***!
  \******************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const FilePreview = __webpack_require__(/*! ../../FilePreview */ "./node_modules/@uppy/dashboard/lib/components/FilePreview.js");

const MetaErrorMessage = __webpack_require__(/*! ../MetaErrorMessage */ "./node_modules/@uppy/dashboard/lib/components/FileItem/MetaErrorMessage.js");

const getFileTypeIcon = __webpack_require__(/*! ../../../utils/getFileTypeIcon */ "./node_modules/@uppy/dashboard/lib/utils/getFileTypeIcon.js");

module.exports = function FilePreviewAndLink(props) {
  return h("div", {
    className: "uppy-Dashboard-Item-previewInnerWrap",
    style: {
      backgroundColor: getFileTypeIcon(props.file.type).color
    }
  }, props.showLinkToFileUploadResult && props.file.uploadURL && h("a", {
    className: "uppy-Dashboard-Item-previewLink",
    href: props.file.uploadURL,
    rel: "noreferrer noopener",
    target: "_blank",
    "aria-label": props.file.meta.name
  }, h("span", {
    hidden: true
  }, props.file.meta.name)), h(FilePreview, {
    file: props.file
  }), h(MetaErrorMessage, {
    file: props.file,
    i18n: props.i18n,
    toggleFileCard: props.toggleFileCard,
    metaFields: props.metaFields
  }));
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/FileItem/FileProgress/index.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/FileItem/FileProgress/index.js ***!
  \************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

function onPauseResumeCancelRetry(props) {
  if (props.isUploaded) return;

  if (props.error && !props.hideRetryButton) {
    props.uppy.retryUpload(props.file.id);
    return;
  }

  if (props.resumableUploads && !props.hidePauseResumeButton) {
    props.uppy.pauseResume(props.file.id);
  } else if (props.individualCancellation && !props.hideCancelButton) {
    props.uppy.removeFile(props.file.id);
  }
}

function progressIndicatorTitle(props) {
  if (props.isUploaded) {
    return props.i18n('uploadComplete');
  }

  if (props.error) {
    return props.i18n('retryUpload');
  }

  if (props.resumableUploads) {
    if (props.file.isPaused) {
      return props.i18n('resumeUpload');
    }

    return props.i18n('pauseUpload');
  }

  if (props.individualCancellation) {
    return props.i18n('cancelUpload');
  }

  return '';
}

function ProgressIndicatorButton(props) {
  return h("div", {
    className: "uppy-Dashboard-Item-progress"
  }, h("button", {
    className: "uppy-u-reset uppy-Dashboard-Item-progressIndicator",
    type: "button",
    "aria-label": progressIndicatorTitle(props),
    title: progressIndicatorTitle(props),
    onClick: () => onPauseResumeCancelRetry(props)
  }, props.children));
}

function ProgressCircleContainer(_ref) {
  let {
    children
  } = _ref;
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    width: "70",
    height: "70",
    viewBox: "0 0 36 36",
    className: "uppy-c-icon uppy-Dashboard-Item-progressIcon--circle"
  }, children);
}

function ProgressCircle(_ref2) {
  let {
    progress
  } = _ref2;
  // circle length equals 2 * PI * R
  const circleLength = 2 * Math.PI * 15;
  return h("g", null, h("circle", {
    className: "uppy-Dashboard-Item-progressIcon--bg",
    r: "15",
    cx: "18",
    cy: "18",
    "stroke-width": "2",
    fill: "none"
  }), h("circle", {
    className: "uppy-Dashboard-Item-progressIcon--progress",
    r: "15",
    cx: "18",
    cy: "18",
    transform: "rotate(-90, 18, 18)",
    fill: "none",
    "stroke-width": "2",
    "stroke-dasharray": circleLength,
    "stroke-dashoffset": circleLength - circleLength / 100 * progress
  }));
}

module.exports = function FileProgress(props) {
  // Nothing if upload has not started
  if (!props.file.progress.uploadStarted) {
    return null;
  } // Green checkmark when complete


  if (props.isUploaded) {
    return h("div", {
      className: "uppy-Dashboard-Item-progress"
    }, h("div", {
      className: "uppy-Dashboard-Item-progressIndicator"
    }, h(ProgressCircleContainer, null, h("circle", {
      r: "15",
      cx: "18",
      cy: "18",
      fill: "#1bb240"
    }), h("polygon", {
      className: "uppy-Dashboard-Item-progressIcon--check",
      transform: "translate(2, 3)",
      points: "14 22.5 7 15.2457065 8.99985857 13.1732815 14 18.3547104 22.9729883 9 25 11.1005634"
    }))));
  }

  if (props.recoveredState) {
    return;
  } // Retry button for error


  if (props.error && !props.hideRetryButton) {
    return h(ProgressIndicatorButton, props, h("svg", {
      "aria-hidden": "true",
      focusable: "false",
      className: "uppy-c-icon uppy-Dashboard-Item-progressIcon--retry",
      width: "28",
      height: "31",
      viewBox: "0 0 16 19"
    }, h("path", {
      d: "M16 11a8 8 0 1 1-8-8v2a6 6 0 1 0 6 6h2z"
    }), h("path", {
      d: "M7.9 3H10v2H7.9z"
    }), h("path", {
      d: "M8.536.5l3.535 3.536-1.414 1.414L7.12 1.914z"
    }), h("path", {
      d: "M10.657 2.621l1.414 1.415L8.536 7.57 7.12 6.157z"
    })));
  } // Pause/resume button for resumable uploads


  if (props.resumableUploads && !props.hidePauseResumeButton) {
    return h(ProgressIndicatorButton, props, h(ProgressCircleContainer, null, h(ProgressCircle, {
      progress: props.file.progress.percentage
    }), props.file.isPaused ? h("polygon", {
      className: "uppy-Dashboard-Item-progressIcon--play",
      transform: "translate(3, 3)",
      points: "12 20 12 10 20 15"
    }) : h("g", {
      className: "uppy-Dashboard-Item-progressIcon--pause",
      transform: "translate(14.5, 13)"
    }, h("rect", {
      x: "0",
      y: "0",
      width: "2",
      height: "10",
      rx: "0"
    }), h("rect", {
      x: "5",
      y: "0",
      width: "2",
      height: "10",
      rx: "0"
    }))));
  } // Cancel button for non-resumable uploads if individualCancellation is supported (not bundled)


  if (!props.resumableUploads && props.individualCancellation && !props.hideCancelButton) {
    return h(ProgressIndicatorButton, props, h(ProgressCircleContainer, null, h(ProgressCircle, {
      progress: props.file.progress.percentage
    }), h("polygon", {
      className: "cancel",
      transform: "translate(2, 2)",
      points: "19.8856516 11.0625 16 14.9481516 12.1019737 11.0625 11.0625 12.1143484 14.9481516 16 11.0625 19.8980263 12.1019737 20.9375 16 17.0518484 19.8856516 20.9375 20.9375 19.8980263 17.0518484 16 20.9375 12"
    })));
  } // Just progress when buttons are disabled


  return h("div", {
    className: "uppy-Dashboard-Item-progress"
  }, h("div", {
    className: "uppy-Dashboard-Item-progressIndicator"
  }, h(ProgressCircleContainer, null, h(ProgressCircle, {
    progress: props.file.progress.percentage
  }))));
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/FileItem/MetaErrorMessage.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/FileItem/MetaErrorMessage.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const metaFieldIdToName = (metaFieldId, metaFields) => {
  const field = metaFields.filter(f => f.id === metaFieldId);
  return field[0].name;
};

module.exports = function renderMissingMetaFieldsError(props) {
  const {
    file,
    toggleFileCard,
    i18n,
    metaFields
  } = props;
  const {
    missingRequiredMetaFields
  } = file;

  if (!(missingRequiredMetaFields != null && missingRequiredMetaFields.length)) {
    return null;
  }

  const metaFieldsString = missingRequiredMetaFields.map(missingMetaField => metaFieldIdToName(missingMetaField, metaFields)).join(', ');
  return h("div", {
    className: "uppy-Dashboard-Item-errorMessage"
  }, i18n('missingRequiredMetaFields', {
    smart_count: missingRequiredMetaFields.length,
    fields: metaFieldsString
  }), ' ', h("button", {
    type: "button",
    class: "uppy-u-reset uppy-Dashboard-Item-errorMessageBtn",
    onClick: () => toggleFileCard(true, file.id)
  }, i18n('editFile')));
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/FileItem/index.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/FileItem/index.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h,
  Component
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const classNames = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");

const shallowEqual = __webpack_require__(/*! is-shallow-equal */ "./node_modules/is-shallow-equal/index.js");

const FilePreviewAndLink = __webpack_require__(/*! ./FilePreviewAndLink */ "./node_modules/@uppy/dashboard/lib/components/FileItem/FilePreviewAndLink/index.js");

const FileProgress = __webpack_require__(/*! ./FileProgress */ "./node_modules/@uppy/dashboard/lib/components/FileItem/FileProgress/index.js");

const FileInfo = __webpack_require__(/*! ./FileInfo */ "./node_modules/@uppy/dashboard/lib/components/FileItem/FileInfo/index.js");

const Buttons = __webpack_require__(/*! ./Buttons */ "./node_modules/@uppy/dashboard/lib/components/FileItem/Buttons/index.js");

module.exports = class FileItem extends Component {
  componentDidMount() {
    const {
      file
    } = this.props;

    if (!file.preview) {
      this.props.handleRequestThumbnail(file);
    }
  }

  shouldComponentUpdate(nextProps) {
    return !shallowEqual(this.props, nextProps);
  } // VirtualList mounts FileItems again and they emit `thumbnail:request`
  // Otherwise thumbnails are broken or missing after Golden Retriever restores files


  componentDidUpdate() {
    const {
      file
    } = this.props;

    if (!file.preview) {
      this.props.handleRequestThumbnail(file);
    }
  }

  componentWillUnmount() {
    const {
      file
    } = this.props;

    if (!file.preview) {
      this.props.handleCancelThumbnail(file);
    }
  }

  render() {
    const {
      file
    } = this.props;
    const isProcessing = file.progress.preprocess || file.progress.postprocess;
    const isUploaded = file.progress.uploadComplete && !isProcessing && !file.error;
    const uploadInProgressOrComplete = file.progress.uploadStarted || isProcessing;
    const uploadInProgress = file.progress.uploadStarted && !file.progress.uploadComplete || isProcessing;
    const error = file.error || false; // File that Golden Retriever was able to partly restore (only meta, not blob),
    // users still need to re-add it, so it’s a ghost

    const {
      isGhost
    } = file;
    let showRemoveButton = this.props.individualCancellation ? !isUploaded : !uploadInProgress && !isUploaded;

    if (isUploaded && this.props.showRemoveButtonAfterComplete) {
      showRemoveButton = true;
    }

    const dashboardItemClass = classNames({
      'uppy-Dashboard-Item': true,
      'is-inprogress': uploadInProgress && !this.props.recoveredState,
      'is-processing': isProcessing,
      'is-complete': isUploaded,
      'is-error': !!error,
      'is-resumable': this.props.resumableUploads,
      'is-noIndividualCancellation': !this.props.individualCancellation,
      'is-ghost': isGhost
    });
    return h("div", {
      className: dashboardItemClass,
      id: `uppy_${file.id}`,
      role: this.props.role
    }, h("div", {
      className: "uppy-Dashboard-Item-preview"
    }, h(FilePreviewAndLink, {
      file: file,
      showLinkToFileUploadResult: this.props.showLinkToFileUploadResult,
      i18n: this.props.i18n,
      toggleFileCard: this.props.toggleFileCard,
      metaFields: this.props.metaFields
    }), h(FileProgress, {
      uppy: this.props.uppy,
      file: file,
      error: error,
      isUploaded: isUploaded,
      hideRetryButton: this.props.hideRetryButton,
      hideCancelButton: this.props.hideCancelButton,
      hidePauseResumeButton: this.props.hidePauseResumeButton,
      recoveredState: this.props.recoveredState,
      showRemoveButtonAfterComplete: this.props.showRemoveButtonAfterComplete,
      resumableUploads: this.props.resumableUploads,
      individualCancellation: this.props.individualCancellation,
      i18n: this.props.i18n
    })), h("div", {
      className: "uppy-Dashboard-Item-fileInfoAndButtons"
    }, h(FileInfo, {
      file: file,
      id: this.props.id,
      acquirers: this.props.acquirers,
      containerWidth: this.props.containerWidth,
      i18n: this.props.i18n,
      toggleAddFilesPanel: this.props.toggleAddFilesPanel,
      toggleFileCard: this.props.toggleFileCard,
      metaFields: this.props.metaFields
    }), h(Buttons, {
      file: file,
      metaFields: this.props.metaFields,
      showLinkToFileUploadResult: this.props.showLinkToFileUploadResult,
      showRemoveButton: showRemoveButton,
      canEditFile: this.props.canEditFile,
      uploadInProgressOrComplete: uploadInProgressOrComplete,
      toggleFileCard: this.props.toggleFileCard,
      openFileEditor: this.props.openFileEditor,
      uppy: this.props.uppy,
      i18n: this.props.i18n
    })));
  }

};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/FileList.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/FileList.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const classNames = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const FileItem = __webpack_require__(/*! ./FileItem/index.js */ "./node_modules/@uppy/dashboard/lib/components/FileItem/index.js");

const VirtualList = __webpack_require__(/*! ./VirtualList */ "./node_modules/@uppy/dashboard/lib/components/VirtualList.js");

function chunks(list, size) {
  const chunked = [];
  let currentChunk = [];
  list.forEach(item => {
    if (currentChunk.length < size) {
      currentChunk.push(item);
    } else {
      chunked.push(currentChunk);
      currentChunk = [item];
    }
  });
  if (currentChunk.length) chunked.push(currentChunk);
  return chunked;
}

module.exports = props => {
  const noFiles = props.totalFileCount === 0;
  const dashboardFilesClass = classNames('uppy-Dashboard-files', {
    'uppy-Dashboard-files--noFiles': noFiles
  }); // It's not great that this is hardcoded!
  // It's ESPECIALLY not great that this is checking against `itemsPerRow`!

  const rowHeight = props.itemsPerRow === 1 // Mobile
  ? 71 // 190px height + 2 * 5px margin
  : 200;
  const fileProps = {
    // FIXME This is confusing, it's actually the Dashboard's plugin ID
    id: props.id,
    error: props.error,
    // TODO move this to context
    i18n: props.i18n,
    uppy: props.uppy,
    // features
    acquirers: props.acquirers,
    resumableUploads: props.resumableUploads,
    individualCancellation: props.individualCancellation,
    // visual options
    hideRetryButton: props.hideRetryButton,
    hidePauseResumeButton: props.hidePauseResumeButton,
    hideCancelButton: props.hideCancelButton,
    showLinkToFileUploadResult: props.showLinkToFileUploadResult,
    showRemoveButtonAfterComplete: props.showRemoveButtonAfterComplete,
    isWide: props.isWide,
    metaFields: props.metaFields,
    recoveredState: props.recoveredState,
    // callbacks
    toggleFileCard: props.toggleFileCard,
    handleRequestThumbnail: props.handleRequestThumbnail,
    handleCancelThumbnail: props.handleCancelThumbnail
  };

  const sortByGhostComesFirst = (file1, file2) => {
    return props.files[file2].isGhost - props.files[file1].isGhost;
  }; // Sort files by file.isGhost, ghost files first, only if recoveredState is present


  const files = Object.keys(props.files);
  if (props.recoveredState) files.sort(sortByGhostComesFirst);
  const rows = chunks(files, props.itemsPerRow);

  const renderRow = row => // The `role="presentation` attribute ensures that the list items are properly
  // associated with the `VirtualList` element.
  // We use the first file ID as the key—this should not change across scroll rerenders
  h("div", {
    role: "presentation",
    key: row[0]
  }, row.map(fileID => h(FileItem, _extends({
    key: fileID,
    uppy: props.uppy
  }, fileProps, {
    role: "listitem",
    openFileEditor: props.openFileEditor,
    canEditFile: props.canEditFile,
    toggleAddFilesPanel: props.toggleAddFilesPanel,
    file: props.files[fileID]
  }))));

  return h(VirtualList, {
    class: dashboardFilesClass,
    role: "list",
    data: rows,
    renderRow: renderRow,
    rowHeight: rowHeight
  });
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/FilePreview.js":
/*!********************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/FilePreview.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const getFileTypeIcon = __webpack_require__(/*! ../utils/getFileTypeIcon */ "./node_modules/@uppy/dashboard/lib/utils/getFileTypeIcon.js");

module.exports = function FilePreview(props) {
  const {
    file
  } = props;

  if (file.preview) {
    return h("img", {
      className: "uppy-Dashboard-Item-previewImg",
      alt: file.name,
      src: file.preview
    });
  }

  const {
    color,
    icon
  } = getFileTypeIcon(file.type);
  return h("div", {
    className: "uppy-Dashboard-Item-previewIconWrap"
  }, h("span", {
    className: "uppy-Dashboard-Item-previewIcon",
    style: {
      color
    }
  }, icon), h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-Dashboard-Item-previewIconBg",
    width: "58",
    height: "76",
    viewBox: "0 0 58 76"
  }, h("rect", {
    fill: "#FFF",
    width: "58",
    height: "76",
    rx: "3",
    fillRule: "evenodd"
  })));
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/PickerPanelContent.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/PickerPanelContent.js ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const classNames = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");

const ignoreEvent = __webpack_require__(/*! ../utils/ignoreEvent.js */ "./node_modules/@uppy/dashboard/lib/utils/ignoreEvent.js");

function PickerPanelContent(props) {
  return h("div", {
    className: classNames('uppy-DashboardContent-panel', props.className),
    role: "tabpanel",
    "data-uppy-panelType": "PickerPanel",
    id: `uppy-DashboardContent-panel--${props.activePickerPanel.id}`,
    onDragOver: ignoreEvent,
    onDragLeave: ignoreEvent,
    onDrop: ignoreEvent,
    onPaste: ignoreEvent
  }, h("div", {
    className: "uppy-DashboardContent-bar"
  }, h("div", {
    className: "uppy-DashboardContent-title",
    role: "heading",
    "aria-level": "1"
  }, props.i18n('importFrom', {
    name: props.activePickerPanel.name
  })), h("button", {
    className: "uppy-DashboardContent-back",
    type: "button",
    onClick: props.hideAllPanels
  }, props.i18n('cancel'))), h("div", {
    className: "uppy-DashboardContent-panelBody"
  }, props.uppy.getPlugin(props.activePickerPanel.id).render(props.state)));
}

module.exports = PickerPanelContent;

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/PickerPanelTopBar.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/PickerPanelTopBar.js ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const uploadStates = {
  STATE_ERROR: 'error',
  STATE_WAITING: 'waiting',
  STATE_PREPROCESSING: 'preprocessing',
  STATE_UPLOADING: 'uploading',
  STATE_POSTPROCESSING: 'postprocessing',
  STATE_COMPLETE: 'complete',
  STATE_PAUSED: 'paused'
};

function getUploadingState(isAllErrored, isAllComplete, isAllPaused, files) {
  if (files === void 0) {
    files = {};
  }

  if (isAllErrored) {
    return uploadStates.STATE_ERROR;
  }

  if (isAllComplete) {
    return uploadStates.STATE_COMPLETE;
  }

  if (isAllPaused) {
    return uploadStates.STATE_PAUSED;
  }

  let state = uploadStates.STATE_WAITING;
  const fileIDs = Object.keys(files);

  for (let i = 0; i < fileIDs.length; i++) {
    const {
      progress
    } = files[fileIDs[i]]; // If ANY files are being uploaded right now, show the uploading state.

    if (progress.uploadStarted && !progress.uploadComplete) {
      return uploadStates.STATE_UPLOADING;
    } // If files are being preprocessed AND postprocessed at this time, we show the
    // preprocess state. If any files are being uploaded we show uploading.


    if (progress.preprocess && state !== uploadStates.STATE_UPLOADING) {
      state = uploadStates.STATE_PREPROCESSING;
    } // If NO files are being preprocessed or uploaded right now, but some files are
    // being postprocessed, show the postprocess state.


    if (progress.postprocess && state !== uploadStates.STATE_UPLOADING && state !== uploadStates.STATE_PREPROCESSING) {
      state = uploadStates.STATE_POSTPROCESSING;
    }
  }

  return state;
}

function UploadStatus(props) {
  const uploadingState = getUploadingState(props.isAllErrored, props.isAllComplete, props.isAllPaused, props.files);

  switch (uploadingState) {
    case 'uploading':
      return props.i18n('uploadingXFiles', {
        smart_count: props.inProgressNotPausedFiles.length
      });

    case 'preprocessing':
    case 'postprocessing':
      return props.i18n('processingXFiles', {
        smart_count: props.processingFiles.length
      });

    case 'paused':
      return props.i18n('uploadPaused');

    case 'waiting':
      return props.i18n('xFilesSelected', {
        smart_count: props.newFiles.length
      });

    case 'complete':
      return props.i18n('uploadComplete');
  }
}

function PanelTopBar(props) {
  let {
    allowNewUpload
  } = props; // TODO maybe this should be done in ../index.js, then just pass that down as `allowNewUpload`

  if (allowNewUpload && props.maxNumberOfFiles) {
    allowNewUpload = props.totalFileCount < props.maxNumberOfFiles;
  }

  return h("div", {
    className: "uppy-DashboardContent-bar"
  }, !props.isAllComplete && !props.hideCancelButton ? h("button", {
    className: "uppy-DashboardContent-back",
    type: "button",
    onClick: () => props.uppy.cancelAll()
  }, props.i18n('cancel')) : h("div", null), h("div", {
    className: "uppy-DashboardContent-title",
    role: "heading",
    "aria-level": "1"
  }, h(UploadStatus, props)), allowNewUpload ? h("button", {
    className: "uppy-DashboardContent-addMore",
    type: "button",
    "aria-label": props.i18n('addMoreFiles'),
    title: props.i18n('addMoreFiles'),
    onClick: () => props.toggleAddFilesPanel(true)
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "15",
    height: "15",
    viewBox: "0 0 15 15"
  }, h("path", {
    d: "M8 6.5h6a.5.5 0 0 1 .5.5v.5a.5.5 0 0 1-.5.5H8v6a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V8h-6a.5.5 0 0 1-.5-.5V7a.5.5 0 0 1 .5-.5h6v-6A.5.5 0 0 1 7 0h.5a.5.5 0 0 1 .5.5v6z"
  })), h("span", {
    className: "uppy-DashboardContent-addMoreCaption"
  }, props.i18n('addMore'))) : h("div", null));
}

module.exports = PanelTopBar;

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/Slide.js":
/*!**************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/Slide.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  cloneElement,
  Component,
  toChildArray
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const classNames = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");

const transitionName = 'uppy-transition-slideDownUp';
const duration = 250;
/**
 * Vertical slide transition.
 *
 * This can take a _single_ child component, which _must_ accept a `className` prop.
 *
 * Currently this is specific to the `uppy-transition-slideDownUp` transition,
 * but it should be simple to extend this for any type of single-element
 * transition by setting the CSS name and duration as props.
 */

class Slide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cachedChildren: null,
      className: ''
    };
  } // TODO: refactor to stable lifecycle method
  // eslint-disable-next-line


  componentWillUpdate(nextProps) {
    const {
      cachedChildren
    } = this.state;
    const child = toChildArray(nextProps.children)[0];
    if (cachedChildren === child) return null;
    const patch = {
      cachedChildren: child
    }; // Enter transition

    if (child && !cachedChildren) {
      patch.className = `${transitionName}-enter`;
      cancelAnimationFrame(this.animationFrame);
      clearTimeout(this.leaveTimeout);
      this.leaveTimeout = undefined;
      this.animationFrame = requestAnimationFrame(() => {
        // Force it to render before we add the active class
        // this.base.getBoundingClientRect()
        this.setState({
          className: `${transitionName}-enter ${transitionName}-enter-active`
        });
        this.enterTimeout = setTimeout(() => {
          this.setState({
            className: ''
          });
        }, duration);
      });
    } // Leave transition


    if (cachedChildren && !child && this.leaveTimeout === undefined) {
      patch.cachedChildren = cachedChildren;
      patch.className = `${transitionName}-leave`;
      cancelAnimationFrame(this.animationFrame);
      clearTimeout(this.enterTimeout);
      this.enterTimeout = undefined;
      this.animationFrame = requestAnimationFrame(() => {
        this.setState({
          className: `${transitionName}-leave ${transitionName}-leave-active`
        });
        this.leaveTimeout = setTimeout(() => {
          this.setState({
            cachedChildren: null,
            className: ''
          });
        }, duration);
      });
    } // eslint-disable-next-line


    this.setState(patch);
  }

  render() {
    const {
      cachedChildren,
      className
    } = this.state;

    if (!cachedChildren) {
      return null;
    }

    return cloneElement(cachedChildren, {
      className: classNames(className, cachedChildren.props.className)
    });
  }

}

module.exports = Slide;

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/VirtualList.js":
/*!********************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/VirtualList.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * Adapted from preact-virtual-list: https://github.com/developit/preact-virtual-list
 *
 * © 2016 Jason Miller
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Adaptations:
 * - Added role=presentation to helper elements
 * - Tweaked styles for Uppy's Dashboard use case
 */
const {
  h,
  Component
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const STYLE_INNER = {
  position: 'relative',
  // Disabled for our use case: the wrapper elements around FileList already deal with overflow,
  // and this additional property would hide things that we want to show.
  //
  // overflow: 'hidden',
  width: '100%',
  minHeight: '100%'
};
const STYLE_CONTENT = {
  position: 'absolute',
  top: 0,
  left: 0,
  // Because the `top` value gets set to some offset, this `height` being 100% would make the scrollbar
  // stretch far beyond the content. For our use case, the content div actually can get its height from
  // the elements inside it, so we don't need to specify a `height` property at all.
  //
  // height: '100%',
  width: '100%',
  overflow: 'visible'
};

class VirtualList extends Component {
  constructor(props) {
    super(props); // The currently focused node, used to retain focus when the visible rows change.
    // To avoid update loops, this should not cause state updates, so it's kept as a plain property.

    this.handleScroll = () => {
      this.setState({
        offset: this.base.scrollTop
      });
    };

    this.handleResize = () => {
      this.resize();
    };

    this.focusElement = null;
    this.state = {
      offset: 0,
      height: 0
    };
  }

  componentDidMount() {
    this.resize();
    window.addEventListener('resize', this.handleResize);
  } // TODO: refactor to stable lifecycle method
  // eslint-disable-next-line


  componentWillUpdate() {
    if (this.base.contains(document.activeElement)) {
      this.focusElement = document.activeElement;
    }
  }

  componentDidUpdate() {
    // Maintain focus when rows are added and removed.
    if (this.focusElement && this.focusElement.parentNode && document.activeElement !== this.focusElement) {
      this.focusElement.focus();
    }

    this.focusElement = null;
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  resize() {
    const {
      height
    } = this.state;

    if (height !== this.base.offsetHeight) {
      this.setState({
        height: this.base.offsetHeight
      });
    }
  }

  render(_ref) {
    let {
      data,
      rowHeight,
      renderRow,
      overscanCount = 10,
      ...props
    } = _ref;
    const {
      offset,
      height
    } = this.state; // first visible row index

    let start = Math.floor(offset / rowHeight); // actual number of visible rows (without overscan)

    let visibleRowCount = Math.floor(height / rowHeight); // Overscan: render blocks of rows modulo an overscan row count
    // This dramatically reduces DOM writes during scrolling

    if (overscanCount) {
      start = Math.max(0, start - start % overscanCount);
      visibleRowCount += overscanCount;
    } // last visible + overscan row index + padding to allow keyboard focus to travel past the visible area


    const end = start + visibleRowCount + 4; // data slice currently in viewport plus overscan items

    const selection = data.slice(start, end);
    const styleInner = { ...STYLE_INNER,
      height: data.length * rowHeight
    };
    const styleContent = { ...STYLE_CONTENT,
      top: start * rowHeight
    }; // The `role="presentation"` attributes ensure that these wrapper elements are not treated as list
    // items by accessibility and outline tools.

    return h("div", _extends({
      onScroll: this.handleScroll
    }, props), h("div", {
      role: "presentation",
      style: styleInner
    }, h("div", {
      role: "presentation",
      style: styleContent
    }, selection.map(renderRow))));
  }

}

module.exports = VirtualList;

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/index.js":
/*!***************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/index.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _class, _openFileEditorWhenFilesAdded, _attachRenderFunctionToTarget, _isTargetSupported, _getAcquirers, _getProgressIndicators, _getEditors, _temp;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const {
  UIPlugin
} = __webpack_require__(/*! @uppy/core */ "./node_modules/@uppy/core/lib/index.js");

const StatusBar = __webpack_require__(/*! @uppy/status-bar */ "./node_modules/@uppy/status-bar/lib/index.js");

const Informer = __webpack_require__(/*! @uppy/informer */ "./node_modules/@uppy/informer/lib/index.js");

const ThumbnailGenerator = __webpack_require__(/*! @uppy/thumbnail-generator */ "./node_modules/@uppy/thumbnail-generator/lib/index.js");

const findAllDOMElements = __webpack_require__(/*! @uppy/utils/lib/findAllDOMElements */ "./node_modules/@uppy/utils/lib/findAllDOMElements.js");

const toArray = __webpack_require__(/*! @uppy/utils/lib/toArray */ "./node_modules/@uppy/utils/lib/toArray.js");

const getDroppedFiles = __webpack_require__(/*! @uppy/utils/lib/getDroppedFiles */ "./node_modules/@uppy/utils/lib/getDroppedFiles/index.js");

const getTextDirection = __webpack_require__(/*! @uppy/utils/lib/getTextDirection */ "./node_modules/@uppy/utils/lib/getTextDirection.js");

const {
  nanoid
} = __webpack_require__(/*! nanoid/non-secure */ "./node_modules/nanoid/non-secure/index.cjs");

const trapFocus = __webpack_require__(/*! ./utils/trapFocus */ "./node_modules/@uppy/dashboard/lib/utils/trapFocus.js");

const createSuperFocus = __webpack_require__(/*! ./utils/createSuperFocus */ "./node_modules/@uppy/dashboard/lib/utils/createSuperFocus.js");

const memoize = (__webpack_require__(/*! memoize-one */ "./node_modules/memoize-one/dist/memoize-one.esm.js")["default"]) || __webpack_require__(/*! memoize-one */ "./node_modules/memoize-one/dist/memoize-one.esm.js");

const FOCUSABLE_ELEMENTS = __webpack_require__(/*! @uppy/utils/lib/FOCUSABLE_ELEMENTS */ "./node_modules/@uppy/utils/lib/FOCUSABLE_ELEMENTS.js");

const DashboardUI = __webpack_require__(/*! ./components/Dashboard */ "./node_modules/@uppy/dashboard/lib/components/Dashboard.js");

const locale = __webpack_require__(/*! ./locale */ "./node_modules/@uppy/dashboard/lib/locale.js");

const TAB_KEY = 9;
const ESC_KEY = 27;

function createPromise() {
  const o = {};
  o.promise = new Promise((resolve, reject) => {
    o.resolve = resolve;
    o.reject = reject;
  });
  return o;
}

function defaultPickerIcon() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    width: "30",
    height: "30",
    viewBox: "0 0 30 30"
  }, h("path", {
    d: "M15 30c8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15C6.716 0 0 6.716 0 15c0 8.284 6.716 15 15 15zm4.258-12.676v6.846h-8.426v-6.846H5.204l9.82-12.364 9.82 12.364H19.26z"
  }));
}
/**
 * Dashboard UI with previews, metadata editing, tabs for various services and more
 */


module.exports = (_temp = (_openFileEditorWhenFilesAdded = /*#__PURE__*/_classPrivateFieldLooseKey("openFileEditorWhenFilesAdded"), _attachRenderFunctionToTarget = /*#__PURE__*/_classPrivateFieldLooseKey("attachRenderFunctionToTarget"), _isTargetSupported = /*#__PURE__*/_classPrivateFieldLooseKey("isTargetSupported"), _getAcquirers = /*#__PURE__*/_classPrivateFieldLooseKey("getAcquirers"), _getProgressIndicators = /*#__PURE__*/_classPrivateFieldLooseKey("getProgressIndicators"), _getEditors = /*#__PURE__*/_classPrivateFieldLooseKey("getEditors"), _class = class Dashboard extends UIPlugin {
  constructor(uppy, _opts) {
    var _this;

    super(uppy, _opts);
    _this = this;

    this.removeTarget = plugin => {
      const pluginState = this.getPluginState(); // filter out the one we want to remove

      const newTargets = pluginState.targets.filter(target => target.id !== plugin.id);
      this.setPluginState({
        targets: newTargets
      });
    };

    this.addTarget = plugin => {
      const callerPluginId = plugin.id || plugin.constructor.name;
      const callerPluginName = plugin.title || callerPluginId;
      const callerPluginType = plugin.type;

      if (callerPluginType !== 'acquirer' && callerPluginType !== 'progressindicator' && callerPluginType !== 'editor') {
        const msg = 'Dashboard: can only be targeted by plugins of types: acquirer, progressindicator, editor';
        this.uppy.log(msg, 'error');
        return;
      }

      const target = {
        id: callerPluginId,
        name: callerPluginName,
        type: callerPluginType
      };
      const state = this.getPluginState();
      const newTargets = state.targets.slice();
      newTargets.push(target);
      this.setPluginState({
        targets: newTargets
      });
      return this.el;
    };

    this.hideAllPanels = () => {
      const state = this.getPluginState();
      const update = {
        activePickerPanel: false,
        showAddFilesPanel: false,
        activeOverlayType: null,
        fileCardFor: null,
        showFileEditor: false
      };

      if (state.activePickerPanel === update.activePickerPanel && state.showAddFilesPanel === update.showAddFilesPanel && state.showFileEditor === update.showFileEditor && state.activeOverlayType === update.activeOverlayType) {
        // avoid doing a state update if nothing changed
        return;
      }

      this.setPluginState(update);
    };

    this.showPanel = id => {
      const {
        targets
      } = this.getPluginState();
      const activePickerPanel = targets.filter(target => {
        return target.type === 'acquirer' && target.id === id;
      })[0];
      this.setPluginState({
        activePickerPanel,
        activeOverlayType: 'PickerPanel'
      });
    };

    this.canEditFile = file => {
      const {
        targets
      } = this.getPluginState();

      const editors = _classPrivateFieldLooseBase(this, _getEditors)[_getEditors](targets);

      return editors.some(target => this.uppy.getPlugin(target.id).canEditFile(file));
    };

    this.openFileEditor = file => {
      const {
        targets
      } = this.getPluginState();

      const editors = _classPrivateFieldLooseBase(this, _getEditors)[_getEditors](targets);

      this.setPluginState({
        showFileEditor: true,
        fileCardFor: file.id || null,
        activeOverlayType: 'FileEditor'
      });
      editors.forEach(editor => {
        this.uppy.getPlugin(editor.id).selectFile(file);
      });
    };

    this.saveFileEditor = () => {
      const {
        targets
      } = this.getPluginState();

      const editors = _classPrivateFieldLooseBase(this, _getEditors)[_getEditors](targets);

      editors.forEach(editor => {
        this.uppy.getPlugin(editor.id).save();
      });
      this.hideAllPanels();
    };

    this.openModal = () => {
      const {
        promise,
        resolve
      } = createPromise(); // save scroll position

      this.savedScrollPosition = window.pageYOffset; // save active element, so we can restore focus when modal is closed

      this.savedActiveElement = document.activeElement;

      if (this.opts.disablePageScrollWhenModalOpen) {
        document.body.classList.add('uppy-Dashboard-isFixed');
      }

      if (this.opts.animateOpenClose && this.getPluginState().isClosing) {
        const handler = () => {
          this.setPluginState({
            isHidden: false
          });
          this.el.removeEventListener('animationend', handler, false);
          resolve();
        };

        this.el.addEventListener('animationend', handler, false);
      } else {
        this.setPluginState({
          isHidden: false
        });
        resolve();
      }

      if (this.opts.browserBackButtonClose) {
        this.updateBrowserHistory();
      } // handle ESC and TAB keys in modal dialog


      document.addEventListener('keydown', this.handleKeyDownInModal);
      this.uppy.emit('dashboard:modal-open');
      return promise;
    };

    this.closeModal = function (opts) {
      if (opts === void 0) {
        opts = {};
      }

      const {
        // Whether the modal is being closed by the user (`true`) or by other means (e.g. browser back button)
        manualClose = true
      } = opts;

      const {
        isHidden,
        isClosing
      } = _this.getPluginState();

      if (isHidden || isClosing) {
        // short-circuit if animation is ongoing
        return;
      }

      const {
        promise,
        resolve
      } = createPromise();

      if (_this.opts.disablePageScrollWhenModalOpen) {
        document.body.classList.remove('uppy-Dashboard-isFixed');
      }

      if (_this.opts.animateOpenClose) {
        _this.setPluginState({
          isClosing: true
        });

        const handler = () => {
          _this.setPluginState({
            isHidden: true,
            isClosing: false
          });

          _this.superFocus.cancel();

          _this.savedActiveElement.focus();

          _this.el.removeEventListener('animationend', handler, false);

          resolve();
        };

        _this.el.addEventListener('animationend', handler, false);
      } else {
        _this.setPluginState({
          isHidden: true
        });

        _this.superFocus.cancel();

        _this.savedActiveElement.focus();

        resolve();
      } // handle ESC and TAB keys in modal dialog


      document.removeEventListener('keydown', _this.handleKeyDownInModal);

      if (manualClose) {
        if (_this.opts.browserBackButtonClose) {
          var _history$state;

          // Make sure that the latest entry in the history state is our modal name
          // eslint-disable-next-line no-restricted-globals
          if ((_history$state = history.state) != null && _history$state[_this.modalName]) {
            // Go back in history to clear out the entry we created (ultimately closing the modal)
            // eslint-disable-next-line no-restricted-globals
            history.back();
          }
        }
      }

      _this.uppy.emit('dashboard:modal-closed');

      return promise;
    };

    this.isModalOpen = () => {
      return !this.getPluginState().isHidden || false;
    };

    this.requestCloseModal = () => {
      if (this.opts.onRequestCloseModal) {
        return this.opts.onRequestCloseModal();
      }

      return this.closeModal();
    };

    this.setDarkModeCapability = isDarkModeOn => {
      const {
        capabilities
      } = this.uppy.getState();
      this.uppy.setState({
        capabilities: { ...capabilities,
          darkMode: isDarkModeOn
        }
      });
    };

    this.handleSystemDarkModeChange = event => {
      const isDarkModeOnNow = event.matches;
      this.uppy.log(`[Dashboard] Dark mode is ${isDarkModeOnNow ? 'on' : 'off'}`);
      this.setDarkModeCapability(isDarkModeOnNow);
    };

    this.toggleFileCard = (show, fileID) => {
      const file = this.uppy.getFile(fileID);

      if (show) {
        this.uppy.emit('dashboard:file-edit-start', file);
      } else {
        this.uppy.emit('dashboard:file-edit-complete', file);
      }

      this.setPluginState({
        fileCardFor: show ? fileID : null,
        activeOverlayType: show ? 'FileCard' : null
      });
    };

    this.toggleAddFilesPanel = show => {
      this.setPluginState({
        showAddFilesPanel: show,
        activeOverlayType: show ? 'AddFiles' : null
      });
    };

    this.addFiles = files => {
      const descriptors = files.map(file => ({
        source: this.id,
        name: file.name,
        type: file.type,
        data: file,
        meta: {
          // path of the file relative to the ancestor directory the user selected.
          // e.g. 'docs/Old Prague/airbnb.pdf'
          relativePath: file.relativePath || null
        }
      }));

      try {
        this.uppy.addFiles(descriptors);
      } catch (err) {
        this.uppy.log(err);
      }
    };

    this.startListeningToResize = () => {
      // Watch for Dashboard container (`.uppy-Dashboard-inner`) resize
      // and update containerWidth/containerHeight in plugin state accordingly.
      // Emits first event on initialization.
      this.resizeObserver = new ResizeObserver(entries => {
        const uppyDashboardInnerEl = entries[0];
        const {
          width,
          height
        } = uppyDashboardInnerEl.contentRect;
        this.uppy.log(`[Dashboard] resized: ${width} / ${height}`, 'debug');
        this.setPluginState({
          containerWidth: width,
          containerHeight: height,
          areInsidesReadyToBeVisible: true
        });
      });
      this.resizeObserver.observe(this.el.querySelector('.uppy-Dashboard-inner')); // If ResizeObserver fails to emit an event telling us what size to use - default to the mobile view

      this.makeDashboardInsidesVisibleAnywayTimeout = setTimeout(() => {
        const pluginState = this.getPluginState();
        const isModalAndClosed = !this.opts.inline && pluginState.isHidden;

        if ( // if ResizeObserver hasn't yet fired,
        !pluginState.areInsidesReadyToBeVisible // and it's not due to the modal being closed
        && !isModalAndClosed) {
          this.uppy.log("[Dashboard] resize event didn't fire on time: defaulted to mobile layout", 'debug');
          this.setPluginState({
            areInsidesReadyToBeVisible: true
          });
        }
      }, 1000);
    };

    this.stopListeningToResize = () => {
      this.resizeObserver.disconnect();
      clearTimeout(this.makeDashboardInsidesVisibleAnywayTimeout);
    };

    this.recordIfFocusedOnUppyRecently = event => {
      if (this.el.contains(event.target)) {
        this.ifFocusedOnUppyRecently = true;
      } else {
        this.ifFocusedOnUppyRecently = false; // ___Why run this.superFocus.cancel here when it already runs in superFocusOnEachUpdate?
        //    Because superFocus is debounced, when we move from Uppy to some other element on the page,
        //    previously run superFocus sometimes hits and moves focus back to Uppy.

        this.superFocus.cancel();
      }
    };

    this.disableAllFocusableElements = disable => {
      const focusableNodes = toArray(this.el.querySelectorAll(FOCUSABLE_ELEMENTS));

      if (disable) {
        focusableNodes.forEach(node => {
          // save previous tabindex in a data-attribute, to restore when enabling
          const currentTabIndex = node.getAttribute('tabindex');

          if (currentTabIndex) {
            node.dataset.inertTabindex = currentTabIndex;
          }

          node.setAttribute('tabindex', '-1');
        });
      } else {
        focusableNodes.forEach(node => {
          if ('inertTabindex' in node.dataset) {
            node.setAttribute('tabindex', node.dataset.inertTabindex);
          } else {
            node.removeAttribute('tabindex');
          }
        });
      }

      this.dashboardIsDisabled = disable;
    };

    this.updateBrowserHistory = () => {
      var _history$state2;

      // Ensure history state does not already contain our modal name to avoid double-pushing
      // eslint-disable-next-line no-restricted-globals
      if (!((_history$state2 = history.state) != null && _history$state2[this.modalName])) {
        // Push to history so that the page is not lost on browser back button press
        // eslint-disable-next-line no-restricted-globals
        history.pushState({ // eslint-disable-next-line no-restricted-globals
          ...history.state,
          [this.modalName]: true
        }, '');
      } // Listen for back button presses


      window.addEventListener('popstate', this.handlePopState, false);
    };

    this.handlePopState = event => {
      var _event$state;

      // Close the modal if the history state no longer contains our modal name
      if (this.isModalOpen() && (!event.state || !event.state[this.modalName])) {
        this.closeModal({
          manualClose: false
        });
      } // When the browser back button is pressed and uppy is now the latest entry
      // in the history but the modal is closed, fix the history by removing the
      // uppy history entry.
      // This occurs when another entry is added into the history state while the
      // modal is open, and then the modal gets manually closed.
      // Solves PR #575 (https://github.com/transloadit/uppy/pull/575)


      if (!this.isModalOpen() && (_event$state = event.state) != null && _event$state[this.modalName]) {
        // eslint-disable-next-line no-restricted-globals
        history.back();
      }
    };

    this.handleKeyDownInModal = event => {
      // close modal on esc key press
      if (event.keyCode === ESC_KEY) this.requestCloseModal(event); // trap focus on tab key press

      if (event.keyCode === TAB_KEY) trapFocus.forModal(event, this.getPluginState().activeOverlayType, this.el);
    };

    this.handleClickOutside = () => {
      if (this.opts.closeModalOnClickOutside) this.requestCloseModal();
    };

    this.handlePaste = event => {
      // Let any acquirer plugin (Url/Webcam/etc.) handle pastes to the root
      this.uppy.iteratePlugins(plugin => {
        if (plugin.type === 'acquirer') {
          // Every Plugin with .type acquirer can define handleRootPaste(event)
          plugin.handleRootPaste == null ? void 0 : plugin.handleRootPaste(event);
        }
      }); // Add all dropped files

      const files = toArray(event.clipboardData.files);

      if (files.length > 0) {
        this.uppy.log('[Dashboard] Files pasted');
        this.addFiles(files);
      }
    };

    this.handleInputChange = event => {
      event.preventDefault();
      const files = toArray(event.target.files);

      if (files.length > 0) {
        this.uppy.log('[Dashboard] Files selected through input');
        this.addFiles(files);
      }
    };

    this.handleDragOver = event => {
      var _this$opts$onDragOver, _this$opts;

      event.preventDefault();
      event.stopPropagation(); // Check if some plugin can handle the datatransfer without files —
      // for instance, the Url plugin can import a url

      const canSomePluginHandleRootDrop = () => {
        let somePluginCanHandleRootDrop = true;
        this.uppy.iteratePlugins(plugin => {
          if (plugin.canHandleRootDrop != null && plugin.canHandleRootDrop(event)) {
            somePluginCanHandleRootDrop = true;
          }
        });
        return somePluginCanHandleRootDrop;
      }; // Check if the "type" of the datatransfer object includes files


      const doesEventHaveFiles = () => {
        const {
          types
        } = event.dataTransfer;
        return types.some(type => type === 'Files');
      }; // Deny drop, if no plugins can handle datatransfer, there are no files,
      // or when opts.disabled is set, or new uploads are not allowed


      const somePluginCanHandleRootDrop = canSomePluginHandleRootDrop(event);
      const hasFiles = doesEventHaveFiles(event);

      if (!somePluginCanHandleRootDrop && !hasFiles || this.opts.disabled // opts.disableLocalFiles should only be taken into account if no plugins
      // can handle the datatransfer
      || this.opts.disableLocalFiles && (hasFiles || !somePluginCanHandleRootDrop) || !this.uppy.getState().allowNewUpload) {
        event.dataTransfer.dropEffect = 'none';
        clearTimeout(this.removeDragOverClassTimeout);
        return;
      } // Add a small (+) icon on drop
      // (and prevent browsers from interpreting this as files being _moved_ into the
      // browser, https://github.com/transloadit/uppy/issues/1978).


      event.dataTransfer.dropEffect = 'copy';
      clearTimeout(this.removeDragOverClassTimeout);
      this.setPluginState({
        isDraggingOver: true
      });
      (_this$opts$onDragOver = (_this$opts = this.opts).onDragOver) == null ? void 0 : _this$opts$onDragOver.call(_this$opts, event);
    };

    this.handleDragLeave = event => {
      var _this$opts$onDragLeav, _this$opts2;

      event.preventDefault();
      event.stopPropagation();
      clearTimeout(this.removeDragOverClassTimeout); // Timeout against flickering, this solution is taken from drag-drop library.
      // Solution with 'pointer-events: none' didn't work across browsers.

      this.removeDragOverClassTimeout = setTimeout(() => {
        this.setPluginState({
          isDraggingOver: false
        });
      }, 50);
      (_this$opts$onDragLeav = (_this$opts2 = this.opts).onDragLeave) == null ? void 0 : _this$opts$onDragLeav.call(_this$opts2, event);
    };

    this.handleDrop = async event => {
      var _this$opts$onDrop, _this$opts3;

      event.preventDefault();
      event.stopPropagation();
      clearTimeout(this.removeDragOverClassTimeout);
      this.setPluginState({
        isDraggingOver: false
      }); // Let any acquirer plugin (Url/Webcam/etc.) handle drops to the root

      this.uppy.iteratePlugins(plugin => {
        if (plugin.type === 'acquirer') {
          // Every Plugin with .type acquirer can define handleRootDrop(event)
          plugin.handleRootDrop == null ? void 0 : plugin.handleRootDrop(event);
        }
      }); // Add all dropped files

      let executedDropErrorOnce = false;

      const logDropError = error => {
        this.uppy.log(error, 'error'); // In practice all drop errors are most likely the same,
        // so let's just show one to avoid overwhelming the user

        if (!executedDropErrorOnce) {
          this.uppy.info(error.message, 'error');
          executedDropErrorOnce = true;
        }
      }; // Add all dropped files


      const files = await getDroppedFiles(event.dataTransfer, {
        logDropError
      });

      if (files.length > 0) {
        this.uppy.log('[Dashboard] Files dropped');
        this.addFiles(files);
      }

      (_this$opts$onDrop = (_this$opts3 = this.opts).onDrop) == null ? void 0 : _this$opts$onDrop.call(_this$opts3, event);
    };

    this.handleRequestThumbnail = file => {
      if (!this.opts.waitForThumbnailsBeforeUpload) {
        this.uppy.emit('thumbnail:request', file);
      }
    };

    this.handleCancelThumbnail = file => {
      if (!this.opts.waitForThumbnailsBeforeUpload) {
        this.uppy.emit('thumbnail:cancel', file);
      }
    };

    this.handleKeyDownInInline = event => {
      // Trap focus on tab key press.
      if (event.keyCode === TAB_KEY) trapFocus.forInline(event, this.getPluginState().activeOverlayType, this.el);
    };

    this.handlePasteOnBody = event => {
      const isFocusInOverlay = this.el.contains(document.activeElement);

      if (isFocusInOverlay) {
        this.handlePaste(event);
      }
    };

    this.handleComplete = _ref => {
      let {
        failed
      } = _ref;

      if (this.opts.closeAfterFinish && failed.length === 0) {
        // All uploads are done
        this.requestCloseModal();
      }
    };

    this.handleCancelRestore = () => {
      this.uppy.emit('restore-canceled');
    };

    Object.defineProperty(this, _openFileEditorWhenFilesAdded, {
      writable: true,
      value: files => {
        const firstFile = files[0];

        if (this.canEditFile(firstFile)) {
          this.openFileEditor(firstFile);
        }
      }
    });

    this.initEvents = () => {
      // Modal open button
      if (this.opts.trigger && !this.opts.inline) {
        const showModalTrigger = findAllDOMElements(this.opts.trigger);

        if (showModalTrigger) {
          showModalTrigger.forEach(trigger => trigger.addEventListener('click', this.openModal));
        } else {
          this.uppy.log('Dashboard modal trigger not found. Make sure `trigger` is set in Dashboard options, unless you are planning to call `dashboard.openModal()` method yourself', 'warning');
        }
      }

      this.startListeningToResize();
      document.addEventListener('paste', this.handlePasteOnBody);
      this.uppy.on('plugin-remove', this.removeTarget);
      this.uppy.on('file-added', this.hideAllPanels);
      this.uppy.on('dashboard:modal-closed', this.hideAllPanels);
      this.uppy.on('file-editor:complete', this.hideAllPanels);
      this.uppy.on('complete', this.handleComplete); // ___Why fire on capture?
      //    Because this.ifFocusedOnUppyRecently needs to change before onUpdate() fires.

      document.addEventListener('focus', this.recordIfFocusedOnUppyRecently, true);
      document.addEventListener('click', this.recordIfFocusedOnUppyRecently, true);

      if (this.opts.inline) {
        this.el.addEventListener('keydown', this.handleKeyDownInInline);
      }

      if (this.opts.autoOpenFileEditor) {
        this.uppy.on('files-added', _classPrivateFieldLooseBase(this, _openFileEditorWhenFilesAdded)[_openFileEditorWhenFilesAdded]);
      }
    };

    this.removeEvents = () => {
      const showModalTrigger = findAllDOMElements(this.opts.trigger);

      if (!this.opts.inline && showModalTrigger) {
        showModalTrigger.forEach(trigger => trigger.removeEventListener('click', this.openModal));
      }

      this.stopListeningToResize();
      document.removeEventListener('paste', this.handlePasteOnBody);
      window.removeEventListener('popstate', this.handlePopState, false);
      this.uppy.off('plugin-remove', this.removeTarget);
      this.uppy.off('file-added', this.hideAllPanels);
      this.uppy.off('dashboard:modal-closed', this.hideAllPanels);
      this.uppy.off('file-editor:complete', this.hideAllPanels);
      this.uppy.off('complete', this.handleComplete);
      document.removeEventListener('focus', this.recordIfFocusedOnUppyRecently);
      document.removeEventListener('click', this.recordIfFocusedOnUppyRecently);

      if (this.opts.inline) {
        this.el.removeEventListener('keydown', this.handleKeyDownInInline);
      }

      if (this.opts.autoOpenFileEditor) {
        this.uppy.off('files-added', _classPrivateFieldLooseBase(this, _openFileEditorWhenFilesAdded)[_openFileEditorWhenFilesAdded]);
      }
    };

    this.superFocusOnEachUpdate = () => {
      const isFocusInUppy = this.el.contains(document.activeElement); // When focus is lost on the page (== focus is on body for most browsers, or focus is null for IE11)

      const isFocusNowhere = document.activeElement === document.body || document.activeElement === null;
      const isInformerHidden = this.uppy.getState().info.length === 0;
      const isModal = !this.opts.inline;

      if ( // If update is connected to showing the Informer - let the screen reader calmly read it.
      isInformerHidden && ( // If we are in a modal - always superfocus without concern for other elements
      // on the page (user is unlikely to want to interact with the rest of the page)
      isModal // If we are already inside of Uppy, or
      || isFocusInUppy // If we are not focused on anything BUT we have already, at least once, focused on uppy
      //   1. We focus when isFocusNowhere, because when the element we were focused
      //      on disappears (e.g. an overlay), - focus gets lost. If user is typing
      //      something somewhere else on the page, - focus won't be 'nowhere'.
      //   2. We only focus when focus is nowhere AND this.ifFocusedOnUppyRecently,
      //      to avoid focus jumps if we do something else on the page.
      //   [Practical check] Without '&& this.ifFocusedOnUppyRecently', in Safari, in inline mode,
      //                     when file is uploading, - navigate via tab to the checkbox,
      //                     try to press space multiple times. Focus will jump to Uppy.
      || isFocusNowhere && this.ifFocusedOnUppyRecently)) {
        this.superFocus(this.el, this.getPluginState().activeOverlayType);
      } else {
        this.superFocus.cancel();
      }
    };

    this.afterUpdate = () => {
      if (this.opts.disabled && !this.dashboardIsDisabled) {
        this.disableAllFocusableElements(true);
        return;
      }

      if (!this.opts.disabled && this.dashboardIsDisabled) {
        this.disableAllFocusableElements(false);
      }

      this.superFocusOnEachUpdate();
    };

    this.saveFileCard = (meta, fileID) => {
      this.uppy.setFileMeta(fileID, meta);
      this.toggleFileCard(false, fileID);
    };

    Object.defineProperty(this, _attachRenderFunctionToTarget, {
      writable: true,
      value: target => {
        const plugin = this.uppy.getPlugin(target.id);
        return { ...target,
          icon: plugin.icon || this.opts.defaultPickerIcon,
          render: plugin.render
        };
      }
    });
    Object.defineProperty(this, _isTargetSupported, {
      writable: true,
      value: target => {
        const plugin = this.uppy.getPlugin(target.id); // If the plugin does not provide a `supported` check, assume the plugin works everywhere.

        if (typeof plugin.isSupported !== 'function') {
          return true;
        }

        return plugin.isSupported();
      }
    });
    Object.defineProperty(this, _getAcquirers, {
      writable: true,
      value: memoize(targets => {
        return targets.filter(target => target.type === 'acquirer' && _classPrivateFieldLooseBase(this, _isTargetSupported)[_isTargetSupported](target)).map(_classPrivateFieldLooseBase(this, _attachRenderFunctionToTarget)[_attachRenderFunctionToTarget]);
      })
    });
    Object.defineProperty(this, _getProgressIndicators, {
      writable: true,
      value: memoize(targets => {
        return targets.filter(target => target.type === 'progressindicator').map(_classPrivateFieldLooseBase(this, _attachRenderFunctionToTarget)[_attachRenderFunctionToTarget]);
      })
    });
    Object.defineProperty(this, _getEditors, {
      writable: true,
      value: memoize(targets => {
        return targets.filter(target => target.type === 'editor').map(_classPrivateFieldLooseBase(this, _attachRenderFunctionToTarget)[_attachRenderFunctionToTarget]);
      })
    });

    this.render = state => {
      const pluginState = this.getPluginState();
      const {
        files,
        capabilities,
        allowNewUpload
      } = state;
      const {
        newFiles,
        uploadStartedFiles,
        completeFiles,
        erroredFiles,
        inProgressFiles,
        inProgressNotPausedFiles,
        processingFiles,
        isUploadStarted,
        isAllComplete,
        isAllErrored,
        isAllPaused
      } = this.uppy.getObjectOfFilesPerState();

      const acquirers = _classPrivateFieldLooseBase(this, _getAcquirers)[_getAcquirers](pluginState.targets);

      const progressindicators = _classPrivateFieldLooseBase(this, _getProgressIndicators)[_getProgressIndicators](pluginState.targets);

      const editors = _classPrivateFieldLooseBase(this, _getEditors)[_getEditors](pluginState.targets);

      let theme;

      if (this.opts.theme === 'auto') {
        theme = capabilities.darkMode ? 'dark' : 'light';
      } else {
        theme = this.opts.theme;
      }

      if (['files', 'folders', 'both'].indexOf(this.opts.fileManagerSelectionType) < 0) {
        this.opts.fileManagerSelectionType = 'files'; // eslint-disable-next-line no-console

        console.warn(`Unsupported option for "fileManagerSelectionType". Using default of "${this.opts.fileManagerSelectionType}".`);
      }

      return DashboardUI({
        state,
        isHidden: pluginState.isHidden,
        files,
        newFiles,
        uploadStartedFiles,
        completeFiles,
        erroredFiles,
        inProgressFiles,
        inProgressNotPausedFiles,
        processingFiles,
        isUploadStarted,
        isAllComplete,
        isAllErrored,
        isAllPaused,
        totalFileCount: Object.keys(files).length,
        totalProgress: state.totalProgress,
        allowNewUpload,
        acquirers,
        theme,
        disabled: this.opts.disabled,
        disableLocalFiles: this.opts.disableLocalFiles,
        direction: this.opts.direction,
        activePickerPanel: pluginState.activePickerPanel,
        showFileEditor: pluginState.showFileEditor,
        saveFileEditor: this.saveFileEditor,
        disableAllFocusableElements: this.disableAllFocusableElements,
        animateOpenClose: this.opts.animateOpenClose,
        isClosing: pluginState.isClosing,
        progressindicators,
        editors,
        autoProceed: this.uppy.opts.autoProceed,
        id: this.id,
        closeModal: this.requestCloseModal,
        handleClickOutside: this.handleClickOutside,
        handleInputChange: this.handleInputChange,
        handlePaste: this.handlePaste,
        inline: this.opts.inline,
        showPanel: this.showPanel,
        hideAllPanels: this.hideAllPanels,
        i18n: this.i18n,
        i18nArray: this.i18nArray,
        uppy: this.uppy,
        note: this.opts.note,
        recoveredState: state.recoveredState,
        metaFields: pluginState.metaFields,
        resumableUploads: capabilities.resumableUploads || false,
        individualCancellation: capabilities.individualCancellation,
        isMobileDevice: capabilities.isMobileDevice,
        fileCardFor: pluginState.fileCardFor,
        toggleFileCard: this.toggleFileCard,
        toggleAddFilesPanel: this.toggleAddFilesPanel,
        showAddFilesPanel: pluginState.showAddFilesPanel,
        saveFileCard: this.saveFileCard,
        openFileEditor: this.openFileEditor,
        canEditFile: this.canEditFile,
        width: this.opts.width,
        height: this.opts.height,
        showLinkToFileUploadResult: this.opts.showLinkToFileUploadResult,
        fileManagerSelectionType: this.opts.fileManagerSelectionType,
        proudlyDisplayPoweredByUppy: this.opts.proudlyDisplayPoweredByUppy,
        hideCancelButton: this.opts.hideCancelButton,
        hideRetryButton: this.opts.hideRetryButton,
        hidePauseResumeButton: this.opts.hidePauseResumeButton,
        showRemoveButtonAfterComplete: this.opts.showRemoveButtonAfterComplete,
        containerWidth: pluginState.containerWidth,
        containerHeight: pluginState.containerHeight,
        areInsidesReadyToBeVisible: pluginState.areInsidesReadyToBeVisible,
        isTargetDOMEl: this.isTargetDOMEl,
        parentElement: this.el,
        allowedFileTypes: this.uppy.opts.restrictions.allowedFileTypes,
        maxNumberOfFiles: this.uppy.opts.restrictions.maxNumberOfFiles,
        requiredMetaFields: this.uppy.opts.restrictions.requiredMetaFields,
        showSelectedFiles: this.opts.showSelectedFiles,
        handleCancelRestore: this.handleCancelRestore,
        handleRequestThumbnail: this.handleRequestThumbnail,
        handleCancelThumbnail: this.handleCancelThumbnail,
        // drag props
        isDraggingOver: pluginState.isDraggingOver,
        handleDragOver: this.handleDragOver,
        handleDragLeave: this.handleDragLeave,
        handleDrop: this.handleDrop
      });
    };

    this.discoverProviderPlugins = () => {
      this.uppy.iteratePlugins(plugin => {
        if (plugin && !plugin.target && plugin.opts && plugin.opts.target === this.constructor) {
          this.addTarget(plugin);
        }
      });
    };

    this.install = () => {
      // Set default state for Dashboard
      this.setPluginState({
        isHidden: true,
        fileCardFor: null,
        activeOverlayType: null,
        showAddFilesPanel: false,
        activePickerPanel: false,
        showFileEditor: false,
        metaFields: this.opts.metaFields,
        targets: [],
        // We'll make them visible once .containerWidth is determined
        areInsidesReadyToBeVisible: false,
        isDraggingOver: false
      });
      const {
        inline,
        closeAfterFinish
      } = this.opts;

      if (inline && closeAfterFinish) {
        throw new Error('[Dashboard] `closeAfterFinish: true` cannot be used on an inline Dashboard, because an inline Dashboard cannot be closed at all. Either set `inline: false`, or disable the `closeAfterFinish` option.');
      }

      const {
        allowMultipleUploads,
        allowMultipleUploadBatches
      } = this.uppy.opts;

      if ((allowMultipleUploads || allowMultipleUploadBatches) && closeAfterFinish) {
        this.uppy.log('[Dashboard] When using `closeAfterFinish`, we recommended setting the `allowMultipleUploadBatches` option to `false` in the Uppy constructor. See https://uppy.io/docs/uppy/#allowMultipleUploads-true', 'warning');
      }

      const {
        target
      } = this.opts;

      if (target) {
        this.mount(target, this);
      }

      const plugins = this.opts.plugins || [];
      plugins.forEach(pluginID => {
        const plugin = this.uppy.getPlugin(pluginID);

        if (plugin) {
          plugin.mount(this, plugin);
        }
      });

      if (!this.opts.disableStatusBar) {
        this.uppy.use(StatusBar, {
          id: `${this.id}:StatusBar`,
          target: this,
          hideUploadButton: this.opts.hideUploadButton,
          hideRetryButton: this.opts.hideRetryButton,
          hidePauseResumeButton: this.opts.hidePauseResumeButton,
          hideCancelButton: this.opts.hideCancelButton,
          showProgressDetails: this.opts.showProgressDetails,
          hideAfterFinish: this.opts.hideProgressAfterFinish,
          locale: this.opts.locale,
          doneButtonHandler: this.opts.doneButtonHandler
        });
      }

      if (!this.opts.disableInformer) {
        this.uppy.use(Informer, {
          id: `${this.id}:Informer`,
          target: this
        });
      }

      if (!this.opts.disableThumbnailGenerator) {
        this.uppy.use(ThumbnailGenerator, {
          id: `${this.id}:ThumbnailGenerator`,
          thumbnailWidth: this.opts.thumbnailWidth,
          thumbnailHeight: this.opts.thumbnailHeight,
          thumbnailType: this.opts.thumbnailType,
          waitForThumbnailsBeforeUpload: this.opts.waitForThumbnailsBeforeUpload,
          // If we don't block on thumbnails, we can lazily generate them
          lazy: !this.opts.waitForThumbnailsBeforeUpload
        });
      } // Dark Mode / theme


      this.darkModeMediaQuery = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
      const isDarkModeOnFromTheStart = this.darkModeMediaQuery ? this.darkModeMediaQuery.matches : false;
      this.uppy.log(`[Dashboard] Dark mode is ${isDarkModeOnFromTheStart ? 'on' : 'off'}`);
      this.setDarkModeCapability(isDarkModeOnFromTheStart);

      if (this.opts.theme === 'auto') {
        this.darkModeMediaQuery.addListener(this.handleSystemDarkModeChange);
      }

      this.discoverProviderPlugins();
      this.initEvents();
    };

    this.uninstall = () => {
      if (!this.opts.disableInformer) {
        const informer = this.uppy.getPlugin(`${this.id}:Informer`); // Checking if this plugin exists, in case it was removed by uppy-core
        // before the Dashboard was.

        if (informer) this.uppy.removePlugin(informer);
      }

      if (!this.opts.disableStatusBar) {
        const statusBar = this.uppy.getPlugin(`${this.id}:StatusBar`);
        if (statusBar) this.uppy.removePlugin(statusBar);
      }

      if (!this.opts.disableThumbnailGenerator) {
        const thumbnail = this.uppy.getPlugin(`${this.id}:ThumbnailGenerator`);
        if (thumbnail) this.uppy.removePlugin(thumbnail);
      }

      const plugins = this.opts.plugins || [];
      plugins.forEach(pluginID => {
        const plugin = this.uppy.getPlugin(pluginID);
        if (plugin) plugin.unmount();
      });

      if (this.opts.theme === 'auto') {
        this.darkModeMediaQuery.removeListener(this.handleSystemDarkModeChange);
      }

      this.unmount();
      this.removeEvents();
    };

    this.id = this.opts.id || 'Dashboard';
    this.title = 'Dashboard';
    this.type = 'orchestrator';
    this.modalName = `uppy-Dashboard-${nanoid()}`;
    this.defaultLocale = locale; // set default options

    const defaultOptions = {
      target: 'body',
      metaFields: [],
      trigger: null,
      inline: false,
      width: 750,
      height: 550,
      thumbnailWidth: 280,
      thumbnailType: 'image/jpeg',
      waitForThumbnailsBeforeUpload: false,
      defaultPickerIcon,
      showLinkToFileUploadResult: false,
      showProgressDetails: false,
      hideUploadButton: false,
      hideCancelButton: false,
      hideRetryButton: false,
      hidePauseResumeButton: false,
      hideProgressAfterFinish: false,
      doneButtonHandler: () => {
        this.uppy.reset();
        this.requestCloseModal();
      },
      note: null,
      closeModalOnClickOutside: false,
      closeAfterFinish: false,
      disableStatusBar: false,
      disableInformer: false,
      disableThumbnailGenerator: false,
      disablePageScrollWhenModalOpen: true,
      animateOpenClose: true,
      fileManagerSelectionType: 'files',
      proudlyDisplayPoweredByUppy: true,
      onRequestCloseModal: () => this.closeModal(),
      showSelectedFiles: true,
      showRemoveButtonAfterComplete: false,
      browserBackButtonClose: false,
      theme: 'light',
      autoOpenFileEditor: false,
      disabled: false,
      disableLocalFiles: false
    }; // merge default options with the ones set by user

    this.opts = { ...defaultOptions,
      ..._opts
    };
    this.i18nInit();
    this.superFocus = createSuperFocus();
    this.ifFocusedOnUppyRecently = false; // Timeouts

    this.makeDashboardInsidesVisibleAnywayTimeout = null;
    this.removeDragOverClassTimeout = null;
  }

  onMount() {
    // Set the text direction if the page has not defined one.
    const element = this.el;
    const direction = getTextDirection(element);

    if (!direction) {
      element.dir = 'ltr';
    }
  }

}), _class.VERSION = "2.1.4", _temp);

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/locale.js":
/*!****************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/locale.js ***!
  \****************************************************/
/***/ ((module) => {

module.exports = {
  strings: {
    // When `inline: false`, used as the screen reader label for the button that closes the modal.
    closeModal: 'Close Modal',
    // Used as the screen reader label for the plus (+) button that shows the “Add more files” screen
    addMoreFiles: 'Add more files',
    addingMoreFiles: 'Adding more files',
    // Used as the header for import panels, e.g., “Import from Google Drive”.
    importFrom: 'Import from %{name}',
    // When `inline: false`, used as the screen reader label for the dashboard modal.
    dashboardWindowTitle: 'Uppy Dashboard Window (Press escape to close)',
    // When `inline: true`, used as the screen reader label for the dashboard area.
    dashboardTitle: 'Uppy Dashboard',
    // Shown in the Informer when a link to a file was copied to the clipboard.
    copyLinkToClipboardSuccess: 'Link copied to clipboard.',
    // Used when a link cannot be copied automatically — the user has to select the text from the
    // input element below this string.
    copyLinkToClipboardFallback: 'Copy the URL below',
    // Used as the hover title and screen reader label for buttons that copy a file link.
    copyLink: 'Copy link',
    back: 'Back',
    // Used as the screen reader label for buttons that remove a file.
    removeFile: 'Remove file',
    // Used as the screen reader label for buttons that open the metadata editor panel for a file.
    editFile: 'Edit file',
    // Shown in the panel header for the metadata editor. Rendered as “Editing image.png”.
    editing: 'Editing %{file}',
    // Used as the screen reader label for the button that saves metadata edits and returns to the
    // file list view.
    finishEditingFile: 'Finish editing file',
    saveChanges: 'Save changes',
    // Used as the label for the tab button that opens the system file selection dialog.
    myDevice: 'My Device',
    dropHint: 'Drop your files here',
    // Used as the hover text and screen reader label for file progress indicators when
    // they have been fully uploaded.
    uploadComplete: 'Upload complete',
    uploadPaused: 'Upload paused',
    // Used as the hover text and screen reader label for the buttons to resume paused uploads.
    resumeUpload: 'Resume upload',
    // Used as the hover text and screen reader label for the buttons to pause uploads.
    pauseUpload: 'Pause upload',
    // Used as the hover text and screen reader label for the buttons to retry failed uploads.
    retryUpload: 'Retry upload',
    // Used as the hover text and screen reader label for the buttons to cancel uploads.
    cancelUpload: 'Cancel upload',
    // Used in a title, how many files are currently selected
    xFilesSelected: {
      0: '%{smart_count} file selected',
      1: '%{smart_count} files selected'
    },
    uploadingXFiles: {
      0: 'Uploading %{smart_count} file',
      1: 'Uploading %{smart_count} files'
    },
    processingXFiles: {
      0: 'Processing %{smart_count} file',
      1: 'Processing %{smart_count} files'
    },
    // The "powered by Uppy" link at the bottom of the Dashboard.
    poweredBy: 'Powered by %{uppy}',
    addMore: 'Add more',
    editFileWithFilename: 'Edit file %{file}',
    save: 'Save',
    cancel: 'Cancel',
    dropPasteFiles: 'Drop files here or %{browseFiles}',
    dropPasteFolders: 'Drop files here or %{browseFolders}',
    dropPasteBoth: 'Drop files here, %{browseFiles} or %{browseFolders}',
    dropPasteImportFiles: 'Drop files here, %{browseFiles} or import from:',
    dropPasteImportFolders: 'Drop files here, %{browseFolders} or import from:',
    dropPasteImportBoth: 'Drop files here, %{browseFiles}, %{browseFolders} or import from:',
    importFiles: 'Import files from:',
    browseFiles: 'browse files',
    browseFolders: 'browse folders',
    recoveredXFiles: {
      0: 'We could not fully recover 1 file. Please re-select it and resume the upload.',
      1: 'We could not fully recover %{smart_count} files. Please re-select them and resume the upload.'
    },
    recoveredAllFiles: 'We restored all files. You can now resume the upload.',
    sessionRestored: 'Session restored',
    reSelect: 'Re-select',
    missingRequiredMetaFields: {
      0: 'Missing required meta field: %{fields}.',
      1: 'Missing required meta fields: %{fields}.'
    }
  }
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/utils/copyToClipboard.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/utils/copyToClipboard.js ***!
  \*******************************************************************/
/***/ ((module) => {

/**
 * Copies text to clipboard by creating an almost invisible textarea,
 * adding text there, then running execCommand('copy').
 * Falls back to prompt() when the easy way fails (hello, Safari!)
 * From http://stackoverflow.com/a/30810322
 *
 * @param {string} textToCopy
 * @param {string} fallbackString
 * @returns {Promise}
 */
module.exports = function copyToClipboard(textToCopy, fallbackString) {
  fallbackString = fallbackString || 'Copy the URL below';
  return new Promise(resolve => {
    const textArea = document.createElement('textarea');
    textArea.setAttribute('style', {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '2em',
      height: '2em',
      padding: 0,
      border: 'none',
      outline: 'none',
      boxShadow: 'none',
      background: 'transparent'
    });
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();

    const magicCopyFailed = () => {
      document.body.removeChild(textArea); // eslint-disable-next-line no-alert

      window.prompt(fallbackString, textToCopy);
      resolve();
    };

    try {
      const successful = document.execCommand('copy');

      if (!successful) {
        return magicCopyFailed('copy command unavailable');
      }

      document.body.removeChild(textArea);
      return resolve();
    } catch (err) {
      document.body.removeChild(textArea);
      return magicCopyFailed(err);
    }
  });
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/utils/createSuperFocus.js":
/*!********************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/utils/createSuperFocus.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const debounce = __webpack_require__(/*! lodash.debounce */ "./node_modules/lodash.debounce/index.js");

const FOCUSABLE_ELEMENTS = __webpack_require__(/*! @uppy/utils/lib/FOCUSABLE_ELEMENTS */ "./node_modules/@uppy/utils/lib/FOCUSABLE_ELEMENTS.js");

const getActiveOverlayEl = __webpack_require__(/*! ./getActiveOverlayEl */ "./node_modules/@uppy/dashboard/lib/utils/getActiveOverlayEl.js");
/*
  Focuses on some element in the currently topmost overlay.

  1. If there are some [data-uppy-super-focusable] elements rendered already - focuses
     on the first superfocusable element, and leaves focus up to the control of
     a user (until currently focused element disappears from the screen [which
     can happen when overlay changes, or, e.g., when we click on a folder in googledrive]).
  2. If there are no [data-uppy-super-focusable] elements yet (or ever) - focuses
     on the first focusable element, but switches focus if superfocusable elements appear on next render.
*/


module.exports = function createSuperFocus() {
  let lastFocusWasOnSuperFocusableEl = false;

  const superFocus = (dashboardEl, activeOverlayType) => {
    const overlayEl = getActiveOverlayEl(dashboardEl, activeOverlayType);
    const isFocusInOverlay = overlayEl.contains(document.activeElement); // If focus is already in the topmost overlay, AND on last update we focused on the superfocusable
    // element - then leave focus up to the user.
    // [Practical check] without this line, typing in the search input in googledrive overlay won't work.

    if (isFocusInOverlay && lastFocusWasOnSuperFocusableEl) return;
    const superFocusableEl = overlayEl.querySelector('[data-uppy-super-focusable]'); // If we are already in the topmost overlay, AND there are no super focusable elements yet, - leave focus up to the user.
    // [Practical check] without this line, if you are in an empty folder in google drive, and something's uploading in the
    // bg, - focus will be jumping to Done all the time.

    if (isFocusInOverlay && !superFocusableEl) return;

    if (superFocusableEl) {
      superFocusableEl.focus({
        preventScroll: true
      });
      lastFocusWasOnSuperFocusableEl = true;
    } else {
      const firstEl = overlayEl.querySelector(FOCUSABLE_ELEMENTS);
      firstEl == null ? void 0 : firstEl.focus({
        preventScroll: true
      });
      lastFocusWasOnSuperFocusableEl = false;
    }
  }; // ___Why do we need to debounce?
  //    1. To deal with animations: overlay changes via animations, which results in the DOM updating AFTER plugin.update()
  //       already executed.
  //    [Practical check] without debounce, if we open the Url overlay, and click 'Done', Dashboard won't get focused again.
  //    [Practical check] if we delay 250ms instead of 260ms - IE11 won't get focused in same situation.
  //    2. Performance: there can be many state update()s in a second, and this function is called every time.


  return debounce(superFocus, 260);
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/utils/getActiveOverlayEl.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/utils/getActiveOverlayEl.js ***!
  \**********************************************************************/
/***/ ((module) => {

/**
 * @returns {HTMLElement} - either dashboard element, or the overlay that's most on top
 */
module.exports = function getActiveOverlayEl(dashboardEl, activeOverlayType) {
  if (activeOverlayType) {
    const overlayEl = dashboardEl.querySelector(`[data-uppy-paneltype="${activeOverlayType}"]`); // if an overlay is already mounted

    if (overlayEl) return overlayEl;
  }

  return dashboardEl;
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/utils/getFileTypeIcon.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/utils/getFileTypeIcon.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

function iconImage() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    width: "25",
    height: "25",
    viewBox: "0 0 25 25"
  }, h("g", {
    fill: "#686DE0",
    fillRule: "evenodd"
  }, h("path", {
    d: "M5 7v10h15V7H5zm0-1h15a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z",
    fillRule: "nonzero"
  }), h("path", {
    d: "M6.35 17.172l4.994-5.026a.5.5 0 0 1 .707 0l2.16 2.16 3.505-3.505a.5.5 0 0 1 .707 0l2.336 2.31-.707.72-1.983-1.97-3.505 3.505a.5.5 0 0 1-.707 0l-2.16-2.159-3.938 3.939-1.409.026z",
    fillRule: "nonzero"
  }), h("circle", {
    cx: "7.5",
    cy: "9.5",
    r: "1.5"
  })));
}

function iconAudio() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "25",
    height: "25",
    viewBox: "0 0 25 25"
  }, h("path", {
    d: "M9.5 18.64c0 1.14-1.145 2-2.5 2s-2.5-.86-2.5-2c0-1.14 1.145-2 2.5-2 .557 0 1.079.145 1.5.396V7.25a.5.5 0 0 1 .379-.485l9-2.25A.5.5 0 0 1 18.5 5v11.64c0 1.14-1.145 2-2.5 2s-2.5-.86-2.5-2c0-1.14 1.145-2 2.5-2 .557 0 1.079.145 1.5.396V8.67l-8 2v7.97zm8-11v-2l-8 2v2l8-2zM7 19.64c.855 0 1.5-.484 1.5-1s-.645-1-1.5-1-1.5.484-1.5 1 .645 1 1.5 1zm9-2c.855 0 1.5-.484 1.5-1s-.645-1-1.5-1-1.5.484-1.5 1 .645 1 1.5 1z",
    fill: "#049BCF",
    fillRule: "nonzero"
  }));
}

function iconVideo() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "25",
    height: "25",
    viewBox: "0 0 25 25"
  }, h("path", {
    d: "M16 11.834l4.486-2.691A1 1 0 0 1 22 10v6a1 1 0 0 1-1.514.857L16 14.167V17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2.834zM15 9H5v8h10V9zm1 4l5 3v-6l-5 3z",
    fill: "#19AF67",
    fillRule: "nonzero"
  }));
}

function iconPDF() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "25",
    height: "25",
    viewBox: "0 0 25 25"
  }, h("path", {
    d: "M9.766 8.295c-.691-1.843-.539-3.401.747-3.726 1.643-.414 2.505.938 2.39 3.299-.039.79-.194 1.662-.537 3.148.324.49.66.967 1.055 1.51.17.231.382.488.629.757 1.866-.128 3.653.114 4.918.655 1.487.635 2.192 1.685 1.614 2.84-.566 1.133-1.839 1.084-3.416.249-1.141-.604-2.457-1.634-3.51-2.707a13.467 13.467 0 0 0-2.238.426c-1.392 4.051-4.534 6.453-5.707 4.572-.986-1.58 1.38-4.206 4.914-5.375.097-.322.185-.656.264-1.001.08-.353.306-1.31.407-1.737-.678-1.059-1.2-2.031-1.53-2.91zm2.098 4.87c-.033.144-.068.287-.104.427l.033-.01-.012.038a14.065 14.065 0 0 1 1.02-.197l-.032-.033.052-.004a7.902 7.902 0 0 1-.208-.271c-.197-.27-.38-.526-.555-.775l-.006.028-.002-.003c-.076.323-.148.632-.186.8zm5.77 2.978c1.143.605 1.832.632 2.054.187.26-.519-.087-1.034-1.113-1.473-.911-.39-2.175-.608-3.55-.608.845.766 1.787 1.459 2.609 1.894zM6.559 18.789c.14.223.693.16 1.425-.413.827-.648 1.61-1.747 2.208-3.206-2.563 1.064-4.102 2.867-3.633 3.62zm5.345-10.97c.088-1.793-.351-2.48-1.146-2.28-.473.119-.564 1.05-.056 2.405.213.566.52 1.188.908 1.859.18-.858.268-1.453.294-1.984z",
    fill: "#E2514A",
    fillRule: "nonzero"
  }));
}

function iconArchive() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    width: "25",
    height: "25",
    viewBox: "0 0 25 25"
  }, h("path", {
    d: "M10.45 2.05h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5V2.55a.5.5 0 0 1 .5-.5zm2.05 1.024h1.05a.5.5 0 0 1 .5.5V3.6a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5v-.001zM10.45 0h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5V.5a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.024a.5.5 0 0 1 .5-.5zm-2.05 3.074h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.024a.5.5 0 0 1 .5-.5zm-2.05 1.024h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm-2.05 1.025h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.024a.5.5 0 0 1 .5-.5zm-1.656 3.074l-.82 5.946c.52.302 1.174.458 1.976.458.803 0 1.455-.156 1.975-.458l-.82-5.946h-2.311zm0-1.025h2.312c.512 0 .946.378 1.015.885l.82 5.946c.056.412-.142.817-.501 1.026-.686.398-1.515.597-2.49.597-.974 0-1.804-.199-2.49-.597a1.025 1.025 0 0 1-.5-1.026l.819-5.946c.07-.507.503-.885 1.015-.885zm.545 6.6a.5.5 0 0 1-.397-.561l.143-.999a.5.5 0 0 1 .495-.429h.74a.5.5 0 0 1 .495.43l.143.998a.5.5 0 0 1-.397.561c-.404.08-.819.08-1.222 0z",
    fill: "#00C469",
    fillRule: "nonzero"
  }));
}

function iconFile() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "25",
    height: "25",
    viewBox: "0 0 25 25"
  }, h("g", {
    fill: "#A7AFB7",
    fillRule: "nonzero"
  }, h("path", {
    d: "M5.5 22a.5.5 0 0 1-.5-.5v-18a.5.5 0 0 1 .5-.5h10.719a.5.5 0 0 1 .367.16l3.281 3.556a.5.5 0 0 1 .133.339V21.5a.5.5 0 0 1-.5.5h-14zm.5-1h13V7.25L16 4H6v17z"
  }), h("path", {
    d: "M15 4v3a1 1 0 0 0 1 1h3V7h-3V4h-1z"
  })));
}

function iconText() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "25",
    height: "25",
    viewBox: "0 0 25 25"
  }, h("path", {
    d: "M4.5 7h13a.5.5 0 1 1 0 1h-13a.5.5 0 0 1 0-1zm0 3h15a.5.5 0 1 1 0 1h-15a.5.5 0 1 1 0-1zm0 3h15a.5.5 0 1 1 0 1h-15a.5.5 0 1 1 0-1zm0 3h10a.5.5 0 1 1 0 1h-10a.5.5 0 1 1 0-1z",
    fill: "#5A5E69",
    fillRule: "nonzero"
  }));
}

module.exports = function getIconByMime(fileType) {
  const defaultChoice = {
    color: '#838999',
    icon: iconFile()
  };
  if (!fileType) return defaultChoice;
  const fileTypeGeneral = fileType.split('/')[0];
  const fileTypeSpecific = fileType.split('/')[1]; // Text

  if (fileTypeGeneral === 'text') {
    return {
      color: '#5a5e69',
      icon: iconText()
    };
  } // Image


  if (fileTypeGeneral === 'image') {
    return {
      color: '#686de0',
      icon: iconImage()
    };
  } // Audio


  if (fileTypeGeneral === 'audio') {
    return {
      color: '#068dbb',
      icon: iconAudio()
    };
  } // Video


  if (fileTypeGeneral === 'video') {
    return {
      color: '#19af67',
      icon: iconVideo()
    };
  } // PDF


  if (fileTypeGeneral === 'application' && fileTypeSpecific === 'pdf') {
    return {
      color: '#e25149',
      icon: iconPDF()
    };
  } // Archive


  const archiveTypes = ['zip', 'x-7z-compressed', 'x-rar-compressed', 'x-tar', 'x-gzip', 'x-apple-diskimage'];

  if (fileTypeGeneral === 'application' && archiveTypes.indexOf(fileTypeSpecific) !== -1) {
    return {
      color: '#00C469',
      icon: iconArchive()
    };
  }

  return defaultChoice;
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/utils/ignoreEvent.js":
/*!***************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/utils/ignoreEvent.js ***!
  \***************************************************************/
/***/ ((module) => {

// ignore drop/paste events if they are not in input or textarea —
// otherwise when Url plugin adds drop/paste listeners to this.el,
// draging UI elements or pasting anything into any field triggers those events —
// Url treats them as URLs that need to be imported
function ignoreEvent(ev) {
  const {
    tagName
  } = ev.target;

  if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
    ev.stopPropagation();
    return;
  }

  ev.preventDefault();
  ev.stopPropagation();
}

module.exports = ignoreEvent;

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/utils/trapFocus.js":
/*!*************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/utils/trapFocus.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const toArray = __webpack_require__(/*! @uppy/utils/lib/toArray */ "./node_modules/@uppy/utils/lib/toArray.js");

const FOCUSABLE_ELEMENTS = __webpack_require__(/*! @uppy/utils/lib/FOCUSABLE_ELEMENTS */ "./node_modules/@uppy/utils/lib/FOCUSABLE_ELEMENTS.js");

const getActiveOverlayEl = __webpack_require__(/*! ./getActiveOverlayEl */ "./node_modules/@uppy/dashboard/lib/utils/getActiveOverlayEl.js");

function focusOnFirstNode(event, nodes) {
  const node = nodes[0];

  if (node) {
    node.focus();
    event.preventDefault();
  }
}

function focusOnLastNode(event, nodes) {
  const node = nodes[nodes.length - 1];

  if (node) {
    node.focus();
    event.preventDefault();
  }
} // ___Why not just use (focusedItemIndex === -1)?
//    Firefox thinks <ul> is focusable, but we don't have <ul>s in our FOCUSABLE_ELEMENTS. Which means that if we tab into
//    the <ul>, code will think that we are not in the active overlay, and we should focusOnFirstNode() of the currently
//    active overlay!
//    [Practical check] if we use (focusedItemIndex === -1), instagram provider in firefox will never get focus on its pics
//    in the <ul>.


function isFocusInOverlay(activeOverlayEl) {
  return activeOverlayEl.contains(document.activeElement);
}

function trapFocus(event, activeOverlayType, dashboardEl) {
  const activeOverlayEl = getActiveOverlayEl(dashboardEl, activeOverlayType);
  const focusableNodes = toArray(activeOverlayEl.querySelectorAll(FOCUSABLE_ELEMENTS));
  const focusedItemIndex = focusableNodes.indexOf(document.activeElement); // If we pressed tab, and focus is not yet within the current overlay - focus on
  // the first element within the current overlay.
  // This is a safety measure (for when user returns from another tab e.g.), most
  // plugins will try to focus on some important element as it loads.

  if (!isFocusInOverlay(activeOverlayEl)) {
    focusOnFirstNode(event, focusableNodes); // If we pressed shift + tab, and we're on the first element of a modal
  } else if (event.shiftKey && focusedItemIndex === 0) {
    focusOnLastNode(event, focusableNodes); // If we pressed tab, and we're on the last element of the modal
  } else if (!event.shiftKey && focusedItemIndex === focusableNodes.length - 1) {
    focusOnFirstNode(event, focusableNodes);
  }
}

module.exports = {
  // Traps focus inside of the currently open overlay (e.g. Dashboard, or e.g. Instagram),
  // never lets focus disappear from the modal.
  forModal: (event, activeOverlayType, dashboardEl) => {
    trapFocus(event, activeOverlayType, dashboardEl);
  },
  // Traps focus inside of the currently open overlay, unless overlay is null - then let the user tab away.
  forInline: (event, activeOverlayType, dashboardEl) => {
    // ___When we're in the bare 'Drop files here, paste, browse or import from' screen
    if (activeOverlayType === null) {// Do nothing and let the browser handle it, user can tab away from Uppy to other elements on the page
      // ___When there is some overlay with 'Done' button
    } else {
      // Trap the focus inside this overlay!
      // User can close the overlay (click 'Done') if they want to travel away from Uppy.
      trapFocus(event, activeOverlayType, dashboardEl);
    }
  }
};

/***/ }),

/***/ "./node_modules/@uppy/informer/lib/FadeIn.js":
/*!***************************************************!*\
  !*** ./node_modules/@uppy/informer/lib/FadeIn.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const {
  h,
  Component,
  createRef
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const TRANSITION_MS = 300;
module.exports = class FadeIn extends Component {
  constructor() {
    super(...arguments);
    this.ref = createRef();
  }

  componentWillEnter(callback) {
    this.ref.current.style.opacity = '1';
    this.ref.current.style.transform = 'none';
    setTimeout(callback, TRANSITION_MS);
  }

  componentWillLeave(callback) {
    this.ref.current.style.opacity = '0';
    this.ref.current.style.transform = 'translateY(350%)';
    setTimeout(callback, TRANSITION_MS);
  }

  render() {
    const {
      children
    } = this.props;
    return h("div", {
      className: "uppy-Informer-animated",
      ref: this.ref
    }, children);
  }

};

/***/ }),

/***/ "./node_modules/@uppy/informer/lib/TransitionGroup.js":
/*!************************************************************!*\
  !*** ./node_modules/@uppy/informer/lib/TransitionGroup.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* eslint-disable */

/**
 * @source https://github.com/developit/preact-transition-group
 */


const {
  Component,
  cloneElement,
  h,
  toChildArray
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

function assign(obj, props) {
  return Object.assign(obj, props);
}

function getKey(vnode, fallback) {
  var _vnode$key;

  return (_vnode$key = vnode == null ? void 0 : vnode.key) != null ? _vnode$key : fallback;
}

function linkRef(component, name) {
  const cache = component._ptgLinkedRefs || (component._ptgLinkedRefs = {});
  return cache[name] || (cache[name] = c => {
    component.refs[name] = c;
  });
}

function getChildMapping(children) {
  const out = {};

  for (let i = 0; i < children.length; i++) {
    if (children[i] != null) {
      const key = getKey(children[i], i.toString(36));
      out[key] = children[i];
    }
  }

  return out;
}

function mergeChildMappings(prev, next) {
  prev = prev || {};
  next = next || {};

  const getValueForKey = key => next.hasOwnProperty(key) ? next[key] : prev[key]; // For each key of `next`, the list of keys to insert before that key in
  // the combined list


  const nextKeysPending = {};
  let pendingKeys = [];

  for (const prevKey in prev) {
    if (next.hasOwnProperty(prevKey)) {
      if (pendingKeys.length) {
        nextKeysPending[prevKey] = pendingKeys;
        pendingKeys = [];
      }
    } else {
      pendingKeys.push(prevKey);
    }
  }

  const childMapping = {};

  for (const nextKey in next) {
    if (nextKeysPending.hasOwnProperty(nextKey)) {
      for (let i = 0; i < nextKeysPending[nextKey].length; i++) {
        const pendingNextKey = nextKeysPending[nextKey][i];
        childMapping[nextKeysPending[nextKey][i]] = getValueForKey(pendingNextKey);
      }
    }

    childMapping[nextKey] = getValueForKey(nextKey);
  } // Finally, add the keys which didn't appear before any key in `next`


  for (let i = 0; i < pendingKeys.length; i++) {
    childMapping[pendingKeys[i]] = getValueForKey(pendingKeys[i]);
  }

  return childMapping;
}

const identity = i => i;

class TransitionGroup extends Component {
  constructor(props, context) {
    super(props, context);
    this.refs = {};
    this.state = {
      children: getChildMapping(toChildArray(toChildArray(this.props.children)) || [])
    };
    this.performAppear = this.performAppear.bind(this);
    this.performEnter = this.performEnter.bind(this);
    this.performLeave = this.performLeave.bind(this);
  }

  componentWillMount() {
    this.currentlyTransitioningKeys = {};
    this.keysToAbortLeave = [];
    this.keysToEnter = [];
    this.keysToLeave = [];
  }

  componentDidMount() {
    const initialChildMapping = this.state.children;

    for (const key in initialChildMapping) {
      if (initialChildMapping[key]) {
        // this.performAppear(getKey(initialChildMapping[key], key));
        this.performAppear(key);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const nextChildMapping = getChildMapping(toChildArray(nextProps.children) || []);
    const prevChildMapping = this.state.children;
    this.setState(prevState => ({
      children: mergeChildMappings(prevState.children, nextChildMapping)
    }));
    let key;

    for (key in nextChildMapping) {
      if (nextChildMapping.hasOwnProperty(key)) {
        const hasPrev = prevChildMapping && prevChildMapping.hasOwnProperty(key); // We should re-enter the component and abort its leave function

        if (nextChildMapping[key] && hasPrev && this.currentlyTransitioningKeys[key]) {
          this.keysToEnter.push(key);
          this.keysToAbortLeave.push(key);
        } else if (nextChildMapping[key] && !hasPrev && !this.currentlyTransitioningKeys[key]) {
          this.keysToEnter.push(key);
        }
      }
    }

    for (key in prevChildMapping) {
      if (prevChildMapping.hasOwnProperty(key)) {
        const hasNext = nextChildMapping && nextChildMapping.hasOwnProperty(key);

        if (prevChildMapping[key] && !hasNext && !this.currentlyTransitioningKeys[key]) {
          this.keysToLeave.push(key);
        }
      }
    }
  }

  componentDidUpdate() {
    const {
      keysToEnter
    } = this;
    this.keysToEnter = [];
    keysToEnter.forEach(this.performEnter);
    const {
      keysToLeave
    } = this;
    this.keysToLeave = [];
    keysToLeave.forEach(this.performLeave);
  }

  _finishAbort(key) {
    const idx = this.keysToAbortLeave.indexOf(key);

    if (idx !== -1) {
      this.keysToAbortLeave.splice(idx, 1);
    }
  }

  performAppear(key) {
    this.currentlyTransitioningKeys[key] = true;
    const component = this.refs[key];

    if (component.componentWillAppear) {
      component.componentWillAppear(this._handleDoneAppearing.bind(this, key));
    } else {
      this._handleDoneAppearing(key);
    }
  }

  _handleDoneAppearing(key) {
    const component = this.refs[key];

    if (component.componentDidAppear) {
      component.componentDidAppear();
    }

    delete this.currentlyTransitioningKeys[key];

    this._finishAbort(key);

    const currentChildMapping = getChildMapping(toChildArray(this.props.children) || []);

    if (!currentChildMapping || !currentChildMapping.hasOwnProperty(key)) {
      // This was removed before it had fully appeared. Remove it.
      this.performLeave(key);
    }
  }

  performEnter(key) {
    this.currentlyTransitioningKeys[key] = true;
    const component = this.refs[key];

    if (component.componentWillEnter) {
      component.componentWillEnter(this._handleDoneEntering.bind(this, key));
    } else {
      this._handleDoneEntering(key);
    }
  }

  _handleDoneEntering(key) {
    const component = this.refs[key];

    if (component.componentDidEnter) {
      component.componentDidEnter();
    }

    delete this.currentlyTransitioningKeys[key];

    this._finishAbort(key);

    const currentChildMapping = getChildMapping(toChildArray(this.props.children) || []);

    if (!currentChildMapping || !currentChildMapping.hasOwnProperty(key)) {
      // This was removed before it had fully entered. Remove it.
      this.performLeave(key);
    }
  }

  performLeave(key) {
    // If we should immediately abort this leave function,
    // don't run the leave transition at all.
    const idx = this.keysToAbortLeave.indexOf(key);

    if (idx !== -1) {
      return;
    }

    this.currentlyTransitioningKeys[key] = true;
    const component = this.refs[key];

    if (component.componentWillLeave) {
      component.componentWillLeave(this._handleDoneLeaving.bind(this, key));
    } else {
      // Note that this is somewhat dangerous b/c it calls setState()
      // again, effectively mutating the component before all the work
      // is done.
      this._handleDoneLeaving(key);
    }
  }

  _handleDoneLeaving(key) {
    // If we should immediately abort the leave,
    // then skip this altogether
    const idx = this.keysToAbortLeave.indexOf(key);

    if (idx !== -1) {
      return;
    }

    const component = this.refs[key];

    if (component.componentDidLeave) {
      component.componentDidLeave();
    }

    delete this.currentlyTransitioningKeys[key];
    const currentChildMapping = getChildMapping(toChildArray(this.props.children) || []);

    if (currentChildMapping && currentChildMapping.hasOwnProperty(key)) {
      // This entered again before it fully left. Add it again.
      this.performEnter(key);
    } else {
      const children = assign({}, this.state.children);
      delete children[key];
      this.setState({
        children
      });
    }
  }

  render(_ref, _ref2) {
    let {
      childFactory,
      transitionLeave,
      transitionName,
      transitionAppear,
      transitionEnter,
      transitionLeaveTimeout,
      transitionEnterTimeout,
      transitionAppearTimeout,
      component,
      ...props
    } = _ref;
    let {
      children
    } = _ref2;
    // TODO: we could get rid of the need for the wrapper node
    // by cloning a single child
    const childrenToRender = [];

    for (const key in children) {
      if (children.hasOwnProperty(key)) {
        const child = children[key];

        if (child) {
          const ref = linkRef(this, key),
                el = cloneElement(childFactory(child), {
            ref,
            key
          });
          childrenToRender.push(el);
        }
      }
    }

    return h(component, props, childrenToRender);
  }

}

TransitionGroup.defaultProps = {
  component: 'span',
  childFactory: identity
};
module.exports = TransitionGroup;

/***/ }),

/***/ "./node_modules/@uppy/informer/lib/index.js":
/*!**************************************************!*\
  !*** ./node_modules/@uppy/informer/lib/index.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _class, _temp;

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions  */

/* eslint-disable jsx-a11y/click-events-have-key-events */
const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const {
  UIPlugin
} = __webpack_require__(/*! @uppy/core */ "./node_modules/@uppy/core/lib/index.js");

const FadeIn = __webpack_require__(/*! ./FadeIn */ "./node_modules/@uppy/informer/lib/FadeIn.js");

const TransitionGroup = __webpack_require__(/*! ./TransitionGroup */ "./node_modules/@uppy/informer/lib/TransitionGroup.js");
/**
 * Informer
 * Shows rad message bubbles
 * used like this: `uppy.info('hello world', 'info', 5000)`
 * or for errors: `uppy.info('Error uploading img.jpg', 'error', 5000)`
 *
 */


module.exports = (_temp = _class = class Informer extends UIPlugin {
  // eslint-disable-next-line global-require
  constructor(uppy, opts) {
    super(uppy, opts);

    this.render = state => {
      return h("div", {
        className: "uppy uppy-Informer"
      }, h(TransitionGroup, null, state.info.map(info => h(FadeIn, {
        key: info.message
      }, h("p", {
        role: "alert"
      }, info.message, ' ', info.details && h("span", {
        "aria-label": info.details,
        "data-microtip-position": "top-left",
        "data-microtip-size": "medium",
        role: "tooltip" // eslint-disable-next-line no-alert
        ,
        onClick: () => alert(`${info.message} \n\n ${info.details}`)
      }, "?"))))));
    };

    this.type = 'progressindicator';
    this.id = this.opts.id || 'Informer';
    this.title = 'Informer'; // set default options

    const defaultOptions = {}; // merge default options with the ones set by user

    this.opts = { ...defaultOptions,
      ...opts
    };
  }

  install() {
    const {
      target
    } = this.opts;

    if (target) {
      this.mount(target, this);
    }
  }

}, _class.VERSION = "2.0.5", _temp);

/***/ }),

/***/ "./node_modules/@uppy/status-bar/lib/Components.js":
/*!*********************************************************!*\
  !*** ./node_modules/@uppy/status-bar/lib/Components.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const classNames = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");

const throttle = __webpack_require__(/*! lodash.throttle */ "./node_modules/lodash.throttle/index.js");

const prettierBytes = __webpack_require__(/*! @transloadit/prettier-bytes */ "./node_modules/@transloadit/prettier-bytes/prettierBytes.js");

const prettyETA = __webpack_require__(/*! @uppy/utils/lib/prettyETA */ "./node_modules/@uppy/utils/lib/prettyETA.js");

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const statusBarStates = __webpack_require__(/*! ./StatusBarStates */ "./node_modules/@uppy/status-bar/lib/StatusBarStates.js");

const DOT = `\u00B7`;

const renderDot = () => ` ${DOT} `;

function UploadBtn(props) {
  const {
    newFiles,
    isUploadStarted,
    recoveredState,
    i18n,
    uploadState,
    isSomeGhost,
    startUpload
  } = props;
  const uploadBtnClassNames = classNames('uppy-u-reset', 'uppy-c-btn', 'uppy-StatusBar-actionBtn', 'uppy-StatusBar-actionBtn--upload', {
    'uppy-c-btn-primary': uploadState === statusBarStates.STATE_WAITING
  }, {
    'uppy-StatusBar-actionBtn--disabled': isSomeGhost
  });
  const uploadBtnText = newFiles && isUploadStarted && !recoveredState ? i18n('uploadXNewFiles', {
    smart_count: newFiles
  }) : i18n('uploadXFiles', {
    smart_count: newFiles
  });
  return h("button", {
    type: "button",
    className: uploadBtnClassNames,
    "aria-label": i18n('uploadXFiles', {
      smart_count: newFiles
    }),
    onClick: startUpload,
    disabled: isSomeGhost,
    "data-uppy-super-focusable": true
  }, uploadBtnText);
}

function RetryBtn(props) {
  const {
    i18n,
    uppy
  } = props;
  return h("button", {
    type: "button",
    className: "uppy-u-reset uppy-c-btn uppy-StatusBar-actionBtn uppy-StatusBar-actionBtn--retry",
    "aria-label": i18n('retryUpload'),
    onClick: () => uppy.retryAll(),
    "data-uppy-super-focusable": true
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "8",
    height: "10",
    viewBox: "0 0 8 10"
  }, h("path", {
    d: "M4 2.408a2.75 2.75 0 1 0 2.75 2.75.626.626 0 0 1 1.25.018v.023a4 4 0 1 1-4-4.041V.25a.25.25 0 0 1 .389-.208l2.299 1.533a.25.25 0 0 1 0 .416l-2.3 1.533A.25.25 0 0 1 4 3.316v-.908z"
  })), i18n('retry'));
}

function CancelBtn(props) {
  const {
    i18n,
    uppy
  } = props;
  return h("button", {
    type: "button",
    className: "uppy-u-reset uppy-StatusBar-actionCircleBtn",
    title: i18n('cancel'),
    "aria-label": i18n('cancel'),
    onClick: () => uppy.cancelAll(),
    "data-cy": "cancel",
    "data-uppy-super-focusable": true
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16"
  }, h("g", {
    fill: "none",
    fillRule: "evenodd"
  }, h("circle", {
    fill: "#888",
    cx: "8",
    cy: "8",
    r: "8"
  }), h("path", {
    fill: "#FFF",
    d: "M9.283 8l2.567 2.567-1.283 1.283L8 9.283 5.433 11.85 4.15 10.567 6.717 8 4.15 5.433 5.433 4.15 8 6.717l2.567-2.567 1.283 1.283z"
  }))));
}

function PauseResumeButton(props) {
  const {
    isAllPaused,
    i18n,
    isAllComplete,
    resumableUploads,
    uppy
  } = props;
  const title = isAllPaused ? i18n('resume') : i18n('pause');

  function togglePauseResume() {
    if (isAllComplete) return null;

    if (!resumableUploads) {
      return uppy.cancelAll();
    }

    if (isAllPaused) {
      return uppy.resumeAll();
    }

    return uppy.pauseAll();
  }

  return h("button", {
    title: title,
    "aria-label": title,
    className: "uppy-u-reset uppy-StatusBar-actionCircleBtn",
    type: "button",
    onClick: togglePauseResume,
    "data-uppy-super-focusable": true
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16"
  }, h("g", {
    fill: "none",
    fillRule: "evenodd"
  }, h("circle", {
    fill: "#888",
    cx: "8",
    cy: "8",
    r: "8"
  }), h("path", {
    fill: "#FFF",
    d: isAllPaused ? 'M6 4.25L11.5 8 6 11.75z' : 'M5 4.5h2v7H5v-7zm4 0h2v7H9v-7z'
  }))));
}

function DoneBtn(props) {
  const {
    i18n,
    doneButtonHandler
  } = props;
  return h("button", {
    type: "button",
    className: "uppy-u-reset uppy-c-btn uppy-StatusBar-actionBtn uppy-StatusBar-actionBtn--done",
    onClick: doneButtonHandler,
    "data-uppy-super-focusable": true
  }, i18n('done'));
}

function LoadingSpinner() {
  return h("svg", {
    className: "uppy-StatusBar-spinner",
    "aria-hidden": "true",
    focusable: "false",
    width: "14",
    height: "14"
  }, h("path", {
    d: "M13.983 6.547c-.12-2.509-1.64-4.893-3.939-5.936-2.48-1.127-5.488-.656-7.556 1.094C.524 3.367-.398 6.048.162 8.562c.556 2.495 2.46 4.52 4.94 5.183 2.932.784 5.61-.602 7.256-3.015-1.493 1.993-3.745 3.309-6.298 2.868-2.514-.434-4.578-2.349-5.153-4.84a6.226 6.226 0 0 1 2.98-6.778C6.34.586 9.74 1.1 11.373 3.493c.407.596.693 1.282.842 1.988.127.598.073 1.197.161 1.794.078.525.543 1.257 1.15.864.525-.341.49-1.05.456-1.592-.007-.15.02.3 0 0",
    fillRule: "evenodd"
  }));
}

function ProgressBarProcessing(props) {
  const {
    progress
  } = props;
  const {
    value,
    mode,
    message
  } = progress;
  const roundedValue = Math.round(value * 100);
  const dot = `\u00B7`;
  return h("div", {
    className: "uppy-StatusBar-content"
  }, h(LoadingSpinner, null), mode === 'determinate' ? `${roundedValue}% ${dot} ` : '', message);
}

function ProgressDetails(props) {
  const {
    numUploads,
    complete,
    totalUploadedSize,
    totalSize,
    totalETA,
    i18n
  } = props;
  const ifShowFilesUploadedOfTotal = numUploads > 1;
  return h("div", {
    className: "uppy-StatusBar-statusSecondary"
  }, ifShowFilesUploadedOfTotal && i18n('filesUploadedOfTotal', {
    complete,
    smart_count: numUploads
  }), h("span", {
    className: "uppy-StatusBar-additionalInfo"
  }, ifShowFilesUploadedOfTotal && renderDot(), i18n('dataUploadedOfTotal', {
    complete: prettierBytes(totalUploadedSize),
    total: prettierBytes(totalSize)
  }), renderDot(), i18n('xTimeLeft', {
    time: prettyETA(totalETA)
  })));
}

function FileUploadCount(props) {
  const {
    i18n,
    complete,
    numUploads
  } = props;
  return h("div", {
    className: "uppy-StatusBar-statusSecondary"
  }, i18n('filesUploadedOfTotal', {
    complete,
    smart_count: numUploads
  }));
}

function UploadNewlyAddedFiles(props) {
  const {
    i18n,
    newFiles,
    startUpload
  } = props;
  const uploadBtnClassNames = classNames('uppy-u-reset', 'uppy-c-btn', 'uppy-StatusBar-actionBtn', 'uppy-StatusBar-actionBtn--uploadNewlyAdded');
  return h("div", {
    className: "uppy-StatusBar-statusSecondary"
  }, h("div", {
    className: "uppy-StatusBar-statusSecondaryHint"
  }, i18n('xMoreFilesAdded', {
    smart_count: newFiles
  })), h("button", {
    type: "button",
    className: uploadBtnClassNames,
    "aria-label": i18n('uploadXFiles', {
      smart_count: newFiles
    }),
    onClick: startUpload
  }, i18n('upload')));
}

const ThrottledProgressDetails = throttle(ProgressDetails, 500, {
  leading: true,
  trailing: true
});

function ProgressBarUploading(props) {
  const {
    i18n,
    supportsUploadProgress,
    totalProgress,
    showProgressDetails,
    isUploadStarted,
    isAllComplete,
    isAllPaused,
    newFiles,
    numUploads,
    complete,
    totalUploadedSize,
    totalSize,
    totalETA,
    startUpload
  } = props;
  const showUploadNewlyAddedFiles = newFiles && isUploadStarted;

  if (!isUploadStarted || isAllComplete) {
    return null;
  }

  const title = isAllPaused ? i18n('paused') : i18n('uploading');

  function renderProgressDetails() {
    if (!isAllPaused && !showUploadNewlyAddedFiles && showProgressDetails) {
      if (supportsUploadProgress) {
        return h(ThrottledProgressDetails, {
          numUploads: numUploads,
          complete: complete,
          totalUploadedSize: totalUploadedSize,
          totalSize: totalSize,
          totalETA: totalETA,
          i18n: i18n
        });
      }

      return h(FileUploadCount, {
        i18n: i18n,
        complete: complete,
        numUploads: numUploads
      });
    }

    return null;
  }

  return h("div", {
    className: "uppy-StatusBar-content",
    "aria-label": title,
    title: title
  }, !isAllPaused ? h(LoadingSpinner, null) : null, h("div", {
    className: "uppy-StatusBar-status"
  }, h("div", {
    className: "uppy-StatusBar-statusPrimary"
  }, supportsUploadProgress ? `${title}: ${totalProgress}%` : title), renderProgressDetails(), showUploadNewlyAddedFiles ? h(UploadNewlyAddedFiles, {
    i18n: i18n,
    newFiles: newFiles,
    startUpload: startUpload
  }) : null));
}

function ProgressBarComplete(props) {
  const {
    i18n
  } = props;
  return h("div", {
    className: "uppy-StatusBar-content",
    role: "status",
    title: i18n('complete')
  }, h("div", {
    className: "uppy-StatusBar-status"
  }, h("div", {
    className: "uppy-StatusBar-statusPrimary"
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-StatusBar-statusIndicator uppy-c-icon",
    width: "15",
    height: "11",
    viewBox: "0 0 15 11"
  }, h("path", {
    d: "M.414 5.843L1.627 4.63l3.472 3.472L13.202 0l1.212 1.213L5.1 10.528z"
  })), i18n('complete'))));
}

function ProgressBarError(props) {
  const {
    error,
    i18n,
    complete,
    numUploads
  } = props;

  function displayErrorAlert() {
    const errorMessage = `${i18n('uploadFailed')} \n\n ${error}`; // eslint-disable-next-line no-alert

    alert(errorMessage); // TODO: move to custom alert implementation
  }

  return h("div", {
    className: "uppy-StatusBar-content",
    title: i18n('uploadFailed')
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-StatusBar-statusIndicator uppy-c-icon",
    width: "11",
    height: "11",
    viewBox: "0 0 11 11"
  }, h("path", {
    d: "M4.278 5.5L0 1.222 1.222 0 5.5 4.278 9.778 0 11 1.222 6.722 5.5 11 9.778 9.778 11 5.5 6.722 1.222 11 0 9.778z"
  })), h("div", {
    className: "uppy-StatusBar-status"
  }, h("div", {
    className: "uppy-StatusBar-statusPrimary"
  }, i18n('uploadFailed'), h("button", {
    className: "uppy-u-reset uppy-StatusBar-details",
    "aria-label": i18n('showErrorDetails'),
    "data-microtip-position": "top-right",
    "data-microtip-size": "medium",
    onClick: displayErrorAlert,
    type: "button"
  }, "?")), h(FileUploadCount, {
    i18n: i18n,
    complete: complete,
    numUploads: numUploads
  })));
}

module.exports = {
  UploadBtn,
  RetryBtn,
  CancelBtn,
  PauseResumeButton,
  DoneBtn,
  LoadingSpinner,
  ProgressDetails,
  ProgressBarProcessing,
  ProgressBarError,
  ProgressBarUploading,
  ProgressBarComplete
};

/***/ }),

/***/ "./node_modules/@uppy/status-bar/lib/StatusBar.js":
/*!********************************************************!*\
  !*** ./node_modules/@uppy/status-bar/lib/StatusBar.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const classNames = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");

const statusBarStates = __webpack_require__(/*! ./StatusBarStates */ "./node_modules/@uppy/status-bar/lib/StatusBarStates.js");

const calculateProcessingProgress = __webpack_require__(/*! ./calculateProcessingProgress */ "./node_modules/@uppy/status-bar/lib/calculateProcessingProgress.js");

const {
  UploadBtn,
  RetryBtn,
  CancelBtn,
  PauseResumeButton,
  DoneBtn,
  ProgressBarProcessing,
  ProgressBarError,
  ProgressBarUploading,
  ProgressBarComplete
} = __webpack_require__(/*! ./Components */ "./node_modules/@uppy/status-bar/lib/Components.js");

const {
  STATE_ERROR,
  STATE_WAITING,
  STATE_PREPROCESSING,
  STATE_UPLOADING,
  STATE_POSTPROCESSING,
  STATE_COMPLETE
} = statusBarStates;
module.exports = StatusBar;

function StatusBar(props) {
  const {
    newFiles,
    allowNewUpload,
    isUploadInProgress,
    isAllPaused,
    resumableUploads,
    error,
    hideUploadButton,
    hidePauseResumeButton,
    hideCancelButton,
    hideRetryButton,
    recoveredState,
    uploadState,
    totalProgress,
    files,
    supportsUploadProgress,
    hideAfterFinish,
    isSomeGhost,
    isTargetDOMEl,
    doneButtonHandler,
    isUploadStarted,
    i18n,
    startUpload,
    uppy,
    isAllComplete,
    showProgressDetails,
    numUploads,
    complete,
    totalSize,
    totalETA,
    totalUploadedSize
  } = props;

  function getProgressValue() {
    switch (uploadState) {
      case STATE_POSTPROCESSING:
      case STATE_PREPROCESSING:
        {
          const progress = calculateProcessingProgress(files);

          if (progress.mode === 'determinate') {
            return progress.value * 100;
          }

          return totalProgress;
        }

      case STATE_ERROR:
        {
          return null;
        }

      case STATE_UPLOADING:
        {
          if (!supportsUploadProgress) {
            return null;
          }

          return totalProgress;
        }

      default:
        return totalProgress;
    }
  }

  function getIsIndeterminate() {
    switch (uploadState) {
      case STATE_POSTPROCESSING:
      case STATE_PREPROCESSING:
        {
          const {
            mode
          } = calculateProcessingProgress(files);
          return mode === 'indeterminate';
        }

      case STATE_UPLOADING:
        {
          if (!supportsUploadProgress) {
            return true;
          }

          return false;
        }

      default:
        return false;
    }
  }

  function getIsHidden() {
    if (recoveredState) {
      return false;
    }

    switch (uploadState) {
      case STATE_WAITING:
        return hideUploadButton || newFiles === 0;

      case STATE_COMPLETE:
        return hideAfterFinish;

      default:
        return false;
    }
  }

  const progressValue = getProgressValue();
  const isHidden = getIsHidden();
  const width = progressValue != null ? progressValue : 100;
  const showUploadBtn = !error && newFiles && !isUploadInProgress && !isAllPaused && allowNewUpload && !hideUploadButton;
  const showCancelBtn = !hideCancelButton && uploadState !== STATE_WAITING && uploadState !== STATE_COMPLETE;
  const showPauseResumeBtn = resumableUploads && !hidePauseResumeButton && uploadState === STATE_UPLOADING;
  const showRetryBtn = error && !isAllComplete && !hideRetryButton;
  const showDoneBtn = doneButtonHandler && uploadState === STATE_COMPLETE;
  const progressClassNames = classNames('uppy-StatusBar-progress', {
    'is-indeterminate': getIsIndeterminate()
  });
  const statusBarClassNames = classNames({
    'uppy-Root': isTargetDOMEl
  }, 'uppy-StatusBar', `is-${uploadState}`, {
    'has-ghosts': isSomeGhost
  });
  return h("div", {
    className: statusBarClassNames,
    "aria-hidden": isHidden
  }, h("div", {
    className: progressClassNames,
    style: {
      width: `${width}%`
    },
    role: "progressbar",
    "aria-label": `${width}%`,
    "aria-valuetext": `${width}%`,
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    "aria-valuenow": progressValue
  }), (() => {
    switch (uploadState) {
      case STATE_PREPROCESSING:
      case STATE_POSTPROCESSING:
        return h(ProgressBarProcessing, {
          progress: calculateProcessingProgress(files)
        });

      case STATE_COMPLETE:
        return h(ProgressBarComplete, {
          i18n: i18n
        });

      case STATE_ERROR:
        return h(ProgressBarError, {
          error: error,
          i18n: i18n,
          numUploads: numUploads,
          complete: complete
        });

      case STATE_UPLOADING:
        return h(ProgressBarUploading, {
          i18n: i18n,
          supportsUploadProgress: supportsUploadProgress,
          totalProgress: totalProgress,
          showProgressDetails: showProgressDetails,
          isUploadStarted: isUploadStarted,
          isAllComplete: isAllComplete,
          isAllPaused: isAllPaused,
          newFiles: newFiles,
          numUploads: numUploads,
          complete: complete,
          totalUploadedSize: totalUploadedSize,
          totalSize: totalSize,
          totalETA: totalETA,
          startUpload: startUpload
        });

      default:
        return null;
    }
  })(), h("div", {
    className: "uppy-StatusBar-actions"
  }, recoveredState || showUploadBtn ? h(UploadBtn, {
    newFiles: newFiles,
    isUploadStarted: isUploadStarted,
    recoveredState: recoveredState,
    i18n: i18n,
    isSomeGhost: isSomeGhost,
    startUpload: startUpload,
    uploadState: uploadState
  }) : null, showRetryBtn ? h(RetryBtn, {
    i18n: i18n,
    uppy: uppy
  }) : null, showPauseResumeBtn ? h(PauseResumeButton, {
    isAllPaused: isAllPaused,
    i18n: i18n,
    isAllComplete: isAllComplete,
    resumableUploads: resumableUploads,
    uppy: uppy
  }) : null, showCancelBtn ? h(CancelBtn, {
    i18n: i18n,
    uppy: uppy
  }) : null, showDoneBtn ? h(DoneBtn, {
    i18n: i18n,
    doneButtonHandler: doneButtonHandler
  }) : null));
}

/***/ }),

/***/ "./node_modules/@uppy/status-bar/lib/StatusBarStates.js":
/*!**************************************************************!*\
  !*** ./node_modules/@uppy/status-bar/lib/StatusBarStates.js ***!
  \**************************************************************/
/***/ ((module) => {

module.exports = {
  STATE_ERROR: 'error',
  STATE_WAITING: 'waiting',
  STATE_PREPROCESSING: 'preprocessing',
  STATE_UPLOADING: 'uploading',
  STATE_POSTPROCESSING: 'postprocessing',
  STATE_COMPLETE: 'complete'
};

/***/ }),

/***/ "./node_modules/@uppy/status-bar/lib/calculateProcessingProgress.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@uppy/status-bar/lib/calculateProcessingProgress.js ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = function calculateProcessingProgress(files) {
  const values = [];
  let mode;
  let message;

  for (const {
    progress
  } of Object.values(files)) {
    const {
      preprocess,
      postprocess
    } = progress; // In the future we should probably do this differently. For now we'll take the
    // mode and message from the first file…

    if (message == null && (preprocess || postprocess)) {
      ({
        mode,
        message
      } = preprocess || postprocess);
    }

    if ((preprocess == null ? void 0 : preprocess.mode) === 'determinate') values.push(preprocess.value);
    if ((postprocess == null ? void 0 : postprocess.mode) === 'determinate') values.push(postprocess.value);
  }

  const value = values.reduce((total, progressValue) => {
    return total + progressValue / values.length;
  }, 0);
  return {
    mode,
    message,
    value
  };
};

/***/ }),

/***/ "./node_modules/@uppy/status-bar/lib/index.js":
/*!****************************************************!*\
  !*** ./node_modules/@uppy/status-bar/lib/index.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _class, _temp;

const {
  UIPlugin
} = __webpack_require__(/*! @uppy/core */ "./node_modules/@uppy/core/lib/index.js");

const getSpeed = __webpack_require__(/*! @uppy/utils/lib/getSpeed */ "./node_modules/@uppy/utils/lib/getSpeed.js");

const getBytesRemaining = __webpack_require__(/*! @uppy/utils/lib/getBytesRemaining */ "./node_modules/@uppy/utils/lib/getBytesRemaining.js");

const getTextDirection = __webpack_require__(/*! @uppy/utils/lib/getTextDirection */ "./node_modules/@uppy/utils/lib/getTextDirection.js");

const statusBarStates = __webpack_require__(/*! ./StatusBarStates */ "./node_modules/@uppy/status-bar/lib/StatusBarStates.js");

const StatusBarUI = __webpack_require__(/*! ./StatusBar */ "./node_modules/@uppy/status-bar/lib/StatusBar.js");

const locale = __webpack_require__(/*! ./locale.js */ "./node_modules/@uppy/status-bar/lib/locale.js");
/**
 * StatusBar: renders a status bar with upload/pause/resume/cancel/retry buttons,
 * progress percentage and time remaining.
 */


module.exports = (_temp = _class = class StatusBar extends UIPlugin {
  // eslint-disable-next-line global-require
  constructor(uppy, opts) {
    super(uppy, opts);

    this.startUpload = () => {
      const {
        recoveredState
      } = this.uppy.getState();

      if (recoveredState) {
        this.uppy.emit('restore-confirmed');
        return undefined;
      }

      return this.uppy.upload().catch(() => {// Error logged in Core
      });
    };

    this.id = this.opts.id || 'StatusBar';
    this.title = 'StatusBar';
    this.type = 'progressindicator';
    this.defaultLocale = locale; // set default options

    const defaultOptions = {
      target: 'body',
      hideUploadButton: false,
      hideRetryButton: false,
      hidePauseResumeButton: false,
      hideCancelButton: false,
      showProgressDetails: false,
      hideAfterFinish: true,
      doneButtonHandler: null
    };
    this.opts = { ...defaultOptions,
      ...opts
    };
    this.i18nInit();
    this.render = this.render.bind(this);
    this.install = this.install.bind(this);
  }

  render(state) {
    const {
      capabilities,
      files,
      allowNewUpload,
      totalProgress,
      error,
      recoveredState
    } = state;
    const {
      newFiles,
      startedFiles,
      completeFiles,
      inProgressNotPausedFiles,
      isUploadStarted,
      isAllComplete,
      isAllErrored,
      isAllPaused,
      isUploadInProgress,
      isSomeGhost
    } = this.uppy.getObjectOfFilesPerState(); // If some state was recovered, we want to show Upload button/counter
    // for all the files, because in this case it’s not an Upload button,
    // but “Confirm Restore Button”

    const newFilesOrRecovered = recoveredState ? Object.values(files) : newFiles;
    const totalETA = getTotalETA(inProgressNotPausedFiles);
    const resumableUploads = !!capabilities.resumableUploads;
    const supportsUploadProgress = capabilities.uploadProgress !== false;
    let totalSize = 0;
    let totalUploadedSize = 0;
    startedFiles.forEach(file => {
      totalSize += file.progress.bytesTotal || 0;
      totalUploadedSize += file.progress.bytesUploaded || 0;
    });
    return StatusBarUI({
      error,
      uploadState: getUploadingState(error, isAllComplete, recoveredState, state.files || {}),
      allowNewUpload,
      totalProgress,
      totalSize,
      totalUploadedSize,
      isAllComplete: false,
      isAllPaused,
      isAllErrored,
      isUploadStarted,
      isUploadInProgress,
      isSomeGhost,
      recoveredState,
      complete: completeFiles.length,
      newFiles: newFilesOrRecovered.length,
      numUploads: startedFiles.length,
      totalETA,
      files,
      i18n: this.i18n,
      uppy: this.uppy,
      startUpload: this.startUpload,
      doneButtonHandler: this.opts.doneButtonHandler,
      resumableUploads,
      supportsUploadProgress,
      showProgressDetails: this.opts.showProgressDetails,
      hideUploadButton: this.opts.hideUploadButton,
      hideRetryButton: this.opts.hideRetryButton,
      hidePauseResumeButton: this.opts.hidePauseResumeButton,
      hideCancelButton: this.opts.hideCancelButton,
      hideAfterFinish: this.opts.hideAfterFinish,
      isTargetDOMEl: this.isTargetDOMEl
    });
  }

  onMount() {
    // Set the text direction if the page has not defined one.
    const element = this.el;
    const direction = getTextDirection(element);

    if (!direction) {
      element.dir = 'ltr';
    }
  }

  install() {
    const {
      target
    } = this.opts;

    if (target) {
      this.mount(target, this);
    }
  }

  uninstall() {
    this.unmount();
  }

}, _class.VERSION = "2.1.3", _temp);

function getTotalSpeed(files) {
  let totalSpeed = 0;
  files.forEach(file => {
    totalSpeed += getSpeed(file.progress);
  });
  return totalSpeed;
}

function getTotalETA(files) {
  const totalSpeed = getTotalSpeed(files);

  if (totalSpeed === 0) {
    return 0;
  }

  const totalBytesRemaining = files.reduce((total, file) => {
    return total + getBytesRemaining(file.progress);
  }, 0);
  return Math.round(totalBytesRemaining / totalSpeed * 10) / 10;
}

function getUploadingState(error, isAllComplete, recoveredState, files) {
  if (error && !isAllComplete) {
    return statusBarStates.STATE_ERROR;
  }

  if (isAllComplete) {
    return statusBarStates.STATE_COMPLETE;
  }

  if (recoveredState) {
    return statusBarStates.STATE_WAITING;
  }

  let state = statusBarStates.STATE_WAITING;
  const fileIDs = Object.keys(files);

  for (let i = 0; i < fileIDs.length; i++) {
    const {
      progress
    } = files[fileIDs[i]]; // If ANY files are being uploaded right now, show the uploading state.

    if (progress.uploadStarted && !progress.uploadComplete) {
      return statusBarStates.STATE_UPLOADING;
    } // If files are being preprocessed AND postprocessed at this time, we show the
    // preprocess state. If any files are being uploaded we show uploading.


    if (progress.preprocess && state !== statusBarStates.STATE_UPLOADING) {
      state = statusBarStates.STATE_PREPROCESSING;
    } // If NO files are being preprocessed or uploaded right now, but some files are
    // being postprocessed, show the postprocess state.


    if (progress.postprocess && state !== statusBarStates.STATE_UPLOADING && state !== statusBarStates.STATE_PREPROCESSING) {
      state = statusBarStates.STATE_POSTPROCESSING;
    }
  }

  return state;
}

/***/ }),

/***/ "./node_modules/@uppy/status-bar/lib/locale.js":
/*!*****************************************************!*\
  !*** ./node_modules/@uppy/status-bar/lib/locale.js ***!
  \*****************************************************/
/***/ ((module) => {

module.exports = {
  strings: {
    // Shown in the status bar while files are being uploaded.
    uploading: 'Uploading',
    // Shown in the status bar once all files have been uploaded.
    complete: 'Complete',
    // Shown in the status bar if an upload failed.
    uploadFailed: 'Upload failed',
    // Shown in the status bar while the upload is paused.
    paused: 'Paused',
    // Used as the label for the button that retries an upload.
    retry: 'Retry',
    // Used as the label for the button that cancels an upload.
    cancel: 'Cancel',
    // Used as the label for the button that pauses an upload.
    pause: 'Pause',
    // Used as the label for the button that resumes an upload.
    resume: 'Resume',
    // Used as the label for the button that resets the upload state after an upload
    done: 'Done',
    // When `showProgressDetails` is set, shows the number of files that have been fully uploaded so far.
    filesUploadedOfTotal: {
      0: '%{complete} of %{smart_count} file uploaded',
      1: '%{complete} of %{smart_count} files uploaded'
    },
    // When `showProgressDetails` is set, shows the amount of bytes that have been uploaded so far.
    dataUploadedOfTotal: '%{complete} of %{total}',
    // When `showProgressDetails` is set, shows an estimation of how long the upload will take to complete.
    xTimeLeft: '%{time} left',
    // Used as the label for the button that starts an upload.
    uploadXFiles: {
      0: 'Upload %{smart_count} file',
      1: 'Upload %{smart_count} files'
    },
    // Used as the label for the button that starts an upload, if another upload has been started in the past
    // and new files were added later.
    uploadXNewFiles: {
      0: 'Upload +%{smart_count} file',
      1: 'Upload +%{smart_count} files'
    },
    upload: 'Upload',
    retryUpload: 'Retry upload',
    xMoreFilesAdded: {
      0: '%{smart_count} more file added',
      1: '%{smart_count} more files added'
    },
    showErrorDetails: 'Show error details'
  }
};

/***/ }),

/***/ "./node_modules/@uppy/store-default/lib/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/@uppy/store-default/lib/index.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

var _publish = /*#__PURE__*/_classPrivateFieldLooseKey("publish");

/**
 * Default store that keeps state in a simple object.
 */
class DefaultStore {
  constructor() {
    Object.defineProperty(this, _publish, {
      value: _publish2
    });
    this.state = {};
    this.callbacks = [];
  }

  getState() {
    return this.state;
  }

  setState(patch) {
    const prevState = { ...this.state
    };
    const nextState = { ...this.state,
      ...patch
    };
    this.state = nextState;

    _classPrivateFieldLooseBase(this, _publish)[_publish](prevState, nextState, patch);
  }

  subscribe(listener) {
    this.callbacks.push(listener);
    return () => {
      // Remove the listener.
      this.callbacks.splice(this.callbacks.indexOf(listener), 1);
    };
  }

}

function _publish2() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  this.callbacks.forEach(listener => {
    listener(...args);
  });
}

DefaultStore.VERSION = "2.0.3";

module.exports = function defaultStore() {
  return new DefaultStore();
};

/***/ }),

/***/ "./node_modules/@uppy/thumbnail-generator/lib/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/@uppy/thumbnail-generator/lib/index.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _class, _temp;

const {
  UIPlugin
} = __webpack_require__(/*! @uppy/core */ "./node_modules/@uppy/core/lib/index.js");

const dataURItoBlob = __webpack_require__(/*! @uppy/utils/lib/dataURItoBlob */ "./node_modules/@uppy/utils/lib/dataURItoBlob.js");

const isObjectURL = __webpack_require__(/*! @uppy/utils/lib/isObjectURL */ "./node_modules/@uppy/utils/lib/isObjectURL.js");

const isPreviewSupported = __webpack_require__(/*! @uppy/utils/lib/isPreviewSupported */ "./node_modules/@uppy/utils/lib/isPreviewSupported.js");

const {
  rotation
} = __webpack_require__(/*! exifr/dist/mini.umd.js */ "./node_modules/exifr/dist/mini.umd.js");

const locale = __webpack_require__(/*! ./locale */ "./node_modules/@uppy/thumbnail-generator/lib/locale.js");
/**
 * The Thumbnail Generator plugin
 */


module.exports = (_temp = _class = class ThumbnailGenerator extends UIPlugin {
  constructor(uppy, opts) {
    super(uppy, opts);

    this.onFileAdded = file => {
      if (!file.preview && file.data && isPreviewSupported(file.type) && !file.isRemote) {
        this.addToQueue(file.id);
      }
    };

    this.onCancelRequest = file => {
      const index = this.queue.indexOf(file.id);

      if (index !== -1) {
        this.queue.splice(index, 1);
      }
    };

    this.onFileRemoved = file => {
      const index = this.queue.indexOf(file.id);

      if (index !== -1) {
        this.queue.splice(index, 1);
      } // Clean up object URLs.


      if (file.preview && isObjectURL(file.preview)) {
        URL.revokeObjectURL(file.preview);
      }
    };

    this.onRestored = () => {
      const restoredFiles = this.uppy.getFiles().filter(file => file.isRestored);
      restoredFiles.forEach(file => {
        // Only add blob URLs; they are likely invalid after being restored.
        if (!file.preview || isObjectURL(file.preview)) {
          this.addToQueue(file.id);
        }
      });
    };

    this.onAllFilesRemoved = () => {
      this.queue = [];
    };

    this.waitUntilAllProcessed = fileIDs => {
      fileIDs.forEach(fileID => {
        const file = this.uppy.getFile(fileID);
        this.uppy.emit('preprocess-progress', file, {
          mode: 'indeterminate',
          message: this.i18n('generatingThumbnails')
        });
      });

      const emitPreprocessCompleteForAll = () => {
        fileIDs.forEach(fileID => {
          const file = this.uppy.getFile(fileID);
          this.uppy.emit('preprocess-complete', file);
        });
      };

      return new Promise(resolve => {
        if (this.queueProcessing) {
          this.uppy.once('thumbnail:all-generated', () => {
            emitPreprocessCompleteForAll();
            resolve();
          });
        } else {
          emitPreprocessCompleteForAll();
          resolve();
        }
      });
    };

    this.type = 'modifier';
    this.id = this.opts.id || 'ThumbnailGenerator';
    this.title = 'Thumbnail Generator';
    this.queue = [];
    this.queueProcessing = false;
    this.defaultThumbnailDimension = 200;
    this.thumbnailType = this.opts.thumbnailType || 'image/jpeg';
    this.defaultLocale = locale;
    const defaultOptions = {
      thumbnailWidth: null,
      thumbnailHeight: null,
      waitForThumbnailsBeforeUpload: false,
      lazy: false
    };
    this.opts = { ...defaultOptions,
      ...opts
    };
    this.i18nInit();

    if (this.opts.lazy && this.opts.waitForThumbnailsBeforeUpload) {
      throw new Error('ThumbnailGenerator: The `lazy` and `waitForThumbnailsBeforeUpload` options are mutually exclusive. Please ensure at most one of them is set to `true`.');
    }
  }
  /**
   * Create a thumbnail for the given Uppy file object.
   *
   * @param {{data: Blob}} file
   * @param {number} targetWidth
   * @param {number} targetHeight
   * @returns {Promise}
   */


  createThumbnail(file, targetWidth, targetHeight) {
    const originalUrl = URL.createObjectURL(file.data);
    const onload = new Promise((resolve, reject) => {
      const image = new Image();
      image.src = originalUrl;
      image.addEventListener('load', () => {
        URL.revokeObjectURL(originalUrl);
        resolve(image);
      });
      image.addEventListener('error', event => {
        URL.revokeObjectURL(originalUrl);
        reject(event.error || new Error('Could not create thumbnail'));
      });
    });
    const orientationPromise = rotation(file.data).catch(() => 1);
    return Promise.all([onload, orientationPromise]).then(_ref => {
      let [image, orientation] = _ref;
      const dimensions = this.getProportionalDimensions(image, targetWidth, targetHeight, orientation.deg);
      const rotatedImage = this.rotateImage(image, orientation);
      const resizedImage = this.resizeImage(rotatedImage, dimensions.width, dimensions.height);
      return this.canvasToBlob(resizedImage, this.thumbnailType, 80);
    }).then(blob => {
      return URL.createObjectURL(blob);
    });
  }
  /**
   * Get the new calculated dimensions for the given image and a target width
   * or height. If both width and height are given, only width is taken into
   * account. If neither width nor height are given, the default dimension
   * is used.
   */


  getProportionalDimensions(img, width, height, rotation) {
    let aspect = img.width / img.height;

    if (rotation === 90 || rotation === 270) {
      aspect = img.height / img.width;
    }

    if (width != null) {
      return {
        width,
        height: Math.round(width / aspect)
      };
    }

    if (height != null) {
      return {
        width: Math.round(height * aspect),
        height
      };
    }

    return {
      width: this.defaultThumbnailDimension,
      height: Math.round(this.defaultThumbnailDimension / aspect)
    };
  }
  /**
   * Make sure the image doesn’t exceed browser/device canvas limits.
   * For ios with 256 RAM and ie
   */


  protect(image) {
    // https://stackoverflow.com/questions/6081483/maximum-size-of-a-canvas-element
    const ratio = image.width / image.height;
    const maxSquare = 5000000; // ios max canvas square

    const maxSize = 4096; // ie max canvas dimensions

    let maxW = Math.floor(Math.sqrt(maxSquare * ratio));
    let maxH = Math.floor(maxSquare / Math.sqrt(maxSquare * ratio));

    if (maxW > maxSize) {
      maxW = maxSize;
      maxH = Math.round(maxW / ratio);
    }

    if (maxH > maxSize) {
      maxH = maxSize;
      maxW = Math.round(ratio * maxH);
    }

    if (image.width > maxW) {
      const canvas = document.createElement('canvas');
      canvas.width = maxW;
      canvas.height = maxH;
      canvas.getContext('2d').drawImage(image, 0, 0, maxW, maxH);
      image = canvas;
    }

    return image;
  }
  /**
   * Resize an image to the target `width` and `height`.
   *
   * Returns a Canvas with the resized image on it.
   */


  resizeImage(image, targetWidth, targetHeight) {
    // Resizing in steps refactored to use a solution from
    // https://blog.uploadcare.com/image-resize-in-browsers-is-broken-e38eed08df01
    image = this.protect(image);
    let steps = Math.ceil(Math.log2(image.width / targetWidth));

    if (steps < 1) {
      steps = 1;
    }

    let sW = targetWidth * 2 ** (steps - 1);
    let sH = targetHeight * 2 ** (steps - 1);
    const x = 2;

    while (steps--) {
      const canvas = document.createElement('canvas');
      canvas.width = sW;
      canvas.height = sH;
      canvas.getContext('2d').drawImage(image, 0, 0, sW, sH);
      image = canvas;
      sW = Math.round(sW / x);
      sH = Math.round(sH / x);
    }

    return image;
  }

  rotateImage(image, translate) {
    let w = image.width;
    let h = image.height;

    if (translate.deg === 90 || translate.deg === 270) {
      w = image.height;
      h = image.width;
    }

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const context = canvas.getContext('2d');
    context.translate(w / 2, h / 2);

    if (translate.canvas) {
      context.rotate(translate.rad);
      context.scale(translate.scaleX, translate.scaleY);
    }

    context.drawImage(image, -image.width / 2, -image.height / 2, image.width, image.height);
    return canvas;
  }
  /**
   * Save a <canvas> element's content to a Blob object.
   *
   * @param {HTMLCanvasElement} canvas
   * @returns {Promise}
   */


  canvasToBlob(canvas, type, quality) {
    try {
      canvas.getContext('2d').getImageData(0, 0, 1, 1);
    } catch (err) {
      if (err.code === 18) {
        return Promise.reject(new Error('cannot read image, probably an svg with external resources'));
      }
    }

    if (canvas.toBlob) {
      return new Promise(resolve => {
        canvas.toBlob(resolve, type, quality);
      }).then(blob => {
        if (blob === null) {
          throw new Error('cannot read image, probably an svg with external resources');
        }

        return blob;
      });
    }

    return Promise.resolve().then(() => {
      return dataURItoBlob(canvas.toDataURL(type, quality), {});
    }).then(blob => {
      if (blob === null) {
        throw new Error('could not extract blob, probably an old browser');
      }

      return blob;
    });
  }
  /**
   * Set the preview URL for a file.
   */


  setPreviewURL(fileID, preview) {
    this.uppy.setFileState(fileID, {
      preview
    });
  }

  addToQueue(item) {
    this.queue.push(item);

    if (this.queueProcessing === false) {
      this.processQueue();
    }
  }

  processQueue() {
    this.queueProcessing = true;

    if (this.queue.length > 0) {
      const current = this.uppy.getFile(this.queue.shift());

      if (!current) {
        this.uppy.log('[ThumbnailGenerator] file was removed before a thumbnail could be generated, but not removed from the queue. This is probably a bug', 'error');
        return;
      }

      return this.requestThumbnail(current).catch(() => {}) // eslint-disable-line node/handle-callback-err
      .then(() => this.processQueue());
    }

    this.queueProcessing = false;
    this.uppy.log('[ThumbnailGenerator] Emptied thumbnail queue');
    this.uppy.emit('thumbnail:all-generated');
  }

  requestThumbnail(file) {
    if (isPreviewSupported(file.type) && !file.isRemote) {
      return this.createThumbnail(file, this.opts.thumbnailWidth, this.opts.thumbnailHeight).then(preview => {
        this.setPreviewURL(file.id, preview);
        this.uppy.log(`[ThumbnailGenerator] Generated thumbnail for ${file.id}`);
        this.uppy.emit('thumbnail:generated', this.uppy.getFile(file.id), preview);
      }).catch(err => {
        this.uppy.log(`[ThumbnailGenerator] Failed thumbnail for ${file.id}:`, 'warning');
        this.uppy.log(err, 'warning');
        this.uppy.emit('thumbnail:error', this.uppy.getFile(file.id), err);
      });
    }

    return Promise.resolve();
  }

  install() {
    this.uppy.on('file-removed', this.onFileRemoved);
    this.uppy.on('cancel-all', this.onAllFilesRemoved);

    if (this.opts.lazy) {
      this.uppy.on('thumbnail:request', this.onFileAdded);
      this.uppy.on('thumbnail:cancel', this.onCancelRequest);
    } else {
      this.uppy.on('file-added', this.onFileAdded);
      this.uppy.on('restored', this.onRestored);
    }

    if (this.opts.waitForThumbnailsBeforeUpload) {
      this.uppy.addPreProcessor(this.waitUntilAllProcessed);
    }
  }

  uninstall() {
    this.uppy.off('file-removed', this.onFileRemoved);
    this.uppy.off('cancel-all', this.onAllFilesRemoved);

    if (this.opts.lazy) {
      this.uppy.off('thumbnail:request', this.onFileAdded);
      this.uppy.off('thumbnail:cancel', this.onCancelRequest);
    } else {
      this.uppy.off('file-added', this.onFileAdded);
      this.uppy.off('restored', this.onRestored);
    }

    if (this.opts.waitForThumbnailsBeforeUpload) {
      this.uppy.removePreProcessor(this.waitUntilAllProcessed);
    }
  }

}, _class.VERSION = "2.1.1", _temp);

/***/ }),

/***/ "./node_modules/@uppy/thumbnail-generator/lib/locale.js":
/*!**************************************************************!*\
  !*** ./node_modules/@uppy/thumbnail-generator/lib/locale.js ***!
  \**************************************************************/
/***/ ((module) => {

module.exports = {
  strings: {
    generatingThumbnails: 'Generating thumbnails...'
  }
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/EventTracker.js":
/*!******************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/EventTracker.js ***!
  \******************************************************/
/***/ ((module) => {

"use strict";


var _emitter, _events;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

/**
 * Create a wrapper around an event emitter with a `remove` method to remove
 * all events that were added using the wrapped emitter.
 */
module.exports = (_emitter = /*#__PURE__*/_classPrivateFieldLooseKey("emitter"), _events = /*#__PURE__*/_classPrivateFieldLooseKey("events"), class EventTracker {
  constructor(emitter) {
    Object.defineProperty(this, _emitter, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _events, {
      writable: true,
      value: []
    });
    _classPrivateFieldLooseBase(this, _emitter)[_emitter] = emitter;
  }

  on(event, fn) {
    _classPrivateFieldLooseBase(this, _events)[_events].push([event, fn]);

    return _classPrivateFieldLooseBase(this, _emitter)[_emitter].on(event, fn);
  }

  remove() {
    for (const [event, fn] of _classPrivateFieldLooseBase(this, _events)[_events].splice(0)) {
      _classPrivateFieldLooseBase(this, _emitter)[_emitter].off(event, fn);
    }
  }

});

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/FOCUSABLE_ELEMENTS.js":
/*!************************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/FOCUSABLE_ELEMENTS.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = ['a[href]:not([tabindex^="-"]):not([inert]):not([aria-hidden])', 'area[href]:not([tabindex^="-"]):not([inert]):not([aria-hidden])', 'input:not([disabled]):not([inert]):not([aria-hidden])', 'select:not([disabled]):not([inert]):not([aria-hidden])', 'textarea:not([disabled]):not([inert]):not([aria-hidden])', 'button:not([disabled]):not([inert]):not([aria-hidden])', 'iframe:not([tabindex^="-"]):not([inert]):not([aria-hidden])', 'object:not([tabindex^="-"]):not([inert]):not([aria-hidden])', 'embed:not([tabindex^="-"]):not([inert]):not([aria-hidden])', '[contenteditable]:not([tabindex^="-"]):not([inert]):not([aria-hidden])', '[tabindex]:not([tabindex^="-"]):not([inert]):not([aria-hidden])'];

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/NetworkError.js":
/*!******************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/NetworkError.js ***!
  \******************************************************/
/***/ ((module) => {

"use strict";


class NetworkError extends Error {
  constructor(error, xhr) {
    if (xhr === void 0) {
      xhr = null;
    }

    super(`This looks like a network error, the endpoint might be blocked by an internet provider or a firewall.`);
    this.cause = error;
    this.isNetworkError = true;
    this.request = xhr;
  }

}

module.exports = NetworkError;

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/ProgressTimeout.js":
/*!*********************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/ProgressTimeout.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

var _aliveTimer = /*#__PURE__*/_classPrivateFieldLooseKey("aliveTimer");

var _isDone = /*#__PURE__*/_classPrivateFieldLooseKey("isDone");

var _onTimedOut = /*#__PURE__*/_classPrivateFieldLooseKey("onTimedOut");

var _timeout = /*#__PURE__*/_classPrivateFieldLooseKey("timeout");

/**
 * Helper to abort upload requests if there has not been any progress for `timeout` ms.
 * Create an instance using `timer = new ProgressTimeout(10000, onTimeout)`
 * Call `timer.progress()` to signal that there has been progress of any kind.
 * Call `timer.done()` when the upload has completed.
 */
class ProgressTimeout {
  constructor(timeout, timeoutHandler) {
    Object.defineProperty(this, _aliveTimer, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _isDone, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _onTimedOut, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _timeout, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldLooseBase(this, _timeout)[_timeout] = timeout;
    _classPrivateFieldLooseBase(this, _onTimedOut)[_onTimedOut] = timeoutHandler;
  }

  progress() {
    // Some browsers fire another progress event when the upload is
    // cancelled, so we have to ignore progress after the timer was
    // told to stop.
    if (_classPrivateFieldLooseBase(this, _isDone)[_isDone]) return;

    if (_classPrivateFieldLooseBase(this, _timeout)[_timeout] > 0) {
      clearTimeout(_classPrivateFieldLooseBase(this, _aliveTimer)[_aliveTimer]);
      _classPrivateFieldLooseBase(this, _aliveTimer)[_aliveTimer] = setTimeout(_classPrivateFieldLooseBase(this, _onTimedOut)[_onTimedOut], _classPrivateFieldLooseBase(this, _timeout)[_timeout]);
    }
  }

  done() {
    if (!_classPrivateFieldLooseBase(this, _isDone)[_isDone]) {
      clearTimeout(_classPrivateFieldLooseBase(this, _aliveTimer)[_aliveTimer]);
      _classPrivateFieldLooseBase(this, _aliveTimer)[_aliveTimer] = null;
      _classPrivateFieldLooseBase(this, _isDone)[_isDone] = true;
    }
  }

}

module.exports = ProgressTimeout;

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/RateLimitedQueue.js":
/*!**********************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/RateLimitedQueue.js ***!
  \**********************************************************/
/***/ ((module) => {

"use strict";


function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

function createCancelError() {
  return new Error('Cancelled');
}

var _activeRequests = /*#__PURE__*/_classPrivateFieldLooseKey("activeRequests");

var _queuedHandlers = /*#__PURE__*/_classPrivateFieldLooseKey("queuedHandlers");

var _paused = /*#__PURE__*/_classPrivateFieldLooseKey("paused");

var _pauseTimer = /*#__PURE__*/_classPrivateFieldLooseKey("pauseTimer");

var _downLimit = /*#__PURE__*/_classPrivateFieldLooseKey("downLimit");

var _upperLimit = /*#__PURE__*/_classPrivateFieldLooseKey("upperLimit");

var _rateLimitingTimer = /*#__PURE__*/_classPrivateFieldLooseKey("rateLimitingTimer");

var _call = /*#__PURE__*/_classPrivateFieldLooseKey("call");

var _queueNext = /*#__PURE__*/_classPrivateFieldLooseKey("queueNext");

var _next = /*#__PURE__*/_classPrivateFieldLooseKey("next");

var _queue = /*#__PURE__*/_classPrivateFieldLooseKey("queue");

var _dequeue = /*#__PURE__*/_classPrivateFieldLooseKey("dequeue");

var _resume = /*#__PURE__*/_classPrivateFieldLooseKey("resume");

var _increaseLimit = /*#__PURE__*/_classPrivateFieldLooseKey("increaseLimit");

class RateLimitedQueue {
  constructor(limit) {
    Object.defineProperty(this, _dequeue, {
      value: _dequeue2
    });
    Object.defineProperty(this, _queue, {
      value: _queue2
    });
    Object.defineProperty(this, _next, {
      value: _next2
    });
    Object.defineProperty(this, _queueNext, {
      value: _queueNext2
    });
    Object.defineProperty(this, _call, {
      value: _call2
    });
    Object.defineProperty(this, _activeRequests, {
      writable: true,
      value: 0
    });
    Object.defineProperty(this, _queuedHandlers, {
      writable: true,
      value: []
    });
    Object.defineProperty(this, _paused, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _pauseTimer, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _downLimit, {
      writable: true,
      value: 1
    });
    Object.defineProperty(this, _upperLimit, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _rateLimitingTimer, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _resume, {
      writable: true,
      value: () => this.resume()
    });
    Object.defineProperty(this, _increaseLimit, {
      writable: true,
      value: () => {
        if (_classPrivateFieldLooseBase(this, _paused)[_paused]) {
          _classPrivateFieldLooseBase(this, _rateLimitingTimer)[_rateLimitingTimer] = setTimeout(_classPrivateFieldLooseBase(this, _increaseLimit)[_increaseLimit], 0);
          return;
        }

        _classPrivateFieldLooseBase(this, _downLimit)[_downLimit] = this.limit;
        this.limit = Math.ceil((_classPrivateFieldLooseBase(this, _upperLimit)[_upperLimit] + _classPrivateFieldLooseBase(this, _downLimit)[_downLimit]) / 2);

        for (let i = _classPrivateFieldLooseBase(this, _downLimit)[_downLimit]; i <= this.limit; i++) {
          _classPrivateFieldLooseBase(this, _queueNext)[_queueNext]();
        }

        if (_classPrivateFieldLooseBase(this, _upperLimit)[_upperLimit] - _classPrivateFieldLooseBase(this, _downLimit)[_downLimit] > 3) {
          _classPrivateFieldLooseBase(this, _rateLimitingTimer)[_rateLimitingTimer] = setTimeout(_classPrivateFieldLooseBase(this, _increaseLimit)[_increaseLimit], 2000);
        } else {
          _classPrivateFieldLooseBase(this, _downLimit)[_downLimit] = Math.floor(_classPrivateFieldLooseBase(this, _downLimit)[_downLimit] / 2);
        }
      }
    });

    if (typeof limit !== 'number' || limit === 0) {
      this.limit = Infinity;
    } else {
      this.limit = limit;
    }
  }

  run(fn, queueOptions) {
    if (!_classPrivateFieldLooseBase(this, _paused)[_paused] && _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] < this.limit) {
      return _classPrivateFieldLooseBase(this, _call)[_call](fn);
    }

    return _classPrivateFieldLooseBase(this, _queue)[_queue](fn, queueOptions);
  }

  wrapPromiseFunction(fn, queueOptions) {
    var _this = this;

    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      let queuedRequest;
      const outerPromise = new Promise((resolve, reject) => {
        queuedRequest = _this.run(() => {
          let cancelError;
          let innerPromise;

          try {
            innerPromise = Promise.resolve(fn(...args));
          } catch (err) {
            innerPromise = Promise.reject(err);
          }

          innerPromise.then(result => {
            if (cancelError) {
              reject(cancelError);
            } else {
              queuedRequest.done();
              resolve(result);
            }
          }, err => {
            if (cancelError) {
              reject(cancelError);
            } else {
              queuedRequest.done();
              reject(err);
            }
          });
          return () => {
            cancelError = createCancelError();
          };
        }, queueOptions);
      });

      outerPromise.abort = () => {
        queuedRequest.abort();
      };

      return outerPromise;
    };
  }

  resume() {
    _classPrivateFieldLooseBase(this, _paused)[_paused] = false;
    clearTimeout(_classPrivateFieldLooseBase(this, _pauseTimer)[_pauseTimer]);

    for (let i = 0; i < this.limit; i++) {
      _classPrivateFieldLooseBase(this, _queueNext)[_queueNext]();
    }
  }

  /**
   * Freezes the queue for a while or indefinitely.
   *
   * @param {number | null } [duration] Duration for the pause to happen, in milliseconds.
   *                                    If omitted, the queue won't resume automatically.
   */
  pause(duration) {
    if (duration === void 0) {
      duration = null;
    }

    _classPrivateFieldLooseBase(this, _paused)[_paused] = true;
    clearTimeout(_classPrivateFieldLooseBase(this, _pauseTimer)[_pauseTimer]);

    if (duration != null) {
      _classPrivateFieldLooseBase(this, _pauseTimer)[_pauseTimer] = setTimeout(_classPrivateFieldLooseBase(this, _resume)[_resume], duration);
    }
  }
  /**
   * Pauses the queue for a duration, and lower the limit of concurrent requests
   * when the queue resumes. When the queue resumes, it tries to progressively
   * increase the limit in `this.#increaseLimit` until another call is made to
   * `this.rateLimit`.
   * Call this function when using the RateLimitedQueue for network requests and
   * the remote server responds with 429 HTTP code.
   *
   * @param {number} duration in milliseconds.
   */


  rateLimit(duration) {
    clearTimeout(_classPrivateFieldLooseBase(this, _rateLimitingTimer)[_rateLimitingTimer]);
    this.pause(duration);

    if (this.limit > 1 && Number.isFinite(this.limit)) {
      _classPrivateFieldLooseBase(this, _upperLimit)[_upperLimit] = this.limit - 1;
      this.limit = _classPrivateFieldLooseBase(this, _downLimit)[_downLimit];
      _classPrivateFieldLooseBase(this, _rateLimitingTimer)[_rateLimitingTimer] = setTimeout(_classPrivateFieldLooseBase(this, _increaseLimit)[_increaseLimit], duration);
    }
  }

  get isPaused() {
    return _classPrivateFieldLooseBase(this, _paused)[_paused];
  }

}

function _call2(fn) {
  _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] += 1;
  let done = false;
  let cancelActive;

  try {
    cancelActive = fn();
  } catch (err) {
    _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] -= 1;
    throw err;
  }

  return {
    abort: () => {
      if (done) return;
      done = true;
      _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] -= 1;
      cancelActive();

      _classPrivateFieldLooseBase(this, _queueNext)[_queueNext]();
    },
    done: () => {
      if (done) return;
      done = true;
      _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] -= 1;

      _classPrivateFieldLooseBase(this, _queueNext)[_queueNext]();
    }
  };
}

function _queueNext2() {
  // Do it soon but not immediately, this allows clearing out the entire queue synchronously
  // one by one without continuously _advancing_ it (and starting new tasks before immediately
  // aborting them)
  queueMicrotask(() => _classPrivateFieldLooseBase(this, _next)[_next]());
}

function _next2() {
  if (_classPrivateFieldLooseBase(this, _paused)[_paused] || _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] >= this.limit) {
    return;
  }

  if (_classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].length === 0) {
    return;
  } // Dispatch the next request, and update the abort/done handlers
  // so that cancelling it does the Right Thing (and doesn't just try
  // to dequeue an already-running request).


  const next = _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].shift();

  const handler = _classPrivateFieldLooseBase(this, _call)[_call](next.fn);

  next.abort = handler.abort;
  next.done = handler.done;
}

function _queue2(fn, options) {
  if (options === void 0) {
    options = {};
  }

  const handler = {
    fn,
    priority: options.priority || 0,
    abort: () => {
      _classPrivateFieldLooseBase(this, _dequeue)[_dequeue](handler);
    },
    done: () => {
      throw new Error('Cannot mark a queued request as done: this indicates a bug');
    }
  };

  const index = _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].findIndex(other => {
    return handler.priority > other.priority;
  });

  if (index === -1) {
    _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].push(handler);
  } else {
    _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].splice(index, 0, handler);
  }

  return handler;
}

function _dequeue2(handler) {
  const index = _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].indexOf(handler);

  if (index !== -1) {
    _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].splice(index, 1);
  }
}

module.exports = {
  RateLimitedQueue,
  internalRateLimitedQueue: Symbol('__queue')
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/Translator.js":
/*!****************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/Translator.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _apply;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const has = __webpack_require__(/*! ./hasProperty */ "./node_modules/@uppy/utils/lib/hasProperty.js");

function insertReplacement(source, rx, replacement) {
  const newParts = [];
  source.forEach(chunk => {
    // When the source contains multiple placeholders for interpolation,
    // we should ignore chunks that are not strings, because those
    // can be JSX objects and will be otherwise incorrectly turned into strings.
    // Without this condition we’d get this: [object Object] hello [object Object] my <button>
    if (typeof chunk !== 'string') {
      return newParts.push(chunk);
    }

    return rx[Symbol.split](chunk).forEach((raw, i, list) => {
      if (raw !== '') {
        newParts.push(raw);
      } // Interlace with the `replacement` value


      if (i < list.length - 1) {
        newParts.push(replacement);
      }
    });
  });
  return newParts;
}
/**
 * Takes a string with placeholder variables like `%{smart_count} file selected`
 * and replaces it with values from options `{smart_count: 5}`
 *
 * @license https://github.com/airbnb/polyglot.js/blob/master/LICENSE
 * taken from https://github.com/airbnb/polyglot.js/blob/master/lib/polyglot.js#L299
 *
 * @param {string} phrase that needs interpolation, with placeholders
 * @param {object} options with values that will be used to replace placeholders
 * @returns {any[]} interpolated
 */


function interpolate(phrase, options) {
  const dollarRegex = /\$/g;
  const dollarBillsYall = '$$$$';
  let interpolated = [phrase];
  if (options == null) return interpolated;

  for (const arg of Object.keys(options)) {
    if (arg !== '_') {
      // Ensure replacement value is escaped to prevent special $-prefixed
      // regex replace tokens. the "$$$$" is needed because each "$" needs to
      // be escaped with "$" itself, and we need two in the resulting output.
      let replacement = options[arg];

      if (typeof replacement === 'string') {
        replacement = dollarRegex[Symbol.replace](replacement, dollarBillsYall);
      } // We create a new `RegExp` each time instead of using a more-efficient
      // string replace so that the same argument can be replaced multiple times
      // in the same phrase.


      interpolated = insertReplacement(interpolated, new RegExp(`%\\{${arg}\\}`, 'g'), replacement);
    }
  }

  return interpolated;
}
/**
 * Translates strings with interpolation & pluralization support.
 * Extensible with custom dictionaries and pluralization functions.
 *
 * Borrows heavily from and inspired by Polyglot https://github.com/airbnb/polyglot.js,
 * basically a stripped-down version of it. Differences: pluralization functions are not hardcoded
 * and can be easily added among with dictionaries, nested objects are used for pluralization
 * as opposed to `||||` delimeter
 *
 * Usage example: `translator.translate('files_chosen', {smart_count: 3})`
 */


module.exports = (_apply = /*#__PURE__*/_classPrivateFieldLooseKey("apply"), class Translator {
  /**
   * @param {object|Array<object>} locales - locale or list of locales.
   */
  constructor(locales) {
    Object.defineProperty(this, _apply, {
      value: _apply2
    });
    this.locale = {
      strings: {},

      pluralize(n) {
        if (n === 1) {
          return 0;
        }

        return 1;
      }

    };

    if (Array.isArray(locales)) {
      locales.forEach(_classPrivateFieldLooseBase(this, _apply)[_apply], this);
    } else {
      _classPrivateFieldLooseBase(this, _apply)[_apply](locales);
    }
  }

  /**
   * Public translate method
   *
   * @param {string} key
   * @param {object} options with values that will be used later to replace placeholders in string
   * @returns {string} translated (and interpolated)
   */
  translate(key, options) {
    return this.translateArray(key, options).join('');
  }
  /**
   * Get a translation and return the translated and interpolated parts as an array.
   *
   * @param {string} key
   * @param {object} options with values that will be used to replace placeholders
   * @returns {Array} The translated and interpolated parts, in order.
   */


  translateArray(key, options) {
    if (!has(this.locale.strings, key)) {
      throw new Error(`missing string: ${key}`);
    }

    const string = this.locale.strings[key];
    const hasPluralForms = typeof string === 'object';

    if (hasPluralForms) {
      if (options && typeof options.smart_count !== 'undefined') {
        const plural = this.locale.pluralize(options.smart_count);
        return interpolate(string[plural], options);
      }

      throw new Error('Attempted to use a string with plural forms, but no value was given for %{smart_count}');
    }

    return interpolate(string, options);
  }

});

function _apply2(locale) {
  if (!(locale != null && locale.strings)) {
    return;
  }

  const prevLocale = this.locale;
  this.locale = { ...prevLocale,
    strings: { ...prevLocale.strings,
      ...locale.strings
    }
  };
  this.locale.pluralize = locale.pluralize || prevLocale.pluralize;
}

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/dataURItoBlob.js":
/*!*******************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/dataURItoBlob.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


const DATA_URL_PATTERN = /^data:([^/]+\/[^,;]+(?:[^,]*?))(;base64)?,([\s\S]*)$/;

module.exports = function dataURItoBlob(dataURI, opts, toFile) {
  var _ref, _opts$mimeType;

  // get the base64 data
  const dataURIData = DATA_URL_PATTERN.exec(dataURI); // user may provide mime type, if not get it from data URI

  const mimeType = (_ref = (_opts$mimeType = opts.mimeType) != null ? _opts$mimeType : dataURIData == null ? void 0 : dataURIData[1]) != null ? _ref : 'plain/text';
  let data;

  if (dataURIData[2] != null) {
    const binary = atob(decodeURIComponent(dataURIData[3]));
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    data = [bytes];
  } else {
    data = [decodeURIComponent(dataURIData[3])];
  } // Convert to a File?


  if (toFile) {
    return new File(data, opts.name || '', {
      type: mimeType
    });
  }

  return new Blob(data, {
    type: mimeType
  });
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/emitSocketProgress.js":
/*!************************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/emitSocketProgress.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const throttle = __webpack_require__(/*! lodash.throttle */ "./node_modules/lodash.throttle/index.js");

function emitSocketProgress(uploader, progressData, file) {
  const {
    progress,
    bytesUploaded,
    bytesTotal
  } = progressData;

  if (progress) {
    uploader.uppy.log(`Upload progress: ${progress}`);
    uploader.uppy.emit('upload-progress', file, {
      uploader,
      bytesUploaded,
      bytesTotal
    });
  }
}

module.exports = throttle(emitSocketProgress, 300, {
  leading: true,
  trailing: true
});

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/fetchWithNetworkError.js":
/*!***************************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/fetchWithNetworkError.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const NetworkError = __webpack_require__(/*! ./NetworkError */ "./node_modules/@uppy/utils/lib/NetworkError.js");
/**
 * Wrapper around window.fetch that throws a NetworkError when appropriate
 */


module.exports = function fetchWithNetworkError() {
  return fetch(...arguments).catch(err => {
    if (err.name === 'AbortError') {
      throw err;
    } else {
      throw new NetworkError(err);
    }
  });
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/findAllDOMElements.js":
/*!************************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/findAllDOMElements.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const isDOMElement = __webpack_require__(/*! ./isDOMElement */ "./node_modules/@uppy/utils/lib/isDOMElement.js");
/**
 * Find one or more DOM elements.
 *
 * @param {string|Node} element
 * @returns {Node[]|null}
 */


module.exports = function findAllDOMElements(element) {
  if (typeof element === 'string') {
    const elements = document.querySelectorAll(element);
    return elements.length === 0 ? null : Array.from(elements);
  }

  if (typeof element === 'object' && isDOMElement(element)) {
    return [element];
  }

  return null;
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/findDOMElement.js":
/*!********************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/findDOMElement.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const isDOMElement = __webpack_require__(/*! ./isDOMElement */ "./node_modules/@uppy/utils/lib/isDOMElement.js");
/**
 * Find a DOM element.
 *
 * @param {Node|string} element
 * @returns {Node|null}
 */


module.exports = function findDOMElement(element, context) {
  if (context === void 0) {
    context = document;
  }

  if (typeof element === 'string') {
    return context.querySelector(element);
  }

  if (isDOMElement(element)) {
    return element;
  }

  return null;
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/generateFileID.js":
/*!********************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/generateFileID.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


function encodeCharacter(character) {
  return character.charCodeAt(0).toString(32);
}

function encodeFilename(name) {
  let suffix = '';
  return name.replace(/[^A-Z0-9]/ig, character => {
    suffix += `-${encodeCharacter(character)}`;
    return '/';
  }) + suffix;
}
/**
 * Takes a file object and turns it into fileID, by converting file.name to lowercase,
 * removing extra characters and adding type, size and lastModified
 *
 * @param {object} file
 * @returns {string} the fileID
 */


module.exports = function generateFileID(file) {
  // It's tempting to do `[items].filter(Boolean).join('-')` here, but that
  // is slower! simple string concatenation is fast
  let id = 'uppy';

  if (typeof file.name === 'string') {
    id += `-${encodeFilename(file.name.toLowerCase())}`;
  }

  if (file.type !== undefined) {
    id += `-${file.type}`;
  }

  if (file.meta && typeof file.meta.relativePath === 'string') {
    id += `-${encodeFilename(file.meta.relativePath.toLowerCase())}`;
  }

  if (file.data.size !== undefined) {
    id += `-${file.data.size}`;
  }

  if (file.data.lastModified !== undefined) {
    id += `-${file.data.lastModified}`;
  }

  return id;
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/getBytesRemaining.js":
/*!***********************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/getBytesRemaining.js ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";


module.exports = function getBytesRemaining(fileProgress) {
  return fileProgress.bytesTotal - fileProgress.bytesUploaded;
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/getDroppedFiles/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/getDroppedFiles/index.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const webkitGetAsEntryApi = __webpack_require__(/*! ./utils/webkitGetAsEntryApi/index */ "./node_modules/@uppy/utils/lib/getDroppedFiles/utils/webkitGetAsEntryApi/index.js");

const fallbackApi = __webpack_require__(/*! ./utils/fallbackApi */ "./node_modules/@uppy/utils/lib/getDroppedFiles/utils/fallbackApi.js");
/**
 * Returns a promise that resolves to the array of dropped files (if a folder is
 * dropped, and browser supports folder parsing - promise resolves to the flat
 * array of all files in all directories).
 * Each file has .relativePath prop appended to it (e.g. "/docs/Prague/ticket_from_prague_to_ufa.pdf")
 * if browser supports it. Otherwise it's undefined.
 *
 * @param {DataTransfer} dataTransfer
 * @param {Function} logDropError - a function that's called every time some
 * folder or some file error out (e.g. because of the folder name being too long
 * on Windows). Notice that resulting promise will always be resolved anyway.
 *
 * @returns {Promise} - Array<File>
 */


module.exports = function getDroppedFiles(dataTransfer, _temp) {
  var _dataTransfer$items;

  let {
    logDropError = () => {}
  } = _temp === void 0 ? {} : _temp;

  // Get all files from all subdirs. Works (at least) in Chrome, Mozilla, and Safari
  if ((_dataTransfer$items = dataTransfer.items) != null && _dataTransfer$items[0] && 'webkitGetAsEntry' in dataTransfer.items[0]) {
    return webkitGetAsEntryApi(dataTransfer, logDropError); // Otherwise just return all first-order files
  }

  return fallbackApi(dataTransfer);
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/getDroppedFiles/utils/fallbackApi.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/getDroppedFiles/utils/fallbackApi.js ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const toArray = __webpack_require__(/*! ../../toArray */ "./node_modules/@uppy/utils/lib/toArray.js"); // .files fallback, should be implemented in any browser


module.exports = function fallbackApi(dataTransfer) {
  const files = toArray(dataTransfer.files);
  return Promise.resolve(files);
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/getDroppedFiles/utils/webkitGetAsEntryApi/getFilesAndDirectoriesFromDirectory.js":
/*!***********************************************************************************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/getDroppedFiles/utils/webkitGetAsEntryApi/getFilesAndDirectoriesFromDirectory.js ***!
  \***********************************************************************************************************************/
/***/ ((module) => {

"use strict";


/**
 * Recursive function, calls the original callback() when the directory is entirely parsed.
 *
 * @param {FileSystemDirectoryReader} directoryReader
 * @param {Array} oldEntries
 * @param {Function} logDropError
 * @param {Function} callback - called with ([ all files and directories in that directoryReader ])
 */
module.exports = function getFilesAndDirectoriesFromDirectory(directoryReader, oldEntries, logDropError, _ref) {
  let {
    onSuccess
  } = _ref;
  directoryReader.readEntries(entries => {
    const newEntries = [...oldEntries, ...entries]; // According to the FileSystem API spec, getFilesAndDirectoriesFromDirectory()
    // must be called until it calls the onSuccess with an empty array.

    if (entries.length) {
      setTimeout(() => {
        getFilesAndDirectoriesFromDirectory(directoryReader, newEntries, logDropError, {
          onSuccess
        });
      }, 0); // Done iterating this particular directory
    } else {
      onSuccess(newEntries);
    }
  }, // Make sure we resolve on error anyway, it's fine if only one directory couldn't be parsed!
  error => {
    logDropError(error);
    onSuccess(oldEntries);
  });
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/getDroppedFiles/utils/webkitGetAsEntryApi/getRelativePath.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/getDroppedFiles/utils/webkitGetAsEntryApi/getRelativePath.js ***!
  \***************************************************************************************************/
/***/ ((module) => {

"use strict";


/**
 * Get the relative path from the FileEntry#fullPath, because File#webkitRelativePath is always '', at least onDrop.
 *
 * @param {FileEntry} fileEntry
 *
 * @returns {string|null} - if file is not in a folder - return null (this is to
 * be consistent with .relativePath-s of files selected from My Device). If file
 * is in a folder - return its fullPath, e.g. '/simpsons/hi.jpeg'.
 */
module.exports = function getRelativePath(fileEntry) {
  // fileEntry.fullPath - "/simpsons/hi.jpeg" or undefined (for browsers that don't support it)
  // fileEntry.name - "hi.jpeg"
  if (!fileEntry.fullPath || fileEntry.fullPath === `/${fileEntry.name}`) {
    return null;
  }

  return fileEntry.fullPath;
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/getDroppedFiles/utils/webkitGetAsEntryApi/index.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/getDroppedFiles/utils/webkitGetAsEntryApi/index.js ***!
  \*****************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const toArray = __webpack_require__(/*! ../../../toArray */ "./node_modules/@uppy/utils/lib/toArray.js");

const getRelativePath = __webpack_require__(/*! ./getRelativePath */ "./node_modules/@uppy/utils/lib/getDroppedFiles/utils/webkitGetAsEntryApi/getRelativePath.js");

const getFilesAndDirectoriesFromDirectory = __webpack_require__(/*! ./getFilesAndDirectoriesFromDirectory */ "./node_modules/@uppy/utils/lib/getDroppedFiles/utils/webkitGetAsEntryApi/getFilesAndDirectoriesFromDirectory.js");

module.exports = function webkitGetAsEntryApi(dataTransfer, logDropError) {
  const files = [];
  const rootPromises = [];
  /**
   * Returns a resolved promise, when :files array is enhanced
   *
   * @param {(FileSystemFileEntry|FileSystemDirectoryEntry)} entry
   * @returns {Promise} - empty promise that resolves when :files is enhanced with a file
   */

  const createPromiseToAddFileOrParseDirectory = entry => new Promise(resolve => {
    // This is a base call
    if (entry.isFile) {
      // Creates a new File object which can be used to read the file.
      entry.file(file => {
        // eslint-disable-next-line no-param-reassign
        file.relativePath = getRelativePath(entry);
        files.push(file);
        resolve();
      }, // Make sure we resolve on error anyway, it's fine if only one file couldn't be read!
      error => {
        logDropError(error);
        resolve();
      }); // This is a recursive call
    } else if (entry.isDirectory) {
      const directoryReader = entry.createReader();
      getFilesAndDirectoriesFromDirectory(directoryReader, [], logDropError, {
        onSuccess: entries => resolve(Promise.all(entries.map(createPromiseToAddFileOrParseDirectory)))
      });
    }
  }); // For each dropped item, - make sure it's a file/directory, and start deepening in!


  toArray(dataTransfer.items).forEach(item => {
    const entry = item.webkitGetAsEntry(); // :entry can be null when we drop the url e.g.

    if (entry) {
      rootPromises.push(createPromiseToAddFileOrParseDirectory(entry));
    }
  });
  return Promise.all(rootPromises).then(() => files);
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/getFileNameAndExtension.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/getFileNameAndExtension.js ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";


/**
 * Takes a full filename string and returns an object {name, extension}
 *
 * @param {string} fullFileName
 * @returns {object} {name, extension}
 */
module.exports = function getFileNameAndExtension(fullFileName) {
  const lastDot = fullFileName.lastIndexOf('.'); // these count as no extension: "no-dot", "trailing-dot."

  if (lastDot === -1 || lastDot === fullFileName.length - 1) {
    return {
      name: fullFileName,
      extension: undefined
    };
  }

  return {
    name: fullFileName.slice(0, lastDot),
    extension: fullFileName.slice(lastDot + 1)
  };
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/getFileType.js":
/*!*****************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/getFileType.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const getFileNameAndExtension = __webpack_require__(/*! ./getFileNameAndExtension */ "./node_modules/@uppy/utils/lib/getFileNameAndExtension.js");

const mimeTypes = __webpack_require__(/*! ./mimeTypes */ "./node_modules/@uppy/utils/lib/mimeTypes.js");

module.exports = function getFileType(file) {
  var _getFileNameAndExtens;

  if (file.type) return file.type;
  const fileExtension = file.name ? (_getFileNameAndExtens = getFileNameAndExtension(file.name).extension) == null ? void 0 : _getFileNameAndExtens.toLowerCase() : null;

  if (fileExtension && fileExtension in mimeTypes) {
    // else, see if we can map extension to a mime type
    return mimeTypes[fileExtension];
  } // if all fails, fall back to a generic byte stream type


  return 'application/octet-stream';
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/getSocketHost.js":
/*!*******************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/getSocketHost.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


module.exports = function getSocketHost(url) {
  // get the host domain
  const regex = /^(?:https?:\/\/|\/\/)?(?:[^@\n]+@)?(?:www\.)?([^\n]+)/i;
  const host = regex.exec(url)[1];
  const socketProtocol = /^http:\/\//i.test(url) ? 'ws' : 'wss';
  return `${socketProtocol}://${host}`;
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/getSpeed.js":
/*!**************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/getSpeed.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


module.exports = function getSpeed(fileProgress) {
  if (!fileProgress.bytesUploaded) return 0;
  const timeElapsed = Date.now() - fileProgress.uploadStarted;
  const uploadSpeed = fileProgress.bytesUploaded / (timeElapsed / 1000);
  return uploadSpeed;
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/getTextDirection.js":
/*!**********************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/getTextDirection.js ***!
  \**********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Get the declared text direction for an element.
 *
 * @param {Node} element
 * @returns {string|undefined}
 */
function getTextDirection(element) {
  var _element;

  // There is another way to determine text direction using getComputedStyle(), as done here:
  // https://github.com/pencil-js/text-direction/blob/2a235ce95089b3185acec3b51313cbba921b3811/text-direction.js
  //
  // We do not use that approach because we are interested specifically in the _declared_ text direction.
  // If no text direction is declared, we have to provide our own explicit text direction so our
  // bidirectional CSS style sheets work.
  while (element && !element.dir) {
    // eslint-disable-next-line no-param-reassign
    element = element.parentNode;
  }

  return (_element = element) == null ? void 0 : _element.dir;
}

module.exports = getTextDirection;

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/getTimeStamp.js":
/*!******************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/getTimeStamp.js ***!
  \******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Adds zero to strings shorter than two characters.
 *
 * @param {number} number
 * @returns {string}
 */
function pad(number) {
  return number < 10 ? `0${number}` : number.toString();
}
/**
 * Returns a timestamp in the format of `hours:minutes:seconds`
 */


module.exports = function getTimeStamp() {
  const date = new Date();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/hasProperty.js":
/*!*****************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/hasProperty.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


module.exports = function has(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/isDOMElement.js":
/*!******************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/isDOMElement.js ***!
  \******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Check if an object is a DOM element. Duck-typing based on `nodeType`.
 *
 * @param {*} obj
 */
module.exports = function isDOMElement(obj) {
  return (obj == null ? void 0 : obj.nodeType) === Node.ELEMENT_NODE;
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/isDragDropSupported.js":
/*!*************************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/isDragDropSupported.js ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";


/**
 * Checks if the browser supports Drag & Drop (not supported on mobile devices, for example).
 *
 * @returns {boolean}
 */
module.exports = function isDragDropSupported() {
  const div = document.body;

  if (!('draggable' in div) || !('ondragstart' in div && 'ondrop' in div)) {
    return false;
  }

  if (!('FormData' in window)) {
    return false;
  }

  if (!('FileReader' in window)) {
    return false;
  }

  return true;
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/isNetworkError.js":
/*!********************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/isNetworkError.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


function isNetworkError(xhr) {
  if (!xhr) {
    return false;
  }

  return xhr.readyState !== 0 && xhr.readyState !== 4 || xhr.status === 0;
}

module.exports = isNetworkError;

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/isObjectURL.js":
/*!*****************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/isObjectURL.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Check if a URL string is an object URL from `URL.createObjectURL`.
 *
 * @param {string} url
 * @returns {boolean}
 */
module.exports = function isObjectURL(url) {
  return url.startsWith('blob:');
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/isPreviewSupported.js":
/*!************************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/isPreviewSupported.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isPreviewSupported(fileType) {
  if (!fileType) return false; // list of images that browsers can preview

  return /^[^/]+\/(jpe?g|gif|png|svg|svg\+xml|bmp|webp|avif)$/.test(fileType);
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/mimeTypes.js":
/*!***************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/mimeTypes.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


// ___Why not add the mime-types package?
//    It's 19.7kB gzipped, and we only need mime types for well-known extensions (for file previews).
// ___Where to take new extensions from?
//    https://github.com/jshttp/mime-db/blob/master/db.json
module.exports = {
  md: 'text/markdown',
  markdown: 'text/markdown',
  mp4: 'video/mp4',
  mp3: 'audio/mp3',
  svg: 'image/svg+xml',
  jpg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  heic: 'image/heic',
  heif: 'image/heif',
  yaml: 'text/yaml',
  yml: 'text/yaml',
  csv: 'text/csv',
  tsv: 'text/tab-separated-values',
  tab: 'text/tab-separated-values',
  avi: 'video/x-msvideo',
  mks: 'video/x-matroska',
  mkv: 'video/x-matroska',
  mov: 'video/quicktime',
  doc: 'application/msword',
  docm: 'application/vnd.ms-word.document.macroenabled.12',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  dot: 'application/msword',
  dotm: 'application/vnd.ms-word.template.macroenabled.12',
  dotx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
  xla: 'application/vnd.ms-excel',
  xlam: 'application/vnd.ms-excel.addin.macroenabled.12',
  xlc: 'application/vnd.ms-excel',
  xlf: 'application/x-xliff+xml',
  xlm: 'application/vnd.ms-excel',
  xls: 'application/vnd.ms-excel',
  xlsb: 'application/vnd.ms-excel.sheet.binary.macroenabled.12',
  xlsm: 'application/vnd.ms-excel.sheet.macroenabled.12',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xlt: 'application/vnd.ms-excel',
  xltm: 'application/vnd.ms-excel.template.macroenabled.12',
  xltx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
  xlw: 'application/vnd.ms-excel',
  txt: 'text/plain',
  text: 'text/plain',
  conf: 'text/plain',
  log: 'text/plain',
  pdf: 'application/pdf',
  zip: 'application/zip',
  '7z': 'application/x-7z-compressed',
  rar: 'application/x-rar-compressed',
  tar: 'application/x-tar',
  gz: 'application/gzip',
  dmg: 'application/x-apple-diskimage'
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/prettyETA.js":
/*!***************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/prettyETA.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const secondsToTime = __webpack_require__(/*! ./secondsToTime */ "./node_modules/@uppy/utils/lib/secondsToTime.js");

module.exports = function prettyETA(seconds) {
  const time = secondsToTime(seconds); // Only display hours and minutes if they are greater than 0 but always
  // display minutes if hours is being displayed
  // Display a leading zero if the there is a preceding unit: 1m 05s, but 5s

  const hoursStr = time.hours === 0 ? '' : `${time.hours}h`;
  const minutesStr = time.minutes === 0 ? '' : `${time.hours === 0 ? time.minutes : ` ${time.minutes.toString(10).padStart(2, '0')}`}m`;
  const secondsStr = time.hours !== 0 ? '' : `${time.minutes === 0 ? time.seconds : ` ${time.seconds.toString(10).padStart(2, '0')}`}s`;
  return `${hoursStr}${minutesStr}${secondsStr}`;
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/secondsToTime.js":
/*!*******************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/secondsToTime.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


module.exports = function secondsToTime(rawSeconds) {
  const hours = Math.floor(rawSeconds / 3600) % 24;
  const minutes = Math.floor(rawSeconds / 60) % 60;
  const seconds = Math.floor(rawSeconds % 60);
  return {
    hours,
    minutes,
    seconds
  };
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/settle.js":
/*!************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/settle.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function settle(promises) {
  const resolutions = [];
  const rejections = [];

  function resolved(value) {
    resolutions.push(value);
  }

  function rejected(error) {
    rejections.push(error);
  }

  const wait = Promise.all(promises.map(promise => promise.then(resolved, rejected)));
  return wait.then(() => {
    return {
      successful: resolutions,
      failed: rejections
    };
  });
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/toArray.js":
/*!*************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/toArray.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * Converts list into array
 */
module.exports = Array.from;

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/truncateString.js":
/*!********************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/truncateString.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Truncates a string to the given number of chars (maxLength) by inserting '...' in the middle of that string.
 * Partially taken from https://stackoverflow.com/a/5723274/3192470.
 *
 * @param {string} string - string to be truncated
 * @param {number} maxLength - maximum size of the resulting string
 * @returns {string}
 */
const separator = '...';

module.exports = function truncateString(string, maxLength) {
  // Return the empty string if maxLength is zero
  if (maxLength === 0) return ''; // Return original string if it's already shorter than maxLength

  if (string.length <= maxLength) return string; // Return truncated substring appended of the ellipsis char if string can't be meaningfully truncated

  if (maxLength <= separator.length + 1) return `${string.slice(0, maxLength - 1)}…`;
  const charsToShow = maxLength - separator.length;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return string.slice(0, frontChars) + separator + string.slice(-backChars);
};

/***/ }),

/***/ "./node_modules/@uppy/xhr-upload/lib/index.js":
/*!****************************************************!*\
  !*** ./node_modules/@uppy/xhr-upload/lib/index.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _class, _temp;

const BasePlugin = __webpack_require__(/*! @uppy/core/lib/BasePlugin */ "./node_modules/@uppy/core/lib/BasePlugin.js");

const {
  nanoid
} = __webpack_require__(/*! nanoid/non-secure */ "./node_modules/nanoid/non-secure/index.cjs");

const {
  Provider,
  RequestClient,
  Socket
} = __webpack_require__(/*! @uppy/companion-client */ "./node_modules/@uppy/companion-client/lib/index.js");

const emitSocketProgress = __webpack_require__(/*! @uppy/utils/lib/emitSocketProgress */ "./node_modules/@uppy/utils/lib/emitSocketProgress.js");

const getSocketHost = __webpack_require__(/*! @uppy/utils/lib/getSocketHost */ "./node_modules/@uppy/utils/lib/getSocketHost.js");

const settle = __webpack_require__(/*! @uppy/utils/lib/settle */ "./node_modules/@uppy/utils/lib/settle.js");

const EventTracker = __webpack_require__(/*! @uppy/utils/lib/EventTracker */ "./node_modules/@uppy/utils/lib/EventTracker.js");

const ProgressTimeout = __webpack_require__(/*! @uppy/utils/lib/ProgressTimeout */ "./node_modules/@uppy/utils/lib/ProgressTimeout.js");

const {
  RateLimitedQueue,
  internalRateLimitedQueue
} = __webpack_require__(/*! @uppy/utils/lib/RateLimitedQueue */ "./node_modules/@uppy/utils/lib/RateLimitedQueue.js");

const NetworkError = __webpack_require__(/*! @uppy/utils/lib/NetworkError */ "./node_modules/@uppy/utils/lib/NetworkError.js");

const isNetworkError = __webpack_require__(/*! @uppy/utils/lib/isNetworkError */ "./node_modules/@uppy/utils/lib/isNetworkError.js");

const locale = __webpack_require__(/*! ./locale */ "./node_modules/@uppy/xhr-upload/lib/locale.js");

function buildResponseError(xhr, err) {
  let error = err; // No error message

  if (!error) error = new Error('Upload error'); // Got an error message string

  if (typeof error === 'string') error = new Error(error); // Got something else

  if (!(error instanceof Error)) {
    error = Object.assign(new Error('Upload error'), {
      data: error
    });
  }

  if (isNetworkError(xhr)) {
    error = new NetworkError(error, xhr);
    return error;
  }

  error.request = xhr;
  return error;
}
/**
 * Set `data.type` in the blob to `file.meta.type`,
 * because we might have detected a more accurate file type in Uppy
 * https://stackoverflow.com/a/50875615
 *
 * @param {object} file File object with `data`, `size` and `meta` properties
 * @returns {object} blob updated with the new `type` set from `file.meta.type`
 */


function setTypeInBlob(file) {
  const dataWithUpdatedType = file.data.slice(0, file.data.size, file.meta.type);
  return dataWithUpdatedType;
}

module.exports = (_temp = _class = class XHRUpload extends BasePlugin {
  // eslint-disable-next-line global-require
  constructor(uppy, opts) {
    super(uppy, opts);
    this.type = 'uploader';
    this.id = this.opts.id || 'XHRUpload';
    this.title = 'XHRUpload';
    this.defaultLocale = locale; // Default options

    const defaultOptions = {
      formData: true,
      fieldName: opts.bundle ? 'files[]' : 'file',
      method: 'post',
      metaFields: null,
      responseUrlFieldName: 'url',
      bundle: false,
      headers: {},
      timeout: 30 * 1000,
      limit: 5,
      withCredentials: false,
      responseType: '',

      /**
       * @typedef respObj
       * @property {string} responseText
       * @property {number} status
       * @property {string} statusText
       * @property {object.<string, string>} headers
       *
       * @param {string} responseText the response body string
       * @param {XMLHttpRequest | respObj} response the response object (XHR or similar)
       */
      getResponseData(responseText) {
        let parsedResponse = {};

        try {
          parsedResponse = JSON.parse(responseText);
        } catch (err) {
          uppy.log(err);
        }

        return parsedResponse;
      },

      /**
       *
       * @param {string} responseText the response body string
       * @param {XMLHttpRequest | respObj} response the response object (XHR or similar)
       */
      getResponseError(_, response) {
        let error = new Error('Upload error');

        if (isNetworkError(response)) {
          error = new NetworkError(error, response);
        }

        return error;
      },

      /**
       * Check if the response from the upload endpoint indicates that the upload was successful.
       *
       * @param {number} status the response status code
       */
      validateStatus(status) {
        return status >= 200 && status < 300;
      }

    };
    this.opts = { ...defaultOptions,
      ...opts
    };
    this.i18nInit();
    this.handleUpload = this.handleUpload.bind(this); // Simultaneous upload limiting is shared across all uploads with this plugin.

    if (internalRateLimitedQueue in this.opts) {
      this.requests = this.opts[internalRateLimitedQueue];
    } else {
      this.requests = new RateLimitedQueue(this.opts.limit);
    }

    if (this.opts.bundle && !this.opts.formData) {
      throw new Error('`opts.formData` must be true when `opts.bundle` is enabled.');
    }

    this.uploaderEvents = Object.create(null);
  }

  getOptions(file) {
    const overrides = this.uppy.getState().xhrUpload;
    const {
      headers
    } = this.opts;
    const opts = { ...this.opts,
      ...(overrides || {}),
      ...(file.xhrUpload || {}),
      headers: {}
    }; // Support for `headers` as a function, only in the XHRUpload settings.
    // Options set by other plugins in Uppy state or on the files themselves are still merged in afterward.
    //
    // ```js
    // headers: (file) => ({ expires: file.meta.expires })
    // ```

    if (typeof headers === 'function') {
      opts.headers = headers(file);
    } else {
      Object.assign(opts.headers, this.opts.headers);
    }

    if (overrides) {
      Object.assign(opts.headers, overrides.headers);
    }

    if (file.xhrUpload) {
      Object.assign(opts.headers, file.xhrUpload.headers);
    }

    return opts;
  } // eslint-disable-next-line class-methods-use-this


  addMetadata(formData, meta, opts) {
    const metaFields = Array.isArray(opts.metaFields) ? opts.metaFields : Object.keys(meta); // Send along all fields by default.

    metaFields.forEach(item => {
      formData.append(item, meta[item]);
    });
  }

  createFormDataUpload(file, opts) {
    const formPost = new FormData();
    this.addMetadata(formPost, file.meta, opts);
    const dataWithUpdatedType = setTypeInBlob(file);

    if (file.name) {
      formPost.append(opts.fieldName, dataWithUpdatedType, file.meta.name);
    } else {
      formPost.append(opts.fieldName, dataWithUpdatedType);
    }

    return formPost;
  }

  createBundledUpload(files, opts) {
    const formPost = new FormData();
    const {
      meta
    } = this.uppy.getState();
    this.addMetadata(formPost, meta, opts);
    files.forEach(file => {
      const options = this.getOptions(file);
      const dataWithUpdatedType = setTypeInBlob(file);

      if (file.name) {
        formPost.append(options.fieldName, dataWithUpdatedType, file.name);
      } else {
        formPost.append(options.fieldName, dataWithUpdatedType);
      }
    });
    return formPost;
  }

  upload(file, current, total) {
    const opts = this.getOptions(file);
    this.uppy.log(`uploading ${current} of ${total}`);
    return new Promise((resolve, reject) => {
      this.uppy.emit('upload-started', file);
      const data = opts.formData ? this.createFormDataUpload(file, opts) : file.data;
      const xhr = new XMLHttpRequest();
      this.uploaderEvents[file.id] = new EventTracker(this.uppy);
      const timer = new ProgressTimeout(opts.timeout, () => {
        xhr.abort();
        queuedRequest.done();
        const error = new Error(this.i18n('timedOut', {
          seconds: Math.ceil(opts.timeout / 1000)
        }));
        this.uppy.emit('upload-error', file, error);
        reject(error);
      });
      const id = nanoid();
      xhr.upload.addEventListener('loadstart', () => {
        this.uppy.log(`[XHRUpload] ${id} started`);
      });
      xhr.upload.addEventListener('progress', ev => {
        this.uppy.log(`[XHRUpload] ${id} progress: ${ev.loaded} / ${ev.total}`); // Begin checking for timeouts when progress starts, instead of loading,
        // to avoid timing out requests on browser concurrency queue

        timer.progress();

        if (ev.lengthComputable) {
          this.uppy.emit('upload-progress', file, {
            uploader: this,
            bytesUploaded: ev.loaded,
            bytesTotal: ev.total
          });
        }
      });
      xhr.addEventListener('load', ev => {
        this.uppy.log(`[XHRUpload] ${id} finished`);
        timer.done();
        queuedRequest.done();

        if (this.uploaderEvents[file.id]) {
          this.uploaderEvents[file.id].remove();
          this.uploaderEvents[file.id] = null;
        }

        if (opts.validateStatus(ev.target.status, xhr.responseText, xhr)) {
          const body = opts.getResponseData(xhr.responseText, xhr);
          const uploadURL = body[opts.responseUrlFieldName];
          const uploadResp = {
            status: ev.target.status,
            body,
            uploadURL
          };
          this.uppy.emit('upload-success', file, uploadResp);

          if (uploadURL) {
            this.uppy.log(`Download ${file.name} from ${uploadURL}`);
          }

          return resolve(file);
        }

        const body = opts.getResponseData(xhr.responseText, xhr);
        const error = buildResponseError(xhr, opts.getResponseError(xhr.responseText, xhr));
        const response = {
          status: ev.target.status,
          body
        };
        this.uppy.emit('upload-error', file, error, response);
        return reject(error);
      });
      xhr.addEventListener('error', () => {
        this.uppy.log(`[XHRUpload] ${id} errored`);
        timer.done();
        queuedRequest.done();

        if (this.uploaderEvents[file.id]) {
          this.uploaderEvents[file.id].remove();
          this.uploaderEvents[file.id] = null;
        }

        const error = buildResponseError(xhr, opts.getResponseError(xhr.responseText, xhr));
        this.uppy.emit('upload-error', file, error);
        return reject(error);
      });
      xhr.open(opts.method.toUpperCase(), opts.endpoint, true); // IE10 does not allow setting `withCredentials` and `responseType`
      // before `open()` is called.

      xhr.withCredentials = opts.withCredentials;

      if (opts.responseType !== '') {
        xhr.responseType = opts.responseType;
      }

      const queuedRequest = this.requests.run(() => {
        this.uppy.emit('upload-started', file); // When using an authentication system like JWT, the bearer token goes as a header. This
        // header needs to be fresh each time the token is refreshed so computing and setting the
        // headers just before the upload starts enables this kind of authentication to work properly.
        // Otherwise, half-way through the list of uploads the token could be stale and the upload would fail.

        const currentOpts = this.getOptions(file);
        Object.keys(currentOpts.headers).forEach(header => {
          xhr.setRequestHeader(header, currentOpts.headers[header]);
        });
        xhr.send(data);
        return () => {
          timer.done();
          xhr.abort();
        };
      });
      this.onFileRemove(file.id, () => {
        queuedRequest.abort();
        reject(new Error('File removed'));
      });
      this.onCancelAll(file.id, () => {
        queuedRequest.abort();
        reject(new Error('Upload cancelled'));
      });
    });
  }

  uploadRemote(file) {
    const opts = this.getOptions(file);
    return new Promise((resolve, reject) => {
      this.uppy.emit('upload-started', file);
      const fields = {};
      const metaFields = Array.isArray(opts.metaFields) ? opts.metaFields // Send along all fields by default.
      : Object.keys(file.meta);
      metaFields.forEach(name => {
        fields[name] = file.meta[name];
      });
      const Client = file.remote.providerOptions.provider ? Provider : RequestClient;
      const client = new Client(this.uppy, file.remote.providerOptions);
      client.post(file.remote.url, { ...file.remote.body,
        endpoint: opts.endpoint,
        size: file.data.size,
        fieldname: opts.fieldName,
        metadata: fields,
        httpMethod: opts.method,
        useFormData: opts.formData,
        headers: opts.headers
      }).then(res => {
        const {
          token
        } = res;
        const host = getSocketHost(file.remote.companionUrl);
        const socket = new Socket({
          target: `${host}/api/${token}`,
          autoOpen: false
        });
        this.uploaderEvents[file.id] = new EventTracker(this.uppy);
        this.onFileRemove(file.id, () => {
          socket.send('cancel', {});
          queuedRequest.abort();
          resolve(`upload ${file.id} was removed`);
        });
        this.onCancelAll(file.id, () => {
          socket.send('cancel', {});
          queuedRequest.abort();
          resolve(`upload ${file.id} was canceled`);
        });
        this.onRetry(file.id, () => {
          socket.send('pause', {});
          socket.send('resume', {});
        });
        this.onRetryAll(file.id, () => {
          socket.send('pause', {});
          socket.send('resume', {});
        });
        socket.on('progress', progressData => emitSocketProgress(this, progressData, file));
        socket.on('success', data => {
          const body = opts.getResponseData(data.response.responseText, data.response);
          const uploadURL = body[opts.responseUrlFieldName];
          const uploadResp = {
            status: data.response.status,
            body,
            uploadURL
          };
          this.uppy.emit('upload-success', file, uploadResp);
          queuedRequest.done();

          if (this.uploaderEvents[file.id]) {
            this.uploaderEvents[file.id].remove();
            this.uploaderEvents[file.id] = null;
          }

          return resolve();
        });
        socket.on('error', errData => {
          const resp = errData.response;
          const error = resp ? opts.getResponseError(resp.responseText, resp) : Object.assign(new Error(errData.error.message), {
            cause: errData.error
          });
          this.uppy.emit('upload-error', file, error);
          queuedRequest.done();

          if (this.uploaderEvents[file.id]) {
            this.uploaderEvents[file.id].remove();
            this.uploaderEvents[file.id] = null;
          }

          reject(error);
        });
        const queuedRequest = this.requests.run(() => {
          socket.open();

          if (file.isPaused) {
            socket.send('pause', {});
          }

          return () => socket.close();
        });
      }).catch(err => {
        this.uppy.emit('upload-error', file, err);
        reject(err);
      });
    });
  }

  uploadBundle(files) {
    return new Promise((resolve, reject) => {
      const {
        endpoint
      } = this.opts;
      const {
        method
      } = this.opts;
      const optsFromState = this.uppy.getState().xhrUpload;
      const formData = this.createBundledUpload(files, { ...this.opts,
        ...(optsFromState || {})
      });
      const xhr = new XMLHttpRequest();
      const timer = new ProgressTimeout(this.opts.timeout, () => {
        xhr.abort();
        const error = new Error(this.i18n('timedOut', {
          seconds: Math.ceil(this.opts.timeout / 1000)
        }));
        emitError(error);
        reject(error);
      });

      const emitError = error => {
        files.forEach(file => {
          this.uppy.emit('upload-error', file, error);
        });
      };

      xhr.upload.addEventListener('loadstart', () => {
        this.uppy.log('[XHRUpload] started uploading bundle');
        timer.progress();
      });
      xhr.upload.addEventListener('progress', ev => {
        timer.progress();
        if (!ev.lengthComputable) return;
        files.forEach(file => {
          this.uppy.emit('upload-progress', file, {
            uploader: this,
            bytesUploaded: ev.loaded / ev.total * file.size,
            bytesTotal: file.size
          });
        });
      });
      xhr.addEventListener('load', ev => {
        timer.done();

        if (this.opts.validateStatus(ev.target.status, xhr.responseText, xhr)) {
          const body = this.opts.getResponseData(xhr.responseText, xhr);
          const uploadResp = {
            status: ev.target.status,
            body
          };
          files.forEach(file => {
            this.uppy.emit('upload-success', file, uploadResp);
          });
          return resolve();
        }

        const error = this.opts.getResponseError(xhr.responseText, xhr) || new Error('Upload error');
        error.request = xhr;
        emitError(error);
        return reject(error);
      });
      xhr.addEventListener('error', () => {
        timer.done();
        const error = this.opts.getResponseError(xhr.responseText, xhr) || new Error('Upload error');
        emitError(error);
        return reject(error);
      });
      this.uppy.on('cancel-all', () => {
        timer.done();
        xhr.abort();
      });
      xhr.open(method.toUpperCase(), endpoint, true); // IE10 does not allow setting `withCredentials` and `responseType`
      // before `open()` is called.

      xhr.withCredentials = this.opts.withCredentials;

      if (this.opts.responseType !== '') {
        xhr.responseType = this.opts.responseType;
      }

      Object.keys(this.opts.headers).forEach(header => {
        xhr.setRequestHeader(header, this.opts.headers[header]);
      });
      xhr.send(formData);
      files.forEach(file => {
        this.uppy.emit('upload-started', file);
      });
    });
  }

  uploadFiles(files) {
    const promises = files.map((file, i) => {
      const current = parseInt(i, 10) + 1;
      const total = files.length;

      if (file.error) {
        return Promise.reject(new Error(file.error));
      }

      if (file.isRemote) {
        return this.uploadRemote(file, current, total);
      }

      return this.upload(file, current, total);
    });
    return settle(promises);
  }

  onFileRemove(fileID, cb) {
    this.uploaderEvents[fileID].on('file-removed', file => {
      if (fileID === file.id) cb(file.id);
    });
  }

  onRetry(fileID, cb) {
    this.uploaderEvents[fileID].on('upload-retry', targetFileID => {
      if (fileID === targetFileID) {
        cb();
      }
    });
  }

  onRetryAll(fileID, cb) {
    this.uploaderEvents[fileID].on('retry-all', () => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }

  onCancelAll(fileID, cb) {
    this.uploaderEvents[fileID].on('cancel-all', () => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }

  handleUpload(fileIDs) {
    if (fileIDs.length === 0) {
      this.uppy.log('[XHRUpload] No files to upload!');
      return Promise.resolve();
    } // No limit configured by the user, and no RateLimitedQueue passed in by a "parent" plugin
    // (basically just AwsS3) using the internal symbol


    if (this.opts.limit === 0 && !this.opts[internalRateLimitedQueue]) {
      this.uppy.log('[XHRUpload] When uploading multiple files at once, consider setting the `limit` option (to `10` for example), to limit the number of concurrent uploads, which helps prevent memory and network issues: https://uppy.io/docs/xhr-upload/#limit-0', 'warning');
    }

    this.uppy.log('[XHRUpload] Uploading...');
    const files = fileIDs.map(fileID => this.uppy.getFile(fileID));

    if (this.opts.bundle) {
      // if bundle: true, we don’t support remote uploads
      const isSomeFileRemote = files.some(file => file.isRemote);

      if (isSomeFileRemote) {
        throw new Error('Can’t upload remote files when the `bundle: true` option is set');
      }

      if (typeof this.opts.headers === 'function') {
        throw new TypeError('`headers` may not be a function when the `bundle: true` option is set');
      }

      return this.uploadBundle(files);
    }

    return this.uploadFiles(files).then(() => null);
  }

  install() {
    if (this.opts.bundle) {
      const {
        capabilities
      } = this.uppy.getState();
      this.uppy.setState({
        capabilities: { ...capabilities,
          individualCancellation: false
        }
      });
    }

    this.uppy.addUploader(this.handleUpload);
  }

  uninstall() {
    if (this.opts.bundle) {
      const {
        capabilities
      } = this.uppy.getState();
      this.uppy.setState({
        capabilities: { ...capabilities,
          individualCancellation: true
        }
      });
    }

    this.uppy.removeUploader(this.handleUpload);
  }

}, _class.VERSION = "2.0.7", _temp);

/***/ }),

/***/ "./node_modules/@uppy/xhr-upload/lib/locale.js":
/*!*****************************************************!*\
  !*** ./node_modules/@uppy/xhr-upload/lib/locale.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


module.exports = {
  strings: {
    // Shown in the Informer if an upload is being canceled because it stalled for too long.
    timedOut: 'Upload stalled for %{seconds} seconds, aborting.'
  }
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/uppy.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/uppy.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
//
//
//
//
//
//
//
var Uppy = __webpack_require__(/*! @uppy/core */ "./node_modules/@uppy/core/lib/index.js");

var Dashboard = __webpack_require__(/*! @uppy/dashboard */ "./node_modules/@uppy/dashboard/lib/index.js");

var XHRUpload = __webpack_require__(/*! @uppy/xhr-upload */ "./node_modules/@uppy/xhr-upload/lib/index.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: ['inline', 'inlineHeight'],
  mounted: function mounted() {
    var _this = this;

    var uppy = new Uppy({
      id: 'uppyWizard',
      autoProceed: true,
      debug: true,
      allowMultipleUploads: true,
      restrictions: {
        maxFileSize: false,
        allowedFileTypes: ['image/*', '.pdf', '.eps', '.ai', '.svg', '.dxf']
      }
    });
    var dashboardSettings = {
      inline: this.inline,
      target: '.DashboardContainer',
      replaceTargetContent: true,
      showProgressDetails: true,
      proudlyDisplayPoweredByUppy: false,
      showLinkToFileUploadResult: false,
      showSelectedFiles: this.inline,
      trigger: '#open_uppy_modal',
      closeAfterFinish: true,
      browserBackButtonClose: true,
      closeModalOnClickOutside: true
    };

    if (this.inline) {
      dashboardSettings.height = this.inlineHeight;
    }

    uppy.use(Dashboard, dashboardSettings);
    uppy.use(XHRUpload, {
      endpoint: window.rootUrl + 'artwork',
      headers: {
        'X-CSRF-TOKEN': window.token
      }
    });
    uppy.on('upload-success', function (file, body) {
      _this.$emit('add-artwork', {
        name: file.name,
        s3Path: body.path
      });
    });
  }
});

/***/ }),

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/buffer/index.js":
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js")
var ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
var isArray = __webpack_require__(/*! isarray */ "./node_modules/isarray/index.js")

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = __webpack_require__.g.TYPED_ARRAY_SUPPORT !== undefined
  ? __webpack_require__.g.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}


/***/ }),

/***/ "./node_modules/classnames/index.js":
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				if (arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				}
			} else if (argType === 'object') {
				if (arg.toString === Object.prototype.toString) {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				} else {
					classes.push(arg.toString());
				}
			}
		}

		return classes.join(' ');
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[2]!./node_modules/@uppy/core/dist/style.css?vue&type=style&index=1&lang=css&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[2]!./node_modules/@uppy/core/dist/style.css?vue&type=style&index=1&lang=css& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/**\n* General Uppy styles that apply to everything inside the .uppy-Root container\n*/\n.uppy-Root {\n  position: relative;\n  box-sizing: border-box;\n  color: #333;\n  font-family: -apple-system, blinkmacsystemfont, \"Segoe UI\", helvetica, arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  line-height: 1;\n  text-align: left;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n[dir=rtl] .uppy-Root,\n.uppy-Root[dir=rtl] {\n  text-align: right;\n}\n.uppy-Root *,\n.uppy-Root *::before,\n.uppy-Root *::after {\n  box-sizing: inherit;\n}\n.uppy-Root [hidden] {\n  display: none;\n}\n.uppy-u-reset {\n  top: auto;\n  left: auto;\n  z-index: auto;\n  display: inline;\n  float: none;\n  clear: none;\n  min-width: 0;\n  max-width: none;\n  min-height: 0;\n  max-height: none;\n  margin: 0;\n  padding: 0;\n  overflow: visible;\n  overflow-x: visible;\n  overflow-y: visible;\n  color: inherit;\n  font-weight: normal;\n  font-size: inherit;\n  font-family: inherit;\n  font-style: normal;\n  font-variant: normal;\n  font-stretch: normal;\n  line-height: 1;\n  letter-spacing: normal;\n  white-space: normal;\n  text-align: left;\n  text-transform: none;\n  text-decoration: none;\n  text-indent: 0;\n  text-shadow: none;\n  vertical-align: baseline;\n  -webkit-hyphens: none;\n          -ms-hyphens: none;\n      hyphens: none;\n  unicode-bidi: normal;\n  list-style: none;\n  empty-cells: show;\n  background: none;\n  border: 0;\n  border: medium none currentColor;\n  border-radius: 0;\n  -o-border-image: none;\n     border-image: none;\n  border-collapse: separate;\n  border-spacing: 0;\n  outline: medium none invert;\n  box-shadow: none;\n  transform: none;\n  transform-origin: 50% 50% 0;\n  transform-style: flat;\n  -webkit-backface-visibility: visible;\n          backface-visibility: visible;\n  visibility: visible;\n  cursor: auto;\n  opacity: 1;\n  transition: none 0s ease 0s;\n  -webkit-appearance: none;\n}\n[dir=rtl] .uppy-u-reset {\n  text-align: right;\n}\n.uppy-c-textInput {\n  padding: 6px 8px;\n  font-size: 14px;\n  line-height: 1.5;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n}\n.uppy-size--md .uppy-c-textInput {\n  padding: 8px 10px;\n}\n.uppy-c-textInput:focus {\n  border-color: rgba(34, 117, 215, 0.6);\n  outline: none;\n  box-shadow: 0 0 0 3px rgba(34, 117, 215, 0.15);\n}\n[data-uppy-theme=dark] .uppy-c-textInput {\n  color: #eaeaea;\n  background-color: #333;\n  border-color: #333;\n}\n[data-uppy-theme=dark] .uppy-c-textInput:focus {\n  border-color: #525252;\n  box-shadow: none;\n}\n.uppy-c-icon {\n  display: inline-block;\n  max-width: 100%;\n  max-height: 100%;\n  overflow: hidden;\n  fill: currentColor;\n}\n.uppy-c-btn {\n  display: inline-block;\n  font-weight: 500;\n  font-size: 16px;\n  font-family: inherit;\n  line-height: 1;\n  white-space: nowrap;\n  text-align: center;\n  vertical-align: middle;\n  transition-duration: 0.3s;\n  transition-property: background-color, color;\n  -webkit-user-select: none;\n          -moz-user-select: none;\n           -ms-user-select: none;\n       user-select: none;\n}\n[dir=rtl] .uppy-c-btn {\n  text-align: center;\n}\n.uppy-c-btn:not(:disabled):not(.disabled) {\n  cursor: pointer;\n}\n.uppy-c-btn::-moz-focus-inner {\n  border: 0;\n}\n.uppy-c-btn-primary {\n  padding: 10px 18px;\n  color: #fff;\n  font-size: 14px;\n  background-color: #2275d7;\n  border-radius: 4px;\n}\n.uppy-c-btn-primary:hover {\n  background-color: #1b5dab;\n}\n.uppy-c-btn-primary:focus {\n  outline: none;\n  box-shadow: 0 0 0 3px rgba(34, 117, 215, 0.4);\n}\n.uppy-size--md .uppy-c-btn-primary {\n  padding: 13px 22px;\n}\n[data-uppy-theme=dark] .uppy-c-btn-primary {\n  color: #eaeaea;\n}\n[data-uppy-theme=dark] .uppy-c-btn-primary:focus {\n  outline: none;\n}\n[data-uppy-theme=dark] .uppy-c-btn-primary::-moz-focus-inner {\n  border: 0;\n}\n[data-uppy-theme=dark] .uppy-c-btn-primary:focus {\n  box-shadow: 0 0 0 2px rgba(170, 225, 255, 0.85);\n}\n.uppy-c-btn-link {\n  padding: 10px 15px;\n  color: #525252;\n  font-size: 14px;\n  line-height: 1;\n  background-color: transparent;\n  border-radius: 4px;\n}\n.uppy-c-btn-link:hover {\n  color: #333;\n}\n.uppy-c-btn-link:focus {\n  outline: none;\n  box-shadow: 0 0 0 3px rgba(34, 117, 215, 0.25);\n}\n.uppy-size--md .uppy-c-btn-link {\n  padding: 13px 18px;\n}\n[data-uppy-theme=dark] .uppy-c-btn-link {\n  color: #eaeaea;\n}\n[data-uppy-theme=dark] .uppy-c-btn-link:focus {\n  outline: none;\n}\n[data-uppy-theme=dark] .uppy-c-btn-link::-moz-focus-inner {\n  border: 0;\n}\n[data-uppy-theme=dark] .uppy-c-btn-link:focus {\n  box-shadow: 0 0 0 2px rgba(170, 225, 255, 0.85);\n}\n[data-uppy-theme=dark] .uppy-c-btn-link:hover {\n  color: #939393;\n}\n.uppy-c-btn--small {\n  padding: 7px 16px;\n  font-size: 0.9em;\n  border-radius: 2px;\n}\n.uppy-size--md .uppy-c-btn--small {\n  padding: 8px 10px;\n  border-radius: 2px;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[2]!./node_modules/@uppy/dashboard/dist/style.css?vue&type=style&index=0&lang=css&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[2]!./node_modules/@uppy/dashboard/dist/style.css?vue&type=style&index=0&lang=css& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "@charset \"UTF-8\";\n.uppy-Informer {\n  position: absolute;\n  right: 0;\n  bottom: 60px;\n  left: 0;\n  z-index: 1005;\n  text-align: center;\n}\n.uppy-Informer span > div {\n  margin-bottom: 6px;\n}\n.uppy-Informer-animated {\n  z-index: -1000;\n  transform: translateY(350%);\n  opacity: 0;\n  transition: all 300ms ease-in;\n}\n.uppy-Informer p {\n  display: inline-block;\n  max-width: 90%;\n  margin: 0;\n  padding: 0;\n  padding: 6px 15px;\n  color: #fff;\n  font-weight: 400;\n  font-size: 12px;\n  line-height: 1.4;\n  background-color: #757575;\n  border-radius: 18px;\n}\n.uppy-size--md .uppy-Informer p {\n  max-width: 500px;\n  padding: 10px 20px;\n  font-size: 14px;\n  line-height: 1.3;\n}\n[data-uppy-theme=dark] .uppy-Informer p {\n  background-color: #333;\n}\n[dir=\"ltr\"] .uppy-Informer p span{\n  left: 3px;\n}\n[dir=\"rtl\"] .uppy-Informer p span{\n  right: 3px;\n}\n[dir=\"ltr\"] .uppy-Informer p span{\n  margin-left: -1px;\n}\n[dir=\"rtl\"] .uppy-Informer p span{\n  margin-right: -1px;\n}\n.uppy-Informer p span {\n  position: relative;\n  top: -1px;\n  display: inline-block;\n  width: 13px;\n  height: 13px;\n  color: #525252;\n  font-size: 10px;\n  line-height: 12px;\n  vertical-align: middle;\n  background-color: #fff;\n  border-radius: 50%;\n}\n.uppy-Informer p span:hover {\n  cursor: help;\n}\n.uppy-Informer p span::after {\n  line-height: 1.3;\n  word-wrap: break-word;\n}\n\n/* -------------------------------------------------------------------\n  Microtip\n\n  Modern, lightweight css-only tooltips\n  Just 1kb minified and gzipped\n\n  @author Ghosh\n  @package Microtip\n\n----------------------------------------------------------------------\n  1. Base Styles\n  2. Direction Modifiers\n  3. Position Modifiers\n-------------------------------------------------------------------- */\n/* ------------------------------------------------\n  [1] Base Styles\n------------------------------------------------- */\n.uppy-Root [aria-label][role~=tooltip] {\n  position: relative;\n}\n.uppy-Root [aria-label][role~=tooltip]::before,\n.uppy-Root [aria-label][role~=tooltip]::after {\n  position: absolute;\n  z-index: 10;\n  box-sizing: border-box;\n  transform: translate3d(0, 0, 0);\n  transform-origin: top;\n  -webkit-backface-visibility: hidden;\n  backface-visibility: hidden;\n  opacity: 0;\n  transition: all var(--microtip-transition-duration, 0.18s) var(--microtip-transition-easing, ease-in-out) var(--microtip-transition-delay, 0s);\n  pointer-events: none;\n  will-change: transform;\n}\n.uppy-Root [aria-label][role~=tooltip]::before {\n  background-size: 100% auto !important;\n  content: \"\";\n}\n.uppy-Root [aria-label][role~=tooltip]::after {\n  box-sizing: content-box;\n  padding: 0.5em 1em;\n  color: #fff;\n  font-weight: var(--microtip-font-weight, normal);\n  font-size: var(--microtip-font-size, 13px);\n  white-space: nowrap;\n  text-transform: var(--microtip-text-transform, none);\n  background: rgba(17, 17, 17, 0.9);\n  border-radius: 4px;\n  content: attr(aria-label);\n}\n.uppy-Root [aria-label][role~=tooltip]:hover::before,\n.uppy-Root [aria-label][role~=tooltip]:hover::after,\n.uppy-Root [aria-label][role~=tooltip]:focus::before,\n.uppy-Root [aria-label][role~=tooltip]:focus::after {\n  opacity: 1;\n  pointer-events: auto;\n}\n\n/* ------------------------------------------------\n  [2] Position Modifiers\n------------------------------------------------- */\n.uppy-Root [role~=tooltip][data-microtip-position|=top]::before {\n  bottom: 100%;\n  left: 50%;\n  width: 18px;\n  height: 6px;\n  margin-bottom: 5px;\n  background: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2236px%22%20height%3D%2212px%22%3E%3Cpath%20fill%3D%22rgba%2817,%2017,%2017,%200.9%29%22%20transform%3D%22rotate%280%29%22%20d%3D%22M2.658,0.000%20C-13.615,0.000%2050.938,0.000%2034.662,0.000%20C28.662,0.000%2023.035,12.002%2018.660,12.002%20C14.285,12.002%208.594,0.000%202.658,0.000%20Z%22/%3E%3C/svg%3E\") no-repeat;\n  transform: translate3d(-50%, 0, 0);\n}\n.uppy-Root [role~=tooltip][data-microtip-position|=top]::after {\n  bottom: 100%;\n  left: 50%;\n  margin-bottom: 11px;\n  transform: translate3d(-50%, 0, 0);\n}\n.uppy-Root [role~=tooltip][data-microtip-position|=top]:hover::before {\n  transform: translate3d(-50%, -5px, 0);\n}\n.uppy-Root [role~=tooltip][data-microtip-position=top]:hover::after {\n  transform: translate3d(-50%, -5px, 0);\n}\n\n/* ------------------------------------------------\n  [2.1] Top Left\n------------------------------------------------- */\n.uppy-Root [role~=tooltip][data-microtip-position=top-left]::after {\n  bottom: 100%;\n  transform: translate3d(calc(-100% + 16px), 0, 0);\n}\n.uppy-Root [role~=tooltip][data-microtip-position=top-left]:hover::after {\n  transform: translate3d(calc(-100% + 16px), -5px, 0);\n}\n\n/* ------------------------------------------------\n  [2.2] Top Right\n------------------------------------------------- */\n.uppy-Root [role~=tooltip][data-microtip-position=top-right]::after {\n  bottom: 100%;\n  transform: translate3d(calc(0% - 16px), 0, 0);\n}\n.uppy-Root [role~=tooltip][data-microtip-position=top-right]:hover::after {\n  transform: translate3d(calc(0% - 16px), -5px, 0);\n}\n\n/* ------------------------------------------------\n  [2.3] Bottom\n------------------------------------------------- */\n.uppy-Root [role~=tooltip][data-microtip-position|=bottom]::before {\n  top: 100%;\n  bottom: auto;\n  left: 50%;\n  width: 18px;\n  height: 6px;\n  margin-top: 5px;\n  margin-bottom: 0;\n  background: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2236px%22%20height%3D%2212px%22%3E%3Cpath%20fill%3D%22rgba%2817,%2017,%2017,%200.9%29%22%20transform%3D%22rotate%28180%2018%206%29%22%20d%3D%22M2.658,0.000%20C-13.615,0.000%2050.938,0.000%2034.662,0.000%20C28.662,0.000%2023.035,12.002%2018.660,12.002%20C14.285,12.002%208.594,0.000%202.658,0.000%20Z%22/%3E%3C/svg%3E\") no-repeat;\n  transform: translate3d(-50%, -10px, 0);\n}\n.uppy-Root [role~=tooltip][data-microtip-position|=bottom]::after {\n  top: 100%;\n  left: 50%;\n  margin-top: 11px;\n  transform: translate3d(-50%, -10px, 0);\n}\n.uppy-Root [role~=tooltip][data-microtip-position|=bottom]:hover::before {\n  transform: translate3d(-50%, 0, 0);\n}\n.uppy-Root [role~=tooltip][data-microtip-position=bottom]:hover::after {\n  transform: translate3d(-50%, 0, 0);\n}\n\n/* ------------------------------------------------\n  [2.4] Bottom Left\n------------------------------------------------- */\n.uppy-Root [role~=tooltip][data-microtip-position=bottom-left]::after {\n  top: 100%;\n  transform: translate3d(calc(-100% + 16px), -10px, 0);\n}\n.uppy-Root [role~=tooltip][data-microtip-position=bottom-left]:hover::after {\n  transform: translate3d(calc(-100% + 16px), 0, 0);\n}\n\n/* ------------------------------------------------\n  [2.5] Bottom Right\n------------------------------------------------- */\n.uppy-Root [role~=tooltip][data-microtip-position=bottom-right]::after {\n  top: 100%;\n  transform: translate3d(calc(0% - 16px), -10px, 0);\n}\n.uppy-Root [role~=tooltip][data-microtip-position=bottom-right]:hover::after {\n  transform: translate3d(calc(0% - 16px), 0, 0);\n}\n\n/* ------------------------------------------------\n  [2.6] Left\n------------------------------------------------- */\n.uppy-Root [role~=tooltip][data-microtip-position=left]::before,\n.uppy-Root [role~=tooltip][data-microtip-position=left]::after {\n  top: 50%;\n  right: 100%;\n  bottom: auto;\n  left: auto;\n  transform: translate3d(10px, -50%, 0);\n}\n.uppy-Root [role~=tooltip][data-microtip-position=left]::before {\n  width: 6px;\n  height: 18px;\n  margin-right: 5px;\n  margin-bottom: 0;\n  background: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212px%22%20height%3D%2236px%22%3E%3Cpath%20fill%3D%22rgba%2817,%2017,%2017,%200.9%29%22%20transform%3D%22rotate%28-90%2018%2018%29%22%20d%3D%22M2.658,0.000%20C-13.615,0.000%2050.938,0.000%2034.662,0.000%20C28.662,0.000%2023.035,12.002%2018.660,12.002%20C14.285,12.002%208.594,0.000%202.658,0.000%20Z%22/%3E%3C/svg%3E\") no-repeat;\n}\n.uppy-Root [role~=tooltip][data-microtip-position=left]::after {\n  margin-right: 11px;\n}\n.uppy-Root [role~=tooltip][data-microtip-position=left]:hover::before,\n.uppy-Root [role~=tooltip][data-microtip-position=left]:hover::after {\n  transform: translate3d(0, -50%, 0);\n}\n\n/* ------------------------------------------------\n  [2.7] Right\n------------------------------------------------- */\n.uppy-Root [role~=tooltip][data-microtip-position=right]::before,\n.uppy-Root [role~=tooltip][data-microtip-position=right]::after {\n  top: 50%;\n  bottom: auto;\n  left: 100%;\n  transform: translate3d(-10px, -50%, 0);\n}\n.uppy-Root [role~=tooltip][data-microtip-position=right]::before {\n  width: 6px;\n  height: 18px;\n  margin-bottom: 0;\n  margin-left: 5px;\n  background: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212px%22%20height%3D%2236px%22%3E%3Cpath%20fill%3D%22rgba%2817,%2017,%2017,%200.9%29%22%20transform%3D%22rotate%2890%206%206%29%22%20d%3D%22M2.658,0.000%20C-13.615,0.000%2050.938,0.000%2034.662,0.000%20C28.662,0.000%2023.035,12.002%2018.660,12.002%20C14.285,12.002%208.594,0.000%202.658,0.000%20Z%22/%3E%3C/svg%3E\") no-repeat;\n}\n.uppy-Root [role~=tooltip][data-microtip-position=right]::after {\n  margin-left: 11px;\n}\n.uppy-Root [role~=tooltip][data-microtip-position=right]:hover::before,\n.uppy-Root [role~=tooltip][data-microtip-position=right]:hover::after {\n  transform: translate3d(0, -50%, 0);\n}\n\n/* ------------------------------------------------\n  [3] Size\n------------------------------------------------- */\n.uppy-Root [role~=tooltip][data-microtip-size=small]::after {\n  width: 80px;\n  white-space: initial;\n}\n.uppy-Root [role~=tooltip][data-microtip-size=medium]::after {\n  width: 150px;\n  white-space: initial;\n}\n.uppy-Root [role~=tooltip][data-microtip-size=large]::after {\n  width: 260px;\n  white-space: initial;\n}\n.uppy-StatusBar {\n  position: relative;\n  z-index: 1001;\n  display: flex;\n  height: 46px;\n  color: #fff;\n  font-weight: 400;\n  font-size: 12px;\n  line-height: 40px;\n  background-color: #fff;\n  transition: height 0.2s;\n}\n[data-uppy-theme=dark] .uppy-StatusBar {\n  background-color: #1f1f1f;\n}\n.uppy-StatusBar::before {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 2px;\n  background-color: #eaeaea;\n  content: \"\";\n}\n[data-uppy-theme=dark] .uppy-StatusBar::before {\n  background-color: #757575;\n}\n.uppy-StatusBar[aria-hidden=true] {\n  height: 0;\n  overflow-y: hidden;\n}\n.uppy-StatusBar.is-complete .uppy-StatusBar-progress {\n  background-color: #1bb240;\n}\n.uppy-StatusBar.is-error .uppy-StatusBar-progress {\n  background-color: #e32437;\n}\n.uppy-StatusBar.is-complete .uppy-StatusBar-statusIndicator {\n  color: #1bb240;\n}\n.uppy-StatusBar.is-error .uppy-StatusBar-statusIndicator {\n  color: #e32437;\n}\n.uppy-StatusBar:not([aria-hidden=true]).is-waiting {\n  height: 65px;\n  background-color: #fff;\n  border-top: 1px solid #eaeaea;\n}\n[data-uppy-theme=dark] .uppy-StatusBar:not([aria-hidden=true]).is-waiting {\n  background-color: #1f1f1f;\n  border-top: 1px solid #333;\n}\n.uppy-StatusBar-progress {\n  position: absolute;\n  z-index: 1001;\n  height: 2px;\n  background-color: #2275d7;\n  transition: background-color, width 0.3s ease-out;\n}\n.uppy-StatusBar-progress.is-indeterminate {\n  background-image: linear-gradient(45deg, rgba(0, 0, 0, 0.3) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.3) 75%, transparent 75%, transparent);\n  background-size: 64px 64px;\n  -webkit-animation: uppy-StatusBar-ProgressStripes 1s linear infinite;\n          animation: uppy-StatusBar-ProgressStripes 1s linear infinite;\n}\n@-webkit-keyframes uppy-StatusBar-ProgressStripes {\nfrom {\n    background-position: 0 0;\n}\nto {\n    background-position: 64px 0;\n}\n}\n@keyframes uppy-StatusBar-ProgressStripes {\nfrom {\n    background-position: 0 0;\n}\nto {\n    background-position: 64px 0;\n}\n}\n.uppy-StatusBar.is-preprocessing .uppy-StatusBar-progress,\n.uppy-StatusBar.is-postprocessing .uppy-StatusBar-progress {\n  background-color: #f6a623;\n}\n.uppy-StatusBar.is-waiting .uppy-StatusBar-progress {\n  display: none;\n}\n[dir=\"ltr\"] .uppy-StatusBar-content{\n  padding-left: 10px;\n}\n[dir=\"rtl\"] .uppy-StatusBar-content{\n  padding-right: 10px;\n}\n.uppy-StatusBar-content {\n  position: relative;\n  z-index: 1002;\n  display: flex;\n  align-items: center;\n  height: 100%;\n  color: #333;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n[dir=\"ltr\"] .uppy-size--md .uppy-StatusBar-content{\n  padding-left: 15px;\n}\n[dir=\"rtl\"] .uppy-size--md .uppy-StatusBar-content{\n  padding-right: 15px;\n}\n[data-uppy-theme=dark] .uppy-StatusBar-content {\n  color: #eaeaea;\n}\n[dir=\"ltr\"] .uppy-StatusBar-status{\n  padding-right: 0.3em;\n}\n[dir=\"rtl\"] .uppy-StatusBar-status{\n  padding-left: 0.3em;\n}\n.uppy-StatusBar-status {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  font-weight: normal;\n  line-height: 1.4;\n}\n.uppy-StatusBar-statusPrimary {\n  font-weight: 500;\n  line-height: 1;\n  display: flex;\n}\n.uppy-StatusBar-statusPrimary button.uppy-StatusBar-details {\n  margin-left: 5px;\n}\n[data-uppy-theme=dark] .uppy-StatusBar-statusPrimary {\n  color: #eaeaea;\n}\n.uppy-StatusBar-statusSecondary {\n  display: inline-block;\n  margin-top: 1px;\n  color: #757575;\n  font-size: 11px;\n  line-height: 1.2;\n  white-space: nowrap;\n}\n[data-uppy-theme=dark] .uppy-StatusBar-statusSecondary {\n  color: #bbb;\n}\n[dir=\"ltr\"] .uppy-StatusBar-statusSecondaryHint{\n  margin-right: 5px;\n}\n[dir=\"rtl\"] .uppy-StatusBar-statusSecondaryHint{\n  margin-left: 5px;\n}\n.uppy-StatusBar-statusSecondaryHint {\n  display: inline-block;\n  line-height: 1;\n  vertical-align: middle;\n}\n[dir=\"ltr\"] .uppy-size--md .uppy-StatusBar-statusSecondaryHint{\n  margin-right: 8px;\n}\n[dir=\"rtl\"] .uppy-size--md .uppy-StatusBar-statusSecondaryHint{\n  margin-left: 8px;\n}\n[dir=\"ltr\"] .uppy-StatusBar-statusIndicator{\n  margin-right: 7px;\n}\n[dir=\"rtl\"] .uppy-StatusBar-statusIndicator{\n  margin-left: 7px;\n}\n.uppy-StatusBar-statusIndicator {\n  position: relative;\n  top: 1px;\n  color: #525252;\n}\n.uppy-StatusBar-statusIndicator svg {\n  vertical-align: text-bottom;\n}\n[dir=\"ltr\"] .uppy-StatusBar-actions{\n  right: 10px;\n}\n[dir=\"rtl\"] .uppy-StatusBar-actions{\n  left: 10px;\n}\n.uppy-StatusBar-actions {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  z-index: 1004;\n  display: flex;\n  align-items: center;\n}\n.uppy-StatusBar.is-waiting .uppy-StatusBar-actions {\n  position: static;\n  width: 100%;\n  height: 100%;\n  padding: 0 15px;\n  background-color: #fafafa;\n}\n[data-uppy-theme=dark] .uppy-StatusBar.is-waiting .uppy-StatusBar-actions {\n  background-color: #1f1f1f;\n}\n.uppy-StatusBar:not([aria-hidden=true]).is-waiting.has-ghosts {\n  flex-direction: column;\n  height: 90px;\n}\n.uppy-size--md .uppy-StatusBar:not([aria-hidden=true]).is-waiting.has-ghosts {\n  flex-direction: row;\n  height: 65px;\n}\n.uppy-StatusBar:not([aria-hidden=true]).is-waiting.has-ghosts .uppy-StatusBar-actions {\n  flex-direction: column;\n  justify-content: center;\n}\n.uppy-size--md .uppy-StatusBar:not([aria-hidden=true]).is-waiting.has-ghosts .uppy-StatusBar-actions {\n  flex-direction: row;\n  justify-content: initial;\n}\n.uppy-StatusBar-actionCircleBtn {\n  margin: 3px;\n  line-height: 1;\n  cursor: pointer;\n  opacity: 0.9;\n}\n.uppy-StatusBar-actionCircleBtn:focus {\n  outline: none;\n}\n.uppy-StatusBar-actionCircleBtn::-moz-focus-inner {\n  border: 0;\n}\n.uppy-StatusBar-actionCircleBtn:focus {\n  box-shadow: 0 0 0 3px rgba(34, 117, 215, 0.5);\n}\n[data-uppy-theme=dark] .uppy-StatusBar-actionCircleBtn:focus {\n  outline: none;\n}\n[data-uppy-theme=dark] .uppy-StatusBar-actionCircleBtn::-moz-focus-inner {\n  border: 0;\n}\n[data-uppy-theme=dark] .uppy-StatusBar-actionCircleBtn:focus {\n  box-shadow: 0 0 0 2px rgba(170, 225, 255, 0.85);\n}\n.uppy-StatusBar-actionCircleBtn:hover {\n  opacity: 1;\n}\n.uppy-StatusBar-actionCircleBtn:focus {\n  border-radius: 50%;\n}\n.uppy-StatusBar-actionCircleBtn svg {\n  vertical-align: bottom;\n}\n.uppy-StatusBar-actionBtn {\n  display: inline-block;\n  color: #2275d7;\n  font-size: 10px;\n  line-height: inherit;\n  vertical-align: middle;\n}\n.uppy-size--md .uppy-StatusBar-actionBtn {\n  font-size: 11px;\n}\n.uppy-StatusBar-actionBtn--disabled {\n  opacity: 0.4;\n}\n[data-uppy-theme=dark] .uppy-StatusBar-actionBtn--disabled {\n  opacity: 0.7;\n}\n[dir=\"ltr\"] .uppy-StatusBar-actionBtn--retry{\n  margin-right: 6px;\n}\n[dir=\"rtl\"] .uppy-StatusBar-actionBtn--retry{\n  margin-left: 6px;\n}\n.uppy-StatusBar-actionBtn--retry {\n  position: relative;\n  height: 16px;\n  padding: 1px 6px 3px 18px;\n  color: #fff;\n  line-height: 1;\n  background-color: #ff4b23;\n  border-radius: 8px;\n}\n.uppy-StatusBar-actionBtn--retry:focus {\n  outline: none;\n}\n.uppy-StatusBar-actionBtn--retry::-moz-focus-inner {\n  border: 0;\n}\n.uppy-StatusBar-actionBtn--retry:focus {\n  box-shadow: 0 0 0 3px rgba(34, 117, 215, 0.5);\n}\n[data-uppy-theme=dark] .uppy-StatusBar-actionBtn--retry:focus {\n  outline: none;\n}\n[data-uppy-theme=dark] .uppy-StatusBar-actionBtn--retry::-moz-focus-inner {\n  border: 0;\n}\n[data-uppy-theme=dark] .uppy-StatusBar-actionBtn--retry:focus {\n  box-shadow: 0 0 0 2px rgba(170, 225, 255, 0.85);\n}\n.uppy-StatusBar-actionBtn--retry:hover {\n  background-color: #f92d00;\n}\n[dir=\"ltr\"] .uppy-StatusBar-actionBtn--retry svg{\n  left: 6px;\n}\n[dir=\"rtl\"] .uppy-StatusBar-actionBtn--retry svg{\n  right: 6px;\n}\n.uppy-StatusBar-actionBtn--retry svg {\n  position: absolute;\n  top: 3px;\n}\n.uppy-StatusBar.is-waiting .uppy-StatusBar-actionBtn--upload {\n  width: 100%;\n  padding: 15px 10px;\n  color: #fff;\n  font-size: 14px;\n  line-height: 1;\n  background-color: #1bb240;\n}\n.uppy-StatusBar.is-waiting .uppy-StatusBar-actionBtn--upload:hover {\n  background-color: #189c38;\n}\n[data-uppy-theme=dark] .uppy-StatusBar.is-waiting .uppy-StatusBar-actionBtn--upload {\n  background-color: #1c8b37;\n}\n[data-uppy-theme=dark] .uppy-StatusBar.is-waiting .uppy-StatusBar-actionBtn--upload:hover {\n  background-color: #18762f;\n}\n.uppy-size--md .uppy-StatusBar.is-waiting .uppy-StatusBar-actionBtn--upload {\n  width: auto;\n  padding: 13px 22px;\n}\n.uppy-StatusBar.is-waiting .uppy-StatusBar-actionBtn--upload.uppy-StatusBar-actionBtn--disabled:hover {\n  background-color: #1bb240;\n  cursor: not-allowed;\n}\n[data-uppy-theme=dark] .uppy-StatusBar.is-waiting .uppy-StatusBar-actionBtn--upload.uppy-StatusBar-actionBtn--disabled:hover {\n  background-color: #1c8b37;\n}\n.uppy-StatusBar:not(.is-waiting) .uppy-StatusBar-actionBtn--upload {\n  color: #2275d7;\n  background-color: transparent;\n}\n[dir=\"ltr\"] .uppy-StatusBar-actionBtn--uploadNewlyAdded{\n  padding-right: 3px;\n}\n[dir=\"rtl\"] .uppy-StatusBar-actionBtn--uploadNewlyAdded{\n  padding-left: 3px;\n}\n[dir=\"ltr\"] .uppy-StatusBar-actionBtn--uploadNewlyAdded{\n  padding-left: 3px;\n}\n[dir=\"rtl\"] .uppy-StatusBar-actionBtn--uploadNewlyAdded{\n  padding-right: 3px;\n}\n.uppy-StatusBar-actionBtn--uploadNewlyAdded {\n  padding-bottom: 1px;\n  border-radius: 3px;\n}\n.uppy-StatusBar-actionBtn--uploadNewlyAdded:focus {\n  outline: none;\n}\n.uppy-StatusBar-actionBtn--uploadNewlyAdded::-moz-focus-inner {\n  border: 0;\n}\n.uppy-StatusBar-actionBtn--uploadNewlyAdded:focus {\n  box-shadow: 0 0 0 3px rgba(34, 117, 215, 0.5);\n}\n[data-uppy-theme=dark] .uppy-StatusBar-actionBtn--uploadNewlyAdded:focus {\n  outline: none;\n}\n[data-uppy-theme=dark] .uppy-StatusBar-actionBtn--uploadNewlyAdded::-moz-focus-inner {\n  border: 0;\n}\n[data-uppy-theme=dark] .uppy-StatusBar-actionBtn--uploadNewlyAdded:focus {\n  box-shadow: 0 0 0 2px rgba(170, 225, 255, 0.85);\n}\n.uppy-StatusBar-actionBtn--done {\n  padding: 7px 8px;\n  line-height: 1;\n  border-radius: 3px;\n}\n.uppy-StatusBar-actionBtn--done:focus {\n  outline: none;\n}\n.uppy-StatusBar-actionBtn--done::-moz-focus-inner {\n  border: 0;\n}\n.uppy-StatusBar-actionBtn--done:hover {\n  color: #1b5dab;\n}\n.uppy-StatusBar-actionBtn--done:focus {\n  background-color: #eceef2;\n}\n[data-uppy-theme=dark] .uppy-StatusBar-actionBtn--done:focus {\n  background-color: #333;\n}\n[data-uppy-theme=dark] .uppy-StatusBar-actionBtn--done {\n  color: #02baf2;\n}\n.uppy-size--md .uppy-StatusBar-actionBtn--done {\n  font-size: 14px;\n}\n.uppy-StatusBar-serviceMsg {\n  padding-left: 10px;\n  color: #000;\n  font-size: 11px;\n  line-height: 1.1;\n}\n.uppy-size--md .uppy-StatusBar-serviceMsg {\n  padding-left: 15px;\n  font-size: 14px;\n}\n[data-uppy-theme=dark] .uppy-StatusBar-serviceMsg {\n  color: #eaeaea;\n}\n.uppy-StatusBar-serviceMsg-ghostsIcon {\n  position: relative;\n  top: 2px;\n  left: 6px;\n  width: 10px;\n  vertical-align: text-bottom;\n  opacity: 0.5;\n}\n.uppy-size--md .uppy-StatusBar-serviceMsg-ghostsIcon {\n  top: 1px;\n  left: 10px;\n  width: 15px;\n}\n[dir=\"ltr\"] .uppy-StatusBar-details{\n  left: 2px;\n}\n[dir=\"rtl\"] .uppy-StatusBar-details{\n  right: 2px;\n}\n.uppy-StatusBar-details {\n  position: relative;\n  top: 0;\n  display: inline-block;\n  width: 13px;\n  height: 13px;\n  color: #fff;\n  font-weight: 600;\n  font-size: 10px;\n  line-height: 12px;\n  text-align: center;\n  vertical-align: middle;\n  background-color: #939393;\n  border-radius: 50%;\n  cursor: help;\n  -webkit-appearance: none;\n          -moz-appearance: none;\n       appearance: none;\n}\n.uppy-StatusBar-details::after {\n  line-height: 1.3;\n  word-wrap: break-word;\n}\n[dir=\"ltr\"] .uppy-StatusBar-spinner{\n  margin-right: 10px;\n}\n[dir=\"rtl\"] .uppy-StatusBar-spinner{\n  margin-left: 10px;\n}\n.uppy-StatusBar-spinner {\n  -webkit-animation-name: uppy-StatusBar-spinnerAnimation;\n          animation-name: uppy-StatusBar-spinnerAnimation;\n  -webkit-animation-duration: 1s;\n          animation-duration: 1s;\n  -webkit-animation-timing-function: linear;\n          animation-timing-function: linear;\n  -webkit-animation-iteration-count: infinite;\n          animation-iteration-count: infinite;\n  fill: #2275d7;\n}\n.uppy-StatusBar.is-preprocessing .uppy-StatusBar-spinner,\n.uppy-StatusBar.is-postprocessing .uppy-StatusBar-spinner {\n  fill: #f6a623;\n}\n@-webkit-keyframes uppy-StatusBar-spinnerAnimation {\n0% {\n    transform: rotate(0deg);\n}\n100% {\n    transform: rotate(360deg);\n}\n}\n@keyframes uppy-StatusBar-spinnerAnimation {\n0% {\n    transform: rotate(0deg);\n}\n100% {\n    transform: rotate(360deg);\n}\n}\n.uppy-ProviderBrowser-viewType--grid ul.uppy-ProviderBrowser-list,\n.uppy-ProviderBrowser-viewType--unsplash ul.uppy-ProviderBrowser-list {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  align-items: flex-start;\n  justify-content: space-between;\n  padding: 6px;\n}\n.uppy-ProviderBrowser-viewType--grid ul.uppy-ProviderBrowser-list::after,\n.uppy-ProviderBrowser-viewType--unsplash ul.uppy-ProviderBrowser-list::after {\n  flex: auto;\n  content: \"\";\n}\n.uppy-ProviderBrowser-viewType--grid li.uppy-ProviderBrowserItem,\n.uppy-ProviderBrowser-viewType--unsplash li.uppy-ProviderBrowserItem {\n  position: relative;\n  width: 50%;\n  margin: 0;\n}\n.uppy-size--md .uppy-ProviderBrowser-viewType--grid li.uppy-ProviderBrowserItem,\n.uppy-size--md .uppy-ProviderBrowser-viewType--unsplash li.uppy-ProviderBrowserItem {\n  width: 33.3333%;\n}\n.uppy-size--lg .uppy-ProviderBrowser-viewType--grid li.uppy-ProviderBrowserItem,\n.uppy-size--lg .uppy-ProviderBrowser-viewType--unsplash li.uppy-ProviderBrowserItem {\n  width: 25%;\n}\n.uppy-ProviderBrowser-viewType--grid li.uppy-ProviderBrowserItem::before,\n.uppy-ProviderBrowser-viewType--unsplash li.uppy-ProviderBrowserItem::before {\n  display: block;\n  padding-top: 100%;\n  content: \"\";\n}\n.uppy-ProviderBrowser-viewType--grid li.uppy-ProviderBrowserItem--selected img,\n.uppy-ProviderBrowser-viewType--grid li.uppy-ProviderBrowserItem--selected svg,\n.uppy-ProviderBrowser-viewType--unsplash li.uppy-ProviderBrowserItem--selected img,\n.uppy-ProviderBrowser-viewType--unsplash li.uppy-ProviderBrowserItem--selected svg {\n  opacity: 0.85;\n}\n.uppy-ProviderBrowser-viewType--grid li.uppy-ProviderBrowserItem--disabled,\n.uppy-ProviderBrowser-viewType--unsplash li.uppy-ProviderBrowserItem--disabled {\n  opacity: 0.5;\n}\n.uppy-ProviderBrowser-viewType--grid li.uppy-ProviderBrowserItem--noPreview .uppy-ProviderBrowserItem-inner,\n.uppy-ProviderBrowser-viewType--unsplash li.uppy-ProviderBrowserItem--noPreview .uppy-ProviderBrowserItem-inner {\n  background-color: rgba(147, 147, 147, 0.2);\n}\n[data-uppy-theme=dark] .uppy-ProviderBrowser-viewType--grid li.uppy-ProviderBrowserItem--noPreview .uppy-ProviderBrowserItem-inner,\n[data-uppy-theme=dark] .uppy-ProviderBrowser-viewType--unsplash li.uppy-ProviderBrowserItem--noPreview .uppy-ProviderBrowserItem-inner {\n  background-color: rgba(234, 234, 234, 0.2);\n}\n.uppy-ProviderBrowser-viewType--grid li.uppy-ProviderBrowserItem--noPreview svg,\n.uppy-ProviderBrowser-viewType--unsplash li.uppy-ProviderBrowserItem--noPreview svg {\n  width: 30%;\n  height: 30%;\n  fill: rgba(0, 0, 0, 0.7);\n}\n[data-uppy-theme=dark] .uppy-ProviderBrowser-viewType--grid li.uppy-ProviderBrowserItem--noPreview svg,\n[data-uppy-theme=dark] .uppy-ProviderBrowser-viewType--unsplash li.uppy-ProviderBrowserItem--noPreview svg {\n  fill: rgba(255, 255, 255, 0.8);\n}\n.uppy-ProviderBrowser-viewType--grid .uppy-ProviderBrowserItem-inner,\n.uppy-ProviderBrowser-viewType--unsplash .uppy-ProviderBrowserItem-inner {\n  position: absolute;\n  top: 7px;\n  right: 7px;\n  bottom: 7px;\n  left: 7px;\n  width: calc(100% - 14px);\n  height: calc(100% - 14px);\n  overflow: hidden;\n  text-align: center;\n  border-radius: 4px;\n}\n.uppy-ProviderBrowser-viewType--grid .uppy-ProviderBrowserItem-inner .uppy.uppy-ProviderBrowserItem-inner-relative,\n.uppy-ProviderBrowser-viewType--unsplash .uppy-ProviderBrowserItem-inner .uppy.uppy-ProviderBrowserItem-inner-relative {\n  position: relative;\n}\n.uppy-ProviderBrowser-viewType--grid .uppy-ProviderBrowserItem-inner .uppy-ProviderBrowserItem-author,\n.uppy-ProviderBrowser-viewType--unsplash .uppy-ProviderBrowserItem-inner .uppy-ProviderBrowserItem-author {\n  position: absolute;\n  display: none;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  background: rgba(0, 0, 0, 0.3);\n  color: white;\n  font-weight: 500;\n  font-size: 12px;\n  margin: 0;\n  padding: 5px;\n  text-decoration: none;\n}\n.uppy-ProviderBrowser-viewType--grid .uppy-ProviderBrowserItem-inner .uppy-ProviderBrowserItem-author:hover,\n.uppy-ProviderBrowser-viewType--unsplash .uppy-ProviderBrowserItem-inner .uppy-ProviderBrowserItem-author:hover {\n  background: rgba(0, 0, 0, 0.4);\n  text-decoration: underline;\n}\n@media (hover: none) {\n.uppy-ProviderBrowser-viewType--grid .uppy-ProviderBrowserItem-inner .uppy-ProviderBrowserItem-author,\n.uppy-ProviderBrowser-viewType--unsplash .uppy-ProviderBrowserItem-inner .uppy-ProviderBrowserItem-author {\n    display: block;\n}\n}\n[data-uppy-theme=dark] .uppy-ProviderBrowser-viewType--grid .uppy-ProviderBrowserItem-inner,\n[data-uppy-theme=dark] .uppy-ProviderBrowser-viewType--unsplash .uppy-ProviderBrowserItem-inner {\n  box-shadow: 0 0 0 3px rgba(170, 225, 255, 0.7);\n}\n.uppy-ProviderBrowser-viewType--grid .uppy-ProviderBrowserItem-inner img,\n.uppy-ProviderBrowser-viewType--unsplash .uppy-ProviderBrowserItem-inner img {\n  width: 100%;\n  height: 100%;\n  -o-object-fit: cover;\n     object-fit: cover;\n  border-radius: 4px;\n}\n.uppy-ProviderBrowser-viewType--grid .uppy-ProviderBrowserItem-checkbox,\n.uppy-ProviderBrowser-viewType--unsplash .uppy-ProviderBrowserItem-checkbox {\n  position: absolute;\n  top: 16px;\n  right: 16px;\n  z-index: 1002;\n  width: 26px;\n  height: 26px;\n  background-color: #2275d7;\n  border-radius: 50%;\n  opacity: 0;\n}\n[dir=\"ltr\"] .uppy-ProviderBrowser-viewType--grid .uppy-ProviderBrowserItem-checkbox::after,[dir=\"ltr\"] \n.uppy-ProviderBrowser-viewType--unsplash .uppy-ProviderBrowserItem-checkbox::after{\n  left: 7px;\n}\n[dir=\"rtl\"] .uppy-ProviderBrowser-viewType--grid .uppy-ProviderBrowserItem-checkbox::after,[dir=\"rtl\"] \n.uppy-ProviderBrowser-viewType--unsplash .uppy-ProviderBrowserItem-checkbox::after{\n  right: 7px;\n}\n.uppy-ProviderBrowser-viewType--grid .uppy-ProviderBrowserItem-checkbox::after,\n.uppy-ProviderBrowser-viewType--unsplash .uppy-ProviderBrowserItem-checkbox::after {\n  top: 8px;\n  width: 12px;\n  height: 7px;\n}\n.uppy-ProviderBrowser-viewType--grid .uppy-ProviderBrowserItem-checkbox--is-checked,\n.uppy-ProviderBrowser-viewType--unsplash .uppy-ProviderBrowserItem-checkbox--is-checked {\n  opacity: 1;\n}\n.uppy-ProviderBrowser-viewType--grid .uppy-ProviderBrowserItem-checkbox--grid:hover + label .uppy-ProviderBrowserItem-author,\n.uppy-ProviderBrowser-viewType--grid .uppy-ProviderBrowserItem-checkbox--grid:focus + label .uppy-ProviderBrowserItem-author,\n.uppy-ProviderBrowser-viewType--unsplash .uppy-ProviderBrowserItem-checkbox--grid:hover + label .uppy-ProviderBrowserItem-author,\n.uppy-ProviderBrowser-viewType--unsplash .uppy-ProviderBrowserItem-checkbox--grid:focus + label .uppy-ProviderBrowserItem-author {\n  display: block;\n}\n.uppy-ProviderBrowser-viewType--grid .uppy-ProviderBrowserItem-checkbox--grid:focus + label,\n.uppy-ProviderBrowser-viewType--unsplash .uppy-ProviderBrowserItem-checkbox--grid:focus + label {\n  box-shadow: 0 0 0 3px rgba(34, 117, 215, 0.5);\n}\n.uppy-ProviderBrowser-viewType--grid .uppy-ProviderBrowserItem-checkbox--grid:focus + label:focus,\n.uppy-ProviderBrowser-viewType--unsplash .uppy-ProviderBrowserItem-checkbox--grid:focus + label:focus {\n  outline: none;\n}\n.uppy-ProviderBrowser-viewType--grid .uppy-ProviderBrowserItem-checkbox--grid:focus + label::-moz-focus-inner,\n.uppy-ProviderBrowser-viewType--unsplash .uppy-ProviderBrowserItem-checkbox--grid:focus + label::-moz-focus-inner {\n  border: 0;\n}\n.uppy-ProviderBrowser-viewType--list {\n  background-color: #fff;\n}\n[data-uppy-theme=dark] .uppy-ProviderBrowser-viewType--list {\n  background-color: #1f1f1f;\n}\n.uppy-ProviderBrowser-viewType--list li.uppy-ProviderBrowserItem {\n  display: flex;\n  align-items: center;\n  margin: 0;\n  padding: 7px 15px;\n}\n[data-uppy-theme=dark] .uppy-ProviderBrowser-viewType--list li.uppy-ProviderBrowserItem {\n  color: #eaeaea;\n}\n.uppy-ProviderBrowser-viewType--list li.uppy-ProviderBrowserItem--disabled {\n  opacity: 0.6;\n}\n[dir=\"ltr\"] .uppy-ProviderBrowser-viewType--list .uppy-ProviderBrowserItem-checkbox{\n  margin-right: 15px;\n}\n[dir=\"rtl\"] .uppy-ProviderBrowser-viewType--list .uppy-ProviderBrowserItem-checkbox{\n  margin-left: 15px;\n}\n.uppy-ProviderBrowser-viewType--list .uppy-ProviderBrowserItem-checkbox {\n  width: 17px;\n  height: 17px;\n  background-color: #fff;\n  border: 1px solid #cfcfcf;\n  border-radius: 3px;\n}\n.uppy-ProviderBrowser-viewType--list .uppy-ProviderBrowserItem-checkbox:focus {\n  border: 1px solid #2275d7;\n  outline: none;\n  box-shadow: 0 0 0 3px rgba(34, 117, 215, 0.25);\n}\n[dir=\"ltr\"] .uppy-ProviderBrowser-viewType--list .uppy-ProviderBrowserItem-checkbox::after{\n  left: 3px;\n}\n[dir=\"rtl\"] .uppy-ProviderBrowser-viewType--list .uppy-ProviderBrowserItem-checkbox::after{\n  right: 3px;\n}\n.uppy-ProviderBrowser-viewType--list .uppy-ProviderBrowserItem-checkbox::after {\n  top: 4px;\n  width: 9px;\n  height: 5px;\n  opacity: 0;\n}\n[data-uppy-theme=dark] .uppy-ProviderBrowser-viewType--list .uppy-ProviderBrowserItem-checkbox:focus {\n  border-color: rgba(2, 186, 242, 0.7);\n  box-shadow: 0 0 0 3px rgba(2, 186, 242, 0.2);\n}\n.uppy-ProviderBrowser-viewType--list .uppy-ProviderBrowserItem-checkbox--is-checked {\n  background-color: #2275d7;\n  border-color: #2275d7;\n}\n.uppy-ProviderBrowser-viewType--list .uppy-ProviderBrowserItem-checkbox--is-checked::after {\n  opacity: 1;\n}\n.uppy-ProviderBrowser-viewType--list .uppy-ProviderBrowserItem-inner {\n  display: flex;\n  align-items: center;\n  padding: 2px;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n.uppy-ProviderBrowser-viewType--list .uppy-ProviderBrowserItem-inner:focus {\n  text-decoration: underline;\n  outline: none;\n}\n[dir=\"ltr\"] .uppy-ProviderBrowser-viewType--list .uppy-ProviderBrowserItem-inner img,[dir=\"ltr\"] \n.uppy-ProviderBrowser-viewType--list .uppy-ProviderBrowserItem-inner svg{\n  margin-right: 8px;\n}\n[dir=\"rtl\"] .uppy-ProviderBrowser-viewType--list .uppy-ProviderBrowserItem-inner img,[dir=\"rtl\"] \n.uppy-ProviderBrowser-viewType--list .uppy-ProviderBrowserItem-inner svg{\n  margin-left: 8px;\n}\n.uppy-ProviderBrowser-viewType--list .uppy-ProviderBrowserItem-inner img,\n.uppy-ProviderBrowser-viewType--list .uppy-ProviderBrowserItem-inner svg {\n  max-width: 20px;\n  max-height: 20px;\n}\n.uppy-ProviderBrowser-viewType--list .uppy-ProviderBrowserItem-inner span {\n  overflow: hidden;\n  line-height: 1.2;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n.uppy-ProviderBrowser-viewType--list .uppy-ProviderBrowserItem--disabled .uppy-ProviderBrowserItem-inner {\n  cursor: default;\n}\n[dir=\"ltr\"] .uppy-ProviderBrowser-viewType--list .uppy-ProviderBrowserItem-iconWrap{\n  margin-right: 7px;\n}\n[dir=\"rtl\"] .uppy-ProviderBrowser-viewType--list .uppy-ProviderBrowserItem-iconWrap{\n  margin-left: 7px;\n}\n.uppy-ProviderBrowser-viewType--list .uppy-ProviderBrowserItem-iconWrap {\n  width: 20px;\n}\n.uppy-ProviderBrowserItem-checkbox {\n  position: relative;\n  flex-shrink: 0;\n  cursor: pointer;\n}\n.uppy-ProviderBrowserItem-checkbox:disabled {\n  cursor: default;\n}\n.uppy-ProviderBrowserItem-checkbox::after {\n  position: absolute;\n  border-bottom: 2px solid #eaeaea;\n  border-left: 2px solid #eaeaea;\n  transform: rotate(-45deg);\n  cursor: pointer;\n  content: \"\";\n}\n.uppy-ProviderBrowserItem-checkbox:disabled::after {\n  cursor: default;\n}\n[data-uppy-theme=dark] .uppy-ProviderBrowserItem-checkbox {\n  background-color: #1f1f1f;\n  border-color: #939393;\n}\n[data-uppy-theme=dark] .uppy-ProviderBrowserItem-checkbox--is-checked {\n  background-color: #333;\n}\n.uppy-SearchProvider {\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n}\n[data-uppy-theme=dark] .uppy-SearchProvider {\n  background-color: #1f1f1f;\n}\n.uppy-SearchProvider-input {\n  width: 90%;\n  max-width: 650px;\n  margin-bottom: 15px;\n}\n.uppy-size--md .uppy-SearchProvider-input {\n  margin-bottom: 20px;\n}\n.uppy-SearchProvider-searchButton {\n  padding: 13px 25px;\n}\n.uppy-size--md .uppy-SearchProvider-searchButton {\n  padding: 13px 30px;\n}\n.uppy-DashboardContent-panelBody {\n  display: flex;\n  flex: 1;\n  align-items: center;\n  justify-content: center;\n}\n[data-uppy-theme=dark] .uppy-DashboardContent-panelBody {\n  background-color: #1f1f1f;\n}\n.uppy-Provider-auth,\n.uppy-Provider-error,\n.uppy-Provider-loading,\n.uppy-Provider-empty {\n  display: flex;\n  flex: 1;\n  flex-flow: column wrap;\n  align-items: center;\n  justify-content: center;\n  color: #939393;\n}\n.uppy-Provider-empty {\n  color: #939393;\n}\n.uppy-Provider-authIcon svg {\n  width: 100px;\n  height: 75px;\n  margin-bottom: 15px;\n}\n.uppy-Provider-authTitle {\n  max-width: 500px;\n  margin-bottom: 30px;\n  padding: 0 15px;\n  color: #757575;\n  font-weight: 400;\n  font-size: 17px;\n  line-height: 1.4;\n  text-align: center;\n}\n.uppy-size--md .uppy-Provider-authTitle {\n  font-size: 20px;\n}\n[data-uppy-theme=dark] .uppy-Provider-authTitle {\n  color: #cfcfcf;\n}\n.uppy-Provider-btn-google {\n  display: flex;\n  align-items: center;\n  padding: 8px 12px !important;\n  background: #4285F4;\n}\n.uppy-Provider-btn-google:hover {\n  background-color: #1266f1;\n}\n.uppy-Provider-btn-google:focus {\n  outline: none;\n  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.4);\n}\n.uppy-Provider-btn-google svg {\n  margin-right: 8px;\n}\n[dir=\"ltr\"] .uppy-Provider-breadcrumbs{\n  text-align: left;\n}\n[dir=\"rtl\"] .uppy-Provider-breadcrumbs{\n  text-align: right;\n}\n.uppy-Provider-breadcrumbs {\n  flex: 1;\n  margin-bottom: 10px;\n  color: #525252;\n  font-size: 12px;\n}\n.uppy-size--md .uppy-Provider-breadcrumbs {\n  margin-bottom: 0;\n}\n[data-uppy-theme=dark] .uppy-Provider-breadcrumbs {\n  color: #eaeaea;\n}\n[dir=\"ltr\"] .uppy-Provider-breadcrumbsIcon{\n  margin-right: 4px;\n}\n[dir=\"rtl\"] .uppy-Provider-breadcrumbsIcon{\n  margin-left: 4px;\n}\n.uppy-Provider-breadcrumbsIcon {\n  display: inline-block;\n  color: #525252;\n  line-height: 1;\n  vertical-align: middle;\n}\n.uppy-Provider-breadcrumbsIcon svg {\n  width: 13px;\n  height: 13px;\n  fill: #525252;\n}\n.uppy-Provider-breadcrumbs button {\n  display: inline-block;\n  padding: 4px;\n  line-height: inherit;\n  border-radius: 3px;\n}\n.uppy-Provider-breadcrumbs button:focus {\n  outline: none;\n}\n.uppy-Provider-breadcrumbs button::-moz-focus-inner {\n  border: 0;\n}\n.uppy-Provider-breadcrumbs button:hover {\n  color: #1b5dab;\n}\n.uppy-Provider-breadcrumbs button:focus {\n  background-color: #eceef2;\n}\n[data-uppy-theme=dark] .uppy-Provider-breadcrumbs button:focus {\n  background-color: #333;\n}\n.uppy-Provider-breadcrumbs button:not(:last-of-type) {\n  text-decoration: underline;\n}\n.uppy-Provider-breadcrumbs button:last-of-type {\n  color: #333;\n  font-weight: 500;\n  cursor: normal;\n  pointer-events: none;\n}\n.uppy-Provider-breadcrumbs button:hover {\n  cursor: pointer;\n}\n[data-uppy-theme=dark] .uppy-Provider-breadcrumbs button {\n  color: #eaeaea;\n}\n.uppy-ProviderBrowser {\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  height: 100%;\n  font-weight: 400;\n  font-size: 14px;\n}\n.uppy-ProviderBrowser-user {\n  margin: 0 8px 0 0;\n  color: #333;\n  font-weight: 500;\n}\n[data-uppy-theme=dark] .uppy-ProviderBrowser-user {\n  color: #eaeaea;\n}\n[dir=\"ltr\"] .uppy-ProviderBrowser-user::after{\n  left: 4px;\n}\n[dir=\"rtl\"] .uppy-ProviderBrowser-user::after{\n  right: 4px;\n}\n.uppy-ProviderBrowser-user::after {\n  position: relative;\n  color: #939393;\n  font-weight: normal;\n  content: \"·\";\n}\n.uppy-ProviderBrowser-header {\n  position: relative;\n  z-index: 1001;\n  border-bottom: 1px solid #eaeaea;\n}\n[data-uppy-theme=dark] .uppy-ProviderBrowser-header {\n  border-bottom: 1px solid #333;\n}\n.uppy-ProviderBrowser-headerBar {\n  z-index: 1001;\n  padding: 7px 15px;\n  color: #757575;\n  font-size: 12px;\n  line-height: 1.4;\n  background-color: #fafafa;\n}\n.uppy-size--md .uppy-ProviderBrowser-headerBar {\n  display: flex;\n  align-items: center;\n  flex-direction: column;\n}\n[data-uppy-theme=dark] .uppy-ProviderBrowser-headerBar {\n  background-color: #1f1f1f;\n}\n.uppy-ProviderBrowser-headerBar--simple {\n  display: block;\n  justify-content: center;\n  text-align: center;\n}\n.uppy-ProviderBrowser-headerBar--simple .uppy-Provider-breadcrumbsWrap {\n  display: inline-block;\n  flex: none;\n  vertical-align: middle;\n}\n.uppy-ProviderBrowser-filter {\n  position: relative;\n  display: flex;\n  align-items: center;\n  width: 100%;\n  height: 30px;\n  margin-top: 10px;\n  margin-bottom: 5px;\n  background-color: #fff;\n}\n[data-uppy-theme=dark] .uppy-ProviderBrowser-filter {\n  background-color: #1f1f1f;\n}\n[dir=\"ltr\"] .uppy-ProviderBrowser-filterIcon{\n  left: 16px;\n}\n[dir=\"rtl\"] .uppy-ProviderBrowser-filterIcon{\n  right: 16px;\n}\n.uppy-ProviderBrowser-filterIcon {\n  position: absolute;\n  z-index: 1002;\n  width: 12px;\n  height: 12px;\n  color: #bbb;\n}\n[dir=\"ltr\"] .uppy-ProviderBrowser-filterInput{\n  padding-left: 27px;\n}\n[dir=\"rtl\"] .uppy-ProviderBrowser-filterInput{\n  padding-right: 27px;\n}\n.uppy-ProviderBrowser-filterInput {\n  z-index: 1001;\n  width: 100%;\n  height: 30px;\n  margin: 0 8px;\n  font-size: 12px;\n  font-family: -apple-system, blinkmacsystemfont, \"Segoe UI\", helvetica, arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  line-height: 1.4;\n  background-color: transparent;\n  border: 0;\n  border-radius: 4px;\n  outline: 0;\n}\n[data-uppy-theme=dark] .uppy-ProviderBrowser-filterInput {\n  color: #eaeaea;\n  background-color: #1f1f1f;\n}\n.uppy-ProviderBrowser-filterInput:focus {\n  background-color: #f4f4f4;\n  outline: 0;\n}\n[data-uppy-theme=dark] .uppy-ProviderBrowser-filterInput:focus {\n  background-color: #333;\n}\n.uppy-ProviderBrowser-filterInput::-moz-placeholder {\n  color: #939393;\n  opacity: 1;\n}\n.uppy-ProviderBrowser-filterInput:-ms-input-placeholder {\n  color: #939393;\n  opacity: 1;\n}\n.uppy-ProviderBrowser-filterInput::placeholder {\n  color: #939393;\n  opacity: 1;\n}\n.uppy-ProviderBrowser-search {\n  position: relative;\n  display: flex;\n  align-items: center;\n  width: 100%;\n  height: 30px;\n  margin-top: 2px;\n  margin-bottom: 2px;\n}\n[dir=\"ltr\"] .uppy-ProviderBrowser-searchInput{\n  padding-left: 30px;\n}\n[dir=\"rtl\"] .uppy-ProviderBrowser-searchInput{\n  padding-right: 30px;\n}\n.uppy-ProviderBrowser-searchInput {\n  z-index: 1001;\n  width: 100%;\n  height: 30px;\n  font-size: 13px;\n  font-family: -apple-system, blinkmacsystemfont, \"Segoe UI\", helvetica, arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  line-height: 1.4;\n  background-color: #eaeaea;\n  border: 0;\n  border-radius: 4px;\n  outline: 0;\n  color: #333;\n}\n[data-uppy-theme=dark] .uppy-ProviderBrowser-searchInput {\n  color: #eaeaea;\n  background-color: #1f1f1f;\n}\n.uppy-ProviderBrowser-searchInput:focus {\n  background-color: #cfcfcf;\n  outline: 0;\n}\n[data-uppy-theme=dark] .uppy-ProviderBrowser-searchInput:focus {\n  background-color: #333;\n}\n[dir=\"ltr\"] .uppy-ProviderBrowser-searchIcon{\n  left: 10px;\n}\n[dir=\"rtl\"] .uppy-ProviderBrowser-searchIcon{\n  right: 10px;\n}\n.uppy-ProviderBrowser-searchIcon {\n  position: absolute;\n  z-index: 1002;\n  width: 12px;\n  height: 12px;\n  color: #757575;\n}\n.uppy-ProviderBrowser-searchInput::-moz-placeholder {\n  color: #939393;\n  opacity: 1;\n}\n.uppy-ProviderBrowser-searchInput:-ms-input-placeholder {\n  color: #939393;\n  opacity: 1;\n}\n.uppy-ProviderBrowser-searchInput::placeholder {\n  color: #939393;\n  opacity: 1;\n}\n.uppy-ProviderBrowser-userLogout {\n  padding: 4px;\n  color: #2275d7;\n  line-height: inherit;\n  border-radius: 3px;\n  cursor: pointer;\n}\n.uppy-ProviderBrowser-userLogout:focus {\n  outline: none;\n}\n.uppy-ProviderBrowser-userLogout::-moz-focus-inner {\n  border: 0;\n}\n.uppy-ProviderBrowser-userLogout:hover {\n  color: #1b5dab;\n}\n.uppy-ProviderBrowser-userLogout:focus {\n  background-color: #eceef2;\n}\n[data-uppy-theme=dark] .uppy-ProviderBrowser-userLogout:focus {\n  background-color: #333;\n}\n.uppy-ProviderBrowser-userLogout:hover {\n  text-decoration: underline;\n}\n[data-uppy-theme=dark] .uppy-ProviderBrowser-userLogout {\n  color: #eaeaea;\n}\n.uppy-ProviderBrowser-body {\n  position: relative;\n  flex: 1;\n}\n.uppy-ProviderBrowser-list {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  display: block;\n  flex: 1;\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  padding: 0;\n  overflow-x: hidden;\n  overflow-y: auto;\n  list-style: none;\n  background-color: #fff;\n  border-spacing: 0;\n  -webkit-overflow-scrolling: touch;\n}\n[data-uppy-theme=dark] .uppy-ProviderBrowser-list {\n  background-color: #1f1f1f;\n}\n.uppy-ProviderBrowser-list:focus {\n  outline: none;\n}\n.uppy-ProviderBrowserItem-inner {\n  font-weight: 500;\n  font-size: 13px;\n  cursor: pointer;\n}\n.uppy-ProviderBrowser-footer {\n  display: flex;\n  align-items: center;\n  height: 65px;\n  padding: 0 15px;\n  background-color: #fff;\n  border-top: 1px solid #eaeaea;\n}\n[dir=\"ltr\"] .uppy-ProviderBrowser-footer button{\n  margin-right: 8px;\n}\n[dir=\"rtl\"] .uppy-ProviderBrowser-footer button{\n  margin-left: 8px;\n}\n[data-uppy-theme=dark] .uppy-ProviderBrowser-footer {\n  background-color: #1f1f1f;\n  border-top: 1px solid #333;\n}\n.uppy-Dashboard-Item-previewInnerWrap {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  border-radius: 3px;\n  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.4);\n}\n.uppy-size--md .uppy-Dashboard-Item-previewInnerWrap {\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);\n}\n.uppy-Dashboard-Item-previewInnerWrap::after {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1001;\n  display: none;\n  background-color: rgba(0, 0, 0, 0.65);\n  content: \"\";\n}\n.uppy-Dashboard-Item-previewLink {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1002;\n}\n.uppy-Dashboard-Item-previewLink:focus {\n  box-shadow: inset 0 0 0 3px #76abe9;\n}\n[data-uppy-theme=dark] .uppy-Dashboard-Item-previewLink:focus {\n  box-shadow: inset 0 0 0 3px #016c8d;\n}\n.uppy-Dashboard-Item-preview img.uppy-Dashboard-Item-previewImg {\n  width: 100%;\n  height: 100%;\n  -o-object-fit: cover;\n     object-fit: cover;\n  border-radius: 3px;\n  transform: translateZ(0);\n}\n.uppy-Dashboard-Item-progress {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  z-index: 1002;\n  width: 120px;\n  color: #fff;\n  text-align: center;\n  transform: translate(-50%, -50%);\n  transition: all 0.35 ease;\n}\n.uppy-Dashboard-Item-progressIndicator {\n  display: inline-block;\n  width: 38px;\n  height: 38px;\n  opacity: 0.9;\n}\n.uppy-size--md .uppy-Dashboard-Item-progressIndicator {\n  width: 55px;\n  height: 55px;\n}\nbutton.uppy-Dashboard-Item-progressIndicator {\n  cursor: pointer;\n}\nbutton.uppy-Dashboard-Item-progressIndicator:focus {\n  outline: none;\n}\nbutton.uppy-Dashboard-Item-progressIndicator::-moz-focus-inner {\n  border: 0;\n}\nbutton.uppy-Dashboard-Item-progressIndicator:focus .uppy-Dashboard-Item-progressIcon--bg,\nbutton.uppy-Dashboard-Item-progressIndicator:focus .uppy-Dashboard-Item-progressIcon--retry {\n  fill: #76abe9;\n}\n.uppy-Dashboard-Item-progressIcon--circle {\n  width: 100%;\n  height: 100%;\n}\n.uppy-Dashboard-Item-progressIcon--bg {\n  stroke: rgba(255, 255, 255, 0.4);\n}\n.uppy-Dashboard-Item-progressIcon--progress {\n  transition: stroke-dashoffset 0.5s ease-out;\n  stroke: #fff;\n}\n.uppy-Dashboard-Item-progressIcon--play {\n  transition: all 0.2s;\n  fill: #fff;\n  stroke: #fff;\n}\n.uppy-Dashboard-Item-progressIcon--cancel {\n  transition: all 0.2s;\n  fill: #fff;\n}\n.uppy-Dashboard-Item-progressIcon--pause {\n  transition: all 0.2s;\n  fill: #fff;\n  stroke: #fff;\n}\n.uppy-Dashboard-Item-progressIcon--check {\n  transition: all 0.2s;\n  fill: #fff;\n}\n.uppy-Dashboard-Item-progressIcon--retry {\n  fill: #fff;\n}\n[dir=\"ltr\"] .uppy-Dashboard-Item.is-complete .uppy-Dashboard-Item-progress{\n  right: -8px;\n}\n[dir=\"rtl\"] .uppy-Dashboard-Item.is-complete .uppy-Dashboard-Item-progress{\n  left: -8px;\n}\n[dir=\"ltr\"] .uppy-Dashboard-Item.is-complete .uppy-Dashboard-Item-progress{\n  left: initial;\n}\n[dir=\"rtl\"] .uppy-Dashboard-Item.is-complete .uppy-Dashboard-Item-progress{\n  right: initial;\n}\n.uppy-Dashboard-Item.is-complete .uppy-Dashboard-Item-progress {\n  top: -9px;\n  width: auto;\n  transform: initial;\n}\n.uppy-Dashboard-Item.is-error .uppy-Dashboard-Item-progressIndicator {\n  width: 18px;\n  height: 18px;\n}\n.uppy-size--md .uppy-Dashboard-Item.is-error .uppy-Dashboard-Item-progressIndicator {\n  width: 28px;\n  height: 28px;\n}\n.uppy-Dashboard-Item.is-complete .uppy-Dashboard-Item-progressIndicator {\n  width: 18px;\n  height: 18px;\n  opacity: 1;\n}\n.uppy-size--md .uppy-Dashboard-Item.is-complete .uppy-Dashboard-Item-progressIndicator {\n  width: 22px;\n  height: 22px;\n}\n.uppy-Dashboard-Item.is-processing .uppy-Dashboard-Item-progress {\n  opacity: 0;\n}\n[dir=\"ltr\"] .uppy-Dashboard-Item-fileInfo{\n  padding-right: 5px;\n}\n[dir=\"rtl\"] .uppy-Dashboard-Item-fileInfo{\n  padding-left: 5px;\n}\n.uppy-Dashboard-Item-name {\n  margin-bottom: 5px;\n  font-weight: 500;\n  font-size: 12px;\n  line-height: 1.3;\n  word-wrap: anywhere;\n  word-break: break-all;\n}\n[data-uppy-theme=dark] .uppy-Dashboard-Item-name {\n  color: #eaeaea;\n}\n.uppy-Dashboard-Item-fileName {\n  display: flex;\n  align-items: baseline;\n}\n.uppy-Dashboard-Item-fileName button {\n  margin-left: 5px;\n}\n.uppy-Dashboard-Item-author {\n  color: #757575;\n  vertical-align: bottom;\n  font-size: 11px;\n  font-weight: normal;\n  display: inline-block;\n  line-height: 1;\n  margin-bottom: 5px;\n}\n.uppy-Dashboard-Item-author a {\n  color: #757575;\n}\n.uppy-Dashboard-Item-status {\n  color: #757575;\n  font-weight: normal;\n  font-size: 11px;\n  line-height: 1;\n}\n[data-uppy-theme=dark] .uppy-Dashboard-Item-status {\n  color: #bbb;\n}\n.uppy-Dashboard-Item-statusSize {\n  display: inline-block;\n  text-transform: uppercase;\n  vertical-align: bottom;\n  margin-bottom: 5px;\n}\n.uppy-Dashboard-Item-reSelect {\n  color: #2275d7;\n  font-weight: 600;\n  font-size: inherit;\n  font-family: inherit;\n}\n.uppy-Dashboard-Item-errorMessage {\n  font-size: 11px;\n  font-weight: 500;\n  line-height: 1.3;\n  color: #a51523;\n  background-color: #fdeff1;\n  padding: 5px 6px;\n}\n.uppy-Dashboard-Item-errorMessageBtn {\n  text-decoration: underline;\n  cursor: pointer;\n  font-weight: 500;\n}\n.uppy-Dashboard-Item-preview .uppy-Dashboard-Item-errorMessage {\n  display: none;\n}\n.uppy-size--md .uppy-Dashboard-Item-preview .uppy-Dashboard-Item-errorMessage {\n  display: block;\n  border-top: 1px solid #f7c2c8;\n  padding: 6px 8px;\n  line-height: 1.4;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  border-bottom-left-radius: 3px;\n  border-bottom-right-radius: 3px;\n}\n.uppy-Dashboard-Item-fileInfo .uppy-Dashboard-Item-errorMessage {\n  display: inline-block;\n  position: static;\n  border: 1px solid #f7c2c8;\n  border-radius: 3px;\n}\n.uppy-size--md .uppy-Dashboard-Item-fileInfo .uppy-Dashboard-Item-errorMessage {\n  display: none;\n}\n.uppy-Dashboard-Item-action {\n  color: #939393;\n  cursor: pointer;\n}\n.uppy-Dashboard-Item-action:focus {\n  outline: none;\n}\n.uppy-Dashboard-Item-action::-moz-focus-inner {\n  border: 0;\n}\n.uppy-Dashboard-Item-action:focus {\n  box-shadow: 0 0 0 3px rgba(34, 117, 215, 0.5);\n}\n.uppy-Dashboard-Item-action:hover {\n  color: #1f1f1f;\n  opacity: 1;\n}\n[data-uppy-theme=dark] .uppy-Dashboard-Item-action {\n  color: #cfcfcf;\n}\n[data-uppy-theme=dark] .uppy-Dashboard-Item-action:focus {\n  outline: none;\n}\n[data-uppy-theme=dark] .uppy-Dashboard-Item-action::-moz-focus-inner {\n  border: 0;\n}\n[data-uppy-theme=dark] .uppy-Dashboard-Item-action:focus {\n  box-shadow: 0 0 0 2px rgba(170, 225, 255, 0.85);\n}\n[data-uppy-theme=dark] .uppy-Dashboard-Item-action:hover {\n  color: #eaeaea;\n}\n.uppy-Dashboard-Item-action--remove {\n  color: #1f1f1f;\n  opacity: 0.95;\n}\n.uppy-Dashboard-Item-action--remove:hover {\n  color: #000;\n  opacity: 1;\n}\n[data-uppy-theme=dark] .uppy-Dashboard-Item-action--remove {\n  color: #525252;\n}\n[data-uppy-theme=dark] .uppy-Dashboard-Item-action--remove:hover {\n  color: #333;\n}\n.uppy-Dashboard:not(.uppy-size--md) .uppy-Dashboard-Item-actionWrapper {\n  display: flex;\n  align-items: center;\n}\n.uppy-Dashboard:not(.uppy-size--md) .uppy-Dashboard-Item-action {\n  width: 22px;\n  height: 22px;\n  margin-left: 3px;\n  padding: 3px;\n}\n.uppy-Dashboard:not(.uppy-size--md) .uppy-Dashboard-Item-action:focus {\n  border-radius: 3px;\n}\n.uppy-size--md .uppy-Dashboard-Item-action--copyLink,\n.uppy-size--md .uppy-Dashboard-Item-action--edit {\n  width: 16px;\n  height: 16px;\n  padding: 0;\n}\n.uppy-size--md .uppy-Dashboard-Item-action--copyLink:focus,\n.uppy-size--md .uppy-Dashboard-Item-action--edit:focus {\n  border-radius: 3px;\n}\n[dir=\"ltr\"] .uppy-size--md .uppy-Dashboard-Item-action--remove{\n  right: -8px;\n}\n[dir=\"rtl\"] .uppy-size--md .uppy-Dashboard-Item-action--remove{\n  left: -8px;\n}\n.uppy-size--md .uppy-Dashboard-Item-action--remove {\n  position: absolute;\n  top: -8px;\n  z-index: 1002;\n  width: 18px;\n  height: 18px;\n  padding: 0;\n}\n.uppy-size--md .uppy-Dashboard-Item-action--remove:focus {\n  border-radius: 50%;\n}\n[dir=\"ltr\"] .uppy-Dashboard-Item{\n  padding-right: 0;\n}\n[dir=\"rtl\"] .uppy-Dashboard-Item{\n  padding-left: 0;\n}\n.uppy-Dashboard-Item {\n  display: flex;\n  align-items: center;\n  padding: 10px;\n  border-bottom: 1px solid #eaeaea;\n}\n[data-uppy-theme=dark] .uppy-Dashboard-Item {\n  border-bottom: 1px solid #333;\n}\n[dir=\"ltr\"] .uppy-size--md .uppy-Dashboard-Item{\n  float: left;\n}\n[dir=\"rtl\"] .uppy-size--md .uppy-Dashboard-Item{\n  float: right;\n}\n.uppy-size--md .uppy-Dashboard-Item {\n  position: relative;\n  display: block;\n  /* When changing width: also update `itemsPerRow` values in `src/components/Dashboard.js`. */\n  width: calc(33.333% - 15px - 15px);\n  height: 215px;\n  margin: 5px 15px;\n  padding: 0;\n  border-bottom: 0;\n}\n.uppy-size--lg .uppy-Dashboard-Item {\n  /* When changing width: also update `itemsPerRow` values in `src/components/Dashboard.js`. */\n  width: calc(25% - 15px - 15px);\n  height: 190px;\n  margin: 5px 15px;\n}\n.uppy-size--xl .uppy-Dashboard-Item {\n  /* When changing width: also update `itemsPerRow` values in `src/components/Dashboard.js`. */\n  width: calc(20% - 15px - 15px);\n  height: 210px;\n}\n.uppy-Dashboard-Item.is-ghost .uppy-Dashboard-Item-previewInnerWrap {\n  opacity: 0.2;\n}\n.uppy-Dashboard-Item.is-ghost .uppy-Dashboard-Item-name {\n  opacity: 0.7;\n}\n.uppy-Dashboard-Item.is-ghost .uppy-Dashboard-Item-preview::before {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1005;\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='35' height='39' viewBox='0 0 35 39'%3E%3Cpath d='M1.708 38.66c1.709 0 3.417-3.417 6.834-3.417 3.416 0 5.125 3.417 8.61 3.417 3.348 0 5.056-3.417 8.473-3.417 4.305 0 5.125 3.417 6.833 3.417.889 0 1.709-.889 1.709-1.709v-19.68C34.167-5.757 0-5.757 0 17.271v19.68c0 .82.888 1.709 1.708 1.709zm8.542-17.084a3.383 3.383 0 01-3.417-3.416 3.383 3.383 0 013.417-3.417 3.383 3.383 0 013.417 3.417 3.383 3.383 0 01-3.417 3.416zm13.667 0A3.383 3.383 0 0120.5 18.16a3.383 3.383 0 013.417-3.417 3.383 3.383 0 013.416 3.417 3.383 3.383 0 01-3.416 3.416z' fill='%2523000' fill-rule='nonzero'/%3E%3C/svg%3E\");\n  background-repeat: no-repeat;\n  background-position: 50% 10px;\n  background-size: 25px;\n  opacity: 0.5;\n  content: \"\";\n}\n.uppy-size--md .uppy-Dashboard-Item.is-ghost .uppy-Dashboard-Item-preview::before {\n  background-position: 50% 50%;\n  background-size: 40px;\n}\n.uppy-Dashboard-Item-preview {\n  position: relative;\n}\n.uppy-Dashboard:not(.uppy-size--md) .uppy-Dashboard-Item-preview {\n  flex-grow: 0;\n  flex-shrink: 0;\n  width: 50px;\n  height: 50px;\n}\n.uppy-size--md .uppy-Dashboard-Item-preview {\n  width: 100%;\n  height: 140px;\n}\n.uppy-size--lg .uppy-Dashboard-Item-preview {\n  height: 120px;\n}\n.uppy-size--xl .uppy-Dashboard-Item-preview {\n  height: 140px;\n}\n[dir=\"ltr\"] .uppy-Dashboard-Item-fileInfoAndButtons{\n  padding-right: 8px;\n}\n[dir=\"rtl\"] .uppy-Dashboard-Item-fileInfoAndButtons{\n  padding-left: 8px;\n}\n[dir=\"ltr\"] .uppy-Dashboard-Item-fileInfoAndButtons{\n  padding-left: 12px;\n}\n[dir=\"rtl\"] .uppy-Dashboard-Item-fileInfoAndButtons{\n  padding-right: 12px;\n}\n.uppy-Dashboard-Item-fileInfoAndButtons {\n  display: flex;\n  flex-grow: 1;\n  align-items: center;\n  justify-content: space-between;\n}\n.uppy-size--md .uppy-Dashboard-Item-fileInfoAndButtons {\n  align-items: flex-start;\n  width: 100%;\n  padding: 0;\n  padding-top: 9px;\n}\n.uppy-Dashboard-Item-fileInfo {\n  flex-grow: 1;\n  flex-shrink: 1;\n}\n.uppy-Dashboard-Item-actionWrapper {\n  flex-grow: 0;\n  flex-shrink: 0;\n}\n.uppy-Dashboard-Item.is-inprogress .uppy-Dashboard-Item-previewInnerWrap::after,\n.uppy-Dashboard-Item.is-error .uppy-Dashboard-Item-previewInnerWrap::after {\n  display: block;\n}\n.uppy-Dashboard-Item.is-inprogress:not(.is-resumable) .uppy-Dashboard-Item-action--remove {\n  display: none;\n}\n[dir=\"ltr\"] .uppy-Dashboard-Item-errorDetails{\n  left: 2px;\n}\n[dir=\"rtl\"] .uppy-Dashboard-Item-errorDetails{\n  right: 2px;\n}\n.uppy-Dashboard-Item-errorDetails {\n  position: relative;\n  top: 0;\n  display: inline-block;\n  width: 13px;\n  height: 13px;\n  color: #fff;\n  font-weight: 600;\n  font-size: 10px;\n  line-height: 12px;\n  text-align: center;\n  vertical-align: middle;\n  background-color: #939393;\n  border-radius: 50%;\n  border: none;\n  cursor: help;\n  -webkit-appearance: none;\n          -moz-appearance: none;\n       appearance: none;\n}\n.uppy-Dashboard-Item-errorDetails::after {\n  line-height: 1.3;\n  word-wrap: break-word;\n}\n.uppy-Dashboard-FileCard {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1005;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n  background-color: #fff;\n  border-radius: 5px;\n  box-shadow: 0 0 10px 4px rgba(0, 0, 0, 0.1);\n}\n.uppy-Dashboard-FileCard .uppy-DashboardContent-bar {\n  border-top-left-radius: 5px;\n  border-top-right-radius: 5px;\n}\n.uppy-Dashboard-FileCard .uppy-Dashboard-FileCard-actions {\n  border-bottom-right-radius: 5px;\n  border-bottom-left-radius: 5px;\n}\n.uppy-Dashboard-FileCard-inner {\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  flex-shrink: 1;\n  height: 100%;\n  min-height: 0;\n}\n.uppy-Dashboard-FileCard-preview {\n  position: relative;\n  display: flex;\n  flex-grow: 0;\n  flex-shrink: 1;\n  align-items: center;\n  justify-content: center;\n  height: 60%;\n  min-height: 0;\n  border-bottom: 1px solid #eaeaea;\n}\n[data-uppy-theme=dark] .uppy-Dashboard-FileCard-preview {\n  background-color: #333;\n  border-bottom: 0;\n}\n.uppy-Dashboard-FileCard-preview img.uppy-Dashboard-Item-previewImg {\n  flex: 0 0 auto;\n  max-width: 90%;\n  max-height: 90%;\n  -o-object-fit: cover;\n     object-fit: cover;\n  border-radius: 3px;\n  box-shadow: 0 3px 20px rgba(0, 0, 0, 0.15);\n}\n[dir=\"ltr\"] .uppy-Dashboard-FileCard-edit{\n  right: 10px;\n}\n[dir=\"rtl\"] .uppy-Dashboard-FileCard-edit{\n  left: 10px;\n}\n.uppy-Dashboard-FileCard-edit {\n  position: absolute;\n  top: 10px;\n  padding: 7px 15px;\n  color: #fff;\n  font-size: 13px;\n  background-color: rgba(0, 0, 0, 0.5);\n  border-radius: 50px;\n}\n.uppy-Dashboard-FileCard-edit:focus {\n  outline: none;\n}\n.uppy-Dashboard-FileCard-edit::-moz-focus-inner {\n  border: 0;\n}\n.uppy-Dashboard-FileCard-edit:focus {\n  box-shadow: 0 0 0 3px rgba(34, 117, 215, 0.5);\n}\n.uppy-Dashboard-FileCard-edit:hover {\n  background-color: rgba(0, 0, 0, 0.8);\n}\n.uppy-Dashboard-FileCard-info {\n  flex-grow: 0;\n  flex-shrink: 0;\n  height: 40%;\n  padding: 30px 20px 20px 20px;\n  overflow-y: auto;\n  -webkit-overflow-scrolling: touch;\n}\n[data-uppy-theme=dark] .uppy-Dashboard-FileCard-info {\n  background-color: #1f1f1f;\n}\n.uppy-Dashboard-FileCard-fieldset {\n  max-width: 640px;\n  margin: auto;\n  margin-bottom: 12px;\n  padding: 0;\n  font-size: 0;\n  border: 0;\n}\n.uppy-Dashboard-FileCard-label {\n  display: inline-block;\n  width: 22%;\n  color: #525252;\n  font-size: 12px;\n  vertical-align: middle;\n}\n.uppy-size--md .uppy-Dashboard-FileCard-label {\n  font-size: 14px;\n}\n[data-uppy-theme=dark] .uppy-Dashboard-FileCard-label {\n  color: #eaeaea;\n}\n.uppy-Dashboard-FileCard-input {\n  display: inline-block;\n  width: 78%;\n  vertical-align: middle;\n}\n.uppy-Dashboard-FileCard-actions {\n  display: flex;\n  flex-grow: 0;\n  flex-shrink: 0;\n  align-items: center;\n  height: 55px;\n  padding: 0 15px;\n  background-color: #fafafa;\n  border-top: 1px solid #eaeaea;\n}\n.uppy-size--md .uppy-Dashboard-FileCard-actions {\n  height: 65px;\n}\n[data-uppy-theme=dark] .uppy-Dashboard-FileCard-actions {\n  background-color: #1f1f1f;\n  border-top: 1px solid #333;\n}\n[dir=\"ltr\"] .uppy-Dashboard-FileCard-actionsBtn{\n  margin-right: 10px;\n}\n[dir=\"rtl\"] .uppy-Dashboard-FileCard-actionsBtn{\n  margin-left: 10px;\n}\n.uppy-transition-slideDownUp-enter {\n  transform: translate3d(0, -105%, 0);\n  opacity: 0.01;\n  transition: transform 0.25s ease-in-out, opacity 0.25s ease-in-out;\n}\n.uppy-transition-slideDownUp-enter.uppy-transition-slideDownUp-enter-active {\n  transform: translate3d(0, 0, 0);\n  opacity: 1;\n}\n.uppy-transition-slideDownUp-leave {\n  transform: translate3d(0, 0, 0);\n  opacity: 1;\n  transition: transform 0.25s ease-in-out, opacity 0.25s ease-in-out;\n}\n.uppy-transition-slideDownUp-leave.uppy-transition-slideDownUp-leave-active {\n  transform: translate3d(0, -105%, 0);\n  opacity: 0.01;\n}\n@-webkit-keyframes uppy-Dashboard-fadeIn {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n@keyframes uppy-Dashboard-fadeIn {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n@-webkit-keyframes uppy-Dashboard-fadeOut {\nfrom {\n    opacity: 1;\n}\nto {\n    opacity: 0;\n}\n}\n@keyframes uppy-Dashboard-fadeOut {\nfrom {\n    opacity: 1;\n}\nto {\n    opacity: 0;\n}\n}\n@-webkit-keyframes uppy-Dashboard-slideDownAndFadeIn {\nfrom {\n    transform: translate3d(-50%, -70%, 0);\n    opacity: 0;\n}\nto {\n    transform: translate3d(-50%, -50%, 0);\n    opacity: 1;\n}\n}\n@keyframes uppy-Dashboard-slideDownAndFadeIn {\nfrom {\n    transform: translate3d(-50%, -70%, 0);\n    opacity: 0;\n}\nto {\n    transform: translate3d(-50%, -50%, 0);\n    opacity: 1;\n}\n}\n@-webkit-keyframes uppy-Dashboard-slideDownAndFadeIn--small {\nfrom {\n    transform: translate3d(0, -20%, 0);\n    opacity: 0;\n}\nto {\n    transform: translate3d(0, 0, 0);\n    opacity: 1;\n}\n}\n@keyframes uppy-Dashboard-slideDownAndFadeIn--small {\nfrom {\n    transform: translate3d(0, -20%, 0);\n    opacity: 0;\n}\nto {\n    transform: translate3d(0, 0, 0);\n    opacity: 1;\n}\n}\n@-webkit-keyframes uppy-Dashboard-slideUpFadeOut {\nfrom {\n    transform: translate3d(-50%, -50%, 0);\n    opacity: 1;\n}\nto {\n    transform: translate3d(-50%, -70%, 0);\n    opacity: 0;\n}\n}\n@keyframes uppy-Dashboard-slideUpFadeOut {\nfrom {\n    transform: translate3d(-50%, -50%, 0);\n    opacity: 1;\n}\nto {\n    transform: translate3d(-50%, -70%, 0);\n    opacity: 0;\n}\n}\n@-webkit-keyframes uppy-Dashboard-slideUpFadeOut--small {\nfrom {\n    transform: translate3d(0, 0, 0);\n    opacity: 1;\n}\nto {\n    transform: translate3d(0, -20%, 0);\n    opacity: 0;\n}\n}\n@keyframes uppy-Dashboard-slideUpFadeOut--small {\nfrom {\n    transform: translate3d(0, 0, 0);\n    opacity: 1;\n}\nto {\n    transform: translate3d(0, -20%, 0);\n    opacity: 0;\n}\n}\n.uppy-Dashboard--modal {\n  z-index: 1001;\n}\n.uppy-Dashboard--modal[aria-hidden=true] {\n  display: none;\n}\n.uppy-Dashboard--modal.uppy-Dashboard--animateOpenClose > .uppy-Dashboard-inner {\n  -webkit-animation: uppy-Dashboard-slideDownAndFadeIn--small 0.3s cubic-bezier(0, 0, 0.2, 1);\n          animation: uppy-Dashboard-slideDownAndFadeIn--small 0.3s cubic-bezier(0, 0, 0.2, 1);\n}\n@media only screen and (min-width: 820px) {\n.uppy-Dashboard--modal.uppy-Dashboard--animateOpenClose > .uppy-Dashboard-inner {\n    -webkit-animation: uppy-Dashboard-slideDownAndFadeIn 0.3s cubic-bezier(0, 0, 0.2, 1);\n            animation: uppy-Dashboard-slideDownAndFadeIn 0.3s cubic-bezier(0, 0, 0.2, 1);\n}\n}\n.uppy-Dashboard--modal.uppy-Dashboard--animateOpenClose > .uppy-Dashboard-overlay {\n  -webkit-animation: uppy-Dashboard-fadeIn 0.3s cubic-bezier(0, 0, 0.2, 1);\n          animation: uppy-Dashboard-fadeIn 0.3s cubic-bezier(0, 0, 0.2, 1);\n}\n.uppy-Dashboard--modal.uppy-Dashboard--animateOpenClose.uppy-Dashboard--isClosing > .uppy-Dashboard-inner {\n  -webkit-animation: uppy-Dashboard-slideUpFadeOut--small 0.3s cubic-bezier(0, 0, 0.2, 1);\n          animation: uppy-Dashboard-slideUpFadeOut--small 0.3s cubic-bezier(0, 0, 0.2, 1);\n}\n@media only screen and (min-width: 820px) {\n.uppy-Dashboard--modal.uppy-Dashboard--animateOpenClose.uppy-Dashboard--isClosing > .uppy-Dashboard-inner {\n    -webkit-animation: uppy-Dashboard-slideUpFadeOut 0.3s cubic-bezier(0, 0, 0.2, 1);\n            animation: uppy-Dashboard-slideUpFadeOut 0.3s cubic-bezier(0, 0, 0.2, 1);\n}\n}\n.uppy-Dashboard--modal.uppy-Dashboard--animateOpenClose.uppy-Dashboard--isClosing > .uppy-Dashboard-overlay {\n  -webkit-animation: uppy-Dashboard-fadeOut 0.3s cubic-bezier(0, 0, 0.2, 1);\n          animation: uppy-Dashboard-fadeOut 0.3s cubic-bezier(0, 0, 0.2, 1);\n}\n.uppy-Dashboard-isFixed {\n  height: 100vh;\n  overflow: hidden;\n}\n.uppy-Dashboard--modal .uppy-Dashboard-overlay {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1001;\n  background-color: rgba(0, 0, 0, 0.5);\n}\n.uppy-Dashboard-inner {\n  position: relative;\n  max-width: 100%;\n  max-height: 100%;\n  background-color: #fafafa;\n  border: 1px solid #eaeaea;\n  border-radius: 5px;\n  outline: none;\n}\n.uppy-size--md .uppy-Dashboard-inner {\n  min-height: auto;\n}\n@media only screen and (min-width: 820px) {\n.uppy-Dashboard-inner {\n    width: 750px;\n    height: 550px;\n}\n}\n.uppy-Dashboard--modal .uppy-Dashboard-inner {\n  z-index: 1002;\n}\n[data-uppy-theme=dark] .uppy-Dashboard-inner {\n  background-color: #1f1f1f;\n}\n.uppy-Dashboard--isDisabled .uppy-Dashboard-inner {\n  cursor: not-allowed;\n}\n.uppy-Dashboard-innerWrap {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  overflow: hidden;\n  border-radius: 5px;\n  opacity: 0;\n}\n.uppy-Dashboard--isInnerWrapVisible .uppy-Dashboard-innerWrap {\n  opacity: 1;\n}\n.uppy-Dashboard--isDisabled .uppy-Dashboard-innerWrap {\n  opacity: 0.6;\n  filter: grayscale(100%);\n  -webkit-user-select: none;\n          -moz-user-select: none;\n           -ms-user-select: none;\n       user-select: none;\n  pointer-events: none;\n}\n.uppy-Dashboard--isDisabled .uppy-ProviderIconBg {\n  fill: #9f9f9f;\n}\n.uppy-Dashboard--modal .uppy-Dashboard-inner {\n  position: fixed;\n  top: 35px;\n  right: 15px;\n  bottom: 15px;\n  left: 15px;\n  border: none;\n}\n@media only screen and (min-width: 820px) {\n.uppy-Dashboard--modal .uppy-Dashboard-inner {\n    top: 50%;\n    right: auto;\n    left: 50%;\n    box-shadow: 0 5px 15px 4px rgba(0, 0, 0, 0.15);\n    transform: translate(-50%, -50%);\n}\n}\n[dir=\"ltr\"] .uppy-Dashboard-close{\n  right: -2px;\n}\n[dir=\"rtl\"] .uppy-Dashboard-close{\n  left: -2px;\n}\n.uppy-Dashboard-close {\n  position: absolute;\n  top: -33px;\n  z-index: 1005;\n  display: block;\n  color: rgba(255, 255, 255, 0.9);\n  font-size: 27px;\n  cursor: pointer;\n}\n.uppy-Dashboard-close:focus {\n  outline: none;\n}\n.uppy-Dashboard-close::-moz-focus-inner {\n  border: 0;\n}\n.uppy-Dashboard-close:focus {\n  color: #8cb8ed;\n}\n@media only screen and (min-width: 820px) {\n[dir=\"ltr\"] .uppy-Dashboard-close{\n    right: -35px;\n}\n[dir=\"rtl\"] .uppy-Dashboard-close{\n    left: -35px;\n}\n.uppy-Dashboard-close {\n    top: -10px;\n    font-size: 35px;\n}\n}\n.uppy-Dashboard-serviceMsg {\n  position: relative;\n  top: -1px;\n  z-index: 1004;\n  padding: 12px 0;\n  font-weight: 500;\n  font-size: 12px;\n  line-height: 1.3;\n  background-color: #fffbf7;\n  border-top: 1px solid #edd4b9;\n  border-bottom: 1px solid #edd4b9;\n}\n.uppy-size--md .uppy-Dashboard-serviceMsg {\n  font-size: 14px;\n  line-height: 1.4;\n}\n[data-uppy-theme=dark] .uppy-Dashboard-serviceMsg {\n  color: #eaeaea;\n  background-color: #1f1f1f;\n  border-top: 1px solid #333;\n  border-bottom: 1px solid #333;\n}\n.uppy-Dashboard-serviceMsg-title {\n  display: block;\n  margin-bottom: 4px;\n  padding-left: 42px;\n  line-height: 1;\n}\n.uppy-Dashboard-serviceMsg-text {\n  padding: 0 15px;\n}\n.uppy-Dashboard-serviceMsg-actionBtn {\n  color: #2275d7;\n  font-weight: inherit;\n  font-size: inherit;\n  vertical-align: initial;\n}\n[data-uppy-theme=dark] .uppy-Dashboard-serviceMsg-actionBtn {\n  color: rgba(2, 186, 242, 0.9);\n}\n.uppy-Dashboard-serviceMsg-icon {\n  position: absolute;\n  top: 10px;\n  left: 15px;\n}\n.uppy-Dashboard-AddFiles {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n  text-align: center;\n}\n[data-uppy-drag-drop-supported=true] .uppy-Dashboard-AddFiles {\n  height: calc(100% - 14px);\n  margin: 7px;\n  border: 1px dashed #dfdfdf;\n  border-radius: 3px;\n}\n.uppy-Dashboard-AddFilesPanel .uppy-Dashboard-AddFiles {\n  height: calc(100% - 14px - 40px);\n  border: none;\n}\n.uppy-Dashboard--modal .uppy-Dashboard-AddFiles {\n  border-color: #cfcfcf;\n}\n[data-uppy-theme=dark] .uppy-Dashboard-AddFiles {\n  border-color: #757575;\n}\n.uppy-Dashboard-AddFiles-info {\n  display: none;\n  margin-top: auto;\n  padding-top: 15px;\n  padding-bottom: 15px;\n}\n.uppy-size--height-md .uppy-Dashboard-AddFiles-info {\n  display: block;\n}\n.uppy-size--md .uppy-Dashboard-AddFiles-info {\n  position: absolute;\n  right: 0;\n  bottom: 25px;\n  left: 0;\n  padding-top: 30px;\n  padding-bottom: 0;\n}\n[data-uppy-num-acquirers=\"0\"] .uppy-Dashboard-AddFiles-info {\n  margin-top: 0;\n}\n.uppy-Dashboard-browse {\n  color: rgba(34, 117, 215, 0.9);\n  cursor: pointer;\n}\n.uppy-Dashboard-browse:focus {\n  outline: none;\n}\n.uppy-Dashboard-browse::-moz-focus-inner {\n  border: 0;\n}\n.uppy-Dashboard-browse:hover, .uppy-Dashboard-browse:focus {\n  border-bottom: 1px solid #2275d7;\n}\n[data-uppy-theme=dark] .uppy-Dashboard-browse {\n  color: rgba(2, 186, 242, 0.9);\n}\n[data-uppy-theme=dark] .uppy-Dashboard-browse:hover, [data-uppy-theme=dark] .uppy-Dashboard-browse:focus {\n  border-bottom: 1px solid #02baf2;\n}\n.uppy-Dashboard-browseBtn {\n  display: block;\n  width: 100%;\n  margin-top: 8px;\n  margin-bottom: 5px;\n  font-weight: 500;\n  font-size: 14px;\n}\n.uppy-size--md .uppy-Dashboard-browseBtn {\n  width: auto;\n  margin: auto;\n  margin-top: 15px;\n  margin-bottom: 15px;\n  padding: 13px 44px;\n  font-size: 15px;\n}\n.uppy-Dashboard-AddFiles-list {\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  width: 100%;\n  margin-top: 2px;\n  padding: 2px 0;\n  overflow-y: auto;\n  -webkit-overflow-scrolling: touch;\n}\n.uppy-size--md .uppy-Dashboard-AddFiles-list {\n  flex: none;\n  flex-direction: row;\n  flex-wrap: wrap;\n  justify-content: center;\n  max-width: 600px;\n  margin-top: 15px;\n  padding-top: 0;\n  overflow-y: visible;\n}\n.uppy-DashboardTab {\n  width: 100%;\n  text-align: center;\n  border-bottom: 1px solid #eaeaea;\n}\n[data-uppy-theme=dark] .uppy-DashboardTab {\n  border-bottom: 1px solid #333;\n}\n.uppy-size--md .uppy-DashboardTab {\n  display: inline-block;\n  width: initial;\n  margin-bottom: 10px;\n  border-bottom: none;\n}\n.uppy-DashboardTab-btn {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  width: 100%;\n  height: 100%;\n  padding: 12px 15px;\n  color: #525252;\n  background-color: transparent;\n  cursor: pointer;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n       appearance: none;\n}\n.uppy-DashboardTab-btn:focus {\n  outline: none;\n}\n.uppy-DashboardTab-btn::-moz-focus-inner {\n  border: 0;\n}\n[dir=\"ltr\"] .uppy-size--md .uppy-DashboardTab-btn{\n  margin-right: 1px;\n}\n[dir=\"rtl\"] .uppy-size--md .uppy-DashboardTab-btn{\n  margin-left: 1px;\n}\n.uppy-size--md .uppy-DashboardTab-btn {\n  flex-direction: column;\n  width: 86px;\n  padding: 10px 3px;\n  border-radius: 5px;\n}\n[data-uppy-theme=dark] .uppy-DashboardTab-btn {\n  color: #eaeaea;\n}\n.uppy-DashboardTab-btn::-moz-focus-inner {\n  border: 0;\n}\n.uppy-DashboardTab-btn:hover {\n  background-color: #f1f3f6;\n}\n[data-uppy-theme=dark] .uppy-DashboardTab-btn:hover {\n  background-color: #333;\n}\n.uppy-DashboardTab-btn:active,\n.uppy-DashboardTab-btn:focus {\n  background-color: #eceef2;\n}\n[data-uppy-theme=dark] .uppy-DashboardTab-btn:active,\n[data-uppy-theme=dark] .uppy-DashboardTab-btn:focus {\n  background-color: #525252;\n}\n[dir=\"ltr\"] .uppy-DashboardTab-btn svg{\n  margin-right: 10px;\n}\n[dir=\"rtl\"] .uppy-DashboardTab-btn svg{\n  margin-left: 10px;\n}\n.uppy-DashboardTab-btn svg {\n  display: inline-block;\n  max-width: 100%;\n  max-height: 100%;\n  overflow: hidden;\n  vertical-align: text-top;\n  transition: transform ease-in-out 0.15s;\n}\n[dir=\"ltr\"] .uppy-size--md .uppy-DashboardTab-btn svg{\n  margin-right: 0;\n}\n[dir=\"rtl\"] .uppy-size--md .uppy-DashboardTab-btn svg{\n  margin-left: 0;\n}\n.uppy-DashboardTab-name {\n  font-weight: 500;\n  font-size: 14px;\n}\n.uppy-size--md .uppy-DashboardTab-name {\n  margin-top: 8px;\n  margin-bottom: 0;\n  font-size: 11px;\n  line-height: 15px;\n}\n.uppy-DashboardTab svg {\n  width: 23px;\n  height: 23px;\n  vertical-align: middle;\n}\n.uppy-size--md .uppy-DashboardTab svg {\n  width: 30px;\n  height: 30px;\n}\n.uppy-Dashboard-input {\n  position: absolute;\n  z-index: -1;\n  width: 0.1px;\n  height: 0.1px;\n  overflow: hidden;\n  opacity: 0;\n}\n.uppy-DashboardContent-bar {\n  position: relative;\n  z-index: 1004;\n  display: flex;\n  flex-shrink: 0;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  height: 40px;\n  padding: 0 10px;\n  background-color: #fafafa;\n  border-bottom: 1px solid #eaeaea;\n}\n.uppy-size--md .uppy-DashboardContent-bar {\n  height: 50px;\n  padding: 0 15px;\n}\n[data-uppy-theme=dark] .uppy-DashboardContent-bar {\n  background-color: #1f1f1f;\n  border-bottom: 1px solid #333;\n}\n.uppy-DashboardContent-title {\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n  width: 100%;\n  max-width: 170px;\n  margin: auto;\n  overflow-x: hidden;\n  font-weight: 500;\n  font-size: 12px;\n  line-height: 40px;\n  white-space: nowrap;\n  text-align: center;\n  text-overflow: ellipsis;\n}\n.uppy-size--md .uppy-DashboardContent-title {\n  max-width: 300px;\n  font-size: 14px;\n  line-height: 50px;\n}\n[data-uppy-theme=dark] .uppy-DashboardContent-title {\n  color: #eaeaea;\n}\n[dir=\"ltr\"] .uppy-DashboardContent-back,[dir=\"ltr\"] \n.uppy-DashboardContent-save{\n  margin-left: -6px;\n}\n[dir=\"rtl\"] .uppy-DashboardContent-back,[dir=\"rtl\"] \n.uppy-DashboardContent-save{\n  margin-right: -6px;\n}\n.uppy-DashboardContent-back,\n.uppy-DashboardContent-save {\n  margin: 0;\n  padding: 0;\n  color: inherit;\n  font-size: inherit;\n  font-family: inherit;\n  line-height: 1;\n  background: none;\n  border: 0;\n  -webkit-appearance: none;\n  padding: 7px 6px;\n  color: #2275d7;\n  font-weight: 400;\n  font-size: 12px;\n  border-radius: 3px;\n  cursor: pointer;\n}\n.uppy-DashboardContent-back:focus,\n.uppy-DashboardContent-save:focus {\n  outline: none;\n}\n.uppy-DashboardContent-back::-moz-focus-inner,\n.uppy-DashboardContent-save::-moz-focus-inner {\n  border: 0;\n}\n.uppy-DashboardContent-back:hover,\n.uppy-DashboardContent-save:hover {\n  color: #1b5dab;\n}\n.uppy-DashboardContent-back:focus,\n.uppy-DashboardContent-save:focus {\n  background-color: #eceef2;\n}\n[data-uppy-theme=dark] .uppy-DashboardContent-back:focus,\n[data-uppy-theme=dark] .uppy-DashboardContent-save:focus {\n  background-color: #333;\n}\n.uppy-size--md .uppy-DashboardContent-back,\n.uppy-size--md .uppy-DashboardContent-save {\n  font-size: 14px;\n}\n[data-uppy-theme=dark] .uppy-DashboardContent-back,\n[data-uppy-theme=dark] .uppy-DashboardContent-save {\n  color: #02baf2;\n}\n[dir=\"ltr\"] .uppy-DashboardContent-addMore{\n  margin-right: -5px;\n}\n[dir=\"rtl\"] .uppy-DashboardContent-addMore{\n  margin-left: -5px;\n}\n.uppy-DashboardContent-addMore {\n  margin: 0;\n  padding: 0;\n  color: inherit;\n  font-size: inherit;\n  font-family: inherit;\n  line-height: 1;\n  background: none;\n  border: 0;\n  -webkit-appearance: none;\n  width: 29px;\n  height: 29px;\n  padding: 7px 8px;\n  color: #2275d7;\n  font-weight: 500;\n  border-radius: 3px;\n  cursor: pointer;\n}\n.uppy-DashboardContent-addMore:focus {\n  outline: none;\n}\n.uppy-DashboardContent-addMore::-moz-focus-inner {\n  border: 0;\n}\n.uppy-DashboardContent-addMore:hover {\n  color: #1b5dab;\n}\n.uppy-DashboardContent-addMore:focus {\n  background-color: #eceef2;\n}\n[data-uppy-theme=dark] .uppy-DashboardContent-addMore:focus {\n  background-color: #333;\n}\n[dir=\"ltr\"] .uppy-size--md .uppy-DashboardContent-addMore{\n  margin-right: -8px;\n}\n[dir=\"rtl\"] .uppy-size--md .uppy-DashboardContent-addMore{\n  margin-left: -8px;\n}\n.uppy-size--md .uppy-DashboardContent-addMore {\n  width: auto;\n  height: auto;\n  font-size: 14px;\n}\n[data-uppy-theme=dark] .uppy-DashboardContent-addMore {\n  color: #02baf2;\n}\n[dir=\"ltr\"] .uppy-DashboardContent-addMore svg{\n  margin-right: 4px;\n}\n[dir=\"rtl\"] .uppy-DashboardContent-addMore svg{\n  margin-left: 4px;\n}\n.uppy-DashboardContent-addMore svg {\n  vertical-align: baseline;\n}\n.uppy-size--md .uppy-DashboardContent-addMore svg {\n  width: 11px;\n  height: 11px;\n}\n.uppy-DashboardContent-addMoreCaption {\n  display: none;\n}\n.uppy-size--md .uppy-DashboardContent-addMoreCaption {\n  display: inline;\n}\n.uppy-DashboardContent-panel {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1005;\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  overflow: hidden;\n  background-color: whitesmoke;\n  border-radius: 5px;\n}\n.uppy-Dashboard-AddFilesPanel {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1005;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  background: #fafafa;\n  background: linear-gradient(0deg, #fafafa 35%, rgba(250, 250, 250, 0.85) 100%);\n  border-radius: 5px;\n  box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.15);\n}\n[data-uppy-theme=dark] .uppy-Dashboard-AddFilesPanel {\n  background-color: #333;\n  background-image: linear-gradient(0deg, #1f1f1f 35%, rgba(31, 31, 31, 0.85) 100%);\n}\n.uppy-Dashboard--isAddFilesPanelVisible .uppy-Dashboard-files {\n  filter: blur(2px);\n}\n.uppy-Dashboard-progress {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 12%;\n}\n.uppy-Dashboard-progressBarContainer.is-active {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 1004;\n  width: 100%;\n  height: 100%;\n}\n.uppy-Dashboard-filesContainer {\n  position: relative;\n  flex: 1;\n  margin: 0;\n  overflow-y: hidden;\n}\n.uppy-Dashboard-filesContainer::after {\n  display: table;\n  clear: both;\n  content: \"\";\n}\n.uppy-Dashboard-files {\n  flex: 1;\n  margin: 0;\n  padding: 0 0 10px 0;\n  overflow-y: auto;\n  -webkit-overflow-scrolling: touch;\n}\n.uppy-size--md .uppy-Dashboard-files {\n  padding-top: 10px;\n}\n.uppy-Dashboard-dropFilesHereHint {\n  position: absolute;\n  top: 7px;\n  right: 7px;\n  bottom: 7px;\n  left: 7px;\n  z-index: 2000;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding-top: 90px;\n  color: #757575;\n  font-size: 16px;\n  text-align: center;\n  background-image: url(\"data:image/svg+xml,%3Csvg width='48' height='48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 1v1C11.85 2 2 11.85 2 24s9.85 22 22 22 22-9.85 22-22S36.15 2 24 2V1zm0 0V0c13.254 0 24 10.746 24 24S37.254 48 24 48 0 37.254 0 24 10.746 0 24 0v1zm7.707 19.293a.999.999 0 1 1-1.414 1.414L25 16.414V34a1 1 0 1 1-2 0V16.414l-5.293 5.293a.999.999 0 1 1-1.414-1.414l7-7a.999.999 0 0 1 1.414 0l7 7z' fill='%232275D7' fill-rule='nonzero'/%3E%3C/svg%3E\");\n  background-repeat: no-repeat;\n  background-position: 50% 50%;\n  border: 1px dashed #2275d7;\n  border-radius: 3px;\n  visibility: hidden;\n}\n[data-uppy-theme=dark] .uppy-Dashboard-dropFilesHereHint {\n  color: #bbb;\n  background-image: url(\"data:image/svg+xml,%3Csvg width='48' height='48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 1v1C11.85 2 2 11.85 2 24s9.85 22 22 22 22-9.85 22-22S36.15 2 24 2V1zm0 0V0c13.254 0 24 10.746 24 24S37.254 48 24 48 0 37.254 0 24 10.746 0 24 0v1zm7.707 19.293a.999.999 0 1 1-1.414 1.414L25 16.414V34a1 1 0 1 1-2 0V16.414l-5.293 5.293a.999.999 0 1 1-1.414-1.414l7-7a.999.999 0 0 1 1.414 0l7 7z' fill='%2302BAF2' fill-rule='nonzero'/%3E%3C/svg%3E\");\n  border-color: #02baf2;\n}\n.uppy-Dashboard.uppy-Dashboard--isDraggingOver .uppy-Dashboard-dropFilesHereHint {\n  visibility: visible;\n}\n.uppy-Dashboard.uppy-Dashboard--isDraggingOver .uppy-DashboardContent-bar,\n.uppy-Dashboard.uppy-Dashboard--isDraggingOver .uppy-Dashboard-files,\n.uppy-Dashboard.uppy-Dashboard--isDraggingOver .uppy-Dashboard-progressindicators,\n.uppy-Dashboard.uppy-Dashboard--isDraggingOver .uppy-Dashboard-serviceMsg {\n  opacity: 0.15;\n}\n.uppy-Dashboard.uppy-Dashboard--isDraggingOver .uppy-Dashboard-AddFiles {\n  opacity: 0.03;\n}\n.uppy-Dashboard-AddFiles-title {\n  width: 100%;\n  margin-top: 15px;\n  margin-bottom: 5px;\n  padding: 0 15px;\n  color: #000;\n  font-weight: 500;\n  font-size: 17px;\n  line-height: 1.35;\n  text-align: inline-start;\n}\n.uppy-size--md .uppy-Dashboard-AddFiles-title {\n  max-width: 480px;\n  margin-top: 5px;\n  font-weight: 400;\n  font-size: 25px;\n  text-align: center;\n}\n[data-uppy-num-acquirers=\"0\"] .uppy-Dashboard-AddFiles-title {\n  text-align: center;\n}\n[data-uppy-theme=dark] .uppy-Dashboard-AddFiles-title {\n  color: #eaeaea;\n}\n.uppy-Dashboard-AddFiles-title button {\n  font-weight: 500;\n}\n.uppy-size--md .uppy-Dashboard-AddFiles-title button {\n  font-weight: 400;\n}\n.uppy-Dashboard-note {\n  max-width: 350px;\n  margin: auto;\n  padding: 0 15px;\n  color: #757575;\n  font-size: 14px;\n  line-height: 1.25;\n  text-align: center;\n}\n.uppy-size--md .uppy-Dashboard-note {\n  max-width: 600px;\n  font-size: 15px;\n  line-height: 1.35;\n}\n[data-uppy-theme=dark] .uppy-Dashboard-note {\n  color: #cfcfcf;\n}\na.uppy-Dashboard-poweredBy {\n  display: inline-block;\n  margin-top: 8px;\n  color: #939393;\n  font-size: 11px;\n  text-align: center;\n  text-decoration: none;\n}\n.uppy-Dashboard-poweredByIcon {\n  position: relative;\n  top: 1px;\n  margin-right: 1px;\n  margin-left: 1px;\n  vertical-align: text-top;\n  opacity: 0.9;\n  fill: none;\n  stroke: #939393;\n}\n.uppy-Dashboard-Item-previewIcon {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  z-index: 100;\n  width: 25px;\n  height: 25px;\n  transform: translate(-50%, -50%);\n}\n.uppy-size--md .uppy-Dashboard-Item-previewIcon {\n  width: 38px;\n  height: 38px;\n}\n.uppy-Dashboard-Item-previewIcon svg {\n  width: 100%;\n  height: 100%;\n}\n.uppy-Dashboard-Item-previewIconWrap {\n  position: relative;\n  height: 76px;\n  max-height: 75%;\n}\n.uppy-Dashboard-Item-previewIconBg {\n  width: 100%;\n  height: 100%;\n  filter: drop-shadow(rgba(0, 0, 0, 0.1) 0 1px 1px);\n}\n.uppy-Dashboard-upload {\n  position: relative;\n  width: 50px;\n  height: 50px;\n}\n.uppy-size--md .uppy-Dashboard-upload {\n  width: 60px;\n  height: 60px;\n}\n.uppy-Dashboard-upload .uppy-c-icon {\n  position: relative;\n  top: 1px;\n  width: 50%;\n}\n[dir=\"ltr\"] .uppy-Dashboard-uploadCount{\n  right: -12px;\n}\n[dir=\"rtl\"] .uppy-Dashboard-uploadCount{\n  left: -12px;\n}\n.uppy-Dashboard-uploadCount {\n  position: absolute;\n  top: -12px;\n  width: 16px;\n  height: 16px;\n  color: #fff;\n  font-size: 8px;\n  line-height: 16px;\n  background-color: #1bb240;\n  border-radius: 50%;\n}\n.uppy-size--md .uppy-Dashboard-uploadCount {\n  width: 18px;\n  height: 18px;\n  font-size: 9px;\n  line-height: 18px;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/exifr/dist/mini.umd.js":
/*!*********************************************!*\
  !*** ./node_modules/exifr/dist/mini.umd.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

/* provided dependency */ var process = __webpack_require__(/*! process/browser.js */ "./node_modules/process/browser.js");
/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
!function(e,t){ true?t(exports):0}(this,(function(e){"use strict";function t(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}var s="undefined"!=typeof self?self:__webpack_require__.g;const i="undefined"!=typeof navigator,n=i&&"undefined"==typeof HTMLImageElement,r=!("undefined"==typeof __webpack_require__.g||"undefined"==typeof process||!process.versions||!process.versions.node),a=s.Buffer,h=!!a,f=e=>void 0!==e;function l(e){return void 0===e||(e instanceof Map?0===e.size:0===Object.values(e).filter(f).length)}function o(e){let t=new Error(e);throw delete t.stack,t}function u(e){let t=function(e){let t=0;return e.ifd0.enabled&&(t+=1024),e.exif.enabled&&(t+=2048),e.makerNote&&(t+=2048),e.userComment&&(t+=1024),e.gps.enabled&&(t+=512),e.interop.enabled&&(t+=100),e.ifd1.enabled&&(t+=1024),t+2048}(e);return e.jfif.enabled&&(t+=50),e.xmp.enabled&&(t+=2e4),e.iptc.enabled&&(t+=14e3),e.icc.enabled&&(t+=6e3),t}const d=e=>String.fromCharCode.apply(null,e),c="undefined"!=typeof TextDecoder?new TextDecoder("utf-8"):void 0;class p{static from(e,t){return e instanceof this&&e.le===t?e:new p(e,void 0,void 0,t)}constructor(e,t=0,s,i){if("boolean"==typeof i&&(this.le=i),Array.isArray(e)&&(e=new Uint8Array(e)),0===e)this.byteOffset=0,this.byteLength=0;else if(e instanceof ArrayBuffer){void 0===s&&(s=e.byteLength-t);let i=new DataView(e,t,s);this._swapDataView(i)}else if(e instanceof Uint8Array||e instanceof DataView||e instanceof p){void 0===s&&(s=e.byteLength-t),(t+=e.byteOffset)+s>e.byteOffset+e.byteLength&&o("Creating view outside of available memory in ArrayBuffer");let i=new DataView(e.buffer,t,s);this._swapDataView(i)}else if("number"==typeof e){let t=new DataView(new ArrayBuffer(e));this._swapDataView(t)}else o("Invalid input argument for BufferView: "+e)}_swapArrayBuffer(e){this._swapDataView(new DataView(e))}_swapBuffer(e){this._swapDataView(new DataView(e.buffer,e.byteOffset,e.byteLength))}_swapDataView(e){this.dataView=e,this.buffer=e.buffer,this.byteOffset=e.byteOffset,this.byteLength=e.byteLength}_lengthToEnd(e){return this.byteLength-e}set(e,t,s=p){return e instanceof DataView||e instanceof p?e=new Uint8Array(e.buffer,e.byteOffset,e.byteLength):e instanceof ArrayBuffer&&(e=new Uint8Array(e)),e instanceof Uint8Array||o("BufferView.set(): Invalid data argument."),this.toUint8().set(e,t),new s(this,t,e.byteLength)}subarray(e,t){return t=t||this._lengthToEnd(e),new p(this,e,t)}toUint8(){return new Uint8Array(this.buffer,this.byteOffset,this.byteLength)}getUint8Array(e,t){return new Uint8Array(this.buffer,this.byteOffset+e,t)}getString(e=0,t=this.byteLength){let s=this.getUint8Array(e,t);return i=s,c?c.decode(i):h?Buffer.from(i).toString("utf8"):decodeURIComponent(escape(d(i)));var i}getLatin1String(e=0,t=this.byteLength){let s=this.getUint8Array(e,t);return d(s)}getUnicodeString(e=0,t=this.byteLength){const s=[];for(let i=0;i<t&&e+i<this.byteLength;i+=2)s.push(this.getUint16(e+i));return d(s)}getInt8(e){return this.dataView.getInt8(e)}getUint8(e){return this.dataView.getUint8(e)}getInt16(e,t=this.le){return this.dataView.getInt16(e,t)}getInt32(e,t=this.le){return this.dataView.getInt32(e,t)}getUint16(e,t=this.le){return this.dataView.getUint16(e,t)}getUint32(e,t=this.le){return this.dataView.getUint32(e,t)}getFloat32(e,t=this.le){return this.dataView.getFloat32(e,t)}getFloat64(e,t=this.le){return this.dataView.getFloat64(e,t)}getFloat(e,t=this.le){return this.dataView.getFloat32(e,t)}getDouble(e,t=this.le){return this.dataView.getFloat64(e,t)}getUintBytes(e,t,s){switch(t){case 1:return this.getUint8(e,s);case 2:return this.getUint16(e,s);case 4:return this.getUint32(e,s);case 8:return this.getUint64&&this.getUint64(e,s)}}getUint(e,t,s){switch(t){case 8:return this.getUint8(e,s);case 16:return this.getUint16(e,s);case 32:return this.getUint32(e,s);case 64:return this.getUint64&&this.getUint64(e,s)}}toString(e){return this.dataView.toString(e,this.constructor.name)}ensureChunk(){}}function g(e,t){o(`${e} '${t}' was not loaded, try using full build of exifr.`)}class m extends Map{constructor(e){super(),this.kind=e}get(e,t){return this.has(e)||g(this.kind,e),t&&(e in t||function(e,t){o(`Unknown ${e} '${t}'.`)}(this.kind,e),t[e].enabled||g(this.kind,e)),super.get(e)}keyList(){return Array.from(this.keys())}}var y=new m("file parser"),b=new m("segment parser"),w=new m("file reader");let k=s.fetch;const O="Invalid input argument";function v(e,t){return(s=e).startsWith("data:")||s.length>1e4?A(e,t,"base64"):r&&e.includes("://")?S(e,t,"url",U):r?A(e,t,"fs"):i?S(e,t,"url",U):void o(O);var s}async function S(e,t,s,i){return w.has(s)?A(e,t,s):i?async function(e,t){let s=await t(e);return new p(s)}(e,i):void o(`Parser ${s} is not loaded`)}async function A(e,t,s){let i=new(w.get(s))(e,t);return await i.read(),i}const U=e=>k(e).then((e=>e.arrayBuffer())),x=e=>new Promise(((t,s)=>{let i=new FileReader;i.onloadend=()=>t(i.result||new ArrayBuffer),i.onerror=s,i.readAsArrayBuffer(e)}));class C extends Map{get tagKeys(){return this.allKeys||(this.allKeys=Array.from(this.keys())),this.allKeys}get tagValues(){return this.allValues||(this.allValues=Array.from(this.values())),this.allValues}}function B(e,t,s){let i=new C;for(let[e,t]of s)i.set(e,t);if(Array.isArray(t))for(let s of t)e.set(s,i);else e.set(t,i);return i}function V(e,t,s){let i,n=e.get(t);for(i of s)n.set(i[0],i[1])}const I=new Map,L=new Map,T=new Map,P=37500,z=37510,F=33723,j=34675,E=34665,_=34853,D=40965,M=["chunked","firstChunkSize","firstChunkSizeNode","firstChunkSizeBrowser","chunkSize","chunkLimit"],N=["jfif","xmp","icc","iptc","ihdr"],R=["tiff",...N],$=["ifd0","ifd1","exif","gps","interop"],K=[...R,...$],W=["makerNote","userComment"],X=["translateKeys","translateValues","reviveValues","multiSegment"],H=[...X,"sanitize","mergeOutput","silentErrors"];class Y{get translate(){return this.translateKeys||this.translateValues||this.reviveValues}}class G extends Y{get needed(){return this.enabled||this.deps.size>0}constructor(e,s,i,n){if(super(),t(this,"enabled",!1),t(this,"skip",new Set),t(this,"pick",new Set),t(this,"deps",new Set),t(this,"translateKeys",!1),t(this,"translateValues",!1),t(this,"reviveValues",!1),this.key=e,this.enabled=s,this.parse=this.enabled,this.applyInheritables(n),this.canBeFiltered=$.includes(e),this.canBeFiltered&&(this.dict=I.get(e)),void 0!==i)if(Array.isArray(i))this.parse=this.enabled=!0,this.canBeFiltered&&i.length>0&&this.translateTagSet(i,this.pick);else if("object"==typeof i){if(this.enabled=!0,this.parse=!1!==i.parse,this.canBeFiltered){let{pick:e,skip:t}=i;e&&e.length>0&&this.translateTagSet(e,this.pick),t&&t.length>0&&this.translateTagSet(t,this.skip)}this.applyInheritables(i)}else!0===i||!1===i?this.parse=this.enabled=i:o(`Invalid options argument: ${i}`)}applyInheritables(e){let t,s;for(t of X)s=e[t],void 0!==s&&(this[t]=s)}translateTagSet(e,t){if(this.dict){let s,i,{tagKeys:n,tagValues:r}=this.dict;for(s of e)"string"==typeof s?(i=r.indexOf(s),-1===i&&(i=n.indexOf(Number(s))),-1!==i&&t.add(Number(n[i]))):t.add(s)}else for(let s of e)t.add(s)}finalizeFilters(){!this.enabled&&this.deps.size>0?(this.enabled=!0,te(this.pick,this.deps)):this.enabled&&this.pick.size>0&&te(this.pick,this.deps)}}var J={jfif:!1,tiff:!0,xmp:!1,icc:!1,iptc:!1,ifd0:!0,ifd1:!1,exif:!0,gps:!0,interop:!1,ihdr:void 0,makerNote:!1,userComment:!1,multiSegment:!1,skip:[],pick:[],translateKeys:!0,translateValues:!0,reviveValues:!0,sanitize:!0,mergeOutput:!0,silentErrors:!0,chunked:!0,firstChunkSize:void 0,firstChunkSizeNode:512,firstChunkSizeBrowser:65536,chunkSize:65536,chunkLimit:5},q=new Map;class Q extends Y{static useCached(e){let t=q.get(e);return void 0!==t||(t=new this(e),q.set(e,t)),t}constructor(e){super(),!0===e?this.setupFromTrue():void 0===e?this.setupFromUndefined():Array.isArray(e)?this.setupFromArray(e):"object"==typeof e?this.setupFromObject(e):o(`Invalid options argument ${e}`),void 0===this.firstChunkSize&&(this.firstChunkSize=i?this.firstChunkSizeBrowser:this.firstChunkSizeNode),this.mergeOutput&&(this.ifd1.enabled=!1),this.filterNestedSegmentTags(),this.traverseTiffDependencyTree(),this.checkLoadedPlugins()}setupFromUndefined(){let e;for(e of M)this[e]=J[e];for(e of H)this[e]=J[e];for(e of W)this[e]=J[e];for(e of K)this[e]=new G(e,J[e],void 0,this)}setupFromTrue(){let e;for(e of M)this[e]=J[e];for(e of H)this[e]=J[e];for(e of W)this[e]=!0;for(e of K)this[e]=new G(e,!0,void 0,this)}setupFromArray(e){let t;for(t of M)this[t]=J[t];for(t of H)this[t]=J[t];for(t of W)this[t]=J[t];for(t of K)this[t]=new G(t,!1,void 0,this);this.setupGlobalFilters(e,void 0,$)}setupFromObject(e){let t;for(t of($.ifd0=$.ifd0||$.image,$.ifd1=$.ifd1||$.thumbnail,Object.assign(this,e),M))this[t]=ee(e[t],J[t]);for(t of H)this[t]=ee(e[t],J[t]);for(t of W)this[t]=ee(e[t],J[t]);for(t of R)this[t]=new G(t,J[t],e[t],this);for(t of $)this[t]=new G(t,J[t],e[t],this.tiff);this.setupGlobalFilters(e.pick,e.skip,$,K),!0===e.tiff?this.batchEnableWithBool($,!0):!1===e.tiff?this.batchEnableWithUserValue($,e):Array.isArray(e.tiff)?this.setupGlobalFilters(e.tiff,void 0,$):"object"==typeof e.tiff&&this.setupGlobalFilters(e.tiff.pick,e.tiff.skip,$)}batchEnableWithBool(e,t){for(let s of e)this[s].enabled=t}batchEnableWithUserValue(e,t){for(let s of e){let e=t[s];this[s].enabled=!1!==e&&void 0!==e}}setupGlobalFilters(e,t,s,i=s){if(e&&e.length){for(let e of i)this[e].enabled=!1;let t=Z(e,s);for(let[e,s]of t)te(this[e].pick,s),this[e].enabled=!0}else if(t&&t.length){let e=Z(t,s);for(let[t,s]of e)te(this[t].skip,s)}}filterNestedSegmentTags(){let{ifd0:e,exif:t,xmp:s,iptc:i,icc:n}=this;this.makerNote?t.deps.add(P):t.skip.add(P),this.userComment?t.deps.add(z):t.skip.add(z),s.enabled||e.skip.add(700),i.enabled||e.skip.add(F),n.enabled||e.skip.add(j)}traverseTiffDependencyTree(){let{ifd0:e,exif:t,gps:s,interop:i}=this;i.needed&&(t.deps.add(D),e.deps.add(D)),t.needed&&e.deps.add(E),s.needed&&e.deps.add(_),this.tiff.enabled=$.some((e=>!0===this[e].enabled))||this.makerNote||this.userComment;for(let e of $)this[e].finalizeFilters()}get onlyTiff(){return!N.map((e=>this[e].enabled)).some((e=>!0===e))&&this.tiff.enabled}checkLoadedPlugins(){for(let e of R)this[e].enabled&&!b.has(e)&&g("segment parser",e)}}function Z(e,t){let s,i,n,r,a=[];for(n of t){for(r of(s=I.get(n),i=[],s))(e.includes(r[0])||e.includes(r[1]))&&i.push(r[0]);i.length&&a.push([n,i])}return a}function ee(e,t){return void 0!==e?e:void 0!==t?t:void 0}function te(e,t){for(let s of t)e.add(s)}t(Q,"default",J);class se{constructor(e){t(this,"parsers",{}),t(this,"output",{}),t(this,"errors",[]),t(this,"pushToErrors",(e=>this.errors.push(e))),this.options=Q.useCached(e)}async read(e){this.file=await function(e,t){return"string"==typeof e?v(e,t):i&&!n&&e instanceof HTMLImageElement?v(e.src,t):e instanceof Uint8Array||e instanceof ArrayBuffer||e instanceof DataView?new p(e):i&&e instanceof Blob?S(e,t,"blob",x):void o(O)}(e,this.options)}setup(){if(this.fileParser)return;let{file:e}=this,t=e.getUint16(0);for(let[s,i]of y)if(i.canHandle(e,t))return this.fileParser=new i(this.options,this.file,this.parsers),e[s]=!0;this.file.close&&this.file.close(),o("Unknown file format")}async parse(){let{output:e,errors:t}=this;return this.setup(),this.options.silentErrors?(await this.executeParsers().catch(this.pushToErrors),t.push(...this.fileParser.errors)):await this.executeParsers(),this.file.close&&this.file.close(),this.options.silentErrors&&t.length>0&&(e.errors=t),l(s=e)?void 0:s;var s}async executeParsers(){let{output:e}=this;await this.fileParser.parse();let t=Object.values(this.parsers).map((async t=>{let s=await t.parse();t.assignToOutput(e,s)}));this.options.silentErrors&&(t=t.map((e=>e.catch(this.pushToErrors)))),await Promise.all(t)}async extractThumbnail(){this.setup();let{options:e,file:t}=this,s=b.get("tiff",e);var i;if(t.tiff?i={start:0,type:"tiff"}:t.jpeg&&(i=await this.fileParser.getOrFindSegment("tiff")),void 0===i)return;let n=await this.fileParser.ensureSegmentChunk(i),r=this.parsers.tiff=new s(n,e,t),a=await r.extractThumbnail();return t.close&&t.close(),a}}async function ie(e,t){let s=new se(t);return await s.read(e),s.parse()}var ne=Object.freeze({__proto__:null,parse:ie,Exifr:se,fileParsers:y,segmentParsers:b,fileReaders:w,tagKeys:I,tagValues:L,tagRevivers:T,createDictionary:B,extendDictionary:V,fetchUrlAsArrayBuffer:U,readBlobAsArrayBuffer:x,chunkedProps:M,otherSegments:N,segments:R,tiffBlocks:$,segmentsAndBlocks:K,tiffExtractables:W,inheritables:X,allFormatters:H,Options:Q});class re{static findPosition(e,t){let s=e.getUint16(t+2)+2,i="function"==typeof this.headerLength?this.headerLength(e,t,s):this.headerLength,n=t+i,r=s-i;return{offset:t,length:s,headerLength:i,start:n,size:r,end:n+r}}static parse(e,t={}){return new this(e,new Q({[this.type]:t}),e).parse()}normalizeInput(e){return e instanceof p?e:new p(e)}constructor(e,s={},i){t(this,"errors",[]),t(this,"raw",new Map),t(this,"handleError",(e=>{if(!this.options.silentErrors)throw e;this.errors.push(e.message)})),this.chunk=this.normalizeInput(e),this.file=i,this.type=this.constructor.type,this.globalOptions=this.options=s,this.localOptions=s[this.type],this.canTranslate=this.localOptions&&this.localOptions.translate}translate(){this.canTranslate&&(this.translated=this.translateBlock(this.raw,this.type))}get output(){return this.translated?this.translated:this.raw?Object.fromEntries(this.raw):void 0}translateBlock(e,t){let s=T.get(t),i=L.get(t),n=I.get(t),r=this.options[t],a=r.reviveValues&&!!s,h=r.translateValues&&!!i,f=r.translateKeys&&!!n,l={};for(let[t,r]of e)a&&s.has(t)?r=s.get(t)(r):h&&i.has(t)&&(r=this.translateValue(r,i.get(t))),f&&n.has(t)&&(t=n.get(t)||t),l[t]=r;return l}translateValue(e,t){return t[e]||t.DEFAULT||e}assignToOutput(e,t){this.assignObjectToOutput(e,this.constructor.type,t)}assignObjectToOutput(e,t,s){if(this.globalOptions.mergeOutput)return Object.assign(e,s);e[t]?Object.assign(e[t],s):e[t]=s}}t(re,"headerLength",4),t(re,"type",void 0),t(re,"multiSegment",!1),t(re,"canHandle",(()=>!1));function ae(e){return 192===e||194===e||196===e||219===e||221===e||218===e||254===e}function he(e){return e>=224&&e<=239}function fe(e,t,s){for(let[i,n]of b)if(n.canHandle(e,t,s))return i}class le extends class{constructor(e,s,i){t(this,"errors",[]),t(this,"ensureSegmentChunk",(async e=>{let t=e.start,s=e.size||65536;if(this.file.chunked)if(this.file.available(t,s))e.chunk=this.file.subarray(t,s);else try{e.chunk=await this.file.readChunk(t,s)}catch(t){o(`Couldn't read segment: ${JSON.stringify(e)}. ${t.message}`)}else this.file.byteLength>t+s?e.chunk=this.file.subarray(t,s):void 0===e.size?e.chunk=this.file.subarray(t):o("Segment unreachable: "+JSON.stringify(e));return e.chunk})),this.extendOptions&&this.extendOptions(e),this.options=e,this.file=s,this.parsers=i}injectSegment(e,t){this.options[e].enabled&&this.createParser(e,t)}createParser(e,t){let s=new(b.get(e))(t,this.options,this.file);return this.parsers[e]=s}createParsers(e){for(let t of e){let{type:e,chunk:s}=t,i=this.options[e];if(i&&i.enabled){let t=this.parsers[e];t&&t.append||t||this.createParser(e,s)}}}async readSegments(e){let t=e.map(this.ensureSegmentChunk);await Promise.all(t)}}{constructor(...e){super(...e),t(this,"appSegments",[]),t(this,"jpegSegments",[]),t(this,"unknownSegments",[])}static canHandle(e,t){return 65496===t}async parse(){await this.findAppSegments(),await this.readSegments(this.appSegments),this.mergeMultiSegments(),this.createParsers(this.mergedAppSegments||this.appSegments)}setupSegmentFinderArgs(e){!0===e?(this.findAll=!0,this.wanted=new Set(b.keyList())):(e=void 0===e?b.keyList().filter((e=>this.options[e].enabled)):e.filter((e=>this.options[e].enabled&&b.has(e))),this.findAll=!1,this.remaining=new Set(e),this.wanted=new Set(e)),this.unfinishedMultiSegment=!1}async findAppSegments(e=0,t){this.setupSegmentFinderArgs(t);let{file:s,findAll:i,wanted:n,remaining:r}=this;if(!i&&this.file.chunked&&(i=Array.from(n).some((e=>{let t=b.get(e),s=this.options[e];return t.multiSegment&&s.multiSegment})),i&&await this.file.readWhole()),e=this.findAppSegmentsInRange(e,s.byteLength),!this.options.onlyTiff&&s.chunked){let t=!1;for(;r.size>0&&!t&&(s.canReadNextChunk||this.unfinishedMultiSegment);){let{nextChunkOffset:i}=s,n=this.appSegments.some((e=>!this.file.available(e.offset||e.start,e.length||e.size)));if(t=e>i&&!n?!await s.readNextChunk(e):!await s.readNextChunk(i),void 0===(e=this.findAppSegmentsInRange(e,s.byteLength)))return}}}findAppSegmentsInRange(e,t){t-=2;let s,i,n,r,a,h,{file:f,findAll:l,wanted:o,remaining:u,options:d}=this;for(;e<t;e++)if(255===f.getUint8(e))if(s=f.getUint8(e+1),he(s)){if(i=f.getUint16(e+2),n=fe(f,e,i),n&&o.has(n)&&(r=b.get(n),a=r.findPosition(f,e),h=d[n],a.type=n,this.appSegments.push(a),!l&&(r.multiSegment&&h.multiSegment?(this.unfinishedMultiSegment=a.chunkNumber<a.chunkCount,this.unfinishedMultiSegment||u.delete(n)):u.delete(n),0===u.size)))break;d.recordUnknownSegments&&(a=re.findPosition(f,e),a.marker=s,this.unknownSegments.push(a)),e+=i+1}else if(ae(s)){if(i=f.getUint16(e+2),218===s&&!1!==d.stopAfterSos)return;d.recordJpegSegments&&this.jpegSegments.push({offset:e,length:i,marker:s}),e+=i+1}return e}mergeMultiSegments(){if(!this.appSegments.some((e=>e.multiSegment)))return;let e=function(e,t){let s,i,n,r=new Map;for(let a=0;a<e.length;a++)s=e[a],i=s[t],r.has(i)?n=r.get(i):r.set(i,n=[]),n.push(s);return Array.from(r)}(this.appSegments,"type");this.mergedAppSegments=e.map((([e,t])=>{let s=b.get(e,this.options);if(s.handleMultiSegments){return{type:e,chunk:s.handleMultiSegments(t)}}return t[0]}))}getSegment(e){return this.appSegments.find((t=>t.type===e))}async getOrFindSegment(e){let t=this.getSegment(e);return void 0===t&&(await this.findAppSegments(0,[e]),t=this.getSegment(e)),t}}t(le,"type","jpeg"),y.set("jpeg",le);const oe=[void 0,1,1,2,4,8,1,1,2,4,8,4,8,4];class ue extends re{parseHeader(){var e=this.chunk.getUint16();18761===e?this.le=!0:19789===e&&(this.le=!1),this.chunk.le=this.le,this.headerParsed=!0}parseTags(e,t,s=new Map){let{pick:i,skip:n}=this.options[t];i=new Set(i);let r=i.size>0,a=0===n.size,h=this.chunk.getUint16(e);e+=2;for(let f=0;f<h;f++){let h=this.chunk.getUint16(e);if(r){if(i.has(h)&&(s.set(h,this.parseTag(e,h,t)),i.delete(h),0===i.size))break}else!a&&n.has(h)||s.set(h,this.parseTag(e,h,t));e+=12}return s}parseTag(e,t,s){let{chunk:i}=this,n=i.getUint16(e+2),r=i.getUint32(e+4),a=oe[n];if(a*r<=4?e+=8:e=i.getUint32(e+8),(n<1||n>13)&&o(`Invalid TIFF value type. block: ${s.toUpperCase()}, tag: ${t.toString(16)}, type: ${n}, offset ${e}`),e>i.byteLength&&o(`Invalid TIFF value offset. block: ${s.toUpperCase()}, tag: ${t.toString(16)}, type: ${n}, offset ${e} is outside of chunk size ${i.byteLength}`),1===n)return i.getUint8Array(e,r);if(2===n)return""===(h=function(e){for(;e.endsWith("\0");)e=e.slice(0,-1);return e}(h=i.getString(e,r)).trim())?void 0:h;var h;if(7===n)return i.getUint8Array(e,r);if(1===r)return this.parseTagValue(n,e);{let t=new(function(e){switch(e){case 1:return Uint8Array;case 3:return Uint16Array;case 4:return Uint32Array;case 5:return Array;case 6:return Int8Array;case 8:return Int16Array;case 9:return Int32Array;case 10:return Array;case 11:return Float32Array;case 12:return Float64Array;default:return Array}}(n))(r),s=a;for(let i=0;i<r;i++)t[i]=this.parseTagValue(n,e),e+=s;return t}}parseTagValue(e,t){let{chunk:s}=this;switch(e){case 1:return s.getUint8(t);case 3:return s.getUint16(t);case 4:return s.getUint32(t);case 5:return s.getUint32(t)/s.getUint32(t+4);case 6:return s.getInt8(t);case 8:return s.getInt16(t);case 9:return s.getInt32(t);case 10:return s.getInt32(t)/s.getInt32(t+4);case 11:return s.getFloat(t);case 12:return s.getDouble(t);case 13:return s.getUint32(t);default:o(`Invalid tiff type ${e}`)}}}class de extends ue{static canHandle(e,t){return 225===e.getUint8(t+1)&&1165519206===e.getUint32(t+4)&&0===e.getUint16(t+8)}async parse(){this.parseHeader();let{options:e}=this;return e.ifd0.enabled&&await this.parseIfd0Block(),e.exif.enabled&&await this.safeParse("parseExifBlock"),e.gps.enabled&&await this.safeParse("parseGpsBlock"),e.interop.enabled&&await this.safeParse("parseInteropBlock"),e.ifd1.enabled&&await this.safeParse("parseThumbnailBlock"),this.createOutput()}safeParse(e){let t=this[e]();return void 0!==t.catch&&(t=t.catch(this.handleError)),t}findIfd0Offset(){void 0===this.ifd0Offset&&(this.ifd0Offset=this.chunk.getUint32(4))}findIfd1Offset(){if(void 0===this.ifd1Offset){this.findIfd0Offset();let e=this.chunk.getUint16(this.ifd0Offset),t=this.ifd0Offset+2+12*e;this.ifd1Offset=this.chunk.getUint32(t)}}parseBlock(e,t){let s=new Map;return this[t]=s,this.parseTags(e,t,s),s}async parseIfd0Block(){if(this.ifd0)return;let{file:e}=this;this.findIfd0Offset(),this.ifd0Offset<8&&o("Malformed EXIF data"),!e.chunked&&this.ifd0Offset>e.byteLength&&o(`IFD0 offset points to outside of file.\nthis.ifd0Offset: ${this.ifd0Offset}, file.byteLength: ${e.byteLength}`),e.tiff&&await e.ensureChunk(this.ifd0Offset,u(this.options));let t=this.parseBlock(this.ifd0Offset,"ifd0");return 0!==t.size?(this.exifOffset=t.get(E),this.interopOffset=t.get(D),this.gpsOffset=t.get(_),this.xmp=t.get(700),this.iptc=t.get(F),this.icc=t.get(j),this.options.sanitize&&(t.delete(E),t.delete(D),t.delete(_),t.delete(700),t.delete(F),t.delete(j)),t):void 0}async parseExifBlock(){if(this.exif)return;if(this.ifd0||await this.parseIfd0Block(),void 0===this.exifOffset)return;this.file.tiff&&await this.file.ensureChunk(this.exifOffset,u(this.options));let e=this.parseBlock(this.exifOffset,"exif");return this.interopOffset||(this.interopOffset=e.get(D)),this.makerNote=e.get(P),this.userComment=e.get(z),this.options.sanitize&&(e.delete(D),e.delete(P),e.delete(z)),this.unpack(e,41728),this.unpack(e,41729),e}unpack(e,t){let s=e.get(t);s&&1===s.length&&e.set(t,s[0])}async parseGpsBlock(){if(this.gps)return;if(this.ifd0||await this.parseIfd0Block(),void 0===this.gpsOffset)return;let e=this.parseBlock(this.gpsOffset,"gps");return e&&e.has(2)&&e.has(4)&&(e.set("latitude",ce(...e.get(2),e.get(1))),e.set("longitude",ce(...e.get(4),e.get(3)))),e}async parseInteropBlock(){if(!this.interop&&(this.ifd0||await this.parseIfd0Block(),void 0!==this.interopOffset||this.exif||await this.parseExifBlock(),void 0!==this.interopOffset))return this.parseBlock(this.interopOffset,"interop")}async parseThumbnailBlock(e=!1){if(!this.ifd1&&!this.ifd1Parsed&&(!this.options.mergeOutput||e))return this.findIfd1Offset(),this.ifd1Offset>0&&(this.parseBlock(this.ifd1Offset,"ifd1"),this.ifd1Parsed=!0),this.ifd1}async extractThumbnail(){if(this.headerParsed||this.parseHeader(),this.ifd1Parsed||await this.parseThumbnailBlock(!0),void 0===this.ifd1)return;let e=this.ifd1.get(513),t=this.ifd1.get(514);return this.chunk.getUint8Array(e,t)}get image(){return this.ifd0}get thumbnail(){return this.ifd1}createOutput(){let e,t,s,i={};for(t of $)if(e=this[t],!l(e))if(s=this.canTranslate?this.translateBlock(e,t):Object.fromEntries(e),this.options.mergeOutput){if("ifd1"===t)continue;Object.assign(i,s)}else i[t]=s;return this.makerNote&&(i.makerNote=this.makerNote),this.userComment&&(i.userComment=this.userComment),i}assignToOutput(e,t){if(this.globalOptions.mergeOutput)Object.assign(e,t);else for(let[s,i]of Object.entries(t))this.assignObjectToOutput(e,s,i)}}function ce(e,t,s,i){var n=e+t/60+s/3600;return"S"!==i&&"W"!==i||(n*=-1),n}t(de,"type","tiff"),t(de,"headerLength",10),b.set("tiff",de);var pe=Object.freeze({__proto__:null,default:ne,Exifr:se,fileParsers:y,segmentParsers:b,fileReaders:w,tagKeys:I,tagValues:L,tagRevivers:T,createDictionary:B,extendDictionary:V,fetchUrlAsArrayBuffer:U,readBlobAsArrayBuffer:x,chunkedProps:M,otherSegments:N,segments:R,tiffBlocks:$,segmentsAndBlocks:K,tiffExtractables:W,inheritables:X,allFormatters:H,Options:Q,parse:ie});const ge={ifd0:!1,ifd1:!1,exif:!1,gps:!1,interop:!1,sanitize:!1,reviveValues:!0,translateKeys:!1,translateValues:!1,mergeOutput:!1},me=Object.assign({},ge,{firstChunkSize:4e4,gps:[1,2,3,4]});const ye=Object.assign({},ge,{tiff:!1,ifd1:!0,mergeOutput:!1});const be=Object.assign({},ge,{firstChunkSize:4e4,ifd0:[274]});async function we(e){let t=new se(be);await t.read(e);let s=await t.parse();if(s&&s.ifd0)return s.ifd0[274]}const ke=Object.freeze({1:{dimensionSwapped:!1,scaleX:1,scaleY:1,deg:0,rad:0},2:{dimensionSwapped:!1,scaleX:-1,scaleY:1,deg:0,rad:0},3:{dimensionSwapped:!1,scaleX:1,scaleY:1,deg:180,rad:180*Math.PI/180},4:{dimensionSwapped:!1,scaleX:-1,scaleY:1,deg:180,rad:180*Math.PI/180},5:{dimensionSwapped:!0,scaleX:1,scaleY:-1,deg:90,rad:90*Math.PI/180},6:{dimensionSwapped:!0,scaleX:1,scaleY:1,deg:90,rad:90*Math.PI/180},7:{dimensionSwapped:!0,scaleX:1,scaleY:-1,deg:270,rad:270*Math.PI/180},8:{dimensionSwapped:!0,scaleX:1,scaleY:1,deg:270,rad:270*Math.PI/180}});if(e.rotateCanvas=!0,e.rotateCss=!0,"object"==typeof navigator){let t=navigator.userAgent;if(t.includes("iPad")||t.includes("iPhone")){let s=t.match(/OS (\d+)_(\d+)/);if(s){let[,t,i]=s,n=Number(t)+.1*Number(i);e.rotateCanvas=n<13.4,e.rotateCss=!1}}else if(t.includes("OS X 10")){let[,s]=t.match(/OS X 10[_.](\d+)/);e.rotateCanvas=e.rotateCss=Number(s)<15}if(t.includes("Chrome/")){let[,s]=t.match(/Chrome\/(\d+)/);e.rotateCanvas=e.rotateCss=Number(s)<81}else if(t.includes("Firefox/")){let[,s]=t.match(/Firefox\/(\d+)/);e.rotateCanvas=e.rotateCss=Number(s)<77}}class Oe extends p{constructor(...e){super(...e),t(this,"ranges",new ve),0!==this.byteLength&&this.ranges.add(0,this.byteLength)}_tryExtend(e,t,s){if(0===e&&0===this.byteLength&&s){let e=new DataView(s.buffer||s,s.byteOffset,s.byteLength);this._swapDataView(e)}else{let s=e+t;if(s>this.byteLength){let{dataView:e}=this._extend(s);this._swapDataView(e)}}}_extend(e){let t;t=h?a.allocUnsafe(e):new Uint8Array(e);let s=new DataView(t.buffer,t.byteOffset,t.byteLength);return t.set(new Uint8Array(this.buffer,this.byteOffset,this.byteLength),0),{uintView:t,dataView:s}}subarray(e,t,s=!1){return t=t||this._lengthToEnd(e),s&&this._tryExtend(e,t),this.ranges.add(e,t),super.subarray(e,t)}set(e,t,s=!1){s&&this._tryExtend(t,e.byteLength,e);let i=super.set(e,t);return this.ranges.add(t,i.byteLength),i}async ensureChunk(e,t){this.chunked&&(this.ranges.available(e,t)||await this.readChunk(e,t))}available(e,t){return this.ranges.available(e,t)}}class ve{constructor(){t(this,"list",[])}get length(){return this.list.length}add(e,t,s=0){let i=e+t,n=this.list.filter((t=>Se(e,t.offset,i)||Se(e,t.end,i)));if(n.length>0){e=Math.min(e,...n.map((e=>e.offset))),i=Math.max(i,...n.map((e=>e.end))),t=i-e;let s=n.shift();s.offset=e,s.length=t,s.end=i,this.list=this.list.filter((e=>!n.includes(e)))}else this.list.push({offset:e,length:t,end:i})}available(e,t){let s=e+t;return this.list.some((t=>t.offset<=e&&s<=t.end))}}function Se(e,t,s){return e<=t&&t<=s}class Ae extends Oe{constructor(e,s){super(0),t(this,"chunksRead",0),this.input=e,this.options=s}async readWhole(){this.chunked=!1,await this.readChunk(this.nextChunkOffset)}async readChunked(){this.chunked=!0,await this.readChunk(0,this.options.firstChunkSize)}async readNextChunk(e=this.nextChunkOffset){if(this.fullyRead)return this.chunksRead++,!1;let t=this.options.chunkSize,s=await this.readChunk(e,t);return!!s&&s.byteLength===t}async readChunk(e,t){if(this.chunksRead++,0!==(t=this.safeWrapAddress(e,t)))return this._readChunk(e,t)}safeWrapAddress(e,t){return void 0!==this.size&&e+t>this.size?Math.max(0,this.size-e):t}get nextChunkOffset(){if(0!==this.ranges.list.length)return this.ranges.list[0].length}get canReadNextChunk(){return this.chunksRead<this.options.chunkLimit}get fullyRead(){return void 0!==this.size&&this.nextChunkOffset===this.size}read(){return this.options.chunked?this.readChunked():this.readWhole()}close(){}}w.set("blob",class extends Ae{async readWhole(){this.chunked=!1;let e=await x(this.input);this._swapArrayBuffer(e)}readChunked(){return this.chunked=!0,this.size=this.input.size,super.readChunked()}async _readChunk(e,t){let s=t?e+t:void 0,i=this.input.slice(e,s),n=await x(i);return this.set(n,e,!0)}}),e.Exifr=se,e.Options=Q,e.allFormatters=H,e.chunkedProps=M,e.createDictionary=B,e.default=pe,e.extendDictionary=V,e.fetchUrlAsArrayBuffer=U,e.fileParsers=y,e.fileReaders=w,e.gps=async function(e){let t=new se(me);await t.read(e);let s=await t.parse();if(s&&s.gps){let{latitude:e,longitude:t}=s.gps;return{latitude:e,longitude:t}}},e.gpsOnlyOptions=me,e.inheritables=X,e.orientation=we,e.orientationOnlyOptions=be,e.otherSegments=N,e.parse=ie,e.readBlobAsArrayBuffer=x,e.rotation=async function(t){let s=await we(t);return Object.assign({canvas:e.rotateCanvas,css:e.rotateCss},ke[s])},e.rotations=ke,e.segmentParsers=b,e.segments=R,e.segmentsAndBlocks=K,e.tagKeys=I,e.tagRevivers=T,e.tagValues=L,e.thumbnail=async function(e){let t=new se(ye);await t.read(e);let s=await t.extractThumbnail();return s&&h?a.from(s):s},e.thumbnailOnlyOptions=ye,e.thumbnailUrl=async function(e){let t=await this.thumbnail(e);if(void 0!==t){let e=new Blob([t]);return URL.createObjectURL(e)}},e.tiffBlocks=$,e.tiffExtractables=W,Object.defineProperty(e,"__esModule",{value:!0})}));


/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./node_modules/is-shallow-equal/index.js":
/*!************************************************!*\
  !*** ./node_modules/is-shallow-equal/index.js ***!
  \************************************************/
/***/ ((module) => {

module.exports = function isShallowEqual (a, b) {
  if (a === b) return true
  for (var i in a) if (!(i in b)) return false
  for (var i in b) if (a[i] !== b[i]) return false
  return true
}


/***/ }),

/***/ "./node_modules/isarray/index.js":
/*!***************************************!*\
  !*** ./node_modules/isarray/index.js ***!
  \***************************************/
/***/ ((module) => {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ "./node_modules/lodash.debounce/index.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash.debounce/index.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = debounce;


/***/ }),

/***/ "./node_modules/lodash.throttle/index.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash.throttle/index.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = throttle;


/***/ }),

/***/ "./node_modules/memoize-one/dist/memoize-one.esm.js":
/*!**********************************************************!*\
  !*** ./node_modules/memoize-one/dist/memoize-one.esm.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var safeIsNaN = Number.isNaN ||
    function ponyfill(value) {
        return typeof value === 'number' && value !== value;
    };
function isEqual(first, second) {
    if (first === second) {
        return true;
    }
    if (safeIsNaN(first) && safeIsNaN(second)) {
        return true;
    }
    return false;
}
function areInputsEqual(newInputs, lastInputs) {
    if (newInputs.length !== lastInputs.length) {
        return false;
    }
    for (var i = 0; i < newInputs.length; i++) {
        if (!isEqual(newInputs[i], lastInputs[i])) {
            return false;
        }
    }
    return true;
}

function memoizeOne(resultFn, isEqual) {
    if (isEqual === void 0) { isEqual = areInputsEqual; }
    var lastThis;
    var lastArgs = [];
    var lastResult;
    var calledOnce = false;
    function memoized() {
        var newArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            newArgs[_i] = arguments[_i];
        }
        if (calledOnce && lastThis === this && isEqual(newArgs, lastArgs)) {
            return lastResult;
        }
        lastResult = resultFn.apply(this, newArgs);
        calledOnce = true;
        lastThis = this;
        lastArgs = newArgs;
        return lastResult;
    }
    return memoized;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (memoizeOne);


/***/ }),

/***/ "./node_modules/mime-match/index.js":
/*!******************************************!*\
  !*** ./node_modules/mime-match/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var wildcard = __webpack_require__(/*! wildcard */ "./node_modules/wildcard/index.js");
var reMimePartSplit = /[\/\+\.]/;

/**
  # mime-match

  A simple function to checker whether a target mime type matches a mime-type
  pattern (e.g. image/jpeg matches image/jpeg OR image/*).

  ## Example Usage

  <<< example.js

**/
module.exports = function(target, pattern) {
  function test(pattern) {
    var result = wildcard(pattern, target, reMimePartSplit);

    // ensure that we have a valid mime type (should have two parts)
    return result && result.length >= 2;
  }

  return pattern ? test(pattern.split(';')[0]) : test;
};


/***/ }),

/***/ "./node_modules/namespace-emitter/index.js":
/*!*************************************************!*\
  !*** ./node_modules/namespace-emitter/index.js ***!
  \*************************************************/
/***/ ((module) => {

/**
* Create an event emitter with namespaces
* @name createNamespaceEmitter
* @example
* var emitter = require('./index')()
*
* emitter.on('*', function () {
*   console.log('all events emitted', this.event)
* })
*
* emitter.on('example', function () {
*   console.log('example event emitted')
* })
*/
module.exports = function createNamespaceEmitter () {
  var emitter = {}
  var _fns = emitter._fns = {}

  /**
  * Emit an event. Optionally namespace the event. Handlers are fired in the order in which they were added with exact matches taking precedence. Separate the namespace and event with a `:`
  * @name emit
  * @param {String} event – the name of the event, with optional namespace
  * @param {...*} data – up to 6 arguments that are passed to the event listener
  * @example
  * emitter.emit('example')
  * emitter.emit('demo:test')
  * emitter.emit('data', { example: true}, 'a string', 1)
  */
  emitter.emit = function emit (event, arg1, arg2, arg3, arg4, arg5, arg6) {
    var toEmit = getListeners(event)

    if (toEmit.length) {
      emitAll(event, toEmit, [arg1, arg2, arg3, arg4, arg5, arg6])
    }
  }

  /**
  * Create en event listener.
  * @name on
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.on('example', function () {})
  * emitter.on('demo', function () {})
  */
  emitter.on = function on (event, fn) {
    if (!_fns[event]) {
      _fns[event] = []
    }

    _fns[event].push(fn)
  }

  /**
  * Create en event listener that fires once.
  * @name once
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.once('example', function () {})
  * emitter.once('demo', function () {})
  */
  emitter.once = function once (event, fn) {
    function one () {
      fn.apply(this, arguments)
      emitter.off(event, one)
    }
    this.on(event, one)
  }

  /**
  * Stop listening to an event. Stop all listeners on an event by only passing the event name. Stop a single listener by passing that event handler as a callback.
  * You must be explicit about what will be unsubscribed: `emitter.off('demo')` will unsubscribe an `emitter.on('demo')` listener,
  * `emitter.off('demo:example')` will unsubscribe an `emitter.on('demo:example')` listener
  * @name off
  * @param {String} event
  * @param {Function} [fn] – the specific handler
  * @example
  * emitter.off('example')
  * emitter.off('demo', function () {})
  */
  emitter.off = function off (event, fn) {
    var keep = []

    if (event && fn) {
      var fns = this._fns[event]
      var i = 0
      var l = fns ? fns.length : 0

      for (i; i < l; i++) {
        if (fns[i] !== fn) {
          keep.push(fns[i])
        }
      }
    }

    keep.length ? this._fns[event] = keep : delete this._fns[event]
  }

  function getListeners (e) {
    var out = _fns[e] ? _fns[e] : []
    var idx = e.indexOf(':')
    var args = (idx === -1) ? [e] : [e.substring(0, idx), e.substring(idx + 1)]

    var keys = Object.keys(_fns)
    var i = 0
    var l = keys.length

    for (i; i < l; i++) {
      var key = keys[i]
      if (key === '*') {
        out = out.concat(_fns[key])
      }

      if (args.length === 2 && args[0] === key) {
        out = out.concat(_fns[key])
        break
      }
    }

    return out
  }

  function emitAll (e, fns, args) {
    var i = 0
    var l = fns.length

    for (i; i < l; i++) {
      if (!fns[i]) break
      fns[i].event = e
      fns[i].apply(fns[i], args)
    }
  }

  return emitter
}


/***/ }),

/***/ "./node_modules/preact/dist/preact.module.js":
/*!***************************************************!*\
  !*** ./node_modules/preact/dist/preact.module.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Component": () => (/* binding */ _),
/* harmony export */   "Fragment": () => (/* binding */ d),
/* harmony export */   "cloneElement": () => (/* binding */ B),
/* harmony export */   "createContext": () => (/* binding */ D),
/* harmony export */   "createElement": () => (/* binding */ v),
/* harmony export */   "createRef": () => (/* binding */ p),
/* harmony export */   "h": () => (/* binding */ v),
/* harmony export */   "hydrate": () => (/* binding */ q),
/* harmony export */   "isValidElement": () => (/* binding */ i),
/* harmony export */   "options": () => (/* binding */ l),
/* harmony export */   "render": () => (/* binding */ S),
/* harmony export */   "toChildArray": () => (/* binding */ A)
/* harmony export */ });
var n,l,u,i,t,o,r,f,e={},c=[],s=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function a(n,l){for(var u in l)n[u]=l[u];return n}function h(n){var l=n.parentNode;l&&l.removeChild(n)}function v(l,u,i){var t,o,r,f={};for(r in u)"key"==r?t=u[r]:"ref"==r?o=u[r]:f[r]=u[r];if(arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):i),"function"==typeof l&&null!=l.defaultProps)for(r in l.defaultProps)void 0===f[r]&&(f[r]=l.defaultProps[r]);return y(l,f,t,o,null)}function y(n,i,t,o,r){var f={type:n,props:i,key:t,ref:o,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==r?++u:r};return null==r&&null!=l.vnode&&l.vnode(f),f}function p(){return{current:null}}function d(n){return n.children}function _(n,l){this.props=n,this.context=l}function k(n,l){if(null==l)return n.__?k(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return"function"==typeof n.type?k(n):null}function b(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return b(n)}}function m(n){(!n.__d&&(n.__d=!0)&&t.push(n)&&!g.__r++||r!==l.debounceRendering)&&((r=l.debounceRendering)||o)(g)}function g(){for(var n;g.__r=t.length;)n=t.sort(function(n,l){return n.__v.__b-l.__v.__b}),t=[],n.some(function(n){var l,u,i,t,o,r;n.__d&&(o=(t=(l=n).__v).__e,(r=l.__P)&&(u=[],(i=a({},t)).__v=t.__v+1,j(r,t,i,l.__n,void 0!==r.ownerSVGElement,null!=t.__h?[o]:null,u,null==o?k(t):o,t.__h),z(u,t),t.__e!=o&&b(t)))})}function w(n,l,u,i,t,o,r,f,s,a){var h,v,p,_,b,m,g,w=i&&i.__k||c,A=w.length;for(u.__k=[],h=0;h<l.length;h++)if(null!=(_=u.__k[h]=null==(_=l[h])||"boolean"==typeof _?null:"string"==typeof _||"number"==typeof _||"bigint"==typeof _?y(null,_,null,null,_):Array.isArray(_)?y(d,{children:_},null,null,null):_.__b>0?y(_.type,_.props,_.key,null,_.__v):_)){if(_.__=u,_.__b=u.__b+1,null===(p=w[h])||p&&_.key==p.key&&_.type===p.type)w[h]=void 0;else for(v=0;v<A;v++){if((p=w[v])&&_.key==p.key&&_.type===p.type){w[v]=void 0;break}p=null}j(n,_,p=p||e,t,o,r,f,s,a),b=_.__e,(v=_.ref)&&p.ref!=v&&(g||(g=[]),p.ref&&g.push(p.ref,null,_),g.push(v,_.__c||b,_)),null!=b?(null==m&&(m=b),"function"==typeof _.type&&_.__k===p.__k?_.__d=s=x(_,s,n):s=P(n,_,p,w,b,s),"function"==typeof u.type&&(u.__d=s)):s&&p.__e==s&&s.parentNode!=n&&(s=k(p))}for(u.__e=m,h=A;h--;)null!=w[h]&&("function"==typeof u.type&&null!=w[h].__e&&w[h].__e==u.__d&&(u.__d=k(i,h+1)),N(w[h],w[h]));if(g)for(h=0;h<g.length;h++)M(g[h],g[++h],g[++h])}function x(n,l,u){for(var i,t=n.__k,o=0;t&&o<t.length;o++)(i=t[o])&&(i.__=n,l="function"==typeof i.type?x(i,l,u):P(u,i,i,t,i.__e,l));return l}function A(n,l){return l=l||[],null==n||"boolean"==typeof n||(Array.isArray(n)?n.some(function(n){A(n,l)}):l.push(n)),l}function P(n,l,u,i,t,o){var r,f,e;if(void 0!==l.__d)r=l.__d,l.__d=void 0;else if(null==u||t!=o||null==t.parentNode)n:if(null==o||o.parentNode!==n)n.appendChild(t),r=null;else{for(f=o,e=0;(f=f.nextSibling)&&e<i.length;e+=2)if(f==t)break n;n.insertBefore(t,o),r=o}return void 0!==r?r:t.nextSibling}function C(n,l,u,i,t){var o;for(o in u)"children"===o||"key"===o||o in l||H(n,o,null,u[o],i);for(o in l)t&&"function"!=typeof l[o]||"children"===o||"key"===o||"value"===o||"checked"===o||u[o]===l[o]||H(n,o,l[o],u[o],i)}function $(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]=null==u?"":"number"!=typeof u||s.test(l)?u:u+"px"}function H(n,l,u,i,t){var o;n:if("style"===l)if("string"==typeof u)n.style.cssText=u;else{if("string"==typeof i&&(n.style.cssText=i=""),i)for(l in i)u&&l in u||$(n.style,l,"");if(u)for(l in u)i&&u[l]===i[l]||$(n.style,l,u[l])}else if("o"===l[0]&&"n"===l[1])o=l!==(l=l.replace(/Capture$/,"")),l=l.toLowerCase()in n?l.toLowerCase().slice(2):l.slice(2),n.l||(n.l={}),n.l[l+o]=u,u?i||n.addEventListener(l,o?T:I,o):n.removeEventListener(l,o?T:I,o);else if("dangerouslySetInnerHTML"!==l){if(t)l=l.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if("href"!==l&&"list"!==l&&"form"!==l&&"tabIndex"!==l&&"download"!==l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null!=u&&(!1!==u||"a"===l[0]&&"r"===l[1])?n.setAttribute(l,u):n.removeAttribute(l))}}function I(n){this.l[n.type+!1](l.event?l.event(n):n)}function T(n){this.l[n.type+!0](l.event?l.event(n):n)}function j(n,u,i,t,o,r,f,e,c){var s,h,v,y,p,k,b,m,g,x,A,P=u.type;if(void 0!==u.constructor)return null;null!=i.__h&&(c=i.__h,e=u.__e=i.__e,u.__h=null,r=[e]),(s=l.__b)&&s(u);try{n:if("function"==typeof P){if(m=u.props,g=(s=P.contextType)&&t[s.__c],x=s?g?g.props.value:s.__:t,i.__c?b=(h=u.__c=i.__c).__=h.__E:("prototype"in P&&P.prototype.render?u.__c=h=new P(m,x):(u.__c=h=new _(m,x),h.constructor=P,h.render=O),g&&g.sub(h),h.props=m,h.state||(h.state={}),h.context=x,h.__n=t,v=h.__d=!0,h.__h=[]),null==h.__s&&(h.__s=h.state),null!=P.getDerivedStateFromProps&&(h.__s==h.state&&(h.__s=a({},h.__s)),a(h.__s,P.getDerivedStateFromProps(m,h.__s))),y=h.props,p=h.state,v)null==P.getDerivedStateFromProps&&null!=h.componentWillMount&&h.componentWillMount(),null!=h.componentDidMount&&h.__h.push(h.componentDidMount);else{if(null==P.getDerivedStateFromProps&&m!==y&&null!=h.componentWillReceiveProps&&h.componentWillReceiveProps(m,x),!h.__e&&null!=h.shouldComponentUpdate&&!1===h.shouldComponentUpdate(m,h.__s,x)||u.__v===i.__v){h.props=m,h.state=h.__s,u.__v!==i.__v&&(h.__d=!1),h.__v=u,u.__e=i.__e,u.__k=i.__k,u.__k.forEach(function(n){n&&(n.__=u)}),h.__h.length&&f.push(h);break n}null!=h.componentWillUpdate&&h.componentWillUpdate(m,h.__s,x),null!=h.componentDidUpdate&&h.__h.push(function(){h.componentDidUpdate(y,p,k)})}h.context=x,h.props=m,h.state=h.__s,(s=l.__r)&&s(u),h.__d=!1,h.__v=u,h.__P=n,s=h.render(h.props,h.state,h.context),h.state=h.__s,null!=h.getChildContext&&(t=a(a({},t),h.getChildContext())),v||null==h.getSnapshotBeforeUpdate||(k=h.getSnapshotBeforeUpdate(y,p)),A=null!=s&&s.type===d&&null==s.key?s.props.children:s,w(n,Array.isArray(A)?A:[A],u,i,t,o,r,f,e,c),h.base=u.__e,u.__h=null,h.__h.length&&f.push(h),b&&(h.__E=h.__=null),h.__e=!1}else null==r&&u.__v===i.__v?(u.__k=i.__k,u.__e=i.__e):u.__e=L(i.__e,u,i,t,o,r,f,c);(s=l.diffed)&&s(u)}catch(n){u.__v=null,(c||null!=r)&&(u.__e=e,u.__h=!!c,r[r.indexOf(e)]=null),l.__e(n,u,i)}}function z(n,u){l.__c&&l.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u)})}catch(n){l.__e(n,u.__v)}})}function L(l,u,i,t,o,r,f,c){var s,a,v,y=i.props,p=u.props,d=u.type,_=0;if("svg"===d&&(o=!0),null!=r)for(;_<r.length;_++)if((s=r[_])&&"setAttribute"in s==!!d&&(d?s.localName===d:3===s.nodeType)){l=s,r[_]=null;break}if(null==l){if(null===d)return document.createTextNode(p);l=o?document.createElementNS("http://www.w3.org/2000/svg",d):document.createElement(d,p.is&&p),r=null,c=!1}if(null===d)y===p||c&&l.data===p||(l.data=p);else{if(r=r&&n.call(l.childNodes),a=(y=i.props||e).dangerouslySetInnerHTML,v=p.dangerouslySetInnerHTML,!c){if(null!=r)for(y={},_=0;_<l.attributes.length;_++)y[l.attributes[_].name]=l.attributes[_].value;(v||a)&&(v&&(a&&v.__html==a.__html||v.__html===l.innerHTML)||(l.innerHTML=v&&v.__html||""))}if(C(l,p,y,o,c),v)u.__k=[];else if(_=u.props.children,w(l,Array.isArray(_)?_:[_],u,i,t,o&&"foreignObject"!==d,r,f,r?r[0]:i.__k&&k(i,0),c),null!=r)for(_=r.length;_--;)null!=r[_]&&h(r[_]);c||("value"in p&&void 0!==(_=p.value)&&(_!==l.value||"progress"===d&&!_||"option"===d&&_!==y.value)&&H(l,"value",_,y.value,!1),"checked"in p&&void 0!==(_=p.checked)&&_!==l.checked&&H(l,"checked",_,y.checked,!1))}return l}function M(n,u,i){try{"function"==typeof n?n(u):n.current=u}catch(n){l.__e(n,i)}}function N(n,u,i){var t,o;if(l.unmount&&l.unmount(n),(t=n.ref)&&(t.current&&t.current!==n.__e||M(t,null,u)),null!=(t=n.__c)){if(t.componentWillUnmount)try{t.componentWillUnmount()}catch(n){l.__e(n,u)}t.base=t.__P=null}if(t=n.__k)for(o=0;o<t.length;o++)t[o]&&N(t[o],u,"function"!=typeof n.type);i||null==n.__e||h(n.__e),n.__e=n.__d=void 0}function O(n,l,u){return this.constructor(n,u)}function S(u,i,t){var o,r,f;l.__&&l.__(u,i),r=(o="function"==typeof t)?null:t&&t.__k||i.__k,f=[],j(i,u=(!o&&t||i).__k=v(d,null,[u]),r||e,e,void 0!==i.ownerSVGElement,!o&&t?[t]:r?null:i.firstChild?n.call(i.childNodes):null,f,!o&&t?t:r?r.__e:i.firstChild,o),z(f,u)}function q(n,l){S(n,l,q)}function B(l,u,i){var t,o,r,f=a({},l.props);for(r in u)"key"==r?t=u[r]:"ref"==r?o=u[r]:f[r]=u[r];return arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):i),y(l.type,f,t||l.key,o||l.ref,null)}function D(n,l){var u={__c:l="__cC"+f++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var u,i;return this.getChildContext||(u=[],(i={})[l]=this,this.getChildContext=function(){return i},this.shouldComponentUpdate=function(n){this.props.value!==n.value&&u.some(m)},this.sub=function(n){u.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){u.splice(u.indexOf(n),1),l&&l.call(n)}}),n.children}};return u.Provider.__=u.Consumer.contextType=u}n=c.slice,l={__e:function(n,l,u,i){for(var t,o,r;l=l.__;)if((t=l.__c)&&!t.__)try{if((o=t.constructor)&&null!=o.getDerivedStateFromError&&(t.setState(o.getDerivedStateFromError(n)),r=t.__d),null!=t.componentDidCatch&&(t.componentDidCatch(n,i||{}),r=t.__d),r)return t.__E=t}catch(l){n=l}throw n}},u=0,i=function(n){return null!=n&&void 0===n.constructor},_.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=a({},this.state),"function"==typeof n&&(n=n(a({},u),this.props)),n&&a(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),m(this))},_.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),m(this))},_.prototype.render=d,t=[],o="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,g.__r=0,f=0;
//# sourceMappingURL=preact.module.js.map


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/***/ ((module) => {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[2]!./node_modules/@uppy/core/dist/style.css?vue&type=style&index=1&lang=css&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[2]!./node_modules/@uppy/core/dist/style.css?vue&type=style&index=1&lang=css& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_cjs_js_clonedRuleSet_9_0_rules_0_use_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_dist_cjs_js_clonedRuleSet_9_0_rules_0_use_2_style_css_vue_type_style_index_1_lang_css___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../css-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[1]!../../../vue-loader/lib/loaders/stylePostLoader.js!../../../postcss-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[2]!./style.css?vue&type=style&index=1&lang=css& */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[2]!./node_modules/@uppy/core/dist/style.css?vue&type=style&index=1&lang=css&");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_css_loader_dist_cjs_js_clonedRuleSet_9_0_rules_0_use_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_dist_cjs_js_clonedRuleSet_9_0_rules_0_use_2_style_css_vue_type_style_index_1_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_css_loader_dist_cjs_js_clonedRuleSet_9_0_rules_0_use_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_dist_cjs_js_clonedRuleSet_9_0_rules_0_use_2_style_css_vue_type_style_index_1_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[2]!./node_modules/@uppy/dashboard/dist/style.css?vue&type=style&index=0&lang=css&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[2]!./node_modules/@uppy/dashboard/dist/style.css?vue&type=style&index=0&lang=css& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_cjs_js_clonedRuleSet_9_0_rules_0_use_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_dist_cjs_js_clonedRuleSet_9_0_rules_0_use_2_style_css_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../css-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[1]!../../../vue-loader/lib/loaders/stylePostLoader.js!../../../postcss-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[2]!./style.css?vue&type=style&index=0&lang=css& */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[2]!./node_modules/@uppy/dashboard/dist/style.css?vue&type=style&index=0&lang=css&");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_css_loader_dist_cjs_js_clonedRuleSet_9_0_rules_0_use_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_dist_cjs_js_clonedRuleSet_9_0_rules_0_use_2_style_css_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_css_loader_dist_cjs_js_clonedRuleSet_9_0_rules_0_use_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_dist_cjs_js_clonedRuleSet_9_0_rules_0_use_2_style_css_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./resources/js/components/uppy.vue":
/*!******************************************!*\
  !*** ./resources/js/components/uppy.vue ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _uppy_vue_vue_type_template_id_045862af___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./uppy.vue?vue&type=template&id=045862af& */ "./resources/js/components/uppy.vue?vue&type=template&id=045862af&");
/* harmony import */ var _uppy_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./uppy.vue?vue&type=script&lang=js& */ "./resources/js/components/uppy.vue?vue&type=script&lang=js&");
/* harmony import */ var _node_modules_uppy_dashboard_dist_style_css_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/@uppy/dashboard/dist/style.css?vue&type=style&index=0&lang=css& */ "./node_modules/@uppy/dashboard/dist/style.css?vue&type=style&index=0&lang=css&");
/* harmony import */ var _node_modules_uppy_core_dist_style_css_vue_type_style_index_1_lang_css___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/@uppy/core/dist/style.css?vue&type=style&index=1&lang=css& */ "./node_modules/@uppy/core/dist/style.css?vue&type=style&index=1&lang=css&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;



/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__["default"])(
  _uppy_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _uppy_vue_vue_type_template_id_045862af___WEBPACK_IMPORTED_MODULE_0__.render,
  _uppy_vue_vue_type_template_id_045862af___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/uppy.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/components/uppy.vue?vue&type=script&lang=js&":
/*!*******************************************************************!*\
  !*** ./resources/js/components/uppy.vue?vue&type=script&lang=js& ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_uppy_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./uppy.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/uppy.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_uppy_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./node_modules/@uppy/core/dist/style.css?vue&type=style&index=1&lang=css&":
/*!*********************************************************************************!*\
  !*** ./node_modules/@uppy/core/dist/style.css?vue&type=style&index=1&lang=css& ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_loader_dist_cjs_js_css_loader_dist_cjs_js_clonedRuleSet_9_0_rules_0_use_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_dist_cjs_js_clonedRuleSet_9_0_rules_0_use_2_style_css_vue_type_style_index_1_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../style-loader/dist/cjs.js!../../../css-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[1]!../../../vue-loader/lib/loaders/stylePostLoader.js!../../../postcss-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[2]!./style.css?vue&type=style&index=1&lang=css& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[2]!./node_modules/@uppy/core/dist/style.css?vue&type=style&index=1&lang=css&");


/***/ }),

/***/ "./node_modules/@uppy/dashboard/dist/style.css?vue&type=style&index=0&lang=css&":
/*!**************************************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/dist/style.css?vue&type=style&index=0&lang=css& ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_loader_dist_cjs_js_css_loader_dist_cjs_js_clonedRuleSet_9_0_rules_0_use_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_dist_cjs_js_clonedRuleSet_9_0_rules_0_use_2_style_css_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../style-loader/dist/cjs.js!../../../css-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[1]!../../../vue-loader/lib/loaders/stylePostLoader.js!../../../postcss-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[2]!./style.css?vue&type=style&index=0&lang=css& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[2]!./node_modules/@uppy/dashboard/dist/style.css?vue&type=style&index=0&lang=css&");


/***/ }),

/***/ "./resources/js/components/uppy.vue?vue&type=template&id=045862af&":
/*!*************************************************************************!*\
  !*** ./resources/js/components/uppy.vue?vue&type=template&id=045862af& ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_uppy_vue_vue_type_template_id_045862af___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_uppy_vue_vue_type_template_id_045862af___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_uppy_vue_vue_type_template_id_045862af___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./uppy.vue?vue&type=template&id=045862af& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/uppy.vue?vue&type=template&id=045862af&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/uppy.vue?vue&type=template&id=045862af&":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/uppy.vue?vue&type=template&id=045862af& ***!
  \****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    !_vm.inline
      ? _c(
          "button",
          {
            staticClass: "btn btn-primary mx-auto d-block",
            attrs: { id: "open_uppy_modal" },
          },
          [_vm._v("Upload Artwork")]
        )
      : _vm._e(),
    _vm._v(" "),
    _c("div", {
      staticClass: "DashboardContainer",
      staticStyle: { "z-index": "10000", position: "relative" },
    }),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js":
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ normalizeComponent)
/* harmony export */ });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ "./node_modules/wildcard/index.js":
/*!****************************************!*\
  !*** ./node_modules/wildcard/index.js ***!
  \****************************************/
/***/ ((module) => {

"use strict";
/* jshint node: true */


/**
  # wildcard

  Very simple wildcard matching, which is designed to provide the same
  functionality that is found in the
  [eve](https://github.com/adobe-webplatform/eve) eventing library.

  ## Usage

  It works with strings:

  <<< examples/strings.js

  Arrays:

  <<< examples/arrays.js

  Objects (matching against keys):

  <<< examples/objects.js

  While the library works in Node, if you are are looking for file-based
  wildcard matching then you should have a look at:

  <https://github.com/isaacs/node-glob>
**/

function WildcardMatcher(text, separator) {
  this.text = text = text || '';
  this.hasWild = ~text.indexOf('*');
  this.separator = separator;
  this.parts = text.split(separator);
}

WildcardMatcher.prototype.match = function(input) {
  var matches = true;
  var parts = this.parts;
  var ii;
  var partsCount = parts.length;
  var testParts;

  if (typeof input == 'string' || input instanceof String) {
    if (!this.hasWild && this.text != input) {
      matches = false;
    } else {
      testParts = (input || '').split(this.separator);
      for (ii = 0; matches && ii < partsCount; ii++) {
        if (parts[ii] === '*')  {
          continue;
        } else if (ii < testParts.length) {
          matches = parts[ii] === testParts[ii];
        } else {
          matches = false;
        }
      }

      // If matches, then return the component parts
      matches = matches && testParts;
    }
  }
  else if (typeof input.splice == 'function') {
    matches = [];

    for (ii = input.length; ii--; ) {
      if (this.match(input[ii])) {
        matches[matches.length] = input[ii];
      }
    }
  }
  else if (typeof input == 'object') {
    matches = {};

    for (var key in input) {
      if (this.match(key)) {
        matches[key] = input[key];
      }
    }
  }

  return matches;
};

module.exports = function(text, test, separator) {
  var matcher = new WildcardMatcher(text, separator || /[\/\.]/);
  if (typeof test != 'undefined') {
    return matcher.match(test);
  }

  return matcher;
};


/***/ }),

/***/ "./node_modules/nanoid/non-secure/index.cjs":
/*!**************************************************!*\
  !*** ./node_modules/nanoid/non-secure/index.cjs ***!
  \**************************************************/
/***/ ((module) => {

let urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
let customAlphabet = (alphabet, defaultSize = 21) => {
  return (size = defaultSize) => {
    let id = ''
    let i = size
    while (i--) {
      id += alphabet[(Math.random() * alphabet.length) | 0]
    }
    return id
  }
}
let nanoid = (size = 21) => {
  let id = ''
  let i = size
  while (i--) {
    id += urlAlphabet[(Math.random() * 64) | 0]
  }
  return id
}
module.exports = { nanoid, customAlphabet }


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!****************************************!*\
  !*** ./resources/js/artworkChecker.js ***!
  \****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_uppy_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/uppy.vue */ "./resources/js/components/uppy.vue");
var bus = new Vue();

new Vue({
  el: '#artworkChecker',
  components: {
    uppy: _components_uppy_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: {
    name: '',
    email: '',
    uploadedArtwork: [],
    artworkLoading: false,
    artworkCheckSentSuccess: false
  },
  created: function created() {
    bus.$on('addArtwork', this.addArtwork);
  },
  methods: {
    addArtwork: function addArtwork(result) {
      this.uploadedArtwork.push(result);
    },
    removeArtwork: function removeArtwork(index) {
      this.uploadedArtwork.splice(index, 1);
    },
    sendArtworkCheck: function sendArtworkCheck() {
      var _this = this;

      this.sendingArtworkCheck = true;
      var data = {
        name: this.name,
        email: this.email,
        uploadedArtwork: this.uploadedArtwork
      };
      axios.post('/api/printingCheckArtwork', data).then(function (response) {
        _this.sendingArtworkCheck = false;
        _this.artworkCheckSentSuccess = true;
        toastr.success('Thank you. Your artwork has been sent and we\'ll get back to you as soon as possible');
      })["catch"](function () {
        _this.sendingArtworkCheck = false;
        toastr.error('Unfortunately there\'s been a problem sending your artwork to our team. Please check your internet connection and try again or send your artwork to info@balloonprinting.co.uk and our team will get back to you.');
      });
    }
  }
});
})();

/******/ })()
;