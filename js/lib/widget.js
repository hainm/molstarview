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
    render: function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.handleMessage();
            this.displayed.then(function () {
                this.init();
            }.bind(this));
        });
    },
    init: function () {
        return __awaiter(this, void 0, void 0, function* () {
            const container = document.createElement('div');
            container.style.width = '800px';
            container.style.height = '600px';
            this.el.appendChild(container);
            this.plugin = yield mol_plugin_ui_1.createPluginUI(container);
            // call it after the plugin has been initialized
            this.value_changed();
            this.model.on('change:value', this.value_changed, this);
        });
    },
    value_changed: function () {
        this.loadPdb(this.model.get('value'));
    },
    loadPdb: function (pdb) {
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
    executeCode: function (code) {
        eval(code);
    },
    on_msg: function (msg) {
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
    handleMessage: function () {
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
    exportImage: function (modelId) {
        this.plugin.helpers.viewportScreenshot.getImageDataUri().then(function (data) {
            var msg = { "type": "exportImage", "data": data };
            this.model.send(msg);
        }.bind(this));
    },
});
module.exports = {
    MolstarModel: MolstarModel,
    MolstarView: MolstarView
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lkZ2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3dpZGdldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQy9DLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQiw0REFBNEQ7QUFDNUQsMkRBQTJEO0FBQzNELDBEQUEwRDtBQUMxRCw2REFBd0Q7QUFDeEQsK0VBQThFO0FBQzlFLE9BQU8sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDLENBQUMsaURBQWlEO0FBRXZHLDBEQUEwRDtBQUcxRCwyRUFBMkU7QUFDM0Usa0NBQWtDO0FBQ2xDLEVBQUU7QUFDRixrQkFBa0I7QUFDbEIsb0JBQW9CO0FBQ3BCLDRCQUE0QjtBQUM1QixFQUFFO0FBQ0YsbUJBQW1CO0FBQ25CLHFCQUFxQjtBQUNyQiw2QkFBNkI7QUFDN0IsRUFBRTtBQUNGLHVDQUF1QztBQUV2Qyw0RUFBNEU7QUFDNUUsOENBQThDO0FBQzlDLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDO0lBQzdDLFFBQVEsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFFO1FBQzVELFdBQVcsRUFBRyxjQUFjO1FBQzVCLFVBQVUsRUFBRyxhQUFhO1FBQzFCLGFBQWEsRUFBRyx3QkFBd0I7UUFDeEMsWUFBWSxFQUFHLHdCQUF3QjtRQUN2QyxxQkFBcUIsRUFBRyxPQUFPO1FBQy9CLG9CQUFvQixFQUFHLE9BQU87UUFDOUIsS0FBSyxFQUFHLGdCQUFnQjtLQUMzQixDQUFDO0NBQ0wsQ0FBQyxDQUFDO0FBR0gseUNBQXlDO0FBQ3pDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO0lBQzNDLG9EQUFvRDtJQUNwRCxN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