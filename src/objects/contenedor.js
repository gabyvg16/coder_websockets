// Desafío 2: Manejo de archivos en Javascript
// Importar módulo fs
const fs = require('fs');

class Producto {
    constructor(title, price, thumbnail) {
        this.title = title;
        this.price = price;
        this.thumbnail = thumbnail;
        this.id = 0;
    }
}

class Contenedor {
    constructor(file) {
        this.file = file;
    }

    async save(object) {
        // Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        try {
            let products = JSON.parse(await fs.promises.readFile(this.file, 'utf-8'));

            // Archivo existente
            !products.length ? object.id = 1 : object.id = products[products.length - 1].id + 1;
            products.push(object);

            await fs.promises.writeFile(this.file, JSON.stringify(products, null, '\t'));
            return object.id;
        } catch (err) {
            // Si el archivo no existe, lo crea
            if (err.code === 'ENOENT') {
                object.id = 1;
                await fs.promises.writeFile(this.file, JSON.stringify([object], null, '\t'));
                return object.id;
            } else {
                console.log('Error en método save: ', err);
            }
        }
    }

    async getById(number) {
        // Recibe un id y devuelve el objeto con ese id, o null si no está.
        try {
            let products = JSON.parse(await fs.promises.readFile(this.file, 'utf-8'));
            const object = products.find(object => object.id === number);
            return object ? object : null;
        } catch (err) {
            console.log('Error en método getById: ', err);
        }
    }

    async getAll() {
        // Devuelve un array con los objetos presentes en el archivo.
        try {
            return JSON.parse(await fs.promises.readFile(this.file, 'utf-8'));
        } catch (err) {
            if (err.code === 'ENOENT') {
                return [];
            } else {
                console.log('Error en método getAll: ', err);
            }
        }
    }

    async deleteById(number) {
        // Elimina del archivo el objeto con el id buscado.
        try {
            let products = JSON.parse(await fs.promises.readFile(this.file, 'utf-8'));
            let productsAct = products.filter(object => object.id != number);
            await fs.promises.writeFile(this.file, JSON.stringify(productsAct, null, '\t'));
        } catch (err) {
            console.log('Error en método deleteById: ', err);
        }
    }

    async deleteAll() {
        // Elimina todos los objetos presentes en el archivo.
        try {
            await fs.promises.writeFile(this.file, JSON.stringify([], null, '\t'));
        } catch (err) {
            console.log('Error en método deleteAll: ', err);
        }
    }

    async updateById(id, object) {
        // Actualiza un objeto según su id. DEvuelve el objeto, o no encontrado
        try {
            let products = JSON.parse(await fs.promises.readFile(this.file, 'utf-8'));
            object.id = id;
            
            const index = products.findIndex((product) => {
                return product.id === object.id;
            })

            if (index !== -1) {
                products[index] = object;
                await fs.promises.writeFile(this.file, JSON.stringify(products, null, '\t'));
                return object;
            } else {
                return { error: 'Producto no encontrado'}
            }
        } catch (err) {
            console.log('Error en método updateById: ', err);
        }
    }
}

module.exports = {
    Contenedor: Contenedor,
    Producto: Producto,
};