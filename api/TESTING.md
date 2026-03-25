# FocusBro API Testing Guide

## Setup

### Install Dependencies
```bash
cd api
npm install
```

### Configure Environment
Create `.env.local` with test credentials:
```bash
# .env.local
JWT_SECRET=test-secret-key
STRIPE_SECRET_KEY=sk_test_xxx
DEBUG=true
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Watch Mode (Auto-rerun on changes)
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

### Run Specific Test File
```bash
npm test -- src/__tests__/auth.test.js
```

## Test Structure

```
api/src/__tests__/
├── auth.test.js          # Authentication endpoints
├── validation.test.js    # Input validation
├── cors.test.js          # CORS security
└── rate-limit.test.js    # Rate limiting
```

## Key Test Categories

### 1. Authentication Tests (`auth.test.js`)
- ✅ Register with valid credentials
- ✅ Login with correct password
- ❌ Reject invalid email format
- ❌ Reject short passwords
- ❌ Reject duplicate registrations
- ✅ Return proper JWT token
- ✅ Validate session response structure

### 2. Input Validation Tests
- ✅ String length validation
- ✅ Number range validation
- ✅ Array size limits
- ✅ Type checking
- ✅ Email format validation

### 3. Security Tests
- ✅ CORS origin whitelist
- ✅ Rate limiting (10 requests/15min)
- ✅ No sensitive data in logs
- ✅ No hardcoded secrets
- ✅ Proper error messages

### 4. Database Tests
- ✅ User creation
- ✅ Session storage
- ✅ Event logging
- ✅ Data consistency

## Continuous Integration

Tests run automatically on:
- ✅ Push to `main` or `develop`
- ✅ Pull requests to `main` or `develop`
- ✅ Changes in `api/` directory

### GitHub Actions Workflow

1. **Test Job** - Runs on Node 18.x and 20.x
   - Install dependencies
   - Run linter
   - Run test suite
   - Generate coverage

2. **Security Job** - Check for vulnerabilities
   - npm audit
   - Hardcoded secrets check
   - Environment validation

3. **Deploy Job** - Deploy on main branch
   - Requires passing tests
   - Requires security checks

## Writing New Tests

### Test Template
```javascript
describe('Feature Name', () => {
  it('should do something', async () => {
    // Arrange
    const input = { /* test data */ };
    
    // Act
    const result = await testFunction(input);
    
    // Assert
    expect(result.valid).toBe(true);
  });

  it('should reject invalid input', async () => {
    const input = { /* invalid data */ };
    const result = await testFunction(input);
    
    expect(result.valid).toBe(false);
  });
});
```

### Testing Async Functions
```javascript
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

### Testing Error Cases
```javascript
it('should throw on invalid input', () => {
  expect(() => {
    functionThatThrows();
  }).toThrow('Error message');
});
```

## Coverage Goals

- **Target: 80%** overall code coverage
- Authentication: **90%+**
- Validation: **85%+**
- Database: **80%+**
- API routes: **75%+**

## Debug Tips

### Enable Verbose Output
```bash
npm test -- --reporter=verbose
```

### Single Test Only
```bash
npm test -- -t "should validate email"
```

### Show Diff on Failures
```bash
npm test -- --reporter=verbose
```

## Common Issues

### Tests fail with "fetch is not defined"
**Solution:** Tests use node environment. Fetch is mocked for API calls.

### Database tests fail
**Solution:** Mock D1 responses in test setup:
```javascript
const mockEnv = {
  DB: {
    prepare: (sql) => ({
      bind: (...args) => ({
        first: async () => ({ id: 'test' }),
        all: async () => []
      })
    })
  }
};
```

### Tests timeout
**Solution:** Increase timeout in vitest.config.js:
```javascript
testTimeout: 30000 // 30 seconds
```

## Next Steps

- [ ] Add 10+ more test cases per endpoint
- [ ] Cover error scenarios
- [ ] Add integration tests with real D1
- [ ] Add performance benchmarks
- [ ] Add load testing with k6

## Resources

- [Vitest Documentation](https://vitest.dev)
- [Testing Best Practices](https://testing-library.com/docs)
- [Cloudflare Workers Testing](https://developers.cloudflare.com/workers/runtime-apis/web-crypto/)
