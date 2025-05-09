//app/lib/errors.ts
export function createBadRequest(message: string) {
    const error = new Error(message);
    error.name = "BadRequest";
    return error;
}

export function createNotFound(message: string) {
    const error = new Error(message);
    error.name = "NotFound";
    return error;
}

export function createUnauthorized(message: string) {
    const error = new Error(message);
    error.name = "Unauthorized";
    return error;
}

export function createForbidden(message: string) {
    const error = new Error(message);
    error.name = "Forbidden";
    return error;
}

export function createInternalServerError(message: string) {
    const error = new Error(message);
    error.name = "InternalServerError";
    return error;
}

export function createConflict(message: string) {
    const error = new Error(message);
    error.name = "Conflict";
    return error;
}