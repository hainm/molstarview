from __future__ import print_function
from setuptools import setup, find_packages
import os
from os.path import join as pjoin
from distutils import log
from pathlib import Path

from jupyter_packaging import wrap_installers, get_data_files


here = os.path.dirname(os.path.abspath(__file__))
HERE = Path(__file__).parent.resolve()

name = 'molstarview'
LONG_DESCRIPTION = 'molstarview'

# Get molstarview version
version = '0.0.1'

js_dir = pjoin(here, 'js')

# Representative files that should exist after a successful build
jstargets = [
    pjoin(js_dir, 'dist', 'index.js'),
]

lab_path = (HERE / "molstarview" / "labextension")
nb_path = (HERE / "molstarview" / "nbextension")
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
    name=name,
    version=version,
    description='molstarview',
    long_description=LONG_DESCRIPTION,
    include_package_data=True,
    install_requires=[
        'ipywidgets>=7.6.0',
    ],
    packages=find_packages(),
    package_data={
        "molstarview.nbextension": ["*"],
        "molstarview.labextension": ["*"],
    },
    data_files=data_files,
    zip_safe=False,
    cmdclass=cmdclass,
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
    python_requires='>=3.7',
)

setup(**setup_args)
