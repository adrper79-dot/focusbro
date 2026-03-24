# FocusBro Cloudflare Workers API

A modern, serverless REST API built on Cloudflare Workers for multi-device synchronization, user authentication, and data management.

## 🚀 Features

- **Authentication System**
  - Secure registration and login with JWT tokens
  - Password reset flow with email verification
  - Device tracking and session management
  - Multi-device support with device isolation

- **User Management**
  - Profile management (name, avatar, preferences)
  - Password change with security verification
  - Account deletion with data purge
  - Logout all devices functionality

- **Data Sync**
  - Real-time data synchronization across devices
  - Version history and snapshots
  - Automatic backup and recovery
  - Optimized caching with Cloudflare KV

- **Security**
  - HTTPS/TLS 1.3 encryption
  - Rate limiting and DDoS protection
  - CORS configuration
  - Security headers and CSP
  - Audit logging
  - Password hashing with SHA-256

- **Infrastructure**
  - Serverless deployment on Cloudflare Workers
  - SQLite database with D1
  - KV cache for performance
  - Global edge network
  - Automatic scaling

---

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Cloudflare account (free or paid)
- Wrangler CLI (`npm install -g wrangler`)

---

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/focusbro/focusbro.git
cd focusbro/api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Authenticate with Cloudflare

```bash
wrangler login
```

### 4. Create Resources on Cloudflare

```bash
# Create database
wrangler d1 create focusbro-db

# Create KV namespace
wrangler kv:namespace create KV_CACHE
wrangler kv:namespace create KV_CACHE --preview

# Copy IDs to wrangler.toml
```

### 5. Initialize Database

```bash
wrangler d1 execute focusbro-db --file=schema.sql --remote
```

---

## 🏃 Getting Started

### Development

```bash
# Start local dev server
wrangler dev

# API runs at http://localhost:8787
```

### Test the API

```bash
# Health check
curl http://localhost:8787/health

# Register a user
curl -X POST http://localhost:8787/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

See [API_TESTING.md](../API_TESTING.md) for comprehensive test examples.

### Deployment

```bash
# Preview deployment
wrangler publish --env preview

# Production deployment
wrangler publish --env production
```

See [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

---

## 📚 Documentation

### Core Documentation
- **[API_DOCUMENTATION.md](../API_DOCUMENTATION.md)** - Complete API endpoint documentation
- **[DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md)** - Deployment and infrastructure setup
- **[SECURITY_GUIDE.md](../SECURITY_GUIDE.md)** - Security best practices and implementation
- **[API_TESTING.md](../API_TESTING.md)** - Testing guide with examples
- **[ENV_CONFIG.md](../ENV_CONFIG.md)** - Environment configuration reference

### Quick Links
- **API Base URL**: `https://api.focusbro.io`
- **API Version**: 1.0.0
- **Authentication**: Bearer tokens (JWT)

---

## 🗂️ Project Structure

```
api/
├── src/
│   ├── index.js           # Main API routes
│   ├── middleware.js      # Auth, validation, utilities
│   └── extended-routes.js # User management, devices
├── schema.sql             # Database schema
├── package.json           # Dependencies
├── wrangler.toml          # Cloudflare configuration
└── README.md              # This file
```

---

## 🔑 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/request-password-reset` - Request password reset
- `POST /auth/confirm-password-reset` - Confirm password reset
- `POST /auth/logout-all` - Logout all devices

### User Profile
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update profile
- `POST /users/change-password` - Change password
- `POST /users/delete-account` - Delete account

### Devices
- `GET /devices` - List user devices
- `DELETE /devices/{deviceId}` - Remove device

### Data Sync
- `POST /sync/data` - Upload data
- `GET /sync/data` - Download data

### Utilities
- `GET /health` - Health check

See [API_DOCUMENTATION.md](../API_DOCUMENTATION.md) for full endpoint details.

---

## 🔐 Authentication

### How It Works

1. **Register**: User creates account with email and password
2. **Login**: User receives JWT token valid for 30 days
3. **Requests**: Include token in `Authorization: Bearer {token}` header
4. **Refresh**: Tokens refresh on each login
5. **Logout**: Log out single device or all devices

### Example Request

```bash
curl -X GET https://api.focusbro.io/users/profile \
  -H "Authorization: Bearer eyJhbGc..."
```

### Token Structure

```
Header.Payload.Signature

Sub: user ID
Iat: issued at (timestamp)
Exp: expires at (timestamp)
```

Token expires after 30 days. Password change invalidates all sessions.

---

## 🗄️ Database Schema

### Tables

- **users** - User accounts and profiles
- **sessions** - Active sessions and devices
- **user_data_snapshots** - Sync history and backups
- **sync_logs** - Synchronization tracking
- **audit_logs** - Security audit trail
- **api_keys** - API access keys

See [api/schema.sql](schema.sql) for full schema definition.

---

## ⚙️ Configuration

### Environment Variables

Create `.env.local` for development:

