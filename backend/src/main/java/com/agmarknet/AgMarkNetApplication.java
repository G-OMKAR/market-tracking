package com.agmarknet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AgMarkNetApplication {
    public static void main(String[] args) {
        SpringApplication.run(AgMarkNetApplication.class, args);
    }
}
