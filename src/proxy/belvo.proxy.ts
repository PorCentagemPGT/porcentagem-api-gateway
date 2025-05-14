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

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.apiUrl = this.config.getOrThrow('BELVO_API_URL');
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
    return this.forward<T>('GET', path, data, config);
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
    return this.forward<T>('POST', path, data, config);
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
    return this.forward<T>('PUT', path, data, config);
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
    return this.forward<T>('DELETE', path, undefined, config);
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
    return this.forward<T>('PATCH', path, data, config);
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
      this.logger.log(`Forwarding request to Belvo API: ${path}`);
      this.logger.log(`Request data: ${JSON.stringify(data)}`);
      this.logger.log(`Request config: ${JSON.stringify(config)}`);
      this.logger.log(`Request method: ${method}`);
      this.logger.log(`Request URL: ${this.apiUrl}${path}`);
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
