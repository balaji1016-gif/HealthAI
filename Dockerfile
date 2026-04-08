# STAGE 1: Build the JAR using Maven
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app
# Copy the pom and source
COPY pom.xml .
COPY src ./src
# Build the application (the tests are already deleted, but we skip just in case)
RUN mvn clean package -Dmaven.test.skip=true

# STAGE 2: Create the final small image
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Copy only the built JAR from the first stage
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
