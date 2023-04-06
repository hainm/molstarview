# Usable but still "Work-in-progress"
# Codes are copied/adapted from nglview and molstar. Will update the licenses.

molstarview-widget
==================

- molstarview: See the `dev` branch for now.
- Similar package(s) that was bornt before `molstarview`:
    - https://github.com/janash/pymolstar

Example
-------

- Load structure and trajectory
- 
```python
from molstarview.widget import MolstarView
from nglview.adaptor import SimpletrajTrajectory
import nglview as nv

traj = SimpletrajTrajectory(nv.datafiles.XTC, nv.datafiles.PDB)
view = MolstarView()
view.add_trajectory(traj)

struc = nv.FileStructure('1tsu.pdb')
view.add_structure(struc)
view
```

Installation
------------


Only development installation is available (requires [Node.js](https://nodejs.org) and [Yarn version 1](https://classic.yarnpkg.com/)),

    $ git clone https://github.com/molstar/molstarview-widget.git
    $ cd molstarview-widget
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --overwrite --sys-prefix molstarview
    $ jupyter nbextension enable --py --sys-prefix molstarview

When actively developing your extension for JupyterLab, run the command:

    $ jupyter labextension develop --overwrite molstarview

Then you need to rebuild the JS when you make a code change:

    $ cd js
    $ yarn run build

You then need to refresh the JupyterLab page when your javascript changes.

# Acknowledgement
- Thanks [nglview](https://github.com/nglviewer/nglview) for its code.
- Thanks [David Sehnal](https://github.com/dsehnal) for answering all questions about `molstar`.
