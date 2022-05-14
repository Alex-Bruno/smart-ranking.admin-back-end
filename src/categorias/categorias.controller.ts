import { Categoria } from './interfaces/categoria.interface';
import { Controller, Logger } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

const ackErrors: string[] = [''];

@Controller()
export class CategoriasController {
    constructor(private readonly categoriasService: CategoriasService) { }

    logger = new Logger(CategoriasController.name);

    @EventPattern('criar-categoria')
    async criarCategoria(
        @Payload() categoria: Categoria,
        @Ctx() context: RmqContext
    ) {

        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();

        this.logger.log(`Categoria: ${JSON.stringify(categoria)}`);

        try {
            await this.categoriasService.criarCategoria(categoria);
            await channel.ack(originalMsg);
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);

            const filterAckError = ackErrors.filter(
                ackError => error.message.includes(ackError)
            )

            if (filterAckError)
                await channel.ack(originalMsg)
        }

    }

    @MessagePattern('consultar-categorias')
    async consultarCategorias(
        @Payload() _id: string,
        @Ctx() context: RmqContext
    ) {

        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();

        try {

            if (_id)
                return await this.categoriasService.consultarCategoriaPeloId(_id);
            return await this.categoriasService.consultarTodasCategorias();

        } finally {
            await channel.ack(originalMsg)
        }
    }

    @EventPattern('atualizar-categoria')
    async atualizarCategoria(
        @Payload() data: any,
        @Ctx() context: RmqContext
    ) {

        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();

        this.logger.log(`Categoria: ${JSON.stringify(data)}`);

        try {
            const _id: string = data.id;
            const categoria: Categoria = data.categoria;

            await this.categoriasService.atualizarCategoria(_id, categoria);
            await channel.ack(originalMsg);

        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);

            const filterAckError = ackErrors.filter(
                ackError => error.message.includes(ackError)
            )

            if (filterAckError)
                await channel.ack(originalMsg)

            await channel.nack(originalMsg);
        }

    }
}
