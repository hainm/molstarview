var molstarview_widget = require('./index');
var base = require('@jupyter-widgets/base');


module.exports = {
  id: 'molstarview-widget',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'molstarview-widget',
          version: molstarview_widget.version,
          exports: molstarview_widget
      });
    },
  autoStart: true
};
