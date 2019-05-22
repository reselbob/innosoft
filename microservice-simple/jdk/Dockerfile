FROM phusion/baseimage:0.9.17

RUN echo "deb http://archive.ubuntu.com/ubuntu bionic main universe" > /etc/apt/sources.list

RUN apt-get -y update

ENV JAVA_VER 8
ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64/jre/bin/java

RUN echo 'deb http://ppa.launchpad.net/webupd8team/java/ubuntu bionic main' >> /etc/apt/sources.list && \
    echo 'deb-src http://ppa.launchpad.net/webupd8team/java/ubuntu bionic main' >> /etc/apt/sources.list && \
    apt-key adv --keyserver keyserver.ubuntu.com --recv-keys C2518248EEA14886 && \
    apt-get update && \
    apt-get install -y openjdk-8-jdk && \
    apt-get clean

RUN update-alternatives --config java

RUN echo "export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64/jre/bin/java" >> ~/.bashrc

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

CMD ["/sbin/my_init"]

