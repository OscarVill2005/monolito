Descripcion:
Es una aplicacion monolitica con un login, a esta aplicacion estan logeados
solo 2 usuarios, un usuario user, que gracias a las cookies puede acceder a la
pagina /home que esta protegida por las cookies, y otro usuario llamado
admin, el cual puede entrar a la pagina /admin, tambien protegida por cookies.
En ambas paginas tenemos un logout que se encarga de redirigirte al login a la vez que elimina
todas las cookies, hat 2 tipos de cookies, una que dice el tipo de usuario y otra
que dice el rol del usuario.
Los usuarios en el login estan respaldados por una autenticacion con una base de
datos con las contraseñas hasheadas, ya que las contraselñas estan hashedas necesitamos compararlas
en el index.js para autentificar cada contraseña y asegurarnos de tener una applicacion
segura.
Si iniciamos sesion con el usuario admin no tenemos acceso al home y si iniciamos
sesion con el usuario user no tenemos acceso a la pagina admin.
Se pueden añadir mas usuarios desde el initdb.js siguiendo los ejemplos
de los usuarios ya introducidos, tambien nos silve de salvaguardo para nuestar base
de datos, asi si la eliminamos la podemos recuperar ejecutando el initdb.js.
