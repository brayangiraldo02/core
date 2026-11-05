import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SnackbarService } from './snackbar.service';

export interface RequestOptions {
  silent?: boolean;
}

export interface StructuredError {
  status?: number;
  message: string;
  error?: any;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private snackbarService = inject(SnackbarService);

  /**
   * Obtiene un título contextual en español según el código de estado HTTP o tipo de error.
   */
  static getErrorTitle(status?: number, isClientError: boolean = false): string {
    if (isClientError) {
      return 'Error en la Aplicación';
    }

    switch (status) {
      case 0:
        return 'Error de Conexión';
      case 400:
        return 'Solicitud Inválida';
      case 401:
        return 'No Autorizado';
      case 403:
        return 'Acceso Denegado';
      case 404:
        return 'Recurso No Encontrado';
      case 408:
        return 'Tiempo de Espera Agotado';
      case 409:
        return 'Conflicto';
      case 422:
        return 'Error de Validación';
      case 429:
        return 'Límite de Peticiones Excedido';
      case 500:
        return 'Error del Servidor';
      case 502:
        return 'Puerta de Enlace Incorrecta';
      case 503:
        return 'Servicio No Disponible';
      case 504:
        return 'Tiempo de Respuesta Agotado';
      default:
        if (status && status >= 400 && status < 500) {
          return `Error en la Solicitud (${status})`;
        }
        if (status && status >= 500) {
          return `Error del Servidor (${status})`;
        }
        return 'Error del Sistema';
    }
  }

  /**
   * Obtiene un mensaje descriptivo en español por defecto cuando el backend no proporciona detalles.
   */
  static getDefaultMessage(status?: number, isClientError: boolean = false): string {
    if (isClientError) {
      return 'Ocurrió un error inesperado en la aplicación del cliente.';
    }

    switch (status) {
      case 0:
        return 'No se pudo conectar con el servidor. Verifica tu conexión a internet o el estado del servicio.';
      case 400:
        return 'La solicitud contiene parámetros incorrectos o inválidos.';
      case 401:
        return 'Sesión no autorizada o expirada. Por favor, inicia sesión nuevamente.';
      case 403:
        return 'No tienes permiso para realizar esta acción.';
      case 404:
        return 'El recurso solicitado no fue encontrado en el servidor.';
      case 408:
        return 'La solicitud al servidor tardó demasiado tiempo en responder.';
      case 409:
        return 'Existe un conflicto con el estado actual del recurso.';
      case 422:
        return 'Los datos enviados no superaron las validaciones requeridas.';
      case 429:
        return 'Demasiadas solicitudes en poco tiempo. Intenta más tarde.';
      case 500:
        return 'Ocurrió un error interno en el servidor. Intenta de nuevo más tarde.';
      case 502:
        return 'Respuesta inválida recibida del servidor intermediario.';
      case 503:
        return 'El servicio se encuentra temporalmente en mantenimiento o no disponible.';
      case 504:
        return 'El servidor tardó demasiado en responder la petición.';
      default:
        if (status && status >= 400 && status < 500) {
          return `Error en la solicitud realizada (${status}).`;
        }
        if (status && status >= 500) {
          return `Error interno en el servidor (${status}).`;
        }
        return 'Ha ocurrido un error inesperado al procesar la solicitud.';
    }
  }

  /**
   * Traduce mensajes de validación comunes de Pydantic/FastAPI al español.
   */
  private static translateValidationMessage(msg: string): string {
    if (!msg) return msg;

    const lower = msg.toLowerCase();
    if (lower === 'field required') {
      return 'Campo requerido';
    }
    if (lower.includes('unable to parse string as an integer') || lower.includes('valid integer')) {
      return 'Debe ser un número entero válido';
    }
    if (lower.includes('unable to parse string as a number') || lower.includes('valid number')) {
      return 'Debe ser un número válido';
    }
    if (lower.includes('valid string')) {
      return 'Debe ser un texto válido';
    }
    if (lower.includes('valid boolean')) {
      return 'Debe ser un valor booleano (verdadero/falso)';
    }
    if (lower.includes('value is not a valid email address')) {
      return 'Debe ser un correo electrónico válido';
    }
    if (lower.includes('string should have at least')) {
      return msg.replace(
        /string should have at least (\d+) characters?/i,
        'Debe tener al menos $1 caracteres',
      );
    }
    if (lower.includes('string should have at most')) {
      return msg.replace(
        /string should have at most (\d+) characters?/i,
        'Debe tener como máximo $1 caracteres',
      );
    }

    return msg;
  }

  /**
   * Extrae el mensaje de error más específico proveniente del backend o de la excepción.
   * Soporta formatos FastAPI (detail como string o array de validaciones Pydantic),
   * respuestas con { message: "..." }, { error: "..." }, strings directos, etc.
   */
  static getErrorMessage(error: any, fallback: string = 'Ha ocurrido un error inesperado'): string {
    if (!error) {
      return fallback;
    }

    if (typeof error === 'string') {
      return error;
    }

    // Si el error contiene un payload error.error como string
    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }

