# Aedes Breeding Habitat Detection

## Project context

TODO: paste the full project context doc here.

## Layout

- `data/raw/` — Roboflow YOLOv8 export of the drone imagery dataset (gitignored). Keep `data.yaml`, `train/`, `valid/`, `test/` as-is; don't rename anything.
  - 5 classes: `cocunut_shell` (sic), `drum`, `other_containers`, `tire`, `water_tank`
- `models/` — trained weights (gitignored)
- `app/` — `risk.py`, `weather.py`, `sites.py`, `dashboard.py` (Streamlit)

## Stack

ultralytics, sahi, pandas, requests, streamlit, folium, streamlit-folium (see `requirements.txt`).
