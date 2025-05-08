import { Injectable } from '@nestjs/common';
import { CoreProxy } from '../../../proxy/core.proxy';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CoreUserResponse } from '../../../proxy/interfaces/core-api.interface';

@Injectable()
export class UsersService {
  constructor(private readonly coreProxy: CoreProxy) {}

  async create(createUserDto: CreateUserDto): Promise<CoreUserResponse> {
    return this.coreProxy.post<CoreUserResponse>('/users', createUserDto);
  }

  async findAll(): Promise<CoreUserResponse[]> {
    return this.coreProxy.get<CoreUserResponse[]>('/users');
  }

  async findOne(id: string): Promise<CoreUserResponse> {
    return this.coreProxy.get<CoreUserResponse>(`/users/${id}`);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<CoreUserResponse> {
    return this.coreProxy.patch<CoreUserResponse>(
      `/users/${id}`,
      updateUserDto,
    );
  }

  async remove(id: string): Promise<void> {
    return this.coreProxy.delete<void>(`/users/${id}`);
  }

  async findByEmail(email: string): Promise<CoreUserResponse> {
    return this.coreProxy.get<CoreUserResponse>(`/users/email/${email}`);
  }
}
