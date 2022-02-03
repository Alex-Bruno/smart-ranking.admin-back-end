import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';

const ackErrors: string[] = [''];

@Controller('jogadores')
export class JogadoresController {
    constructor(private readonly jogadoresService: JogadoresService) { }

    logger = new Logger(JogadoresController.name);

    @EventPattern('criar-jogador')
    async criarJogador(
        @Payload() jogador: Jogador,
        @Ctx() context: RmqContext
    ) {

        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();

        try {
            
            this.logger.log(`Jogador: ${JSON.stringify(jogador)}`);

            await this.jogadoresService.criarJogador(jogador);
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

    @MessagePattern('consultar-jogadores')
    async consultarJogadores(
        @Payload() _id: string,
        @Ctx() context: RmqContext
    ) {

        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();

        try {

            if (_id)
                return await this.jogadoresService.consultarJogadorPeloId(_id);
            return await this.jogadoresService.consultarTodosJogadores();

        } finally {
            await channel.ack(originalMsg)
        }
    }

    @EventPattern('atualizar-jogador')
    async atualizarJogador(
        @Payload() data: any,
        @Ctx() context: RmqContext
    ) {

        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();

        try {
            
            this.logger.log(`Jogador: ${JSON.stringify(data)}`);

            const _id: string = data.id;
            const jogador: Jogador = data.jogador;

            await this.jogadoresService.atualizarJogador(_id, jogador);
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

    @EventPattern('deletar-jogador')
    async deletarJogador(
        @Payload() _id: string,
        @Ctx() context: RmqContext
    ) {

        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();

        try {
            
            await this.jogadoresService.deletarJogador(_id);
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
}
