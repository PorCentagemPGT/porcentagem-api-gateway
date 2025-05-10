import { Injectable, Logger } from '@nestjs/common';
import { CoreProxy } from '../../../proxy/core.proxy';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CoreUserResponse } from '../../../proxy/interfaces/core-api.interface';
import { AxiosError } from 'axios';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly coreProxy: CoreProxy) {}

  async create(createUserDto: CreateUserDto): Promise<CoreUserResponse> {
    return this.coreProxy.post<CoreUserResponse>('/users', createUserDto);
  }

  async findAll(): Promise<CoreUserResponse[]> {
    const users = await this.coreProxy.get<CoreUserResponse[]>('/users');
    return users ?? [];
  }

  async findOne(id: string): Promise<CoreUserResponse | null> {
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

  async findByEmail(email: string): Promise<CoreUserResponse | null> {
    try {
      return await this.coreProxy.get<CoreUserResponse>(
        `/users/email/${email}`,
      );
    } catch (error) {
      this.logger.debug(`Error finding user by email: ${error}`);
      if (error instanceof AxiosError && error.response?.status === 404) {
        this.logger.debug(`User not found with email: ${email}`);
        return null;
      }
      throw error;
    }
  }
}
