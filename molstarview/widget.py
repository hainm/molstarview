import threading
import base64
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
    value = Unicode('<Dummy>!').tag(sync=True)
    frame = Integer().tag(sync=True)

    def __init__(self):
        super().__init__()
        self._handle_msg_thread = threading.Thread(
            target=self.on_msg, args=(self._molview_handle_message, ))
        # register to get data from JS side
        self._handle_msg_thread.daemon = True
        self._handle_msg_thread.start()
        self._trajlist = []

    def render_image(self):
        image = widgets.Image()
        self._js(f"this.exportImage('{image.model_id}')")
        # image.value will be updated in _molview_handle_message
        return image

    def _load_structure_data(self, data: str, format: str = 'pdb'):
        self._remote_call("loadStructureFromData",
                          target="Widget",
                          args=[data, format])

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

    def add_trajectory(self, trajectory):
        self._load_structure_data(trajectory.get_structure_string(),
                                  'pdb')  # FIXME
        self._trajlist.append(trajectory)
        self._update_max_frame()
        self._molstar_component_ids.append(trajectory.id)

    def _update_max_frame(self):
        self.max_frame = max(
            int(traj.n_frames) for traj in self._trajlist
            if hasattr(traj, 'n_frames')) - 1 # index starts from 0

    def _set_coordinates(self, index):
        '''update coordinates for all trajectories at index-th frame
        '''
        if self._trajlist:
            coordinates_dict = {}
            for trajectory in self._trajlist:
                traj_index = self._molstar_component_ids.index(trajectory.id)
                try:
                    coordinates_dict[traj_index] = trajectory.get_coordinates(
                        index)
                except (IndexError, ValueError):
                    coordinates_dict[traj_index] = np.empty((0), dtype='f4')
            self._send_coordinates(coordinates_dict)

    def _send_coordinates(self, arr_dict):
        self._coordinates_dict = arr_dict

        buffers = []
        coordinates_meta = dict()
        for index, arr in self._coordinates_dict.items():
            buffers.append(arr.astype('f4').tobytes())
            coordinates_meta[index] = index
        msg = {
            'type': 'binary_single',
            'data': coordinates_meta,
        }
        if movie_making:
            msg['movie_making'] = movie_making
            msg['render_params'] = render_params

        self.send(msg, buffers=buffers)

    @observe('frame')
    def _on_frame_changed(self, change):
        """set and send coordinates at current frame
        """
        self._set_coordinates(self.frame)
