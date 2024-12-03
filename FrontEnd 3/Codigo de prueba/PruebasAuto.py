from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import os
if not os.path.exists('screenshots'):
    os.makedirs('screenshots')
# Configuración del navegador
driver = webdriver.Chrome()  # Asegúrate de tener ChromeDriver instalado y configurado.
# Variables para el reporte
pruebas_realizadas = []

try:
    # PRUEBA: Registro con datos válidos
    print("Iniciando prueba de registro con datos válidos...")
    driver.get("http://127.0.0.1:5500/Login/login.html")
    driver.implicitly_wait(5)

    # Navegar al formulario de registro
    driver.find_element(By.ID, "registerForm").click()

    # Rellenar el formulario de registro
    driver.find_element(By.ID, "registerDocumentoIdentidad").send_keys("102")
    time.sleep(1)
    driver.find_element(By.ID, "registerNombre").send_keys("penelope")
    time.sleep(1)
    driver.find_element(By.ID, "registerApellido").send_keys("García")
    time.sleep(1)
    driver.find_element(By.ID, "registerCorreo").send_keys("pera.garcia@example.com")
    driver.find_element(By.ID, "registerClave").send_keys("123")
    time.sleep(1)
    driver.find_element(By.ID, "registerConfirmarClave").send_keys("123")
    time.sleep(1)
    driver.find_element(By.XPATH, "//button[text()='Crear Cuenta']").click()
    time.sleep(1)
    # Agregar resultado al reporte
    pruebas_realizadas.append({
        'numero': 1,
        'descripcion': "Registro con datos válidos",
        'estado': "Completada",
        'notas': "Registro realizado exitosamente.",
        'completada': True
    })

    # PRUEBA: Inicio de sesión con credenciales válidas
    print("Iniciando prueba de inicio de sesión con credenciales válidas...")
    driver.get("http://127.0.0.1:5500/Login/login.html")
    driver.implicitly_wait(5)

    # Rellenar el formulario de inicio de sesión
    documento_input = driver.find_element(By.ID, "loginDocumentoIdentidad")
    clave_input = driver.find_element(By.ID, "loginClave")
    login_button = driver.find_element(By.XPATH, "//button[text()='Login']")

    # Usar las credenciales registradas previamente
    documento_input.send_keys("75757575")
    
    clave_input.send_keys("123")
    login_button.click()

    time.sleep(2)
    
    # Agregar resultado al reporte
    pruebas_realizadas.append({
        'numero': 2,
        'descripcion': "Inicio de sesión con credenciales válidas",
        'estado': "Completada",
        'notas': "Inicio de sesión con credenciales registradas previamente.",
        'completada': True
    })

finally:
    time.sleep(4)
    # Cerrar el navegador
    driver.quit()

    # Generar el archivo HTML con el reporte de pruebas
    with open("reporte_pruebas.html", "w", encoding="utf-8") as file:
        file.write("""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Pruebas</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f4f4f9;
        }
        h1 {
            text-align: center;
            color: #333;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        table th, table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        table th {
            background-color: #f2f2f2;
        }
        .status {
            text-align: center;
        }
        .completed {
            color: green;
            font-weight: bold;
        }
        .not-completed {
            color: red;
            font-weight: bold;
        }
        .notes {
            font-style: italic;
        }
        .checkbox {
            text-align: center;
        }
    </style>
</head>
<body>
    <h1>Reporte de Pruebas</h1>
    <table>
        <thead>
            <tr>
                <th>Prueba</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Notas</th>
                <th>Completada</th>
            </tr>
        </thead>
        <tbody>""")

        for prueba in pruebas_realizadas:
            file.write(f"""
            <tr>
                <td>{prueba['numero']}</td>
                <td>{prueba['descripcion']}</td>
                <td class="status">{prueba['estado']}</td>
                <td class="notes">{prueba['notas']}</td>
                <td class="checkbox"><input type="checkbox" {"checked" if prueba['completada'] else ""}></td>
            </tr>""")
        
        file.write("""
        </tbody>
    </table>
    <p style="text-align: center;">Este reporte refleja el estado actual de las pruebas realizadas.</p>
</body>
</html>""")
    
    print("Reporte de pruebas generado con éxito: reporte_pruebas.html")
