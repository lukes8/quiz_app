package com.learning.quizapp.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity(name = "QUIZ_CATEGORY_ENTRY")
public class QuizCategoryEntry {

    @Id
    private Long id;
    private String name;
    private String description;
}
