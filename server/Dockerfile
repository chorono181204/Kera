FROM maven:3.8.4-openjdk-17
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests
EXPOSE 8386
CMD ["java", "-jar", "target/server-0.0.1-SNAPSHOT.jar"] 