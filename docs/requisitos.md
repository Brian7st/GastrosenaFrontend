# 📋 Requisitos Funcionales del Sistema

Este documento describe los roles/actores del sistema y los requisitos funcionales organizados por módulo. Cada requisito incluye su identificador, descripción, roles involucrados y tipo de prioridad (Esencial / Ideal / Opcional).

---

## Tabla de Contenido

- [Roles y Actores del Sistema](#roles-y-actores-del-sistema)
- **Módulos de Requisitos**
  1. [Inicio General](#1-inicio-general)
  2. [Gestión de Usuarios](#2-gestión-de-usuarios)
  3. [Reportes](#3-reportes)
  4. [Cocina](#4-cocina)
  5. [Bar y Barismo](#5-bar-y-barismo)
  6. [Gestión de Mesas](#6-gestión-de-mesas)
  7. [Gestión de Pedidos](#7-gestión-de-pedidos)
  8. [Comandas y Conexión](#8-comandas-y-conexión)
  9. [Estadísticas de Servicio](#9-estadísticas-de-servicio)
  10. [Facturación](#10-facturación)
  11. [Gestión de Bienes](#11-gestión-de-bienes)
  12. [Gestión de Facturas](#12-gestión-de-facturas)
  13. [GIL-F-014 (Solicitud)](#13-gil-f-014-solicitud)
  14. [Consolidado de Ejecución](#14-consolidado-de-ejecución)
  15. [Entradas y Salidas](#15-entradas-y-salidas)
  16. [Alertas de Stock](#16-alertas-de-stock)
  17. [Presupuesto General](#17-presupuesto-general)
  18. [Conciliación de Inventario](#18-conciliación-de-inventario)
  19. [Requisiciones Diarias](#19-requisiciones-diarias)
  20. [Actas de Legalización](#20-actas-de-legalización)
  21. [Paquete Probatorio](#21-paquete-probatorio)

---

## Roles y Actores del Sistema

El sistema cuenta con los siguientes roles/actores, cada uno con responsabilidades y permisos diferenciados:

### 👤 Administrador
**Módulos:** General, Inventario, Cocina, Bar y Barismo

Usuario con nivel máximo de permisos y control total del sistema. Supervisa la operación integral, incluyendo la gestión global de usuarios, el control absoluto del inventario y la administración de las áreas formativas (cocina y bar).

- Configura parámetros generales, administra cuentas (registro, roles, inactivación) y genera reportes globales.
- Administra el catálogo de bienes, insumos y recetarios (creación y edición de bebidas/platos).
- Controla entradas y salidas, revisa niveles de stock, ingresos/egresos y configura alertas por bajo inventario o productos vencidos.
- Autoriza movimientos especiales y valida conciliaciones de inventario.
- Supervisa facturas de proveedores, requisiciones, actas de legalización y planea las actividades formativas en las áreas de preparación.

---

### 👤 Contadora
**Módulos:** General, Inventario

Encargada de la gestión operativa, control contable y supervisión de inventario, insumos y equipos.

- Registra movimientos y controla ejecución presupuestal.
- Valida facturas electrónicas (con CUFE) y las asocia a solicitudes GIL-F-014.
- Verifica stock, realiza ajustes y genera reportes de conciliación y seguimiento.

---

### 👤 Instructor
**Módulos:** General, Restaurante, Inventario

Cuentadante y supervisor de las prácticas. Administra la operatividad formativa y gestiona a los aprendices.

- Configura áreas de atención, mesas y turnos.
- Genera requisiciones de insumos diarios por sesión y firma actas de legalización.
- Supervisa en tiempo real pedidos/salón y visualiza estadísticas de desempeño.
- Simula cierres de caja y análisis de tiempos.

---

### 👤 Instructor / Chef
**Módulos:** General, Cocina

Dirige la cocina. Supervisa los pedidos, la preparación y el consumo del inventario.

- Consulta pedidos recibidos en cocina.
- Supervisa tiempos de preparación, cocción, control de calidad y presentación.
- Capacita y evalúa el desarrollo de los aprendices.

---

### 👤 Instructor / Líder de Bar
**Módulos:** Bar y Barismo

Dirige el sistema de bar y barismo. Supervisa la correcta ejecución de los pedidos de bebidas.

- Consulta y supervisa pedidos de bebidas.
- Controla la calidad, presentación y preparación de los productos.
- Gestiona la capacitación y desarrollo en el área.

---

### 👤 Mesero (Aprendiz)
**Módulos:** General, Restaurante

Perfil operativo centrado en la atención al cliente en salón. Gestiona pagos y pedidos en el entorno simulado.

- Gestiona el mapa de mesas, toma y modifica pedidos digitalmente.
- Envía pedidos automáticamente (a cocina o bar) y consulta su estado en tiempo real.
- Cierra cuentas (simulación) y registra observaciones del servicio.

---

### 👤 Bartender / Barista (Aprendiz)
**Módulos:** General, Bar y Barismo

Responsable de recibir, preparar y gestionar bebidas alcohólicas y no alcohólicas.

- Recibe, prepara y envía pedidos del bar.
- Reporta el consumo y uso de insumos en su área.
- Gestión básica de su propia cuenta.

---

### 👤 Auxiliar de Cocina (Aprendiz)
**Módulos:** General, Cocina

Encargado de preparar las órdenes en cocina. Su interacción con el sistema digital es limitada y operativa.

- Visualiza pedidos entrantes.
- Realiza la cocción, ejecución y emplatado.
- Cambia el estado de las comandas a medida que avanza la preparación.

---

### 👤 Cajero (Aprendiz)
**Módulos:** General, Restaurante

Encargado del proceso de pagos simulados y facturación para finalizar la atención al cliente.

- Genera facturas, valida datos y registra pagos simulados (efectivo, tarjeta).
- Consulta facturas por fecha, mesa o mesero.
- Cierra turnos de caja generando reportes operativos.

---

### 👤 Usuario / Comensal
**Módulos:** General

Visitante externo sin autenticación. Accede para consultas informativas.

- Visualiza el menú disponible.
- Consulta la disponibilidad de mesas.

---

### 👤 Cliente Simulado
**Módulos:** Restaurante

Actor virtual (entidad de prueba) que permite simular la operación del restaurante.

- Recibe la atención simulada del mesero.
- Permite al sistema evaluar tiempos, calidad y procesos formativos.

---

### ⚙️ Sistema
**Módulos:** Cocina, Bar, Inventario

Actor automatizado que garantiza cálculos, consistencia, actualizaciones en tiempo real y trazabilidad.

- Actualiza pedidos y notifica cambios o cancelaciones a cocina/bar automáticamente.
- Calcula IVA (0%, 5%, 19%) y retención ZESE (0,625%).
- Actualiza stock, genera alertas de mínimos y controla duplicidad en GIL-F-014.
- Mantiene numeración consecutiva estricta de actas y valida CUFE (64 caracteres).

---

## 1. Inicio General

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF1.1 | Home del sistema: visualizar página principal con información general, contacto, recetas, bar, etc. | Todas las personas | Esencial |
| RF1.2 | Iniciar sesión: ingresar al sistema para interactuar según el rol. | Todos los roles | Esencial |
| RF1.2.1 | Bloqueo de cuenta: bloqueo temporal tras intentos fallidos de inicio de sesión. | Administrador | Ideal |
| RF1.3 | Restablecer contraseña: solicitar recuperación de contraseña. | Todos los roles | Esencial |
| RF1.3.1 | Confirmación de cambio de clave: enviar correo confirmando el cambio. | Todos los roles | Esencial |
| RF1.4 | Cerrar sesión: finalizar la sesión activa. | Todos los roles | Esencial |
| RF1.5 | Chatbot: chat asistencial con preguntas sobre el sistema. | Todas las personas | Esencial |
| RF1.6 | Recopilar comentarios: recopilar opiniones o sugerencias sobre la plataforma. | Todas las personas | Esencial |
| RF1.7 | Información del menú: visualizar menú del día y actualizaciones de recetas. | Todas las personas | Esencial |
| RF1.8.1 | Notificaciones automáticas: envío de correos ante eventos clave (bloqueos, cambios de clave). | Sistema | Ideal |
| RF1.8.2 | Panel de notificaciones: panel centralizado con notificaciones no leídas. | Usuario Registrado | Ideal |
| RF1.8.3 | Historial de notificaciones: consultar historial completo de notificaciones recibidas. | Usuario Registrado | Ideal |

---

## 2. Gestión de Usuarios

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF2.1 | Gestionar usuarios: ciclo completo de creación, consulta, edición, activación y eliminación. | Administrador | Esencial |
| RF2.1.1 | Notificación de registro: correo de confirmación al crear cuenta. | Administrador | Ideal |
| RF2.2 | Registro individual: registrar un usuario y asignarle permisos. | Administrador | Esencial |
| RF2.3 | Registro masivo de instructores: subir listas mediante archivos predefinidos. | Administrador | Esencial |
| RF2.3.1 | Registro masivo de aprendices: subir listas mediante archivos predefinidos. | Administrador | Esencial |
| RF2.4 | Consulta de usuarios: buscar, filtrar y visualizar información de usuarios. | Administrador | Esencial |
| RF2.5 | Gestión de perfiles: consultar y actualizar información personal propia. | Usuario, Admin | Esencial |
| RF2.6 | Gestión de roles: crear, modificar o eliminar roles de usuario. | Administrador | Esencial |
| RF2.6.1 | Gestión de permisos: asignar o revocar permisos específicos según rol. | Administrador | Esencial |
| RF2.7 | Historial de actividades: registrar acciones realizadas para trazabilidad. | Admin, Instructor | Ideal |

---

## 3. Reportes

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF6.1 | Gestión de reportes: gestionar reportes direccionados desde otros módulos. | Administrador | Esencial |
| RF6.1.1 | Reporte de uso de bienes: generar/exportar (PDF/Excel) reportes de bienes. | Contadora | Esencial |
| RF6.1.2 | Reporte de uso de insumos: generar/exportar reportes de insumos. | Contadora | Esencial |
| RF6.1.3 | Reporte de desempeño: generar/exportar desempeño de aprendices. | Administrador | Esencial |
| RF6.1.4 | Reporte de pedidos: generar/exportar cantidad de pedidos de cocina mensual/trimestral. | Admin, Chef | Esencial |
| RF6.1.5 | Reporte de facturación: generar/exportar facturación detallada por periodo. | Contadora | Esencial |
| RF6.1.6 | Reporte de ventas por mesero: generar/exportar ventas agrupadas por mesero. | Admin, Chef | Esencial |
| RF6.1.7 | Reporte de inventario: generar/exportar total de bienes existentes. | Contadora | Esencial |
| RF6.1.8 | Pre-factura: generar/exportar pre-facturas según pedidos. | Contadora | Esencial |
| RF6.1.9 | Reporte GIL F014: generar/exportar en formato estandarizado GIL F014. | Contadora | Esencial |
| RF6.1.10 | Factura global: generar/exportar factura global consolidada. | Contadora | Esencial |
| RF6.1.11 | Presupuesto general: generar/exportar presupuesto por periodo. | Contadora | Esencial |
| RF6.1.12 | Reporte de conciliación: generar/exportar reporte de conciliación contable. | Contadora | Esencial |

---

## 4. Cocina

### 4.1 Visualización y Estado de Pedidos

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF-C 4.0 | Visualización de pedidos: visualizar información básica del pedido recibido. | Admin Cocina, Chef, Aux | Esencial |
| RF-C 4.0.1 | Mostrar número de pedido: visualiza el identificador único. | Admin Cocina, Chef, Aux | Esencial |
| RF-C 4.0.2 | Mostrar hora de solicitud: muestra la hora exacta del pedido. | Admin Cocina, Chef | Esencial |
| RF-C 4.1 | Gestión del estado: actualizar y consultar estado del pedido. | Admin Cocina, Chef | Esencial |
| RF-C 4.1.1 | Cambiar estado de orden: cambia estado (Espera, Preparación, Listo, Cancelado). | Admin Cocina, Chef | Esencial |
| RF-C 4.1.2 | Mostrar estado actual: visualiza el estado actual del pedido. | Admin Cocina, Chef, Aux | Esencial |

### 4.2 Gestión de Recetas

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF-C 4.2 | Gestión de recetas. | Admin Cocina, Chef | Esencial |
| RF-C 4.2.1 | Crear recetas: ingresar datos, ingredientes, pasos, tiempo y porciones. | Admin Cocina, Chef | Esencial |
| RF-C 4.2.2 | Consultar recetas: acceder y filtrar por categoría e ingredientes. | Admin Cocina, Chef, Aux | Esencial |
| RF-C 4.2.3 | Actualizar recetas: cambiar ingredientes, porciones y guardar historial. | Admin Cocina, Chef | Esencial |
| RF-C 4.2.4 | Eliminar recetas: eliminar recetas no utilizadas o erróneas. | Admin Cocina, Chef | Esencial |

### 4.3 Estadísticas de Tiempos

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF-C 4.3 | Estadísticas de tiempos: medir y analizar tiempos de preparación. | Admin Cocina, Chef | Esencial |
| RF-C 4.3.1 | Registrar inicio: registra el momento de inicio de preparación. | Admin Cocina, Chef | Esencial |
| RF-C 4.3.2 | Registrar fin: registra el momento de fin de preparación. | Admin Cocina, Chef | Esencial |
| RF-C 4.3.3 | Tiempo promedio: calcula y muestra tiempo promedio por plato. | Admin Cocina, Chef | Ideal |
| RF-C 4.3.4 | Estadísticas por día: muestra datos diarios sobre tiempos. | Admin Cocina, Chef | Ideal |

### 4.4 Alertas, Filtrado y Cancelaciones

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF-C 4.4 | Alertas a sala: notificar al personal de sala el estado de pedidos. | Admin Cocina, Chef | Esencial |
| RF-C 4.4.1 | Notificar listo: envía alerta cuando el pedido está "Listo para Entrega". | Chef | Esencial |
| RF-C 4.4.2 | Configurar método de alerta: definir cómo se envían notificaciones (pantalla, sonido). | Admin Cocina | Ideal |
| RF-C 4.5 | Filtrado de pedidos: organizar pedidos según estado o tiempo. | Admin Cocina, Chef | Ideal |
| RF-C 4.5.1 | Filtrar por estado: filtra pedidos por estado actual. | Admin Cocina, Chef | Ideal |
| RF-C 4.5.2 | Filtrar por hora: filtra pedidos por hora de entrada. | Admin Cocina, Chef | Ideal |
| RF-C 4.6 | Cancelaciones: consultar las cancelaciones de pedidos. | Admin Cocina, Chef | Ideal |
| RF-C 4.6.1 | Mostrar cancelados: lista los pedidos cancelados. | Sistema | Opcional |
| RF-C 4.6.2 | Motivo de cancelación: visualizar el motivo de la cancelación. | Admin Cocina, Chef | Opcional |

### 4.5 Devoluciones y Modificaciones

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF-C 4.7 | Devoluciones: analizar devoluciones de platos. | Admin Cocina, Chef | Opcional |
| RF-C 4.7.1 | Causa de devolución: mostrar la causa de devolución de un plato. | Admin Cocina, Chef | Opcional |
| RF-C 4.7.2 | Estadísticas de devolución: generar reportes sobre devoluciones. | Admin Cocina, Chef | Opcional |
| RF-C 4.8 | Modificaciones: actualizar pedidos en curso por solicitud. | Sistema | Esencial |
| RF-C 4.8.1 | Mostrar solicitud de cambio: detalle de la modificación solicitada. | Sistema | Ideal |
| RF-C 4.8.2 | Actualizar preparación: modifica la preparación con el cambio aprobado. | Admin Cocina, Chef | Ideal |
| RF-C 4.8.3 | Notificar modificación: informa al personal de cocina sobre el cambio. | Sistema | Ideal |

### 4.6 Gestión de Menús

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF-C 4.9 | Gestión de menús: crear, organizar, actualizar y visualizar menús. | Admin Cocina, Chef | Ideal |
| RF-C 4.9.1 | Agregar platos: incorporar platos al menú. | Admin Cocina, Chef | Ideal |
| RF-C 4.9.2 | Editar platos: modificar/actualizar detalles de platos existentes. | Admin Cocina, Chef | Ideal |
| RF-C 4.9.3 | Eliminar platos: eliminar platos del menú. | Admin Cocina, Chef | Ideal |
| RF-C 4.9.4 | Mostrar menú actual: visualizar la lista completa y actualizada. | Admin Cocina, Chef, Aux | Ideal |

---

## 5. Bar y Barismo

### 5.1 Visualización y Estado

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF-C 4.10 | Visualización de pedidos bar: visualizar información básica del pedido. | Admin Bar, Líder, Bartender | Esencial |
| RF-C 4.10.1 | Mostrar número de pedido (Bar): visualiza identificador único. | Admin Bar, Líder, Bartender | Esencial |
| RF-C 4.10.2 | Mostrar hora de solicitud (Bar): hora exacta de solicitud. | Admin Bar, Líder | Esencial |
| RF-C 4.11 | Gestión del estado (Bar): actualizar y consultar estado. | Admin Bar, Líder | Esencial |
| RF-C 4.11.1 | Cambiar estado (Bar): cambia estado (Espera, Preparación, Listo). | Admin Bar, Líder | Esencial |
| RF-C 4.11.2 | Mostrar estado actual (Bar): visualiza el estado. | Admin Bar, Líder, Bartender | Esencial |

### 5.2 Recetas y Tiempos

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF-C 4.12 | Gestión de recetas (Bar): gestionar las recetas de bebidas. | Admin Bar, Líder | Esencial |
| RF-C 4.12.1 | Crear recetas (Bar): ingresar datos, ingredientes y pasos para bebidas. | Admin Bar, Líder | Esencial |
| RF-C 4.12.2 | Consultar recetas (Bar): acceder a la información de recetas de bebidas. | Admin Bar, Líder, Bartender | Esencial |
| RF-C 4.12.3 | Actualizar recetas (Bar): cambiar ingredientes, porciones y guardar historial. | Admin Bar, Líder | Esencial |
| RF-C 4.12.4 | Eliminar recetas (Bar): eliminar recetas no utilizadas. | Admin Bar, Líder | Esencial |
| RF-C 4.13 | Tiempos de preparación (Bar): medir y analizar tiempos. | Admin Bar, Líder | Esencial |
| RF-C 4.13.1 | Registrar inicio (Bar): momento de inicio de preparación. | Admin Bar, Líder | Esencial |
| RF-C 4.13.2 | Registrar fin (Bar): momento de fin de preparación. | Admin Bar, Líder | Esencial |
| RF-C 4.13.3 | Tiempo promedio (Bar): calcular tiempo promedio por bebida. | Admin Bar, Líder | Ideal |
| RF-C 4.13.4 | Estadísticas por día (Bar): datos diarios sobre tiempos. | Admin Bar, Líder | Ideal |

### 5.3 Alertas, Filtrado, Cancelaciones y Modificaciones

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF-C 4.14 | Alertas a sala (Bar): notificar al personal de sala el estado. | Admin Bar, Líder | Esencial |
| RF-C 4.14.1 | Notificar listo (Bar): envía alerta cuando la bebida está "Lista". | Líder | Esencial |
| RF-C 4.14.2 | Configurar notificación (Bar): método de envío de alertas. | Admin Bar | Ideal |
| RF-C 4.15 | Filtrado de pedidos (Bar): organizar por estado o tiempo. | Admin Bar, Líder | Ideal |
| RF-C 4.15.1 | Filtrar por estado (Bar): filtrar según estado actual. | Admin Bar, Líder | Ideal |
| RF-C 4.15.2 | Filtrar por hora (Bar): filtrar según hora de entrada. | Admin Bar, Líder | Ideal |
| RF-C 4.16 | Cancelaciones (Bar): consultar cancelaciones de bebidas. | Admin Bar, Líder | Ideal |
| RF-C 4.16.1 | Mostrar cancelados (Bar): listar pedidos cancelados. | Sistema | Opcional |
| RF-C 4.16.2 | Motivo cancelación (Bar): visualizar el motivo. | Admin Bar, Líder | Opcional |
| RF-C 4.17 | Devoluciones (Bar): analizar devoluciones de bebidas. | Admin Bar, Líder | Opcional |
| RF-C 4.17.1 | Causa devolución (Bar): mostrar causa de devolución. | Admin Bar, Líder | Opcional |
| RF-C 4.17.2 | Estadísticas devolución (Bar): generar reportes de devoluciones. | Admin Bar, Líder | Opcional |
| RF-C 4.18 | Modificaciones (Bar): actualizar bebidas en curso por solicitud. | Sistema | Esencial |
| RF-C 4.18.1 | Mostrar solicitud de cambio (Bar): detalle de modificación. | Sistema | Ideal |
| RF-C 4.18.2 | Actualizar preparación (Bar): modificar bebida en curso. | Admin Bar, Líder | Ideal |
| RF-C 4.18.3 | Notificar modificación (Bar): informar al personal del bar. | Sistema | Ideal |

### 5.4 Gestión de Menús (Bar)

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF-C 4.19 | Gestión de menús (Bar): crear y organizar menús de bar. | Admin Bar, Líder | Ideal |
| RF-C 4.19.1 | Agregar bebidas: incorporar bebidas al menú. | Admin Bar, Líder | Ideal |
| RF-C 4.19.2 | Editar bebidas: actualizar detalles de bebidas. | Admin Bar, Líder | Ideal |
| RF-C 4.19.3 | Eliminar bebidas: eliminar bebidas del menú. | Admin Bar, Líder | Ideal |
| RF-C 4.19.4 | Mostrar menú actual (Bar): presentar la lista completa. | Admin Bar, Líder, Bartender | Ideal |

---

## 6. Gestión de Mesas

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF3.1.1 | Consultar mapa: visualizar estado en tiempo real (disponible/ocupada). | Mesero, Instructor | Esencial |
| RF3.1.1.1 | Asignar mesas: asociar cliente(s) a una mesa. | Mesero, Instructor | Esencial |
| RF3.1.1.2 | Liberar mesas: marcar disponible tras el servicio. | Mesero, Instructor | Esencial |
| RF3.1.2 | Observaciones por mesa: agregar notas específicas (ej. cubiertos extra). | Mesero, Instructor | Ideal/Opc. |
| RF3.1.3 | Agregar mesa: registrar nueva mesa en el sistema. | Instructor | Esencial |
| RF3.1.4 | Eliminar mesa: eliminar mesa del sistema. | Instructor | Esencial |

---

## 7. Gestión de Pedidos

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF3.2.1 | Menú digital: visualizar catálogo de productos. | Mesero, Instructor, Cliente (QR) | Esencial |
| RF3.2.1.1 | Añadir a carrito: escoger ítems y agregar al pedido en curso. | Mesero, Instructor | Esencial |
| RF3.2.2 | Gestionar carrito: almacenar y revisar los pedidos en proceso. | Mesero, Instructor | Esencial |
| RF3.2.2.1 | Mostrar valores: precio total por ítem y total general en tiempo real. | Mesero, Instructor | Esencial |
| RF3.2.2.2 | Modificar productos: cambiar cantidades o detalles en el carrito. | Mesero, Instructor | Esencial |
| RF3.2.2.3 | Eliminar productos: retirar ítems del pedido. | Mesero, Instructor | Esencial |
| RF3.2.3 | Observaciones por producto: anotar detalles (ej. "sin cebolla"). | Mesero, Cliente | Esencial |
| RF3.2.4 | Seguimiento de pedido: hacer seguimiento a pedidos realizados. | Mesero, Instructor | Esencial |
| RF3.2.4.1 | Consultar estado del pedido: visualizar si está en preparación, listo o entregado. | Mesero, Instructor | Esencial |
| RF3.2.4.2 | Notificar pedido listo: alerta automática al mesero. | Sistema | Esencial |
| RF3.2.4.3 | Actualizar estado del pedido: cambiar estado manualmente (ej. "en entrega"). | Mesero, Instructor | Esencial |
| RF3.2.4.4 | Finalizar entrega: validar que el cliente recibió el pedido. | Mesero, Instructor | Esencial |

---

## 8. Comandas y Conexión

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF3.3.1 | Crear comanda digital: generación automática a partir del pedido. | Sistema, Mesero | Esencial |
| RF3.3.1.1 | Notificar a cocina/bar: enviar comanda a la estación correspondiente. | Sistema, Mesero | Esencial |
| RF3.3.1.2 | Reenviar comanda: reintento en caso de falla de comunicación. | Mesero, Instructor | Ideal |
| RF3.3.2 | Cancelar comanda: anular pedido enviado antes de 5 min por error/solicitud. | Mesero, Instructor | Esencial |
| RF3.3.3 | Consultar comandas: visualizar listado general de comandas. | Instructor | Ideal |
| RF3.3.3.1 | Consultar por fecha: buscar comandas según el día. | Instructor | Ideal |
| RF3.3.3.2 | Consultar por mesa: buscar comandas asociadas a una mesa. | Instructor | Ideal |
| RF3.3.3.3 | Consultar por mesero: listar comandas atendidas por un mesero. | Instructor | Ideal |
| RF3.3.4 | Editar comanda activa: permitir edición de una comanda en curso. | Instructor | Ideal |

---

## 9. Estadísticas de Servicio

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF3.4.1 | Consultar estadísticas: ver estadísticas propias del módulo de servicio. | Instructor | Ideal |
| RF3.4.1.1 | Ver pedidos activos: mostrar pedidos en proceso. | Instructor, Mesero | Esencial |
| RF3.4.1.2 | Historial por mesa: revisar pedidos previos de cada mesa. | Instructor | Ideal |
| RF3.4.1.3 | Tiempos de atención: visualizar eficiencia promedio en atención. | Instructor | Opcional |
| RF3.4.1.4 | Consumo por mesa: balance de consumo por cliente/mesa. | Instructor | Ideal |
| RF3.4.1.5 | Exportar reporte operativo: descargar resumen del turno en curso. | Instructor | Opcional |

---

## 10. Facturación

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF3.5.1 | Generar factura: crear factura asociada a un pedido. | Sistema, Cajero, Instructor | Esencial |
| RF3.5.1.1 | Validar datos de factura: verificar info antes de confirmar. | Sistema, Cajero, Instructor | Esencial |
| RF3.5.1.2 | Exportar factura: descargar o imprimir el comprobante. | Cajero, Instructor | Ideal |
| RF3.5.2 | Buscar factura: localizar histórico para consulta. | Instructor, Cajero | Ideal |
| RF3.5.2.1 | Buscar por fecha: filtrar facturas por día. | Instructor, Cajero | Ideal |
| RF3.5.2.2 | Buscar por mesa: filtrar facturas por mesa. | Instructor, Cajero | Ideal |
| RF3.5.2.3 | Buscar por mesero: filtrar facturas emitidas por un mesero. | Instructor, Cajero | Ideal |
| RF3.5.3 | Registrar pago simulado: simular registro de pagos en el sistema. | Cajero, Instructor | Esencial |
| RF3.5.3.1 | Pago en efectivo: registrar pagos en efectivo. | Cajero, Instructor | Esencial |
| RF3.5.3.2 | Pago con tarjeta: simular pagos con tarjeta. | Cajero, Instructor | Esencial |
| RF3.5.3.3 | Pago por consignación: simular pagos (Nequi, Daviplata, etc.). | Cajero, Instructor | Esencial |

---

## 11. Gestión de Bienes

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF-5.1 | Inventario central: control sobre el ciclo de vida de los productos. | Admin, Contadora | Esencial |
| RF-5.1.1 | Registro de bienes: captura nombre, categoría, stock mínimo, UM, valor e IVA. | Admin, Contadora | Esencial |
| RF-5.1.1.1 | Doble codificación: código interno SENA y código proveedor mapeados. | Sistema | Esencial |
| RF-5.1.1.2 | Catálogo UM: maestro de unidades validando coherencia de conversión. | Sistema | Esencial |
| RF-5.1.2 | Consulta de catálogo: filtros dinámicos; resaltar bienes bajo stock. | Sistema | Esencial |
| RF-5.1.3 | Modificación de bienes: edición de atributos (bloqueo UM si hay historial). | Admin, Contadora | Esencial |
| RF-5.1.4 | Eliminación masiva: borrado de múltiples registros con validación de seguridad. | Admin, Contadora | Modificado |
| RF-5.1.4.1 | Eliminación individual: borrado de único ítem sin transacciones (soft-delete). | Admin, Contadora | Ideal |
| RF-5.1.5 | Detalle de bien: ficha técnica, historial cronológico y facturas (CUFE). | Admin, Contadora | Esencial |
| RF-5.1.6 | Monitor de stock crítico: cambio automático de estado a "Bajo Stock". | Sistema | Esencial |
| RF-5.1.7 | Importación de datos: carga desde Excel/CSV con validación de duplicados. | Administrador | Ideal |
| RF-5.1.8 | Exportación de catálogo: PDF/Excel con lista de precios y existencias. | Admin, Contadora | Ideal |

---

## 12. Gestión de Facturas

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF-5.2 | Control de facturación: trazabilidad facturas vs GIL-F-014 aprobado. | Admin, Contadora | Esencial |
| RF-5.2.1 | Registro de factura: ingreso FEL, CUFE, fechas, NIT y Orden de Compra. | Admin, Contadora | Esencial |
| RF-5.2.1.1 | Validación CUFE: obligatorio 64 caracteres (Hash SHA-256). | Sistema | Esencial |
| RF-5.2.1.2 | Cálculo ZESE: aplicación automática del 0.625% de retención (ZESE). | Sistema, Contadora | Esencial |
| RF-5.2.1.3 | Datos bancarios: cuenta bancaria del proveedor asociada. | Contadora | Ideal |
| RF-5.2.2 | Asociación Factura-GIL: vincular factura a GIL-F-014 verificando bienes. | Admin, Contadora | Esencial |
| RF-5.2.2.1 | Desglose de IVA: cálculo de subtotales por tasas (0%, 5%, 19%). | Sistema | Esencial |
| RF-5.2.2.2 | Conciliación técnica: comparar GIL y factura, marcar diferencias. | Sistema, Contadora | Esencial |
| RF-5.2.3 | Buscador de facturas: filtros por CUFE, estado, proveedor y programa. | Sistema | Esencial |
| RF-5.2.4 | Detalle de factura: ítems, retenciones, soportes y cuentadante. | Admin, Contadora | Esencial |
| RF-5.2.5 | Edición de factura: solo si está en "Registrada", bloqueada post-verificación. | Admin, Contadora | Esencial |
| RF-5.2.6 | Anulación de factura: cambio a "Anulada" con motivo/fecha, sin borrado físico. | Admin, Contadora | Esencial |
| RF-5.2.7 | Ciclo de vida FEL: estados Registrada → Verificada → Pagada. | Sistema | Esencial |
| RF-5.2.8 | Dashboard de facturas: contador visual de facturas por estado. | Sistema | Esencial |
| RF-5.2.9 | Exportación contable: Excel con listado de facturas y retenciones. | Admin, Contadora | Ideal |
| RF-5.2.10 | Vínculo cuentadante: extraer instructor de la Orden de Compra y validar. | Sistema | Esencial |

---

## 13. GIL-F-014 (Solicitud)

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF-5.3 | Gestión GIL: control de solicitudes oficiales para abastecimiento. | Admin, Contadora | Esencial |
| RF-5.3.1 | Registro de solicitud: Centro de Costos, Área, Cuentadante, Destino y Ficha (7 dígitos). | Admin, Contadora | Esencial |
| RF-5.3.1.1 | Cuentadante múltiple: agregar múltiples responsables dinámicamente. | Admin, Contadora | Esencial |
| RF-5.3.1.2 | Datos pedagógicos: RA, actividades planificadas y Vocero de Aprendices. | Admin, Contadora | Esencial |
| RF-5.3.2 | Emisión GIL: aprobar/enviar GIL al proveedor (campos obligatorios listos). | Admin, Contadora | Esencial |
| RF-5.3.3 | Restricción de flujo: impedir cargar factura a un GIL que no esté "Aprobado". | Sistema | Esencial |
| RF-5.3.4 | Precarga de datos: al facturar, autocompletar bienes según el GIL. | Sistema | Esencial |
| RF-5.3.5 | Conciliación post-recepción: registrar sobrantes/faltantes tras llegada física. | Admin, Contadora | Ideal |
| RF-5.3.6 | Historial GIL: lista filtrable por ficha, instructor, fecha y estado. | Sistema | Esencial |
| RF-5.3.7 | Generación de formato: exportación en .docx con plantilla oficial GIL-F-014. | Admin, Contadora | Esencial |
| RF-5.3.8 | Estados GIL: Borrador → Pendiente → Validado → Aprobado → Procesado. | Sistema | Esencial |
| RF-5.3.9 | Seguridad documental: GIL "Procesado" inhabilitado para cambios. | Sistema | Esencial |

---

## 14. Consolidado de Ejecución

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF-5.4.1 | Selección de fuente: elegir varios GIL-F-014 para unificarlos en un reporte. | Contadora | Esencial |
| RF-5.4.2 | Generación de tabla: reporte con datos financieros, ficha, descripción e IVA. | Sistema | Esencial |
| RF-5.4.3 | Consecutivo de informe: serie única para cada consolidado. | Sistema | Esencial |
| RF-5.4.4 | Sumatorias automáticas: calcular valores netos, IVA y Retención ZESE total. | Sistema | Esencial |
| RF-5.4.5 | Control de duplicados: evitar incluir un mismo GIL en múltiples consolidados. | Sistema | Esencial |
| RF-5.4.8 | Trazabilidad FEL: mostrar el CUFE de cada factura origen en el informe. | Sistema | Esencial |

---

## 15. Entradas y Salidas

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF-5.5.1 | Registro de entrada: ingreso manual (factura, código SENA, cantidad). | Admin, Contadora | Esencial |
| RF-5.5.2 | Carga masiva desde GIL: proceso automático desde GIL conciliado. | Admin, Contadora | Esencial |
| RF-5.5.2.1 | Validación de existencia: verificar que el producto exista antes de cargar. | Sistema | Esencial |
| RF-5.5.3 | Registro de salida: requisición indicando ficha, categoría e instructor (sin sobregiro). | Admin, Contadora | Esencial |
| RF-5.5.3.1 | Trazabilidad de código: registro obligatorio de código interno SENA en salidas. | Sistema | Esencial |
| RF-5.5.3.2 | Clasificación de salida: Abarrotes, Lácteos, Frutas/Veg., Carnes/Pescados. | Sistema | Esencial |
| RF-5.5.4 | Historial de movimientos: log detallado (quién, qué, cuándo) con documento origen. | Sistema | Esencial |
| RF-5.5.5 | Sincronización de stock: saldo actualizado instantáneamente tras transacción. | Sistema | Esencial |
| RF-5.5.10 | Formato de requisición: números de requisición con sufijo configurable. | Sistema | Esencial |

---

## 16. Alertas de Stock

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF-5.6.1 | Configurar umbrales: definir nivel mínimo aceptable por producto. | Admin, Contadora | Esencial |
| RF-5.6.2 | Notificación en tiempo real: alerta en dashboard/email cuando el stock toca el mínimo. | Sistema | Esencial |
| RF-5.6.3 | Niveles de prioridad: Crítica (0), Alta (<25%), Media (en límite). | Sistema | Esencial |
| RF-5.6.6 | Registro de resolución: historial de quién atendió y qué acción tomó. | Sistema | Esencial |

---

## 17. Presupuesto General

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF-5.7.1 | Asignación inicial: techos presupuestales por programa y rubro. | Admin, Contadora | Esencial |
| RF-5.7.2 | Visibilidad financiera: saldos Disponible, Comprometido, Pagado y ZESE. | Admin, Contadora | Esencial |
| RF-5.7.3 | Afectación presupuestal: al aprobar GIL, mueve de Disponible a Comprometido. | Admin, Contadora | Esencial |
| RF-5.7.4 | Bloqueo por déficit: impedir aprobación de GIL si supera saldo disponible. | Admin, Contadora | Esencial |
| RF-5.7.5 | Cierre de pago: al pagar FEL, valor se mueve a Ejecutado/Pagado. | Admin, Contadora | Esencial |
| RF-5.7.9 | Control ZESE: rastreo independiente del total de retenciones ZESE. | Sistema | Esencial |

---

## 18. Conciliación de Inventario

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF-5.8.1 | Toma física: formulario para ingresar conteo real por fecha/responsable. | Admin, Contadora | Esencial |
| RF-5.8.4 | Detección de brechas: comparación automática sistema vs conteo, resaltando diferencias. | Admin, Contadora | Esencial |
| RF-5.8.5 | Valoración de pérdida: cálculo monetario de las diferencias encontradas. | Admin, Contadora | Esencial |
| RF-5.8.10 | KPI de precisión: cálculo del % de exactitud en inventario. | Admin, Contadora | Esencial |

---

## 19. Requisiciones Diarias

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF-5.9.1 | Apertura de requisición: registro de sesión con fecha, hora, ficha e instructor. | Instructor, Contadora | Esencial |
| RF-5.9.2 | Categorización pedagógica: Abarrotes, Lácteos, Carnes, Frutas/Vegetales. | Instructor | Esencial |
| RF-5.9.3 | Validación de almacén: verificar disponibilidad antes de enviar la solicitud. | Sistema | Esencial |
| RF-5.9.5 | Exportación SENA: documento en .docx para firma física de entrega. | Instructor, Contadora | Esencial |
| RF-5.9.6 | Ciclo de requisición: Borrador → Enviada → Despachada → Firmada → Legalizada. | Sistema | Esencial |

---

## 20. Actas de Legalización

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF-5.10.1 | Apertura de acta: registro de lugar, regional, fecha y agenda de la sesión. | Instructor, Contadora | Esencial |
| RF-5.10.4 | Vínculo con insumos: el acta jala los datos de la Requisición Diaria asociada. | Sistema | Esencial |
| RF-5.10.7 | Firmantes de ley: exige registro de aprobación del Instructor y Vocero. | Sistema | Esencial |
| RF-5.10.10 | Estados de acta: Borrador → Pendiente → Firmada → Revisada → Archivada. | Sistema | Esencial |

---

## 21. Paquete Probatorio

| ID | Descripción | Roles | Tipo |
|----|-------------|-------|------|
| RF-5.11.1 | Estructura del paquete: consolidar Acta, Requisición y Registro de Asistencia. | Sistema | Esencial |
| RF-5.11.3 | Candado de completitud: no permite archivar si falta asistencia de aprendices. | Sistema | Esencial |
| RF-5.11.7 | Integridad de datos: trazabilidad final vinculando Paquete, CUFE de factura y GIL. | Sistema | Esencial |

---

## Leyenda de Tipos

| Tipo | Descripción |
|------|-------------|
| **Esencial** | Requisito obligatorio para el funcionamiento del sistema |
| **Ideal** | Requisito deseable que agrega valor, pero no es bloqueante |
| **Opcional** | Requisito de mejora, implementable en fases posteriores |
| **Modificado** | Requisito ajustado respecto a la especificación original |
