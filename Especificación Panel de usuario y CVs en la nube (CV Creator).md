# Especificación: Panel de usuario y CVs en la nube (CV Creator)

Documento de requisitos para implementar con un asistente de IA (Claude Code, Cursor, etc.). Versión borrador 1.0.

## 1. Contexto

CV Creator es un MVP desplegado en Vercel (https://cvcreator-three.vercel.app) que permite crear hojas de vida con un **editor** y una **vista previa (preview)**. Hoy cualquier persona puede entrar y usarlo sin cuenta.

Esta iteración añade **autenticación** y **almacenamiento en la nube con Supabase**, para que los usuarios registrados guarden sus CVs y los gestionen desde un panel.

> **Nota para la IA:** antes de escribir código, revisa la estructura actual del repositorio (framework, router, gestor de estado, cómo se guarda hoy el CV, librería de estilos) y adáptate a ella. No reescribas lo que ya funciona.

## 2. Objetivos

1. Invitar al visitante a iniciar sesión mediante un botón/frase llamativa en la parte superior derecha.
2. Permitir a los usuarios logueados ver todos los CVs que han creado, en **vista de lista** o **vista de cuadrícula** (estilo Google Drive).
3. Al abrir un CV, mostrar el **editor + preview** con ese CV cargado.
4. Guardar y recuperar los CVs desde **Supabase** (Auth + Postgres + RLS).

## 3. Alcance

**Dentro del alcance**

- Login / registro / cierre de sesión con Supabase Auth.
- CTA de login en el header para visitantes.
- Panel "Mis CVs" con lista/cuadrícula, crear, abrir, renombrar, duplicar y eliminar.
- Guardado de CVs en base de datos (con autoguardado).
- Seguridad por usuario con Row Level Security (RLS).

**Fuera del alcance (por ahora)**

- Pagos o planes premium.
- Compartir CVs por enlace público.
- Colaboración en tiempo real.
- Plantillas nuevas (solo se conservan las existentes).

## 4. Flujo de usuario

### 4.1 Visitante (sin sesión)

- Accede a la URL principal y puede usar el editor como hoy (modo invitado).
- En la **esquina superior derecha** ve un botón destacado, por ejemplo: **"Guarda tus CVs en la nube — Iniciar sesión"** (variante corta para móvil: **"Iniciar sesión"**).
- El botón debe llamar la atención (color de acento, borde o sutil animación), sin ser intrusivo.
- Al pulsarlo se abre un modal o página de login/registro.

### 4.2 Usuario logueado

- El botón del header se reemplaza por un **menú de usuario** (avatar + nombre/correo) con: *Mis CVs*, *Crear nuevo CV*, *Cerrar sesión*.
- Accede a la ruta protegida `/dashboard` (Mis CVs).
- Desde el panel puede cambiar entre vista **cuadrícula** y **lista**.
- Al hacer clic en un CV se abre `/editor/[id]` con el **editor y el preview** cargados con los datos de ese CV.
- Los cambios se guardan automáticamente (con indicador de estado: "Guardando…", "Guardado", "Error al guardar").

### 4.3 Migración del trabajo en modo invitado

Si el visitante tenía un CV en progreso (por ejemplo en localStorage) y luego inicia sesión, ofrecer: **"¿Quieres guardar el CV en el que estabas trabajando en tu cuenta?"** y crearlo en Supabase si acepta.

## 5. Requisitos funcionales

### RF-1 Autenticación (Supabase Auth)

- Métodos: **correo + contraseña** y **Google OAuth** (confirmar cuál se quiere; mínimo viable: correo + Google).
- Persistencia de sesión y refresco automático de token.
- Usar `@supabase/supabase-js` y, si el proyecto usa Next.js, `@supabase/ssr` para manejar cookies en servidor y cliente.
- Rutas protegidas: `/dashboard` y `/editor/[id]` redirigen a login si no hay sesión.
- Cierre de sesión que limpie el estado del cliente.

### RF-2 CTA de login en el header

- Visible solo para visitantes, alineado a la derecha.
- Responsive y accesible (foco visible, `aria-label`, contraste adecuado).

### RF-3 Panel "Mis CVs" (`/dashboard`)

- Carga los CVs del usuario ordenados por **última modificación** (descendente).
- **Alternador lista / cuadrícula** (icono en la barra superior del panel). Recordar la preferencia del usuario (localStorage o columna en perfil).
- **Vista cuadrícula:** tarjeta con miniatura/preview del CV, título, fecha de última edición.
- **Vista lista:** filas con título, plantilla usada, fecha de creación, fecha de última edición y menú de acciones.
- Acciones por CV: **Abrir**, **Renombrar**, **Duplicar**, **Eliminar** (con confirmación).
- Botón principal **"+ Nuevo CV"**.
- Estados vacío (sin CVs, con llamada a crear el primero), de carga (skeletons) y de error.
- Búsqueda por título (opcional, deseable).

### RF-4 Editor + preview (`/editor/[id]`)

- Reutiliza el editor y el preview existentes; solo cambia la fuente de datos (de estado local a Supabase).
- Carga el CV por `id`; si no existe o no pertenece al usuario, mostrar 404.
- **Autoguardado con debounce** (\~1.5 s tras dejar de escribir) y guardado al salir de la página.
- Título editable del CV en la cabecera del editor.
- Botón para volver al panel.

### RF-5 Miniaturas (opcional, fase 2)

Generar una imagen de preview al guardar (por ejemplo con html-to-image) y subirla a **Supabase Storage**; guardar la URL en `thumbnail_url`. Si no se implementa, usar un preview escalado del propio CV renderizado en la tarjeta.

## 6. Modelo de datos (Supabase / PostgreSQL)

El contenido del CV se guarda como **JSONB** para que sea flexible y coincida con el estado actual del editor. **Ajustar el esquema del JSON al que ya usa la app.**

```sql
-- Tabla principal de CVs
create table public.cvs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'CV sin título',
  template text,                       -- plantilla seleccionada
  content jsonb not null default '{}', -- datos del CV (estado del editor)
  thumbnail_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index cvs_user_id_updated_idx
  on public.cvs (user_id, updated_at desc);

-- Actualizar updated_at automáticamente
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger cvs_set_updated_at
  before update on public.cvs
  for each row execute function public.set_updated_at();

-- Row Level Security: cada usuario solo ve y modifica sus CVs
alter table public.cvs enable row level security;

create policy "cvs_select_own" on public.cvs
  for select using (auth.uid() = user_id);

create policy "cvs_insert_own" on public.cvs
  for insert with check (auth.uid() = user_id);

create policy "cvs_update_own" on public.cvs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "cvs_delete_own" on public.cvs
  for delete using (auth.uid() = user_id);
```

**Perfil opcional** (si se quiere guardar preferencias como la vista lista/cuadrícula):

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  dashboard_view text not null default 'grid' check (dashboard_view in ('grid','list'))
);
alter table public.profiles enable row level security;
create policy "profiles_own" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);
```

## 7. Rutas y estructura sugerida

| Ruta | Acceso | Descripción |
| --- | --- | --- |
| `/` | Público | Editor en modo invitado + CTA de login |
| `/login` (o modal) | Público | Inicio de sesión y registro |
| `/auth/callback` | Público | Callback de OAuth / confirmación de correo |
| `/dashboard` | Autenticado | Panel "Mis CVs" (lista/cuadrícula) |
| `/editor/[id]` | Autenticado | Editor + preview de un CV guardado |

Sugerencia de módulos (adaptar a la estructura real):

- `lib/supabase/client.ts` y `lib/supabase/server.ts` (clientes de Supabase).
- `lib/cvs.ts` (funciones: `listCvs`, `getCv`, `createCv`, `updateCv`, `duplicateCv`, `deleteCv`).
- `components/auth/LoginCta.tsx`, `UserMenu.tsx`, `AuthModal.tsx`.
- `components/dashboard/CvGrid.tsx`, `CvList.tsx`, `ViewToggle.tsx`, `CvCard.tsx`, `EmptyState.tsx`.
- `hooks/useAutosave.ts` (debounce + estado de guardado).
- `middleware.ts` para proteger rutas (si es Next.js).

## 8. Variables de entorno

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

- **Nunca** exponer la `service_role` key en el cliente.
- Configurarlas también en Vercel (Production y Preview).
- En Supabase: agregar la URL de Vercel y `http://localhost:3000` en *Authentication → URL Configuration* (Site URL y Redirect URLs).

