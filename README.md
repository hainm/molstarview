# NOTHING TO SEE YET. PLEASE COME BACK LATER
# Codes are copied/adapted from nglview and molstar. Will update the licenses.

molstarview-widget
==================

- molstarview
- Similar package(s) that was bornt before `molstarview`:
    - https://github.com/janash/pymolstar

Installation
------------

To install use pip:

    $ pip install molstarview

For a development installation (requires [Node.js](https://nodejs.org) and [Yarn version 1](https://classic.yarnpkg.com/)),

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
