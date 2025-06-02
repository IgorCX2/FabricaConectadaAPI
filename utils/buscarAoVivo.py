import requests
import json
import pyodbc
import time
from datetime import datetime, timedelta
import win32com.client
import os
import re


#Url e Headers
dataAtual = datetime.today().strftime('%Y-%m-%d')
urlSynoptic = "http://10.36.216.25:9095/G0003/V1/ReportSynoptic"
urlProduzidas = "http://10.36.216.25:9095/G0050/V1/Table"
data = json.loads('''{"map":0,"mapMov":0,"startDate":"2025-05-12","endDate":"2025-05-12","filterPresets":[],"filterRows":[{"label":"G0003.CodeUnit","type":"radio","hidden":0,"filterId":"TABLETAB","options":[{"type":null,"label":"G0003.unit1Factor","value":"true","name":"unit1Factor","id":0,"startTime":null,"endTime":null},{"type":null,"label":"G0003.unit2Factor","value":"false","name":"unit2Factor","id":1,"startTime":null,"endTime":null},{"type":null,"label":"G0003.unit3Factor","value":"false","name":"unit3Factor","id":2,"startTime":null,"endTime":null}]},{"label":"G0003.OPCode","type":"text","hidden":0,"filterId":"TABLETAB","options":[{"type":null,"label":"G0003.CodeOrder","value":"","name":"CodeOrder","id":0,"startTime":null,"endTime":null}]},{"label":"G0003.CodeOperation","type":"text","hidden":0,"filterId":"TABLETAB","options":[{"type":null,"label":"G0003.OperationCode","value":"","name":"OperationCode","id":0,"startTime":null,"endTime":null}]},{"label":"G0003.TOP","type":"text","hidden":0,"filterId":"TABLETAB","options":[{"type":null,"label":"G0003.TOP","value":"1000000","name":"TOP","id":1,"startTime":null,"endTime":null}]},{"label":"GLOBAL.FONTSIZE","type":"text","hidden":0,"filterId":"TABLETAB","options":[{"type":null,"label":"GLOBAL.FONTSIZE","value":"14","name":"FONTSIZE","id":1,"startTime":null,"endTime":null}]},{"label":"GLOBAL.COLUMNSIZE","type":"radio","hidden":0,"filterId":"TABLETAB","options":[{"type":null,"label":"GLOBAL.CUSTOM","value":"true","name":"CUSTOM","id":1,"startTime":null,"endTime":null},{"type":null,"label":"GLOBAL.AUTOSIZE","value":"false","name":"AUTOSIZE","id":2,"startTime":null,"endTime":null},{"type":null,"label":"GLOBAL.SIZETOFIT","value":"false","name":"SIZETOFIT","id":3,"startTime":null,"endTime":null},{"type":null,"label":"GLOBAL.SKIPHEADER","value":"false","name":"SKIPHEADER","id":4,"startTime":null,"endTime":null}]}],"shift":null,"carouselPageIds":[],"product":[],"productFamily":[],"productType":[],"advTClass":"","shiftTeam":1,"tabTitle":"TABLETAB","treeViewParams":{"hierarchy":0,"key":"PLANT_1","Value":"1","isConsolidatedPeriod":false,"IsConsolidatedPeriodHeader":false,"disableCheckbox":false,"title":"Hutchinson (HBA)","selectedVision":1,"viewInit":true,"treeViewParams":null},"treeViewMainNode":{"Value":"1","hierarchy":0,"isConsolidatedPeriod":false,"key":"PLANT_1","selectedVision":1,"title":"Hutchinson (HBA)","viewInit":true,"treeViewParams":null},"treeChecks":[{"hierarchy":0,"key":"PLANT_1","Value":"1","isConsolidatedPeriod":false,"disableCheckbox":false,"title":"Hutchinson (HBA)","viewInit":true,"treeViewParams":null}],"lang":"pt","indicators":"PCFACINDICATORS"}''')
dataProduzidas = {"map":0,"mapMov":0,"startDate":str(dataAtual),"endDate":str(dataAtual),"filterPresets":[],"filterRows":[{"label":"G0050.CodeUnit","type":"radio","hidden":0,"filterId":"TABLETAB","options":[{"type":None,"label":"G0050.unit1Factor","value":"true","name":"unit1Factor","id":0,"startTime":None,"endTime":None},{"type":None,"label":"G0050.unit2Factor","value":"false","name":"unit2Factor","id":1,"startTime":None,"endTime":None},{"type":None,"label":"G0050.unit3Factor","value":"false","name":"unit3Factor","id":2,"startTime":None,"endTime":None}]},{"label":"G0050.CodeOperation","type":"text","hidden":0,"filterId":"TABLETAB","options":[{"type":None,"label":"G0050.OperationCode","value":"","name":"OperationCode","id":0,"startTime":None,"endTime":None}]},{"label":"G0050.PiecesType","type":"radio","hidden":0,"filterId":"TABLETAB","options":[{"type":None,"label":"G0050.GoodPieces","value":"true","name":"GoodPieces","id":0,"startTime":None,"endTime":None},{"type":None,"label":"G0050.Scrap","value":"false","name":"Scrap","id":1,"startTime":None,"endTime":None},{"type":None,"label":"G0050.Rework","value":"false","name":"Rework","id":2,"startTime":None,"endTime":None}]},{"label":"G0050.TIME","type":"timeSelectFilter","hidden":0,"filterId":"TABLETAB","options":[{"type":None,"label":"G0050.TIME","value":"","name":"TIME","id":0,"startTime":None,"endTime":None}]},{"label":"G0050.TOP","type":"text","hidden":0,"filterId":"TABLETAB","options":[{"type":None,"label":"G0050.TOP","value":"1000000","name":"TOP","id":1,"startTime":None,"endTime":None}]},{"label":"GLOBAL.FONTSIZE","type":"text","hidden":0,"filterId":"TABLETAB","options":[{"type":None,"label":"GLOBAL.FONTSIZE","value":"14","name":"FONTSIZE","id":1,"startTime":None,"endTime":None}]},{"label":"GLOBAL.COLUMNSIZE","type":"radio","hidden":0,"filterId":"TABLETAB","options":[{"type":None,"label":"GLOBAL.CUSTOM","value":"true","name":"CUSTOM","id":1,"startTime":None,"endTime":None},{"type":None,"label":"GLOBAL.AUTOSIZE","value":"false","name":"AUTOSIZE","id":2,"startTime":None,"endTime":None},{"type":None,"label":"GLOBAL.SIZETOFIT","value":"false","name":"SIZETOFIT","id":3,"startTime":None,"endTime":None},{"type":None,"label":"GLOBAL.SKIPHEADER","value":"false","name":"SKIPHEADER","id":4,"startTime":None,"endTime":None}]}],"shift":None,"carouselPageIds":[],"product":[],"productFamily":[],"productType":[],"advTClass":"","shiftTeam":1,"tabTitle":"TABLETAB","treeViewParams":{"Value":"1","hierarchy":0,"isConsolidatedPeriod":False,"key":"PLANT_1","title":"Hutchinson (HBA)","viewInit":False,"selectedVision":1,"treeViewParams":None},"treeViewMainNode":{"Value":"1","hierarchy":0,"isConsolidatedPeriod":False,"key":"PLANT_1","selectedVision":1,"title":"Hutchinson (HBA)","viewInit":True,"treeViewParams":None},"treeChecks":[],"lang":"pt","indicators":"PCFACINDICATORS"}

