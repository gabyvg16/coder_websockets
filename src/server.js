// Desafío 5: Motores de plantillas
const { Server: IOServer } = require('socket.io');
const express = require('express');
const app = express();
const puerto = 8080;
const routes = require('./routes/index');
const path = require('path');
const { engine } = require('express-handlebars');
const { Contenedor, Producto } = require('./objects/contenedor');

// Configuración
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Configuración Handlebars
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: path.join(__dirname, './views/layout/main.hbs'),
    layoutsDir: path.join(__dirname, './views/layout'),
    partialsDir: path.join(__dirname, './views/partials')
}))

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'hbs');
app.use('/', routes);


const expressServer = app.listen(puerto, (error) => {
    if (!error) {
        console.log(`El servidor se inicio en el puerto ${puerto}`);
    } else {
        console.log(`Error al iniciar el servidor en el puerto ${puerto}. Error ${error}`);
    }
})

const io = new IOServer(expressServer);


const productosList = new Contenedor('./productos.txt');
const messageLog = new Contenedor('./messageLog.txt');
// let messageArray = [];

io.on('connection', async socket => {
    console.log('Nueva conexión: ', socket.id);

    let productos = await productosList.getAll();
    let messageArray = await messageLog.getAll();

    io.emit('server:productos', productos);
    
    socket.on('cliente:producto', async productInfo => {
        await productosList.save(productInfo);
        productos = await productosList.getAll();

        io.emit('server:productos', productos);
    })

    io.emit('server:mensaje', messageArray);
    
    socket.on('cliente:mensaje', async messageInfo => {
        await messageLog.save(messageInfo);
        messageArray = await messageLog.getAll();

        io.emit('server:mensaje', messageArray);
    })
})