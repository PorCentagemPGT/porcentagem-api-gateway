import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { BelvoResponse } from './interfaces/belvo-api.interface';

type HttpConfig = Omit<AxiosRequestConfig, 'method' | 'url' | 'data'>;

@Injectable()
export class BelvoProxy {
  private readonly logger = new Logger(BelvoProxy.name);
  private readonly apiUrl: string;
  private readonly secretId: string;
  private readonly secretPassword: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.apiUrl = this.config.getOrThrow('BELVO_API_URL');
    this.secretId = this.config.getOrThrow('BELVO_SECRET_ID');
    this.secretPassword = this.config.getOrThrow('BELVO_SECRET_PASSWORD');
  }

  /**
   * Busca dados da API Belvo
   * @param path - Caminho da API (sem a URL base)
   * @param data - Dados opcionais para o body da requisição
   * @param config - Configurações adicionais do Axios
   */
  async get<T>(
    path: string,
    data?: unknown,
    config?: HttpConfig,
  ): Promise<BelvoResponse<T>> {
    return this.forward<T>('GET', path, data, this.addAuth(config));
  }

  /**
   * Cria um novo recurso na API Belvo
   * @param path - Caminho da API (sem a URL base)
   * @param data - Dados para criar o recurso
   * @param config - Configurações adicionais do Axios
   */
  async post<T>(
    path: string,
    data: unknown,
    config?: HttpConfig,
  ): Promise<BelvoResponse<T>> {
    return this.forward<T>('POST', path, data, this.addAuth(config));
  }

  /**
   * Atualiza um recurso na API Belvo
   * @param path - Caminho da API (sem a URL base)
   * @param data - Dados para atualizar o recurso
   * @param config - Configurações adicionais do Axios
   */
  async put<T>(
    path: string,
    data: unknown,
    config?: HttpConfig,
  ): Promise<BelvoResponse<T>> {
    return this.forward<T>('PUT', path, data, this.addAuth(config));
  }

  /**
   * Remove um recurso da API Belvo
   * @param path - Caminho da API (sem a URL base)
   * @param config - Configurações adicionais do Axios
   */
  async delete<T>(
    path: string,
    config?: HttpConfig,
  ): Promise<BelvoResponse<T>> {
    return this.forward<T>('DELETE', path, undefined, this.addAuth(config));
  }

  /**
   * Atualiza parcialmente um recurso na API Belvo
   * @param path - Caminho da API (sem a URL base)
   * @param data - Dados para atualizar o recurso
   * @param config - Configurações adicionais do Axios
   */
  async patch<T>(
    path: string,
    data: unknown,
    config?: HttpConfig,
  ): Promise<BelvoResponse<T>> {
    return this.forward<T>('PATCH', path, data, this.addAuth(config));
  }

  /**
   * Adiciona autenticação básica às configurações do Axios
   * @private método utilitário para adicionar credenciais
   */
  private addAuth(config?: HttpConfig): HttpConfig {
    const auth = {
      username: this.secretId,
      password: this.secretPassword,
    };

    return {
      ...config,
      auth,
    };
  }

  /**
   * Método base para encaminhar requisições para a API Belvo
   * @protected para permitir extensão mas não exposição direta
   */
  protected async forward<T>(
    method: string,
    path: string,
    data?: unknown,
    config?: HttpConfig,
  ): Promise<BelvoResponse<T>> {
    try {
      const { data: response } = await firstValueFrom(
        this.http.request<BelvoResponse<T>>({
          method,
          url: `${this.apiUrl}${path}`,
          data,
          ...config,
        }),
      );

      return response;
    } catch (error) {
      this.logger.error(
        `Belvo API error: ${(error as Error).message}`,
        error instanceof AxiosError ? error.response?.data : undefined,
      );

      if (error instanceof AxiosError) {
        throw error.response?.data ?? error;
      }
      throw error;
    }
  }
}
