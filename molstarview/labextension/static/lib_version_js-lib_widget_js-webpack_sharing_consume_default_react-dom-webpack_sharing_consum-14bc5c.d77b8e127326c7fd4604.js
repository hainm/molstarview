"use strict";
(self["webpackChunkmolstarview_widget"] = self["webpackChunkmolstarview_widget"] || []).push([["lib_version_js-lib_widget_js-webpack_sharing_consume_default_react-dom-webpack_sharing_consum-14bc5c"],{

/***/ "./lib/representation.js":
/*!*******************************!*\
  !*** ./lib/representation.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.clearRepresentation = exports.removeRepresentation = exports.addRepresentation = void 0;
function addRepresentation(plugin, params, modelIndex) {
    var st = plugin.managers.structure.hierarchy.current.structures[modelIndex];
    console.log("Calling from addRepresentation", st, params, modelIndex);
    var components = st.components;
    plugin.dataTransaction(() => __awaiter(this, void 0, void 0, function* () {
        for (const component of components) {
            yield plugin.builders.structure.representation.addRepresentation(component.cell, params);
        }
    }));
}
exports.addRepresentation = addRepresentation;
function removeRepresentation() {
}
exports.removeRepresentation = removeRepresentation;
function clearRepresentation() {
}
exports.clearRepresentation = clearRepresentation;


/***/ }),

/***/ "./lib/version.js":
/*!************************!*\
  !*** ./lib/version.js ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


// Copyright (c) Hai Nguyen
// Distributed under the terms of the Modified BSD License.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MODULE_NAME = exports.MODULE_VERSION = void 0;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-var-requires
const data = __webpack_require__(/*! ../package.json */ "./package.json");
/**
 * The _model_module_version/_view_module_version this package implements.
 *
 * The html widget manager assumes that this is the same as the npm package
 * version number.
 */
exports.MODULE_VERSION = data.version;
/*
 * The current package name.
 */
exports.MODULE_NAME = data.name;


/***/ }),

/***/ "./lib/widget.js":
/*!***********************!*\
  !*** ./lib/widget.js ***!
  \***********************/
