import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.usuario.findMany();
  }

  async create(nome: string, email: string) {
    return this.prisma.usuario.create({
      data: { nome, email },
    });
  }
}
