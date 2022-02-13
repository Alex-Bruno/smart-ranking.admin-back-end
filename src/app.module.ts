import { JogadorSchema } from './jogadores/interfaces/jogador.schema';
import { CategoriaSchema } from './categorias/interfaces/categoria.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      'mongodb+srv://root:A5m9RDBYVVDfKtV@cluster0.y1eby.mongodb.net/sradmbackend?retryWrites=true&w=majority',
      { useNewUrlParser: true, useUnifiedTopology: true }
    ),
    MongooseModule.forFeature([
      { name: 'Categoria', schema: CategoriaSchema },
      { name: 'Jogador', schema: JogadorSchema },
    ]),
    CategoriasModule,
    JogadoresModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
