var plugin = require('./index');
var base = require('@jupyter-widgets/base');
module.exports = {
    id: 'molstarview-widget',
    requires: [base.IJupyterWidgetRegistry],
    activate: function (app, widgets) {
        widgets.registerWidget({
            name: 'molstarview-widget',
            version: plugin.version,
            exports: plugin
        });
    },
    autoStart: true
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFicGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xhYnBsdWdpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDaEMsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFFNUMsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNmLEVBQUUsRUFBRSwyQkFBMkI7SUFDL0IsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDO0lBQ3ZDLFFBQVEsRUFBRSxVQUFTLEdBQUcsRUFBRSxPQUFPO1FBQzNCLE9BQU8sQ0FBQyxjQUFjLENBQUM7WUFDbkIsSUFBSSxFQUFFLG9CQUFvQjtZQUMxQixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU87WUFDdkIsT0FBTyxFQUFFLE1BQU07U0FDbEIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNELFNBQVMsRUFBRSxJQUFJO0NBQ2hCLENBQUMifQ==
