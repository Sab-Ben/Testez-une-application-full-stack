package com.openclassrooms.starterjwt.controllers;


import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.CoreMatchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class TeacherControllerTest {

    @Autowired
    MockMvc mockMvc;

    private String token;

    @BeforeAll
    public void testGetToken() throws Exception {
        String email = "yoga@studio.com";
        String password = "test!1234";
        String requestBody = "{\"email\": \"" + email + "\", \"password\": \"" + password + "\"}";

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andReturn();

        token = "Bearer " + JsonPath.read(result.getResponse().getContentAsString(), "$.token");
    }

    @Test
    public void testGetAllTeachers() throws Exception {
        mockMvc.perform(get("/api/teacher/").header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].lastName", is("DELAHAYE")) );
    }

    @Test
    public void testGetOneTeacherIfExisting() throws Exception {
        mockMvc.perform(get("/api/teacher/1").header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("lastName", is("DELAHAYE")) );
    }

    @Test
    public void testRespondNotFoundIfTeacherNonExisting() throws Exception {
        mockMvc.perform(get("/api/teacher/154").header("Authorization", token)).andExpect(status().isNotFound());
    }

    @Test
    public void testSendBadRequestIfIdWithWrongFormat() throws Exception {
        mockMvc.perform(get("/api/teacher/notanumber").header("Authorization", token)).andExpect(status().isBadRequest());
    }

}
