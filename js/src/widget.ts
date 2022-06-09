var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');
// var molConfig = require('molstar/lib/mol-plugin/config');
// var molPluginUi =  require('molstar/lib/mol-plugin-ui');
import {PluginConfig} from 'molstar/lib/mol-plugin/config'
import {createPluginUI} from 'molstar/lib/mol-plugin-ui'
import * as molStructure from 'molstar/lib/mol-plugin-state/actions/structure'
import { BuiltInTrajectoryFormat } from 'molstar/lib/mol-plugin-state/formats/trajectory'
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
        _model_name : 'MolstarModel',
        _view_name : 'MolstarView',
        _model_module : 'jupyter-widget-example',
        _view_module : 'jupyter-widget-example',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
        value : 'Molstar World!'
    })
});


// Custom View. Renders the widget model.
var MolstarView = widgets.DOMWidgetView.extend({
    // Defines how the widget gets rendered into the DOM
    async render() {
        this.handleMessage()
        this.displayed.then(function(){
            this.init()
        }.bind(this))
    },
    async init(){
        const container = document.createElement('div');
        container.style.width = '800px';
        container.style.height = '600px';
        this.el.appendChild(container);
        this.molContainer = container;
        this.plugin = await createPluginUI(container);
        // call it after the plugin has been initialized
        this.value_changed();
        this.model.on('change:value', this.value_changed, this);
    },
    value_changed() {
        this.loadPdb(this.model.get('value'));
    },
    // from molstar: https://github.com/molstar/molstar/blob/d1e17785b8404eec280ad04a6285ad9429c5c9f3/src/apps/viewer/app.ts#L219-L223
    async loadStructureFromData(data: string | number[], format: BuiltInTrajectoryFormat, options?: { dataLabel?: string }) {
        const _data = await this.plugin.builders.data.rawData({ data, label: options?.dataLabel });
        const trajectory = await this.plugin.builders.structure.parseTrajectory(_data, format);
        await this.plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default');
    },

    loadPdb(pdb) {    
        // FIXME: move to different file?
        // this method is taken from the Viewer class
        const params = molStructure.DownloadStructure.createDefaultParams(this.plugin.state.data.root.obj, this.plugin);
        const provider = this.plugin.config.get(PluginConfig.Download.DefaultPdbProvider);
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
                    options: { ...params.source.params.options },
                }
            }
        }));
    },
    executeCode(code){
        eval(code);
    },

    on_msg(msg){
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
                } else {
                    // send error message to Python?
                    console.log('can not create func for ' + msg.methodName);
                }
                break;
        }
    },
    handleMessage(){
        this.model.on("msg:custom", function(msg){
           this.on_msg(msg);
        }, this);

        if (this.model.comm) {
            this.model.comm.on_msg(function(msg) {
                var buffers = msg.buffers;
                var content = msg.content.data.content;
                if (buffers.length && content) {
                    content.buffers = buffers;
                }
                this.model._handle_comm_msg.call(this.model, msg);
            }.bind(this));
        }
    },

    exportImage(modelId){
        this.plugin.helpers.viewportScreenshot.getImageDataUri().then(function(data){
            console.log('data')
            data = data.replace("data:image/png;base64,", "");
            var msg = {"type": "exportImage", "data": data, "model_id": modelId}
            console.log('model_id', modelId)
            this.send(msg)
        }.bind(this))
    }
});


module.exports = {
    MolstarModel: MolstarModel,
    MolstarView: MolstarView
};
