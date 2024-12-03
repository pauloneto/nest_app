import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UsuarioModule } from './usuario/usuario.module';
import { ProdutosModule } from './produtos/produtos.module';

@Module({
  imports: [UsuarioModule, ProdutosModule],
  controllers: [AppController],
  providers: [AppService,PrismaService],
})
export class AppModule {}
