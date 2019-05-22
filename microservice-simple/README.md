This project demonstrates how to create a Docker image that uses a OpenJDK 8 image. Then a java class is injected into a container based on 
thatimage at runtime using the command line. Finally the class is complied and invoked.

Then, another image is created. This  image is created using previously created image as well as added Maven. Finally, the Maven image is built
into a container and run.