#Conn banco
conn_str = (
    'DRIVER={ODBC Driver 17 for SQL Server};'
    'SERVER=localhost\FABRICACONECTADA,1433;'
    'DATABASE=componentes;'
    'UID=sa;'
    'PWD=Ig@rCX2;'
    'Trusted_Connection=no;'
)
areaAPU = {'MM-ACA':'moldados',"RT-ACA":'retentores',"PL-INJ":'retentores',"RT-PR":'retentores',"RT-EST":'retentores',"APU2-ORING":"oring","APU1-FREIOS":"freios","APU2-FREIOS":"freios","MM-EXT": "moldados","MM-500T APU 1": "moldados", "MM-500T APU 2": "moldados", "MM-500T APU 3": "moldados", "MM-500T APU 4": "moldados", "MM-500T APU 5": "moldados", "MM-500T APU 6": "moldados", "MM-500T APU 7": "moldados", "MM-500T APU 8": "moldados"}
codigosStatusParda = ['0102','0707','9992','0304','0303','0302','0003','0704','0802','0703','0006','1206','0903','0710','0704', '0414', '0405', '0406', '0407','0305','0419','0420','0421','0422','0713','1101','0707','0002','0505','0722','0201']
lista_estufas = ["ES-1781", "ES-1861", "EST-1486", "A-1485", "ES-1347", "ES-1785",'ES-562','ES-1833','ES-1453']

horas_por_turno = {
    "1º": ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
    "2º": ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'],
    "3º": ['23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00']
}

def requisicao_com_retry(url, json, tentativas=4, delay=20):
    headers = {"x-api-key":"IHVSDMr8ZXcG6oGY9"}
    for tentativa in range(tentativas):
        print("Tentando conectar")
        try:
            resp = requests.post(url, headers=headers, json=json, timeout=50)
            resp.raise_for_status()
            return resp
        except Exception as e:
            print(f"Erro ao acessar {url} (tentativa {tentativa + 1}/{tentativas}): {e}")
            time.sleep(delay)
    raise Exception(f"Falha ao obter dados da API após {tentativas} tentativas.")

