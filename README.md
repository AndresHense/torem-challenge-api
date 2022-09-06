# API REST para front-end development

<div style="text-align: justify">

<hr/>

## Introducción

**Chatter** es una app de mensajes, muy parecida a WhatsApp u otras aplicaciones de mensajería. En este repositorio se encuentra la API REST con la cual el frontend obtiene toda la información de usuarios y sus respectivos chats.

## Modelo de clases

Las clases que maneja chatter para administrar sus mensajes son las siguientes:

#### 1. User

Es la persona que utiliza la aplicación, capaz de mandar y recibir mensajes, iniciar sesión y evidentemente, registrarse.

**Atributos**

|  Nombre  |   Tipo   |
| :------: | :------: |
|  userId  |  string  |
|   name   |  string  |
| lastName |  string  |
|  email   |  string  |
| password |  string  |
|  image   |  string  |
|  chats   | Chat [ ] |

#### 2. Chat

Conversación entera entre un usuario y otra persona (no es necesario que la otra persona este registrada en la aplicación para enviarle un mensaje). Dentro del chat, se encuentra la información básica del destinatario junto con el conjunto de mensajes que la conforman.

**Atributos**

|  Nombre  |    Tipo     |
| :------: | :---------: |
|  chatId  |   string    |
|   name   |   string    |
|  image   |   string    |
| messages | Message [ ] |

#### 2. Message

Último pero no menos importante se encuentra el mensaje en sí. Está conformado únicamente por el texto y por un atributo booleano **received** que indica si el mensaje fue recibido por el usuario _(received = true)_ o enviado por él _(received = false)_.

**Atributos**

|  Nombre   |  Tipo   |
| :-------: | :-----: |
| messageId | string  |
|  message  | string  |
| received  | boolean |

<hr />

## Endpoints

La API cuenta con endpoints para generar las acciones en el servidor. Las acciones pueden ser categorizadas por dos tipos: Acciones de **usuario** y acciones de **chats** Las acciones de usuario hacen referencia a todo lo que es el manejo de la cuenta, como por ejemplo registrar un nuevo usuario o iniciar sesión, mientras que las de chats se encargan de todo el manejo de mensajería, como enviar un mensaje o borrar un chat.

#### 1. Acciones de usuario

##### Obtener usuarios

##### GET /user

Retorna una lista con toda la información pública de los usuarios registrados, junto con su userId. La información pública de un usuario es su _nombre, apellido, email e imagen_.

| Caso  | Status |                  Respuesta                   |
| :---: | :----: | :------------------------------------------: |
| Exito |  200   | [ { userId, name, lastName, email, image } ] |
| Fallo |  500   |   { message: 'Error while fetching data' }   |

##### Obtener un usuario

##### GET /user/:userId

Retorna toda la información del usuario con ID pasada por parámetro.

|   Caso    | Status |                Respuesta                 |
| :-------: | :----: | :--------------------------------------: |
|   Exito   |  200   |                 { user }                 |
| Not Found |  404   |      { message: 'User not found' }       |
|   Fallo   |  500   | { message: 'Error while fetching data' } |

##### Eliminar un usuario

##### DELETE /user/:userId

Elimina al usuario con ID pasada por parámetro. Requiere pasarle un **Auth token** como encabezado de autenticación a la consulta. Ese token es otorgado en la respuesta en formato JSON a la hora de iniciar sesión (detallado más adelante).

|     Caso     | Status |                Respuesta                 |
| :----------: | :----: | :--------------------------------------: |
|    Exito     |  201   | { message: 'User deleted successfully' } |
| No hay Token |  401   |    { message: 'Unauthorized action' }    |
|    Fallo     |  500   | { message: 'Error while fetching data' } |

##### Crear un usuario

##### POST /user/create

En el body de la request:

```js
{
    name: string,
    lastName: string,
    email: string,
    password: string,
    image: file (PNG, JPG, JPEG)
}
```

Si los datos del cuerpo de la request están correctos, se creará el usuario en la base de datos con un ID autogenerado. Este usuario ahora podrá enviar mensajes y crear conversarciones. Aún asi incluso despues de ser creado, es necesario iniciar sesión para obtener su Token.

|                    Caso                    | Status |                                                          Respuesta                                                           |
| :----------------------------------------: | :----: | :--------------------------------------------------------------------------------------------------------------------------: |
|                   Exito                    |  201   |                                         { message: 'User registered successfully' }                                          |
|          Mail ingresado ya existe          |  409   |                                            { message: 'User already registered' }                                            |
|                   Fallo                    |  500   |                                           { message: 'Error while fetching data' }                                           |
|  No se encontró una imagen en la consulta  |  422   |                                              { message: 'Missing image file' }                                               |
| Datos ingresados están en formato inválido |  422   | { message: 'Bad Request: Make sure all attributes and their types are OK', attributes: { name, lastName, email, password } } |

##### Iniciar sesión

##### POST /user/login

En el body de la request:

```js
{
    email: string,
    password: string
}
```

Si el email y la contraseña corresponden a un usuario existente, la consulta devuele el Auth Token para realizar las operaciones de administrador del usuario, como borrarlo, crear un chat, etc. Este token debe ser ingresado en las consultas que correspondan para que éstas tengan efecto.

