# 🔐 Endpoints Better Auth

Tous les endpoints Better Auth sont automatiquement exposés sous le préfixe `/api/auth` via `@thallesp/nestjs-better-auth`.

## 📍 Base URL
```
http://localhost:3000/api/auth
```

---

## ✅ Endpoints Disponibles (avec votre configuration actuelle)

### 🔑 Authentification Email/Password

#### Inscription
```http
POST /api/auth/sign-up/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

#### Connexion
```http
POST /api/auth/sign-in/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

#### Déconnexion
```http
POST /api/auth/sign-out
```

---

### 👤 Gestion de Session

#### Obtenir la session actuelle
```http
GET /api/auth/session
```

#### Révocation d'une session spécifique
```http
POST /api/auth/revoke-session
Content-Type: application/json

{
  "sessionId": "session_id_here"
}
```

#### Révocation de toutes les sessions
```http
POST /api/auth/revoke-sessions
```

---

### 🔄 Gestion du Profil Utilisateur

#### Mettre à jour le profil
```http
POST /api/auth/update-user
Content-Type: application/json

{
  "name": "New Name",
  "image": "https://example.com/avatar.jpg"
}
```

#### Changer le mot de passe
```http
POST /api/auth/change-password
Content-Type: application/json

{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

#### Supprimer le compte
```http
POST /api/auth/delete-user
Content-Type: application/json

{
  "password": "CurrentPassword123!"
}
```

---

### 📧 Gestion Email

#### Vérifier l'email
```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification_token_from_email"
}
```

#### Envoyer un email de vérification
```http
POST /api/auth/send-verification-email
```

#### Changer l'email
```http
POST /api/auth/change-email
Content-Type: application/json

{
  "newEmail": "newemail@example.com",
  "password": "CurrentPassword123!"
}
```

---

### 🔒 Réinitialisation du Mot de Passe

#### Demander une réinitialisation
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Réinitialiser avec le token
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "password": "NewPassword123!"
}
```

---

### 🌐 Authentification Sociale (OAuth)

**Note** : Actuellement non configuré dans votre `auth.ts`, mais disponibles si vous ajoutez des providers.

#### Démarrer le flux OAuth
```http
GET /api/auth/sign-in/github
GET /api/auth/sign-in/google
GET /api/auth/sign-in/discord
# etc. selon les providers configurés
```

#### Callback OAuth
```http
GET /api/auth/callback/github
GET /api/auth/callback/google
# etc.
```

**Pour activer** : Ajoutez dans `auth.ts` :
```typescript
socialProviders: {
  github: {
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  },
}
```

---

## 📝 Notes Importantes

### Cookies de Session
- Better Auth utilise des **cookies HTTP-only** pour gérer les sessions
- Les cookies sont automatiquement envoyés avec chaque requête
- Pas besoin de gérer manuellement les tokens dans la plupart des cas

### Authentification Requise
- Certains endpoints nécessitent une session active (cookies)
- Si non authentifié, vous recevrez une erreur 401

### CORS
- Votre configuration CORS dans `main.ts` permet les credentials
- Assurez-vous que votre frontend envoie les cookies avec `credentials: 'include'`

---

## 🧪 Exemple de Flow Complet

### 1. Inscription
```bash
POST /api/auth/sign-up/email
{
  "email": "test@example.com",
  "password": "Test123!",
  "name": "Test User"
}
```
**Réponse** : Cookie de session automatiquement défini

### 2. Vérifier la session
```bash
GET /api/auth/session
```
**Réponse** :
```json
{
  "user": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User",
    "emailVerified": false
  },
  "session": {
    "id": "...",
    "expiresAt": "..."
  }
}
```

### 3. Utiliser les routes protégées
```bash
GET /users/me
```
**Headers** : Cookie de session automatiquement inclus

### 4. Déconnexion
```bash
POST /api/auth/sign-out
```
**Réponse** : Cookie de session supprimé

---

## 🔍 Documentation Interactive (Optionnel)

Pour activer la documentation OpenAPI interactive :

1. Ajoutez le plugin dans `auth.ts` :
```typescript
import { openAPI } from "better-auth/plugins";

export const auth = betterAuth({
  // ... config existante
  plugins: [openAPI()],
});
```

2. Accédez à :
```
GET /api/auth/reference
```

Cela affichera une documentation Swagger interactive avec tous les endpoints disponibles.

---

## 📚 Documentation Officielle

- [Better Auth Docs](https://www.better-auth.com/docs)
- [@thallesp/nestjs-better-auth](https://github.com/thallesp/nestjs-better-auth)

