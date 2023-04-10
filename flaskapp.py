# Import dependencies
import numpy as np
import pandas as pd
import datetime as dt

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect, Column, Integer, String, desc, distinct

from flask import Flask, jsonify
from flask_cors import CORS


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///MayWildlifeCenterHist.db")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(autoload_with=engine, reflect = True)

# Save reference to the table
Patients = Base.classes.Patients
Animals = Base.classes.Animals
Places = Base.classes.Places
StatusCodes = Base.classes.StatusCodes

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
CORS(app)


@app.route("/")
def welcome():
    """May Wildlife Sample Data."""
    return (
        f"Available Routes:<br/>"
        f"/api/patients<br/>"
        f"/api/statuscodes<br/>"
        f"/api/animals<br/>"
        f"/api/locations<br/>"
    )


@app.route("/api/patients")
def patients():
    session = Session(engine)
    results = session.query(Patients).all()
    session.close()

    patient_arr = []

    for i in results:
        patient_dict = {}
        patient_dict['patient_id'] = i.patient_id
        patient_dict['admission_date'] = i.admission_date
        patient_dict['species'] = i.species
        patient_dict['found_city'] = i.found_city
        patient_dict['found_county'] = i.found_county
        patient_dict['status'] = i.status
        patient_dict['final_date'] = i.final_date
        patient_dict['stay_length'] = i.stay_length
        patient_arr.append(patient_dict)

    return jsonify(patient_arr)

@app.route("/api/statuscodes")
def statuscodes():
    session = Session(engine)
    results = session.query(StatusCodes).all()
    session.close()

    status_arr = []

    for i in results:
        status_dict = {}
        status_dict['status'] = i.status
        status_dict['status_meaning'] = i.status_meaning
        status_dict['status_count'] = i.status_count
        status_arr.append(status_dict)

    return jsonify(status_arr)


@app.route("/api/animals")
def animals():
    session = Session(engine)
    results = session.query(Animals).all()
    session.close()

    animals_arr = []

    for i in results:
        animals_dict = {}
        animals_dict['species'] = i.species
        animals_dict['common_name'] = i.common_name
        animals_dict['species_count'] = i.species_count
        animals_dict['animal_class'] = i.animal_class
        animals_arr.append(animals_dict)

    return jsonify(animals_arr)

@app.route("/api/locations")
def locations():
    session = Session(engine)
    results = session.query(Places).all()
    session.close()

    places_arr = []

    for i in results:
        places_dict = {}
        places_dict['found_county'] = i.found_county
        places_dict['state'] = i.state
        places_dict['state_code'] = i.state_code
        places_dict['county_count'] = i.county_count
        places_dict['county_lat'] = i.county_lat
        places_dict['county_lon'] = i.county_lon
        places_arr.append(places_dict)

    return jsonify(places_arr)



if __name__ == '__main__':
    app.run(debug=True, port=5001)










