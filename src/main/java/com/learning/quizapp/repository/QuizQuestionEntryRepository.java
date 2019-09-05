package com.learning.quizapp.repository;

import com.learning.quizapp.entity.QuizQuestionEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizQuestionEntryRepository extends JpaRepository<QuizQuestionEntry, Long> {
}
