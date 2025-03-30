# Aplicación Web NOM-035

Esta es una aplicación web desarrollada para aplicar los cuestionarios de la **NOM-035** y evaluar los factores de riesgo psicosocial en el entorno laboral. La aplicación permite a los trabajadores responder los cuestionarios, calcular los resultados y generar reportes con recomendaciones.

---

## Tabla de Contenidos

1. [Descripción](#descripción)
2. [Funcionalidades](#funcionalidades)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Instalación y Configuración](#instalación-y-configuración)
5. [Uso](#uso)
6. [Estructura del Proyecto](#estructura-del-proyecto)

---

## Descripción

La aplicación web NOM-035 está diseñada para ayudar a las organizaciones a cumplir con los requisitos de la **Norma Oficial Mexicana NOM-035**, que tiene como objetivo identificar y prevenir los factores de riesgo psicosocial en el trabajo.

### Características:
- Aplicar cuestionarios digitales a los trabajadores.
- Calcular automáticamente los niveles de riesgo psicosocial.
- Generar reportes con recomendaciones personalizadas.
- Almacenar los resultados en una base de datos para su posterior análisis.

---

## Funcionalidades

- **Cuestionarios Digitales**:
  - Factores de Riesgo Psicosocial.
  - Evaluación del Entorno Organizacional.

- **Cálculo Automático de Resultados**:
  - Clasificación de riesgos en **bajo**, **medio** y **alto**.

- **Reportes**:
  - Generación de reportes con recomendaciones basadas en los resultados.

- **Almacenamiento en Base de Datos**:
  - Los resultados se guardan en **MongoDB** para su posterior consulta.

---

## Tecnologías Utilizadas

### **Frontend:**
- HTML, CSS, JavaScript
- Bootstrap para el diseño responsive

### **Backend:**
- Node.js 
- MongoDB para el almacenamiento de datos

### **Herramientas:**
- MongoDB Compass para la gestión de la base de datos
- Visual Studio Code como editor de código

---

## Instalación y Configuración

### **Requisitos Previos**
- Node.js instalado.
- MongoDB instalado y en ejecución.

### **Pasos para la Instalación**

1. Clona el repositorio:
   ```bash
   git clone https://github.com/chachilo/NOM-034.git
   ```
2. Instala las dependencias en el Backend:
   ```bash
   cd backend
   npm install
   ```
3. Instala las dependencias en el Frontend (de ser necesario):
   ```bash
   cd frontend
   npm install
   ```
4. Configura la conexión a MongoDB:
   - Abre el archivo `backend/config/db.js` y asegúrate de que la URL de MongoDB sea correcta.
   ```js
   mongoose.connect('mongodb://localhost:27017', {});
   ```
5. Inicia el servidor backend:
   ```bash
   node app.js
   ```
6. Usa Live Server en Visual Studio Code, abre `index.html` y haz clic en **"Open with Live Server"**.

---

## Uso

### **Accede a la Aplicación:**
- Abre tu navegador y visita `http://localhost:5500` (o el puerto que uses).

### **Completa los Cuestionarios:**
- Navega por las preguntas del cuestionario 
- Responde las preguntas y envía el formulario.

### **Consulta los Resultados:**
- Visita la sección de **Reporte** para ver los resultados y las recomendaciones.

---

## Estructura del Proyecto

```
/nom-035-app
│
├── /backend
│   ├── /api
│   │   └── /cuestionario
│   │       └── respuesta.js
│   ├── /config
│   │   └── db.js
│   ├── /models
│   │   └── respuesta.js
│   ├── server.js
│   └── package.json
│
├── /frontend
│   ├── /public
│   │   ├── /assets
│   │   ├── index.html
│   │   └── styles.css
│   │   └── app.js
│   ├── /src
│   └── package.json
│
└── README.md
```

---
