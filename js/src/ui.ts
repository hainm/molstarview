// From molstar
// https://github.com/molstar/molstar/blob/d1e17785b8404eec280ad04a6285ad9429c5c9f3/src/apps/viewer/app.ts#L118-L170

import { ANVILMembraneOrientation } from 'molstar/lib/extensions/anvil/behavior';
import { CellPack } from 'molstar/lib/extensions/cellpack';
import { DnatcoConfalPyramids } from 'molstar/lib/extensions/dnatco';
import { G3DFormat, G3dProvider } from 'molstar/lib/extensions/g3d/format';
import { GeometryExport } from 'molstar/lib/extensions/geo-export';
import { MAQualityAssessment } from 'molstar/lib/extensions/model-archive/quality-assessment/behavior';
import { QualityAssessmentPLDDTPreset, QualityAssessmentQmeanPreset } from 'molstar/lib/extensions/model-archive/quality-assessment/behavior';
import { QualityAssessment } from 'molstar/lib/extensions/model-archive/quality-assessment/prop';
import { ModelExport } from 'molstar/lib/extensions/model-export';
// import { Mp4Export } from 'molstar/lib/extensions/mp4-export';
import { PDBeStructureQualityReport } from 'molstar/lib/extensions/pdbe';
import { RCSBAssemblySymmetry, RCSBValidationReport } from 'molstar/lib/extensions/rcsb';
import { ZenodoImport } from 'molstar/lib/extensions/zenodo';
import { Volume } from 'molstar/lib/mol-model/volume';
import { DownloadStructure, PdbDownloadProvider } from 'molstar/lib/mol-plugin-state/actions/structure';
import { DownloadDensity } from 'molstar/lib/mol-plugin-state/actions/volume';
import { PresetTrajectoryHierarchy } from 'molstar/lib/mol-plugin-state/builder/structure/hierarchy-preset';
import { PresetStructureRepresentations, StructureRepresentationPresetProvider } from 'molstar/lib/mol-plugin-state/builder/structure/representation-preset';
import { DataFormatProvider } from 'molstar/lib/mol-plugin-state/formats/provider';
import { BuiltInTopologyFormat } from 'molstar/lib/mol-plugin-state/formats/topology';
import { BuiltInCoordinatesFormat } from 'molstar/lib/mol-plugin-state/formats/coordinates';
import { BuiltInTrajectoryFormat } from 'molstar/lib/mol-plugin-state/formats/trajectory';
import { BuildInVolumeFormat } from 'molstar/lib/mol-plugin-state/formats/volume';
import { createVolumeRepresentationParams } from 'molstar/lib/mol-plugin-state/helpers/volume-representation-params';
import { PluginStateObject } from 'molstar/lib/mol-plugin-state/objects';
import { StateTransforms } from 'molstar/lib/mol-plugin-state/transforms';
import { TrajectoryFromModelAndCoordinates } from 'molstar/lib/mol-plugin-state/transforms/model';
import { createPluginUI } from 'molstar/lib/mol-plugin-ui/react18';
import { PluginUIContext } from 'molstar/lib/mol-plugin-ui/context';
import { DefaultPluginUISpec, PluginUISpec } from 'molstar/lib/mol-plugin-ui/spec';
import { PluginCommands } from 'molstar/lib/mol-plugin/commands';
import { PluginConfig } from 'molstar/lib/mol-plugin/config';
import { PluginLayoutControlsDisplay } from 'molstar/lib/mol-plugin/layout';
import { PluginSpec } from 'molstar/lib/mol-plugin/spec';
import { PluginState } from 'molstar/lib/mol-plugin/state';
import { StateObjectRef, StateObjectSelector } from 'molstar/lib/mol-state';
import { Asset } from 'molstar/lib/mol-util/assets';
import { Color } from 'molstar/lib/mol-util/color';
import { ObjectKeys } from 'molstar/lib/mol-util/type-helpers';

export { PLUGIN_VERSION as version } from 'molstar/lib/mol-plugin/version';
export { setDebugMode, setProductionMode, setTimingMode } from 'molstar/lib/mol-util/debug';
const defaultSpec = DefaultPluginUISpec();
const CustomFormats = [
    ['g3d', G3dProvider] as const
];

const Extensions = {
    'cellpack': PluginSpec.Behavior(CellPack),
    'dnatco-confal-pyramids': PluginSpec.Behavior(DnatcoConfalPyramids),
    'pdbe-structure-quality-report': PluginSpec.Behavior(PDBeStructureQualityReport),
    'rcsb-assembly-symmetry': PluginSpec.Behavior(RCSBAssemblySymmetry),
    'rcsb-validation-report': PluginSpec.Behavior(RCSBValidationReport),
    'anvil-membrane-orientation': PluginSpec.Behavior(ANVILMembraneOrientation),
    'g3d': PluginSpec.Behavior(G3DFormat),
    'model-export': PluginSpec.Behavior(ModelExport),
    // 'mp4-export': PluginSpec.Behavior(Mp4Export),
    'geo-export': PluginSpec.Behavior(GeometryExport),
    'ma-quality-assessment': PluginSpec.Behavior(MAQualityAssessment),
    'zenodo-import': PluginSpec.Behavior(ZenodoImport),
};

