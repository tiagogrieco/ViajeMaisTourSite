@echo off
echo Repairing dependencies...
python -m pip install --force-reinstall pydantic pydantic-core google-genai requests
echo Done.
pause
