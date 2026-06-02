import urllib.request
import json

data = json.dumps({"username":"testuser3","email":"test3@test.com","password":"password"}).encode('utf-8')
req = urllib.request.Request("http://localhost:8080/api/v1/auth/register", data=data, headers={'Content-Type': 'application/json'})
try:
    response = urllib.request.urlopen(req)
    result = json.loads(response.read().decode('utf-8'))
    token = result['token']
    
    req_estado = urllib.request.Request("http://localhost:8080/api/v1/juego/estado", headers={'Authorization': 'Bearer ' + token})
    res_estado = urllib.request.urlopen(req_estado)
    print("ESTADO:")
    print(res_estado.read().decode('utf-8'))

    req_evento = urllib.request.Request("http://localhost:8080/api/v1/juego/provincia/1/evento", headers={'Authorization': 'Bearer ' + token})
    res_evento = urllib.request.urlopen(req_evento)
    print("EVENTO:")
    print(res_evento.read().decode('utf-8'))
except Exception as e:
    print(e)
    if hasattr(e, 'read'):
        print(e.read().decode('utf-8'))
