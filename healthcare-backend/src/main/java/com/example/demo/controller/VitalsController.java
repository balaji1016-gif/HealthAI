package com.example.demo.controller;

import com.example.demo.model.Vitals;
import com.example.demo.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vitals")
@CrossOrigin(origins = "https://health-ai-flame.vercel.app", allowCredentials = "true")
public class VitalsController {

    @Autowired
    private PdfService pdfService;

    // This is the specific method to update/add
    @PostMapping("/generate-pdf")
    public ResponseEntity<byte[]> downloadHealthReport(@RequestBody List<Vitals> vitalsList) {
        
        // 1. Call the service to generate the bytes
        byte[] pdfBytes = pdfService.generateHealthReport(vitalsList);
        
        // 2. Set the headers so the browser knows it's a PDF file
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "Health_Report.pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        // 3. Return the byte array to the frontend
        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
