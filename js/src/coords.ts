import { TrajectoryFromModelAndCoordinates } from 'molstar/lib/mol-plugin-state/transforms/model'
// FIXME: Type annotation
export
async function updateModelCoordinates(plugin, coords, modelIndex){
    // Get the model
    var model = plugin.managers.structure.hierarchy.current.structures[modelIndex].model
    console.log("hello model", model)
    console.log('coords', coords)
    // Get the coords
    const data = await plugin.builders.data.rawData({data: coords}) // FIXME: "data" here should be string (e.g: content of pdb file)
    //console.log("hello data")
    //const provider = plugin.dataFormats.get("pdb")
    //coords = await provider!.parse(plugin, coords)
    //console.log("hello coords")
    //console.log("hello trajectory")
    //const trajectory = await plugin.build().toRoot()
    //    .apply(TrajectoryFromModelAndCoordinates, {
    //        modelRef: model.ref,
    //        coordinatesRef: coords.ref
    //    }, { dependsOn: [model.ref, coords.ref] })
    //    .commit()
    //
    //const preset = await plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default')
    //console.log("hello preset")
}
