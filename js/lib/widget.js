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
// var molConfig = require('molstar/lib/mol-plugin/config');
// var molPluginUi =  require('molstar/lib/mol-plugin-ui');
const config_1 = require("molstar/lib/mol-plugin/config");
const mol_plugin_ui_1 = require("molstar/lib/mol-plugin-ui");
const molStructure = require("molstar/lib/mol-plugin-state/actions/structure");
require('molstar/lib/mol-plugin-ui/skin/light.scss'); // FIXME: loader issue for labextension building.
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
                this.init();
            }.bind(this));
        });
    },
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const container = document.createElement('div');
            container.style.width = '800px';
            container.style.height = '600px';
            this.el.appendChild(container);
            this.molContainer = container;
            this.plugin = yield mol_plugin_ui_1.createPluginUI(container);
            // call it after the plugin has been initialized
            this.value_changed();
            this.model.on('change:value', this.value_changed, this);
        });
    },
    value_changed() {
        this.loadPdb(this.model.get('value'));
    },
    loadPdb(pdb) {
        // FIXME: move to different file?
        // this method is taken from the Viewer class
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
        }
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
    exportImage(modelId) {
        this.plugin.helpers.viewportScreenshot.getImageDataUri().then(function (data) {
            console.log('data');
            data = data.replace("data:image/png;base64,", "");
            var msg = { "type": "exportImage", "data": data, "model_id": modelId };
            console.log('model_id', modelId);
            this.send(msg);
        }.bind(this));
    }
});
module.exports = {
    MolstarModel: MolstarModel,
    MolstarView: MolstarView
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lkZ2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3dpZGdldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQy9DLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQiw0REFBNEQ7QUFDNUQsMkRBQTJEO0FBQzNELDBEQUEwRDtBQUMxRCw2REFBd0Q7QUFDeEQsK0VBQThFO0FBQzlFLE9BQU8sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDLENBQUMsaURBQWlEO0FBRXZHLDBEQUEwRDtBQUcxRCwyRUFBMkU7QUFDM0Usa0NBQWtDO0FBQ2xDLEVBQUU7QUFDRixrQkFBa0I7QUFDbEIsb0JBQW9CO0FBQ3BCLDRCQUE0QjtBQUM1QixFQUFFO0FBQ0YsbUJBQW1CO0FBQ25CLHFCQUFxQjtBQUNyQiw2QkFBNkI7QUFDN0IsRUFBRTtBQUNGLHVDQUF1QztBQUV2Qyw0RUFBNEU7QUFDNUUsOENBQThDO0FBQzlDLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDO0lBQzdDLFFBQVEsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFFO1FBQzVELFdBQVcsRUFBRyxjQUFjO1FBQzVCLFVBQVUsRUFBRyxhQUFhO1FBQzFCLGFBQWEsRUFBRyx3QkFBd0I7UUFDeEMsWUFBWSxFQUFHLHdCQUF3QjtRQUN2QyxxQkFBcUIsRUFBRyxPQUFPO1FBQy9CLG9CQUFvQixFQUFHLE9BQU87UUFDOUIsS0FBSyxFQUFHLGdCQUFnQjtLQUMzQixDQUFDO0NBQ0wsQ0FBQyxDQUFDO0FBR0gseUNBQXlDO0FBQ3pDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO0lBQzNDLG9EQUFvRDtJQUM5QyxN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