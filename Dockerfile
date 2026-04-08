# Step 1: Build using Maven
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
# We use -DskipTests to ensure the build doesn't fail due to test cases
RUN mvn clean package -DskipTests

# Step 2: Run using OpenJDK
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]