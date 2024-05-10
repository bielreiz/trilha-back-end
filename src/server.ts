import fastify from 'fastify'
import { usersRoutes } from './routes/users';
import { env } from './env';
import { imagesRoutes } from './routes/images';
import { usuarioImagensRoutes } from './routes/usuario-imagem';
import { temasRoutes } from './routes/temas';
import { iconeRoutes } from './routes/icone';
import { pecaRoutes } from './routes/peca';

const app = fastify()
const PORT = env.PORT;

app.register(usersRoutes, {
    prefix: 'usuarios'
});

app.register(imagesRoutes, {
    prefix: 'imagens'
});

app.register(usuarioImagensRoutes, {
    prefix: 'usuario-imagem'
});

app.register(temasRoutes, {
    prefix: 'tema'
});

app.register(iconeRoutes, {
    prefix: 'icone'
});

app.register(pecaRoutes, {
    prefix: 'peca'
});

app.listen({
    host: '0.0.0.0',
    port: PORT
})
    .then(() => {
        console.log(`Running on port http://localhost:${PORT}`)
    })
    .catch((err) => {
        console.log("Error", err);
    });