import json

def get_color(rating: str) -> str:
    color_map = {
        "A": "bg-[#d4403a]",
        "B": "bg-[#d85d49]", "C": "bg-[#d85d49]",
        "D": "bg-[#d37451]", "E": "bg-[#d37451]",
        "F": "bg-[#d89260]", "G": "bg-[#d89260]", "H": "bg-[#d89260]",
        "I": "bg-[#dab16f]", "J": "bg-[#dab16f]", "K": "bg-[#dab16f]",
        "L": "bg-[#cab870]", "M": "bg-[#cab870]", "N": "bg-[#cab870]",
        "O": "bg-[#acb16c]", "P": "bg-[#acb16c]", "Q": "bg-[#acb16c]",
        "R": "bg-[#92ae6a]", "S": "bg-[#92ae6a]", "T": "bg-[#92ae6a]",
        "U": "bg-[#73a464]", "V": "bg-[#73a464]", "W": "bg-[#73a464]",
        "X": "bg-[#569d5e]", "Y": "bg-[#569d5e]", "Z": "bg-[#569d5e]",
    }
    return color_map.get(rating, "bg-[#D3CAB7]")

def bottom_border(x: int, y: int) -> bool:
    borders = {
        12: [(27, 67)],
        14: [(11, 26)],
        18: [(27, 41)],
        19: [(68, 95)],
        26: [(11, 15)],
        28: [(16, 33)],
        29: [(1, 10)],
        32: [(42, 71)],
        34: [(85, 101)],
        36: [(72, 84)],
        41: [(14, 33)],
        43: [(68, 79)],
        47: [(80, 101)],
        48: [(1, 19), (30, 58)],
        54: [(45, 67)],
        60: [(20, 35)],
        61: [(75, 101)],
        65: [(1, 19)],
        67: [(36, 60)],
        71: [(1, 10), (61, 74)],
        74: [(36, 50)],
        77: [(20, 35)],
        81: [(75, 88)],
        85: [(11, 24), (86, 101)],
        86: [(51, 60)],
        93: [(11, 50), (61, 74)],
    }
    return any(start <= x <= end for start, end in borders.get(y, []))

def right_border(x: int, y: int) -> bool:
    borders = {
        10: [(1, 28), (71, 101)],
        13: [(41, 47)],
        15: [(26, 40)],
        19: [(48, 76)],
        24: [(77, 84)],
        26: [(12, 17)],
        29: [(48, 59)],
        32: [(1, 11)],
        33: [(18, 48)],
        35: [(60, 92)],
        40: [(93, 101)],
        41: [(18, 47)],
        44: [(54, 66)],
        49: [(12, 31)],
        50: [(74, 92)],
        51: [(48, 53)],
        58: [(32, 47)],
        60: [(67, 92)],
        67: [(12, 31), (43, 70)],
        69: [(93, 101)],
        71: [(32, 42)],
        74: [(61, 92)],
        77: [(1, 18)],
        79: [(43, 60)],
        84: [(34, 35)],
        85: [(81, 101)],
        87: [(19, 33)],
        88: [(61, 80)],
        95: [(1, 18)],
    }
    return any(start <= y <= end for start, end in borders.get(x, []))

with open("scripts/cabins/original_cabins.json", "r") as file:
    data = json.load(file)

result = []
for item in data:
    cabin = item["721"]["d4e087164acf8314f1203f0b0996f14908e2a199a296d065f14b8b09"]
    id = list(cabin.keys())[0]
    x = int(cabin[id]["X Coordinate"])
    y = int(cabin[id]["Y Coordinate"])
    size = cabin[id]["Cabin Size"]
    rating = cabin[id]["SLVD Rating"]
    streetAddress, slvd = cabin[id]["name"].split(",")
    district = cabin[id]["District"]

    result.append(
        {
            "id": id,
            "x": x,
            "y": y,
            "size": size,
            "rating": rating,
            "streetAddress": streetAddress,
            "slvd": slvd.strip(),
            "district": district,
            "color": get_color(rating),
            "bottom_border": bottom_border(x, y),
            "right_border": right_border(x, y),
            "col_span": "col-span-1",
            "row_span": "row-span-1",
        }
    )

# add the "empty" landmark spots to the result
with open("scripts/cabins/empty_spots.json", "r") as file:
    result.extend(json.load(file))
import pandas as pd
df = pd.DataFrame(result)

# add distributions to the result
with open("scripts/cabins/landmark_distributions.json", "r") as file:
    distributions = pd.DataFrame(json.load(file))
df = pd.merge(df, distributions, on=["x", "y"], how="left")
df["distribution"] = df["distribution"].fillna(0.00)

# sort by grid index and save as json
df["grid_index"] = ((101 - df["y"]) * 101) + (df["x"] - 101)
df.sort_values(by=["grid_index"]).drop("grid_index", axis=1).to_json("scripts/cabins/updated_cabins.json", orient="records")
