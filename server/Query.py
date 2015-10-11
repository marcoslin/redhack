__author__ = 'mel'
import xml.etree.ElementTree  as ET
from flask import Flask
from flask import request
from flask import jsonify
from flask import send_from_directory
import urllib2 as url
import json
import time
import datetime
tree = ET.parse('Kismet-20151010-15-04-59-1.xml')
e =  tree.getroot()
set = set()
for atype in e.iter('client-mac'):
    set.add(atype.text)


app = Flask(__name__)

@app.route("/numeropersone")
def trovapersone():
    return jsonify({"totale_persone":str(len(set))})

@app.route("/trovastazione")
def trovaStazione():
    results = []
    name = request.args.get("name")
    try:
        response = url.urlopen("http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/autocompletaStazione/"+url.quote(name))
    except Exception, ex:
        print(ex)

    for line in response.read().rstrip().split("\n"):
        arr = line.split("|")
        results.append({"name":str(arr[0]),"id":str(arr[1])})
    return jsonify({"results":results})

delay=0
orarioArrivoInStazione=0

@app.route("/setdelay")
def setdelay():
    global delay
    delay = 18000000
    return ""

@app.route("/setarrivostazione")
def setarrivostazione():
    global orarioArrivoInStazione
    orarioArrivoInStazione = 1444639200     #18:50 di oggi 11 ottobre 2015 in timestamp

    #ottengo tempo da google maps
    try:
        uerrelle = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=Rome+viale+jonio&destinations=rome+piazza+dei+cinquecento&mode=transit&transit_mode=bus&transit_routing_preference=less_walking&language=it-IT&key=AIzaSyBgmEtm167aJn5Gz4RM8dCpPX73ysVNUmk"
        response = url.urlopen(uerrelle).read()
    except Exception, ex:
        print(ex)
    data = json.loads(response)
    for prop in data["rows"]:
        for property in prop["elements"]:
            orarioArrivoInStazione = property["duration"]["value"]
            break

    orarioArrivoInStazione = 1444639200000  #hardcode 18:50:00
    return ""

def controllopartenza(orig,dest,time):
    #ottengo id del treno in partenza
    global delay
    try:
        uerrelle = "http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/soluzioniViaggioNew/"+orig[2:]+"/"+dest[2:]+"/"+time
        response = url.urlopen(uerrelle).read()
    except Exception, ex:
        print(ex)
    ###########
    data = json.loads(response)
    idTreno=""
    for prop in data["soluzioni"]:
        for property in prop["vehicles"]:
            if property["orarioPartenza"]==time:
                idTreno=property["numeroTreno"]
            break
        break
    try:
        uerrelle = "http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/andamentoTreno/"+orig+"/"+idTreno
        response = url.urlopen(uerrelle).read()
    except Exception, ex:
        print(ex)
    data = json.loads(response)
    orarioPartenza=0
    property = data["fermate"][0]
    orarioPartenza = property["partenza_teorica"]
    orarioPartenza+=delay                     #hardcode sul tempo di partenza
    #orarioPartenzaDatetime = datetime.datetime.fromtimestamp(orarioPartenza)

    if orarioPartenza<(orarioArrivoInStazione+600):     #10 minuti di tempo per arrivare al binario, quindi 11:30 di domenica 12 ottobre 2015
        return False
    return True

@app.route("/ritornasoluzionediviaggio")    #ritorna una soluzione di viaggio alternativa, (la successiva ), se in ritardo
def ritornaitinerario():
    response = ""
    orig = request.args.get("origine")
    dest = request.args.get("destinazione")
    time = request.args.get("orario")
    bool = controllopartenza(orig,dest,time)
    if bool:
        return jsonify({"status":"ok"})
    #cerco alternativa
    try:
        uerrelle = "http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/soluzioniViaggioNew/"+orig[2:]+"/"+dest[2:]+"/"+time
        response = url.urlopen(uerrelle).read()
    except Exception, ex:
        print(ex)

    data = json.loads(response)
    proposta = data["soluzioni"][0]
    return jsonify({"soluzione_alternativa_viaggio":proposta})


@app.route("/controlloitinerario")              #controllo sullo scambio
def controlloitinerario():
    results = []
    trenoOrig = request.args.get("trenodiorigine")
    stazioneCambio = request.args.get("stazionedicambio")
    trenoDest = request.args.get("trenodaprendere")
    orario  = getT1(stazioneCambio, trenoOrig)

    try:
        response = url.urlopen("http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/soluzioniViaggioNew/"+orig+"/"+dest+"/"+time)
    except Exception, ex:
        print(ex)

    return True

@app.route('/app/<path:path>')
def send_app(path):
    return send_from_directory('../app/www/', path)

@app.route('/app/')
def send_app_index():
    return send_from_directory('../app/www/', 'index.html')

def getT1(stationId, trainId):
    try:
        response = url.urlopen("http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/andamentoTreno/"+stationId+"/"+trainId)
    except Exception, ex:
        print(ex)
    t1 = None
    var = response.read()
    data = json.loads(var)
    for stop in data["fermate"]:
        if stop["id"] == str(stationId):
            t1 = datetime.fromtimestamp(time.gmtime(stop["partenza_teorica"]))
            timedelta = datetime.timedelta(minutes=stop["ritardo"])
    return t1+timedelta





if __name__ == "__main__":
    app.run(debug=True) #host='10.10.1.40'
