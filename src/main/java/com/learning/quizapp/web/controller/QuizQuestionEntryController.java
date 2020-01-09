package com.learning.quizapp.web.controller;

import com.google.gson.Gson;
import com.learning.quizapp.entity.QuizQuestionEntry;
import com.learning.quizapp.repository.QuizQuestionEntryRepository;
import com.learning.quizapp.service.QuizQuestionEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rest/quiz-question")
@CrossOrigin
public class QuizQuestionEntryController {

    @Autowired
    private QuizQuestionEntryRepository quizQuestionEntryRepository;

    @Autowired
    private QuizQuestionEntryService quizQuestionEntryService;

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

    @RequestMapping(method = RequestMethod.GET, value = "/delete/{id}")
    public String delete(@PathVariable Long id) throws Exception {

        Optional<QuizQuestionEntry> entryOptional = quizQuestionEntryRepository.findById(id);
        if (!entryOptional.isPresent()) {
            throw new Exception("Cannot be deleted. Entry does not exist.");
        }
        quizQuestionEntryRepository.deleteById(id);
        return "DELETED";
    }

    @RequestMapping(method = RequestMethod.GET, value = "/importExcel/{cleanupData}")
    public String importExcel(@PathVariable Boolean cleanupData) throws Exception {
        Long res = quizQuestionEntryService.importQuizQuestionExcel(cleanupData);
        return "DONE" + res;
    }

    @RequestMapping(method = RequestMethod.GET, value = "/exportExcel")
    public ResponseEntity<InputStreamResource> exportExcel() {
        InputStream res = quizQuestionEntryService.exportQuizQuestionExcel();
        String filename = "test.csv";
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
        headers.add("Pragma", "no-cache");
        headers.add("Expires", "0");
        headers.add("Content-Disposition", "attachment; filename=" + filename);
        headers.add("Set-Cookie", "fileDownload=true; path=/");
        MediaType mediaType = MediaType.parseMediaType("text/csv");
        return ((ResponseEntity.BodyBuilder) ResponseEntity.ok().headers(headers)).contentType(mediaType).body(new InputStreamResource(res));
    }
//    @RequestMapping(method = RequestMethod.GET, value = "/exportExcel")
//    public String exportExcel() {
//        InputStream res = quizQuestionEntryService.exportQuizQuestionExcel();
//        return "DONE";
//    }

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
