from os import mkdir
from os.path import dirname, abspath, join, exists


def build_dirname() -> str:
    root = dirname(dirname(abspath(__file__)))

    return join(root, "build")


def prepare_builddir() -> str:
    builddir = build_dirname()

    if not exists(builddir):
        mkdir(builddir)

    return builddir
