# Wildlife-Rehab-Dashboard

## Background
The [May Wildlife Rehabilitation Center](https://www.lmc.edu/academics/may-wildlife-center/index.htm) at Lees McRae College accepts and treats a wide variety of wildlife from the Western NC region. The center utilizes the [RaptorMed](https://www.raptormed.com/) database system to log its patient data. Five years of records from more than 7,000 animals and 200 unique species was pulled to create an interactive dashboard that lets users see the broad scope of the work done by the clinic.

## Instructions to Run the Scriptgit 
Download the github repo into a folder and navigate to the folder using Terminal or bash. Run `python flaskapp.py` in the command line to activate the Flask API. Then use [this link](https://robotscott94.github.io/LMC-May-Wildlife-Rehab-Dashboard/) to view the dashboard. The index.htlm file can also be opened using LiveServer.

## Tools
Pandas was used to clean and process the data which was loaded into a database. A Flask API connects our data to the JavaScript webpage. Leaflet and Highcharts were used in generating the visualizations.

## Result
The webpage shows a bubble chart breakdown of species grouped by animal class. A map illustrates the locations many patients were found, and a line chart shows the cyclical nature of patient volumes seen through various years. Finally, the current patients of the center are listed at the bottom of the page along with pictures of some previous patients.

## Future Plans
More visuals will be added in the future. Also, plans are in place to expand of the scope of the data to include the entire patient history. Live updates will also be available.
