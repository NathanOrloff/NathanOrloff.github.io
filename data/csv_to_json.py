import math
from geojson.feature import Feature
import pandas as pd
import json
import h3
import geojson
import colorsys
import sys

#gets the hexadecimal color of the hexagon based on the income range, and the current income value
def get_color(income, max, min):
    mean_range = max - min
    percent = round((income * 1.0) / mean_range, 3) #where does the current income lie within the total range
    hue = ((percent) * 120) #hls value where lower values associated with red colors, and higher numbers associated with green colors, max number is 120
    rgbs = colorsys.hls_to_rgb(hue / 360, 0.5, 1) #hls to rgb
    hexs = '#%02x%02x%02x'%(round(rgbs[0]*255),round(rgbs[1]*255),round(rgbs[2]*255)) #rgb to hex
    return hexs


df = pd.read_csv('kaggle_income.csv', encoding="ISO-8859-1") #read csv

js = df.to_json(orient="records")


parsed = json.loads(js)

data_store = {}
avg_store = {}
avg_store_geo = geojson.FeatureCollection(features=[])

max_value = 0
min_value = 9999999
for datapoint in parsed: #for each data point
    for i in range(16): #for each hexagon resolution level
        h3_val = h3.geo_to_h3(float(datapoint["Lat"]), float(datapoint["Lon"]), i) +str(i) #get the h3 indicator value
        #bin based on h3 value
        if h3_val not in data_store.keys(): 
            data_store.update({h3_val : []})
        data_store[h3_val].append(datapoint)

        #find max and min values for the range
        if (datapoint["Mean"] > max_value):
            max_value = datapoint["Mean"]
        if (datapoint["Mean"] < min_value):
            min_value = datapoint["Mean"]



crossfilter_data = []

for datapoint in data_store: #add each map to array, helps for crossfilter used in js file
    crossfilter_data.append({datapoint: data_store.get(datapoint)})
        

for group in crossfilter_data: #all datapoints within the same hexagon
    mean = 0
    mean_counter = 0
    stdev = 0
    stdev_counter = 0
    key = list(group.keys())[0]

    #find average income for hexagon
    for data in group[key]:
        mean += data["Mean"]
        mean_counter += 1
    
    mean /= mean_counter

    #find standard deviation of incomes in hexagon
    for data in group[key]:
        stdev += math.pow((data["Mean"] - mean), 2)
        stdev_counter += 1

    stdev /= stdev_counter
    
    stdev = math.sqrt(stdev)

    #get hexagon color
    color = get_color(mean, max_value, min_value)

    #store data as a geojson feature
    data_geo = geojson.Feature(geometry=geojson.Polygon(h3.h3_to_geo_boundary(key[0:15], True)), properties={"Key" : key[0:15], "Resolution" : int(key[15:]), "Lat" : h3.h3_to_geo(key[0:15])[0], "Lon" : h3.h3_to_geo(key[0:15])[1], "Mean" : mean, "Stdev" : stdev, "Color" : color})
    data_geo["geometry"]["coordinates"] = [data_geo["geometry"]["coordinates"]]
    avg_store_geo["features"].append(data_geo)

    data = {"Lat" : h3.h3_to_geo(key[0:15])[0], "Lon" : h3.h3_to_geo(key[0:15])[1], "Mean" : mean, "Stdev" : stdev}
    avg_store.update({key : data})

crossfilter_data_avg = []

for group in avg_store:
    crossfilter_data_avg.append({group : avg_store.get(group)})


#dump data into files, main file used is .geojson file 
# with open('kaggle_income.json', 'w', encoding='utf-8') as f:
#     json.dump(crossfilter_data, f, ensure_ascii=False, indent=4)

# with open('kaggle_income_avg.json', 'w', encoding='utf-8') as f:
#     json.dump(crossfilter_data_avg, f, ensure_ascii=False, indent=4)

file_num = 0
temp_arr = []
for feat in avg_store_geo["features"]:
    
    temp_arr.append(feat)
    if sys.getsizeof(temp_arr) >= 140000:
        with open('./split_data/kaggle_income_avg_geo' + str(file_num) + '.geojson' , 'w', encoding='utf-8') as f:
            json.dump(temp_arr, f, ensure_ascii=False, indent=4)
        temp_arr = []
        file_num += 1
if len(temp_arr) > 0:
    with open('./split_data/kaggle_income_avg_geo' + str(file_num) + '.geojson', 'w', encoding='utf-8') as f:
        json.dump(temp_arr, f, ensure_ascii=False, indent=4)
    temp_arr = []
    file_num += 1







