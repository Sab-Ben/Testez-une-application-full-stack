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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class SessionControllerTest {

    @Autowired
    MockMvc mockMvc;

    private String token;

    @BeforeAll
    public void getToken() throws Exception {
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
    public void getAllSessions() throws Exception {
        mockMvc.perform(get("/api/session/").header("Authorization",  token)).andExpect(status().isOk());
    }

    @Test
    public void getSession() throws Exception {
        mockMvc.perform(get("/api/session/1").header("Authorization",  token)).andExpect(status().isOk());
    }

    @Test
    public void throwBadRequestExceptionIfIdHasWrongFormat() throws Exception {
        mockMvc.perform(get("/api/session/Invalid").header("Authorization",  token)).andExpect(status().isBadRequest());
    }

    @Test
    public void throwNotFoundExceptionIfNonExistingSession() throws Exception {
        mockMvc.perform(get("/api/session/0").header("Authorization",  token)).andExpect(status().isNotFound());
    }

    @Test
    public void createSession() throws Exception {
        String name = "Session Musculation";
        long teacherID = 1L;
        String description = "Rendez vous à la salle à 10h30";
        String date = "2012-01-01";

        String body = "{" +
                "\"name\": \"" + name + "\"," +
                "\"teacher_id\":" + teacherID + "," +
                "\"description\":\""+ description + "\"," +
                "\"date\":\"" + date + "\"}";

        mockMvc.perform(post("/api/session/")
                        .contentType(MediaType.APPLICATION_JSON).content(body)
                        .header("Authorization",  token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("name", is(name)));
    }

    @Test
    public void updateSession() throws Exception {
        String name = "Session Musculation Jambes";
        long teacherID = 1L;
        String description = "Rendez vous à la salle à 10h30";
        String date = "2012-01-01";

        String body = "{" +
                "\"name\": \"" + name + "\"," +
                "\"teacher_id\":" + teacherID + "," +
                "\"description\":\""+ description + "\"," +
                "\"date\":\"" + date + "\"}";

        mockMvc.perform(put("/api/session/2")
                        .header("Authorization",  token)
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("name", is(name)));
    }


    @Test
    public void throwAnExceptionWhenUpdatingWithWrongIdFormat() throws Exception {
        String name = "Session Musculation Jambes";
        long teacherID = 1L;
        String description = "Rendez vous à la salle à 10h30";
        String date = "2012-01-01";

        String body = "{" +
                "\"name\": \"" + name + "\"," +
                "\"teacher_id\":" + teacherID + "," +
                "\"description\":\""+ description + "\"," +
                "\"date\":\"" + date + "\"}";

        mockMvc.perform(put("/api/session/Invalid")
                        .header("Authorization",  token)
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void deleteIfSessionExisting() throws Exception {
        String name = "Test delete session";
        long teacherID = 1L;
        String description = "Test delete session";
        String date = "2012-01-01";

        String body = "{" +
                "\"name\": \"" + name + "\"," +
                "\"teacher_id\":" + teacherID + "," +
                "\"description\":\""+ description + "\"," +
                "\"date\":\"" + date + "\"}";

        // Create a test session and get the id to then delete it
        MvcResult result =  mockMvc.perform(post("/api/session/")
                        .contentType(MediaType.APPLICATION_JSON).content(body)
                        .header("Authorization",  token))
                .andReturn();

        int id = JsonPath.read(result.getResponse().getContentAsString(), "$.id");

        mockMvc.perform(delete("/api/session/"+ id).header("Authorization",  token)).andExpect(status().isOk());
    }

    @Test
    public void notDeleteIfSessionNotExisting() throws Exception {
        mockMvc.perform(delete("/api/session/0").header("Authorization",  token)).andExpect(status().isNotFound());
    }

    @Test
    public void itShouldThrowAnExceptionWhenDeletingWithWrongIdFormat() throws Exception {
        mockMvc.perform(delete("/api/session/notvalid").header("Authorization",  token)).andExpect(status().isBadRequest());
    }

    @Test
    public void participate() throws Exception {
        mockMvc.perform(post("/api/session/1/participate/1").header("Authorization",  token)).andExpect(status().isOk());
    }

    @Test
    public void throwAnExceptionWhenParticipatingWithWrongIdFormat() throws Exception {
        mockMvc.perform(post("/api/session/notvalid/participate/1").header("Authorization",  token)).andExpect(status().isBadRequest());
    }

    @Test
    public void noLongerParticipate() throws Exception {
        mockMvc.perform(delete("/api/session/1/participate/1").header("Authorization",  token)).andExpect((status().isOk()));
    }

    @Test
    public void throwAnExceptionWhenNoLongerParticipatingWithWrongIdFormat() throws Exception {
        mockMvc.perform(delete("/api/session/notValid/participate/1").header("Authorization",  token)).andExpect(status().isBadRequest());
    }
}
