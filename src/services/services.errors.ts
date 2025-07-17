
// src/services/errors.ts
// Description: Gestion des erreurs standardisées pour les services liés aux cours, onglets, sections, modules, étapes, outils et partenaires.

/**
 * Classe d'erreur personnalisée pour standardiser les erreurs des services.
 * @example
 * throw new ServiceError(ERROR_CODES.VALIDATION_ERROR, "Champ manquant", { field: "title" });
 */
export class ServiceError extends Error {
  /**
   * @param code - Code d'erreur standardisé (voir ERROR_CODES).
   * @param message - Message décrivant l'erreur.
   * @param details - Détails supplémentaires (facultatif).
   * @param cause - Erreur sous-jacente (facultatif).
   */
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: Record<string, any>,
    public cause?: Error
  ) {
    if (!Object.values(ERROR_CODES).includes(code)) {
      throw new Error(`Code d'erreur invalide : ${code}`);
    }
    super(message);
    this.name = "ServiceError";
    this.cause = cause;
    Object.setPrototypeOf(this, ServiceError.prototype);
  }

  /**
   * Sérialise l'erreur pour une réponse API.
   * @returns Objet JSON avec code, message, détails, et cause (en développement uniquement).
   */
  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details || null,
      cause: process.env.NODE_ENV === "development" && this.cause ? { message: this.cause.message } : null,
    };
  }

  /**
   * Vérifie si une erreur est une instance de ServiceError.
   * @param error - L'erreur à vérifier.
   * @returns True si l'erreur est une ServiceError.
   */
  static isServiceError(error: unknown): error is ServiceError {
    return error instanceof ServiceError;
  }

  /**
   * Crée une ServiceError à partir d'une erreur existante.
   * @param error - L'erreur à convertir.
   * @param code - Code d'erreur (facultatif, défaut : INTERNAL_SERVER_ERROR).
   * @param message - Message d'erreur (facultatif).
   * @param details - Détails supplémentaires (facultatif).
   * @returns Une instance de ServiceError.
   */
  static fromError(
    error: unknown,
    code: ErrorCode = ERROR_CODES.INTERNAL_SERVER_ERROR,
    message?: string,
    details?: Record<string, any>
  ): ServiceError {
    if (error instanceof ServiceError) {
      return error;
    }
    return new ServiceError(
      code,
      message || (error instanceof Error ? error.message : "Erreur inconnue"),
      details,
      error instanceof Error ? error : undefined
    );
  }

  /**
   * Mappe les codes d'erreur aux statuts HTTP pour les réponses API.
   * @param code - Code d'erreur.
   * @returns Statut HTTP correspondant.
   */
  static getHttpStatus(code: ErrorCode): number {
    const statusMap: Record<ErrorCode, number> = {
      [ERROR_CODES.VALIDATION_ERROR]: 400,
      [ERROR_CODES.INVALID_INPUT]: 400,
      [ERROR_CODES.MISSING_REQUIRED_FIELD]: 400,
      [ERROR_CODES.AUTHENTICATION_ERROR]: 401,
      [ERROR_CODES.METHOD_NOT_ALLOWED]: 405,
      [ERROR_CODES.NOT_FOUND]: 404,
      [ERROR_CODES.DATABASE_ERROR]: 500,
      [ERROR_CODES.FOREIGN_KEY_CONSTRAINT]: 400,
      [ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION]: 409,
      [ERROR_CODES.INTERNAL_SERVER_ERROR]: 500,
      [ERROR_CODES.SERVICE_UNAVAILABLE]: 503,
      [ERROR_CODES.TIMEOUT_ERROR]: 504,
      [ERROR_CODES.INVALID_COURSE_KEY]: 400,
      [ERROR_CODES.COURSE_ALREADY_EXISTS]: 409,
      [ERROR_CODES.INVALID_MODULE_ORDER]: 400,
      [ERROR_CODES.INVALID_TAB_KEY]: 400,
      [ERROR_CODES.TAB_ALREADY_EXISTS]: 409,
      [ERROR_CODES.INVALID_SECTION_KEY]: 400,
      [ERROR_CODES.SECTION_ALREADY_EXISTS]: 409,
      [ERROR_CODES.INVALID_MODULE_NUMBER]: 400,
      [ERROR_CODES.MODULE_ALREADY_EXISTS]: 409,
      [ERROR_CODES.INVALID_STEP_ORDER]: 400,
      [ERROR_CODES.STEP_ALREADY_EXISTS]: 409,
      [ERROR_CODES.INVALID_TOOL_NAME]: 400,
      [ERROR_CODES.TOOL_ALREADY_EXISTS]: 409,
      [ERROR_CODES.INVALID_PARTNER_NAME]: 400,
      [ERROR_CODES.PARTNER_ALREADY_EXISTS]: 409,
      [ERROR_CODES.INVALID_COURSE_RELATION]: 400,
      [ERROR_CODES.INVALID_MODULE_RELATION]: 400,
      [ERROR_CODES.INVALID_TOOL_RELATION]: 400,
      [ERROR_CODES.INVALID_PARTNER_RELATION]: 400,
    };
    return statusMap[code] || 500;
  }
}

