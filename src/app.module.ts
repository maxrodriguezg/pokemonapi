import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PokemonModule } from './pokemon/pokemon.module.js';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '', // contraseña de MySQL/XAMPP
      database: 'pokemon',
      autoLoadEntities: true,
      synchronize: true, // solo desarrollo
    }),
    PokemonModule,
    AuthModule,
    UsuariosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
