import os
import uuid
from pathlib import Path
# From nglview


class Structure:
    """abstract base class
    """

    def __init__(self):
        self.ext = "pdb"
        self.params = {}
        self.id = str(uuid.uuid4())

    def get_structure_string(self):
        raise NotImplementedError()


class Trajectory(Structure):
    """abstract base class
    """

    def __init__(self):
        super().__init__()
        self.id = str(uuid.uuid4())
        self.shown = True

    def get_coordinates(self, index):
        raise NotImplementedError()

    @property
    def n_frames(self):
        raise NotImplementedError()


class SimpletrajTrajectory(Trajectory):

    def __init__(self, path, structure_path):
        try:
            import simpletraj
        except ImportError:
            raise ImportError(
                "'SimpletrajTrajectory' requires the 'simpletraj' package")
        self.traj_cache = simpletraj.trajectory.TrajectoryCache()
        self.path = path
        self._structure_path = structure_path
        self.ext = os.path.splitext(structure_path)[1][1:]
        self.params = {}
        self.trajectory = None
        self.id = str(uuid.uuid4())
        try:
            self.traj_cache.get(os.path.abspath(self.path))
        except Exception as e:
            raise e

    def get_coordinates(self, index):
        traj = self.traj_cache.get(os.path.abspath(self.path))
        frame = traj.get_frame(index)
        return frame["coords"]

    def get_structure_string(self):
        return Path(self._structure_path).read_text()

    @property
    def n_frames(self):
        traj = self.traj_cache.get(os.path.abspath(self.path))
        return traj.numframes