/**
 * Codes d'erreur standardisés pour les services liés aux cours, onglets, sections, modules, étapes, outils et partenaires.
 * @example
 * throw new ServiceError(ERROR_CODES.NOT_FOUND, "Ressource non trouvée");
 */
export const ERROR_CODES = {
  // Erreurs de validation
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_INPUT: "INVALID_INPUT",
  MISSING_REQUIRED_FIELD: "MISSING_REQUIRED_FIELD",

  // Erreurs d'authentification/autorisation
  METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",

  // Erreurs de ressources
  NOT_FOUND: "NOT_FOUND",

  // Erreurs de base de données
  DATABASE_ERROR: "DATABASE_ERROR",
  FOREIGN_KEY_CONSTRAINT: "FOREIGN_KEY_CONSTRAINT",
  UNIQUE_CONSTRAINT_VIOLATION: "UNIQUE_CONSTRAINT_VIOLATION",

  // Erreurs système
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",

  // Erreurs spécifiques aux cours
  INVALID_COURSE_KEY: "INVALID_COURSE_KEY",
  COURSE_ALREADY_EXISTS: "COURSE_ALREADY_EXISTS",
  INVALID_MODULE_ORDER: "INVALID_MODULE_ORDER",
  INVALID_TAB_KEY: "INVALID_TAB_KEY",
  TAB_ALREADY_EXISTS: "TAB_ALREADY_EXISTS",
  INVALID_SECTION_KEY: "INVALID_SECTION_KEY",
  SECTION_ALREADY_EXISTS: "SECTION_ALREADY_EXISTS",
  INVALID_MODULE_NUMBER: "INVALID_MODULE_NUMBER",
  MODULE_ALREADY_EXISTS: "MODULE_ALREADY_EXISTS",
  INVALID_STEP_ORDER: "INVALID_STEP_ORDER",
  STEP_ALREADY_EXISTS: "STEP_ALREADY_EXISTS",
  INVALID_TOOL_NAME: "INVALID_TOOL_NAME",
  TOOL_ALREADY_EXISTS: "TOOL_ALREADY_EXISTS",
  INVALID_PARTNER_NAME: "INVALID_PARTNER_NAME",
  PARTNER_ALREADY_EXISTS: "PARTNER_ALREADY_EXISTS",
  INVALID_COURSE_RELATION: "INVALID_COURSE_RELATION",
  INVALID_MODULE_RELATION: "INVALID_MODULE_RELATION",
  INVALID_TOOL_RELATION: "INVALID_TOOL_RELATION",
  INVALID_PARTNER_RELATION: "INVALID_PARTNER_RELATION",
} as const;

/**
 * Type pour les codes d'erreur.
 */
export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