    // Formato de validación FastAPI/Pydantic (estándar 'detail' o personalizado 'details')
    const validationList = Array.isArray(error.error?.details)
      ? error.error.details
      : Array.isArray(error.error?.detail)
        ? error.error.detail
        : null;

    if (validationList && validationList.length > 0) {
      const messages = validationList
        .map((item: any) => {
          const field =
            Array.isArray(item.loc) && item.loc.length > 0 ? item.loc[item.loc.length - 1] : '';
          const rawMsg = item.msg || (typeof item === 'string' ? item : JSON.stringify(item));
          const translatedMsg = ErrorHandlerService.translateValidationMessage(rawMsg);
          return field ? `${field}: ${translatedMsg}` : translatedMsg;
        })
        .filter(Boolean);

      if (messages.length > 0) {
        const prefix =
          typeof error.error?.message === 'string' &&
          error.error.message.trim() &&
          error.error.message !== messages.join('; ')
            ? `${error.error.message}: `
            : '';
        return `${prefix}${messages.join('; ')}`;
      }
    }

    // Formato estándar backend: { message: "..." }
    if (typeof error.error?.message === 'string' && error.error.message.trim()) {
      return error.error.message;
    }

    // Formato estándar FastAPI: { detail: "..." }
    if (typeof error.error?.detail === 'string' && error.error.detail.trim()) {
      return error.error.detail;
    }

    // Formato alternativo { error: "..." }
    if (typeof error.error?.error === 'string' && error.error.error.trim()) {
      return error.error.error;
    }

    // Si ya viene procesado en error.message (y no es el mensaje genérico de Angular)
    if (typeof error.message === 'string' && error.message.trim()) {
      if (
        !error.message.includes('Http failure response') &&
        !error.message.startsWith('Server-side error:')
      ) {
        return error.message;
      }
    }

    return fallback;
  }

  showErrorSnackbar(message: string, title: string = 'Error'): void {
    this.snackbarService.error(message, title);
  }

  /**
   * Intercepta y procesa errores HTTP de forma reactiva, desplegando notificación
   * vía snackbar y re-emitiendo el error estructurado.
   */
  handleError = (error: HttpErrorResponse | any, options?: RequestOptions): Observable<never> => {
    const isSilent = !!options?.silent;

    // Caso especial: error.error es un Blob (descargas de documentos/PDFs donde el backend retornó un JSON de error)
    if (
      error?.error instanceof Blob &&
      (error.error.type.includes('json') || error.error.type.includes('text') || !error.error.type)
    ) {
      const readPromise: Promise<string> =
        typeof (error.error as any).text === 'function'
          ? (error.error as Blob).text()
          : new Promise<string>((resolve, reject) => {
              try {
                const reader = new FileReader();
                reader.onload = () => resolve((reader.result as string) || '');
                reader.onerror = () => reject(new Error('No se pudo leer el contenido del Blob'));
                reader.readAsText(error.error as Blob);
              } catch (e) {
                reject(e);
              }
            });

      return from(readPromise).pipe(
        switchMap((text) => {
          let parsedMessage = text;
          let parsedError: any = text;
          try {
            parsedError = JSON.parse(text);
            parsedMessage = parsedError.message || parsedError.detail || parsedError.error || text;
          } catch (_) {}

          console.error('ErrorHandlerService (Blob error):', parsedMessage);
          const errorTitle = ErrorHandlerService.getErrorTitle(error.status);
          if (!isSilent) {
            this.snackbarService.error(parsedMessage, errorTitle);
          }
          return throwError(() => ({
            status: error.status,
            message: parsedMessage,
            error: parsedError,
          }));
        }),
      );
    }

    let errorMessage = 'Ha ocurrido un error inesperado';
    let errorTitle = 'Error del Sistema';

    if (error?.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorTitle = ErrorHandlerService.getErrorTitle(undefined, true);
      errorMessage = error.error.message || ErrorHandlerService.getDefaultMessage(undefined, true);
    } else {
      // Error del lado del servidor / HTTP
      const status = error?.status;
      errorTitle = ErrorHandlerService.getErrorTitle(status);
      if (status === 0) {
        errorMessage = ErrorHandlerService.getDefaultMessage(0);
      } else {
        const extracted = ErrorHandlerService.getErrorMessage(error, '');
        errorMessage = extracted || ErrorHandlerService.getDefaultMessage(status);
      }
    }

    console.error('ErrorHandlerService:', errorMessage, error);
    if (!isSilent) {
      this.snackbarService.error(errorMessage, errorTitle);
    }

    return throwError(() => ({
      status: error?.status,
      message: errorMessage,
      error: error?.error,
    }));
  };
}
