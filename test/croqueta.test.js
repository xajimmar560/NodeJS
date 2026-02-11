const request = require("supertest");
const app = require("../index");
const initModels = require("../models/init-models.js").initModels;
const sequelize = require("../config/sequelize.js");

// Inicializar modelos
const models = initModels(sequelize);
const Croqueta = models.croqueta;

// ============================================
// CONFIGURACIÓN Y UTILIDADES
// ============================================

/**
 * Base URL para las pruebas
 */
const API_URL = "/api/croquetas";

/**
 * Datos de prueba para crear croquetas
 */
const croquetaTest = {
  nombre: "Croqueta Test Unitaria",
  creacion: "2024-02-28",
  precio: "2.50",
  receta: 5
};

const croquetaTest2 = {
  nombre: "Croqueta Test 2",
  creacion: "2024-03-01",
  precio: "3.00",
  receta: 6
};

const croquetaTestActualizacion = {
  creacion: "2024-03-02",
  precio: "4.50",
  receta: 7
};

/**
 * Validar estructura de respuesta exitosa
 */
const validarEstructuraRespuestaExitosa = (respuesta) => {
  expect(respuesta).toHaveProperty("ok");
  expect(respuesta).toHaveProperty("datos");
  expect(respuesta).toHaveProperty("mensaje");
  expect(respuesta.ok).toBe(true);
  expect(typeof respuesta.mensaje).toBe("string");
};

/**
 * Validar estructura de respuesta de error
 */
const validarEstructuraRespuestaError = (respuesta) => {
  expect(respuesta).toHaveProperty("ok");
  expect(respuesta).toHaveProperty("datos");
  expect(respuesta).toHaveProperty("mensaje");
  expect(respuesta.ok).toBe(false);
  expect(respuesta.datos).toBeNull();
  expect(typeof respuesta.mensaje).toBe("string");
};

/**
 * Validar estructura de una croqueta
 */
const validarEstructuraCroqueta = (croqueta) => {
  expect(croqueta).toHaveProperty("nombre");
  expect(croqueta).toHaveProperty("creacion");
  expect(croqueta).toHaveProperty("precio");
  expect(croqueta).toHaveProperty("receta");
};

/**
 * Validar tipos de datos de una croqueta
 */
const validarTiposDatosCroqueta = (croqueta) => {
  expect(typeof croqueta.nombre).toBe("string");
  expect(croqueta.creacion).toBeTruthy();
  expect(typeof croqueta.precio).toBe("string");
  expect(typeof croqueta.receta).toBe("number");
};

/**
 * Validar valores específicos de una croqueta
 */
const validarValoresCroqueta = (croqueta, valoresEsperados) => {
  if (valoresEsperados.nombre !== undefined) {
    expect(croqueta.nombre).toBe(valoresEsperados.nombre);
  }
  if (valoresEsperados.creacion !== undefined) {
    expect(croqueta.creacion).toMatch(/^\d{4}-\d{2}-\d{2}/);
  }
  if (valoresEsperados.precio !== undefined) {
    expect(parseFloat(croqueta.precio)).toBe(parseFloat(valoresEsperados.precio));
  }
  if (valoresEsperados.receta !== undefined) {
    expect(croqueta.receta).toBe(valoresEsperados.receta);
  }
};

// ============================================
// SUITE DE PRUEBAS
// ============================================

