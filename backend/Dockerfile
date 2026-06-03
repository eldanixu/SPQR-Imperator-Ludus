FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

# Install bash/curl because it might be needed for standard maven wrapper script execution
RUN apt-get update && apt-get install -y bash curl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies (go-offline or resolve-plugins)
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

COPY src src

EXPOSE 8080

ENV JAVA_OPTS="-Xms128m -Xmx256m -XX:+UseSerialGC"

CMD ["sh", "-c", "./mvnw spring-boot:run -Dspring-boot.run.jvmArguments=\"$JAVA_OPTS\""]
