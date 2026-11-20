# coNETate · página de presentación

Página web que explica qué es **coNETate**, un portal cautivo WiFi con control de acceso (proyecto de tesis, UNVES, Paraguay), con una **demo interactiva**: un celular simulado y el panel del administrador conectados entre sí.

Desarrollado por **Oscar David Ocampos Ortigoza** y **Elías Orue Carranza**.

Es una página estática (HTML, CSS y JS, sin servidor ni dependencias externas). La demo corre en el navegador con datos de ejemplo: no envía nada a ningún lado.

## Contenido

```
index.html            la página
assets/css/estilos.css
assets/js/sitio.js    demo interactiva, tema claro/oscuro, animaciones
assets/js/mbopi.js    Mbopi, la mascota (el mismo dibujo del sistema)
assets/fonts/         Inter y Syne (licencia OFL al lado)
assets/img/           ícono y capturas del sistema con datos de ejemplo
```

## Publicarla en GitHub Pages

1. Crear un repositorio **público** nuevo (por ejemplo `conetate-web`) y subir todo el contenido de esta carpeta a la raíz.
2. En el repositorio: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)` → **Save**.
3. En uno o dos minutos queda en `https://<tu-usuario>.github.io/conetate-web/`.

## Verla en la computadora

Se puede abrir `index.html` con doble clic. Para verla igual que en GitHub Pages:

```
python -m http.server 8765
```

y entrar a `http://localhost:8765`.
