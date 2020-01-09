package com.learning.quizapp.service.impl;

import com.google.gson.Gson;
import com.learning.quizapp.entity.QuizQuestionEntry;
import com.learning.quizapp.repository.QuizQuestionEntryRepository;
import com.learning.quizapp.service.QuizQuestionEntryService;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.*;

@Service
public class QuizQuestionEntryServiceImpl implements QuizQuestionEntryService {

    @Autowired
    private QuizQuestionEntryRepository quizQuestionEntryRepository;

    @RequestMapping(method = RequestMethod.GET)
    public String findAll() {

        List<QuizQuestionEntry> all = quizQuestionEntryRepository.findAll();
        Gson gson = new Gson();
        String json = gson.toJson(all);
        return json;
    }

    @Override
    public InputStream exportQuizQuestionExcel() {

        //Blank workbook
        HSSFWorkbook workbook = new HSSFWorkbook();

        //Create a blank sheet
        HSSFSheet sheet = workbook.createSheet("Quiz Question Entry Data");

        //This data needs to be written (Object[])
        List<QuizQuestionEntry> all = quizQuestionEntryRepository.findAll();
        Map<String, Object[]> data = new TreeMap<String, Object[]>();
        int rownum = 1;
        if (all != null) {
            data.put(rownum + "", new Object[]{"ID", "CATEGORY", "QUESTION", "CORRECT_ANSWER", "POSSIBLE_ANSWERS", "IMAGE_URL"});
            for (QuizQuestionEntry q : all) {
                data.put(++rownum + "", new Object[]{q.getId(), q.getCategoryId(), q.getQuestion(), q.getCorrectAnswer(), q.getPossibleAnswers(), q.getImageUrl()});
            }
        }

        //Iterate over data and write to sheet
        Set<String> keyset = data.keySet();
        rownum = 0;
        for (String key : keyset) {
            Row row = sheet.createRow(rownum++);
            Object[] objArr = data.get(key);
            int cellnum = 0;
            for (Object obj : objArr) {
                Cell cell = row.createCell(cellnum++);
                if (obj instanceof String)
                    cell.setCellValue((String) obj);
                else if (obj instanceof Integer)
                    cell.setCellValue((Integer) obj);
                else if (obj instanceof Long)
                    cell.setCellValue((Long) obj);
            }
        }
        try {
            //TODO outputstream
//            OutputStreamWriter out = new OutputStreamWriter(new File("quiz_question_entry_data.xls"));
//            workbook.write(out);
//            out.close();
//            System.out.println("written successfully on disk.");

            //Write the workbook in file system
//            FileOutputStream out = new FileOutputStream(new File("quiz_question_entry_data.xls"));
//            workbook.write(out);
//            out.close();
//            System.out.println("written successfully on disk.");
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    @Override
    public Long importQuizQuestionExcel(Boolean cleanupData) throws Exception {

        try {
            FileInputStream file = new FileInputStream(new File("quiz_question_entry_data.xls"));

            List<QuizQuestionEntry> all = new ArrayList<>();

            //Create Workbook instance holding reference to .xlsx file
            HSSFWorkbook workbook = new HSSFWorkbook(file);

            //Get first/desired sheet from the workbook
            HSSFSheet sheet = workbook.getSheetAt(0);

            //Iterate through each rows one by one
            Iterator<Row> rowIterator = sheet.iterator();
            Long newId = getNewId();
            int rownum = 0;
            int colnum = 0;
            long id = 0;
            String str = "";
            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                //For each row, iterate through all the columns
                Iterator<Cell> cellIterator = row.cellIterator();
                colnum = 0;
                QuizQuestionEntry q = new QuizQuestionEntry();

                if (rownum++ > 0) {

                    while (cellIterator.hasNext()) {
                        Cell cell = cellIterator.next();
                        //Check the cell type and format accordingly
                        switch (cell.getCellType()) {
                            case NUMERIC:
                                id = (long) cell.getNumericCellValue();
                                break;
                            case STRING:
                                str = cell.getStringCellValue();
                                break;
                        }
                        switch (colnum++) {
                            case 0:
                                q.setId(newId++);
                                break;
                            case 1:
                                q.setCategoryId(id);
                                break;
                            case 2:
                                q.setQuestion(str);
                                break;
                            case 3:
                                q.setCorrectAnswer(str);
                                break;
                            case 4:
                                q.setPossibleAnswers(str);
                                break;
                            case 5:
                                q.setImageUrl(str);
                                break;
                            default:
                                throw new Exception("COL CELL NUM INVALID!");
                        }

                        all.add(q);
                    }
                }
            }

            if (all.size() != 0) {
                if (cleanupData == true) {
                    quizQuestionEntryRepository.deleteAll();
                    System.out.println("data cleanup");
                }
                quizQuestionEntryRepository.saveAll(all);
                quizQuestionEntryRepository.flush();
            }
            file.close();
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception(e);
        }
        return 1L;
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
