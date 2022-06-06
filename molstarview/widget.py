import ipywidgets as widgets
from traitlets import Unicode

# See js/lib/widget.js for the frontend counterpart to this file.

@widgets.register
class MolstarView(widgets.DOMWidget):
    # Name of the widget view class in front-end
    _view_name = Unicode('MolstarView').tag(sync=True)

    # Name of the widget model class in front-end
    _model_name = Unicode('MolstarModel').tag(sync=True)

    # Name of the front-end module containing widget view
    _view_module = Unicode('molstarview-widget').tag(sync=True)

    # Name of the front-end module containing widget model
    _model_module = Unicode('molstarview-widget').tag(sync=True)

    # Version of the front-end module containing widget view
    _view_module_version = Unicode('^0.1.0').tag(sync=True)
    # Version of the front-end module containing widget model
    _model_module_version = Unicode('^0.1.0').tag(sync=True)
    value = Unicode('Hello World!').tag(sync=True)