```bash
JWT_SECRET=your-secret-key-32-chars
ENCRYPTION_KEY=your-encryption-key-32-chars
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_MAX_REQUESTS=100
```

For production, use Cloudflare Secrets:

```bash
wrangler secret put JWT_SECRET
wrangler secret put ENCRYPTION_KEY
```

See [ENV_CONFIG.md](../ENV_CONFIG.md) for all configuration options.

---

## 🔒 Security

### Features Implemented

- ✅ HTTPS/TLS 1.3 encryption
- ✅ JWT token authentication
- ✅ Password hashing (SHA-256)
- ✅ Rate limiting (100 req/min)
- ✅ CORS configuration
- ✅ Security headers
- ✅ SQL injection prevention
- ✅ Input validation
- ✅ Audit logging
- ✅ GDPR compliance support

### Security Checklist

Before deployment, ensure:
- [ ] All secrets are set
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] Logs are being collected
- [ ] Backups are configured
- [ ] Security headers set
- [ ] CORS properly configured
- [ ] Database secured
- [ ] Monitoring enabled

See [SECURITY_GUIDE.md](../SECURITY_GUIDE.md) for comprehensive security documentation.

---

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Test Coverage

- Unit tests: Utility functions
- Integration tests: API endpoints
- Load tests: Performance benchmarks
- Security tests: Vulnerabilities

### Manual Testing

Use curl, Postman, or the provided test script:

```bash
node test-api.js
```

See [API_TESTING.md](../API_TESTING.md) for detailed testing guide.

---

## 📊 Monitoring & Analytics

### Cloudflare Dashboard

Monitor in real-time:
- Request volume and latency
- Error rates
- Cache hit ratios
- Bot traffic

### Logs

View recent logs:

```bash
wrangler tail
```

Query specific events:

```bash
wrangler d1 query "SELECT * FROM audit_logs WHERE created_at > datetime('now', '-24 hours');" --remote
```

---

## 🚀 Deployment

### Environments

- **Development**: Local dev server
- **Preview**: Branch deployments
- **Staging**: Pre-production testing
- **Production**: Live API

### Deploy Commands

```bash
# Preview deployment
wrangler publish --env preview

# Staging deployment
wrangler publish --env staging

# Production deployment
wrangler publish --env production
```

### Rollback

```bash
wrangler rollback
```

See [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) for full deployment instructions.

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Set up automatic deployments:

```yaml
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
      - run: wrangler publish --env production
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
```

---

## 📈 Performance

### Benchmarks

Expected response times (local):
- Health check: 5ms
- Register: 50ms
- Login: 60ms
- Get profile: 20ms
- Sync data (100KB): 100ms

### Optimization

- KV caching for frequently accessed data
- Database query indexing
- Connection pooling
- Response compression
- CDN distribution

---

## 🐛 Troubleshooting

### Database Connection Error

```bash
wrangler d1 execute focusbro-db --file=schema.sql --local
```

### Clear Cache

```bash
wrangler kv:key delete --binding KV_CACHE "*"
```

### View Logs

```bash
wrangler tail --format pretty
```

### Reset Rate Limits

```bash
wrangler kv:namespace delete-key --binding KV_CACHE "ratelimit:*"
```

---

## 📦 Dependencies

### Core
- `itty-router` - Lightweight routing
- `cloudflare-workers-types` - Type definitions

### Development
- `wrangler` - Cloudflare CLI
- `eslint` - Code linting
- `prettier` - Code formatting

---

## 📄 License

MIT License - See [LICENSE](../LICENSE) for details

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

See [CONTRIBUTING.md](../CONTRIBUTING.md) for full guidelines.

---

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/focusbro/focusbro/issues)
- **Email**: api-support@focusbro.io
- **Documentation**: [docs.focusbro.io](https://docs.focusbro.io)
- **Slack**: [#api-support](https://focusbro.slack.com)

---

## 📞 Contact

- **Founder**: [Twitter](https://twitter.com/focusbro)
- **Team**: [team@focusbro.io](mailto:team@focusbro.io)
- **Website**: [focusbro.io](https://focusbro.io)

---

## 🗺️ Roadmap

### Q1 2024
- [ ] Two-factor authentication (2FA)
- [ ] API keys for third-party apps
- [ ] Webhook events
- [ ] Advanced analytics

### Q2 2024
- [ ] GraphQL endpoint
- [ ] Data encryption at rest
- [ ] Real-time websockets
- [ ] Advanced audit logs

### Q3 2024
- [ ] Self-hosted option
- [ ] Custom domain support
- [ ] Advanced reporting
- [ ] Single sign-on (SSO)

---

## 📚 Additional Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [D1 Database](https://developers.cloudflare.com/d1/)
- [Cloudflare KV](https://developers.cloudflare.com/kv/)
- [JWT.io](https://jwt.io/)
- [OWASP API Security](https://owasp.org/www-project-api-security/)

---

**Last Updated**: January 20, 2024  
**Version**: 1.0.0  
**Status**: Production Ready

