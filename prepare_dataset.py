"""Leak-free re-split of the Roboflow export.

- Tiles are grouped by original photo (everything before "_tile_").
- Photos are grouped into blocks of 10 consecutive shots (overlapping shots stay together).
- All SEAG photos are held out as a "new_area" set.
- Remaining blocks are split ~75/12/13 into train/val/test with a fixed seed.

Usage: python3 prepare_dataset.py [--raw data/raw] [--out data/split] [--background DIR]
"""
import argparse, random, re, shutil
from collections import defaultdict
from pathlib import Path

IMG_EXT = {".jpg", ".jpeg", ".png"}
# Nearly all coconut shells come from one flight (DJI_0813-0825). Pin its second half
# (DJI_0820-0829) to test so the class is evaluated at all. Note: 0819/0820 are adjacent shots.
FORCE_TEST = {"DJI_82"}


def photo_id(name):
    return name.split("_tile_")[0] if "_tile_" in name else name.split(".rf.")[0]


def block_key(pid, org_order):
    if pid.startswith("SEAG"):
        return "new_area"
    m = re.match(r"DJI_(\d{14})_(\d+)_V$", pid)      # DJI_<timestamp>_<shot>_V
    if m:
        return f"DJIV_{int(m.group(2)) // 10}"
    m = re.match(r"DJI_(\d+)$", pid)                   # DJI_<shot>
    if m:
        return f"DJI_{int(m.group(1)) // 10}"
    if pid.startswith("org_"):                         # org_<hash>_<timestamp>, order by time
        return f"org_{org_order[pid] // 10}"
    return f"misc_{pid}"                               # GoPro / misc: each photo its own group


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--raw", default="data/raw")
    ap.add_argument("--out", default="data/split")
    ap.add_argument("--background", default=None, help="folder of empty images to add to train")
    ap.add_argument("--seed", type=int, default=42)
    a = ap.parse_args()
    raw, out = Path(a.raw), Path(a.out)

    # collect all image/label pairs, ignoring the original split
    items = []
    for img in raw.glob("*/images/*"):
        if img.suffix.lower() in IMG_EXT:
            items.append((img, img.parent.parent / "labels" / (img.stem + ".txt")))
    assert items, f"no images found under {raw}"

    pids = sorted({photo_id(i.name) for i, _ in items})
    org = sorted((p for p in pids if p.startswith("org_")), key=lambda p: int(p.split("_")[-1]))
    org_order = {p: k for k, p in enumerate(org)}

    blocks = defaultdict(list)
    for img, lab in items:
        blocks[block_key(photo_id(img.name), org_order)].append((img, lab))

    keys = sorted(k for k in blocks if k != "new_area")
    random.Random(a.seed).shuffle(keys)
    total = sum(len(blocks[k]) for k in keys)
    split_of, n = {}, 0
    for k in keys:
        if k in FORCE_TEST:
            split_of[k] = "test"; continue
    for k in [k for k in keys if k not in FORCE_TEST]:  # fill by tile count so ratios hold even with uneven block sizes
        frac = n / total
        split_of[k] = "train" if frac < 0.75 else "val" if frac < 0.87 else "test"
        n += len(blocks[k])
    split_of["new_area"] = "new_area"

    if out.exists():
        shutil.rmtree(out)
    counts, photos_in = defaultdict(int), defaultdict(set)
    missing = 0
    for k, its in blocks.items():
        s = split_of[k]
        (out / s / "images").mkdir(parents=True, exist_ok=True)
        (out / s / "labels").mkdir(parents=True, exist_ok=True)
        for img, lab in its:
            shutil.copy2(img, out / s / "images" / img.name)
            dst = out / s / "labels" / (img.stem + ".txt")
            if lab.exists():
                shutil.copy2(lab, dst)
            else:
                dst.write_text(""); missing += 1
            counts[s] += 1
            photos_in[s].add(photo_id(img.name))

    if a.background:
        bg = [p for p in Path(a.background).iterdir() if p.suffix.lower() in IMG_EXT]
        for p in bg:
            shutil.copy2(p, out / "train" / "images" / f"bg_{p.name}")
            (out / "train" / "labels" / f"bg_{p.stem}.txt").write_text("")
        counts["train"] += len(bg)
        print(f"added {len(bg)} background images to train")

    names = ["cocunut_shell", "drum", "other_containers", "tire", "water_tank"]  # order from Roboflow data.yaml
    (out / "data.yaml").write_text(
        f"path: {out.resolve()}\ntrain: train/images\nval: val/images\ntest: test/images\n"
        f"new_area: new_area/images\nnc: {len(names)}\nnames: {names}\n")

    splits = ["train", "val", "test", "new_area"]
    for i, s in enumerate(splits):
        for t in splits[i + 1:]:
            assert not (photos_in[s] & photos_in[t]), f"photo leak between {s} and {t}"
    for s in splits:
        print(f"{s:9s} {counts[s]:5d} tiles  {len(photos_in[s]):4d} photos")
    print(f"missing label files (written empty): {missing}")
    print("zero photo overlap between splits: OK")
    print(f"wrote {out / 'data.yaml'}")


if __name__ == "__main__":
    main()
