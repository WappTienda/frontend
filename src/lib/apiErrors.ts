import axios from 'axios';

export const API_ERROR_MESSAGES: Record<number, string> = {
  400: 'La solicitud es incorrecta. Por favor verifica los datos enviados.',
  401: 'Sesión expirada. Por favor inicia sesión nuevamente.',
  403: 'No tienes permisos para realizar esta acción.',
  404: 'El recurso solicitado no fue encontrado.',
  409: 'Ya existe un recurso con los mismos datos.',
  422: 'Los datos enviados no son válidos.',
  500: 'Ocurrió un error en el servidor. Por favor intenta más tarde.',
  503: 'El servicio no está disponible temporalmente. Por favor intenta más tarde.',
};

export const DEFAULT_API_ERROR_MESSAGE = 'Ocurrió un error inesperado. Por favor intenta más tarde.';
export const NETWORK_ERROR_MESSAGE = 'No se pudo conectar al servidor. Verifica tu conexión a internet.';

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const { status } = error.response;
      return API_ERROR_MESSAGES[status] ?? DEFAULT_API_ERROR_MESSAGE;
    }
    if (error.request) {
      return NETWORK_ERROR_MESSAGE;
    }
  }
  return DEFAULT_API_ERROR_MESSAGE;
}
