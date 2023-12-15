/**
 * Tres formas de almacenar valores en memoria en javascript:
 *      let: se puede modificar
 *      var: se puede modificar
 *      const: es constante y no se puede modificar
 */

// Conexión con la base de datos
const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
let database = undefined;
let concesionarioCollection = undefined;

async function connectBD() {
  try {
    await client.connect();
    database = client.db("concesionariosDB");
    concesionarioCollection = database.collection("concesionarios");
  } catch (e) {
    console.error(e);
    console.log("ERROR de conexión a la BBDD");
    await client.close();
  } finally {
  }
}

connectBD().catch(console.error);

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

// Implementamos swaggerUI
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Lista todos los concesionarios
app.get("/concesionarios", async (request, response) => {
  try {
    const curorConcesionarios = await concesionarioCollection.find({});
    const concesionarios = await curorConcesionarios.toArray();
    response.json(concesionarios);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error });
  }
});

// Crea un nuevo concesionario
app.post("/concesionarios", async (request, response) => {
  try {
    const concesionarios = await concesionarioCollection.insertOne(request.body);
    response.json({ message: "okey" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error });
  }
});

// Obtiene un solo concesionario
app.get("/concesionarios/:conId", async (request, response) => {
  const concesionarioId = request.params.conId;
  try {
    const concesionarios = await concesionarioCollection.findOne({
      _id: new ObjectId(concesionarioId),
    });
    response.json(concesionarios);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error });
  }
});

// Actualiza un solo concesionario
app.put("/concesionarios/:conId", async (request, response) => {
  const concesionarioId = request.params.conId;
  const concesionarioActualizado = request.body;
  try {
    const resultado = await concesionarioCollection.updateOne(
      { _id: new ObjectId(concesionarioId) },
      {
        $set: {
          nombre: concesionarioActualizado["nombre"],
          direccion: concesionarioActualizado["direccion"],
          coches: concesionarioActualizado["coches"],
        },
      }
    );

    if (resultado.modifiedCount < 1) {
      throw "Nothing modified";
    }

    response.json({ message: "okey" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error });
  }
});

// Borrar un concesionario del array concesionarios
app.delete("/concesionarios/:conId", async (request, response) => {
  const concesionarioId = request.params.conId;
  try {
    const concesionario = await concesionarioCollection.deleteOne({
      _id: new ObjectId(concesionarioId),
    });
    response.json({ message: "okey" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error });
  }
});

// Lista todos los coches de un solo concesionario
app.get("/concesionarios/:conId/coches", async (request, response) => {
  const concesionarioId = request.params.conId;
  try {
    const concesionarios = await concesionarioCollection.findOne({
      _id: new ObjectId(concesionarioId),
    });
    response.json(concesionarios["coches"]);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error });
  }
});

// Añadir un nuevo coche a un solo concesionario
app.post("/concesionarios/:conId/coches", async (request, response) => {
  const concesionarioId = request.params.conId;
  const nuevoCoche = request.body;
  try {
    const resultado = await concesionarioCollection.updateOne(
      { _id: new ObjectId(concesionarioId) },
      {
        $push: {
          coches: nuevoCoche,
        },
      }
    );
    if (resultado.modifiedCount < 1) {
      throw "Nothing modified";
    }

    response.json({ message: "okey" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error });
  }
});

// Los siguientes siguen usando la posición del coche en el array como Id
// Obtener un coche con clave cocheId, del concesionario con clave id
app.get("/concesionarios/:conId/coches/:cocheId", async (request, response) => {
  const concesionarioId = request.params.conId;
  const cocheId = request.params.cocheId;

  try {
    const concesionarios = await concesionarioCollection.findOne({
      _id: new ObjectId(concesionarioId),
    });

    let cocheEncontrado = null;
    for (let i = 0; i < concesionarios.coches.length; i++) {
      if (i == parseInt(cocheId)) {
        cocheEncontrado = concesionarios.coches[i];
      }
    }
    if (!cocheEncontrado) {
      throw "ID not found";
    }
    response.json(cocheEncontrado);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error });
  }
});

// Actualizar un solo coche de clave cocheId, del concesionario con clave id
app.put("/concesionarios/:conId/coches/:cocheId", async (request, response) => {
  const concesionarioId = request.params.conId;
  const cocheId = request.params.cocheId;
  const cocheNuevo = request.body;

  try {
    const resultado = await concesionarioCollection.updateOne(
      { _id: new ObjectId(concesionarioId) },
      {
        $set: {
          [`coches.${cocheId}`]: cocheNuevo,
        },
      }
    );

    if (resultado.modifiedCount < 1) {
      throw "Nothing modified";
    }

    response.json({ message: "okey" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error });
  }
});

// Borrar un coche de clave cocheId del array de coches del concesionario con clave id
app.delete("/concesionarios/:id/coches/:cocheId", async (request, response) => {
  const concesionarioId = request.params.id;
  const cocheId = parseInt(request.params.cocheId);

  try {
    const concesionarios = await concesionarioCollection.findOne({
      _id: new ObjectId(concesionarioId),
    });

    let cocheEncontrado = null;
    for (let i = 0; i < concesionarios.coches.length; i++) {
      if (i == parseInt(cocheId)) {
        cocheEncontrado = concesionarios.coches[i];
      }
    }
    if (!cocheEncontrado) {
      throw "ID not found";
    }
    const resultado = await concesionarioCollection.updateOne(
      { _id: new ObjectId(concesionarioId) },
      {
        $pull: {
          coches: { $eq: cocheEncontrado },
        },
      }
    );

    if (resultado.modifiedCount < 1) {
      throw "Nothing modified";
    }
    response.json({ message: "okey" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error });
  }
});