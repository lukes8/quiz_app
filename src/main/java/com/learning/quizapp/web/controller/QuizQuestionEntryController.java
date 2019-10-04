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
@CrossOrigin
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
        if (model == null) {
            return "model is null!";
        }

        if (model.getId() == null) {
            model.setId(getNewId());
        }

        Optional<QuizQuestionEntry> entry = quizQuestionEntryRepository.findById(model.getId());
        if (entry.isPresent()) {
            return "Question already exists!";
        }

        save = quizQuestionEntryRepository.save(model);
        if (save == null) {
            return "NONE";
        }

        Gson gson = new Gson();
        String json = gson.toJson(save);
        return json;
    }

    private Long getNewId() {
        List<QuizQuestionEntry> all = quizQuestionEntryRepository.findAll();
        Long idMax = 0L;
        for (QuizQuestionEntry quizQuestionEntry : all) {
            if (quizQuestionEntry.getId() > idMax) {
                idMax = quizQuestionEntry.getId();
            }
        }
        return idMax + 1;
    }
}
