FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Install bash/curl because alpine needs them for standard maven wrapper script execution
RUN apk add --no-cache bash curl ca-certificates

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies (go-offline or resolve-plugins)
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

COPY src src

EXPOSE 8080

CMD ["./mvnw", "spring-boot:run"]
