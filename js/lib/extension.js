// This file contains the javascript that is run when the notebook is loaded.
// It contains some requirejs configuration and the `load_ipython_extension`
// which is required for any notebook extension.
//
// Some static assets may be required by the custom widget javascript. The base
// url for the notebook is not known at build time and is therefore computed
// dynamically.
// Configure requirejs
if (window.require) {
    window.require.config({
        map: {
            "*": {
                "molstarview-widget": "nbextensions/molstarview-widget/index",
            }
        }
    });
}
// Export the required load_ipython_extension
module.exports = {
    load_ipython_extension: function () { }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2V4dGVuc2lvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw2RUFBNkU7QUFDN0UsNEVBQTRFO0FBQzVFLGdEQUFnRDtBQUNoRCxFQUFFO0FBQ0YsK0VBQStFO0FBQy9FLDRFQUE0RTtBQUM1RSxlQUFlO0FBQ2YsdUJBQXVCLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLEdBQUcsaUNBQWlDLENBQUM7QUFHM0gsc0JBQXNCO0FBQ3RCLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtJQUNoQixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUNsQixHQUFHLEVBQUU7WUFDRCxHQUFHLEVBQUc7Z0JBQ0Ysb0JBQW9CLEVBQUUsdUNBQXVDO2FBQ2hFO1NBQ0o7S0FDSixDQUFDLENBQUM7Q0FDTjtBQUVELDZDQUE2QztBQUM3QyxNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2Isc0JBQXNCLEVBQUUsY0FBWSxDQUFDO0NBQ3hDLENBQUMifQ==
