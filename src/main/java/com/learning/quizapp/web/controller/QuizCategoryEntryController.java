package com.learning.quizapp.web.controller;

import com.google.gson.Gson;
import com.learning.quizapp.entity.QuizCategoryEntry;
import com.learning.quizapp.repository.QuizCategoryEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rest/quiz-category")
public class QuizCategoryEntryController {

    @Autowired
    private QuizCategoryEntryRepository quizCategoryEntryRepository;

    @RequestMapping(method = RequestMethod.GET)
    public String findAll() {

        List<QuizCategoryEntry> all = quizCategoryEntryRepository.findAll();
        Gson gson = new Gson();
        String json = gson.toJson(all);
        return json;
    }

    @RequestMapping(method = RequestMethod.GET, value = "/{id}")
    public String findById(@PathVariable Long id) {

        Optional<QuizCategoryEntry> all = quizCategoryEntryRepository.findById(id);
        if (all.isPresent()) {
            Gson gson = new Gson();
            String json = gson.toJson(all.get());
            return json;
        }
        return "NONE";
    }

    @RequestMapping(method = RequestMethod.POST)
    public String create(@RequestBody QuizCategoryEntry model) {

        QuizCategoryEntry save = null;
        if (model != null) {
            save = quizCategoryEntryRepository.save(model);
        }

        if (save != null) {
            Gson gson = new Gson();
            String json = gson.toJson(save);
            return json;
        }
        return "NONE";
    }

}