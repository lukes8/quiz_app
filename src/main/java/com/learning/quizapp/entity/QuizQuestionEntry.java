package com.learning.quizapp.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity(name = "QUIZ_QUESTION_ENTRY")
public class QuizQuestionEntry {

    @Id
    private Long questionId;
    private Long categoryId;
    private String question;
    private String correctAnswer;
}
