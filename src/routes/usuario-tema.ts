import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { knex } from "../database";
import { Tema } from "../models/tema";
import { User } from "../models/user";
import { usuarioTema } from "../models/usuario-tema";

type UpdateUserTemaParamsType = {
    iduser: number,
    idtema: number
}

export async function usuarioTemaRoutes(app: FastifyInstance) {

    app.get('/:id/getall', async (request,reply) => {

        const getUserIdParamSchema = z.object({
            id: z.string(),
        });

        const { id } = getUserIdParamSchema.parse(request.params);

        const user : User[] = await knex<User>('usuario').where({
            USRCODIGO: parseInt(id)
        });

        if(user.length <= 0) {
            return reply.status(404).send("Nenhum usuário foi encontrada!");
        }

        const usuario_temas : usuarioTema[] = await knex<usuarioTema>("usuario_tema").select("*").where({
            USRCODIGO : user[0].USRCODIGO
        });

        if(usuario_temas.length <= 0) {
            return reply.status(404).send("Nenhum tema foi encontrado!");
        }
        
        let temas: Tema[] = [];

        await Promise.all(usuario_temas.map(async (relacao) => {
            const imagem = await knex<Tema>("tema").select("*").where({
                TMACODIGO: relacao.TMACODIGO
            });
            temas.push(imagem[0]);
        }));
        
        return {
            "usuario" : user,
            "temas": temas,
            "relacao" : usuario_temas
        };
    });
    
    app.post('/create', async (request, reply) => {

        const createUsuarioTemaBodySchema = z.object({
            id_usr: z.number(),
            id_tema :z.number(),
            tma_ativo :z.number(),
        });

        const { 
            id_usr,
            id_tema,
            tma_ativo
        } = createUsuarioTemaBodySchema.parse(request.body);

        const usrTema = await knex<usuarioTema>('usuario_tema').insert({
            USRCODIGO: id_usr,
            TMACODIGO: id_tema,
            TMAATIVO: tma_ativo
        });

        return reply.status(201).send("Tema criado para usuario!");
    }); 
    
    app.post("/update/:iduser/:idtema", async (request,reply) => {

        const { iduser, idtema } = request.params as UpdateUserTemaParamsType;

        const userExists = await knex<usuarioTema>("usuario_tema").where({
            USRCODIGO: iduser,
            TMACODIGO: idtema
        });

        if (userExists.length == 0) {
            return reply.status(404).send("Houve um erro ao editar!");
        }

        const UpdateUserTemaBodySchema = z.object({
            tema_ativo: z.number().optional()
        });

        const { tema_ativo } = UpdateUserTemaBodySchema.parse(request.body);

        const userTema = await knex<usuarioTema>("usuario_tema").update({            
            TMAATIVO : tema_ativo
        }).where({
            USRCODIGO : iduser,
            TMACODIGO : idtema
        });

        return reply.status(201).send("Editado com sucesso!");
    });

    app.post("/delete/:iduser/:idtema", async (request,reply) => {

        const { iduser, idtema } = request.params as UpdateUserTemaParamsType;

        const userTemaExists = await knex<usuarioTema>("usuario_tema").where({
            USRCODIGO: iduser,
            TMACODIGO: idtema
        });

        if (userTemaExists.length == 0) {
            return reply.status(404).send("Houve um erro ao deletar!");
        }

        await knex<usuarioTema>("usuario_tema").where({
            USRCODIGO: iduser,
            TMACODIGO: idtema
        }).delete();

        return reply.status(201).send("Deletado com sucesso!");
    });
}