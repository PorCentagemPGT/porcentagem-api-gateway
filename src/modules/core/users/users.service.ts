import { Injectable } from '@nestjs/common';
import { CoreProxy } from '../../../proxy/core.proxy';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  CoreUser,
  CoreResponse,
} from '../../../proxy/interfaces/core-api.interface';

@Injectable()
export class UsersService {
  constructor(private readonly coreProxy: CoreProxy) {}

  async create(createUserDto: CreateUserDto): Promise<CoreResponse<CoreUser>> {
    return this.coreProxy.post<CoreUser>('/users', createUserDto);
  }

  async findAll(): Promise<CoreResponse<CoreUser[]>> {
    return this.coreProxy.get<CoreUser[]>('/users');
  }

  async findOne(id: string): Promise<CoreResponse<CoreUser>> {
    return this.coreProxy.get<CoreUser>(`/users/${id}`);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<CoreResponse<CoreUser>> {
    return this.coreProxy.patch<CoreUser>(`/users/${id}`, updateUserDto);
  }

  async remove(id: string): Promise<CoreResponse<void>> {
    return this.coreProxy.delete<void>(`/users/${id}`);
  }

  async findByEmail(email: string): Promise<CoreResponse<CoreUser>> {
    return this.coreProxy.get<CoreUser>(`/users/email/${email}`);
  }
}
