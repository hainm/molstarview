import ipywidgets as widgets
from traitlets import Unicode
import base64

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

    def render_image(self):
        image = widgets.Image()
        self._js(f"this.exportImage('image.model_id')")
        # image.value will be updated in _molview_handle_message
        return image

    def _molview_handle_message(self, widget, msg, buffers):
        msg_type = msg.get("type")
        data = msg.get("data")
        if msg_type == "exportImage":
            image = widgets.Widget.widgets[msg.get("model_id")]
            image.value = base64.b64decode(data)

    def _js(self, code, **kwargs):
        # nglview code
        self._remote_call('executeCode',
                          target='Widget',
                          args=[code],
                          **kwargs)

    def _remote_call(self,
                     method_name,
                     target='Widget',
                     args=None,
                     kwargs=None,
                     **other_kwargs):

        # adapted from nglview
        msg = self._get_remote_call_msg(method_name,
                                        target=target,
                                        args=args,
                                        kwargs=kwargs,
                                        **other_kwargs)
        self.send(msg)

    def _get_remote_call_msg(self,
                             method_name,
                             target='Widget',
                             args=None,
                             kwargs=None,
                             **other_kwargs):
        # adapted from nglview
        msg = {}
        msg['target'] = target
        msg['type'] = 'call_method'
        msg['methodName'] = method_name
        msg['args'] = args
        msg['kwargs'] = kwargs
        return msg