/***/ (function(module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const widgets = __importStar(__webpack_require__(/*! @jupyter-widgets/base */ "webpack/sharing/consume/default/@jupyter-widgets/base"));
const _ = __importStar(__webpack_require__(/*! underscore */ "./node_modules/underscore/modules/index-all.js"));
const config_1 = __webpack_require__(/*! molstar/lib/mol-plugin/config */ "./node_modules/molstar/lib/mol-plugin/config.js");
const mol_plugin_ui_1 = __webpack_require__(/*! molstar/lib/mol-plugin-ui */ "./node_modules/molstar/lib/mol-plugin-ui/index.js");
const molStructure = __importStar(__webpack_require__(/*! molstar/lib/mol-plugin-state/actions/structure */ "./node_modules/molstar/lib/mol-plugin-state/actions/structure.js"));
const commands_1 = __webpack_require__(/*! molstar/lib/mol-plugin/commands */ "./node_modules/molstar/lib/mol-plugin/commands.js");
// require('molstar/lib/mol-plugin-ui/skin/light.scss'); // FIXME: loader issue for labextension building.
const representation = __importStar(__webpack_require__(/*! ./representation */ "./lib/representation.js"));
// import { basicSpec } from "./ui"
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
        _model_name: 'MolstarModel',
        _view_name: 'MolstarView',
        _model_module: 'molstarview-widget',
        _view_module: 'molstarview-widget',
        _model_module_version: '0.1.0',
        _view_module_version: '0.1.0',
    })
});
// Custom View. Renders the widget model.
var MolstarView = widgets.DOMWidgetView.extend({
    // Defines how the widget gets rendered into the DOM
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            this.handleMessage();
            this.displayed.then(() => __awaiter(this, void 0, void 0, function* () {
                yield this.initializeDisplay();
                if (this.model.comm == undefined) {
                    this.handleEmbed();
                }
                yield this.finalizeDisplay();
            }));
        });
    },
    initializeDisplay() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setupContainer();
            this.plugin = yield (0, mol_plugin_ui_1.createPluginUI)(this.container);
            this._focused = false;
            yield this.checkLeaderView();
        });
    },
    setupContainer() {
        const container = document.createElement('div');
        container.style.width = '800px';
        container.style.height = '600px';
        this.el.appendChild(container);
        this.container = container;
    },
    checkLeaderView() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Find a leader view');
            this.isLeader = this.model.views.length < 2;
            var hasLeader = false;
            for (var k in this.model.views) {
                var view = yield this.model.views[k];
                if (view.isLeader) {
                    hasLeader = true;
                    break;
                }
            }
            if (!hasLeader) {
                for (var k in this.model.views) {
                    var view = yield this.model.views[k];
                    view.isLeader = true;
                    hasLeader = true;
                    break;
                }
            }
            if (!this.isLeader) {
                for (var k in this.model.views) {
                    var view = yield this.model.views[k];
                    if (view.isLeader) {
                        var data = yield view.plugin.state.getSnapshot();
                        yield this.plugin.state.setSnapshot(data);
                        break;
                    }
                }
            }
        });
    },
    handleSignals() {
        var that = this;
        this.container.addEventListener('mouseover', function (e) {
            that._focused = 1;
            e; // linter
            that.mouseOverDisplay('block');
        }, false);
        this.container.addEventListener('mouseout', function (e) {
            that._focused = 0;
            e; // linter
            that.mouseOverDisplay('none');
        }, false);
    },
    finalizeDisplay() {
        return __awaiter(this, void 0, void 0, function* () {
            this.send({
                'type': 'request_loaded',
                'data': true
            });
        });
    },
    // from molstar: https://github.com/molstar/molstar/blob/d1e17785b8404eec280ad04a6285ad9429c5c9f3/src/apps/viewer/app.ts#L219-L223
    loadStructureFromData(data, format, preset, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const _data = yield this.plugin.builders.data.rawData({ data, label: options === null || options === void 0 ? void 0 : options.dataLabel });
            const trajectory = yield this.plugin.builders.structure.parseTrajectory(_data, format);
            if (preset) {
                console.log("Calling loadStructureFromData with preset", preset);
                yield this.plugin.builders.structure.hierarchy.applyPreset(trajectory, preset);
            }
            else {
                console.log('Calling loadStructureFromData without preset');
                yield this.plugin.builders.structure.createModel(trajectory);
            }
        });
    },
    // from molstar: https://github.com/molstar/molstar/blob/d1e17785b8404eec280ad04a6285ad9429c5c9f3/src/apps/viewer/app.ts#L219-L223
    // this method is taken from the Viewer class
    loadPdb(pdb) {
        const params = molStructure.DownloadStructure.createDefaultParams(this.plugin.state.data.root.obj, this.plugin);
        const provider = this.plugin.config.get(config_1.PluginConfig.Download.DefaultPdbProvider);
        return this.plugin.runTask(this.plugin.state.data.applyAction(molStructure.DownloadStructure, {
            source: {
                name: 'pdb',
                params: {
                    provider: {
                        id: pdb,
                        server: {
                            name: provider,
                            params: molStructure.PdbDownloadProvider[provider].defaultValue
                        }
                    },
                    options: Object.assign({}, params.source.params.options),
                }
            }
        }));
    },
    executeCode(code) {
        eval(code);
    },
    on_msg(msg) {
        if (msg.type == 'call_method') {
            var new_args = msg.args.slice();
            new_args.push(msg.kwargs);
            switch (msg.target) {
                case 'Widget':
                    var func = this[msg.methodName];
                    if (func) {
                        func.apply(this, new_args);
                    }
                    else {
                        console.log('Can not create func for ' + msg.methodName);
                    }
                    break;
            }
        }
        else if (msg.type == 'binary_single') {
            this.handleBinaryMessage(msg);
        }
    },
    handleBinaryMessage(msg) {
        var coordinateMeta = msg.data;
        var coordinates;
        var keys = Object.keys(coordinateMeta);
        for (var i = 0; i < keys.length; i++) {
            var traj_index = keys[i];
            coordinates = new Float32Array(msg.buffers[i].buffer);
            if (coordinates.byteLength > 0) {
                this.updateCoordinates(coordinates, traj_index);
            }
        }
    },
    handleEmbed() {
        var snaphShot = this.model.get("molstate");
        this.setState(snaphShot);
    },
    handleMessage() {
        this.model.on("msg:custom", (msg) => {
            this.on_msg(msg);
        }, this);
        if (this.model.comm) {
            this.model.comm.on_msg((msg) => {
                var buffers = msg.buffers;
                var content = msg.content.data.content;
                if (buffers.length && content) {
                    content.buffers = buffers;
                }
                this.model._handle_comm_msg.call(this.model, msg);
            });
        }
    },
    updateCoordinates(coordinates, modelIndex) {
        var component = 0; // FIXME
        if (coordinates && typeof component != 'undefined') {
            // FIXME: update
        }
    },
    exportImage(modelId) {
        this.plugin.helpers.viewportScreenshot.getImageDataUri().then((data) => {
            data = data.replace("data:image/png;base64,", "");
            var msg = { "type": "exportImage", "data": data, "model_id": modelId };
            this.send(msg);
        });
    },
    downloadState() {
        commands_1.PluginCommands.State.Snapshots.DownloadToFile(this.plugin, { type: 'json' });
    },
    getState() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isLeader) {
                var data = this.plugin.state.getSnapshot();
                this.model.set("molstate", data);
                this.touch();
            }
        });
    },
    setState(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.plugin.state.setSnapshot(data);
        });
    },
    addRepresentation(params, modelIndex) {
        representation.addRepresentation(this.plugin, params, modelIndex);
    },
    removeRepresentation(modelIndex) {
        var st = this.plugin.managers.structure.hierarchy.current.structures[modelIndex];
        this.plugin.managers.structure.component.removeRepresentations(st.components);
    },
    resetCamera() {
        commands_1.PluginCommands.Camera.Reset(this.plugin, {});
    },
    setCamera(params) {
        var durationMs = 0.0;
        this.plugin.canvas3d.requestCameraReset({ durationMs, params });
    },
    getCamera() {
        var snapshot = this.plugin.canvas3d.camera.getSnapshot();
        this.send({ "type": "getCamera", "data": snapshot });
    },
    syncCamera() {
        var that = this;
        if (that._synced_model_ids.length > 0 && that._focused) {
            that._synced_model_ids.forEach(function (mid) {
                return __awaiter(this, void 0, void 0, function* () {
                    var model = yield that.model.widget_manager.get_model(mid);
                    for (var k in model.views) {
                        var view = yield model.views[k];
                        if (view !== that) {
                            view.setCamera(that.plugin.canvas3d.camera.getSnapshot());
                        }
                    }
                });
            });
        }
    },
});
module.exports = {
    MolstarModel: MolstarModel,
    MolstarView: MolstarView,
};


