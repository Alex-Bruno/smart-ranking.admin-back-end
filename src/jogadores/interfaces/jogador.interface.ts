import { Categoria } from '../../categorias/interfaces/categoria.interface';
import { Document } from 'mongoose';

export interface Jogador extends Document {
    readonly telefoneCelular: string;
    readonly email: string;
    categoria: string;
    nome: string;
    ranking: string;
    posicaoRanking: number;
    urlFotoJogador: string; 
}