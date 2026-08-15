# Deskly

Mesa de ayuda para negocios pequeños: tus clientes abren tickets de soporte sin crear cuenta, tú los atiendes desde un panel.

## Qué hace

- **Cuenta de negocio** con registro/login (contraseña con bcrypt, sesión firmada con JWT en cookie httpOnly).
- **Página pública de soporte** en `tudominio.com/tu-negocio`: el cliente abre un ticket (asunto, descripción, nombre, correo) sin necesidad de cuenta, y recibe un código corto para darle seguimiento.
- **Seguimiento sin cuenta**: el cliente vuelve a `tudominio.com/tu-negocio/ticket/CODIGO`, confirma su correo, y ve el hilo completo — incluida la respuesta del negocio — y puede responder de vuelta.
- **Panel del negocio**: bandeja de tickets con filtro por estado (abiertos/en progreso/cerrados), prioridad, hilo de mensajes por ticket, y control de estado/prioridad.
- Un ticket cerrado deja de aceptar respuestas del cliente, tanto en la interfaz como validado en el servidor.

## Por qué es real, no una demo

Igual que Slotwise, este es un producto que necesita backend genuino: un ticket abierto por un cliente debe ser visible para el negocio desde otro dispositivo, y la respuesta del negocio debe llegarle al cliente en su propia sesión — algo que `localStorage` no puede resolver. Usa la misma base **Neon (Postgres serverless)** vía Vercel, con:

- Contraseñas con **bcrypt**, sesiones con **JWT firmado** (`jose`), cookie httpOnly/secure.
- El acceso del cliente a su propio ticket se verifica en el servidor comparando el correo contra el que quedó registrado al crear el ticket — no es solo una URL "secreta", cada lectura y cada mensaje nuevo del cliente revalida el correo.
- El código de ticket se genera con `crypto.randomBytes`, evitando caracteres ambiguos (0/O, 1/I/L) para que sea fácil de transcribir.

Verificado con un flujo completo automatizado contra la base de datos de producción: crear cuenta → cliente abre ticket → aparece en el panel → filtros de estado funcionan → el negocio responde → el cliente ve la respuesta y contesta → el negocio ve esa respuesta → cerrar el ticket bloquea nuevas respuestas → un correo incorrecto no revela el contenido del ticket.

## Stack

Next.js 16 (App Router, Route Handlers), TypeScript, Tailwind CSS 4, React 19, Neon Postgres (`@neondatabase/serverless`), `bcryptjs`, `jose`.

## Estructura

- `lib/schema.sql` — tablas: cuentas, tickets, mensajes.
- `lib/jwt.ts` / `lib/auth.ts` / `lib/session.ts` — sesión (JWT) y contraseñas (bcrypt), separados para que `proxy.ts` (Edge runtime) no cargue bcrypt.
- `lib/ticketCode.ts` — generación del código corto de ticket.
- `proxy.ts` — protege `/dashboard/**`.
- `app/api/**` — endpoints privados (tickets, mensajes) y públicos (`/api/public/[slug]/**`).
- `app/[slug]/page.tsx` + `components/PublicSupportView.tsx` — página pública (nuevo ticket / ver ticket existente).
- `app/[slug]/ticket/[code]/page.tsx` + `components/TicketPublicView.tsx` — vista del ticket para el cliente.
- `app/dashboard/**` — panel del negocio.

## Estado

Completo y funcional. Verificado con build, lint, y un flujo end-to-end completo contra la base de datos Neon real, incluyendo el hilo de mensajes bidireccional y el bloqueo de tickets cerrados.

## Pendientes

Ninguno bloqueante. Posibles mejoras futuras: notificaciones por correo cuando hay una respuesta nueva, múltiples miembros de staff por cuenta, adjuntar archivos.
