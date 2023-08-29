package com.openclassrooms.starterjwt.security.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class UserDetailsServiceImplTest {

    @Mock
    UserRepository userRepository;
    User user;
    UserDetailsServiceImpl userDetailsService;

    @BeforeEach
    void setUp() {
        userDetailsService = new UserDetailsServiceImpl(userRepository);
    }

    @Test
    void loadUserByUsername() {
        //Given
        user = new User();
        user.setEmail("sab_ben@gmail.com");
        user.setFirstName("Sab");
        user.setLastName("Ben");
        user.setPassword("password");
        user.setAdmin(true);
        when(userRepository.findByEmail("sab_ben@gmail.com")).thenReturn(java.util.Optional.of(user));
        //When
        UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsService.loadUserByUsername("sab_ben@gmail.com");
        //Then
        assertEquals(userDetails.getUsername(), user.getEmail());
        assertEquals(userDetails.getFirstName(), user.getFirstName());
        assertEquals(userDetails.getLastName(), user.getLastName());
        assertEquals(userDetails.getPassword(), user.getPassword());
    }

    @Test
    void loadUserByUsername_KO() {
        assertThrows(UsernameNotFoundException.class, () -> {
            userDetailsService.loadUserByUsername("sab_ben@gmail.com");
        });
    }


}