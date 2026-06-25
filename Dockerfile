# ==========================================
# STAGE 1: Build the Java Spring Boot Backend
# ==========================================
FROM maven:3.8.5-openjdk-17 AS backend-builder
WORKDIR /app/backend
# Copy pom.xml and source code from the newly organized backend directory
COPY healthcare-backend/pom.xml .
COPY healthcare-backend/src ./src
# Build the application package, skipping tests for fast deployment
RUN mvn clean package -DskipTests

# ==========================================
# STAGE 2: Build the React Frontend
# ==========================================
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
# Copy package files and install production dependencies
COPY healthcare-frontend/package*.json .
RUN npm install
# Copy frontend source files and build the static assets
COPY healthcare-frontend/ .
RUN npm run build

# ==========================================
# STAGE 3: Final Production Runner Environment
# ==========================================
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy the compiled JAR file from the backend builder stage
COPY --from=backend-builder /app/backend/target/*.jar app.jar

# Copy the static production frontend build assets into the runner
COPY --from=frontend-builder /app/frontend/dist ./frontend-dist

# Expose the essential gateway/service ports for full-stack communication
EXPOSE 8080

# Environment variables setup for database connectivity
ENV DATABASE_URL=supabase_cloud_db_placeholder

# Execute the application layer on container startup
ENTRYPOINT ["java", "-jar", "app.jar"]
