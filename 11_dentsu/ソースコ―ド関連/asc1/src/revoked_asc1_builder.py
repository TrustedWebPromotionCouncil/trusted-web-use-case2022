from os.path import join

from revoked_asc1 import approval_program, clear_state_program
from build_helper import prepare_builddir


def main() -> None:
    builddir = prepare_builddir()
    approval = approval_program()
    clear = clear_state_program()

    print(approval)
    print(clear)

    with open(
        join(builddir, "revoked_asc1_approval.teal"), mode="w", encoding="utf-8"
    ) as f:
        f.write(approval)

    with open(
        join(builddir, "revoked_asc1_clear.teal"), mode="w", encoding="utf-8"
    ) as f:
        f.write(clear)


if __name__ == "__main__":
    main()
