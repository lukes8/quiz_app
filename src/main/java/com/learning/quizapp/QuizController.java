package com.learning.quizapp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.net.InetAddress;
import java.net.UnknownHostException;

@RestController(value = "rest/quiz")
public class QuizController {

    @RequestMapping(method = RequestMethod.GET)
    public String findAll() {
        return "todo";
    }

}
