import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError, AxiosRequestConfig } from 'axios';

type HttpConfig = Omit<AxiosRequestConfig, 'method' | 'url' | 'data'>;

@Injectable()
export class CoreProxy {
  private readonly logger = new Logger(CoreProxy.name);
  private readonly apiUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.apiUrl = this.config.getOrThrow('CORE_API_URL');
  }

  /**
   * Busca dados da API Core
   * @param path - Caminho da API (sem a URL base)
   * @param data - Dados opcionais para o body da requisição
   * @param config - Configurações adicionais do Axios
   */
  async get<T>(
    path: string,
    data?: unknown,
    config?: HttpConfig,
  ): Promise<T | null> {
    return this.forward<T>('GET', path, data, config, true);
  }

  /**
   * Cria um novo recurso na API Core
   * @param path - Caminho da API (sem a URL base)
   * @param data - Dados para criar o recurso
   * @param config - Configurações adicionais do Axios
   */
  async post<T>(path: string, data: unknown, config?: HttpConfig): Promise<T> {
    const result = await this.forward<T>('POST', path, data, config);
    return result as T;
  }

  /**
   * Atualiza um recurso na API Core
   * @param path - Caminho da API (sem a URL base)
   * @param data - Dados para atualizar o recurso
   * @param config - Configurações adicionais do Axios
   */
  async put<T>(path: string, data: unknown, config?: HttpConfig): Promise<T> {
    const result = await this.forward<T>('PUT', path, data, config);
    return result as T;
  }

  /**
   * Remove um recurso da API Core
   * @param path - Caminho da API (sem a URL base)
   * @param config - Configurações adicionais do Axios
   */
  async delete<T>(path: string, config?: HttpConfig): Promise<T> {
    const result = await this.forward<T>('DELETE', path, undefined, config);
    return result as T;
  }

  /**
   * Atualiza parcialmente um recurso na API Core
   * @param path - Caminho da API (sem a URL base)
   * @param data - Dados para atualizar o recurso
   * @param config - Configurações adicionais do Axios
   */
  async patch<T>(path: string, data: unknown, config?: HttpConfig): Promise<T> {
    const result = await this.forward<T>('PATCH', path, data, config);
    return result as T;
  }

  /**
   * Método base para encaminhar requisições para a API Core
   * @protected para permitir extensão mas não exposição direta
   */
  protected async forward<T>(
    method: string,
    path: string,
    data?: unknown,
    config?: HttpConfig,
    allowNull = false,
  ): Promise<T | null> {
    try {
      const { data: response } = await firstValueFrom(
        this.http.request<T>({
          method,
          url: `${this.apiUrl}${path}`,
          data,
          ...config,
        }),
      );

      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        // Log do erro com nível apropriado
        const logLevel = error.response?.status === 404 ? 'debug' : 'error';
        this.logger[logLevel](
          `Core API ${error.response?.status === 404 ? 'not found' : 'error'}: ${error.message}`,
          error.response?.data,
        );

        // Retorna null para 404 apenas se permitido
        if (error.response?.status === 404 && allowNull) {
          return null;
        }
        throw error.response?.data ?? error;
      }

      // Log e lançamento de outros tipos de erro
      this.logger.error(`Core API error: ${(error as Error).message}`);
      throw error;
    }
  }
}
