var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');
import {PluginConfig} from 'molstar/lib/mol-plugin/config'
import {createPluginUI} from 'molstar/lib/mol-plugin-ui'
import * as molStructure from 'molstar/lib/mol-plugin-state/actions/structure'
import { BuiltInTrajectoryFormat } from 'molstar/lib/mol-plugin-state/formats/trajectory'
import { PluginCommands } from 'molstar/lib/mol-plugin/commands'
import { PluginState } from 'molstar/lib/mol-plugin/state'
import { StateTransforms } from 'molstar/lib/mol-plugin-state/transforms'
import { Vec3, Quat, Mat4 } from 'molstar/lib/mol-math/linear-algebra'
require('molstar/lib/mol-plugin-ui/skin/light.scss') // FIXME: loader issue for labextension building.
import * as representation from "./representation"

// import { basicSpec } from "./ui"

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
        _model_module : 'molstarview-widget',
        _view_module : 'molstarview-widget',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
    })
});


// Custom View. Renders the widget model.
var MolstarView = widgets.DOMWidgetView.extend({
    // Defines how the widget gets rendered into the DOM
    async render() {
        this.handleMessage()
        this.displayed.then(async function(){
            await this.initializeDisplay()
            if (this.model.comm == undefined){
                this.handleEmbed()
            }
            await this.finalizeDisplay()
        }.bind(this))
    },
    async initializeDisplay(){
        const container = document.createElement('div')
        container.style.width = '800px'
        container.style.height = '600px'
        this.el.appendChild(container)
        this.container = container
        this.plugin = await createPluginUI(container)
        this._focused = false

        // FIXME: make a new function called "restoreStateIfNeeded"?
        // Find "leader" view
        // Other views need to be reconstructed based on leader view
        console.log('Find a leader view')
        this.isLeader = false
        if (this.model.views.length < 2) {
            this.isLeader = true
        }
        var hasLeader = false
        for (var k in this.model.views){
            console.log('k', k, typeof k)
            var view = await this.model.views[k];
            if (view.isLeader){
                hasLeader = view.isLeader
                break
            }
        }
        console.log("hasLeader or not?", hasLeader)
        if (!hasLeader){
            for (var k in this.model.views){
                var view = await this.model.views[k]
                console.log("Assign leader", view)
                view.isLeader = true
                hasLeader = true
                break
            }
            console.log("Done Assign leader")
        }

        console.log('Is this Leader or not??', this.isLeader)
        if (!this.isLeader){
            for (var k in this.model.views){
                var view = await this.model.views[k];
                if (view.isLeader){
                    console.log("Calling setState")
                    var data = await view.plugin.state.getSnapshot()
                    await this.plugin.state.setSnapshot(
                        data
                    )
                    break
                }
            }
        }
    },

    handleSignals(){
        var that = this
        this.container.addEventListener('mouseover', function(e) {
            that._focused = 1;
            e; // linter
            that.mouseOverDisplay('block')
        }, false);

        this.container.addEventListener('mouseout', function(e) {
            that._focused = 0;
            e; // linter
            that.mouseOverDisplay('none')
        }, false);
    },

    async finalizeDisplay(){
      this.send({
          'type': 'request_loaded',
          'data': true
      })
    },
    // from molstar: https://github.com/molstar/molstar/blob/d1e17785b8404eec280ad04a6285ad9429c5c9f3/src/apps/viewer/app.ts#L219-L223
    async loadStructureFromData(data: string | number[], format: BuiltInTrajectoryFormat, preset?, options?: { dataLabel?: string }) {
        const _data = await this.plugin.builders.data.rawData({ data, label: options?.dataLabel });
        const trajectory = await this.plugin.builders.structure.parseTrajectory(_data, format);
        if (preset){
            console.log("Calling loadStructureFromData with preset", preset)
            await this.plugin.builders.structure.hierarchy.applyPreset(trajectory, preset)
        } else {
            console.log('Calling loadStructureFromData without preset')
            const model = await this.plugin.builders.structure.createModel(trajectory)
            const structure = await this.plugin.builders.structure.createStructure(model)
            const all = await this.plugin.builders.structure.tryCreateComponentStatic(structure, 'all')
        }
    },

    // from molstar: https://github.com/molstar/molstar/blob/d1e17785b8404eec280ad04a6285ad9429c5c9f3/src/apps/viewer/app.ts#L219-L223
    // this method is taken from the Viewer class
    loadPdb(pdb) {    
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

            switch (msg.target) {
                case 'Widget':
                    func = this[msg.methodName];
                    if (func) {
                        func.apply(this, new_args);
                    } else {
                        // send error message to Python?
                        console.log('Can not create func for ' + msg.methodName);
                    }
                    break;
            }
        } else if (msg.type == 'binary_single') {
            var coordinateMeta = msg.data;
            var coordinates
            var i, traj_index;
            var keys = Object.keys(coordinateMeta);

            for (i = 0; i < keys.length; i++) {
                traj_index = keys[i];
                coordinates = new Float32Array(msg.buffers[i].buffer);
                if (coordinates.byteLength > 0) {
                    this.updateCoordinates(coordinates, traj_index);
                }
            }
        }

    },

    handleEmbed(){
        var snaphShot = this.model.get("molstate")
        this.setState(snaphShot)
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

    updateCoordinates(coordinates, modelIndex) {
        // coordinates must be ArrayBuffer (use this.decode_base64)
        // var component = ? // FIXME: update
        var component = 0 // FIXME
        if (coordinates && typeof component != 'undefined') {
            var coords = new Float32Array(coordinates);
            // FIXME: update
        }
    },

    exportImage(modelId){
        this.plugin.helpers.viewportScreenshot.getImageDataUri().then(function(data){
            data = data.replace("data:image/png;base64,", "")
            var msg = {"type": "exportImage", "data": data, "model_id": modelId}
            this.send(msg)
        }.bind(this))
    },

    downloadState(){
        PluginCommands.State.Snapshots.DownloadToFile(this.plugin, { type: 'json' })
    },

    async getState(){
        // FIXME: rename function?
        if (this.isLeader){
            console.log("getState from master view")
            var data = this.plugin.state.getSnapshot()
            console.log(typeof data, data)
            this.model.set("molstate", data)
            this.touch()
        }
    },

    async setState(data){
        console.log('setState called')
        console.log(data)
        await this.plugin.state.setSnapshot(data)
    },

    // representation
    addRepresentation(params, modelIndex){
        representation.addRepresentation(this.plugin, params, modelIndex)
    },

    removeRepresentation(modelIndex){
        var st = this.plugin.managers.structure.hierarchy.current.structures[modelIndex]
        this.plugin.managers.structure.component.removeRepresentations(st.components)
    },

    // camera
    resetCamera(){
        PluginCommands.Camera.Reset(this.plugin, {})
    },

    setCamera(params){
        var durationMs = 0.0
        this.plugin.canvas3d.requestCameraReset({durationMs, params})
    },

    getCamera(){
        var snapshot = this.plugin.canvas3d.camera.getSnapshot()
        this.send({"type": "getCamera", "data": snapshot})
    },

    syncCamera(){
        // From NGLVIEW
        var that = this
        if (that._synced_model_ids.length > 0 && that._focused){
            that._synced_model_ids.forEach(async function(mid){
                var model = await that.model.widget_manager.get_model(mid)
                for (var k in model.views){
                    var pview = model.views[k];
                    var view = await model.views[k]
                    if !(view == that){
                        view.setCamera(that.plugin.canvas3d.camera.getSnapshot())
                    }
                }
            })
        }
    },
});


module.exports = {
    MolstarModel: MolstarModel,
    MolstarView: MolstarView,
};