def somar_turno_simples(producao_por_hora, turno):
    horas_validas = horas_por_turno.get(turno, [])
    total = 0
    for hora in horas_validas:
        valor = producao_por_hora.get(hora)
        if valor:
            total += float(valor)
    return total

def gerar_lote(data=None, turno='M'):
    if data is None:
        data = datetime.now()
    ano = str(data.year)[-2:]                     
    semana = f"{data.isocalendar().week:02d}"      
    dia_semana = (data.weekday() + 2) % 7                  
    return f"{ano}-{semana}-{dia_semana}-{turno}"

def registros_diferentes(novo, antigo):
    if novo.get('supLevel2Code') == 'MM-ACA':
        if novo.get('resourcecode')[0:3] == 'ES-':
            return "Produto"
        else: return None
    
    if novo.get('rscode') == "9995" or novo.get('rscode') == "Troca Setup":
        return "Setup"
    
    if not antigo:
        return "Historico"
    
    if novo.get('prodcode') == antigo.get('prodcode'):
        if novo.get('wohdcode') != antigo.get('wohdcode'):
            return "Ordem"
        else: return 'Revalidacao'
    else: return "Produto"

        

def AtualizarBanco():
    data_hoje = datetime.now().date()
    data_ontem = data_hoje- timedelta(days=1)
    turnoAtual = requests.get('http://localhost:3001/api/sistema/turno-atual')
    lote = gerar_lote(turno=turnoAtual)
    try:
        resp_synoptic = requisicao_com_retry(urlSynoptic, data)
        resp_produzidas = requisicao_com_retry(urlProduzidas, dataProduzidas)
        dados_synoptic = resp_synoptic.json().get('myData',[])
        dados_produzidas = resp_produzidas.json().get('myData',[]) 
        print("• Dados retornados com sucesso")
        with pyodbc.connect(conn_str) as conn:
            cursor = conn.cursor()

            # Aqui eu falo que todas as estufas estao recurada, para dps ver qual esta produzindo
            placeholders = ','.join(['?'] * len(lista_estufas))
            query = f"UPDATE fichaSiq SET statusPCF = 'Recurada' WHERE status = 'aberto' AND resourcecode IN ({placeholders})"
            cursor.execute(query, lista_estufas)
            conn.commit()

            #Aqui eu finalizo as revalidacoes e as liberações
            cursor.execute("""UPDATE fichaSiq SET status = 'encerrado' WHERE (status = 'aberto' AND tipo = 'Revalidacao' AND turno <> ? AND data_abertura BETWEEN ? AND ?) OR (status = 'finalizado' AND turno <> ?)""", (turnoAtual, data_ontem, data_hoje, turnoAtual))
            conn.commit()

            cursor.execute("SELECT resourcecode, rscode, userstartedstatus,wohdcode, prodcode, rscomment,supLevel2Code FROM StatusAoVivo")
            antigos = {row.resourcecode: {'supLevel2Code':row.supLevel2Code,'resourcecode': row.resourcecode, 'rscode': row.rscode, 'userstartedstatus': row.userstartedstatus, 'wohdcode': row.wohdcode, 'prodcode': row.prodcode, 'rscomment': row.rscomment} for row in cursor.fetchall()}
            
            query = """SELECT resourcecode, wohdcode, prodcode, id, liberacao, t01, f01, turno, statusPCF, tipo FROM fichaSiq WHERE (status = 'aberto' OR status = 'finalizado') AND data_abertura BETWEEN ? AND ?"""
            cursor.execute(query, (data_ontem, data_hoje))
            rows = cursor.fetchall()
            historicoSIQ_maquina = {row.resourcecode: {'tipo': row.tipo, 'rsname': row.statusPCF, 'wohdcode': row.wohdcode, 'prodcode': row.prodcode, 'cod': row.id, 'l': row.liberacao, 't': row.t01, 'f': row.f01, 'turno': row.turno} for row in rows}
            historicoPeca = {row.prodcode: {'maquina':row.resourcecode, 'tipo': row.tipo, 'rsname': row.statusPCF, 'wohdcode': row.wohdcode, 'prodcode': row.prodcode, 'cod': row.id, 'l': row.liberacao, 't': row.t01, 'f': row.f01, 'turno': row.turno} for row in rows}
            
            for novo in dados_synoptic:
                if novo.get('supLevel2Code') in areaAPU and novo.get('resourcecode') not in ['MIV-1394', 'R-1606', 'R-1782','MINSA-1314','MINSA-1622','EX-696'] and novo and novo.get('prodcode') is not None and novo.get('wohdcode') is not None and novo.get('prodcode') != "" and novo.get('wohdcode') != "":
                    antigo = antigos.get(novo.get("resourcecode"))
                    siq_maquina = historicoSIQ_maquina.get(novo.get("resourcecode"))
                    comparativo = registros_diferentes(novo, antigo)
                    siq_peca = historicoPeca.get(novo.get("prodcode"))

                    produzidos = [product for product in dados_produzidas if product['wohdCode'] == novo.get('wohdcode', '')]
                    if produzidos:
                        produzidosTotao = somar_turno_simples(produzidos[0], turnoAtual)
                    else:
                        produzidosTotao = 0

                    parada = True
                    if novo.get('rscode') in codigosStatusParda:
                         parada = False

                    l = 'sistema'

                    if comparativo != "Revalidacao":
                        l = None

                    if novo.get("resourcecode") in lista_estufas:
                        if siq_peca is None:
                            print("Abrir SIQ da estufa: "+novo.get("resourcecode")+novo.get('wohdcode'))
                            cursor.execute("INSERT INTO fichaSiq (resourcecode, prodcode, wohdcode, tipo, userstartedstatus,data_abertura,status,planta,f01,t01,statusPCF,qtd,supLevel2Code,turno) VALUES (?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?)",novo.get("resourcecode"), novo.get('prodcode') ,lote, "Produto", novo.get('userstartedstatus'),data_hoje,'aberto',areaAPU[novo.get('supLevel2Code')], 'sistema', 'sistema',novo.get('rsname'),produzidosTotao,novo.get('supLevel2Code', ''),turnoAtual)
                        
                        else: cursor.execute("UPDATE fichaSiq SET statusPCF = ? WHERE prodcode = ?", "Produção", novo.get('prodcode'))
                    else:
                        if comparativo is not None:
                            if siq_maquina:
                                if siq_maquina.get('wohdcode') != novo.get('wohdcode') or siq_maquina.get('prodcode') != novo.get('prodcode'):
                                      cursor.execute("UPDATE fichaSiq SET status = 'encerrada' WHERE wohdcode = ?", siq_maquina.get('wohdcode'))
                                      if parada: 
                                        cursor.execute("INSERT INTO fichaSiq (resourcecode, prodcode, wohdcode, tipo, userstartedstatus,data_abertura,status,planta,liberacao,statusPCF,qtd,supLevel2Code,turno) VALUES (?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?)",novo.get("resourcecode"), novo.get('prodcode'),novo.get('wohdcode'), comparativo, novo.get('userstartedstatus'),data_hoje,'aberto',areaAPU[novo.get('supLevel2Code')], l,novo.get('rsname'),produzidosTotao,novo.get('supLevel2Code', ''),turnoAtual)
                                else:
                                    cursor.execute("UPDATE fichaSiq SET statusPCF = ?, qtd = ? WHERE wohdcode = ?", novo.get('rsname'),produzidosTotao,siq_maquina.get('wohdcode'))
                            else:
                                if parada: 
                                    cursor.execute("INSERT INTO fichaSiq (resourcecode, prodcode, wohdcode, tipo, userstartedstatus,data_abertura,status,planta,liberacao,statusPCF,qtd,supLevel2Code,turno) VALUES (?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?)",novo.get("resourcecode"), novo.get('prodcode'),novo.get('wohdcode'), comparativo, novo.get('userstartedstatus'),data_hoje,'aberto',areaAPU[novo.get('supLevel2Code')], l,novo.get('rsname'),produzidosTotao,novo.get('supLevel2Code', ''),turnoAtual)                               
            conn.commit()
            cursor.execute("DELETE FROM StatusAoVivo")
            conn.commit()

            for novo in dados_synoptic:
                if novo.get('wohdcode') == None or novo.get('prodcode') == None:
                    if antigos.get(novo.get('resourcecode')):
                        novo = antigos.get(novo.get('resourcecode'))

                if novo.get('wohdcode') != None:
                    cursor.execute(
                        "INSERT INTO StatusAoVivo (supLevel2Code, resourcecode, rscode, userstartedstatus, wohdcode, prodcode,rscomment) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        novo.get('supLevel2Code'), novo.get('resourcecode'), novo.get('rscode'), novo.get('userstartedstatus'), novo.get('wohdcode'), novo.get('prodcode'), novo.get('rscomment')
                    )
            conn.commit()
            print("Concluido")

    except Exception as e: 
        print("⛔ Erro ao executar a função calcularNovo:")
        print(str(e))    

if __name__ == "__main__":
    AtualizarBanco()

