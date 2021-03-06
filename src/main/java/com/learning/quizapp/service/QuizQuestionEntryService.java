package com.learning.quizapp.service;

import java.io.InputStream;

public interface QuizQuestionEntryService {

    InputStream exportQuizQuestionExcel();

    Long importQuizQuestionExcel(Boolean cleanupData) throws Exception;
}
