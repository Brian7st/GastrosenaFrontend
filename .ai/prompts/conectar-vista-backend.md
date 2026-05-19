# Prompt — Conectar vista al backend real

> Usá este archivo al inicio de cada conversación donde vayas a reemplazar los mocks
> de una vista con llamadas HTTP reales.
>
> Reemplazá `{{VISTA}}` con el nombre de la vista antes de enviarlo
> (ej: `bienes`, `facturas`, `alertas`, `solicitudes-gil`, `presupuesto`, etc.)

---

## Contexto del proyecto

Estás trabajando en **GastroSENA**, un monorepo Nx.

- **Stack:** Angular 20 · Signals · HttpClient · TypeScript strict · SCSS con tokens
- **Dominio:** `libs/inventario/inventario/src/lib/`
- **Reglas:** seguí EXACTAMENTE las instrucciones de `.ai/rules/architecture.md` y `.ai/rules/code-quality.md`
- **Nunca** modifiques `libs/shared/**`, `apps/`, `tsconfig.base.json`, `nx.json`, `.eslintrc.json`

## Tarea

Implementar la capa de datos real para la vista **{{VISTA}}**, reemplazando los datos mock por llamadas HTTP al backend Spring Boot.

**NO toques la capa de presentación** (templates `.html`, estilos `.scss`, lógica de UI en el componente). Solo la capa de datos.

---

## Arquitectura obligatoria

El patrón es siempre este. No lo cambies:

```
Componente (OnPush + Signals)
  └── inject(Facade)
        └── inject(Service)
              └── inject(HttpClient) → backend
```

### Reglas de la capa de datos

**Servicio** (`data-access/services/`):
- `inject(HttpClient)` — nunca constructor injection
- Retorna siempre `Observable<T>` con tipo explícito — nunca `any`
- Un método por operación HTTP (getAll, getById, create, update, etc.)
- Toda transformación de DTO→Modelo va en un mapper separado, no en el servicio
- Manejo de errores con `catchError` → retorna `throwError(() => new ApiError(...))`

**Mapper** (`models/mappers/`):
- Función pura `mapXFromBackend(dto: XBackendDto): X`
- El tipo `XBackendDto` refleja exactamente lo que retorna el backend (sin omitir campos)
- Nunca usa `as any` ni castings inseguros

**Facade** (`data-access/*.facade.ts`):
- Estado privado: `private _items = signal<X[]>([])`
- Exposición pública: `readonly items = this._items.asReadonly()`
- Loading: `private _loading = signal(false)` con `finalize(() => this._loading.set(false))`
- Error: `private _error = signal<string | null>(null)`
- Métodos que mutagen señales internamente, nunca exponen el Observable hacia afuera

---

## Patrones de código — referencia rápida

### Servicio

```typescript
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { X, XFiltros } from '../models/x.model';
import { XBackendDto, mapXFromBackend } from '../models/mappers/x.mapper';

@Injectable({ providedIn: 'root' })
export class XService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/api/v1/...`;

  getAll(filtros?: XFiltros): Observable<X[]> {
    const params = buildParams(filtros);
    return this.http.get<XBackendDto[]>(this.url, { params }).pipe(
      map(dtos => dtos.map(mapXFromBackend)),
      catchError(handleApiError)
    );
  }

  getById(id: string): Observable<X> {
    return this.http.get<XBackendDto>(`${this.url}/${id}`).pipe(
      map(mapXFromBackend),
      catchError(handleApiError)
    );
  }
}

function buildParams(filtros?: XFiltros): HttpParams {
  let params = new HttpParams();
  if (filtros?.estado) params = params.set('estado', filtros.estado);
  // agrega más según el backend acepte
  return params;
}

function handleApiError(err: unknown): Observable<never> {
  const message =
    err instanceof Object && 'error' in err && err.error instanceof Object && 'detail' in err.error
      ? String((err.error as { detail: string }).detail)
      : 'Error inesperado del servidor';
  return throwError(() => new Error(message));
}
```

### Mapper

```typescript
// models/mappers/x.mapper.ts

