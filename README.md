## Base de conocimiento

### Secciones

- Inicio  
	- /	

- Solucion
    - /solution/new
	- /solution/:path
    - /solution/:path/edit
    - /solution/:path/delete

- Serie
    - /series/new
    - /series/:path
    - /series/:path/edit
    - /series/:path/delete

- Etiquetas
	- /tag/:tag

- Perfil 
	- /profile
    - /profile/edit
    - /profile/favorites
    - /profile/solutions
    - /profile/series

- Terminos & Copyright 
	- /terms

- Administrador  
	- /admin
    - /admin/users
    - /admin/series
    - /admin/solutions
    - /admin/reports

### Schemas

```
Solution:
    - _id 				[autovalue] [String]
    - createdAt			[autovalue new Date()] [dateTime]
    - lastModifiedAt    [autovalue new Date()] [dateTime]
    - userId 			[autovalue this.userId] [String]
    - author			[autovalue this.username] [String]
    - path				[autovalue path(this.title)] [String]
    - title				[required] [String]
    - body				[required] [String]
    - public            [required] [Boolean]
    - files				[Array]
    - canView			[Array]
    - canEdit			[Array]
    - tags				[Array]
    - favorites			[Array]
    - series			[Array]
```

```
Series:
    - _id               [autovalue] [String]
	- title 			[required] [String]
	- description		[required] [String]
	- userId 			[autovalue this.userId] [String]
    - author			[autovalue this.username] [String]
    - createdAt			[autovalue new Date()] [dateTime]
    - lastModifiedAt    [autovalue new Date()] [dateTime]
    - path 				[autovalue createPath(this.title)] [String]
    - favorites         [Array]
    - solutions         [Array]
```

```
User:
	- username 			[required] [String]
    - _id				[autovalue] [String]
	- profilePicture	[String]
    - isAdmin			[Boolean]
    - email				[required] [String]
    - createdAt         [autovalue new Date()] [dateTime]
    - lastModifiedAt    [autovalue new Date()] [dateTime]

    Mis Series
    - series           [collection: Serie, via: userId] [Array]
	
    Mis Soluciones
	- solutions        [collection: Solution, via: userId] [Array]
	
    Soluciones privadas que puedo ver
	- canView          [collection: Solution, via: canView] [Array]
	
    Soluciones que puedo editar
	- canEdit          [collection: Solution, via: canEdit] [Array]
	
    Mis favoritos
	- favorites        [collection: Solution, via: favorites] [Array]
``` 

```   
Estructura de la aplicacion

application/            	 	# Folder de la aplicacion       
    app/             
        controllers/        
        models/
        routes/
        views/                
    config/  
    public/
```

```
Peso de los Permisos

	Sesion Autenticada 		[sesion]
	Es Propietario 			[isAuthor]
	Puede Ver 				[canView]
	Puede Editar 			[canEdit]
	Es Administrador 		[isAdmin]
```    

- Notas

Use "nodemon --legacy-watch server.js" to poll for file changes instead of listening to file system events.


