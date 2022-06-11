"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');
const config_1 = require("molstar/lib/mol-plugin/config");
const mol_plugin_ui_1 = require("molstar/lib/mol-plugin-ui");
const molStructure = require("molstar/lib/mol-plugin-state/actions/structure");
const commands_1 = require("molstar/lib/mol-plugin/commands");
require('molstar/lib/mol-plugin-ui/skin/light.scss'); // FIXME: loader issue for labextension building.
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
        _model_module: 'jupyter-widget-example',
        _view_module: 'jupyter-widget-example',
        _model_module_version: '0.1.0',
        _view_module_version: '0.1.0',
        value: 'Molstar World!'
    })
});
// Custom View. Renders the widget model.
var MolstarView = widgets.DOMWidgetView.extend({
    // Defines how the widget gets rendered into the DOM
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            this.handleMessage();
            this.displayed.then(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    yield this.initializeDisplay();
                    yield this.finalizeDisplay();
                });
            }.bind(this));
        });
    },
    initializeDisplay() {
        return __awaiter(this, void 0, void 0, function* () {
            const container = document.createElement('div');
            container.style.width = '800px';
            container.style.height = '600px';
            this.el.appendChild(container);
            this.molContainer = container;
            this.plugin = yield mol_plugin_ui_1.createPluginUI(container);
            // FIXME: make a new function called "restoreStateIfNeeded"?
            // Find "leader" view
            // Other views need to be reconstructed based on leader view
            console.log('Find a leader view');
            this.isLeader = false;
            if (this.model.views.length < 2) {
                this.isLeader = true;
            }
            var hasLeader = false;
            for (var k in this.model.views) {
                console.log('k', k, typeof k);
                var view = yield this.model.views[k];
                if (view.isLeader) {
                    hasLeader = view.isLeader;
                    break;
                }
            }
            console.log("hasLeader or not?", hasLeader);
            if (!hasLeader) {
                for (var k in this.model.views) {
                    var view = yield this.model.views[k];
                    console.log("Assign leader", view);
                    view.isLeader = true;
                    hasLeader = true;
                    break;
                }
                console.log("Done Assign leader");
            }
            console.log('Is this Leader or not??', this.isLeader);
            if (!this.isLeader) {
                for (var k in this.model.views) {
                    var view = yield this.model.views[k];
                    console.log('view', view);
                    if (view.isLeader) {
                        console.log("Calling setState");
                        yield this.plugin.state.setSnapshot(yield view.plugin.state.getSnapshot());
                        break;
                    }
                }
            }
        });
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
    loadStructureFromData(data, format, options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Calling loadStructureFromData");
            const _data = yield this.plugin.builders.data.rawData({ data, label: options === null || options === void 0 ? void 0 : options.dataLabel });
            const trajectory = yield this.plugin.builders.structure.parseTrajectory(_data, format);
            yield this.plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default');
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
            var index, component, func, stage;
            var new_args = msg.args.slice();
            new_args.push(msg.kwargs);
            switch (msg.target) {
                case 'Widget':
                    func = this[msg.methodName];
                    if (func) {
                        func.apply(this, new_args);
                    }
                    else {
                        // send error message to Python?
                        console.log('can not create func for ' + msg.methodName);
                    }
                    break;
            }
        }
        else if (msg.type == 'binary_single') {
            var coordinateMeta = msg.data;
            var coordinates;
            var i, traj_index;
            var keys = Object.keys(coordinateMeta);
            for (i = 0; i < keys.length; i++) {
                traj_index = keys[i];
                coordinates = new Float32Array(msg.buffers[i].buffer);
                if (coordinates.byteLength > 0) {
                    this.updateCoordinates(coordinates, traj_index);
                }
            }
        }
    },
    handleMessage() {
        this.model.on("msg:custom", function (msg) {
            this.on_msg(msg);
        }, this);
        if (this.model.comm) {
            this.model.comm.on_msg(function (msg) {
                var buffers = msg.buffers;
                var content = msg.content.data.content;
                if (buffers.length && content) {
                    content.buffers = buffers;
                }
                this.model._handle_comm_msg.call(this.model, msg);
            }.bind(this));
        }
    },
    updateCoordinates(coordinates, modelIndex) {
        // coordinates must be ArrayBuffer (use this.decode_base64)
        // var component = ? // FIXME: update
        var component = 0; // FIXME
        if (coordinates && typeof component != 'undefined') {
            var coords = new Float32Array(coordinates);
            // FIXME: update
        }
    },
    exportImage(modelId) {
        this.plugin.helpers.viewportScreenshot.getImageDataUri().then(function (data) {
            data = data.replace("data:image/png;base64,", "");
            var msg = { "type": "exportImage", "data": data, "model_id": modelId };
            this.send(msg);
        }.bind(this));
    },
    downloadState() {
        commands_1.PluginCommands.State.Snapshots.DownloadToFile(this.plugin, { type: 'json' });
    },
    getState() {
        return __awaiter(this, void 0, void 0, function* () {
            // FIXME: wrong?
            var type = 'molj';
            const data = yield this.plugin.managers.snapshot.serialize({ type });
            return data;
        });
    },
    setState(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // FIXME: wrong?
            yield this.plugin.managers.snapshot.setStateSnapshot(data);
        });
    },
});
module.exports = {
    MolstarModel: MolstarModel,
    MolstarView: MolstarView,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lkZ2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3dpZGdldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQy9DLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQiwwREFBMEQ7QUFDMUQsNkRBQXdEO0FBQ3hELCtFQUE4RTtBQUU5RSw4REFBZ0U7QUFFaEUsT0FBTyxDQUFDLDJDQUEyQyxDQUFDLENBQUEsQ0FBQyxpREFBaUQ7QUFFdEcsbUNBQW1DO0FBRW5DLDBEQUEwRDtBQUcxRCwyRUFBMkU7QUFDM0Usa0NBQWtDO0FBQ2xDLEVBQUU7QUFDRixrQkFBa0I7QUFDbEIsb0JBQW9CO0FBQ3BCLDRCQUE0QjtBQUM1QixFQUFFO0FBQ0YsbUJBQW1CO0FBQ25CLHFCQUFxQjtBQUNyQiw2QkFBNkI7QUFDN0IsRUFBRTtBQUNGLHVDQUF1QztBQUV2Qyw0RUFBNEU7QUFDNUUsOENBQThDO0FBQzlDLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDO0lBQzdDLFFBQVEsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFFO1FBQzVELFdBQVcsRUFBRyxjQUFjO1FBQzVCLFVBQVUsRUFBRyxhQUFhO1FBQzFCLGFBQWEsRUFBRyx3QkFBd0I7UUFDeEMsWUFBWSxFQUFHLHdCQUF3QjtRQUN2QyxxQkFBcUIsRUFBRyxPQUFPO1FBQy9CLG9CQUFvQixFQUFHLE9BQU87UUFDOUIsS0FBSyxFQUFHLGdCQUFnQjtLQUMzQixDQUFDO0NBQ0wsQ0FBQyxDQUFDO0FBR0gseUNBQXlDO0FBQ3pDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO0lBQzNDLG9EQUFvRDtJQUM5QyxN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