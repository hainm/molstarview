from __future__ import print_function
from setuptools import setup, find_packages
import os
from os.path import join as pjoin
from distutils import log
from pathlib import Path
from jupyter_packaging import (
    get_version,
    wrap_installers,
    get_data_files,
)


here = os.path.dirname(os.path.abspath(__file__))
node_root = os.path.join(here, 'js')
is_repo = os.path.exists(os.path.join(here, '.git'))

log.set_verbosity(log.DEBUG)
log.info('setup.py entered')
log.info('$PATH=%s' % os.environ['PATH'])

def update_package_data(distribution):
    """update package_data to catch changes during setup"""
    build_py = distribution.get_command_obj('build_py')
    build_py.finalize_options()

HERE = Path(__file__).parent.resolve()
lab_path = (HERE / "molstarview" / "labextension")
nb_path = (HERE / "molstarview" / "nbextension")
assert (nb_path/"index.js").exists(), "index.js not found in %s. Make sure to build the frontend assets and install the JupyterLab extension." % nb_path
assert (lab_path/"package.json").exists(), "package.json not found in %s. Make sure to build the frontend assets and install the JupyterLab extension." % lab_path
labext_name = "molstarview-widget"
package_data_spec = {
    labext_name: ["*"],
}

data_files_spec = [
    ("share/jupyter/labextensions/%s" % labext_name, str(lab_path), "**"),
    ("share/jupyter/labextensions/%s" % labext_name, str(HERE), "install.json"),
    ("share/jupyter/nbextensions/%s" % labext_name, str(nb_path), "**"),
    ("etc/jupyter/nbconfig/notebook.d", str(HERE), "molstarview-widget.json"),
]

def pre_develop():
    pass

def pre_dist():
    pass

cmdclass = wrap_installers(pre_develop=pre_develop, pre_dist=pre_dist)
data_files = get_data_files(data_files_spec)

setup_args = dict(
    name='molstarview',
    version=get_version(pjoin('molstarview', '_version.py')),
    description='molstarview',
    long_description='molstarview',
    include_package_data=True,
    install_requires=[
        'ipywidgets>=7.6.0',
    ],
    packages=find_packages(),
    zip_safe=False,
    cmdclass=cmdclass,
    data_files=data_files,
    author='Hai Nguyen',
    author_email='hainm.comp@gmail.com',
    url='https://github.com/molstar/molstarview-widget',
    keywords=[
        'ipython',
        'jupyter',
        'widgets',
    ],
    classifiers=[
        'Development Status :: 4 - Beta',
        'Framework :: IPython',
        'Intended Audience :: Developers',
        'Intended Audience :: Science/Research',
        'Topic :: Multimedia :: Graphics',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
    ],
    use_scm_version=True,
    setup_requires=['setuptools_scm'],
)

setup(**setup_args)
