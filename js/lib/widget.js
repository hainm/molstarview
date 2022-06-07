var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');
// var { createPluginUI } require('molstar/lib/mol-plugin-ui');
var molPluginUi =  require('molstar/lib/mol-plugin-ui');
// var { DownloadStructure, PdbDownloadProvider } require('molstar/lib/mol-plugin-state/actions/structure');
var molStructure = require('molstar/lib/mol-plugin-state/actions/structure');
var molConfig = require('molstar/lib/mol-plugin/config');

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
        this.plugin = await molPluginUi.createPluginUI(this.el);
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
});


module.exports = {
    MolstarModel: MolstarModel,
    MolstarView: MolstarView
};
