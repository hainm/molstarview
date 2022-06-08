var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');
var molConfig = require('molstar/lib/mol-plugin/config');
var molPluginUi =  require('molstar/lib/mol-plugin-ui');
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
    render: async function() {
        this.handleMessage()
        this.displayed.then(function(){
            this.init()
        }.bind(this))
    },
    init: async function(){
        const container = document.createElement('div');
        container.style.width = '800px';
        container.style.height = '600px';
        this.el.appendChild(container);
        this.plugin = await molPluginUi.createPluginUI(container);
        // call it after the plugin has been initialized
        this.value_changed();
        this.model.on('change:value', this.value_changed, this);
    },
    value_changed: function() {
        this.loadPdb(this.model.get('value'));
    },
    loadPdb: function(pdb) {    
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
                    options: { ...params.source.params.options },
                }
            }
        }));
    },
    executeCode: function(code){
        eval(code);
    },
    on_msg: function(msg){
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
    handleMessage: function(){
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

    exportImage: function(modelId){
        this.plugin.helpers.viewportScreenshot.getImageDataUri().then(function(data){
            var msg = {"type": "exportImage", "data": data}
            this.model.send(msg)
        }.bind(this))
    },
});


module.exports = {
    MolstarModel: MolstarModel,
    MolstarView: MolstarView
};
