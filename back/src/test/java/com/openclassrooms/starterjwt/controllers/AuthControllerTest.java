package com.openclassrooms.starterjwt.controllers;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.AfterAll;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class AuthControllerIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    public void login() throws Exception {
        String email = "yoga@studio.com";
        String password = "test!1234";
        String requestBody = "{\"email\": \"" + email + "\", \"password\": \"" + password + "\"}";

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk());
    }

    @Test
    public void refuseToLoginWithInvalidInformation() throws Exception {
        String email = "notauser@test.fr";
        String password = "invalidinfo";
        String requestBody = "{\"email\": \"" + email + "\", \"password\": \"" + password + "\"}";

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void register() throws Exception {
        String email =  "test@test.com";
        String password ="test!1234";
        String lastName  ="admin";
        String firstName  ="admin";
        String requestBody = "{" +
                "\"email\": \"" + email + "\"," +
                "\"password\": \"" + password + "\"," +
                "\"firstName\": \"" + firstName + "\"," +
                "\"lastName\": \"" + lastName + "\"" +
                "}";

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("message", is("User registered successfully!")));
    }

    @Test
    public void notRegisterIfUserExisting() throws Exception {
        String email =  "yoga@studio.com";
        String password = "test!1234";
        String lastName = "admin";
        String firstName = "admin";
        String requestBody = "{" +
                "\"email\": \"" + email + "\"," +
                "\"password\": \"" + password + "\"," +
                "\"firstName\": \"" + firstName + "\"," +
                "\"lastName\": \"" + lastName + "\"" +
                "}";

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }


    @AfterAll
    public void cleanup() throws Exception{
        String email =  "test@test.com";
        String password ="test!1234";
        String loginRequest = "{\"email\": \"" + email + "\", \"password\": \"" + password + "\"}";

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginRequest))
                .andReturn();

        String content = result.getResponse().getContentAsString();
        String token = JsonPath.read(content, "$.token");
        int id = JsonPath.read(content, "$.id");
        mockMvc.perform(delete("/api/user/"+id).header("Authorization", "Bearer " + token)).andExpect(status().isOk());
    }
}
