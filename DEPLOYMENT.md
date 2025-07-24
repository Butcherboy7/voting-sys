# Deployment Guide

This guide covers deploying the Student Elections 2024 voting system to various platforms.

## Prerequisites

- Node.js 18+ environment
- PostgreSQL database
- Environment variables configured

## Environment Variables

Ensure these environment variables are set in your deployment environment:

```env
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-secure-session-secret
PORT=5000
NODE_ENV=production
```

## Local Production Build

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm start
   ```

## Platform-Specific Deployments

### Replit

The project is pre-configured for Replit deployment:

1. Import the repository to Replit
2. Set up environment variables in Secrets
3. Provision a PostgreSQL database
4. Run `npm run db:push` to set up the database
5. Click "Run" to start the application

### Heroku

1. **Create a new Heroku app**:
   ```bash
   heroku create your-app-name
   ```

2. **Add PostgreSQL addon**:
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

3. **Set environment variables**:
   ```bash
   heroku config:set SESSION_SECRET=your-secure-secret
   heroku config:set NODE_ENV=production
   ```

4. **Deploy**:
   ```bash
   git push heroku main
   ```

5. **Run database migrations**:
   ```bash
   heroku run npm run db:push
   ```

### Vercel

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set environment variables** in Vercel dashboard
4. **Set up PostgreSQL database** (recommend Neon or PlanetScale)

### Railway

1. **Connect your GitHub repository** to Railway
2. **Add PostgreSQL service** to your project
3. **Set environment variables** in Railway dashboard
4. **Deploy automatically** on git push

### DigitalOcean App Platform

1. **Create a new app** and connect your repository
2. **Add a managed PostgreSQL database**
3. **Configure environment variables**
4. **Deploy** with automatic builds

## Database Setup

After deployment, ensure the database is properly initialized:

```bash
npm run db:push
```

This will create all necessary tables and indexes.

## Security Considerations

### Production Checklist

- [ ] Strong `SESSION_SECRET` is set
- [ ] Database connection uses SSL
- [ ] HTTPS is enabled
- [ ] Rate limiting is configured
- [ ] CORS is properly configured
- [ ] Environment variables are secure

### Monitoring

Monitor these aspects in production:

- **Database connections**: Ensure connection pooling works
- **Session storage**: Monitor session table size
- **Memory usage**: Watch for memory leaks
- **Response times**: Monitor API endpoint performance
- **Error rates**: Track application errors

## Troubleshooting

### Common Issues

1. **Database connection fails**:
   - Verify `DATABASE_URL` format
   - Check database server accessibility
   - Ensure SSL settings are correct

2. **Session errors**:
   - Verify session table exists
   - Check `SESSION_SECRET` is set
   - Ensure database has proper permissions

3. **Build failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

### Health Checks

The application provides these endpoints for monitoring:

- `GET /api/candidates` - Basic API health check
- Database connectivity is verified on startup

### Support

For deployment issues:
1. Check the application logs
2. Verify environment variables
3. Test database connectivity
4. Review the specific platform documentation

## Scaling Considerations

For high-traffic elections:

- Use connection pooling for database
- Consider Redis for session storage
- Implement rate limiting
- Use CDN for static assets
- Monitor and scale database resources