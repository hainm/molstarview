export
// From molstar
// https://github.com/molstar/molstar/blob/d1e17785b8404eec280ad04a6285ad9429c5c9f3/src/apps/viewer/app.ts#L118-L170

import { DefaultPluginUISpec, PluginUISpec } from 'molstar/lib/mol-plugin-ui/spec'

const spec: PluginUISpec = {
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
            isExpanded: o.layoutIsExpanded,
            showControls: o.layoutShowControls,
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
