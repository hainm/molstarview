var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');
var molConfig = require('molstar/lib/mol-plugin/config');
var molPluginUi = require('molstar/lib/mol-plugin-ui');
var molStructure = require('molstar/lib/mol-plugin-state/actions/structure');
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
            this.plugin = yield molPluginUi.createPluginUI(container);
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
        const provider = this.plugin.config.get(molConfig.PluginConfig.Download.DefaultPdbProvider);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lkZ2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3dpZGdldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUMvQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUIsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFDekQsSUFBSSxXQUFXLEdBQUksT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDeEQsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLGdEQUFnRCxDQUFDLENBQUM7QUFDN0UsT0FBTyxDQUFDLDJDQUEyQyxDQUFDLENBQUMsQ0FBQyxpREFBaUQ7QUFFdkcsMERBQTBEO0FBRzFELDJFQUEyRTtBQUMzRSxrQ0FBa0M7QUFDbEMsRUFBRTtBQUNGLGtCQUFrQjtBQUNsQixvQkFBb0I7QUFDcEIsNEJBQTRCO0FBQzVCLEVBQUU7QUFDRixtQkFBbUI7QUFDbkIscUJBQXFCO0FBQ3JCLDZCQUE2QjtBQUM3QixFQUFFO0FBQ0YsdUNBQXVDO0FBRXZDLDRFQUE0RTtBQUM1RSw4Q0FBOEM7QUFDOUMsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUM7SUFDN0MsUUFBUSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUU7UUFDNUQsV0FBVyxFQUFHLGNBQWM7UUFDNUIsVUFBVSxFQUFHLGFBQWE7UUFDMUIsYUFBYSxFQUFHLHdCQUF3QjtRQUN4QyxZQUFZLEVBQUcsd0JBQXdCO1FBQ3ZDLHFCQUFxQixFQUFHLE9BQU87UUFDL0Isb0JBQW9CLEVBQUcsT0FBTztRQUM5QixLQUFLLEVBQUcsZ0JBQWdCO0tBQzNCLENBQUM7Q0FDTCxDQUFDLENBQUM7QUFHSCx5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