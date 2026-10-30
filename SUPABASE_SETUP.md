# Configuración de Supabase para CV Creator

La app ya usa Supabase Auth y Postgres para el registro, el inicio/cierre de sesión y las operaciones de CV. Para conectarla a tu proyecto hay que completar una configuración inicial en Supabase y Vercel. No compartas ni subas claves secretas.

## 1. Crear el proyecto Supabase

1. Entra en [supabase.com/dashboard](https://supabase.com/dashboard) e inicia sesión.
2. Selecciona **New project**, elige una organización, nombre y contraseña segura para la base de datos.
3. Selecciona una región cercana a los usuarios y crea el proyecto.
4. Espera a que termine el aprovisionamiento.

## 2. Crear la tabla y activar RLS

1. En Supabase, abre **SQL Editor** → **New query**.
2. Copia y ejecuta el contenido de [`supabase/schema.sql`](./supabase/schema.sql).
3. En **Table Editor**, confirma que existe `public.cvs` y que RLS está habilitado.
4. En **Authentication** → **Users**, las cuentas aparecerán cuando alguien se registre. La aplicación no necesita una tabla de perfiles.

La columna `content` es JSONB y almacena el Markdown que usa el editor. Las políticas RLS vinculan cada fila con el usuario autenticado; no desactives RLS ni crees políticas públicas para esta tabla.

## 3. Obtener las variables públicas de Supabase

1. Abre **Project Settings** → **API** (en algunas versiones, **API Keys**).
2. Copia la **Project URL**.
3. Copia la clave `publishable` del proyecto (formato `sb_publishable_...`).
4. En la raíz del proyecto, copia `.env.example` a `.env` y sustituye los valores:

```env
PUBLIC_SUPABASE_URL=https://tu-project-ref.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_tu_clave
```

La clave `publishable` se entrega al navegador y es segura para este uso porque la base está protegida por RLS. **Nunca** pongas `service_role`, una secret key (por ejemplo `sb_secret_...`) ni la contraseña de la base en variables `PUBLIC_*`, en el código del cliente o en Git. La app no requiere ninguna clave secreta.

`.env` está excluido de Git. Para desplegar, configura estas mismas dos variables en **Vercel → Project → Settings → Environment Variables** para Production, Preview y Development según corresponda. Los valores deben estar presentes durante el build; después de añadirlos o cambiarlos, vuelve a desplegar. Si tu `.env` ya tiene la variable antigua `PUBLIC_SUPABASE_ANON_KEY`, cambia solo su nombre a `PUBLIC_SUPABASE_PUBLISHABLE_KEY` y sustituye su valor por la clave `publishable` actual de Supabase.

## 4. Configurar correo y contraseñas

1. En Supabase, abre **Authentication** → **Providers** → **Email** y habilita el proveedor.
2. Decide si quieres exigir confirmación de correo:
   - **Activada:** el registro muestra un aviso y el usuario confirma el correo antes de iniciar sesión.
   - **Desactivada:** el registro inicia la sesión inmediatamente.
3. Para producción, configura un proveedor SMTP propio en **Authentication** → **SMTP Settings**. El servicio de correo de prueba de Supabase tiene límites y está pensado para pruebas.
4. La app utiliza la plantilla estándar de confirmación de Supabase. Si personalizas su enlace, conserva el destino de redirección indicado abajo.

## 5. Configurar URLs de autenticación

En **Authentication** → **URL Configuration**:

- **Site URL:** la URL pública principal, por ejemplo `https://tu-dominio.vercel.app`.
- **Redirect URLs:** añade cada origen usado, con la ruta callback:
  - `http://localhost:4321/auth/callback`
  - `https://tu-dominio.vercel.app/auth/callback`
  - Añade también los dominios Preview de Vercel que usarás para probar OAuth.

La URL callback debe coincidir con los dominios usados en el navegador. Si cambias el dominio de Vercel, actualiza esta lista y el proveedor Google.

## 6. Configurar Google OAuth

El botón de Google está conectado a Supabase OAuth; no simula usuarios. Para que el botón funcione, completa esta configuración manual:

1. En [Google Cloud Console](https://console.cloud.google.com/), crea o selecciona un proyecto y configura **OAuth consent screen**.
2. En **APIs & Services** → **Credentials**, crea un **OAuth client ID** de tipo **Web application**.
3. En **Authorized JavaScript origins**, añade:
   - `http://localhost:4321`
   - `https://tu-dominio.vercel.app`
4. En **Authorized redirect URIs**, añade la URL callback que muestra Supabase en **Authentication** → **Providers** → **Google**. Tiene este formato:
   - `https://TU_PROJECT_REF.supabase.co/auth/v1/callback`
5. Copia el Google **Client ID** y **Client Secret** a los campos del proveedor Google en Supabase y habilítalo.
6. Guarda los cambios y prueba primero en local y luego en el dominio de producción.

El `redirectTo` de la app es `/auth/callback`; Supabase debe permitir esa URL según el paso anterior. No introduzcas Client Secret de Google en `.env` ni en el frontend: se guarda solamente en la configuración del proveedor en Supabase.

## 7. Configurar Vercel

El editor usa la ruta dinámica `/editor/[id]`; por eso el proyecto configura el adaptador oficial `@astrojs/vercel` en modo server. Vercel debe desplegar el proyecto con el preset detectado por Astro:

1. En Vercel, importa el repositorio y deja **Build Command** como `npm run build`.
2. Usa la versión Node 20.x o posterior compatible con Astro 5.
3. Añade `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_PUBLISHABLE_KEY` en Environment Variables.
4. Despliega y prueba las URLs `/`, `/login`, `/dashboard`, `/editor/<id>` y `/auth/callback`.

No agregues un `vercel.json` con rewrites genéricos para `/editor`; el adaptador genera los handlers para las rutas dinámicas.

### Si todavía aparece el error de `PUBLIC_SUPABASE_ANON_KEY`

Ese mensaje pertenece a una versión anterior del cliente; el código actual requiere `PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Cambiar las variables de Vercel no actualiza el código que ya está publicado. Para resolverlo:

1. Confirma los cambios locales que incluyen `src/lib/supabase/client.js` y súbelos (commit y push) a la rama conectada al proyecto Vercel.
2. En **Vercel → Deployments**, comprueba que el último despliegue usa ese commit y la rama correcta. Si es un Preview, configura las variables también para **Preview**; para el sitio público, deben estar en **Production**.
3. Vuelve a desplegar ese commit para que Vite incorpore las variables `PUBLIC_*` al bundle del navegador.
4. Recarga el sitio evitando caché (Ctrl+Shift+R o Cmd+Shift+R). El error de configuración actual debe mencionar `PUBLIC_SUPABASE_PUBLISHABLE_KEY`, nunca `PUBLIC_SUPABASE_ANON_KEY`.

## 8. Comprobaciones antes de publicar

1. Arranca localmente con `npm run dev` y entra a `http://localhost:4321`.
2. Registra una cuenta de correo y confirma el correo si está habilitada la confirmación.
3. Comprueba el login, la persistencia tras recargar y el cierre de sesión.
4. Si configuraste Google, inicia sesión con Google y verifica el retorno desde `/auth/callback`.
5. Crea un CV, edítalo, espera el indicador **Guardado**, recarga y confirma que se conservan los cambios.
6. Prueba renombrar, duplicar, eliminar y cambiar entre vista de lista y cuadrícula.
7. Para comprobar aislamiento, usa dos cuentas: un usuario no debe ver, abrir, modificar ni eliminar el CV creado por el otro. Intenta además consultar/modificar filas con una sesión autenticada desde el API; RLS debe denegar el acceso cruzado.
8. Revisa **Supabase → Table Editor → cvs** y confirma que `user_id` y el contenido son los esperados.

## Notas de seguridad y operación

- La sesión y renovación de tokens las gestiona `@supabase/supabase-js` en el navegador.
- El panel y el editor consultan Supabase usando la clave pública y la sesión del usuario. La base filtra filas mediante RLS; la comprobación de propiedad no depende de un `user_id` enviado desde la interfaz.
- Las páginas protegidas redirigen a login en el cliente. No se renderiza contenido privado en el HTML inicial; cada lectura y escritura de contenido está protegida en Postgres por RLS.
- Los cambios del editor se guardan tras 1,5 segundos de inactividad y se intenta guardar al ocultar o abandonar la página. Espera a que aparezca **Guardado** antes de cerrar la pestaña para confirmar que terminó el último guardado.
- La preferencia lista/cuadrícula permanece local en el navegador y no requiere una tabla de perfiles.
