# Authentification avec Better Auth

Ce projet utilise [Better Auth](https://www.better-auth.com/) avec l'intégration NestJS via [@thallesp/nestjs-better-auth](https://github.com/thallesp/nestjs-better-auth).

## Configuration

L'authentification est configurée dans `auth.ts` avec les options suivantes :
- Email & Password (sans vérification d'email par défaut)
- Sessions de 7 jours
- Base de données PostgreSQL via **Drizzle ORM** avec l'adapter officiel `drizzleAdapter`

## Utilisation

### 1. Routes d'authentification

Toutes les routes d'authentification sont disponibles sous `/api/auth` :

#### Inscription
```bash
POST /api/auth/sign-up/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "motdepasse",
  "name": "Nom Utilisateur"
}
```

#### Connexion
```bash
POST /api/auth/sign-in/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "motdepasse"
}
```

#### Déconnexion
```bash
POST /api/auth/sign-out
```

#### Obtenir la session courante
```bash
GET /api/auth/session
```

### 2. Protéger des routes

Utilisez le `AuthGuard` fourni par `@thallesp/nestjs-better-auth` :

```typescript
import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard, User, Session } from "@thallesp/nestjs-better-auth";

@Controller("protected")
export class ProtectedController {
  @Get()
  @UseGuards(AuthGuard)
  protectedRoute(@User() user: any, @Session() session: any) {
    return {
      message: "Route protégée",
      user,
      session,
    };
  }
}
```

### 3. Decorators disponibles

#### `@User()`
Récupère l'utilisateur authentifié actuel :

```typescript
@Get("profile")
@UseGuards(AuthGuard)
getProfile(@User() user: any) {
  return user;
}
```

#### `@Session()`
Récupère la session actuelle :

```typescript
@Get("session-info")
@UseGuards(AuthGuard)
getSessionInfo(@Session() session: any) {
  return session;
}
```

### 4. Utilisation dans les services

Vous pouvez injecter `AuthService` pour des opérations d'authentification avancées :

```typescript
import { Injectable } from "@nestjs/common";
import { AuthService } from "@thallesp/nestjs-better-auth";

@Injectable()
export class MyService {
  constructor(private readonly authService: AuthService) {}

  async someMethod() {
    // Accéder à l'API better-auth
    const session = await this.authService.api.getSession({ headers });
    // ... autres opérations
  }
}
```

## Ajout de providers OAuth (optionnel)

Pour ajouter des providers comme Google ou GitHub :

1. Configurez les credentials dans `.env` :
```env
GITHUB_CLIENT_ID=votre_client_id
GITHUB_CLIENT_SECRET=votre_client_secret
```

2. Mettez à jour `auth.ts` :
```typescript
export const auth = betterAuth({
  // ... autres options
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});
```

3. Les routes OAuth seront disponibles automatiquement :
- `/api/auth/sign-in/github` - Initier la connexion GitHub
- `/api/auth/callback/github` - Callback GitHub

## Schéma Drizzle

Le schéma Drizzle (`src/drizzle/schema.ts`) inclut les tables nécessaires pour Better Auth :
- `user` - Utilisateurs avec email, password, name, etc.
- `session` - Sessions actives avec tokens et expiration
- `account` - Comptes liés (OAuth, providers externes)
- `verification` - Tokens de vérification email

Ces tables sont automatiquement gérées par Better Auth via l'adapter Drizzle. Le schéma a été généré par introspection depuis la base de données PostgreSQL existante.

## Testing

Un fichier [`test-auth.http`](../../test-auth.http) est disponible à la racine du projet avec tous les exemples de requêtes.

### Test de l'inscription
```bash
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'
```

### Test de la connexion
```bash
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

La réponse inclura un cookie de session qui sera automatiquement utilisé pour les requêtes suivantes.

### Test d'une route protégée
```bash
curl http://localhost:3000/users/me \
  -H "Cookie: session=votre_cookie_de_session"
```

### Fichier test-auth.http

Utilisez le fichier `test-auth.http` avec l'extension REST Client de VS Code ou IntelliJ pour tester facilement toutes les routes d'authentification.

## Documentation complète

Pour plus d'informations :
- [Better Auth Documentation](https://www.better-auth.com/)
- [@thallesp/nestjs-better-auth](https://github.com/thallesp/nestjs-better-auth)

