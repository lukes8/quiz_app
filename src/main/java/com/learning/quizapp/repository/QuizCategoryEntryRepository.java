package com.learning.quizapp.repository;

import com.learning.quizapp.entity.QuizCategoryEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizCategoryEntryRepository extends JpaRepository<QuizCategoryEntry, Long> {
}
