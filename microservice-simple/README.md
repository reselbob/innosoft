This project demonstrates how to create a Docker image that uses a OpenJDK 8 image. Then a java class is injected into a container based on 
thatimage at runtime using the command line. Finally the class is complied and invoked.

Then, another image is created. This  image is created using previously created image as well as added Maven. Finally, the Maven image is built
into a container and run.

## Build the Java container with embedded code

**Step 1:** `cd jdk`

**Step 2:** `docker build -t demo/open-jdk:8 .`

**Step 3:** `docker run --rm -v $PWD/app:/app -w /app demo/open-jdk:8 javac Main.java`

**Step 4:** `docker run --rm -v $PWD/app:/app -w /app demo/open-jdk:8 java Main`


## Run the second container that injects Maven configuration code


**Step 5:** `docker build -f Dockerfile-maven -t demo/maven:3.3-jdk-8 .`

**Step 6:** `cd app`

**Step 7:** `docker run -it --rm -v "$PWD":/app -w /app demo/maven:3.3-jdk-8 mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=my-app -DarchetypeArtifactId=maven-archetype-quickstart -Dinte`

**Step 8:** `docker run -it --rm -v "$PWD"/my-app:/app -w /app demo/maven:3.3-jdk-8 mvn package`

**Step 9:** `docker run -it --rm -v "$PWD"/my-app:/app -w /app demo/maven:3.3-jdk-8 java -cp target/my-app-1.0-SNAPSHOT.jar com.mycompany.app.App`

