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
]

// Lista todos los coches
app.get("/coches", (request, response) => {
  response.json(coches);
});

// Añadir un nuevo coche
app.post("/coches", (request, response) => {
  coches.push(request.body);
  response.json({ message: "ok" });
});

// Obtener un solo coche
app.get("/coches/:id", (request, response) => {
  const id = request.params.id;
  const result = coches[id];
  response.json({ result });
});

// Actualizar un solo coche
app.put("/coches/:id", (request, response) => {
  const id = request.params.id;
  coches[id] = request.body;
  response.json({ message: "ok" });
});

// Borrar un elemento del array
app.delete("/coches/:id", (request, response) => {
  const id = request.params.id;
  coches = coches.filter((item) => coches.indexOf(item) !== id);

  response.json({ message: "ok" });
});
