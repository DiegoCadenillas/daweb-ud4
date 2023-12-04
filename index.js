/**
 * Tres formas de almacenar valores en memoria en javascript:
 *      let: se puede modificar
 *      var: se puede modificar
 *      const: es constante y no se puede modificar
 */

// Importamos las bibliotecas necesarias.
// Concretamente el framework express.
const express = require("express");

// Inicializamos la aplicación
const app = express();

// Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());

// Indicamos el puerto en el que vamos a desplegar la aplicación
const port = process.env.PORT || 8080;

// Arrancamos la aplicación
app.listen(port, () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
});

// Definimos una estructura de datos
// (temporal hasta incorporar una base de datos)
// Definición del array de concesionarios
let concesionarios = [
  {
    nombre: "Coches Raúl",
    direccion: "av. raul 10",
    coches: [
      {
        modelo: "Clio",
        cv: 440,
        precio: 2000.00
      },
      {
        modelo: "Prius",
        cv: 200,
        precio: 4000.00
      }
    ]
  },
  {
    nombre: "Coches Diego",
    direccion: "av. diego 11",
    coches: [
      {
        modelo: "Prius",
        cv: 200,
        precio: 3999.99
      },
      {
        modelo: "Corsa",
        cv: 300,
        precio: 10000.00
      }
    ]
  }
];

// Lista todos los concesionarios
app.get("/concesionarios", (request, response) => {
  response.json(concesionarios);
});

// Crea un nuevo concesionario
app.post("/concesionarios", (request, response) => {
  concesionarios.push(request.body);
  response.json({ message: "ok" });
});

// Obtiene un solo concesionario
app.get("/concesionarios/:id", (request, response) => {
  const id = request.params.id;
  const result = concesionarios[id];
  response.json({ result });
});

// Actualiza un solo concesionario
app.put("/concesionarios/:id", (request, response) => {
  const id = request.params.id;
  concesionarios[id] = request.body;
  response.json({ message: "ok" });
});

// Borrar un concesionario del array concesionarios
app.delete("/concesionarios/:id", (request, response) => {
  const id = request.params.id;
  concesionarios = concesionarios.filter((item) => concesionarios.indexOf(item) != id);
  response.json({ message: "ok" });
});

// Lista todos los coches de un solo concesionario
app.get("/concesionarios/:id/coches", (request, response) => {
  const id = request.params.id;
  const coches = concesionarios[id].coches;
  response.json({ coches });
});

// Añadir un nuevo coche a un solo concesionario
app.post("/concesionarios/:id/coches", (request, response) => {
  const id = request.params.id;
  concesionarios[id].coches.push(request.body);
  response.json({ message: "ok" });
});

// Obtener un coche con clave cocheId, del concesionario con clave id
app.get("/concesionarios/:id/coches/:cocheId", (request, response) => {
  const id = request.params.id;
  const cocheId = request.params.cocheId;
  const coche = concesionarios[id].coches[cocheId];
  response.json({ coche });
});

// Actualizar un solo coche de clave cocheId, del concesionario con clave id
app.put("/concesionarios/:id/coches/:cocheId", (request, response) => {
  const id = request.params.id;
  const cocheId = request.params.cocheId;
  concesionarios[id].coches[cocheId] = request.body;
  response.json({ message: "ok" });
});

// Borrar un coche de clave cocheId del array de coches del concesionario con clave id
app.delete("/concesionarios/:id/coches/:cocheId", (request, response) => {
  const id = request.params.id;
  const cocheId = request.params.cocheId;
  concesionarios[id].coches = concesionarios[id].coches.filter((item) => concesionarios[id].coches.indexOf(item) != cocheId);
  response.json({ message: "ok" });
});
