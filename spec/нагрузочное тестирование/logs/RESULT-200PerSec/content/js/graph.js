/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
$(document).ready(function() {

    $(".click-title").mouseenter( function(    e){
        e.preventDefault();
        this.style.cursor="pointer";
    });
    $(".click-title").mousedown( function(event){
        event.preventDefault();
    });

    // Ugly code while this script is shared among several pages
    try{
        refreshHitsPerSecond(true);
    } catch(e){}
    try{
        refreshResponseTimeOverTime(true);
    } catch(e){}
    try{
        refreshResponseTimePercentiles();
    } catch(e){}
});


var responseTimePercentilesInfos = {
        data: {"result": {"minY": 6.0, "minX": 0.0, "maxY": 1041.0, "series": [{"data": [[0.0, 6.0], [0.1, 6.0], [0.2, 6.0], [0.3, 6.0], [0.4, 6.0], [0.5, 7.0], [0.6, 7.0], [0.7, 7.0], [0.8, 7.0], [0.9, 7.0], [1.0, 7.0], [1.1, 7.0], [1.2, 7.0], [1.3, 7.0], [1.4, 7.0], [1.5, 7.0], [1.6, 7.0], [1.7, 7.0], [1.8, 8.0], [1.9, 8.0], [2.0, 8.0], [2.1, 8.0], [2.2, 8.0], [2.3, 8.0], [2.4, 8.0], [2.5, 8.0], [2.6, 9.0], [2.7, 9.0], [2.8, 9.0], [2.9, 9.0], [3.0, 9.0], [3.1, 9.0], [3.2, 10.0], [3.3, 10.0], [3.4, 10.0], [3.5, 10.0], [3.6, 10.0], [3.7, 10.0], [3.8, 11.0], [3.9, 11.0], [4.0, 11.0], [4.1, 11.0], [4.2, 11.0], [4.3, 12.0], [4.4, 12.0], [4.5, 12.0], [4.6, 12.0], [4.7, 12.0], [4.8, 12.0], [4.9, 12.0], [5.0, 12.0], [5.1, 12.0], [5.2, 13.0], [5.3, 13.0], [5.4, 13.0], [5.5, 13.0], [5.6, 13.0], [5.7, 13.0], [5.8, 14.0], [5.9, 14.0], [6.0, 15.0], [6.1, 15.0], [6.2, 15.0], [6.3, 15.0], [6.4, 15.0], [6.5, 15.0], [6.6, 15.0], [6.7, 16.0], [6.8, 16.0], [6.9, 16.0], [7.0, 16.0], [7.1, 17.0], [7.2, 17.0], [7.3, 17.0], [7.4, 18.0], [7.5, 18.0], [7.6, 18.0], [7.7, 19.0], [7.8, 19.0], [7.9, 19.0], [8.0, 19.0], [8.1, 20.0], [8.2, 20.0], [8.3, 20.0], [8.4, 20.0], [8.5, 21.0], [8.6, 21.0], [8.7, 21.0], [8.8, 21.0], [8.9, 21.0], [9.0, 21.0], [9.1, 22.0], [9.2, 22.0], [9.3, 22.0], [9.4, 22.0], [9.5, 22.0], [9.6, 22.0], [9.7, 23.0], [9.8, 23.0], [9.9, 23.0], [10.0, 23.0], [10.1, 23.0], [10.2, 23.0], [10.3, 24.0], [10.4, 24.0], [10.5, 24.0], [10.6, 24.0], [10.7, 24.0], [10.8, 24.0], [10.9, 24.0], [11.0, 25.0], [11.1, 25.0], [11.2, 25.0], [11.3, 25.0], [11.4, 25.0], [11.5, 25.0], [11.6, 25.0], [11.7, 26.0], [11.8, 26.0], [11.9, 26.0], [12.0, 26.0], [12.1, 26.0], [12.2, 27.0], [12.3, 27.0], [12.4, 27.0], [12.5, 27.0], [12.6, 27.0], [12.7, 27.0], [12.8, 27.0], [12.9, 27.0], [13.0, 28.0], [13.1, 28.0], [13.2, 28.0], [13.3, 28.0], [13.4, 28.0], [13.5, 29.0], [13.6, 29.0], [13.7, 29.0], [13.8, 29.0], [13.9, 29.0], [14.0, 29.0], [14.1, 29.0], [14.2, 30.0], [14.3, 30.0], [14.4, 30.0], [14.5, 30.0], [14.6, 30.0], [14.7, 30.0], [14.8, 31.0], [14.9, 31.0], [15.0, 31.0], [15.1, 31.0], [15.2, 31.0], [15.3, 31.0], [15.4, 31.0], [15.5, 31.0], [15.6, 32.0], [15.7, 32.0], [15.8, 32.0], [15.9, 32.0], [16.0, 32.0], [16.1, 32.0], [16.2, 32.0], [16.3, 32.0], [16.4, 32.0], [16.5, 32.0], [16.6, 33.0], [16.7, 33.0], [16.8, 33.0], [16.9, 33.0], [17.0, 33.0], [17.1, 33.0], [17.2, 33.0], [17.3, 34.0], [17.4, 34.0], [17.5, 34.0], [17.6, 34.0], [17.7, 34.0], [17.8, 34.0], [17.9, 35.0], [18.0, 35.0], [18.1, 35.0], [18.2, 35.0], [18.3, 35.0], [18.4, 35.0], [18.5, 36.0], [18.6, 36.0], [18.7, 36.0], [18.8, 36.0], [18.9, 36.0], [19.0, 36.0], [19.1, 37.0], [19.2, 37.0], [19.3, 37.0], [19.4, 37.0], [19.5, 37.0], [19.6, 38.0], [19.7, 38.0], [19.8, 38.0], [19.9, 38.0], [20.0, 38.0], [20.1, 39.0], [20.2, 39.0], [20.3, 39.0], [20.4, 39.0], [20.5, 40.0], [20.6, 40.0], [20.7, 40.0], [20.8, 40.0], [20.9, 41.0], [21.0, 41.0], [21.1, 41.0], [21.2, 41.0], [21.3, 42.0], [21.4, 42.0], [21.5, 42.0], [21.6, 42.0], [21.7, 43.0], [21.8, 43.0], [21.9, 43.0], [22.0, 43.0], [22.1, 43.0], [22.2, 44.0], [22.3, 44.0], [22.4, 44.0], [22.5, 45.0], [22.6, 45.0], [22.7, 45.0], [22.8, 45.0], [22.9, 45.0], [23.0, 46.0], [23.1, 46.0], [23.2, 46.0], [23.3, 46.0], [23.4, 47.0], [23.5, 47.0], [23.6, 47.0], [23.7, 47.0], [23.8, 48.0], [23.9, 48.0], [24.0, 48.0], [24.1, 49.0], [24.2, 49.0], [24.3, 49.0], [24.4, 49.0], [24.5, 50.0], [24.6, 50.0], [24.7, 50.0], [24.8, 51.0], [24.9, 51.0], [25.0, 51.0], [25.1, 52.0], [25.2, 52.0], [25.3, 52.0], [25.4, 52.0], [25.5, 53.0], [25.6, 53.0], [25.7, 53.0], [25.8, 53.0], [25.9, 54.0], [26.0, 54.0], [26.1, 55.0], [26.2, 55.0], [26.3, 55.0], [26.4, 56.0], [26.5, 56.0], [26.6, 57.0], [26.7, 57.0], [26.8, 58.0], [26.9, 59.0], [27.0, 60.0], [27.1, 60.0], [27.2, 60.0], [27.3, 61.0], [27.4, 61.0], [27.5, 62.0], [27.6, 63.0], [27.7, 63.0], [27.8, 63.0], [27.9, 63.0], [28.0, 63.0], [28.1, 64.0], [28.2, 65.0], [28.3, 66.0], [28.4, 66.0], [28.5, 66.0], [28.6, 66.0], [28.7, 67.0], [28.8, 67.0], [28.9, 68.0], [29.0, 68.0], [29.1, 68.0], [29.2, 68.0], [29.3, 69.0], [29.4, 69.0], [29.5, 70.0], [29.6, 70.0], [29.7, 70.0], [29.8, 71.0], [29.9, 71.0], [30.0, 71.0], [30.1, 72.0], [30.2, 72.0], [30.3, 73.0], [30.4, 74.0], [30.5, 74.0], [30.6, 74.0], [30.7, 75.0], [30.8, 75.0], [30.9, 76.0], [31.0, 76.0], [31.1, 77.0], [31.2, 77.0], [31.3, 78.0], [31.4, 78.0], [31.5, 79.0], [31.6, 79.0], [31.7, 80.0], [31.8, 80.0], [31.9, 80.0], [32.0, 81.0], [32.1, 82.0], [32.2, 82.0], [32.3, 83.0], [32.4, 83.0], [32.5, 83.0], [32.6, 83.0], [32.7, 84.0], [32.8, 84.0], [32.9, 85.0], [33.0, 85.0], [33.1, 85.0], [33.2, 85.0], [33.3, 86.0], [33.4, 86.0], [33.5, 87.0], [33.6, 87.0], [33.7, 88.0], [33.8, 88.0], [33.9, 88.0], [34.0, 88.0], [34.1, 88.0], [34.2, 89.0], [34.3, 89.0], [34.4, 89.0], [34.5, 89.0], [34.6, 90.0], [34.7, 90.0], [34.8, 90.0], [34.9, 91.0], [35.0, 91.0], [35.1, 91.0], [35.2, 92.0], [35.3, 92.0], [35.4, 92.0], [35.5, 92.0], [35.6, 93.0], [35.7, 93.0], [35.8, 93.0], [35.9, 94.0], [36.0, 94.0], [36.1, 95.0], [36.2, 95.0], [36.3, 95.0], [36.4, 96.0], [36.5, 96.0], [36.6, 96.0], [36.7, 97.0], [36.8, 97.0], [36.9, 97.0], [37.0, 98.0], [37.1, 98.0], [37.2, 98.0], [37.3, 99.0], [37.4, 99.0], [37.5, 100.0], [37.6, 100.0], [37.7, 100.0], [37.8, 100.0], [37.9, 100.0], [38.0, 101.0], [38.1, 101.0], [38.2, 101.0], [38.3, 102.0], [38.4, 103.0], [38.5, 103.0], [38.6, 104.0], [38.7, 104.0], [38.8, 104.0], [38.9, 104.0], [39.0, 105.0], [39.1, 105.0], [39.2, 106.0], [39.3, 106.0], [39.4, 106.0], [39.5, 107.0], [39.6, 107.0], [39.7, 107.0], [39.8, 108.0], [39.9, 108.0], [40.0, 109.0], [40.1, 109.0], [40.2, 109.0], [40.3, 110.0], [40.4, 111.0], [40.5, 111.0], [40.6, 112.0], [40.7, 112.0], [40.8, 112.0], [40.9, 113.0], [41.0, 113.0], [41.1, 113.0], [41.2, 114.0], [41.3, 114.0], [41.4, 115.0], [41.5, 115.0], [41.6, 115.0], [41.7, 116.0], [41.8, 116.0], [41.9, 116.0], [42.0, 117.0], [42.1, 117.0], [42.2, 117.0], [42.3, 117.0], [42.4, 118.0], [42.5, 118.0], [42.6, 119.0], [42.7, 119.0], [42.8, 120.0], [42.9, 120.0], [43.0, 121.0], [43.1, 121.0], [43.2, 121.0], [43.3, 122.0], [43.4, 122.0], [43.5, 123.0], [43.6, 123.0], [43.7, 123.0], [43.8, 124.0], [43.9, 124.0], [44.0, 125.0], [44.1, 125.0], [44.2, 126.0], [44.3, 127.0], [44.4, 128.0], [44.5, 128.0], [44.6, 128.0], [44.7, 129.0], [44.8, 129.0], [44.9, 130.0], [45.0, 130.0], [45.1, 130.0], [45.2, 131.0], [45.3, 131.0], [45.4, 132.0], [45.5, 132.0], [45.6, 133.0], [45.7, 133.0], [45.8, 134.0], [45.9, 135.0], [46.0, 135.0], [46.1, 136.0], [46.2, 136.0], [46.3, 137.0], [46.4, 138.0], [46.5, 138.0], [46.6, 139.0], [46.7, 139.0], [46.8, 140.0], [46.9, 140.0], [47.0, 141.0], [47.1, 141.0], [47.2, 142.0], [47.3, 143.0], [47.4, 143.0], [47.5, 144.0], [47.6, 144.0], [47.7, 145.0], [47.8, 145.0], [47.9, 146.0], [48.0, 147.0], [48.1, 147.0], [48.2, 148.0], [48.3, 148.0], [48.4, 149.0], [48.5, 149.0], [48.6, 150.0], [48.7, 151.0], [48.8, 151.0], [48.9, 151.0], [49.0, 152.0], [49.1, 152.0], [49.2, 152.0], [49.3, 153.0], [49.4, 153.0], [49.5, 154.0], [49.6, 154.0], [49.7, 154.0], [49.8, 155.0], [49.9, 156.0], [50.0, 156.0], [50.1, 156.0], [50.2, 157.0], [50.3, 157.0], [50.4, 158.0], [50.5, 159.0], [50.6, 159.0], [50.7, 159.0], [50.8, 160.0], [50.9, 161.0], [51.0, 161.0], [51.1, 162.0], [51.2, 162.0], [51.3, 163.0], [51.4, 163.0], [51.5, 164.0], [51.6, 164.0], [51.7, 165.0], [51.8, 165.0], [51.9, 166.0], [52.0, 166.0], [52.1, 166.0], [52.2, 167.0], [52.3, 167.0], [52.4, 168.0], [52.5, 168.0], [52.6, 169.0], [52.7, 169.0], [52.8, 170.0], [52.9, 170.0], [53.0, 170.0], [53.1, 171.0], [53.2, 171.0], [53.3, 172.0], [53.4, 172.0], [53.5, 172.0], [53.6, 173.0], [53.7, 173.0], [53.8, 173.0], [53.9, 174.0], [54.0, 175.0], [54.1, 175.0], [54.2, 176.0], [54.3, 177.0], [54.4, 177.0], [54.5, 177.0], [54.6, 178.0], [54.7, 178.0], [54.8, 178.0], [54.9, 179.0], [55.0, 179.0], [55.1, 179.0], [55.2, 179.0], [55.3, 180.0], [55.4, 180.0], [55.5, 181.0], [55.6, 181.0], [55.7, 182.0], [55.8, 182.0], [55.9, 182.0], [56.0, 182.0], [56.1, 183.0], [56.2, 183.0], [56.3, 183.0], [56.4, 184.0], [56.5, 184.0], [56.6, 185.0], [56.7, 185.0], [56.8, 185.0], [56.9, 186.0], [57.0, 186.0], [57.1, 186.0], [57.2, 187.0], [57.3, 187.0], [57.4, 188.0], [57.5, 188.0], [57.6, 189.0], [57.7, 189.0], [57.8, 190.0], [57.9, 190.0], [58.0, 191.0], [58.1, 191.0], [58.2, 191.0], [58.3, 192.0], [58.4, 192.0], [58.5, 193.0], [58.6, 193.0], [58.7, 194.0], [58.8, 194.0], [58.9, 195.0], [59.0, 195.0], [59.1, 196.0], [59.2, 196.0], [59.3, 197.0], [59.4, 197.0], [59.5, 198.0], [59.6, 198.0], [59.7, 199.0], [59.8, 199.0], [59.9, 199.0], [60.0, 200.0], [60.1, 201.0], [60.2, 201.0], [60.3, 202.0], [60.4, 203.0], [60.5, 203.0], [60.6, 203.0], [60.7, 204.0], [60.8, 205.0], [60.9, 206.0], [61.0, 206.0], [61.1, 206.0], [61.2, 207.0], [61.3, 208.0], [61.4, 209.0], [61.5, 209.0], [61.6, 210.0], [61.7, 211.0], [61.8, 211.0], [61.9, 213.0], [62.0, 214.0], [62.1, 215.0], [62.2, 216.0], [62.3, 217.0], [62.4, 218.0], [62.5, 219.0], [62.6, 220.0], [62.7, 221.0], [62.8, 223.0], [62.9, 224.0], [63.0, 224.0], [63.1, 225.0], [63.2, 227.0], [63.3, 227.0], [63.4, 228.0], [63.5, 230.0], [63.6, 232.0], [63.7, 232.0], [63.8, 233.0], [63.9, 233.0], [64.0, 235.0], [64.1, 236.0], [64.2, 237.0], [64.3, 237.0], [64.4, 239.0], [64.5, 239.0], [64.6, 241.0], [64.7, 242.0], [64.8, 243.0], [64.9, 245.0], [65.0, 246.0], [65.1, 247.0], [65.2, 249.0], [65.3, 249.0], [65.4, 250.0], [65.5, 251.0], [65.6, 252.0], [65.7, 253.0], [65.8, 254.0], [65.9, 255.0], [66.0, 256.0], [66.1, 257.0], [66.2, 259.0], [66.3, 262.0], [66.4, 263.0], [66.5, 264.0], [66.6, 265.0], [66.7, 266.0], [66.8, 268.0], [66.9, 269.0], [67.0, 271.0], [67.1, 271.0], [67.2, 272.0], [67.3, 275.0], [67.4, 277.0], [67.5, 279.0], [67.6, 282.0], [67.7, 284.0], [67.8, 286.0], [67.9, 288.0], [68.0, 289.0], [68.1, 290.0], [68.2, 292.0], [68.3, 293.0], [68.4, 294.0], [68.5, 295.0], [68.6, 296.0], [68.7, 297.0], [68.8, 298.0], [68.9, 299.0], [69.0, 301.0], [69.1, 301.0], [69.2, 302.0], [69.3, 304.0], [69.4, 305.0], [69.5, 305.0], [69.6, 306.0], [69.7, 307.0], [69.8, 307.0], [69.9, 310.0], [70.0, 311.0], [70.1, 312.0], [70.2, 317.0], [70.3, 317.0], [70.4, 319.0], [70.5, 319.0], [70.6, 320.0], [70.7, 322.0], [70.8, 322.0], [70.9, 323.0], [71.0, 325.0], [71.1, 326.0], [71.2, 328.0], [71.3, 328.0], [71.4, 328.0], [71.5, 330.0], [71.6, 331.0], [71.7, 331.0], [71.8, 333.0], [71.9, 334.0], [72.0, 335.0], [72.1, 336.0], [72.2, 338.0], [72.3, 339.0], [72.4, 341.0], [72.5, 342.0], [72.6, 343.0], [72.7, 344.0], [72.8, 346.0], [72.9, 347.0], [73.0, 348.0], [73.1, 348.0], [73.2, 350.0], [73.3, 351.0], [73.4, 352.0], [73.5, 352.0], [73.6, 354.0], [73.7, 355.0], [73.8, 356.0], [73.9, 356.0], [74.0, 357.0], [74.1, 357.0], [74.2, 359.0], [74.3, 361.0], [74.4, 364.0], [74.5, 366.0], [74.6, 369.0], [74.7, 370.0], [74.8, 371.0], [74.9, 372.0], [75.0, 373.0], [75.1, 375.0], [75.2, 377.0], [75.3, 378.0], [75.4, 381.0], [75.5, 381.0], [75.6, 383.0], [75.7, 384.0], [75.8, 384.0], [75.9, 386.0], [76.0, 386.0], [76.1, 388.0], [76.2, 390.0], [76.3, 391.0], [76.4, 393.0], [76.5, 398.0], [76.6, 402.0], [76.7, 404.0], [76.8, 405.0], [76.9, 406.0], [77.0, 406.0], [77.1, 407.0], [77.2, 408.0], [77.3, 409.0], [77.4, 411.0], [77.5, 413.0], [77.6, 416.0], [77.7, 418.0], [77.8, 420.0], [77.9, 421.0], [78.0, 422.0], [78.1, 426.0], [78.2, 430.0], [78.3, 431.0], [78.4, 433.0], [78.5, 434.0], [78.6, 435.0], [78.7, 436.0], [78.8, 440.0], [78.9, 442.0], [79.0, 443.0], [79.1, 444.0], [79.2, 446.0], [79.3, 449.0], [79.4, 451.0], [79.5, 452.0], [79.6, 453.0], [79.7, 454.0], [79.8, 456.0], [79.9, 457.0], [80.0, 460.0], [80.1, 461.0], [80.2, 462.0], [80.3, 463.0], [80.4, 466.0], [80.5, 468.0], [80.6, 470.0], [80.7, 473.0], [80.8, 474.0], [80.9, 474.0], [81.0, 475.0], [81.1, 478.0], [81.2, 480.0], [81.3, 481.0], [81.4, 482.0], [81.5, 483.0], [81.6, 485.0], [81.7, 487.0], [81.8, 488.0], [81.9, 490.0], [82.0, 491.0], [82.1, 492.0], [82.2, 493.0], [82.3, 494.0], [82.4, 495.0], [82.5, 497.0], [82.6, 498.0], [82.7, 499.0], [82.8, 504.0], [82.9, 508.0], [83.0, 511.0], [83.1, 512.0], [83.2, 520.0], [83.3, 527.0], [83.4, 531.0], [83.5, 534.0], [83.6, 537.0], [83.7, 539.0], [83.8, 542.0], [83.9, 545.0], [84.0, 548.0], [84.1, 551.0], [84.2, 556.0], [84.3, 559.0], [84.4, 562.0], [84.5, 564.0], [84.6, 567.0], [84.7, 570.0], [84.8, 572.0], [84.9, 573.0], [85.0, 575.0], [85.1, 577.0], [85.2, 580.0], [85.3, 583.0], [85.4, 584.0], [85.5, 585.0], [85.6, 586.0], [85.7, 588.0], [85.8, 590.0], [85.9, 591.0], [86.0, 593.0], [86.1, 594.0], [86.2, 596.0], [86.3, 597.0], [86.4, 598.0], [86.5, 602.0], [86.6, 604.0], [86.7, 607.0], [86.8, 607.0], [86.9, 608.0], [87.0, 611.0], [87.1, 613.0], [87.2, 614.0], [87.3, 614.0], [87.4, 616.0], [87.5, 618.0], [87.6, 619.0], [87.7, 622.0], [87.8, 624.0], [87.9, 626.0], [88.0, 628.0], [88.1, 629.0], [88.2, 631.0], [88.3, 631.0], [88.4, 633.0], [88.5, 635.0], [88.6, 635.0], [88.7, 636.0], [88.8, 636.0], [88.9, 638.0], [89.0, 640.0], [89.1, 641.0], [89.2, 642.0], [89.3, 644.0], [89.4, 645.0], [89.5, 647.0], [89.6, 648.0], [89.7, 649.0], [89.8, 650.0], [89.9, 651.0], [90.0, 652.0], [90.1, 653.0], [90.2, 654.0], [90.3, 655.0], [90.4, 656.0], [90.5, 657.0], [90.6, 658.0], [90.7, 660.0], [90.8, 661.0], [90.9, 661.0], [91.0, 662.0], [91.1, 662.0], [91.2, 664.0], [91.3, 664.0], [91.4, 665.0], [91.5, 666.0], [91.6, 666.0], [91.7, 667.0], [91.8, 668.0], [91.9, 669.0], [92.0, 670.0], [92.1, 671.0], [92.2, 671.0], [92.3, 672.0], [92.4, 672.0], [92.5, 673.0], [92.6, 673.0], [92.7, 674.0], [92.8, 674.0], [92.9, 675.0], [93.0, 676.0], [93.1, 678.0], [93.2, 679.0], [93.3, 680.0], [93.4, 682.0], [93.5, 683.0], [93.6, 684.0], [93.7, 686.0], [93.8, 686.0], [93.9, 688.0], [94.0, 690.0], [94.1, 692.0], [94.2, 694.0], [94.3, 696.0], [94.4, 697.0], [94.5, 700.0], [94.6, 701.0], [94.7, 704.0], [94.8, 707.0], [94.9, 709.0], [95.0, 713.0], [95.1, 714.0], [95.2, 716.0], [95.3, 718.0], [95.4, 720.0], [95.5, 723.0], [95.6, 724.0], [95.7, 726.0], [95.8, 728.0], [95.9, 731.0], [96.0, 732.0], [96.1, 735.0], [96.2, 740.0], [96.3, 746.0], [96.4, 750.0], [96.5, 756.0], [96.6, 763.0], [96.7, 768.0], [96.8, 769.0], [96.9, 771.0], [97.0, 773.0], [97.1, 780.0], [97.2, 781.0], [97.3, 786.0], [97.4, 792.0], [97.5, 803.0], [97.6, 812.0], [97.7, 814.0], [97.8, 817.0], [97.9, 825.0], [98.0, 834.0], [98.1, 846.0], [98.2, 852.0], [98.3, 859.0], [98.4, 863.0], [98.5, 866.0], [98.6, 871.0], [98.7, 877.0], [98.8, 887.0], [98.9, 893.0], [99.0, 899.0], [99.1, 907.0], [99.2, 917.0], [99.3, 920.0], [99.4, 921.0], [99.5, 930.0], [99.6, 940.0], [99.7, 952.0], [99.8, 963.0], [99.9, 989.0], [100.0, 1041.0]], "isOverall": false, "label": "HTTP Request", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
        getOptions: function() {
            return {
                series: {
                    points: { show: false }
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentiles'
                },
                xaxis: {
                    tickDecimals: 1,
                    axisLabel: "Percentiles",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Percentile value in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : %x.2 percentile was %y ms"
                },
                selection: { mode: "xy" },
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentiles"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesPercentiles"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesPercentiles"), dataset, prepareOverviewOptions(options));
        }
};

/**
 * @param elementId Id of element where we display message
 */
function setEmptyGraph(elementId) {
    $(function() {
        $(elementId).text("No graph series with filter="+seriesFilter);
    });
}

// Response times percentiles
function refreshResponseTimePercentiles() {
    var infos = responseTimePercentilesInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimePercentiles");
        return;
    }
    if (isGraph($("#flotResponseTimesPercentiles"))){
        infos.createGraph();
    } else {
        var choiceContainer = $("#choicesResponseTimePercentiles");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesPercentiles", "#overviewResponseTimesPercentiles");
        $('#bodyResponseTimePercentiles .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimeDistributionInfos = {
        data: {"result": {"minY": 4.0, "minX": 0.0, "maxY": 1499.0, "series": [{"data": [[0.0, 1499.0], [600.0, 318.0], [300.0, 306.0], [700.0, 122.0], [400.0, 245.0], [100.0, 897.0], [800.0, 61.0], [200.0, 361.0], [900.0, 36.0], [500.0, 151.0], [1000.0, 4.0]], "isOverall": false, "label": "HTTP Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 1000.0, "title": "Response Time Distribution"}},
        getOptions: function() {
            var granularity = this.data.result.granularity;
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    barWidth: this.data.result.granularity
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " responses for " + label + " were between " + xval + " and " + (xval + granularity) + " ms";
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimeDistribution"), prepareData(data.result.series, $("#choicesResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshResponseTimeDistribution() {
    var infos = responseTimeDistributionInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeDistribution");
        return;
    }
    if (isGraph($("#flotResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var syntheticResponseTimeDistributionInfos = {
        data: {"result": {"minY": 691.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 3309.0, "series": [{"data": [[0.0, 3309.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 691.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 1.0, "title": "Synthetic Response Times Distribution"}},
        getOptions: function() {
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendSyntheticResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times ranges",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                    tickLength:0,
                    min:-0.5,
                    max:3.5
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    align: "center",
                    barWidth: 0.25,
                    fill:.75
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " " + label;
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            options.xaxis.ticks = data.result.ticks;
            $.plot($("#flotSyntheticResponseTimeDistribution"), prepareData(data.result.series, $("#choicesSyntheticResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshSyntheticResponseTimeDistribution() {
    var infos = syntheticResponseTimeDistributionInfos;
    prepareSeries(infos.data, true);
    if (isGraph($("#flotSyntheticResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerSyntheticResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var activeThreadsOverTimeInfos = {
        data: {"result": {"minY": 66.83138173302109, "minX": 1.76599314E12, "maxY": 103.33193394906242, "series": [{"data": [[1.7659932E12, 66.83138173302109], [1.76599314E12, 103.33193394906242]], "isOverall": false, "label": "Thread Group", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7659932E12, "title": "Active Threads Over Time"}},
        getOptions: function() {
            return {
                series: {
                    stack: true,
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 6,
                    show: true,
                    container: '#legendActiveThreadsOverTime'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                selection: {
                    mode: 'xy'
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : At %x there were %y active threads"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesActiveThreadsOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotActiveThreadsOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewActiveThreadsOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Active Threads Over Time
function refreshActiveThreadsOverTime(fixTimestamps) {
    var infos = activeThreadsOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 10800000);
    }
    if(isGraph($("#flotActiveThreadsOverTime"))) {
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesActiveThreadsOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotActiveThreadsOverTime", "#overviewActiveThreadsOverTime");
        $('#footerActiveThreadsOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var timeVsThreadsInfos = {
        data: {"result": {"minY": 37.8, "minX": 1.0, "maxY": 669.6, "series": [{"data": [[2.0, 359.0], [3.0, 76.0], [4.0, 104.5], [5.0, 38.5], [6.0, 37.8], [7.0, 105.50000000000001], [8.0, 57.333333333333336], [9.0, 63.666666666666664], [11.0, 50.99999999999999], [12.0, 125.25], [13.0, 130.25], [14.0, 87.66666666666666], [15.0, 188.4], [16.0, 168.0], [17.0, 104.66666666666666], [18.0, 184.33333333333334], [19.0, 121.5], [20.0, 114.16666666666666], [21.0, 183.25], [22.0, 106.00000000000001], [23.0, 105.83333333333334], [24.0, 127.75000000000001], [25.0, 95.78571428571428], [26.0, 128.33333333333337], [27.0, 130.25], [28.0, 91.52631578947368], [29.0, 119.7], [30.0, 91.54545454545455], [31.0, 125.99999999999999], [33.0, 110.87500000000001], [32.0, 120.36363636363637], [35.0, 174.0909090909091], [34.0, 142.44444444444446], [36.0, 93.9], [37.0, 127.16666666666667], [39.0, 170.25], [38.0, 275.6], [40.0, 181.36363636363637], [41.0, 175.25], [43.0, 162.3157894736842], [42.0, 124.33333333333336], [45.0, 111.23076923076923], [44.0, 208.99999999999997], [46.0, 81.23529411764706], [47.0, 111.58823529411765], [48.0, 126.39130434782611], [49.0, 111.72], [51.0, 173.3], [50.0, 124.85714285714285], [53.0, 116.17142857142856], [52.0, 120.49999999999997], [55.0, 149.55], [54.0, 198.24000000000004], [57.0, 154.5], [56.0, 151.96774193548387], [58.0, 174.578947368421], [59.0, 211.75000000000006], [60.0, 151.33333333333334], [61.0, 164.13333333333333], [63.0, 144.2972972972973], [62.0, 90.82051282051282], [67.0, 122.78947368421049], [66.0, 160.51111111111115], [65.0, 162.8552631578948], [64.0, 78.15517241379311], [71.0, 168.0], [70.0, 193.00000000000003], [68.0, 137.76666666666668], [69.0, 148.95], [74.0, 194.52380952380952], [73.0, 150.19999999999996], [72.0, 151.82352941176467], [75.0, 172.71875], [79.0, 131.241935483871], [78.0, 158.4], [77.0, 173.41860465116278], [76.0, 151.43243243243242], [83.0, 215.62650602409636], [81.0, 170.5394736842105], [82.0, 205.23809523809524], [80.0, 147.15714285714287], [86.0, 227.15384615384608], [85.0, 170.2083333333334], [84.0, 167.19999999999996], [87.0, 182.02439024390245], [91.0, 201.06666666666666], [90.0, 206.07017543859646], [89.0, 212.8039215686275], [88.0, 243.02127659574475], [95.0, 235.5873015873016], [94.0, 191.16393442622947], [93.0, 232.52459016393448], [92.0, 187.4782608695652], [99.0, 256.19117647058823], [96.0, 245.77777777777777], [97.0, 239.62376237623766], [98.0, 234.23880597014923], [102.0, 229.04545454545456], [101.0, 274.5555555555556], [100.0, 344.72307692307703], [103.0, 365.6], [106.0, 174.0], [107.0, 378.8], [104.0, 359.6666666666667], [105.0, 243.60000000000002], [111.0, 204.66666666666669], [110.0, 145.33333333333331], [109.0, 190.53333333333333], [108.0, 189.0], [113.0, 335.61538461538464], [112.0, 280.2], [115.0, 224.86363636363637], [114.0, 161.0], [117.0, 288.42857142857144], [116.0, 148.33333333333334], [123.0, 253.04545454545453], [121.0, 322.71999999999997], [122.0, 265.68000000000006], [120.0, 277.99999999999994], [126.0, 274.53846153846155], [124.0, 348.3333333333333], [125.0, 350.8], [127.0, 180.2857142857143], [135.0, 314.5], [134.0, 276.1428571428571], [131.0, 454.83333333333337], [132.0, 300.25], [130.0, 295.8333333333333], [133.0, 259.0], [129.0, 241.83333333333334], [128.0, 390.0], [142.0, 322.85714285714283], [138.0, 255.5], [139.0, 403.2], [137.0, 173.66666666666669], [136.0, 379.0], [140.0, 265.6666666666667], [149.0, 476.2631578947369], [150.0, 441.0], [151.0, 254.125], [148.0, 476.3333333333333], [146.0, 218.8], [145.0, 423.5], [144.0, 179.66666666666666], [155.0, 417.5862068965517], [156.0, 339.7272727272728], [157.0, 280.4], [159.0, 415.7647058823529], [158.0, 417.75], [153.0, 414.05555555555554], [154.0, 436.92307692307696], [152.0, 356.22222222222223], [162.0, 388.125], [163.0, 321.24999999999994], [167.0, 371.0], [166.0, 512.3125], [165.0, 345.75], [164.0, 264.4], [160.0, 423.84615384615387], [161.0, 239.4], [169.0, 569.0], [173.0, 608.25], [174.0, 576.25], [175.0, 371.7272727272727], [172.0, 432.0], [171.0, 548.9333333333335], [170.0, 465.5], [168.0, 490.90000000000003], [176.0, 515.8], [181.0, 347.0], [182.0, 297.6666666666667], [183.0, 476.3333333333333], [180.0, 282.92307692307696], [178.0, 437.50000000000006], [177.0, 537.0], [179.0, 484.41666666666663], [184.0, 669.6], [186.0, 473.68181818181813], [187.0, 470.4074074074073], [185.0, 345.70588235294116], [188.0, 645.0], [189.0, 494.3529411764706], [191.0, 447.9411764705882], [190.0, 450.8500000000001], [192.0, 450.53846153846155], [194.0, 543.1818181818182], [193.0, 310.8064516129031], [195.0, 479.3333333333334], [196.0, 418.52173913043475], [198.0, 400.5], [197.0, 493.0], [199.0, 491.90000000000003], [201.0, 469.5333333333333], [200.0, 529.3333333333334], [203.0, 564.5], [205.0, 199.4375], [206.0, 415.4], [204.0, 549.5999999999999], [207.0, 386.5], [202.0, 492.2727272727272], [209.0, 475.0], [208.0, 654.0], [1.0, 322.0]], "isOverall": false, "label": "HTTP Request", "isController": false}, {"data": [[99.43525000000015, 243.57024999999953]], "isOverall": false, "label": "HTTP Request-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 209.0, "title": "Time VS Threads"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: { noColumns: 2,show: true, container: '#legendTimeVsThreads' },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s: At %x.2 active threads, Average response time was %y.2 ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesTimeVsThreads"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotTimesVsThreads"), dataset, options);
            // setup overview
            $.plot($("#overviewTimesVsThreads"), dataset, prepareOverviewOptions(options));
        }
};

// Time vs threads
function refreshTimeVsThreads(){
    var infos = timeVsThreadsInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTimeVsThreads");
        return;
    }
    if(isGraph($("#flotTimesVsThreads"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTimeVsThreads");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTimesVsThreads", "#overviewTimesVsThreads");
        $('#footerTimeVsThreads .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var bytesThroughputOverTimeInfos = {
        data : {"result": {"minY": 1217.4333333333334, "minX": 1.76599314E12, "maxY": 20523.75, "series": [{"data": [[1.7659932E12, 2442.9166666666665], [1.76599314E12, 20523.75]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.7659932E12, 1217.4333333333334], [1.76599314E12, 10082.566666666668]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7659932E12, "title": "Bytes Throughput Over Time"}},
        getOptions : function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity) ,
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Bytes / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendBytesThroughputOverTime'
                },
                selection: {
                    mode: "xy"
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y"
                }
            };
        },
        createGraph : function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesBytesThroughputOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotBytesThroughputOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewBytesThroughputOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Bytes throughput Over Time
function refreshBytesThroughputOverTime(fixTimestamps) {
    var infos = bytesThroughputOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 10800000);
    }
    if(isGraph($("#flotBytesThroughputOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesBytesThroughputOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotBytesThroughputOverTime", "#overviewBytesThroughputOverTime");
        $('#footerBytesThroughputOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimesOverTimeInfos = {
        data: {"result": {"minY": 189.50351288056206, "minX": 1.76599314E12, "maxY": 250.03162608452257, "series": [{"data": [[1.7659932E12, 189.50351288056206], [1.76599314E12, 250.03162608452257]], "isOverall": false, "label": "HTTP Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7659932E12, "title": "Response Time Over Time"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average response time was %y ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Times Over Time
function refreshResponseTimeOverTime(fixTimestamps) {
    var infos = responseTimesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 10800000);
    }
    if(isGraph($("#flotResponseTimesOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesOverTime", "#overviewResponseTimesOverTime");
        $('#footerResponseTimesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var latenciesOverTimeInfos = {
        data: {"result": {"minY": 189.49882903981268, "minX": 1.76599314E12, "maxY": 250.01399384270965, "series": [{"data": [[1.7659932E12, 189.49882903981268], [1.76599314E12, 250.01399384270965]], "isOverall": false, "label": "HTTP Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7659932E12, "title": "Latencies Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response latencies in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendLatenciesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average latency was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesLatenciesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotLatenciesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewLatenciesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Latencies Over Time
function refreshLatenciesOverTime(fixTimestamps) {
    var infos = latenciesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyLatenciesOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 10800000);
    }
    if(isGraph($("#flotLatenciesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesLatenciesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotLatenciesOverTime", "#overviewLatenciesOverTime");
        $('#footerLatenciesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var connectTimeOverTimeInfos = {
        data: {"result": {"minY": 52.18969555035128, "minX": 1.76599314E12, "maxY": 119.91155891407806, "series": [{"data": [[1.7659932E12, 52.18969555035128], [1.76599314E12, 119.91155891407806]], "isOverall": false, "label": "HTTP Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7659932E12, "title": "Connect Time Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getConnectTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average Connect Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendConnectTimeOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average connect time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesConnectTimeOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotConnectTimeOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewConnectTimeOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Connect Time Over Time
function refreshConnectTimeOverTime(fixTimestamps) {
    var infos = connectTimeOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyConnectTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 10800000);
    }
    if(isGraph($("#flotConnectTimeOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesConnectTimeOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotConnectTimeOverTime", "#overviewConnectTimeOverTime");
        $('#footerConnectTimeOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var responseTimePercentilesOverTimeInfos = {
        data: {"result": {"minY": 6.0, "minX": 1.76599314E12, "maxY": 1041.0, "series": [{"data": [[1.7659932E12, 744.0], [1.76599314E12, 1041.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.7659932E12, 9.0], [1.76599314E12, 6.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.7659932E12, 403.59999999999997], [1.76599314E12, 661.5999999999999]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.7659932E12, 702.0399999999984], [1.76599314E12, 909.7799999999993]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.7659932E12, 166.0], [1.76599314E12, 154.0]], "isOverall": false, "label": "Median", "isController": false}, {"data": [[1.7659932E12, 555.3999999999995], [1.76599314E12, 721.5999999999995]], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7659932E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Response Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentilesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Response time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentilesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimePercentilesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimePercentilesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Time Percentiles Over Time
function refreshResponseTimePercentilesOverTime(fixTimestamps) {
    var infos = responseTimePercentilesOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 10800000);
    }
    if(isGraph($("#flotResponseTimePercentilesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimePercentilesOverTime", "#overviewResponseTimePercentilesOverTime");
        $('#footerResponseTimePercentilesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var responseTimeVsRequestInfos = {
    data: {"result": {"minY": 55.0, "minX": 94.0, "maxY": 665.5, "series": [{"data": [[300.0, 157.5], [348.0, 105.5], [94.0, 665.5], [397.0, 149.0], [420.0, 637.5], [432.0, 95.5], [462.0, 204.5], [459.0, 112.0], [465.0, 55.0], [496.0, 393.5], [127.0, 172.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 496.0, "title": "Response Time Vs Request"}},
    getOptions: function() {
        return {
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Response Time in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: {
                noColumns: 2,
                show: true,
                container: '#legendResponseTimeVsRequest'
            },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median response time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesResponseTimeVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotResponseTimeVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewResponseTimeVsRequest"), dataset, prepareOverviewOptions(options));

    }
};

// Response Time vs Request
function refreshResponseTimeVsRequest() {
    var infos = responseTimeVsRequestInfos;
    prepareSeries(infos.data);
    if (isGraph($("#flotResponseTimeVsRequest"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeVsRequest");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimeVsRequest", "#overviewResponseTimeVsRequest");
        $('#footerResponseRimeVsRequest .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var latenciesVsRequestInfos = {
    data: {"result": {"minY": 55.0, "minX": 94.0, "maxY": 665.5, "series": [{"data": [[300.0, 157.5], [348.0, 105.5], [94.0, 665.5], [397.0, 149.0], [420.0, 637.5], [432.0, 95.5], [462.0, 204.5], [459.0, 112.0], [465.0, 55.0], [496.0, 393.5], [127.0, 172.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 496.0, "title": "Latencies Vs Request"}},
    getOptions: function() {
        return{
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Latency in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: { noColumns: 2,show: true, container: '#legendLatencyVsRequest' },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median Latency time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesLatencyVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotLatenciesVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewLatenciesVsRequest"), dataset, prepareOverviewOptions(options));
    }
};

// Latencies vs Request
function refreshLatenciesVsRequest() {
        var infos = latenciesVsRequestInfos;
        prepareSeries(infos.data);
        if(isGraph($("#flotLatenciesVsRequest"))){
            infos.createGraph();
        }else{
            var choiceContainer = $("#choicesLatencyVsRequest");
            createLegend(choiceContainer, infos);
            infos.createGraph();
            setGraphZoomable("#flotLatenciesVsRequest", "#overviewLatenciesVsRequest");
            $('#footerLatenciesVsRequest .legendColorBox > div').each(function(i){
                $(this).clone().prependTo(choiceContainer.find("li").eq(i));
            });
        }
};

var hitsPerSecondInfos = {
        data: {"result": {"minY": 6.666666666666667, "minX": 1.76599314E12, "maxY": 60.0, "series": [{"data": [[1.7659932E12, 6.666666666666667], [1.76599314E12, 60.0]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7659932E12, "title": "Hits Per Second"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of hits / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendHitsPerSecond"
                },
                selection: {
                    mode : 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y.2 hits/sec"
                }
            };
        },
        createGraph: function createGraph() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesHitsPerSecond"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotHitsPerSecond"), dataset, options);
            // setup overview
            $.plot($("#overviewHitsPerSecond"), dataset, prepareOverviewOptions(options));
        }
};

// Hits per second
function refreshHitsPerSecond(fixTimestamps) {
    var infos = hitsPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 10800000);
    }
    if (isGraph($("#flotHitsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesHitsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotHitsPerSecond", "#overviewHitsPerSecond");
        $('#footerHitsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var codesPerSecondInfos = {
        data: {"result": {"minY": 7.116666666666666, "minX": 1.76599314E12, "maxY": 59.55, "series": [{"data": [[1.7659932E12, 7.116666666666666], [1.76599314E12, 59.55]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7659932E12, "title": "Codes Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendCodesPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "Number of Response Codes %s at %x was %y.2 responses / sec"
                }
            };
        },
    createGraph: function() {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesCodesPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotCodesPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewCodesPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Codes per second
function refreshCodesPerSecond(fixTimestamps) {
    var infos = codesPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 10800000);
    }
    if(isGraph($("#flotCodesPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesCodesPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotCodesPerSecond", "#overviewCodesPerSecond");
        $('#footerCodesPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var transactionsPerSecondInfos = {
        data: {"result": {"minY": 7.116666666666666, "minX": 1.76599314E12, "maxY": 59.55, "series": [{"data": [[1.7659932E12, 7.116666666666666], [1.76599314E12, 59.55]], "isOverall": false, "label": "HTTP Request-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7659932E12, "title": "Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTransactionsPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                }
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTransactionsPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTransactionsPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewTransactionsPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Transactions per second
function refreshTransactionsPerSecond(fixTimestamps) {
    var infos = transactionsPerSecondInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTransactionsPerSecond");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 10800000);
    }
    if(isGraph($("#flotTransactionsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTransactionsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTransactionsPerSecond", "#overviewTransactionsPerSecond");
        $('#footerTransactionsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var totalTPSInfos = {
        data: {"result": {"minY": 7.116666666666666, "minX": 1.76599314E12, "maxY": 59.55, "series": [{"data": [[1.7659932E12, 7.116666666666666], [1.76599314E12, 59.55]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7659932E12, "title": "Total Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTotalTPS"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                },
                colors: ["#9ACD32", "#FF6347"]
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTotalTPS"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTotalTPS"), dataset, options);
        // setup overview
        $.plot($("#overviewTotalTPS"), dataset, prepareOverviewOptions(options));
    }
};

// Total Transactions per second
function refreshTotalTPS(fixTimestamps) {
    var infos = totalTPSInfos;
    // We want to ignore seriesFilter
    prepareSeries(infos.data, false, true);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 10800000);
    }
    if(isGraph($("#flotTotalTPS"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTotalTPS");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTotalTPS", "#overviewTotalTPS");
        $('#footerTotalTPS .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

// Collapse the graph matching the specified DOM element depending the collapsed
// status
function collapse(elem, collapsed){
    if(collapsed){
        $(elem).parent().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    } else {
        $(elem).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
        if (elem.id == "bodyBytesThroughputOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshBytesThroughputOverTime(true);
            }
            document.location.href="#bytesThroughputOverTime";
        } else if (elem.id == "bodyLatenciesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesOverTime(true);
            }
            document.location.href="#latenciesOverTime";
        } else if (elem.id == "bodyCustomGraph") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCustomGraph(true);
            }
            document.location.href="#responseCustomGraph";
        } else if (elem.id == "bodyConnectTimeOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshConnectTimeOverTime(true);
            }
            document.location.href="#connectTimeOverTime";
        } else if (elem.id == "bodyResponseTimePercentilesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimePercentilesOverTime(true);
            }
            document.location.href="#responseTimePercentilesOverTime";
        } else if (elem.id == "bodyResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeDistribution();
            }
            document.location.href="#responseTimeDistribution" ;
        } else if (elem.id == "bodySyntheticResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshSyntheticResponseTimeDistribution();
            }
            document.location.href="#syntheticResponseTimeDistribution" ;
        } else if (elem.id == "bodyActiveThreadsOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshActiveThreadsOverTime(true);
            }
            document.location.href="#activeThreadsOverTime";
        } else if (elem.id == "bodyTimeVsThreads") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTimeVsThreads();
            }
            document.location.href="#timeVsThreads" ;
        } else if (elem.id == "bodyCodesPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCodesPerSecond(true);
            }
            document.location.href="#codesPerSecond";
        } else if (elem.id == "bodyTransactionsPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTransactionsPerSecond(true);
            }
            document.location.href="#transactionsPerSecond";
        } else if (elem.id == "bodyTotalTPS") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTotalTPS(true);
            }
            document.location.href="#totalTPS";
        } else if (elem.id == "bodyResponseTimeVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeVsRequest();
            }
            document.location.href="#responseTimeVsRequest";
        } else if (elem.id == "bodyLatenciesVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesVsRequest();
            }
            document.location.href="#latencyVsRequest";
        }
    }
}

/*
 * Activates or deactivates all series of the specified graph (represented by id parameter)
 * depending on checked argument.
 */
function toggleAll(id, checked){
    var placeholder = document.getElementById(id);

    var cases = $(placeholder).find(':checkbox');
    cases.prop('checked', checked);
    $(cases).parent().children().children().toggleClass("legend-disabled", !checked);

    var choiceContainer;
    if ( id == "choicesBytesThroughputOverTime"){
        choiceContainer = $("#choicesBytesThroughputOverTime");
        refreshBytesThroughputOverTime(false);
    } else if(id == "choicesResponseTimesOverTime"){
        choiceContainer = $("#choicesResponseTimesOverTime");
        refreshResponseTimeOverTime(false);
    }else if(id == "choicesResponseCustomGraph"){
        choiceContainer = $("#choicesResponseCustomGraph");
        refreshCustomGraph(false);
    } else if ( id == "choicesLatenciesOverTime"){
        choiceContainer = $("#choicesLatenciesOverTime");
        refreshLatenciesOverTime(false);
    } else if ( id == "choicesConnectTimeOverTime"){
        choiceContainer = $("#choicesConnectTimeOverTime");
        refreshConnectTimeOverTime(false);
    } else if ( id == "choicesResponseTimePercentilesOverTime"){
        choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        refreshResponseTimePercentilesOverTime(false);
    } else if ( id == "choicesResponseTimePercentiles"){
        choiceContainer = $("#choicesResponseTimePercentiles");
        refreshResponseTimePercentiles();
    } else if(id == "choicesActiveThreadsOverTime"){
        choiceContainer = $("#choicesActiveThreadsOverTime");
        refreshActiveThreadsOverTime(false);
    } else if ( id == "choicesTimeVsThreads"){
        choiceContainer = $("#choicesTimeVsThreads");
        refreshTimeVsThreads();
    } else if ( id == "choicesSyntheticResponseTimeDistribution"){
        choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        refreshSyntheticResponseTimeDistribution();
    } else if ( id == "choicesResponseTimeDistribution"){
        choiceContainer = $("#choicesResponseTimeDistribution");
        refreshResponseTimeDistribution();
    } else if ( id == "choicesHitsPerSecond"){
        choiceContainer = $("#choicesHitsPerSecond");
        refreshHitsPerSecond(false);
    } else if(id == "choicesCodesPerSecond"){
        choiceContainer = $("#choicesCodesPerSecond");
        refreshCodesPerSecond(false);
    } else if ( id == "choicesTransactionsPerSecond"){
        choiceContainer = $("#choicesTransactionsPerSecond");
        refreshTransactionsPerSecond(false);
    } else if ( id == "choicesTotalTPS"){
        choiceContainer = $("#choicesTotalTPS");
        refreshTotalTPS(false);
    } else if ( id == "choicesResponseTimeVsRequest"){
        choiceContainer = $("#choicesResponseTimeVsRequest");
        refreshResponseTimeVsRequest();
    } else if ( id == "choicesLatencyVsRequest"){
        choiceContainer = $("#choicesLatencyVsRequest");
        refreshLatenciesVsRequest();
    }
    var color = checked ? "black" : "#818181";
    if(choiceContainer != null) {
        choiceContainer.find("label").each(function(){
            this.style.color = color;
        });
    }
}

