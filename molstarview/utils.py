import time
import threading
from pathlib import Path
import ipywidgets.embed
import ipywidgets
from ipywidgets import DOMWidget


def _run_on_another_thread(func, *args):
    thread = threading.Thread(
        target=func,
        args=args,
    )
    thread.daemon = True
    thread.start()
    return thread


def write_html(fp, views, wait=1.0):
    views = isinstance(views, DOMWidget) and [views] or views
    embed = ipywidgets.embed
    for view in views:
        if hasattr(view, '_js'):
            # Save state
            _run_on_another_thread(
                    view._js,
                    """
                    this.getState()
                    """)
    def func():
        # Wait for main thread to have molstate updated
        time.sleep(wait)
        snippet = embed.embed_snippet(views)
        html_code = embed.html_template.format(title='molstarview',
                                               snippet=snippet)
        Path(fp).write_text(html_code)
    _run_on_another_thread(func)
