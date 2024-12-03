import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsuarioService } from './usuario.service';

@Controller('usuarios')
export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}

  @Get()
  async findAll() {
    return this.usuarioService.findAll();
  }

  @Post()
  async create(@Body() body: { nome: string; email: string }) {
    return this.usuarioService.create(body.nome, body.email);
  }
}