/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"name":"molstarview-widget","version":"0.1.0","description":"yeah","keywords":["jupyter","jupyterlab","jupyterlab-extension","widgets"],"files":["lib/**/*.js","dist/*.js","css/*.css"],"homepage":"https://github.com/molstar/molstarview","bugs":{"url":"https://github.com/molstar/molstarview/issues"},"license":"BSD-3-Clause","author":{"name":"Hai Nguyen","email":"hainm.comp@gmail.com"},"main":"lib/index.js","types":"./lib/index.d.ts","repository":{"type":"git","url":"https://github.com/molstar/molstarview"},"scripts":{"build":"yarn run build:lib && yarn run build:nbextension && yarn run build:labextension:dev","build:prod":"yarn run build:lib && yarn run build:nbextension && yarn run build:labextension","build:labextension":"jupyter labextension build .","build:labextension:dev":"jupyter labextension build --development True .","build:lib":"tsc","build:nbextension":"webpack","clean":"yarn run clean:lib && yarn run clean:nbextension && yarn run clean:labextension","clean:lib":"rimraf lib","clean:labextension":"rimraf molstarview/labextension","clean:nbextension":"rimraf molstarview/nbextension/static/index.js","lint":"eslint . --ext .ts,.tsx --fix","lint:check":"eslint . --ext .ts,.tsx","prepack":"yarn run build:lib","test":"jest","watch":"npm-run-all -p watch:*","watch:lib":"tsc -w","watch:nbextension":"webpack --watch --mode=development","watch:labextension":"jupyter labextension watch ."},"dependencies":{"@jupyter-widgets/base":"^1.1.10 || ^2 || ^3 || ^4 || ^5 || ^6"},"devDependencies":{"@babel/core":"^7.23.7","@babel/preset-env":"^7.23.8","@jupyter-widgets/base-manager":"^1.0.7","@jupyterlab/builder":"^4.0.11","@lumino/application":"^2.3.0","@lumino/widgets":"^2.3.1","@types/jest":"^29.5.11","@types/node":"^22.9.4","@types/webpack-env":"^1.18.4","@typescript-eslint/eslint-plugin":"^6.19.1","@typescript-eslint/parser":"^6.19.1","acorn":"^8.11.3","css-loader":"^6.9.1","eslint":"^8.56.0","eslint-config-prettier":"^9.1.0","eslint-plugin-prettier":"^5.1.3","fs-extra":"^11.2.0","identity-obj-proxy":"^3.0.0","jest":"^29.7.0","mkdirp":"^3.0.1","molstar":"^3.9","npm-run-all":"^4.1.5","prettier":"^3.2.4","react-dom":"^18.2.0","rimraf":"^5.0.5","source-map-loader":"^5.0.0","style-loader":"^3.3.4","ts-jest":"^29.1.2","ts-loader":"^9.5.1","typescript":"~5.3.3","webpack":"^5.90.0","webpack-cli":"^5.1.4"},"devDependenciesComments":{"@jupyterlab/builder":"pinned to the latest JupyterLab 3.x release","@lumino/application":"pinned to the latest Lumino 1.x release","@lumino/widgets":"pinned to the latest Lumino 1.x release"},"jupyterlab":{"extension":"lib/plugin","outputDir":"molstarview/labextension/","sharedPackages":{"@jupyter-widgets/base":{"bundled":false,"singleton":true}}}}');

/***/ })

}]);
//# sourceMappingURL=lib_version_js-lib_widget_js-webpack_sharing_consume_default_react-dom-webpack_sharing_consum-14bc5c.d77b8e127326c7fd4604.js.map