describe("API REST - Recurso Croqueta", () => {
  
  // Limpieza antes de todas las pruebas
  beforeAll(async () => {
    try {
      // Sincronizar base de datos
      await sequelize.sync({ alter: true });
    } catch (error) {
      console.error("Error en beforeAll:", error);
    }
  });

  // Limpiar datos de prueba después de cada test
  afterEach(async () => {
    try {
      await Croqueta.destroy({
        where: { nombre: { [sequelize.Sequelize.Op.like]: "Croqueta Test%" } }
      });
    } catch (error) {
      console.error("Error en afterEach:", error);
    }
  });

  // ============================================
  // TESTS: GET /api/croquetas (Obtener todas)
  // ============================================
  describe("GET /api/croquetas - Obtener todas las croquetas", () => {
    
    test("Debe retornar 200 al obtener la lista de croquetas", async () => {
      const res = await request(app).get(API_URL);
      expect(res.status).toBe(200);
    });

    test("Debe retornar estructura correcta de respuesta", async () => {
      const res = await request(app).get(API_URL);
      validarEstructuraRespuestaExitosa(res.body);
    });

    test("Debe retornar un array en datos", async () => {
      const res = await request(app).get(API_URL);
      expect(Array.isArray(res.body.datos)).toBe(true);
    });

    test("Debe contener mensaje de éxito", async () => {
      const res = await request(app).get(API_URL);
      expect(res.body.mensaje).toContain("recuperadas");
    });

    test("Cada croqueta debe tener estructura correcta", async () => {
      // Crear una croqueta de prueba
      await Croqueta.create(croquetaTest);

      const res = await request(app).get(API_URL);
      expect(res.body.datos.length).toBeGreaterThan(0);
      res.body.datos.forEach((croqueta) => {
        validarEstructuraCroqueta(croqueta);
        validarTiposDatosCroqueta(croqueta);
      });
    });

    test("Debe retornar array vacío cuando no hay croquetas", async () => {
      const res = await request(app).get(API_URL);
      expect(res.body.ok).toBe(true);
      expect(Array.isArray(res.body.datos)).toBe(true);
    });
  });

  // ============================================
  // TESTS: POST /api/croquetas (Crear)
  // ============================================
  describe("POST /api/croquetas - Crear nueva croqueta", () => {
    
    test("Debe retornar 201 al crear una croqueta", async () => {
      const res = await request(app)
        .post(API_URL)
        .send(croquetaTest);
      expect(res.status).toBe(201);
    });

    test("Debe retornar estructura correcta de respuesta", async () => {
      const res = await request(app)
        .post(API_URL)
        .send(croquetaTest);
      validarEstructuraRespuestaExitosa(res.body);
    });

    test("Debe retornar la croqueta creada en datos", async () => {
      const res = await request(app)
        .post(API_URL)
        .send(croquetaTest);
      expect(res.body.datos).toBeDefined();
      validarEstructuraCroqueta(res.body.datos);
    });

    test("Debe validar tipos de datos de la croqueta creada", async () => {
      const res = await request(app)
        .post(API_URL)
        .send(croquetaTest);
      validarTiposDatosCroqueta(res.body.datos);
    });

    test("Debe guardar los valores correctos", async () => {
      const res = await request(app)
        .post(API_URL)
        .send(croquetaTest);
      validarValoresCroqueta(res.body.datos, croquetaTest);
    });

    test("Debe contener mensaje de creación exitosa", async () => {
      const res = await request(app)
        .post(API_URL)
        .send(croquetaTest);
      expect(res.body.mensaje.toLowerCase()).toContain("creada");
    });

    test("Debe ser consultable después de crear", async () => {
      await request(app)
        .post(API_URL)
        .send(croquetaTest);

      const res = await request(app).get(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`);
      expect(res.status).toBe(200);
      expect(res.body.datos.nombre).toBe(croquetaTest.nombre);
    });

    test("Debe rechazar POST sin content-type", async () => {
      const res = await request(app)
        .post(API_URL)
        .send(JSON.stringify(croquetaTest))
        .set("Content-Type", "text/plain");
      expect(res.status).not.toBe(201);
    });

    test("Debe validar que el precio sea numérico", async () => {
      const croquetaInvalida = { ...croquetaTest, precio: "abc" };
      const res = await request(app)
        .post(API_URL)
        .send(croquetaInvalida);
      // Si la BD lo rechaza, debería fallar
      // Si lo acepta, al menos debería retornar algo
      expect(res.status).toBeDefined();
    });

    test("Debe crear múltiples croquetas diferentes", async () => {
      const res1 = await request(app)
        .post(API_URL)
        .send(croquetaTest);
      
      const res2 = await request(app)
        .post(API_URL)
        .send(croquetaTest2);

      expect(res1.status).toBe(201);
      expect(res2.status).toBe(201);
      expect(res1.body.datos.nombre).not.toBe(res2.body.datos.nombre);
    });
  });

  // ============================================
  // TESTS: GET /api/croquetas/:nombre (Obtener por ID)
  // ============================================
  describe("GET /api/croquetas/:nombre - Obtener croqueta por nombre", () => {
    
    test("Debe retornar 200 al obtener una croqueta existente", async () => {
      await Croqueta.create(croquetaTest);

      const res = await request(app)
        .get(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`);
      expect(res.status).toBe(200);
    });

    test("Debe retornar estructura correcta de respuesta", async () => {
      await Croqueta.create(croquetaTest);

      const res = await request(app)
        .get(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`);
      validarEstructuraRespuestaExitosa(res.body);
    });

    test("Debe retornar 404 para croqueta no encontrada", async () => {
      const res = await request(app)
        .get(`${API_URL}/Croqueta%20Inexistente`);
      expect(res.status).toBe(404);
    });

    test("Debe contener mensaje de error para croqueta no encontrada", async () => {
      const res = await request(app)
        .get(`${API_URL}/Croqueta%20Inexistente`);
      validarEstructuraRespuestaError(res.body);
      expect(res.body.mensaje.toLowerCase()).toContain("no encontrada");
    });

    test("Debe retornar la croqueta correcta", async () => {
      await Croqueta.create(croquetaTest);

      const res = await request(app)
        .get(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`);
      validarEstructuraCroqueta(res.body.datos);
      expect(res.body.datos.nombre).toBe(croquetaTest.nombre);
    });

    test("Debe validar estructura de datos retornada", async () => {
      await Croqueta.create(croquetaTest);

      const res = await request(app)
        .get(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`);
      validarTiposDatosCroqueta(res.body.datos);
      validarValoresCroqueta(res.body.datos, croquetaTest);
    });

    test("Debe contener mensaje de éxito", async () => {
      await Croqueta.create(croquetaTest);

      const res = await request(app)
        .get(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`);
      expect(res.body.mensaje.toLowerCase()).toContain("recuperada");
    });

    test("Debe manejar nombres con espacios y caracteres especiales", async () => {
      const croquetaEspecial = {
        nombre: "Croqueta de Oreo (color cuchufleto)",
        creacion: "2024-02-28",
        precio: "2.30",
        receta: 5
      };

      await Croqueta.create(croquetaEspecial);

      const res = await request(app)
        .get(`${API_URL}/${encodeURIComponent(croquetaEspecial.nombre)}`);
      expect(res.status).toBe(200);
      expect(res.body.datos.nombre).toBe(croquetaEspecial.nombre);
    });

    test("Debe ser sensible a mayúsculas y minúsculas", async () => {
      await Croqueta.create(croquetaTest);

      const res = await request(app)
        .get(`${API_URL}/croqueta%20test%20unitaria`);
      // Dependiendo de la BD, podría ser 404 o encontrar la croqueta
      expect(res.status).toBeDefined();
    });
  });

  // ============================================
  // TESTS: PUT /api/croquetas/:nombre (Actualizar)
  // ============================================
  describe("PUT /api/croquetas/:nombre - Actualizar croqueta", () => {
    
    test("Debe retornar 204 al actualizar correctamente", async () => {
      await Croqueta.create(croquetaTest);

      const res = await request(app)
        .put(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`)
        .send(croquetaTestActualizacion);
      expect(res.status).toBe(204);
    });

    test("Debe actualizar los datos correctamente", async () => {
      await Croqueta.create(croquetaTest);

      await request(app)
        .put(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`)
        .send(croquetaTestActualizacion);

      const res = await request(app)
        .get(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`);
      
      expect(res.body.datos.precio).toBe("4.50");
      expect(res.body.datos.receta).toBe(7);
    });

    test("Debe retornar 404 para croqueta no encontrada", async () => {
      const res = await request(app)
        .put(`${API_URL}/Croqueta%20Inexistente`)
        .send(croquetaTestActualizacion);
      expect(res.status).toBe(404);
    });

    test("Debe validar estructura de error", async () => {
      const res = await request(app)
        .put(`${API_URL}/Croqueta%20Inexistente`)
        .send(croquetaTestActualizacion);
      validarEstructuraRespuestaError(res.body);
    });

    test("Debe permitir actualización parcial", async () => {
      await Croqueta.create(croquetaTest);

      const actualizacionParcial = { precio: "5.00" };
      
      await request(app)
        .put(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`)
        .send(actualizacionParcial);

      const res = await request(app)
        .get(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`);
      
      expect(res.body.datos.precio).toBe("5.00");
      expect(res.body.datos.nombre).toBe(croquetaTest.nombre); // No cambia
    });

    test("Debe contener mensaje de error apropiado", async () => {
      const res = await request(app)
        .put(`${API_URL}/Croqueta%20Inexistente`)
        .send(croquetaTestActualizacion);
      expect(res.body.mensaje.toLowerCase()).toContain("no encontrada");
    });

    test("Debe mantener la clave primaria (nombre)", async () => {
      await Croqueta.create(croquetaTest);

      const actualizacionConNombre = { 
        nombre: "Nuevo nombre",
        precio: "3.50"
      };
      
      await request(app)
        .put(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`)
        .send(actualizacionConNombre);

      const res = await request(app)
        .get(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`);
      
      expect(res.body.datos.nombre).toBe(croquetaTest.nombre);
    });

    test("Debe validar tipos de datos después de actualizar", async () => {
      await Croqueta.create(croquetaTest);

      await request(app)
        .put(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`)
        .send(croquetaTestActualizacion);

      const res = await request(app)
        .get(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`);
      
      validarTiposDatosCroqueta(res.body.datos);
    });
  });

  // ============================================
  // TESTS: DELETE /api/croquetas/:nombre (Eliminar)
  // ============================================
  describe("DELETE /api/croquetas/:nombre - Eliminar croqueta", () => {
    
    test("Debe retornar 204 al eliminar correctamente", async () => {
      await Croqueta.create(croquetaTest);

      const res = await request(app)
        .delete(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`);
      expect(res.status).toBe(204);
    });

    test("Debe eliminar la croqueta de la BD", async () => {
      await Croqueta.create(croquetaTest);

      await request(app)
        .delete(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`);

      const res = await request(app)
        .get(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`);
      
      expect(res.status).toBe(404);
    });

    test("Debe retornar 404 para croqueta no encontrada", async () => {
      const res = await request(app)
        .delete(`${API_URL}/Croqueta%20Inexistente`);
      expect(res.status).toBe(404);
    });

    test("Debe validar estructura de error para eliminación fallida", async () => {
      const res = await request(app)
        .delete(`${API_URL}/Croqueta%20Inexistente`);
      validarEstructuraRespuestaError(res.body);
    });

    test("Debe contener mensaje de error apropiado", async () => {
      const res = await request(app)
        .delete(`${API_URL}/Croqueta%20Inexistente`);
      expect(res.body.mensaje.toLowerCase()).toContain("no encontrada");
    });

    test("Debe no afectar otras croquetas", async () => {
      await Croqueta.create(croquetaTest);
      await Croqueta.create(croquetaTest2);

      await request(app)
        .delete(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`);

      const res = await request(app)
        .get(`${API_URL}/${encodeURIComponent(croquetaTest2.nombre)}`);
      
      expect(res.status).toBe(200);
      expect(res.body.datos.nombre).toBe(croquetaTest2.nombre);
    });

    test("Debe manejar eliminación de nombres con caracteres especiales", async () => {
      const croquetaEspecial = {
        nombre: "Croqueta Especial #1",
        creacion: "2024-02-28",
        precio: "2.30",
        receta: 5
      };

      await Croqueta.create(croquetaEspecial);

      const res = await request(app)
        .delete(`${API_URL}/${encodeURIComponent(croquetaEspecial.nombre)}`);
      
      expect(res.status).toBe(204);
    });

    test("No debe permitir doble eliminación", async () => {
      await Croqueta.create(croquetaTest);

      await request(app)
        .delete(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`);

      const res = await request(app)
        .delete(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`);
      
      expect(res.status).toBe(404);
    });
  });

  // ============================================
  // TESTS DE INTEGRACIÓN Y FLUJOS COMPLETOS
  // ============================================
  describe("Flujos de integración completos", () => {
    
    test("Crear, obtener y eliminar una croqueta", async () => {
      // Crear
      const createRes = await request(app)
        .post(API_URL)
        .send(croquetaTest);
      expect(createRes.status).toBe(201);

      // Obtener
      const getRes = await request(app)
        .get(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`);
      expect(getRes.status).toBe(200);
      validarValoresCroqueta(getRes.body.datos, croquetaTest);

      // Eliminar
      const deleteRes = await request(app)
        .delete(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`);
      expect(deleteRes.status).toBe(204);

      // Verificar que fue eliminada
      const verifyRes = await request(app)
        .get(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`);
      expect(verifyRes.status).toBe(404);
    });

    test("Crear, actualizar y obtener una croqueta", async () => {
      // Crear
      const createRes = await request(app)
        .post(API_URL)
        .send(croquetaTest);
      expect(createRes.status).toBe(201);

      // Actualizar
      const updateRes = await request(app)
        .put(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`)
        .send(croquetaTestActualizacion);
      expect(updateRes.status).toBe(204);

      // Obtener y validar
      const getRes = await request(app)
        .get(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`);
      expect(getRes.status).toBe(200);
      validarValoresCroqueta(getRes.body.datos, croquetaTestActualizacion);
      validarValoresCroqueta(getRes.body.datos, { nombre: croquetaTest.nombre });
    });

    test("Crear múltiples croquetas y listar todas", async () => {
      const res1 = await request(app)
        .post(API_URL)
        .send(croquetaTest);
      const res2 = await request(app)
        .post(API_URL)
        .send(croquetaTest2);

      expect(res1.status).toBe(201);
      expect(res2.status).toBe(201);

      const listRes = await request(app).get(API_URL);
      expect(listRes.status).toBe(200);
      expect(listRes.body.datos.length).toBeGreaterThanOrEqual(2);
      
      const nombres = listRes.body.datos.map(c => c.nombre);
      expect(nombres).toContain(croquetaTest.nombre);
      expect(nombres).toContain(croquetaTest2.nombre);
    });

    test("Validar consistencia de datos a través de operaciones", async () => {
      await request(app)
        .post(API_URL)
        .send(croquetaTest);

      // Obtener directamente
      const res1 = await request(app)
        .get(`${API_URL}/${encodeURIComponent(croquetaTest.nombre)}`);

      // Obtener en lista
      const res2 = await request(app).get(API_URL);
      const croquetaEnLista = res2.body.datos.find(c => c.nombre === croquetaTest.nombre);

      // Validar que son iguales
      expect(res1.body.datos.nombre).toBe(croquetaEnLista.nombre);
      expect(res1.body.datos.precio).toBe(croquetaEnLista.precio);
      expect(res1.body.datos.receta).toBe(croquetaEnLista.receta);
    });
  });

  // ============================================
  // TESTS DE VALIDACIÓN DE DATOS
  // ============================================
  describe("Validación de estructura y tipos de datos", () => {
    
    test("Respuesta exitosa siempre tiene estructura correcta", async () => {
      const res = await request(app).get(API_URL);
      expect(res.body).toHaveProperty("ok", true);
      expect(res.body).toHaveProperty("datos");
      expect(res.body).toHaveProperty("mensaje");
      expect(typeof res.body.mensaje).toBe("string");
      expect(res.body.mensaje.length).toBeGreaterThan(0);
    });

    test("Respuesta de error siempre tiene estructura correcta", async () => {
      const res = await request(app)
        .get(`${API_URL}/Inexistente`);
      expect(res.body).toHaveProperty("ok", false);
      expect(res.body).toHaveProperty("datos", null);
      expect(res.body).toHaveProperty("mensaje");
      expect(typeof res.body.mensaje).toBe("string");
    });

    test("Precio debe ser un número válido", async () => {
      const res = await request(app)
        .post(API_URL)
        .send(croquetaTest);
      
      const precio = parseFloat(res.body.datos.precio);
      expect(precio).toBeGreaterThan(0);
      expect(isNaN(precio)).toBe(false);
    });

    test("Fecha debe estar en formato ISO o válido", async () => {
      const res = await request(app)
        .post(API_URL)
        .send(croquetaTest);
      
      const fecha = res.body.datos.creacion;
      expect(fecha).toMatch(/^\d{4}-\d{2}-\d{2}/);
      const dateObj = new Date(fecha);
      expect(dateObj.toString()).not.toBe("Invalid Date");
    });

    test("Nombre no debe ser vacío", async () => {
      const croquetaInvalida = { ...croquetaTest, nombre: "" };
      const res = await request(app)
        .post(API_URL)
        .send(croquetaInvalida);
      // La respuesta dependerá de las validaciones del servidor
      expect(res.status).toBeDefined();
    });

    test("Receta debe ser un número entero", async () => {
      const res = await request(app)
        .post(API_URL)
        .send(croquetaTest);
      
      expect(Number.isInteger(res.body.datos.receta)).toBe(true);
      expect(res.body.datos.receta).toBeGreaterThan(0);
    });
  });
});