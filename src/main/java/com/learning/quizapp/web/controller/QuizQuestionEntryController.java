package com.learning.quizapp.web.controller;

import com.google.gson.Gson;
import com.learning.quizapp.entity.QuizQuestionEntry;
import com.learning.quizapp.repository.QuizQuestionEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rest/quiz-question")
public class QuizQuestionEntryController {

    @Autowired
    private QuizQuestionEntryRepository quizQuestionEntryRepository;

    @RequestMapping(method = RequestMethod.GET)
    public String findAll() {

        List<QuizQuestionEntry> all = quizQuestionEntryRepository.findAll();
        Gson gson = new Gson();
        String json = gson.toJson(all);
        return json;
    }

    @RequestMapping(method = RequestMethod.GET, value = "/{id}")
    public String findById(@PathVariable Long id) {

        Optional<QuizQuestionEntry> all = quizQuestionEntryRepository.findById(id);
        if (all.isPresent()) {
            Gson gson = new Gson();
            String json = gson.toJson(all.get());
            return json;
        }
        return "NONE";
    }

    @RequestMapping(method = RequestMethod.POST)
    public String create(@RequestBody QuizQuestionEntry model) {

        QuizQuestionEntry save = null;
        if (model != null) {
            save = quizQuestionEntryRepository.save(model);
        }

        if (save != null) {
            Gson gson = new Gson();
            String json = gson.toJson(save);
            return json;
        }
        return "NONE";
    }

}
