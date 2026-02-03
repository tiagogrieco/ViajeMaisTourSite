
path = "/home/seenuseenu/projects/ViajeMaisTourSite/src/data/blogData.ts"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()
    print("Last 10 lines:")
    for line in lines[-10:]:
        print(line, end="")