|                    Caso                    | Status |                                                  Respuesta                                                   |
| :----------------------------------------: | :----: | :----------------------------------------------------------------------------------------------------------: |
|                   Exito                    |  201   |                             { message: 'Logged In successfully', userId, token }                             |
|       Mail o contraseña incorrectos        |  401   |                                  { message: 'Incorrect email or password' }                                  |
|                   Fallo                    |  500   |                                   { message: 'Error while fetching data' }                                   |
| Datos ingresados están en formato inválido |  422   | { message: 'Bad Request: Make sure all attributes and their types are OK', attributes: { email, password } } |

#### 2. Acciones de chats

##### Obtener todos los chats de un usuario

##### GET /chat/:userId

Retorna toda la información de los chats del usuario con todos sus respectivos mensajes. Debe incluirse el **Auth Token** del usuario en la consulta para que ésta tenga efecto.

|            Caso            | Status |             Respuesta              |
| :------------------------: | :----: | :--------------------------------: |
|           Exito            |  200   |      { chats: [ { chat } ] }       |
| Token o userId incorrectos |  401   | { message: 'Unauthorized action' } |

##### Crear un chat para un usuario

##### POST /chat/:userId

En el body de la request:

```js
{
    name: string,
    image: file (PNG, JPG, JPEG)
}
```

Crea un nuevo chat con una persna con el nombre y foto de perfil dados en el cuerpo de la request. Debe incluirse el **Auth Token** del usuario en la consulta para que ésta tenga efecto.

|                 Caso                  | Status |                          Respuesta                           |
| :-----------------------------------: | :----: | :----------------------------------------------------------: |
|                 Exito                 |  201   |           { message: 'Chat created successfully' }           |
|      Token o userId incorrectos       |  401   |              { message: 'Unauthorized action' }              |
| Nombre o imagen en formato incorrecto |  400   | { message: 'Must provide a valid recipient name and image' } |
|                 Fallo                 |  500   |           { message: 'Error while fetching data' }           |

##### Enviar nuevo mensaje a un chat

##### POST /chat/:userId/:chatId

En el body de la request:

```js
{
	message: string;
}
```

Envía un nuevo mensaje desde el usuario con _userId_ al chat con _chatId_ ingresados por parámetro y con el texto dado en el cuerpo de la request. Debe incluirse el **Auth Token** del usuario en la consulta para que ésta tenga efecto.

|            Caso            | Status |                Respuesta                 |
| :------------------------: | :----: | :--------------------------------------: |
|           Exito            |  201   | { message: 'Message sent successfully' } |
| Token o userId incorrectos |  401   |    { message: 'Unauthorized action' }    |
| userId o chatId no validos |  404   | { message: 'Could not find user chat' }  |
|           Fallo            |  500   | { message: 'Error while fetching data' } |

##### Eliminar un chat

##### DELETE /chat/:userId/:chatId

Elimina el chat con _chatId_ del usuario con _userId_ ingresados por parámetro. Debe incluirse el **Auth Token** del usuario en la consulta para que ésta tenga efecto.

|            Caso            | Status |                    Respuesta                     |
| :------------------------: | :----: | :----------------------------------------------: |
|           Exito            |  201   | { message: 'Chat history deleted successfully' } |
| Token o userId incorrectos |  401   |        { message: 'Unauthorized action' }        |
| userId o chatId no validos |  404   |     { message: 'Could not find user chat' }      |
|           Fallo            |  500   |     { message: 'Error while fetching data' }     |

<hr/>

## Sockets

Se utiliza la tecnología de <a href="https://socket.io/">Sockets.io</a> para generar sockets y avisar al front end cada vez que se creen o modifiquen estados. El servidor se encuentra en _http://localhost:8080_, por lo que los sockets deben escuchar a esa URL. Los tipos de sockets posibles son:

### 1. Sockets de usuario

#### Usuario eliminado

```js

on 'users'
{
    action: 'delete',
    userId: userId
}

```

#### Usuario creado / registrado

```js

on 'users'
{
    action: 'register',
    userId: userId
}

```

### 2. Sockets de chats

#### Nuevo chat creado

```js

'chats'
{
    action: 'create',
    userId: userId,
    chatId: chatId
}

```

#### Nuevo mensaje enviado

```js

on 'chats'
{
    action: 'SentNewMessage',
    userId: userId,
    chatId: chatId
}

```

#### Chat eliminado

```js

on 'chats'
{
    action: 'delete',
    userId: userId,
    chatId: chatId
}

```

#### Nuevo mensaje recibido

Esta característica es especial, ya que dado que la API a la que se consulta no es una realmente funcional, no existe el concepto de "recibir un nuevo mensaje". De todas formas, para poder evaluar el área, la API enviará un nuevo mensaje de respuesta autogenerado a los 5 segundos luego de recibir uno. Una vez se dispare el mensaje, se notificará al front mediante el siguiente socket:

```js

// SI EL MENSAJE LLEGA CORRECTAMENTE:

on 'chats'
{
    action: 'ReceivedNewMessage',
    userId: userId,
    chatId: chatId
}

// SI HUBO UN FALLO Y EL MENSAJE NO SE PUDO ENVIAR: (NO DEBERÍA SUCEDER)

on 'chats'
{
    action: 'error',
    error: 'Could not fetch database while sending a reply message'
}

```

<hr />

## GraphQL

Hay una única consulta para realizar en GraphQL, y es la de **filtrar los mensajes de un usuario**. No es necesario contar con gran conocimiento para esta parte pero sí saber hacer consultas y haber trabajado alguna vez con esta tecnología.

```graphql
# la función filterMessages es la siguiente:

filterMessages(userId: ID!, chatId: ID!, filter: String!): [Message]!

```

El atributo *filter* es el texto a filtrar, y retorna la lista de mensajes que contienen ese texto. 