const DefaultViewerOptions = {
    customFormats: CustomFormats as [string, DataFormatProvider][],
    extensions: ObjectKeys(Extensions),
    layoutIsExpanded: true,
    layoutShowControls: true,
    layoutShowRemoteState: false,
    layoutControlsDisplay: 'reactive' as PluginLayoutControlsDisplay,
    layoutShowSequence: false,
    layoutShowLog: false,
    layoutShowLeftPanel: true,
    collapseLeftPanel: true,
    collapseRightPanel: true,
    disableAntialiasing: PluginConfig.General.DisableAntialiasing.defaultValue,
    pixelScale: PluginConfig.General.PixelScale.defaultValue,
    pickScale: PluginConfig.General.PickScale.defaultValue,
    pickPadding: PluginConfig.General.PickPadding.defaultValue,
    enableWboit: PluginConfig.General.EnableWboit.defaultValue,
    preferWebgl1: PluginConfig.General.PreferWebGl1.defaultValue,
    viewportShowExpand: PluginConfig.Viewport.ShowExpand.defaultValue,
    viewportShowControls: PluginConfig.Viewport.ShowControls.defaultValue,
    viewportShowSettings: PluginConfig.Viewport.ShowSettings.defaultValue,
    viewportShowSelectionMode: PluginConfig.Viewport.ShowSelectionMode.defaultValue,
    viewportShowAnimation: PluginConfig.Viewport.ShowAnimation.defaultValue,
    pluginStateServer: PluginConfig.State.DefaultServer.defaultValue,
    volumeStreamingServer: PluginConfig.VolumeStreaming.DefaultServer.defaultValue,
    volumeStreamingDisabled: !PluginConfig.VolumeStreaming.Enabled.defaultValue,
    pdbProvider: PluginConfig.Download.DefaultPdbProvider.defaultValue,
    emdbProvider: PluginConfig.Download.DefaultEmdbProvider.defaultValue,
};
type ViewerOptions = typeof DefaultViewerOptions;



export const ViewerAutoPreset = StructureRepresentationPresetProvider({
    id: 'preset-structure-representation-viewer-auto',
    display: {
        name: 'Automatic (w/ Annotation)', group: 'Annotation',
        description: 'Show standard automatic representation but colored by quality assessment (if available in the model).'
    },
    isApplicable(a) {
        return (
            !!a.data.models.some(m => QualityAssessment.isApplicable(m, 'pLDDT')) ||
            !!a.data.models.some(m => QualityAssessment.isApplicable(m, 'qmean'))
        );
    },
    params: () => StructureRepresentationPresetProvider.CommonParams,
    async apply(ref, params, plugin) {
        const structureCell = StateObjectRef.resolveAndCheck(plugin.state.data, ref);
        const structure = structureCell?.obj?.data;
        if (!structureCell || !structure) return {};

        if (!!structure.models.some(m => QualityAssessment.isApplicable(m, 'pLDDT'))) {
            return await QualityAssessmentPLDDTPreset.apply(ref, params, plugin);
        } else if (!!structure.models.some(m => QualityAssessment.isApplicable(m, 'qmean'))) {
            return await QualityAssessmentQmeanPreset.apply(ref, params, plugin);
        } else {
            return await PresetStructureRepresentations.auto.apply(ref, params, plugin);
        }
    }
});

const definedOptions = {}
const o: ViewerOptions = { ...DefaultViewerOptions, ...definedOptions };

export
const basicSpec: PluginUISpec = {
    actions: defaultSpec.actions,
    behaviors: [
        ...defaultSpec.behaviors,
        ...o.extensions.map(e => Extensions[e]),
    ],
    animations: [...defaultSpec.animations || []],
    customParamEditors: defaultSpec.customParamEditors,
    customFormats: o?.customFormats,
    layout: {
        initial: {
            isExpanded: false,
            showControls: false,
            controlsDisplay: o.layoutControlsDisplay,
            regionState: {
                bottom: 'full',
                left: o.collapseLeftPanel ? 'collapsed' : 'full',
                right: o.collapseRightPanel ? 'hidden' : 'full',
                top: 'full',
            }
        },
    },
    components: {
        ...defaultSpec.components,
        controls: {
            ...defaultSpec.components?.controls,
            top: o.layoutShowSequence ? undefined : 'none',
            bottom: o.layoutShowLog ? undefined : 'none',
            left: o.layoutShowLeftPanel ? undefined : 'none',
        },
        remoteState: o.layoutShowRemoteState ? 'default' : 'none',
    },
    config: [
        [PluginConfig.General.DisableAntialiasing, o.disableAntialiasing],
        [PluginConfig.General.PixelScale, o.pixelScale],
        [PluginConfig.General.PickScale, o.pickScale],
        [PluginConfig.General.PickPadding, o.pickPadding],
        [PluginConfig.General.EnableWboit, o.enableWboit],
        [PluginConfig.General.PreferWebGl1, o.preferWebgl1],
        [PluginConfig.Viewport.ShowExpand, o.viewportShowExpand],
        [PluginConfig.Viewport.ShowControls, o.viewportShowControls],
        [PluginConfig.Viewport.ShowSettings, o.viewportShowSettings],
        [PluginConfig.Viewport.ShowSelectionMode, o.viewportShowSelectionMode],
        [PluginConfig.Viewport.ShowAnimation, o.viewportShowAnimation],
        [PluginConfig.State.DefaultServer, o.pluginStateServer],
        [PluginConfig.State.CurrentServer, o.pluginStateServer],
        [PluginConfig.VolumeStreaming.DefaultServer, o.volumeStreamingServer],
        [PluginConfig.VolumeStreaming.Enabled, !o.volumeStreamingDisabled],
        [PluginConfig.Download.DefaultPdbProvider, o.pdbProvider],
        [PluginConfig.Download.DefaultEmdbProvider, o.emdbProvider],
        [PluginConfig.Structure.DefaultRepresentationPreset, ViewerAutoPreset.id],
    ]
};

