#!/usr/bin/env python3
import sys
from pathlib import Path


def main() -> int:
    runner = Path(__file__).with_name("run-gptoss-test-maintenance.py")
    argv = [
        sys.executable,
        str(runner),
        "--constraint",
        "Keep assertions specific enough to detect the changed tuple too_big error detail.",
        *sys.argv[1:],
    ]
    return __import__("subprocess").call(argv)


if __name__ == "__main__":
    sys.exit(main())
