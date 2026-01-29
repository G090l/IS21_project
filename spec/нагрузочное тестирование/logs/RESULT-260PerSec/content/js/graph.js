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
        data: {"result": {"minY": 7.0, "minX": 0.0, "maxY": 1106.0, "series": [{"data": [[0.0, 7.0], [0.1, 8.0], [0.2, 8.0], [0.3, 9.0], [0.4, 9.0], [0.5, 9.0], [0.6, 9.0], [0.7, 9.0], [0.8, 9.0], [0.9, 10.0], [1.0, 10.0], [1.1, 10.0], [1.2, 10.0], [1.3, 10.0], [1.4, 10.0], [1.5, 10.0], [1.6, 11.0], [1.7, 11.0], [1.8, 11.0], [1.9, 11.0], [2.0, 11.0], [2.1, 11.0], [2.2, 11.0], [2.3, 11.0], [2.4, 11.0], [2.5, 11.0], [2.6, 12.0], [2.7, 12.0], [2.8, 12.0], [2.9, 12.0], [3.0, 12.0], [3.1, 12.0], [3.2, 13.0], [3.3, 13.0], [3.4, 13.0], [3.5, 13.0], [3.6, 13.0], [3.7, 13.0], [3.8, 13.0], [3.9, 14.0], [4.0, 14.0], [4.1, 14.0], [4.2, 14.0], [4.3, 14.0], [4.4, 15.0], [4.5, 15.0], [4.6, 15.0], [4.7, 15.0], [4.8, 16.0], [4.9, 16.0], [5.0, 17.0], [5.1, 17.0], [5.2, 17.0], [5.3, 17.0], [5.4, 18.0], [5.5, 18.0], [5.6, 18.0], [5.7, 18.0], [5.8, 18.0], [5.9, 19.0], [6.0, 19.0], [6.1, 19.0], [6.2, 19.0], [6.3, 19.0], [6.4, 20.0], [6.5, 20.0], [6.6, 20.0], [6.7, 20.0], [6.8, 20.0], [6.9, 20.0], [7.0, 21.0], [7.1, 21.0], [7.2, 21.0], [7.3, 21.0], [7.4, 21.0], [7.5, 21.0], [7.6, 21.0], [7.7, 22.0], [7.8, 22.0], [7.9, 22.0], [8.0, 22.0], [8.1, 23.0], [8.2, 23.0], [8.3, 23.0], [8.4, 23.0], [8.5, 23.0], [8.6, 23.0], [8.7, 23.0], [8.8, 23.0], [8.9, 24.0], [9.0, 24.0], [9.1, 24.0], [9.2, 24.0], [9.3, 24.0], [9.4, 24.0], [9.5, 25.0], [9.6, 25.0], [9.7, 25.0], [9.8, 25.0], [9.9, 25.0], [10.0, 25.0], [10.1, 26.0], [10.2, 26.0], [10.3, 26.0], [10.4, 26.0], [10.5, 26.0], [10.6, 26.0], [10.7, 26.0], [10.8, 26.0], [10.9, 26.0], [11.0, 27.0], [11.1, 27.0], [11.2, 27.0], [11.3, 27.0], [11.4, 28.0], [11.5, 28.0], [11.6, 28.0], [11.7, 28.0], [11.8, 28.0], [11.9, 28.0], [12.0, 28.0], [12.1, 28.0], [12.2, 29.0], [12.3, 29.0], [12.4, 29.0], [12.5, 29.0], [12.6, 29.0], [12.7, 29.0], [12.8, 29.0], [12.9, 29.0], [13.0, 30.0], [13.1, 30.0], [13.2, 30.0], [13.3, 30.0], [13.4, 30.0], [13.5, 30.0], [13.6, 31.0], [13.7, 31.0], [13.8, 31.0], [13.9, 31.0], [14.0, 31.0], [14.1, 31.0], [14.2, 32.0], [14.3, 32.0], [14.4, 32.0], [14.5, 32.0], [14.6, 32.0], [14.7, 32.0], [14.8, 33.0], [14.9, 33.0], [15.0, 33.0], [15.1, 33.0], [15.2, 33.0], [15.3, 33.0], [15.4, 33.0], [15.5, 34.0], [15.6, 34.0], [15.7, 34.0], [15.8, 34.0], [15.9, 35.0], [16.0, 35.0], [16.1, 35.0], [16.2, 35.0], [16.3, 35.0], [16.4, 36.0], [16.5, 36.0], [16.6, 36.0], [16.7, 36.0], [16.8, 37.0], [16.9, 37.0], [17.0, 37.0], [17.1, 38.0], [17.2, 38.0], [17.3, 38.0], [17.4, 38.0], [17.5, 38.0], [17.6, 39.0], [17.7, 39.0], [17.8, 39.0], [17.9, 39.0], [18.0, 40.0], [18.1, 40.0], [18.2, 40.0], [18.3, 41.0], [18.4, 41.0], [18.5, 41.0], [18.6, 42.0], [18.7, 42.0], [18.8, 42.0], [18.9, 42.0], [19.0, 43.0], [19.1, 43.0], [19.2, 44.0], [19.3, 44.0], [19.4, 45.0], [19.5, 45.0], [19.6, 46.0], [19.7, 46.0], [19.8, 46.0], [19.9, 46.0], [20.0, 47.0], [20.1, 47.0], [20.2, 47.0], [20.3, 48.0], [20.4, 48.0], [20.5, 49.0], [20.6, 50.0], [20.7, 50.0], [20.8, 51.0], [20.9, 52.0], [21.0, 52.0], [21.1, 52.0], [21.2, 53.0], [21.3, 53.0], [21.4, 53.0], [21.5, 54.0], [21.6, 54.0], [21.7, 54.0], [21.8, 55.0], [21.9, 55.0], [22.0, 56.0], [22.1, 57.0], [22.2, 57.0], [22.3, 58.0], [22.4, 58.0], [22.5, 59.0], [22.6, 59.0], [22.7, 59.0], [22.8, 60.0], [22.9, 60.0], [23.0, 61.0], [23.1, 61.0], [23.2, 61.0], [23.3, 62.0], [23.4, 62.0], [23.5, 63.0], [23.6, 63.0], [23.7, 63.0], [23.8, 65.0], [23.9, 66.0], [24.0, 66.0], [24.1, 67.0], [24.2, 67.0], [24.3, 68.0], [24.4, 68.0], [24.5, 69.0], [24.6, 69.0], [24.7, 70.0], [24.8, 70.0], [24.9, 71.0], [25.0, 71.0], [25.1, 71.0], [25.2, 72.0], [25.3, 73.0], [25.4, 73.0], [25.5, 74.0], [25.6, 74.0], [25.7, 75.0], [25.8, 76.0], [25.9, 76.0], [26.0, 77.0], [26.1, 78.0], [26.2, 78.0], [26.3, 79.0], [26.4, 80.0], [26.5, 81.0], [26.6, 81.0], [26.7, 82.0], [26.8, 83.0], [26.9, 83.0], [27.0, 84.0], [27.1, 85.0], [27.2, 86.0], [27.3, 87.0], [27.4, 87.0], [27.5, 88.0], [27.6, 89.0], [27.7, 90.0], [27.8, 91.0], [27.9, 92.0], [28.0, 93.0], [28.1, 93.0], [28.2, 94.0], [28.3, 94.0], [28.4, 95.0], [28.5, 96.0], [28.6, 96.0], [28.7, 97.0], [28.8, 98.0], [28.9, 99.0], [29.0, 100.0], [29.1, 100.0], [29.2, 101.0], [29.3, 102.0], [29.4, 103.0], [29.5, 103.0], [29.6, 104.0], [29.7, 105.0], [29.8, 106.0], [29.9, 107.0], [30.0, 108.0], [30.1, 109.0], [30.2, 110.0], [30.3, 110.0], [30.4, 111.0], [30.5, 112.0], [30.6, 113.0], [30.7, 113.0], [30.8, 114.0], [30.9, 115.0], [31.0, 117.0], [31.1, 118.0], [31.2, 120.0], [31.3, 120.0], [31.4, 121.0], [31.5, 122.0], [31.6, 123.0], [31.7, 124.0], [31.8, 124.0], [31.9, 125.0], [32.0, 127.0], [32.1, 128.0], [32.2, 130.0], [32.3, 131.0], [32.4, 131.0], [32.5, 133.0], [32.6, 134.0], [32.7, 135.0], [32.8, 136.0], [32.9, 138.0], [33.0, 139.0], [33.1, 140.0], [33.2, 142.0], [33.3, 143.0], [33.4, 144.0], [33.5, 146.0], [33.6, 147.0], [33.7, 148.0], [33.8, 151.0], [33.9, 152.0], [34.0, 155.0], [34.1, 156.0], [34.2, 158.0], [34.3, 159.0], [34.4, 159.0], [34.5, 160.0], [34.6, 163.0], [34.7, 164.0], [34.8, 166.0], [34.9, 168.0], [35.0, 170.0], [35.1, 173.0], [35.2, 176.0], [35.3, 179.0], [35.4, 180.0], [35.5, 181.0], [35.6, 184.0], [35.7, 187.0], [35.8, 190.0], [35.9, 191.0], [36.0, 192.0], [36.1, 198.0], [36.2, 202.0], [36.3, 206.0], [36.4, 208.0], [36.5, 213.0], [36.6, 220.0], [36.7, 224.0], [36.8, 228.0], [36.9, 230.0], [37.0, 237.0], [37.1, 242.0], [37.2, 246.0], [37.3, 247.0], [37.4, 249.0], [37.5, 250.0], [37.6, 252.0], [37.7, 254.0], [37.8, 255.0], [37.9, 257.0], [38.0, 259.0], [38.1, 261.0], [38.2, 267.0], [38.3, 269.0], [38.4, 273.0], [38.5, 278.0], [38.6, 282.0], [38.7, 286.0], [38.8, 290.0], [38.9, 292.0], [39.0, 294.0], [39.1, 294.0], [39.2, 296.0], [39.3, 297.0], [39.4, 301.0], [39.5, 304.0], [39.6, 306.0], [39.7, 307.0], [39.8, 312.0], [39.9, 316.0], [40.0, 318.0], [40.1, 320.0], [40.2, 321.0], [40.3, 323.0], [40.4, 325.0], [40.5, 328.0], [40.6, 331.0], [40.7, 331.0], [40.8, 332.0], [40.9, 333.0], [41.0, 335.0], [41.1, 338.0], [41.2, 341.0], [41.3, 344.0], [41.4, 346.0], [41.5, 350.0], [41.6, 354.0], [41.7, 360.0], [41.8, 363.0], [41.9, 367.0], [42.0, 372.0], [42.1, 374.0], [42.2, 375.0], [42.3, 377.0], [42.4, 378.0], [42.5, 381.0], [42.6, 384.0], [42.7, 386.0], [42.8, 387.0], [42.9, 388.0], [43.0, 390.0], [43.1, 393.0], [43.2, 395.0], [43.3, 395.0], [43.4, 397.0], [43.5, 398.0], [43.6, 398.0], [43.7, 400.0], [43.8, 402.0], [43.9, 403.0], [44.0, 404.0], [44.1, 405.0], [44.2, 407.0], [44.3, 410.0], [44.4, 410.0], [44.5, 411.0], [44.6, 411.0], [44.7, 413.0], [44.8, 415.0], [44.9, 416.0], [45.0, 418.0], [45.1, 419.0], [45.2, 421.0], [45.3, 423.0], [45.4, 426.0], [45.5, 428.0], [45.6, 429.0], [45.7, 432.0], [45.8, 432.0], [45.9, 433.0], [46.0, 434.0], [46.1, 435.0], [46.2, 437.0], [46.3, 438.0], [46.4, 440.0], [46.5, 444.0], [46.6, 447.0], [46.7, 449.0], [46.8, 451.0], [46.9, 452.0], [47.0, 455.0], [47.1, 457.0], [47.2, 457.0], [47.3, 458.0], [47.4, 460.0], [47.5, 461.0], [47.6, 461.0], [47.7, 462.0], [47.8, 465.0], [47.9, 466.0], [48.0, 468.0], [48.1, 469.0], [48.2, 470.0], [48.3, 470.0], [48.4, 471.0], [48.5, 472.0], [48.6, 473.0], [48.7, 474.0], [48.8, 474.0], [48.9, 475.0], [49.0, 477.0], [49.1, 478.0], [49.2, 479.0], [49.3, 479.0], [49.4, 480.0], [49.5, 481.0], [49.6, 483.0], [49.7, 483.0], [49.8, 484.0], [49.9, 485.0], [50.0, 487.0], [50.1, 488.0], [50.2, 491.0], [50.3, 492.0], [50.4, 493.0], [50.5, 494.0], [50.6, 494.0], [50.7, 495.0], [50.8, 495.0], [50.9, 496.0], [51.0, 498.0], [51.1, 498.0], [51.2, 498.0], [51.3, 499.0], [51.4, 500.0], [51.5, 501.0], [51.6, 502.0], [51.7, 503.0], [51.8, 503.0], [51.9, 504.0], [52.0, 505.0], [52.1, 506.0], [52.2, 508.0], [52.3, 509.0], [52.4, 510.0], [52.5, 511.0], [52.6, 512.0], [52.7, 513.0], [52.8, 514.0], [52.9, 515.0], [53.0, 516.0], [53.1, 518.0], [53.2, 519.0], [53.3, 522.0], [53.4, 523.0], [53.5, 524.0], [53.6, 525.0], [53.7, 525.0], [53.8, 526.0], [53.9, 528.0], [54.0, 529.0], [54.1, 530.0], [54.2, 531.0], [54.3, 531.0], [54.4, 532.0], [54.5, 533.0], [54.6, 534.0], [54.7, 535.0], [54.8, 536.0], [54.9, 537.0], [55.0, 538.0], [55.1, 539.0], [55.2, 540.0], [55.3, 541.0], [55.4, 542.0], [55.5, 544.0], [55.6, 546.0], [55.7, 546.0], [55.8, 547.0], [55.9, 548.0], [56.0, 549.0], [56.1, 550.0], [56.2, 551.0], [56.3, 552.0], [56.4, 553.0], [56.5, 555.0], [56.6, 556.0], [56.7, 558.0], [56.8, 559.0], [56.9, 561.0], [57.0, 563.0], [57.1, 564.0], [57.2, 565.0], [57.3, 565.0], [57.4, 566.0], [57.5, 567.0], [57.6, 568.0], [57.7, 569.0], [57.8, 570.0], [57.9, 571.0], [58.0, 572.0], [58.1, 573.0], [58.2, 576.0], [58.3, 577.0], [58.4, 577.0], [58.5, 578.0], [58.6, 579.0], [58.7, 580.0], [58.8, 581.0], [58.9, 582.0], [59.0, 583.0], [59.1, 585.0], [59.2, 585.0], [59.3, 586.0], [59.4, 587.0], [59.5, 587.0], [59.6, 589.0], [59.7, 590.0], [59.8, 591.0], [59.9, 593.0], [60.0, 594.0], [60.1, 596.0], [60.2, 597.0], [60.3, 600.0], [60.4, 602.0], [60.5, 604.0], [60.6, 605.0], [60.7, 606.0], [60.8, 607.0], [60.9, 609.0], [61.0, 610.0], [61.1, 611.0], [61.2, 612.0], [61.3, 613.0], [61.4, 613.0], [61.5, 614.0], [61.6, 615.0], [61.7, 616.0], [61.8, 616.0], [61.9, 617.0], [62.0, 619.0], [62.1, 620.0], [62.2, 621.0], [62.3, 621.0], [62.4, 623.0], [62.5, 624.0], [62.6, 627.0], [62.7, 628.0], [62.8, 629.0], [62.9, 630.0], [63.0, 632.0], [63.1, 633.0], [63.2, 635.0], [63.3, 637.0], [63.4, 638.0], [63.5, 639.0], [63.6, 640.0], [63.7, 642.0], [63.8, 643.0], [63.9, 645.0], [64.0, 648.0], [64.1, 650.0], [64.2, 650.0], [64.3, 653.0], [64.4, 653.0], [64.5, 654.0], [64.6, 655.0], [64.7, 657.0], [64.8, 658.0], [64.9, 659.0], [65.0, 661.0], [65.1, 664.0], [65.2, 665.0], [65.3, 666.0], [65.4, 667.0], [65.5, 669.0], [65.6, 671.0], [65.7, 672.0], [65.8, 674.0], [65.9, 678.0], [66.0, 680.0], [66.1, 682.0], [66.2, 683.0], [66.3, 685.0], [66.4, 686.0], [66.5, 687.0], [66.6, 688.0], [66.7, 689.0], [66.8, 690.0], [66.9, 691.0], [67.0, 692.0], [67.1, 693.0], [67.2, 694.0], [67.3, 696.0], [67.4, 697.0], [67.5, 698.0], [67.6, 699.0], [67.7, 702.0], [67.8, 703.0], [67.9, 703.0], [68.0, 707.0], [68.1, 708.0], [68.2, 710.0], [68.3, 712.0], [68.4, 714.0], [68.5, 716.0], [68.6, 717.0], [68.7, 720.0], [68.8, 722.0], [68.9, 723.0], [69.0, 724.0], [69.1, 725.0], [69.2, 726.0], [69.3, 728.0], [69.4, 728.0], [69.5, 729.0], [69.6, 731.0], [69.7, 732.0], [69.8, 733.0], [69.9, 734.0], [70.0, 735.0], [70.1, 736.0], [70.2, 737.0], [70.3, 737.0], [70.4, 738.0], [70.5, 739.0], [70.6, 740.0], [70.7, 741.0], [70.8, 742.0], [70.9, 743.0], [71.0, 743.0], [71.1, 744.0], [71.2, 744.0], [71.3, 745.0], [71.4, 746.0], [71.5, 747.0], [71.6, 748.0], [71.7, 748.0], [71.8, 749.0], [71.9, 749.0], [72.0, 750.0], [72.1, 751.0], [72.2, 751.0], [72.3, 752.0], [72.4, 753.0], [72.5, 753.0], [72.6, 754.0], [72.7, 756.0], [72.8, 756.0], [72.9, 757.0], [73.0, 759.0], [73.1, 759.0], [73.2, 760.0], [73.3, 760.0], [73.4, 761.0], [73.5, 761.0], [73.6, 762.0], [73.7, 762.0], [73.8, 763.0], [73.9, 763.0], [74.0, 764.0], [74.1, 764.0], [74.2, 764.0], [74.3, 765.0], [74.4, 766.0], [74.5, 767.0], [74.6, 767.0], [74.7, 767.0], [74.8, 768.0], [74.9, 768.0], [75.0, 768.0], [75.1, 769.0], [75.2, 769.0], [75.3, 770.0], [75.4, 770.0], [75.5, 771.0], [75.6, 771.0], [75.7, 772.0], [75.8, 772.0], [75.9, 774.0], [76.0, 774.0], [76.1, 775.0], [76.2, 776.0], [76.3, 776.0], [76.4, 776.0], [76.5, 777.0], [76.6, 777.0], [76.7, 778.0], [76.8, 779.0], [76.9, 779.0], [77.0, 780.0], [77.1, 780.0], [77.2, 780.0], [77.3, 781.0], [77.4, 782.0], [77.5, 783.0], [77.6, 783.0], [77.7, 784.0], [77.8, 784.0], [77.9, 785.0], [78.0, 785.0], [78.1, 786.0], [78.2, 786.0], [78.3, 787.0], [78.4, 788.0], [78.5, 788.0], [78.6, 789.0], [78.7, 789.0], [78.8, 790.0], [78.9, 790.0], [79.0, 791.0], [79.1, 791.0], [79.2, 791.0], [79.3, 792.0], [79.4, 793.0], [79.5, 794.0], [79.6, 795.0], [79.7, 795.0], [79.8, 795.0], [79.9, 796.0], [80.0, 796.0], [80.1, 797.0], [80.2, 798.0], [80.3, 798.0], [80.4, 798.0], [80.5, 799.0], [80.6, 800.0], [80.7, 800.0], [80.8, 801.0], [80.9, 802.0], [81.0, 803.0], [81.1, 803.0], [81.2, 803.0], [81.3, 804.0], [81.4, 804.0], [81.5, 804.0], [81.6, 805.0], [81.7, 806.0], [81.8, 806.0], [81.9, 807.0], [82.0, 808.0], [82.1, 808.0], [82.2, 809.0], [82.3, 810.0], [82.4, 810.0], [82.5, 811.0], [82.6, 812.0], [82.7, 812.0], [82.8, 813.0], [82.9, 814.0], [83.0, 814.0], [83.1, 815.0], [83.2, 816.0], [83.3, 816.0], [83.4, 816.0], [83.5, 817.0], [83.6, 818.0], [83.7, 818.0], [83.8, 819.0], [83.9, 819.0], [84.0, 819.0], [84.1, 820.0], [84.2, 820.0], [84.3, 821.0], [84.4, 821.0], [84.5, 822.0], [84.6, 823.0], [84.7, 823.0], [84.8, 823.0], [84.9, 824.0], [85.0, 825.0], [85.1, 825.0], [85.2, 825.0], [85.3, 826.0], [85.4, 827.0], [85.5, 827.0], [85.6, 828.0], [85.7, 828.0], [85.8, 829.0], [85.9, 830.0], [86.0, 831.0], [86.1, 832.0], [86.2, 833.0], [86.3, 834.0], [86.4, 834.0], [86.5, 836.0], [86.6, 837.0], [86.7, 837.0], [86.8, 837.0], [86.9, 838.0], [87.0, 838.0], [87.1, 838.0], [87.2, 839.0], [87.3, 840.0], [87.4, 841.0], [87.5, 841.0], [87.6, 842.0], [87.7, 842.0], [87.8, 843.0], [87.9, 843.0], [88.0, 844.0], [88.1, 845.0], [88.2, 845.0], [88.3, 845.0], [88.4, 846.0], [88.5, 847.0], [88.6, 848.0], [88.7, 848.0], [88.8, 849.0], [88.9, 849.0], [89.0, 849.0], [89.1, 850.0], [89.2, 851.0], [89.3, 852.0], [89.4, 852.0], [89.5, 853.0], [89.6, 854.0], [89.7, 854.0], [89.8, 855.0], [89.9, 856.0], [90.0, 857.0], [90.1, 857.0], [90.2, 858.0], [90.3, 859.0], [90.4, 860.0], [90.5, 860.0], [90.6, 861.0], [90.7, 862.0], [90.8, 862.0], [90.9, 863.0], [91.0, 864.0], [91.1, 864.0], [91.2, 865.0], [91.3, 866.0], [91.4, 866.0], [91.5, 867.0], [91.6, 868.0], [91.7, 869.0], [91.8, 870.0], [91.9, 870.0], [92.0, 871.0], [92.1, 871.0], [92.2, 872.0], [92.3, 873.0], [92.4, 874.0], [92.5, 876.0], [92.6, 876.0], [92.7, 877.0], [92.8, 878.0], [92.9, 880.0], [93.0, 881.0], [93.1, 881.0], [93.2, 882.0], [93.3, 883.0], [93.4, 884.0], [93.5, 887.0], [93.6, 888.0], [93.7, 889.0], [93.8, 891.0], [93.9, 894.0], [94.0, 896.0], [94.1, 896.0], [94.2, 898.0], [94.3, 899.0], [94.4, 900.0], [94.5, 901.0], [94.6, 902.0], [94.7, 903.0], [94.8, 903.0], [94.9, 904.0], [95.0, 905.0], [95.1, 907.0], [95.2, 908.0], [95.3, 909.0], [95.4, 910.0], [95.5, 911.0], [95.6, 912.0], [95.7, 913.0], [95.8, 914.0], [95.9, 915.0], [96.0, 916.0], [96.1, 916.0], [96.2, 917.0], [96.3, 917.0], [96.4, 919.0], [96.5, 921.0], [96.6, 921.0], [96.7, 923.0], [96.8, 923.0], [96.9, 926.0], [97.0, 926.0], [97.1, 929.0], [97.2, 931.0], [97.3, 932.0], [97.4, 932.0], [97.5, 934.0], [97.6, 935.0], [97.7, 936.0], [97.8, 936.0], [97.9, 938.0], [98.0, 939.0], [98.1, 941.0], [98.2, 942.0], [98.3, 944.0], [98.4, 944.0], [98.5, 946.0], [98.6, 947.0], [98.7, 949.0], [98.8, 950.0], [98.9, 951.0], [99.0, 953.0], [99.1, 955.0], [99.2, 957.0], [99.3, 960.0], [99.4, 965.0], [99.5, 974.0], [99.6, 982.0], [99.7, 992.0], [99.8, 1016.0], [99.9, 1042.0]], "isOverall": false, "label": "HTTP Request", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
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
        data: {"result": {"minY": 1.0, "minX": 0.0, "maxY": 1506.0, "series": [{"data": [[0.0, 1506.0], [1100.0, 1.0], [600.0, 382.0], [300.0, 224.0], [700.0, 674.0], [800.0, 713.0], [100.0, 373.0], [400.0, 397.0], [200.0, 169.0], [900.0, 283.0], [500.0, 466.0], [1000.0, 12.0]], "isOverall": false, "label": "HTTP Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 1100.0, "title": "Response Time Distribution"}},
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
        data: {"result": {"minY": 2524.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 2676.0, "series": [{"data": [[0.0, 2676.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 2524.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 1.0, "title": "Synthetic Response Times Distribution"}},
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
        data: {"result": {"minY": 223.3959615384614, "minX": 1.76599338E12, "maxY": 223.3959615384614, "series": [{"data": [[1.76599338E12, 223.3959615384614]], "isOverall": false, "label": "Thread Group", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.76599338E12, "title": "Active Threads Over Time"}},
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
        data: {"result": {"minY": 9.0, "minX": 2.0, "maxY": 753.6129032258063, "series": [{"data": [[2.0, 438.5], [3.0, 201.0], [4.0, 197.0], [7.0, 302.6666666666667], [8.0, 250.0], [9.0, 251.0], [11.0, 283.5], [12.0, 335.0], [13.0, 333.0], [14.0, 294.0], [16.0, 290.5], [17.0, 289.0], [18.0, 56.0], [19.0, 317.0], [20.0, 317.0], [22.0, 405.0], [23.0, 338.0], [24.0, 58.0], [25.0, 388.0], [26.0, 380.0], [27.0, 375.0], [28.0, 373.0], [29.0, 369.0], [30.0, 415.0], [31.0, 417.0], [33.0, 418.0], [32.0, 77.0], [35.0, 604.0], [34.0, 471.0], [37.0, 69.0], [36.0, 506.0], [39.0, 500.0], [38.0, 358.0], [41.0, 362.0], [40.0, 123.0], [43.0, 535.0], [42.0, 109.0], [45.0, 95.0], [44.0, 531.0], [47.0, 565.0], [46.0, 616.0], [50.0, 389.0], [53.0, 107.0], [52.0, 564.0], [55.0, 34.5], [57.0, 54.5], [59.0, 114.5], [58.0, 406.5], [61.0, 26.0], [60.0, 9.0], [63.0, 71.0], [62.0, 36.0], [67.0, 30.0], [66.0, 31.0], [65.0, 586.0], [64.0, 102.25], [71.0, 71.5], [70.0, 284.66666666666663], [69.0, 42.0], [68.0, 95.0], [75.0, 129.75], [74.0, 84.0], [73.0, 114.0], [72.0, 12.0], [77.0, 93.0], [76.0, 203.625], [80.0, 606.0], [87.0, 195.57142857142856], [84.0, 192.16666666666666], [91.0, 125.99999999999999], [90.0, 144.0], [89.0, 123.55555555555556], [88.0, 59.0], [95.0, 174.33333333333331], [94.0, 249.75000000000003], [93.0, 148.83333333333334], [92.0, 207.0952380952381], [99.0, 161.0], [98.0, 96.0], [97.0, 112.45454545454545], [96.0, 133.5], [102.0, 270.3636363636364], [101.0, 200.95454545454547], [103.0, 112.54545454545455], [100.0, 174.4375], [107.0, 159.8], [104.0, 192.12499999999997], [105.0, 185.7272727272727], [106.0, 132.08333333333334], [110.0, 211.6842105263158], [108.0, 272.4444444444444], [109.0, 114.4], [111.0, 135.4], [115.0, 178.33333333333334], [114.0, 202.2857142857143], [113.0, 180.0], [112.0, 379.66666666666663], [119.0, 219.5], [118.0, 177.875], [117.0, 201.47619047619048], [116.0, 152.5], [123.0, 243.54545454545456], [122.0, 258.3333333333333], [121.0, 228.55555555555554], [120.0, 281.75], [127.0, 214.41666666666669], [126.0, 219.46153846153842], [125.0, 267.2608695652174], [124.0, 282.7647058823529], [135.0, 245.5], [134.0, 96.0], [133.0, 502.3333333333333], [132.0, 505.0], [130.0, 189.875], [131.0, 70.71428571428571], [129.0, 233.95], [128.0, 184.58823529411762], [143.0, 235.6060606060606], [142.0, 241.08333333333334], [141.0, 320.3636363636364], [140.0, 222.2], [139.0, 216.4666666666667], [138.0, 226.33333333333331], [136.0, 239.69230769230768], [137.0, 253.03225806451618], [151.0, 338.3333333333333], [150.0, 218.5], [148.0, 172.75], [146.0, 339.3571428571429], [147.0, 304.88888888888897], [145.0, 379.00000000000006], [144.0, 277.70588235294116], [149.0, 256.66666666666663], [159.0, 371.90476190476187], [158.0, 30.166666666666664], [157.0, 345.0833333333333], [156.0, 255.66666666666669], [155.0, 537.0], [154.0, 232.9], [153.0, 341.8], [152.0, 302.5555555555556], [167.0, 32.0], [165.0, 243.74999999999997], [163.0, 206.962962962963], [162.0, 250.7666666666666], [161.0, 337.0000000000001], [160.0, 330.9999999999999], [164.0, 576.0], [175.0, 333.84000000000003], [174.0, 328.0769230769231], [173.0, 313.2105263157895], [172.0, 240.99999999999994], [171.0, 391.7142857142857], [169.0, 465.0], [168.0, 235.25], [170.0, 341.8666666666667], [183.0, 355.6666666666667], [182.0, 272.0], [181.0, 328.45454545454544], [180.0, 406.13043478260875], [179.0, 320.78571428571433], [176.0, 335.3913043478261], [177.0, 361.7142857142857], [178.0, 233.86206896551724], [191.0, 544.0], [188.0, 16.333333333333332], [187.0, 228.2], [185.0, 486.3333333333333], [184.0, 392.875], [186.0, 455.8333333333333], [199.0, 404.0], [198.0, 477.0], [197.0, 421.46666666666664], [196.0, 567.0], [194.0, 204.8181818181818], [193.0, 475.44444444444446], [192.0, 298.6], [207.0, 418.8823529411765], [205.0, 298.84210526315786], [206.0, 432.86666666666673], [204.0, 383.0], [203.0, 481.8], [202.0, 457.0], [201.0, 429.75], [200.0, 371.2], [215.0, 507.9999999999999], [214.0, 377.2307692307692], [213.0, 546.8666666666666], [212.0, 346.75], [211.0, 59.333333333333336], [210.0, 390.0], [208.0, 370.44000000000005], [209.0, 334.92307692307696], [216.0, 358.5384615384616], [217.0, 504.55263157894734], [219.0, 411.1999999999999], [222.0, 513.7272727272727], [223.0, 593.8636363636363], [221.0, 473.90000000000003], [220.0, 558.3076923076922], [218.0, 477.8181818181818], [225.0, 358.6], [226.0, 495.0588235294118], [227.0, 437.179487179487], [224.0, 403.7777777777778], [230.0, 528.3666666666668], [231.0, 421.08000000000004], [229.0, 411.69565217391306], [228.0, 304.6666666666667], [232.0, 530.6363636363636], [235.0, 532.0909090909092], [236.0, 592.7058823529412], [234.0, 479.85714285714295], [238.0, 524.5833333333333], [239.0, 375.969696969697], [233.0, 382.6], [237.0, 432.3103448275862], [242.0, 518.3913043478261], [244.0, 449.375], [245.0, 547.0000000000001], [246.0, 582.4109589041094], [247.0, 549.6754385964911], [241.0, 422.6875], [243.0, 549.4358974358972], [240.0, 439.8181818181818], [250.0, 496.4181818181819], [248.0, 442.232], [253.0, 595.9333333333333], [254.0, 535.9900990099009], [255.0, 494.17525773195894], [252.0, 495.98630136986293], [251.0, 539.6301369863014], [249.0, 326.0714285714286], [270.0, 454.57894736842104], [259.0, 492.16101694915255], [260.0, 579.0500000000005], [261.0, 496.24], [262.0, 571.2200000000001], [263.0, 458.1525423728813], [256.0, 507.0944881889767], [258.0, 464.04210526315796], [257.0, 525.5204081632652], [268.0, 606.7999999999997], [271.0, 441.05882352941177], [264.0, 410.6585365853659], [269.0, 464.99999999999994], [266.0, 452.9333333333334], [265.0, 460.45161290322585], [267.0, 575.8723404255315], [273.0, 446.40909090909093], [272.0, 514.608695652174], [274.0, 493.1000000000001], [275.0, 660.9714285714286], [278.0, 579.391304347826], [277.0, 656.3823529411764], [276.0, 753.6129032258063], [279.0, 530.5853658536586], [280.0, 642.6153846153846], [286.0, 600.421052631579], [287.0, 645.1739130434781], [284.0, 401.73333333333335], [285.0, 639.8000000000001], [281.0, 368.5833333333333], [282.0, 704.7857142857141], [283.0, 350.40909090909093], [301.0, 603.0], [288.0, 646.5172413793102], [290.0, 541.0645161290322], [289.0, 674.4915254237286], [292.0, 649.6410256410256], [303.0, 287.2142857142857], [296.0, 465.4772727272727], [294.0, 472.4375], [295.0, 733.0869565217391], [293.0, 477.11764705882354], [291.0, 456.25000000000006], [300.0, 176.77777777777777], [299.0, 257.1], [298.0, 546.0], [297.0, 632.2727272727274]], "isOverall": false, "label": "HTTP Request", "isController": false}, {"data": [[223.3959615384614, 443.4576923076917]], "isOverall": false, "label": "HTTP Request-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 303.0, "title": "Time VS Threads"}},
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
        data : {"result": {"minY": 14690.0, "minX": 1.76599338E12, "maxY": 29856.666666666668, "series": [{"data": [[1.76599338E12, 29856.666666666668]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.76599338E12, 14690.0]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.76599338E12, "title": "Bytes Throughput Over Time"}},
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
        data: {"result": {"minY": 443.4576923076917, "minX": 1.76599338E12, "maxY": 443.4576923076917, "series": [{"data": [[1.76599338E12, 443.4576923076917]], "isOverall": false, "label": "HTTP Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.76599338E12, "title": "Response Time Over Time"}},
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
        data: {"result": {"minY": 443.07442307692276, "minX": 1.76599338E12, "maxY": 443.07442307692276, "series": [{"data": [[1.76599338E12, 443.07442307692276]], "isOverall": false, "label": "HTTP Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.76599338E12, "title": "Latencies Over Time"}},
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
        data: {"result": {"minY": 326.77711538461534, "minX": 1.76599338E12, "maxY": 326.77711538461534, "series": [{"data": [[1.76599338E12, 326.77711538461534]], "isOverall": false, "label": "HTTP Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.76599338E12, "title": "Connect Time Over Time"}},
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
        data: {"result": {"minY": 7.0, "minX": 1.76599338E12, "maxY": 1106.0, "series": [{"data": [[1.76599338E12, 1106.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.76599338E12, 7.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.76599338E12, 857.0]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.76599338E12, 953.0]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.76599338E12, 487.0]], "isOverall": false, "label": "Median", "isController": false}, {"data": [[1.76599338E12, 905.0]], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.76599338E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
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
    data: {"result": {"minY": 171.0, "minX": 31.0, "maxY": 816.0, "series": [{"data": [[516.0, 731.0], [555.0, 812.0], [558.0, 655.5], [571.0, 171.0], [587.0, 508.0], [600.0, 350.0], [322.0, 729.5], [453.0, 816.0], [509.0, 743.0], [498.0, 724.5], [31.0, 317.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 600.0, "title": "Response Time Vs Request"}},
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
    data: {"result": {"minY": 171.0, "minX": 31.0, "maxY": 816.0, "series": [{"data": [[516.0, 731.0], [555.0, 812.0], [558.0, 655.5], [571.0, 171.0], [587.0, 508.0], [600.0, 350.0], [322.0, 723.0], [453.0, 816.0], [509.0, 743.0], [498.0, 724.5], [31.0, 317.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 600.0, "title": "Latencies Vs Request"}},
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
        data: {"result": {"minY": 86.66666666666667, "minX": 1.76599338E12, "maxY": 86.66666666666667, "series": [{"data": [[1.76599338E12, 86.66666666666667]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.76599338E12, "title": "Hits Per Second"}},
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
        data: {"result": {"minY": 86.66666666666667, "minX": 1.76599338E12, "maxY": 86.66666666666667, "series": [{"data": [[1.76599338E12, 86.66666666666667]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.76599338E12, "title": "Codes Per Second"}},
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
        data: {"result": {"minY": 86.66666666666667, "minX": 1.76599338E12, "maxY": 86.66666666666667, "series": [{"data": [[1.76599338E12, 86.66666666666667]], "isOverall": false, "label": "HTTP Request-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.76599338E12, "title": "Transactions Per Second"}},
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
        data: {"result": {"minY": 86.66666666666667, "minX": 1.76599338E12, "maxY": 86.66666666666667, "series": [{"data": [[1.76599338E12, 86.66666666666667]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.76599338E12, "title": "Total Transactions Per Second"}},
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

