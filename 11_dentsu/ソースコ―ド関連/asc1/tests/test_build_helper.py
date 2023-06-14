from os.path import exists
from build_helper import build_dirname, prepare_builddir


def test_build_dirname() -> None:
    assert build_dirname().endswith("build"), "build_dirname() does not end with build"


def test_prepare_builddir() -> None:
    builddir = prepare_builddir()
    assert exists(builddir), "prepare_builddir() does not make build directory"

    try:
        prepare_builddir()
    except Exception:
        assert False, "prepare_builddir() throw Exception when the directory exists"