## 9. Requisitos no funcionales

- **Seguridad:** RLS obligatorio en todas las tablas; validar propiedad del CV en servidor además de RLS.
- **Rendimiento:** listar solo columnas necesarias en el panel (sin traer el `content` completo si no hace falta).
- **UX:** estados de carga, error y vacío en todas las pantallas; mensajes en español.
- **Responsive:** el panel y el CTA deben funcionar bien en móvil.
- **Accesibilidad:** navegación por teclado, etiquetas ARIA y contraste suficiente.
- **Compatibilidad:** no romper el modo invitado actual.

## 10. Criterios de aceptación

- [ ] Un visitante ve el botón de login destacado arriba a la derecha y puede seguir usando el editor sin cuenta.
- [ ] Un usuario puede registrarse, iniciar y cerrar sesión; la sesión persiste al recargar.
- [ ] Al loguearse, el botón se sustituye por el menú de usuario.
- [ ] `/dashboard` lista solo los CVs del usuario autenticado.
- [ ] Se puede alternar entre lista y cuadrícula, y la preferencia se mantiene.
- [ ] Crear, renombrar, duplicar y eliminar un CV funcionan y se reflejan de inmediato.
- [ ] Abrir un CV muestra editor + preview con sus datos.
- [ ] Los cambios se autoguardan y se muestran al reabrir el CV.
- [ ] Un usuario no puede leer ni modificar CVs de otro (verificado con RLS).
- [ ] Acceder a `/dashboard` o `/editor/[id]` sin sesión redirige al login.
- [ ] Despliegue funcional en Vercel con las variables de entorno configuradas.

## 11. Plan de implementación sugerido (por fases)

1. **Base:** instalar Supabase, configurar clientes y variables de entorno.
2. **Base de datos:** ejecutar el SQL (tabla, trigger, RLS) y probar las políticas.
3. **Auth:** login/registro/logout, callback, middleware y rutas protegidas.
4. **Header:** CTA para visitantes y menú de usuario para logueados.
5. **CRUD de CVs:** capa `lib/cvs.ts` con todas las operaciones.
6. **Panel:** lista/cuadrícula, acciones y estados vacío/carga/error.
7. **Editor conectado:** carga por `id`, autoguardado, título editable.
8. **Migración de invitado:** ofrecer guardar el CV en progreso tras el login.
9. **Pulido:** miniaturas, búsqueda, accesibilidad, pruebas manuales y despliegue.

## 12. Instrucciones para la IA

- Trabaja por fases y confirma al final de cada una qué archivos modificaste.
- Mantén el código existente y el estilo del proyecto; no introduzcas dependencias innecesarias.
- Usa TypeScript con tipos explícitos para el modelo `Cv`.
- Maneja todos los errores de Supabase y muestra mensajes claros al usuario.
- Si algo de esta especificación choca con la estructura real del proyecto, propón la alternativa antes de implementar.
- Entrega al final: SQL ejecutable, lista de variables de entorno y pasos de prueba manual.
