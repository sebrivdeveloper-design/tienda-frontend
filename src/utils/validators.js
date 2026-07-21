/**
 * Helpers de validación reutilizables entre formularios.
 * Se mantienen genéricos y sin dependencias para poder usarse
 * en cualquier componente sin duplicar lógica.
 */

export const esVacio = (valor) =>
  valor === null || valor === undefined || String(valor).trim() === "";

export const esNumeroValido = (valor) =>
  !esVacio(valor) && !isNaN(Number(valor));

export const esNumeroPositivo = (valor) =>
  esNumeroValido(valor) && Number(valor) > 0;

export const esNumeroNoNegativo = (valor) =>
  esNumeroValido(valor) && Number(valor) >= 0;

export const esEnteroPositivo = (valor) =>
  esNumeroPositivo(valor) && Number.isInteger(Number(valor));