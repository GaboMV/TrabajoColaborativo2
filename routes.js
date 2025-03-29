const express = require('express');
const router = express.Router();
const usuarios = require('./data'); // Importamos los datos desde el archivo data.js
// Endpoint: Obtener todos los usuarios y aplicar filtros
router.get('/usuarios', (req, res) => {
    const { nombre, edad } = req.query;

    let usuariosFiltrados = usuarios;

    if (nombre) {
        usuariosFiltrados = usuariosFiltrados.filter(usuario => 
            usuario.nombre.toLowerCase().includes(nombre.toLowerCase())
        );
    }

    if (edad) {
        usuariosFiltrados = usuariosFiltrados.filter(usuario => 
            usuario.edad === parseInt(edad)
        );
    }

    res.json(usuariosFiltrados);
});


// Endpoint: Obtener un usuario por ID
router.get('/usuarios/:id', (req, res) => { 
    const usuario = usuarios.find(usuario => usuario.id === parseInt(req.params.id));
    if (!usuario) {
        return res.status(404).send('No se encontró el usuario.');
    }
    res.json(usuario);
});
// Endpoint: Agregar un usuario
router.post('/usuarios', (req, res) => {
    const nuevoUsuario = {
        id: usuarios.length + 1,
        nombre: req.body.nombre,
        edad: parseInt(req.body.edad)
    };
    usuarios.push(nuevoUsuario);
    res.status(201).json(nuevoUsuario);
});

// Endpoint: Modificar un usuario por ID
router.put('/usuarios/:id', (req, res) => {
    const usuarioIndex = usuarios.findIndex(usuario => usuario.id === parseInt(req.params.id));
    if (usuarioIndex === -1) {
        return res.status(404).send('No se encontró el usuario.');
    }
    const usuarioModificado = {
        id: parseInt(req.params.id),
        nombre: req.body.nombre || usuarios[usuarioIndex].nombre,
        edad: parseInt(req.body.edad) || usuarios[usuarioIndex].edad
    };
    usuarios[usuarioIndex] = usuarioModificado;
    res.json(usuarioModificado);
});

// Endpoint: Eliminar un usuario por ID
router.delete('/usuarios/:id', (req, res) => {
    const usuarioIndex = usuarios.findIndex(usuario => usuario.id === parseInt(req.params.id));
    if (usuarioIndex === -1) {
        return res.status(404).send('No se encontró el usuario.');
    }
    usuarios.splice(usuarioIndex, 1);
    res.status(200).send('Usuario eliminado satisfactoriamente');
    // Se puede devolver un mensaje de confirmación al usuario
});

// Endpoint: Obtener todos los usuarios aplicar filtor por pagina y limite puede ser opcional pagina y limite
router.get('/usuariosPaginado', (req, res) => {
    //quiero adicionar la variable de cabecera para autorizacion berear
    const authorization = req.headers['authorization'];
    if (!authorization) {
        return res.status(401).send('No se ha proporcionado la cabecera de autorización.');
    }
    if (authorization.toLowerCase() === `Bearer ${process.env.AUTH_TOKEN}`) {
        return res.status(401).send('El token de autorización no es válido.');
    }
    //aquí continuamos con el código para obtener todos los usuarios aplicar filtro por pagina y limite
    const { page, limit } = req.query;
    if (!page ||!limit) {
        return res.json(usuarios);
    }
    if (isNaN(page) || isNaN(limit) || limit < 1 || page < 1) {
        return res.status(400).send('Los parámetros deben ser númericos y mayores a 0.');
    }
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const usuariosPaginados = usuarios.slice(startIndex, endIndex);
    res.status(200).json(usuariosPaginados); 
    
});
// Endpoint: Eliminar todos los usuarios
router.delete('/eliminarUsuarios', (req, res) => {
    usuarios.length = 0;
    res.status(200).send('Usuarios eliminados');  
});

// Endpoint: Adicionar multiples usuarios
router.post('/usuariosBulk', (req, res) => {
    const usuariosNuevos = req.body.usuarios;
    if (!Array.isArray(usuariosNuevos)) {
        return res.status(400).send('Los datos enviados no son un arreglo.');
    }
    for (const usuario of usuariosNuevos) {
        const nuevoUsuario = {
            id: usuarios.length + 1,
            nombre: usuario.nombre,
            edad: parseInt(usuario.edad)
        };
        usuarios.push(nuevoUsuario);
    }
    res.status(201).json(usuarios);
});

module.exports = router;