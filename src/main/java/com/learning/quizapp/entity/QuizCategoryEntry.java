package com.learning.quizapp.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity(name = "QUIZ_CATEGORY_ENTRY")
public class QuizCategoryEntry {

    @Id
    private Long id;
    private String name;
    private String description;

    public QuizCategoryEntry() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
