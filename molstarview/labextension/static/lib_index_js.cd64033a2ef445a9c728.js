(self["webpackChunkmolstarview_widget"] = self["webpackChunkmolstarview_widget"] || []).push([["lib_index_js"],{

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Export widget models and views, and the npm package version number.
module.exports = __webpack_require__(/*! ./widget.js */ "./lib/widget.js");
module.exports.version = __webpack_require__(/*! ../package.json */ "./package.json").version;


/***/ }),

/***/ "./lib/widget.js":
/*!***********************!*\
  !*** ./lib/widget.js ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var molstar_build_viewer_molstar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! molstar/build/viewer/molstar */ "./node_modules/molstar/build/viewer/molstar.js");
/* harmony import */ var molstar_build_viewer_molstar__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(molstar_build_viewer_molstar__WEBPACK_IMPORTED_MODULE_0__);
/* module decorator */ module = __webpack_require__.hmd(module);
var widgets = __webpack_require__(/*! @jupyter-widgets/base */ "webpack/sharing/consume/default/@jupyter-widgets/base");
var _ = __webpack_require__(/*! lodash */ "webpack/sharing/consume/default/lodash/lodash");


// See example.py for the kernel counterpart to this file.


// Custom Model. Custom widgets models must at least provide default values
// for model attributes, including
//
//  - `_view_name`
//  - `_view_module`
//  - `_view_module_version`
//
//  - `_model_name`
//  - `_model_module`
//  - `_model_module_version`
//
//  when different from the base class.

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.
var MolstarModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
        _model_name : 'MolstarModel',
        _view_name : 'MolstarView',
        _model_module : 'molstarview-widget',
        _view_module : 'molstarview-widget',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
    })
});


// Custom View. Renders the widget model.
var MolstarView = widgets.DOMWidgetView.extend({
    // Defines how the widget gets rendered into the DOM
    render: function() {
        // Observe changes in the value traitlet in Python, and define
        // a custom callback.
        // FIXME: molstar here
        this.viewer = new molstar_build_viewer_molstar__WEBPACK_IMPORTED_MODULE_0__.Viewer('app', {
            layoutIsExpanded: false,
            layoutShowControls: false,
            layoutShowRemoteState: false,
            layoutShowSequence: true,
            layoutShowLog: false,
            layoutShowLeftPanel: true,
            viewportShowExpand: true,
            viewportShowSelectionMode: false,
            viewportShowAnimation: false,
            pdbProvider: 'rcsb',
            emdbProvider: 'rcsb',
        });
        this.viewer.loadPdb('7bv2');  
    }
});


module.exports = {
    MolstarModel: MolstarModel,
    MolstarView: MolstarView
};


/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"molstarview-widget","version":"0.1.0","description":"molstarview","author":"Hai Nguyen","main":"lib/index.js","repository":{"type":"git","url":"https://github.com/molstar/molstarview-widget.git"},"keywords":["jupyter","widgets","ipython","ipywidgets","jupyterlab-extension"],"files":["lib/**/*.js","dist/*.js"],"scripts":{"clean":"rimraf dist/ && rimraf ../molstarview/labextension/ && rimraf ../molstarview/nbextension","prepublish":"yarn run clean && yarn run build:prod","build":"webpack --mode=development && yarn run build:labextension:dev","build:prod":"webpack --mode=production && yarn run build:labextension","build:labextension":"jupyter labextension build .","build:labextension:dev":"jupyter labextension build --development True .","watch":"webpack --watch --mode=development","test":"echo \\"Error: no test specified\\" && exit 1"},"devDependencies":{"@jupyterlab/builder":"^3.0.0","webpack":"^5","rimraf":"^2.6.1"},"dependencies":{"@jupyter-widgets/base":"^1.1 || ^2 || ^3 || ^4","lodash":"^4.17.4","molstar":"^3.9"},"jupyterlab":{"extension":"lib/labplugin","outputDir":"../molstarview/labextension","sharedPackages":{"@jupyter-widgets/base":{"bundled":false,"singleton":true}}}}');

/***/ })

}]);
//# sourceMappingURL=lib_index_js.cd64033a2ef445a9c728.js.map