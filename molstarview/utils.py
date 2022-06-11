from pathlib import Path
import ipywidgets.embed
import ipywidgets
from ipywidgets import DOMWidget


def write_html(fp, views):
    views = isinstance(views, DOMWidget) and [views] or views
    embed = ipywidgets.embed
    snippet = embed.embed_snippet(views)
    html_code = embed.html_template.format(title='nglview-demo',
                                           snippet=snippet)

    Path(fp).write_text(html_code)