// DTO — refleja exactamente la respuesta del backend
export interface XBackendDto {
  id: string;
  nombreCampoBackend: string;
  // todos los campos que retorna el endpoint
}

// Función pura de transformación
export function mapXFromBackend(dto: XBackendDto): X {
  return {
    id: dto.id,
    nombreCampoFrontend: dto.nombreCampoBackend,
    // mapear todos los campos con sus nombres correctos
  };
}
```

### Facade

```typescript
import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { X, XFiltros } from '../models/x.model';
import { XService } from './services/x.service';

@Injectable({ providedIn: 'root' })
export class XFacade {
  private svc = inject(XService);

  private _items   = signal<X[]>([]);
  private _loading = signal(false);
  private _error   = signal<string | null>(null);
  private _filtros = signal<XFiltros>({});

  readonly items   = this._items.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error   = this._error.asReadonly();
  readonly filtros = this._filtros.asReadonly();

  cargar(filtros?: XFiltros): void {
    if (filtros) this._filtros.set(filtros);
    this._loading.set(true);
    this._error.set(null);

    this.svc.getAll(this._filtros()).pipe(
      finalize(() => this._loading.set(false))
    ).subscribe({
      next:  items => this._items.set(items),
      error: err   => this._error.set(err.message),
    });
  }

  setFiltros(filtros: XFiltros): void {
    this._filtros.set({ ...this._filtros(), ...filtros });
    this.cargar();
  }
}
```

---

## Checklist antes de entregar

- [ ] No queda ningún `of(MOCK)` ni `delay()` en el servicio
- [ ] No queda ningún import de `*_MOCK` ni `*_mock` en servicios, facades ni componentes
- [ ] Todos los tipos son explícitos — ningún `any`
- [ ] El mapper tiene `XBackendDto` con todos los campos del backend
- [ ] La facade expone `.asReadonly()` para todos los signals públicos
- [ ] El componente NO cambió — solo inyecta la facade y llama sus métodos
- [ ] El servicio maneja errores con `catchError`
- [ ] Cada método del servicio tiene tipo de retorno explícito: `Observable<X>`, `Observable<X[]>`, `Observable<void>`

---

## Archivos que podés tocar

```
libs/inventario/inventario/src/lib/
  data-access/
    services/          ← creás o editás el servicio de la vista
    {{VISTA}}.facade.ts ← creás o actualizás la facade
  models/
    {{VISTA}}.model.ts  ← solo si hay que agregar el tipo BackendDto o ajustar campos
    mappers/            ← CREÁS esta carpeta y el mapper si no existe
      {{VISTA}}.mapper.ts
```

**NO toques:**
- Ningún archivo `.html`
- Ningún archivo `.scss`
- Los métodos que manejan UI en los componentes (modales, navegación, formateo visual)
- `libs/shared/**`

---

## Información del backend

**Base URL:** `environment.apiUrl` (ya configurado en `environments/environment.ts`)

El backend retorna errores en formato RFC 7807 ProblemDetail:
```json
{
  "title": "Error al crear factura",
  "detail": "El número FEL ya existe",
  "status": 422
}
```
Por eso el `handleApiError` lee `err.error.detail`.

Los estados del backend siempre vienen en **MAYÚSCULAS** (ej: `"REGISTRADA"`, `"BORRADOR"`).
Si el frontend usa capitalizado (`"Registrada"`, `"Borrador"`), mapeálos en el mapper.

---

## Adjuntá esto al prompt específico de la vista

Cuando inicies la conversación, agregá después de este archivo el bloque específico de la vista
que encontrás en `.ai/prompts/vistas/{{VISTA}}.md`.
Ese archivo tiene los endpoints exactos, los campos del backend y el mapa de conversión.
