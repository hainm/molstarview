var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');
var molstar = require('molstar/build/viewer/molstar');

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
    render: function() {
        this.value_changed();

        // Observe changes in the value traitlet in Python, and define
        // a custom callback.
        this.model.on('change:value', this.value_changed, this);
        //this.viewer = new Viewer('app', {
        //    layoutIsExpanded: false,
        //    layoutShowControls: false,
        //    layoutShowRemoteState: false,
        //    layoutShowSequence: true,
        //    layoutShowLog: false,
        //    layoutShowLeftPanel: true,
        //    viewportShowExpand: true,
        //    viewportShowSelectionMode: false,
        //    viewportShowAnimation: false,
        //    pdbProvider: 'rcsb',
        //    emdbProvider: 'rcsb',
        //});
        //this.viewer.loadPdb('7bv2');  
    },

    value_changed: function() {
        this.el.textContent = this.model.get('value');
    }
});


module.exports = {
    MolstarModel: MolstarModel,
    MolstarView: MolstarView
};
