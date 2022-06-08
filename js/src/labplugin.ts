var plugin = require('./index');
var base = require('@jupyter-widgets/base');

module.exports = {
  id: 'molstarview-widget:plugin',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'molstarview-widget',
          version: plugin.version,
          exports: plugin
      });
  },
  autoStart: true
};

