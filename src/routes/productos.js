const { Router } = require('express');
const router = Router();

const { Contenedor, Producto } = require('../objects/contenedor');

const productos = new Contenedor('./productos.txt');

// Devuelve todos los productos
router.get('/', async (req, res) => {
    try {
        const productLista = await productos.getAll();
        let hasAny = false;
        if (productLista.length > 0) {
            hasAny = true;
        }
        res.render('productos', { productLista, hasAny });
    } catch (e) { 
        console.log('Error en get, ', e);
        res.sendStatus(500);
    }
})

// Recibe y agrega un producto, lo devuelve con su id asignado
router.post('/', async (req, res) => {
    try {
        const { title, price, thumbnail } = req.body;
        const producto = new Producto( title, Number(price), thumbnail );
        let id = await productos.save(producto);

        res.redirect('/');
    } catch (e) { 
        console.log('Error en post, ', e);
        res.sendStatus(500);
    }
})


/*********************************************/
/************POSTMAN**************************/
/*********************************************/

// Devuelve un producto según su id
router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const producto = await productos.getById(id);

        if (!producto) throw 'producto no encontrado';
        res.status(200).json(producto);
    } catch (e) { 
        res.status(500).json({ error: e });
    }
})

// Recibe y actualiza un producto segun su id
router.put('/:id', async (req, res) => {
    try {
        const { title, price, thumbnail } = req.body;
        const id = Number(req.params.id);
        const producto = await productos.getById(id);

        if (!producto) throw 'producto no encontrado';

        productoModif = new Producto( title, Number(price), thumbnail );
        await productos.updateById(id, productoModif);
        res.status(200).json('Producto modificado');

    } catch (e) {
        res.status(500).json({ error: e });
    }
})

// Elimina un producto según su id
router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const producto = await productos.getById(id);

        if (!producto) throw 'producto no encontrado';
        
        await productos.deleteById(id);
        res.status(200).json('Producto eliminado');

    } catch (e) {
        res.status(500).json({ error: e });
    }
})

module.exports = router;